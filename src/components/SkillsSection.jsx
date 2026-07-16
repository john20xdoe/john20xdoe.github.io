import { SkillRow } from "./SkillRow";

export function SkillsSection({ skills, loading, error }) {
  return (
    <div className="col-6">
      <h4>I currently work or have worked with:</h4>
      {error && <p className="error">Failed to load skills.</p>}
      {loading && <p className="loading">loading…</p>}
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
  );
}
