import { LinkGroup } from "./LinkGroup";

export function LinksSection({ links, loading, error, openGroup, onOpenGroupChange }) {
  const row1 = links?.slice(0, 3) ?? [];
  const row2 = links?.slice(3) ?? [];

  return (
    <>
      {/* Link accordions */}
      {error && <p className="error">Failed to load links.</p>}
      {loading && <p className="loading">loading…</p>}
      {links && (
        <div className="details-group-example">
          <section className="row">
            {row1.map((g) => (
              <div key={g.group} className="col-4">
                <LinkGroup
                  group={g.group}
                  links={g.links}
                  isOpen={openGroup === g.group}
                  onOpen={onOpenGroupChange}
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
                    onOpen={onOpenGroupChange}
                  />
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </>
  );
}
