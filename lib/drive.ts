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
  | { status: "error"; message: string; folderUrl?: string };

export type VideoResult =
  | { status: "ok"; videos: DriveVideo[]; folderUrl: string }
  | { status: "unconfigured" }
  | { status: "error"; message: string; folderUrl?: string };

const API = "https://www.googleapis.com/drive/v3/files";
const FOLDER = "application/vnd.google-apps.folder";
const REVALIDATE = 60 * 30; // refresh every 30 minutes

type RawFile = {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  modifiedTime: string;
  createdTime?: string;
  webViewLink?: string;
  videoMediaMetadata?: { width?: number; height?: number; durationMillis?: string };
};

type Item = { file: RawFile; folder: string };

async function listChildren(folderId: string, key: string): Promise<RawFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    key,
    pageSize: "200",
    orderBy: "modifiedTime desc",
    fields: "files(id,name,mimeType,description,modifiedTime,createdTime,webViewLink,videoMediaMetadata)",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });
  const res = await fetch(`${API}?${params}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Drive API ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as { files?: RawFile[] };
  return data.files ?? [];
}

/** Root files (folder = "") plus files one level down (folder = sub-folder name). */
async function listTree(folderId: string, key: string): Promise<{ items: Item[]; folders: string[] }> {
  const root = await listChildren(folderId, key);
  const subfolders = root.filter((f) => f.mimeType === FOLDER);
  const items: Item[] = root.filter((f) => f.mimeType !== FOLDER).map((file) => ({ file, folder: "" }));
  const nested = await Promise.all(
    subfolders.map(async (sf) =>
      (await listChildren(sf.id, key)).filter((c) => c.mimeType !== FOLDER).map((file) => ({ file, folder: sf.name })),
    ),
  );
  nested.forEach((group) => items.push(...group));
  return { items, folders: subfolders.map((f) => f.name) };
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

function cleanName(name: string) {
  return name.replace(/\.(pdf|pptx?|docx?|xlsx?|png|jpe?g|webp|mp4|mov|m4v|webm|avi|mkv)$/i, "").replace(/[_-]+/g, " ").trim();
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

function config() {
  const key = process.env.GOOGLE_DRIVE_API_KEY;
  const projects = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const videos = process.env.GOOGLE_DRIVE_VIDEOS_FOLDER_ID;
  return { key, projects, videos };
}

const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${id}`;

export async function getDriveProjects(): Promise<DriveResult> {
  const { key, projects, videos } = config();
  if (!projects || !key) return { status: "unconfigured" };

  try {
    const { items, folders } = await listTree(projects, key);
    // Without a separate videos folder, videos are shown in the Videos section instead of here.
    const kept = videos ? items : items.filter((i) => !isVideo(i.file));
    const files = kept.map((i) => toFile(i.file, i.folder || "More"));
    const categories = [...folders, "More"].filter((c) => files.some((f) => f.category === c));
    return { status: "ok", files, categories, folderUrl: folderUrl(projects) };
  } catch (err) {
    console.error("[drive:projects]", err);
    return { status: "error", message: "Couldn't reach Google Drive right now.", folderUrl: folderUrl(projects) };
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
    return { status: "error", message: "Couldn't load videos right now.", folderUrl: folderUrl(source) };
  }
}
