"use client";
import { useState } from "react";
import type { Video } from "@/lib/youtube";
import { Play } from "./Icons";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Loads the YouTube player only after a click — keeps the page fast.
export default function VideoCard({ video, priority = false }: { video: Video; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className="video">
      <div className="video__frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button className="video__play" onClick={() => setPlaying(true)} aria-label={`Play: ${video.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={video.thumbnail} alt="" loading={priority ? "eager" : "lazy"} />
            <span className="btn-play"><Play /></span>
          </button>
        )}
      </div>
      <div className="video__info">
        <h3>{video.title}</h3>
        {video.published && <time dateTime={video.published}>{fmt(video.published)}</time>}
      </div>
    </article>
  );
}
