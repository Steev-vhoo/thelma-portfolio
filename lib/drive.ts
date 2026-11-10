// Reads a publicly shared Google Drive folder with an API key.
// Sub-folders become categories; files directly in the root fall under "More".

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

export type DriveResult =
  | { status: "ok"; files: DriveFile[]; categories: string[]; folderUrl: string }
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
  webViewLink?: string;
  thumbnailLink?: string;
};

async function listChildren(folderId: string, key: string): Promise<RawFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    key,
    pageSize: "100",
    orderBy: "modifiedTime desc",
    fields: "files(id,name,mimeType,description,modifiedTime,webViewLink,thumbnailLink)",
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
  return name.replace(/\.(pdf|pptx?|docx?|xlsx?|png|jpe?g|webp|mp4|mov)$/i, "").replace(/[_-]+/g, " ").trim();
}

function toFile(f: RawFile, category: string): DriveFile {
  return {
    id: f.id,
    name: cleanName(f.name),
    mimeType: f.mimeType,
    description: f.description,
    modifiedTime: f.modifiedTime,
    webViewLink: f.webViewLink ?? `https://drive.google.com/file/d/${f.id}/view`,
    // Public thumbnail endpoint — works for files shared "anyone with the link".
    thumbnail: `https://drive.google.com/thumbnail?id=${f.id}&sz=w800`,
    category,
    kind: kindOf(f.mimeType),
  };
}

export async function getDriveProjects(): Promise<DriveResult> {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const key = process.env.GOOGLE_DRIVE_API_KEY;
  if (!folderId || !key) return { status: "unconfigured" };
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

  try {
    const root = await listChildren(folderId, key);
    const folders = root.filter((f) => f.mimeType === FOLDER);
    const files: DriveFile[] = root.filter((f) => f.mimeType !== FOLDER).map((f) => toFile(f, "More"));

    const nested = await Promise.all(
      folders.map(async (folder) => {
        const children = await listChildren(folder.id, key);
        return children.filter((c) => c.mimeType !== FOLDER).map((c) => toFile(c, folder.name));
      }),
    );
    nested.forEach((group) => files.push(...group));

    const categories = [...folders.map((f) => f.name), ...(files.some((f) => f.category === "More") ? ["More"] : [])].filter(
      (c) => files.some((f) => f.category === c),
    );
    return { status: "ok", files, categories, folderUrl };
  } catch (err) {
    console.error("[drive]", err);
    return { status: "error", message: "Couldn't reach Google Drive right now.", folderUrl };
  }
}
