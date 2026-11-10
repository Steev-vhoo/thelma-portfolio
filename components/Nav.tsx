"use client";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled || open ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <nav className="wrap nav__inner" aria-label="Main">
        <a href="#top" className="logo" onClick={() => setOpen(false)}>
          <span className="logo__mark" aria-hidden>T</span>
          <span>{site.firstName}<span className="logo__dot">.</span></span>
        </a>
        <ul className="nav__links" id="nav-links">
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className={active === n.id ? "is-active" : ""} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn nav__cta">Let&apos;s talk</a>
        <button className="nav__toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
          <span />
        </button>
      </nav>
    </header>
  );
}
