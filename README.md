# Thelma Bamanteeh Naroog — Digital Marketing Portfolio

A bubbly, single-page portfolio built with **Next.js 16 (App Router)**, ready for **Vercel**.
The colours and copy come from Thelma's portfolio deck: deep purple, violet, electric blue and gold.

**Sections:** Hero (with bubbles you can pop) · About · Skills · Toolkit · Featured Work (case studies) ·
Projects (live from Google Drive) · Videos (also live from Google Drive) · Certifications · Contact

---

## Edit the content

Nearly everything lives in **`content/site.ts`**: name, email, phone, LinkedIn, résumé link, skills, tools,
case studies and certificates. Photos are in `public/images/`.

> LinkedIn and Résumé cards stay hidden until you fill in `contact.linkedin` / `contact.resume`.

## Connect Google Drive (Projects section)

1. Make a Drive folder for the portfolio. **Sub-folders turn into filter tabs**
   (e.g. `Campaigns`, `Assignments`). Files in the top folder show under "More".
2. Share the folder: **Share → General access → Anyone with the link → Viewer**.
3. Copy the folder ID from the URL: `drive.google.com/drive/folders/`**`<FOLDER_ID>`**
4. Make an API key: [Google Cloud Console](https://console.cloud.google.com/) → create a project →
   **APIs & Services → Library → enable "Google Drive API"** → **Credentials → Create credentials → API key**.
   Under the key's restrictions, limit it to the Google Drive API.
5. Set `GOOGLE_DRIVE_FOLDER_ID` and `GOOGLE_DRIVE_API_KEY` (see below).

To keep a sub-folder out of the Projects grid (for example a folder of profile photos), add its name to
`drive.hideFolders` in `content/site.ts`. It is set to `["Pictures"]` by default. Video files never appear in
Projects, because they have their own section.

File names become card titles (`My_Campaign-Brief.pdf` becomes "My Campaign Brief", and ALL-CAPS names are
softened to Title Case), so give files descriptive, unique names.

A file's **Description** in Drive (right-click → File information → Details) appears on its card.
New files show up on the site within about 5 minutes. Files can sit in sub-folders up to 3 levels deep, and Drive shortcuts work as long as the original file is shared too.

## Videos (from Google Drive)

The Videos section shows the 6 most recent **video files** (MP4, MOV and so on) from Google Drive. Pick one setup:

- **Separate videos folder (recommended):** make a second folder, share it the same way
  (Anyone with the link → Viewer) and set `GOOGLE_DRIVE_VIDEOS_FOLDER_ID` to its ID. Sub-folders are included.
- **Same folder as projects:** leave `GOOGLE_DRIVE_VIDEOS_FOLDER_ID` empty, and the videos in the projects folder
  are shown here instead.

Either way, videos never appear in the Projects grid, so nothing shows twice.

Each video plays in the page with Drive's player. The file name becomes the title (`_` and `-` become spaces,
and the extension is removed), the Drive **Description** appears under it, and the length is shown on the thumbnail.
Upright (9:16) reels are letterboxed rather than cropped.

> Drive needs a few minutes to process a new upload before its thumbnail and player work.
> Very large or long videos may show Drive's "can't preview" notice; anything under about 100 MB is safe.

Until the Drive settings are filled in, both sections show a friendly "coming soon" card, so the site is safe to deploy right away.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Deploy on Vercel

1. [vercel.com/new](https://vercel.com/new) → import `Steev-vhoo/thelma-portfolio` (Vercel detects Next.js; keep the defaults).
2. **Settings → Environment Variables**: add `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_DRIVE_API_KEY` and (optionally) `GOOGLE_DRIVE_VIDEOS_FOLDER_ID`.
3. Deploy. Every push to `main` redeploys.
4. After the first deploy, put the live URL (or custom domain) into `site.url` in `content/site.ts` so link previews work.
