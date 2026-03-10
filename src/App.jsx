import { useState, useEffect } from "react";

// ── Google Analytics ──────────────────────────────────────────────────────────
function useGoogleAnalytics(id) {
  useEffect(() => {
    if (!id || document.getElementById("ga-script")) return;
    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id);
  }, [id]);
}

// ── Data fetching ─────────────────────────────────────────────────────────────
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => controller.abort();
  }, [url]);
  
  return { data, loading, error };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Safely renders label strings that contain inline <b> tags
function InlineHTML({ html }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// Mirrors the original row.tech layout with stale spans grouped together
function SkillRow({ category, items }) {
  const parts = [];
  let current = [];
  let currentStale = items[0]?.stale ?? false;
  for (const item of items) {
    const stale = item.stale ?? false;
    if (stale !== currentStale) {
      parts.push({ stale: currentStale, names: current });
      current = [];
      currentStale = stale;
    }
    current.push(item.name);
  }
  if (current.length) parts.push({ stale: currentStale, names: current });

  return (
    <div className="row tech">
      <span className="col-3 text-right text-bold">{category}</span>
      <span className="col-9">
        {parts.map((part, i) => (
          <span key={i} className={part.stale ? "stale" : undefined}>
            {i > 0 && " | "}
            {part.names.join(" | ")}
          </span>
        ))}
      </span>
    </div>
  );
}

// Replicates sl-details — only one open at a time (accordion)
function LinkGroup({ group, links, isOpen, onOpen }) {
  return (
    <div className={`sl-details${isOpen ? " open" : ""}`}>
      <button
        className="sl-details__summary"
        onClick={() => onOpen(isOpen ? null : group)}
        aria-expanded={isOpen}
      >
        <span>{group}</span>
        <span className="sl-details__caret" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && (
        <div className="sl-details__body links">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`badge badge-${link.variant}${link.pulse ? " pulse" : ""}`}
            >
              <InlineHTML html={link.label} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function App() {
  useGoogleAnalytics("G-8DL289L3NB");

  const { data: skills, loading: skillsLoading, error: skillsError } = useFetch("/data/skills.json");
  const { data: links, loading: linksLoading, error: linksError } = useFetch("/data/links.json");

  const [openGroup, setOpenGroup] = useState("Employment");

  const row1 = links?.slice(0, 3) ?? [];
  const row2 = links?.slice(3) ?? [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200,400,600,700,800&family=Open+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          width: 100%;
          font-family: "Inter", "Open Sans", sans-serif;
          font-size: 1rem;
          color: #111;
          background: #fff;
          line-height: 1.5;
          display: flex;
          flex-direction: column;
        }

        a { color: #0074d9; text-decoration: none; }
        a:hover { text-decoration: underline; }

        /* Layout */
        .container {
          width: min(80rem, 100%);
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -1rem;
          margin-left: -1rem;
        }
        .col   { flex: 1 1 0;        padding: 0 1rem; min-width: 0; }
        .col-3 { flex: 0 0 25%;      max-width: 25%;      padding: 0 1rem; }
        .col-4 { flex: 0 0 33.3333%; max-width: 33.3333%; padding: 0 1rem; }
        .col-6 { flex: 0 0 50%;      max-width: 50%;      padding: 0 1rem; }
        .col-9 { flex: 0 0 75%;      max-width: 75%;      padding: 0 1rem; }

        @media (max-width: 768px) {
          .col-3, .col-4, .col-6, .col-9 { flex: 0 0 100%; max-width: 100%; }
        }

        .text-right { text-align: right; }
        .text-bold  { font-weight: 700; }

        /* Typography */
        h1 { font-size: 2.5rem; font-weight: 300; margin: 0 0 0.5rem; }
        h4 { font-size: 1.25rem; font-weight: 300; margin: 0 0 0.75rem; line-height: 1.5; }
        p  { margin: 0 0 1rem; }

        .name-tag {
          font-size: clamp(2rem, 5vw, 50px);
          font-weight: 300;
          margin: 0 0 1rem;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          line-height: 1.2;
        }
        .name-tag b { font-weight: 800; }

        /* Avatar */
        .gh-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          vertical-align: middle;
        }

        /* Divider */
        .sl-divider, hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 2rem 0;
        }

        /* Alert */
        .sl-alert {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          color: #004480;
          background-color: #bfdcf6;
          border: 1px solid #b5d1ea;
          border-radius: 0.25rem;
          padding: 0.75rem 1rem;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .sl-alert .icon { flex-shrink: 0; margin-top: 1px; }

        /* Badges */
        .badge {
          display: inline-block;
          font-size: 0.8em;
          border-radius: 1em;
          padding: 0.2em 0.6em;
          vertical-align: baseline;
          color: #fff;
          text-decoration: none;
          transition: opacity 0.1s;
          cursor: default;
        }
        a.badge { cursor: pointer; }
        a.badge:hover { opacity: 0.82; text-decoration: none; }
        .badge-primary   { background-color: #0074d9; }
        .badge-secondary { background-color: #aaa; }
        .badge-dark      { background-color: #111; }

        .badge.pulse { animation: badge-pulse 1.75s ease infinite; }
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0   rgba(0,116,217,0.5); }
          50%       { box-shadow: 0 0 0 5px rgba(0,116,217,0);   }
        }

        /* Skill rows */
        .row.tech { margin-top: 0.1rem; margin-bottom: 0.1rem; align-items: baseline; }
        .row.tech .col-3 { font-size: 0.82rem; }
        .row.tech .col-9 { font-size: 0.9rem; }
        .stale { opacity: 0.5; }

        /* Roadmap */
        .roadmap-img { max-width: 100%; height: auto; display: block; margin-top: 1rem; }

        /* sl-details accordion */
        .sl-details {
          border: 1px solid #ddd;
          border-radius: 0.25rem;
          overflow: hidden;
        }
        .sl-details__summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: #fff;
          border: none;
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          color: #111;
          text-align: left;
        }
        .sl-details__summary:hover { background: #f7f7f7; }
        .sl-details__caret { font-size: 0.6rem; color: #aaa; margin-left: 0.5rem; }
        .sl-details__body { padding: 0.75rem 1rem; border-top: 1px solid #ddd; }

        .details-group-example > .row { margin: 0.5rem 0; }
        .links > .badge { margin-right: 3px; margin-bottom: 3px; }

        /* Footer */
        footer {
          padding: 1rem 0;
          margin: 0 auto;
          font-size: 0.75rem;
          color: gray;
          width: 300px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        footer a { color: gray; }
        footer a:hover { text-decoration: underline; }

        .error   { color: #c00; font-size: 0.85rem; }
        .loading { color: #aaa; font-size: 0.85rem; }
      `}</style>

      <section className="container">
        {/* Greeting */}
        <div className="row">
          <div className="col"><h1>Hi.</h1></div>
        </div>

        {/* Name + avatar */}
        <div className="row">
          <div className="col">
            <p className="name-tag">
              My name is&nbsp;
              <img
                className="gh-avatar"
                src="https://avatars.githubusercontent.com/u/14521605?s=120&v=4"
                alt="Lee Alexis Bermejo"
              />
              <b>Lee Alexis Bermejo</b>.
            </p>
          </div>
        </div>

        <div className="sl-divider" />

        {/* Bio + Skills */}
        <section className="row">
          <div className="col-6">
            <h4>
              I am a software engineer from Manila working in the software
              development industry since 2012. I am a generalist who can work
              with new technologies as needed, primarily working web development
              for front-end and back-end. I am interested in designing systems
              and processes and am currently targeting to get into AI and neural
              networks.
            </h4>
            <p />
            <div className="sl-alert">
              <span className="icon">ℹ</span>
              <span>
                I am on the process of populating&nbsp;
                <span className="badge badge-primary">my skills roadmap</span>.
              </span>
            </div>
            <div className="sl-alert">
              <span className="icon">ℹ</span>
              <span>
                I am learning about&nbsp;
                <span className="badge badge-primary">
                  LLMs, code completions, and prompt engineering
                </span>.
              </span>
            </div>
          </div>

          <div className="col-6">
            <h4>I currently work or have worked with:</h4>
            {skillsError && <p className="error">Failed to load skills.</p>}
            {skillsLoading && <p className="loading">loading…</p>}
            {skills && skills.map((g) => (
              <SkillRow key={g.category} category={g.category} items={g.items} />
            ))}
            <p />
            <a
              href="https://roadmap.sh/u/john20xdoe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="roadmap-img"
                src="https://roadmap.sh/card/wide/66025f200973993ed05e6549?variant=light&roadmaps=full-stack%2Cfrontend%2Creact%2Cai-engineer"
                alt="roadmap.sh"
              />
            </a>
          </div>
        </section>

        <hr />

        {/* Link accordions */}
        {linksError && <p className="error">Failed to load links.</p>}
        {linksLoading && <p className="loading">loading…</p>}
        {links && (
          <div className="details-group-example">
            <section className="row">
              {row1.map((g) => (
                <div key={g.group} className="col-4">
                  <LinkGroup
                    group={g.group}
                    links={g.links}
                    isOpen={openGroup === g.group}
                    onOpen={setOpenGroup}
                  />
                </div>
              ))}
            </section>
            {row2.length > 0 && (
              <section className="row">
                {row2.map((g) => (
                  <div key={g.group} className="col-4">
                    <LinkGroup
                      group={g.group}
                      links={g.links}
                      isOpen={openGroup === g.group}
                      onOpen={setOpenGroup}
                    />
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </section>

      <footer>
        &copy; <b>2019–2026</b>{" "}
        <a href="https://github.com/john20xdoe">john20xdoe</a>. Made with{" "}
        <a href="https://vscode.dev">vscode.dev</a>
      </footer>
    </>
  );
}
