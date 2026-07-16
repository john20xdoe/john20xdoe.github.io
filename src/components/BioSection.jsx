import SlAlert from "@shoelace-style/shoelace/dist/react/alert/index.js";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge/index.js";

export function BioSection() {
  return (
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
  );
}
