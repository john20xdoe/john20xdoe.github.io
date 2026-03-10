import { useState, useEffect } from "react";
import "./App.css";

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
