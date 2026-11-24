import { installBase, repository, steps } from "../../data/skills";
import CopyButton from "../../components/CopyButton";
export const metadata = { title: "Get started — Pixelcraft" };
export default function Guide() {
  return (
    <>
      <header className="page-hero shell">
        <div className="breadcrumbs">
          <a href="/">Pixelcraft</a>
          <span>/</span>
          <span>Documentation</span>
        </div>
        <span className="section-kicker">The practical part</span>
        <h1>
          From installed.
          <br />
          To intentional.
        </h1>
        <p>
          A few minutes to set up. A different way to approach every interface
          after that.
        </p>
      </header>
      <div className="reading-layout shell">
        <aside className="reading-sidebar" aria-label="On this page">
          <span>ON THIS PAGE</span>
          <a href="#install">Install</a>
          <a href="#agents">Choose your agent</a>
          <a href="#first-project">Your first project</a>
          <a href="#surfaces">Beyond the web</a>
          <a href="#evidence">Understand the evidence</a>
          <a href="#manage">Update & remove</a>
          <a className="sidebar-back" href="/#skills">
            ← Explore all skills
          </a>
        </aside>
        <article className="prose">
          <h2 id="install">Install the skill pack</h2>
          <p>
            Pixelcraft is a collection of readable <code>SKILL.md</code> files
            and supporting tools. It extends your existing coding agent; it is
            not another AI subscription or a frontend framework.
          </p>
          <p>From your project directory, run the cross-agent skills CLI:</p>
          <div className="command-box">
            <span aria-hidden="true">$</span>
            <code id="guide-command">{installBase}</code>
            <CopyButton target="guide-command" label="Copy install command" />
          </div>
          <p>
            The CLI helps you choose the skills, agents, and scope. The command
            downloads code from GitHub; review the source and follow your
            agent’s trust settings. Use a supported Node.js LTS release for
            Node-based installation.
          </p>
          <div className="callout">
            <strong>No Pixelcraft API key.</strong> You still need access to
            your chosen coding agent. That agent’s own usage terms and costs
            apply.
          </div>
          <h3>Prefer the bundled installer?</h3>
          <p>
            Clone the repo once. Then, from the project that should receive the
            skills, run the installer by its full path:
          </p>
          <pre>
            <code>
              {
                'git clone https://github.com/ThanhNguyxnOrg/Pixelcraft.git "$HOME/Pixelcraft"\nnode "$HOME/Pixelcraft/bin/pixelcraft.mjs"'
              }
            </code>
          </pre>
          <p>
            The wizard lets you choose agents, skills, and project or user-level
            scope. The bundled installer and tools have no package dependencies.
            Node <code>&gt;=18</code> is a compatibility floor, not a
            recommendation to use an end-of-life runtime.
          </p>
          <h2 id="agents">Choose your coding agent</h2>
          <p>
            The portable skills format works across hosts. The bundled installer
            uses these target directories; host discovery behavior and
            permissions can vary.
          </p>
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Installer name</th>
                <th>Project skill directory</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Claude Code</td>
                <td>
                  <code>claude</code>
                </td>
                <td>
                  <code>.claude/skills</code>
                </td>
              </tr>
              <tr>
                <td>Codex / Devin / generic agents</td>
                <td>
                  <code>codex</code> / <code>devin</code> / <code>agents</code>
                </td>
                <td>
                  <code>.agents/skills</code>
                </td>
              </tr>
              <tr>
                <td>Cursor</td>
                <td>
                  <code>cursor</code>
                </td>
                <td>
                  <code>.cursor/skills</code>
                </td>
              </tr>
              <tr>
                <td>Gemini CLI</td>
                <td>
                  <code>gemini</code>
                </td>
                <td>
                  <code>.gemini/skills</code>
                </td>
              </tr>
              <tr>
                <td>GitHub Copilot</td>
                <td>
                  <code>copilot</code>
                </td>
                <td>
                  <code>.github/skills</code>
                </td>
              </tr>
              <tr>
                <td>OpenCode</td>
                <td>
                  <code>opencode</code>
                </td>
                <td>
                  <code>.opencode/skills</code>
                </td>
              </tr>
              <tr>
                <td>Windsurf</td>
                <td>
                  <code>windsurf</code>
                </td>
                <td>
                  <code>.windsurf/skills</code>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Additional installer targets include Kiro, Cline, Roo, Droid, and
            Antigravity. Amp, Zed, and Goose use the shared agents directory.{" "}
            <a href={`${repository}#install`}>
              The README has the full adapter and path matrix.
            </a>
          </p>
          <h3>Install a focused set</h3>
          <p>
            The following command uses the bundled installer after cloning. The
            orchestrator and planning skill are included automatically when
            needed:
          </p>
          <pre>
            <code>
              {
                'node "$HOME/Pixelcraft/bin/pixelcraft.mjs" add pixelcraft-web pixelcraft-review --agent claude\n\n# Inspect every destination without writing files\nnode "$HOME/Pixelcraft/bin/pixelcraft.mjs" add all --agent all --dry-run'
              }
            </code>
          </pre>
          <h3>Claude Code plugin</h3>
          <pre>
            <code>
              {
                "/plugin marketplace add ThanhNguyxnOrg/Pixelcraft\n/plugin install pixelcraft@pixelcraft"
              }
            </code>
          </pre>
          <h2 id="first-project">Your first project</h2>
          <p>
            Open your project in the agent, make sure it can discover the
            installed skills, and give it a real brief. Name the task, audience,
            existing constraints, and what success means.
          </p>
          <pre>
            <code>
              {
                "Use Pixelcraft to build an editorial website for Elsewhere,\na fictional collection of quiet places to stay.\n\nAudience: people planning a slower weekend away.\nKeep this project's existing stack. Explore three genuinely\ndifferent visual directions before choosing one.\n\nBuild the main page and its narrow-screen layout. Include\nkeyboard navigation, useful empty states, and reduced motion.\nRender the result and tell me exactly what you checked."
              }
            </code>
          </pre>
          <p>
            This is an example brief, not a guarantee of a particular output.
            Pixelcraft guides your agent’s decisions; your project, model,
            tools, and constraints still matter.
          </p>
          <h3>Let the loop do its work</h3>
          <ol>
            {steps.map(([name, heading, description]) => (
              <li key={name}>
                <strong>
                  {name} — {heading}
                </strong>{" "}
                {description}
              </li>
            ))}
          </ol>
          <p>
            The authority order stays explicit:{" "}
            <strong>
              your brief → existing project design system → platform conventions
              and accessibility floor → Pixelcraft guidance → model taste.
            </strong>{" "}
            An approved design goes through handoff rather than being
            reimagined.
          </p>
          <h2 id="surfaces">It is not just for websites</h2>
          <p>
            Ask for the surface you actually need. The core design process stays
            consistent; platform skills translate it idiomatically.
          </p>
          <ul>
            <li>
              <strong>Mobile:</strong> SwiftUI, UIKit, Compose, Flutter, React
              Native, and more.
            </li>
            <li>
              <strong>Desktop:</strong> Tauri, Electron, Qt, native
              Windows/macOS/Linux frameworks.
            </li>
            <li>
              <strong>Terminal:</strong> Textual, Rich, Ink, Bubble Tea,
              Ratatui.
            </li>
            <li>
              <strong>Other surfaces:</strong> data apps, email, documents,
              media, chat UI, extensions, hardware-constrained interfaces,
              spatial UI, and games.
            </li>
          </ul>
          <p>
            For example: “Use Pixelcraft to design a keyboard-first terminal
            dashboard in Textual” is a valid starting point. It should not
            produce a web page disguised as a terminal app.
          </p>
          <h2 id="evidence">Understand the evidence</h2>
          <p>
            A build passing is not proof of good visual design. Pixelcraft asks
            the agent to label its claims:
          </p>
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>What it means</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>rendered</code>
                </td>
                <td>
                  The actual rendered artifact was inspected or exercised.
                </td>
              </tr>
              <tr>
                <td>
                  <code>static</code>
                </td>
                <td>
                  The source, configuration, or structure was checked without
                  rendering it.
                </td>
              </tr>
              <tr>
                <td>
                  <code>model-judgment</code>
                </td>
                <td>A reasoned assessment, not an executed check.</td>
              </tr>
              <tr>
                <td>
                  <code>not-checked</code>
                </td>
                <td>
                  No supporting verification was performed for that scope.
                </td>
              </tr>
              <tr>
                <td>
                  <code>waived</code>
                </td>
                <td>
                  A specific requirement was explicitly waived; it is not a
                  pass.
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            These are evidence labels, not automatic certifications. Look for
            the method, scope, outcome, and supporting artifact alongside the
            label.
          </p>
          <h2 id="manage">Update, inspect, or remove</h2>
          <h3>Update</h3>
          <p>
            Pull the latest repository, inspect the changes, and rerun the
            bundled installer. Existing skill directories are skipped unless you
            explicitly use <code>--force</code> for the skills you want
            replaced. Back up local edits first.
          </p>
          <pre>
            <code>
              {
                'git -C "$HOME/Pixelcraft" pull\nnode "$HOME/Pixelcraft/bin/pixelcraft.mjs" add all --agent claude --dry-run\nnode "$HOME/Pixelcraft/bin/pixelcraft.mjs" add all --agent claude --force'
              }
            </code>
          </pre>
          <p>
            For skills CLI installations, use that CLI’s update workflow and
            review its prompts. For plugin installations, use the host’s plugin
            manager.
          </p>
          <h3>Remove</h3>
          <p>
            Use your host or skills CLI’s removal workflow, or remove the{" "}
            <code>pixelcraft*</code> skill directories from the relevant
            project/user skill folder. Review any generated agent adapter files
            separately. The pack does not create a hosted account or background
            service.
          </p>
          <h3>Keep exploring</h3>
          <p>
            <a href="/#skills">Explore the library</a> ·{" "}
            <a href={`${repository}/blob/main/docs/ARCHITECTURE.md`}>
              Read the architecture
            </a>{" "}
            · <a href={`${repository}/releases`}>Browse release downloads</a> ·{" "}
            <a href={`${repository}/issues`}>Report an issue</a>
          </p>
        </article>
      </div>
    </>
  );
}
