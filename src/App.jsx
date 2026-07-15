import { useState, useEffect } from "react";
import SlDetails from "@shoelace-style/shoelace/dist/react/details/index.js";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert/index.js";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge/index.js";
import SlAvatar from "@shoelace-style/shoelace/dist/react/avatar/index.js";
import SlDivider from "@shoelace-style/shoelace/dist/react/divider/index.js";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";

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
  if (!html) return null;

  // Split on <b> and </b> tags (case-insensitive), keeping the tags in the result
  const tokens = html.split(/(<\/?b>)/i);
  let bold = false;
  const children = [];

  tokens.forEach((token, index) => {
    if (/^<b>$/i.test(token)) {
      bold = true;
      return;
    }
    if (/^<\/b>$/i.test(token)) {
      bold = false;
      return;
    }
    if (!token) {
      return;
    }
    if (bold) {
      children.push(
        <b key={index}>{token}</b>
      );
    } else {
      children.push(token);
    }
  });

  return <span>{children}</span>;
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
    <SlDetails
      summary={group}
      open={isOpen}
      onSlShow={() => onOpen(group)}
      onSlHide={() => onOpen(null)}
    >
      <div className="links">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SlBadge
              variant={link.variant === "primary" ? "primary" : link.variant === "secondary" ? "neutral" : "dark"}
              pill
              pulse={link.pulse}
            >
              <InlineHTML html={link.label} />
            </SlBadge>
          </a>
        ))}
      </div>
    </SlDetails>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function App() {
  useGoogleAnalytics("G-8DL289L3NB");

  const baseUrl = import.meta.env.BASE_URL || "/";
  const { data: skills, loading: skillsLoading, error: skillsError } = useFetch(`${baseUrl}data/skills.json`);
  const { data: links, loading: linksLoading, error: linksError } = useFetch(`${baseUrl}data/links.json`);

  const [openGroup, setOpenGroup] = useState("Employment");

  const row1 = links?.slice(0, 3) ?? [];
  const row2 = links?.slice(3) ?? [];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --sl-font-sans: "Inter", "Open Sans", sans-serif;
        }

        body {
          margin: 0;
          width: 100%;
          font-family: "Inter", "Open Sans", sans-serif;
        }

        .container {
          width: 80rem;
          margin: 2rem auto;
        }

        .details-group-example > .row {
          margin: 1rem 0;
        }

        .links > .badge {
          margin-right: 3px;
        }

        .stale {
          opacity: 0.5;
        }

        .name-tag {
          font-size: 50px;
        }

        .light {
          font-weight: 200;
        }

        .semi {
          font-weight: 400;
        }

        .heavy {
          font-weight: 800;
        }

        footer {
          padding: 1rem 0;
          margin: 0 auto;
          font-size: 0.75rem;
          color: gray;
          width: 300px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
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
              <span>My name is </span>
              <SlAvatar
                image="https://avatars.githubusercontent.com/u/14521605?s=120&v=4"
                label="Lee Alexis Bermejo"
              />
              <span><b> Lee Alexis Bermejo</b>.</span>
            </p>
          </div>
        </div>

        <SlDivider style={{ margin: "2rem 0" }} />

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
            <SlAlert variant="primary" open style={{ marginBottom: "0.75rem" }}>
              <SlIcon slot="icon" name="info-circle" />
              <span>
                I am on the process of populating&nbsp;
                <SlBadge variant="primary" pill>my skills roadmap</SlBadge>.
              </span>
            </SlAlert>
            <SlAlert variant="primary" open style={{ marginBottom: "0.75rem" }}>
              <SlIcon slot="icon" name="info-circle" />
              <span>
                I am learning about&nbsp;
                <SlBadge variant="primary" pill>
                  LLMs, code completions, and prompt engineering
                </SlBadge>.
              </span>
            </SlAlert>
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

        <SlDivider style={{ margin: "2rem 0" }} />

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
