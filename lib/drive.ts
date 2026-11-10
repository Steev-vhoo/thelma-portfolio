import { site } from "@/content/site";

const siteDrive = site.drive;

// Reads publicly shared Google Drive folders with an API key.
// Projects: sub-folders become categories; files directly in the root fall under "More".
// Videos: every video file in the videos folder (and its sub-folders).

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  modifiedTime: string;
  webViewLink: string;
  thumbnail: string;
  category: string;
  kind: string;
};

export type DriveVideo = {
  id: string;
  title: string;
  description?: string;
  date: string;
  duration?: string;
  thumbnail: string;
  embedUrl: string;
  url: string;
  portrait: boolean;
};

export type DriveResult =
  | { status: "ok"; files: DriveFile[]; categories: string[]; folderUrl: string }
  | { status: "unconfigured" }
  | { status: "error"; message: string; code: string; folderUrl?: string };

export type VideoResult =
  | { status: "ok"; videos: DriveVideo[]; folderUrl: string }
  | { status: "unconfigured" }
  | { status: "error"; message: string; code: string; folderUrl?: string };

const API = "https://www.googleapis.com/drive/v3/files";
const FOLDER = "application/vnd.google-apps.folder";
const REVALIDATE = 60 * 5; // re-ask Drive at most every 5 minutes
const SHORTCUT = "application/vnd.google-apps.shortcut";
const MAX_DEPTH = 3; // how many folder levels below the chosen folder are searched
const FIELDS = "id,name,mimeType,description,modifiedTime,createdTime,webViewLink,videoMediaMetadata,shortcutDetails";

type RawFile = {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  modifiedTime: string;
  createdTime?: string;
  webViewLink?: string;
  videoMediaMetadata?: { width?: number; height?: number; durationMillis?: string };
  shortcutDetails?: { targetId?: string; targetMimeType?: string };
};

type Item = { file: RawFile; folder: string };

/** `code` is safe to show (HTTP status + Google's reason, e.g. "403 API_KEY_SERVICE_BLOCKED"). */
class DriveError extends Error {
  code: string;
  constructor(code: string, detail: string) {
    super(`Drive API ${code}: ${detail}`);
    this.code = code;
  }
}
const codeOf = (err: unknown) => (err instanceof DriveError ? err.code : "network");

async function driveGet<T>(path: string, params: Record<string, string>, key: string): Promise<T> {
  const qs = new URLSearchParams({ ...params, key, supportsAllDrives: "true" });
  const res = await fetch(`${API}${path}?${qs}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) {
    const body = await res.text();
    let reason = "";
    try {
      const j = JSON.parse(body);
      reason = j?.error?.details?.[0]?.reason || j?.error?.errors?.[0]?.reason || j?.error?.status || "";
    } catch {}
    throw new DriveError(`${res.status}${reason ? ` ${reason}` : ""}`, body.slice(0, 300));
  }
  return (await res.json()) as T;
}

/** Every item directly inside a folder (all pages), with shortcuts swapped for what they point to. */
async function listChildren(folderId: string, key: string): Promise<RawFile[]> {
  const files: RawFile[] = [];
  let pageToken = "";
  do {
    const data = await driveGet<{ files?: RawFile[]; nextPageToken?: string }>(
      "",
      {
        q: `'${folderId}' in parents and trashed = false`,
        pageSize: "1000",
        orderBy: "modifiedTime desc",
        fields: `nextPageToken,files(${FIELDS})`,
        includeItemsFromAllDrives: "true",
        ...(pageToken ? { pageToken } : {}),
      },
      key,
    );
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);

  return Promise.all(
    files.map(async (f) => {
      const target = f.mimeType === SHORTCUT ? f.shortcutDetails?.targetId : undefined;
      if (!target) return f;
      try {
        const real = await driveGet<RawFile>(`/${target}`, { fields: FIELDS }, key);
        return { ...real, name: f.name || real.name };
      } catch {
        return f; // target not shared publicly — leave it out (it isn't a recognised type)
      }
    }),
  );
}

/**
 * Files in a folder and its sub-folders (up to MAX_DEPTH levels).
 * `folder` is the top-level sub-folder a file sits under ("" for files at the root) — used as the category.
 */
async function listTree(folderId: string, key: string): Promise<{ items: Item[]; folders: string[] }> {
  const items: Item[] = [];
  const seen = new Set<string>([folderId]);

  async function walk(id: string, category: string, depth: number): Promise<RawFile[]> {
    const children = await listChildren(id, key);
    const subfolders = children.filter((c) => c.mimeType === FOLDER && !seen.has(c.id));
    subfolders.forEach((c) => seen.add(c.id));
    children.filter((c) => c.mimeType !== FOLDER).forEach((file) => items.push({ file, folder: category }));
    if (depth < MAX_DEPTH) {
      await Promise.all(subfolders.map((sf) => walk(sf.id, category || sf.name, depth + 1)));
    }
    return subfolders;
  }

  const top = await walk(folderId, "", 0);
  return { items, folders: top.map((f) => f.name) };
}

const isVideo = (f: RawFile) => f.mimeType.startsWith("video/");
const thumb = (id: string, w = 800) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;

function kindOf(mime: string): string {
  if (mime.includes("presentation")) return "Slides";
  if (mime.includes("document") || mime.includes("word")) return "Doc";
  if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("csv")) return "Sheet";
  if (mime === "application/pdf") return "PDF";
  if (mime.startsWith("image/")) return "Image";
  if (mime.startsWith("video/")) return "Video";
  return "File";
}

/** "ASSIGNMENTS" → "Assignments"; mixed-case text is left alone. */
function tidyCase(text: string) {
  if (text !== text.toUpperCase() || !/[A-Z]{2}/.test(text)) return text;
  return text.toLowerCase().replace(/\b([a-z])/g, (c) => c.toUpperCase());
}

function cleanName(name: string) {
  const base = name
    .replace(/\.(pdf|pptx?|docx?|xlsx?|png|jpe?g|heic|webp|mp4|mov|m4v|webm|avi|mkv)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return tidyCase(base);
}

function formatDuration(ms?: string) {
  if (!ms) return undefined;
  const total = Math.round(Number(ms) / 1000);
  if (!total) return undefined;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

function toFile(f: RawFile, category: string): DriveFile {
  return {
    id: f.id,
    name: cleanName(f.name),
    mimeType: f.mimeType,
    description: f.description,
    modifiedTime: f.modifiedTime,
    webViewLink: f.webViewLink ?? `https://drive.google.com/file/d/${f.id}/view`,
    thumbnail: thumb(f.id), // public endpoint — works for files shared "anyone with the link"
    category,
    kind: kindOf(f.mimeType),
  };
}

function toVideo(f: RawFile): DriveVideo {
  const meta = f.videoMediaMetadata;
  return {
    id: f.id,
    title: cleanName(f.name),
    description: f.description,
    date: f.createdTime ?? f.modifiedTime,
    duration: formatDuration(meta?.durationMillis),
    thumbnail: thumb(f.id, 1280),
    embedUrl: `https://drive.google.com/file/d/${f.id}/preview`,
    url: f.webViewLink ?? `https://drive.google.com/file/d/${f.id}/view`,
    portrait: !!(meta?.width && meta?.height && meta.height > meta.width),
  };
}

/** Accepts a bare ID, an ID with "?usp=sharing" stuck on, or a full folder URL. */
function folderIdFrom(value?: string) {
  if (!value) return undefined;
  const v = value.trim();
  const fromUrl = v.match(/\/folders\/([\w-]+)/) || v.match(/[?&]id=([\w-]+)/);
  const id = (fromUrl ? fromUrl[1] : v.split(/[?#/\s]/)[0]).trim();
  return id || undefined;
}

function config() {
  const key = process.env.GOOGLE_DRIVE_API_KEY?.trim();
  const projects = folderIdFrom(process.env.GOOGLE_DRIVE_FOLDER_ID);
  const videos = folderIdFrom(process.env.GOOGLE_DRIVE_VIDEOS_FOLDER_ID);
  return { key, projects, videos };
}

const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${id}`;

export async function getDriveProjects(): Promise<DriveResult> {
  const { key, projects } = config();
  if (!projects || !key) return { status: "unconfigured" };

  try {
    const { items, folders } = await listTree(projects, key);
    // Videos always live in the Videos section; folders listed in site.drive.hideFolders are skipped.
    const hidden = new Set(siteDrive.hideFolders.map((f) => f.toLowerCase()));
    const kept = items.filter((i) => !isVideo(i.file) && !hidden.has(i.folder.toLowerCase()));
    const files = kept.map((i) => toFile(i.file, i.folder ? tidyCase(i.folder) : "More"));
    const categories = [...folders.map(tidyCase), "More"].filter((c) => files.some((f) => f.category === c));
    return { status: "ok", files, categories, folderUrl: folderUrl(projects) };
  } catch (err) {
    console.error("[drive:projects]", err);
    return { status: "error", message: "Couldn't reach Google Drive right now.", code: codeOf(err), folderUrl: folderUrl(projects) };
  }
}

export async function getDriveVideos(limit = 6): Promise<VideoResult> {
  const { key, projects, videos } = config();
  const source = videos || projects; // dedicated videos folder, or videos found in the projects folder
  if (!source || !key) return { status: "unconfigured" };

  try {
    const { items } = await listTree(source, key);
    const list = items
      .map((i) => i.file)
      .filter(isVideo)
      .sort((a, b) => (b.createdTime ?? b.modifiedTime).localeCompare(a.createdTime ?? a.modifiedTime))
      .slice(0, limit)
      .map(toVideo);
    return { status: "ok", videos: list, folderUrl: folderUrl(source) };
  } catch (err) {
    console.error("[drive:videos]", err);
    return { status: "error", message: "Couldn't load videos right now.", code: codeOf(err), folderUrl: folderUrl(source) };
  }
}

/** Non-secret one-liner for the page's data-drive attribute — handy when checking a deploy. */
export function describe(r: DriveResult | VideoResult): string {
  if (r.status === "unconfigured") return "unconfigured";
  if (r.status === "error") return `error ${r.code}`;
  return `ok ${"files" in r ? r.files.length : r.videos.length}`;
}
