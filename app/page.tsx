import Image from "next/image";
import Nav from "@/components/Nav";
import Bubbles from "@/components/Bubbles";
import Reveal from "@/components/Reveal";
import ProjectsGrid from "@/components/ProjectsGrid";
import VideoCard from "@/components/VideoCard";
import { Arrow, FileText, Folder, LinkedIn, Mail, Phone, Video } from "@/components/Icons";
import { caseStudies, certificates, site, skills, toolkit } from "@/content/site";
import { describe, getDriveProjects, getDriveVideos } from "@/lib/drive";

export const revalidate = 1800; // re-check Google Drive every 30 min

export default async function Home() {
  const [drive, vids] = await Promise.all([getDriveProjects(), getDriveVideos(6)]);
  const { contact } = site;

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main">
        {/* ───────── Hero ───────── */}
        <section className="hero" id="top">
          <Bubbles />
          <svg className="hero__wave" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="w1" x1="0" x2="1"><stop offset="0" stopColor="#7c3aed" /><stop offset="1" stopColor="#3b82f6" /></linearGradient>
            </defs>
            <path d="M0 250 C 240 120 480 360 720 230 S 1200 90 1440 200 V400 H0Z" fill="url(#w1)" opacity=".35" />
            <path d="M0 300 C 300 200 520 380 820 290 S 1260 170 1440 260 V400 H0Z" fill="url(#w1)" opacity=".3" />
          </svg>
          <div className="wrap hero__grid rel">
            <div>
              <span className="eyebrow">Digital Marketing Portfolio</span>
              <h1>
                <span className="hey" aria-label="Heyyyy,">
                  {"Heyyyy".split("").map((c, i) => <span key={i} aria-hidden>{c}</span>)}
                </span>
                , <span className="wave-hand" aria-hidden>👋</span>
                <br />I&apos;m {site.firstName}.
              </h1>
              <p className="hero__sub">
                I build <strong>brands that people remember</strong> — turning scattered ideas into clear strategies and content people actually want to engage with.
              </p>
              <div className="hero__cta">
                <a href="#work" className="btn">See my work <Arrow /></a>
                <a href="#contact" className="btn btn--ghost">Say hello</a>
              </div>
              <div className="hero__meta">
                <span><i aria-hidden /> Open to opportunities</span>
                <span>{contact.location}</span>
                <span>Social · Content · SEO · Analytics</span>
              </div>
            </div>
            <div className="portrait">
              <div className="portrait__ring" aria-hidden />
              <div className="portrait__frame">
                <Image src="/images/thelma-hero.webp" alt={`${site.name} smiling, standing in front of palm leaves`} fill priority sizes="(max-width: 860px) 78vw, 420px" />
              </div>
              <span className="sticker sticker--gold" style={{ top: "6%", left: "-12%", ["--r" as string]: "-6deg" }}>Curious by nature</span>
              <span className="sticker sticker--blue" style={{ top: "46%", right: "-14%", ["--r" as string]: "5deg" }}>Researcher at heart</span>
              <span className="sticker" style={{ bottom: "4%", left: "-6%", ["--r" as string]: "-3deg" }}>Big laugh, <b>bigger ideas</b></span>
            </div>
          </div>
          <a href="#about" className="scroll-cue" aria-label="Scroll to About" />
        </section>

        <div className="marquee-wrap" aria-hidden>
          <div className="marquee">
            <div className="marquee__track">
              {[...skills, ...skills].map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </div>
        </div>

        {/* ───────── About ───────── */}
        <section className="section" id="about">
          <div className="blob" style={{ width: 520, height: 520, left: -200, top: -120, background: "var(--lilac)", opacity: 0.7 }} />
          <div className="blob" style={{ width: 300, height: 300, right: -120, bottom: -80, background: "var(--blue-soft)" }} />
          <div className="wrap about__grid rel">
            <Reveal className="about__photos">
              <figure className="photo-card photo-card--main" style={{ margin: 0 }}>
                <Image src="/images/thelma-about.webp" alt={`Portrait of ${site.firstName}`} fill sizes="(max-width: 860px) 80vw, 400px" style={{ padding: 12, borderRadius: 30 }} />
              </figure>
              <figure className="photo-card photo-card--fun" style={{ margin: 0 }}>
                <Image src="/images/thelma-smile.webp" alt={`${site.firstName} laughing in a candid selfie`} width={480} height={640} style={{ height: "100%" }} />
                <figcaption>off-duty mode ✦</figcaption>
              </figure>
            </Reveal>
            <Reveal className="about__text" delay={120}>
              <span className="eyebrow">A quick look into my world…</span>
              <h2 className="h2">Building brands that people <span className="squiggle">remember.</span></h2>
              <p className="about__hey">Heyyyy, {site.firstName} here!</p>
              <p className="lede">Curious by nature. A researcher at heart. Always looking for a better way to make things work.</p>
              <p>
                I enjoy the process of turning scattered ideas into clear strategies, information into insights and content into something people actually want to engage with.
              </p>
              <p>This is where I put some of that thinking into practice.</p>
              <div className="about__traits">
                {["Strategy-minded", "Data-curious", "Content creator", "Trend spotter", "Always learning", "Big laugh"].map((t) => (
                  <span key={t} className="trait">{t}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── Skills ───────── */}
        <section className="section section--lilac" id="skills">
          <div className="dots" style={{ right: "6%", top: 70 }} />
          <div className="wrap rel">
            <Reveal className="section-head">
              <span className="eyebrow">Skills &amp; expertise</span>
              <h2 className="h2">What I bring to the table.</h2>
            </Reveal>
            <div className="skills">
              {skills.map((s, i) => (
                <Reveal key={s} className="skill" delay={(i % 3) * 80}>
                  <h3>{s}</h3>
                  <span className="skill__num">{String(i + 1).padStart(2, "0")}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Toolkit ───────── */}
        <section className="section section--plum" id="toolkit" style={{ paddingTop: 90, paddingBottom: 100 }}>
          <div className="blob" style={{ width: 600, height: 600, right: -200, top: -200, background: "rgba(255,255,255,.06)" }} />
          <div className="blob" style={{ width: 400, height: 400, left: -150, bottom: -200, background: "rgba(59,130,246,.18)" }} />
          <div className="wrap rel" style={{ textAlign: "center" }}>
            <Reveal className="section-head">
              <h2 className="h2" style={{ marginTop: 0 }}>My everyday toolkit</h2>
              <p className="lede" style={{ marginInline: "auto" }}>The apps I open before my morning coffee kicks in.</p>
            </Reveal>
            <Reveal className="toolkit">
              {toolkit.map((t) => (
                <span key={t.name} className="tool">
                  <span className="tool__ico">
                    <Image src={t.logo} alt="" width={36} height={36} unoptimized={t.logo.endsWith(".svg")} />
                  </span>
                  {t.name}
                </span>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ───────── Work / case studies ───────── */}
        <section className="section section--dark" id="work">
          <div className="blob" style={{ width: 700, height: 700, right: -300, top: -250, background: "#221a38" }} />
          <div className="blob" style={{ width: 500, height: 500, left: -250, bottom: -200, background: "#1c1238" }} />
          <div className="dots" style={{ right: "8%", top: 90 }} />
          <div className="wrap rel">
            <Reveal className="section-head">
              <span className="eyebrow">Featured work</span>
              <h2 className="h2">My Work, Assignments &amp; Projects</h2>
              <p className="lede" style={{ color: "var(--gold)" }}>
                A look at the campaigns, assignments and practical projects I have worked on — the thinking behind each one, the strategy I built, and the results it delivered.
              </p>
            </Reveal>

            {caseStudies.map((c) => (
              <article key={c.id} className="case" id={`case-${c.id}`}>
                <Reveal className="case__visual">
                  <span className="glow" aria-hidden />
                  {c.id === "seo" ? (
                    <div className="shots">
                      {c.images.map((img) => (
                        <figure key={img.src} className="shot" style={{ margin: 0 }}>
                          <Image src={img.src} alt={img.alt} width={img.w} height={img.h} sizes="(max-width: 860px) 80vw, 420px" />
                        </figure>
                      ))}
                    </div>
                  ) : (
                    c.images.map((img) => (
                      <div key={img.src} className={`phone ${c.images.length === 1 ? "phone--solo" : ""}`}>
                        <Image src={img.src} alt={img.alt} width={img.w} height={img.h} sizes="210px" />
                      </div>
                    ))
                  )}
                </Reveal>
                <Reveal delay={100}>
                  <div className="case__tag">
                    <span className={`eyebrow ${c.id === "stukent" ? "eyebrow--blue" : ""}`}>{c.tag}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <div className="case__meta">{c.meta.map((m) => <span key={m}>{m}</span>)}</div>
                  <p className="case__summary">{c.summary}</p>
                  <div className="stats">
                    {c.stats.map((s, i) => (
                      <div key={s.label} className={`stat stat--${s.tone} ${s.value.length > 12 || (c.stats.length % 2 === 1 && i === 0) ? "stat--wide" : ""}`}>
                        <div className="stat__label">{s.label}</div>
                        <div className={`stat__value ${s.value.length > 12 ? "stat__value--text" : ""}`}>{s.value}</div>
                        <div className="stat__note">{s.note}</div>
                      </div>
                    ))}
                  </div>
                  {c.highlight && <p className="highlight">{c.highlight}</p>}
                  {c.footnote && <p className="footnote">{c.footnote}</p>}
                </Reveal>
              </article>
            ))}
          </div>
        </section>

        {/* ───────── Google Drive projects ───────── */}
        <section className="section" id="projects" data-drive={describe(drive)}>
          <div className="blob" style={{ width: 420, height: 420, right: -160, top: -100, background: "var(--lilac)" }} />
          <div className="blob" style={{ width: 260, height: 260, left: -100, bottom: -60, background: "#f7ecc4" }} />
          <div className="wrap rel">
            <Reveal className="section-head">
              <span className="eyebrow">Project library</span>
              <h2 className="h2">Fresh from my Drive.</h2>
              <p className="lede">Campaign briefs, content calendars, reports and course projects — straight from my Google Drive, always up to date.</p>
            </Reveal>
            {drive.status === "ok" && drive.files.length > 0 ? (
              <>
                <ProjectsGrid files={drive.files} categories={drive.categories} />
                <div className="more">
                  <a className="btn btn--violet" href={drive.folderUrl} target="_blank" rel="noopener noreferrer">Open the full folder <Arrow /></a>
                </div>
              </>
            ) : (
              <div className="empty">
                <span className="empty__icon"><Folder /></span>
                <div>
                  <h3>{drive.status === "error" ? "The Drive library is taking a quick break" : "Projects are on their way!"}</h3>
                  <p>
                    {drive.status === "error"
                      ? "I couldn't reach Google Drive just now — refresh in a moment, or browse the folder directly."
                      : "I'm polishing up my project library. In the meantime, check out the featured work above or get in touch for samples."}
                  </p>
                  {drive.status === "error" && drive.folderUrl && (
                    <p style={{ marginTop: 14 }}><a className="btn btn--violet" href={drive.folderUrl} target="_blank" rel="noopener noreferrer">Open folder <Arrow /></a></p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ───────── Videos (Google Drive) ───────── */}
        <section className="section section--dark" id="videos" data-drive={describe(vids)}>
          <div className="blob" style={{ width: 500, height: 500, left: -200, top: -150, background: "#1f1640" }} />
          <div className="wrap rel">
            <Reveal className="section-head">
              <span className="eyebrow">Video reel</span>
              <h2 className="h2">Recent videos</h2>
              <p className="lede">Reels, edits and behind-the-scenes from my marketing journey. Grab a snack and hit play.</p>
            </Reveal>
            {vids.status === "ok" && vids.videos.length > 0 ? (
              <>
                <div className="videos">
                  {vids.videos.map((v, i) => <VideoCard key={v.id} video={v} priority={i === 0} />)}
                </div>
                <div className="more">
                  <a className="btn" href={vids.folderUrl} target="_blank" rel="noopener noreferrer"><Video /> See all videos</a>
                </div>
              </>
            ) : (
              <div className="empty">
                <span className="empty__icon"><Video /></span>
                <div>
                  <h3 style={{ color: "var(--white)" }}>
                    {vids.status === "error" ? "The video reel is taking a quick break" : "Lights, camera… coming soon!"}
                  </h3>
                  <p>
                    {vids.status === "error"
                      ? "I couldn't reach Google Drive just now — refresh in a moment."
                      : "New videos will pop up here automatically as soon as they're ready."}
                  </p>
                  {vids.status === "error" && vids.folderUrl && (
                    <p style={{ marginTop: 14 }}><a className="btn" href={vids.folderUrl} target="_blank" rel="noopener noreferrer">Open the folder <Arrow /></a></p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ───────── Certifications ───────── */}
        <section className="section section--plum" id="growth" style={{ background: "linear-gradient(160deg, #24104d, #170c30)" }}>
          <div className="blob" style={{ width: 640, height: 640, right: -220, top: -260, background: "rgba(124,58,237,.25)" }} />
          <div className="blob" style={{ width: 420, height: 420, left: -160, bottom: -180, background: "rgba(59,130,246,.15)" }} />
          <div className="wrap rel">
            <Reveal className="section-head">
              <span className="eyebrow">Certifications</span>
              <h2 className="h2">Continuous Professional Growth</h2>
              <p className="lede">SEO, social media, omnichannel marketing and data analytics credentials.</p>
            </Reveal>
            <div className="certs">
              {certificates.map((c, i) => (
                <Reveal key={c.title} delay={(i % 2) * 120}>
                  <a className="cert" href={c.img} target="_blank" rel="noopener noreferrer" aria-label={`${c.title} certificate from ${c.org} (opens image)`}>
                    <div className="cert__img"><Image src={c.img} alt="" width={900} height={640} sizes="(max-width: 900px) 60vw, 320px" /></div>
                    <div className={`cert__label tone-${c.tone}`}>
                      <div className="cert__org">{c.org}</div>
                      <div className="cert__title">{c.title}</div>
                      <div className="cert__date">{c.date}</div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Contact ───────── */}
        <section className="section contact" id="contact">
          <div className="blob" style={{ width: 520, height: 520, right: -160, top: -200, background: "rgba(124,58,237,.3)" }} />
          <div className="dots" style={{ right: "6%", bottom: 60 }} />
          <div className="wrap rel">
            <Reveal>
              <span className="eyebrow">Ready to grow your digital presence?</span>
              <h2 style={{ marginTop: 20 }}>Let&apos;s get your brand <span className="squiggle">moving…</span></h2>
              <p className="contact__lede">
                I help businesses, entrepreneurs and brands build a stronger online presence, connect with the right target audience and achieve their marketing goals.
              </p>
            </Reveal>
            <Reveal className="contact__grid" delay={100}>
              <a className="contact-card" href={`mailto:${contact.email}`}>
                <span className="contact-card__dot"><Mail /></span>
                <span className="contact-card__label">Email</span>
                <span className="contact-card__value">{contact.email}</span>
              </a>
              <a className="contact-card" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                <span className="contact-card__dot"><Phone /></span>
                <span className="contact-card__label">Phone</span>
                <span className="contact-card__value">{contact.phone}</span>
              </a>
              {contact.linkedin && (
                <a className="contact-card" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <span className="contact-card__dot"><LinkedIn /></span>
                  <span className="contact-card__label">LinkedIn</span>
                  <span className="contact-card__value">Connect with me</span>
                </a>
              )}
              {contact.resume && (
                <a className="contact-card" href={contact.resume} target="_blank" rel="noopener noreferrer">
                  <span className="contact-card__dot"><FileText /></span>
                  <span className="contact-card__label">Resume</span>
                  <span className="contact-card__value">View my CV</span>
                </a>
              )}
            </Reveal>
            <div className="contact__cta">
              <a className="btn" href={`mailto:${contact.email}?subject=${encodeURIComponent("Let's work together")}`}>Start a conversation <Arrow /></a>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>Made with curiosity &amp; lots of bubbles ✦ <a href="#top">Back to top ↑</a></span>
        </div>
      </footer>
    </>
  );
}
