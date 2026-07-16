import SlAlert from "@shoelace-style/shoelace/dist/react/alert/index.js";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge/index.js";
import SlDivider from "@shoelace-style/shoelace/dist/react/divider/index.js";

export function BioSection({ theme = "light" }) {
  return (
    <div className="col-6">
      <h4>
        I am a <b>software engineer</b> with over a decade of experience (since 2012)
        based in Manila. As a versatile generalist, I design and build
        end-to-end web applications, systems, and processes. I prefer to work remotely.
        <p />
        My latest focus is diving deep into AI and neural networks, applications of LLMs and agentic workflows. In my spare time,
        I enjoy tinkering with open source, contributing casually and tailoring custom
        forks of useful software.
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

      <SlDivider style={{ margin: "2rem 0 0" }}></SlDivider>

      <p />
      <a
        href="https://roadmap.sh/u/john20xdoe"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="roadmap-img"
          src={`https://roadmap.sh/card/wide/66025f200973993ed05e6549?variant=${theme}&roadmaps=full-stack%2Cfrontend%2Creact%2Cai-engineer`}
          alt="roadmap.sh"
        />
      </a>
    </div>
  );
}
