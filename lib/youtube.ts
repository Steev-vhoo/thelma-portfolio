// Reads a channel's public RSS feed — no API key required.

export type Video = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
  description: string;
};

export type VideoResult =
  | { status: "ok"; videos: Video[]; channelUrl: string; channelName: string }
  | { status: "unconfigured" }
  | { status: "error"; message: string; channelUrl?: string };

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const pick = (xml: string, tag: string) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1]) : "";
};

export async function getRecentVideos(limit = 6): Promise<VideoResult> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) return { status: "unconfigured" };
  const channelUrl = `https://www.youtube.com/channel/${channelId}`;

  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`, {
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) throw new Error(`YouTube feed ${res.status}`);
    const xml = await res.text();

    const header = xml.split("<entry>")[0];
    const channelName = pick(header, "title");
    const entries = xml.split("<entry>").slice(1);

    const videos = entries
      .map((entry) => {
        const id = pick(entry, "yt:videoId");
        return {
          id,
          title: pick(entry, "title"),
          published: pick(entry, "published"),
          description: pick(entry, "media:description"),
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${id}`,
        };
      })
      .filter((v) => v.id)
      // Shorts show up in the feed too; keep them — they're great for a marketer's channel.
      .slice(0, limit);

    return { status: "ok", videos, channelUrl, channelName };
  } catch (err) {
    console.error("[youtube]", err);
    return { status: "error", message: "Couldn't load videos right now.", channelUrl };
  }
}
