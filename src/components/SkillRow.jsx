export function SkillRow({ category, items }) {
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
      <span className="col-4 text-right">
        <span className="text-bold">{category}</span>://
      </span>
      <span className="col-8">
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
