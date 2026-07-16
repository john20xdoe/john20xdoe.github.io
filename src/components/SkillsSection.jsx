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
    </div>
  );
}
