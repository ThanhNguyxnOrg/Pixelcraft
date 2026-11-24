import Showcase from "../components/Showcase";
import Library from "../components/Library";
import Install from "../components/Install";
import { skills, steps } from "../data/skills";
export default function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-meta">
          <span>
            <span className="status-dot"></span> DESIGN INTELLIGENCE FOR CODING
            AGENTS
          </span>
          <a href="/guide/">
            OPEN SOURCE <span>↗</span> v0.1.0
          </a>
        </div>
        <div className="hero-main">
          <h1>
            Less default.
            <br />
            <span>More deliberate.</span>
          </h1>
          <div className="hero-aside">
            <div className="pixel-bracket" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <p>
              Your agent can write the code.
              <br />
              Give it an eye for the interface.
            </p>
            <p className="hero-description">
              Distinctive design. Rigorous UX.
              <br />
              Every frontend surface. Not just the web.
            </p>
            <a className="hero-film-link" href="/film/">
              <span className="play-icon" aria-hidden="true">
                ▶
              </span>{" "}
              See Pixelcraft in motion <span>↗</span>
            </a>
          </div>
        </div>
        <div className="hero-actions">
          <a href="#install" className="button button-primary">
            Get Pixelcraft <span aria-hidden="true">↗</span>
          </a>
          <span>
            {skills.length} skills <i>/</i> Any stack <i>/</i> MIT licensed
          </span>
          <a href="#playground" className="explore-link">
            Try the difference below <span aria-hidden="true">↓</span>
          </a>
        </div>
        <Showcase />
        <div className="agent-strip">
          <span>FITS THE WAY YOU ALREADY BUILD</span>
          <div>
            <span>Claude Code</span>
            <span>Codex</span>
            <span>Cursor</span>
            <span>Gemini CLI</span>
            <span>GitHub Copilot</span>
            <span>OpenCode</span>
            <a href="/guide/#agents">and more ↗</a>
          </div>
        </div>
      </section>
      <section
        id="difference"
        className="difference-section shell"
        aria-labelledby="difference-heading"
      >
        <div className="difference-intro">
          <span className="section-kicker">
            Better decisions. Better interfaces.
          </span>
          <h2 id="difference-heading">
            Not a component library.
            <br />A way of thinking.
          </h2>
          <p>
            Most agents reach for the familiar. Pixelcraft changes the process:
            explore first, design the whole experience, build for the platform,
            then look at what actually shipped.
          </p>
          <a className="text-link" href="/guide/#first-project">
            See the workflow ↗
          </a>
        </div>
        <div className="principle-list">
          <article>
            <span className="principle-glyph" aria-hidden="true">
              ↗↘
            </span>
            <div>
              <h3>Diverge before you commit.</h3>
              <p>
                Three to five genuinely different directions. Real tradeoffs.
                One deliberate choice. Not the first plausible layout.
              </p>
            </div>
          </article>
          <article>
            <span className="principle-glyph" aria-hidden="true">
              ⊞
            </span>
            <div>
              <h3>One floor. No fixed aesthetic.</h3>
              <p>
                Accessibility, complete states, responsiveness, and truthfulness
                are mandatory. Your visual direction is yours.
              </p>
            </div>
          </article>
          <article>
            <span className="principle-glyph" aria-hidden="true">
              ⌘
            </span>
            <div>
              <h3>Every surface has its own language.</h3>
              <p>
                Web, mobile, desktop, terminal, email, games, and beyond.
                Translate the thinking, not the CSS.
              </p>
            </div>
          </article>
          <article>
            <span className="principle-glyph" aria-hidden="true">
              ⌁
            </span>
            <div>
              <h3>Evidence, not “looks good”.</h3>
              <p>
                Render the interface. Exercise the states. Say what was checked,
                what was judgment, and what is still unknown.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section
        className="surface-ribbon"
        aria-label="Supported interface surfaces"
      >
        <div className="shell">
          <span>Web</span>
          <span className="ribbon-star" aria-hidden="true">
            ✳
          </span>
          <span>Mobile</span>
          <span className="ribbon-star" aria-hidden="true">
            ✳
          </span>
          <span>Desktop</span>
          <span className="ribbon-star" aria-hidden="true">
            ✳
          </span>
          <span>Terminal</span>
          <span className="ribbon-star" aria-hidden="true">
            ✳
          </span>
          <span>And beyond.</span>
        </div>
      </section>
      <Library skills={skills.map(({ html, body, ...skill }) => skill)} />
      <section
        className="workflow-section shell"
        id="workflow"
        aria-labelledby="workflow-heading"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">The Pixelcraft loop</span>
            <h2 id="workflow-heading">
              Thoughtful by process.
              <br />
              Not by accident.
            </h2>
          </div>
          <a href="/guide/#first-project" className="text-link">
            Walk through your first project ↗
          </a>
        </div>
        <div className="workflow-grid">
          {steps.map(([name, heading, description], i) => (
            <article key={name}>
              <span className="step-index">0{i}</span>
              <h3>
                {name}
                <span aria-hidden="true">
                  {i < steps.length - 1 ? "↗" : "↺"}
                </span>
              </h3>
              <h4>{heading}</h4>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="evidence-line">
          <span>HONEST BY DEFAULT</span>
          <div>
            <span>
              <i className="evidence-rendered"></i>rendered
            </span>
            <span>
              <i className="evidence-static"></i>static
            </span>
            <span>
              <i className="evidence-judgment"></i>model-judgment
            </span>
            <span>
              <i className="evidence-unchecked"></i>not-checked
            </span>
            <span>
              <i className="evidence-waived"></i>waived
            </span>
          </div>
        </div>
      </section>
      <section className="film-teaser shell">
        <a
          href="/film/"
          className="film-poster"
          aria-label="Watch the Pixelcraft promotional film"
        >
          <div className="film-poster-top">
            <span>PIXELCRAFT / IN PRACTICE</span>
            <span>THE SHORT FILM</span>
          </div>
          <div className="film-poster-title">
            From prompt.
            <br />
            To point of view<span>.</span>
          </div>
          <span className="film-play" aria-hidden="true">
            ▶
          </span>
          <div className="film-poster-bottom">
            <span>A workflow, not a magic trick.</span>
            <span>Watch the film ↗</span>
          </div>
        </a>
      </section>
      <section className="faq-section shell" aria-labelledby="faq-heading">
        <div>
          <span className="section-kicker">A few useful answers</span>
          <h2 id="faq-heading">
            Before you
            <br />
            start making.
          </h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>
              What is Pixelcraft, exactly?<span aria-hidden="true">+</span>
            </summary>
            <p>
              A portable, open-source pack of Agent Skills: readable
              instructions and supporting tools your coding agent uses to plan,
              design, build, and verify interfaces. It is not a UI framework,
              hosted AI service, or component library.
            </p>
          </details>
          <details>
            <summary>
              Is it only for websites?<span aria-hidden="true">+</span>
            </summary>
            <p>
              No. Pixelcraft covers web, mobile, desktop, terminal UI, email,
              data apps, documents, media, chat interfaces, extensions,
              constrained hardware, spatial UI, and game UI. Platform skills
              translate the core principles into the stack’s idioms.
            </p>
          </details>
          <details>
            <summary>
              Will every project look the same?<span aria-hidden="true">+</span>
            </summary>
            <p>
              That is what Pixelcraft tries to prevent. The direction skill
              explores materially different visual worlds, scores them against
              your brief, and records the choice. Existing brand rules and your
              explicit brief come first.
            </p>
          </details>
          <details>
            <summary>
              Do I need an API key or a subscription?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              Pixelcraft itself is free and MIT licensed. It runs inside your
              existing coding agent, whose own access and costs still apply. The
              bundled installer and tools use Node.js; installation downloads
              the skills. There is no Pixelcraft API key.
            </p>
          </details>
          <details>
            <summary>
              Can I use just one skill?<span aria-hidden="true">+</span>
            </summary>
            <p>
              Yes. Skills are self-contained. The bundled installer
              automatically includes the orchestrator and planning skill when
              you request a subset. The skills CLI also lets you choose what to
              install. <a href="/guide/">See the setup guide.</a>
            </p>
          </details>
          <details>
            <summary>
              Was this website made with Pixelcraft?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              Yes. Its planning, visual divergence, platform implementation, and
              review follow the skills in this repository. The interactive
              interfaces are labeled illustrative examples; they are not
              customer work or claimed outputs from a live AI session.
            </p>
          </details>
        </div>
      </section>
      <Install />
    </>
  );
}
