"use client";
import { useState } from "react";
import CopyButton from "./CopyButton";
const installBase = "npx skills add ThanhNguyxnOrg/Pixelcraft";
export default function Install() {
  const [agent, setAgent] = useState("");
  return (
    <section
      className="install-section shell"
      id="install"
      aria-labelledby="install-heading"
    >
      <div className="install-heading">
        <span className="section-kicker">Your next interface starts here</span>
        <h2 id="install-heading">
          Give your agent
          <br />a better eye<span className="accent">.</span>
        </h2>
        <p>
          One skill pack. Your existing workflow.
          <br />
          No API key. No new runtime for the skills.
        </p>
        <a className="text-link" href="/guide/">
          Read the setup guide <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="install-panel">
        <div className="panel-label">
          <span className="status-dot" />
          INSTALL PIXELCRAFT <span>v0.1.0</span>
        </div>
        <label htmlFor="agent-select">Your coding agent</label>
        <select
          id="agent-select"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
        >
          <option value="">Auto-detect my agents</option>
          <option value="claude-code">Claude Code</option>
          <option value="codex">Codex</option>
          <option value="cursor">Cursor</option>
          <option value="gemini-cli">Gemini CLI</option>
          <option value="github-copilot">GitHub Copilot</option>
          <option value="opencode">OpenCode</option>
        </select>
        <div className="command-box">
          <span aria-hidden="true">$</span>
          <code id="install-command">
            {installBase}
            {agent ? ` -a ${agent}` : ""}
          </code>
          <CopyButton target="install-command" label="Copy install command" />
        </div>
        <p className="install-note">
          Run in your project directory. The skills CLI helps you choose skills,
          agents, and installation scope.
        </p>
        <div className="install-meta">
          <span>Free & open source</span>
          <a href="https://github.com/ThanhNguyxnOrg/Pixelcraft/releases">
            Prefer a download? ↗
          </a>
        </div>
      </div>
    </section>
  );
}
