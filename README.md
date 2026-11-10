# Thelma Bamanteeh Naroog — Digital Marketing Portfolio

A bubbly, single-page portfolio built with **Next.js 16 (App Router)**, ready for **Vercel**.
The colours and copy come from Thelma's portfolio deck: deep purple, violet, electric blue and gold.

**Sections:** Hero (with bubbles you can pop) · About · Skills · Toolkit · Featured Work (case studies) ·
Projects (live from Google Drive) · Videos (live from YouTube) · Certifications · Contact

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

A file's **Description** in Drive (right-click → File information → Details) appears on its card.
New files show up on the site within about 30 minutes.

## Connect YouTube (Videos section)

Set `YOUTUBE_CHANNEL_ID` to the channel ID (it starts with `UC…`; find it at
YouTube → Settings → Advanced settings). No API key is needed, because the site reads the channel's public feed.
The 6 latest uploads appear within about an hour of publishing.

Until these are set, both sections show a friendly "coming soon" card, so the site is safe to deploy right away.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Deploy on Vercel

1. [vercel.com/new](https://vercel.com/new) → import `Steev-vhoo/thelma-portfolio` (Vercel detects Next.js; keep the defaults).
2. **Settings → Environment Variables**: add `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_DRIVE_API_KEY`, `YOUTUBE_CHANNEL_ID`.
3. Deploy. Every push to `main` redeploys.
4. After the first deploy, put the live URL (or custom domain) into `site.url` in `content/site.ts` so link previews work.
