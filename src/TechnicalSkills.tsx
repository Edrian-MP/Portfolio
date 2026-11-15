import { useRef, useState, type KeyboardEvent } from "react";
import { Glyph } from "./VisualDetails";

const skills = [
  {
    id: "software",
    label: "Software development",
    description: "I build web interfaces and connect them to application data. For SmartPOS, I worked on integrating the local terminal with the web dashboard and on hosting the web application.",
    tools: ["TypeScript", "React", "Python", "SQLite"],
  },
  {
    id: "embedded",
    label: "Embedded systems",
    description: "I work with Raspberry Pi, Arduino, and electronic components to connect sensors and peripherals to software. On SmartPOS, that meant integrating cameras and a scale with the checkout application.",
    tools: ["Raspberry Pi", "Arduino", "Linux", "Electronic components"],
  },
  {
    id: "workflow",
    label: "AI-assisted development",
    description: "I use AI tools to explore implementation options, troubleshoot issues, and review changes as part of my development workflow.",
    tools: ["Claude Code", "Codex", "Gemini"],
  },
  {
    id: "design",
    label: "Design and documentation",
    description: "I use Figma to plan interface layouts and Microsoft Office to document project requirements and technical decisions.",
    tools: ["Figma", "Microsoft Office"],
  },
];

export default function TechnicalSkills() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const skill = skills[selected];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = (index + 1) % skills.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = (index + skills.length - 1) % skills.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = skills.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className="technical-skills reveal-section" aria-labelledby="toolbox-heading">
      <header className="skills-heading">
        <h2 id="toolbox-heading">Technical skills</h2>
        <p>The tools I use to build web applications, integrate hardware, and document projects.</p>
      </header>
      <div className="skills-layout">
        <div className="skills-tabs" role="tablist" aria-label="Skill areas" aria-orientation="vertical">
          {skills.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => { tabs.current[index] = element; }}
              id={`skill-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={index === selected}
              aria-controls="skills-panel"
              tabIndex={index === selected ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span className="skill-node" aria-hidden="true" />
              <span>{item.label}</span>
              <Glyph name="right" size={17} />
            </button>
          ))}
        </div>
        <div id="skills-panel" className="skills-panel" role="tabpanel" aria-labelledby={`skill-tab-${skill.id}`} tabIndex={0}>
          <div key={skill.id} className="skill-content">
            <span className="skill-trace" aria-hidden="true" />
            <h3>{skill.label}</h3>
            <p>{skill.description}</p>
            <ul className="skill-tools" aria-label="Tools and technologies">
              {skill.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
