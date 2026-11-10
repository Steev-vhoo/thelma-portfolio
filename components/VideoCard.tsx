"use client";
import { useEffect, useRef, useState } from "react";
import type { DriveVideo } from "@/lib/drive";
import { Play } from "./Icons";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Shows the Drive thumbnail first and only loads the Drive player after a click — keeps the page fast.
export default function VideoCard({ video, priority = false }: { video: DriveVideo; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  // Catch thumbnails that failed before React hydrated (onError would never fire for those).
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setThumbOk(false);
  }, []);
  return (
    <article className={`video ${video.portrait ? "video--portrait" : ""}`}>
      <div className="video__frame">
        {playing ? (
          <iframe src={video.embedUrl} title={video.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <button className="video__play" onClick={() => setPlaying(true)} aria-label={`Play: ${video.title}`}>
            {thumbOk ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img ref={imgRef} src={video.thumbnail} alt="" loading={priority ? "eager" : "lazy"} referrerPolicy="no-referrer" onError={() => setThumbOk(false)} />
            ) : (
              <span className="video__nothumb" aria-hidden />
            )}
            <span className="btn-play"><Play /></span>
            {video.duration && <span className="video__dur">{video.duration}</span>}
          </button>
        )}
      </div>
      <div className="video__info">
        <h3>{video.title}</h3>
        {video.description && <p className="video__desc">{video.description}</p>}
        <time dateTime={video.date}>{fmt(video.date)}</time>
      </div>
    </article>
  );
}
