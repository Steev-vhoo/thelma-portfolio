"use client";
import { useState } from "react";
import type { DriveFile } from "@/lib/drive";
import { Arrow } from "./Icons";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

export default function ProjectsGrid({ files, categories }: { files: DriveFile[]; categories: string[] }) {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? files : files.filter((f) => f.category === filter);

  return (
    <>
      {categories.length > 1 && (
        <div className="filters" role="group" aria-label="Filter projects" style={{ marginBottom: 30 }}>
          {["All", ...categories].map((c) => (
            <button key={c} className="chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="grid">
        {shown.map((f) => (
          <a key={f.id} className="card" href={f.webViewLink} target="_blank" rel="noopener noreferrer">
            <div className="card__thumb">
              <span className="fallback" aria-hidden>{f.kind}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.thumbnail}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.style.display = "none")}
                style={{ position: "relative" }}
              />
              <span className="badge">{f.category === "More" ? f.kind : f.category}</span>
            </div>
            <div className="card__body">
              <h3>{f.name}</h3>
              {f.description && <p>{f.description}</p>}
              <div className="card__foot">
                <span>{f.kind} · {fmt(f.modifiedTime)}</span>
                <span className="arrow"><Arrow className="" /></span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
