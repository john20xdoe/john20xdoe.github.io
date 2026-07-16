import SlDetails from "@shoelace-style/shoelace/dist/react/details/index.js";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge/index.js";
import { InlineHTML } from "./InlineHTML";

export function LinkGroup({ group, links, isOpen, onOpen }) {
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
