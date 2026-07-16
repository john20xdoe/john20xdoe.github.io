import { useState } from "react";
import SlDivider from "@shoelace-style/shoelace/dist/react/divider/index.js";

// Styles
import "./App.css";

// Hooks
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import { useFetch } from "./hooks/useFetch";

// Components
import { HeroSection } from "./components/HeroSection";
import { BioSection } from "./components/BioSection";
import { SkillsSection } from "./components/SkillsSection";
import { LinksSection } from "./components/LinksSection";

export default function App() {
  useGoogleAnalytics("G-8DL289L3NB");

  const baseUrl = import.meta.env.BASE_URL || "/";
  const { data: skills, loading: skillsLoading, error: skillsError } = useFetch(`${baseUrl}data/skills.json`);
  const { data: links, loading: linksLoading, error: linksError } = useFetch(`${baseUrl}data/links.json`);

  const [openGroup, setOpenGroup] = useState("Employment");

  return (
    <>
      <section className="container">
        <HeroSection />
      </section>
      <SlDivider style={{ margin: "2rem 0 0" }} />
      <section className="container">


        {/* Bio + Skills */}
        <section className="row">
          <BioSection />
          <SkillsSection
            skills={skills}
            loading={skillsLoading}
            error={skillsError}
          />
        </section>

        <SlDivider style={{ margin: "2rem 0", color: "#f2bfff" }} />

        {/* Link accordions */}
        <LinksSection
          links={links}
          loading={linksLoading}
          error={linksError}
          openGroup={openGroup}
          onOpenGroupChange={setOpenGroup}
        />
      </section>

      <SlDivider style={{ margin: "2rem 0 0" }}></SlDivider>
      <footer>
        &copy; <b>2019–2026</b>{" "}
        <a href="https://github.com/john20xdoe">john20xdoe</a>.
        Made with{" "}
        <a href="https://vscode.dev">vscode.dev</a> and styled with <a href="https://shoelace.style">shoelace</a>
      </footer>
    </>
  );
}
