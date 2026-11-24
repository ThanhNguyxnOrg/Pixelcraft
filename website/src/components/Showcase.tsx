"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
const descriptions: Record<string, string> = {
  web: "A distinct visual direction. Not just a different coat of paint.",
  mobile: "Native-minded hierarchy, spacing, and actions. HTML emulation.",
  desktop:
    "A workspace built for focus, not a stretched website. HTML emulation.",
  terminal: "Legible structure, keyboard-minded rhythm. Terminal UI emulation.",
};
export default function Showcase() {
  const [surface, setSurface] = useState("web");
  const [design, setDesign] = useState("after");
  const [saved, setSaved] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  return (
    <>
      <div className="workbench" id="playground">
        <div className="workbench-toolbar">
          <div
            className="surface-switch"
            role="group"
            aria-label="Preview surface"
          >
            <button
              aria-pressed={surface === "web"}
              data-surface="web"
              onClick={() => {
                setSurface("web");
                setDesign("after");
              }}
            >
              {surface === "web" && (
                <motion.span
                  className="surface-active"
                  layoutId="active-surface"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 35 }
                  }
                />
              )}
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <rect x="2" y="3" width="16" height="13" rx="2" />
                <path d="M2 7h16" />
              </svg>
              Web
            </button>
            <button
              aria-pressed={surface === "mobile"}
              data-surface="mobile"
              onClick={() => {
                setSurface("mobile");
                setDesign("after");
              }}
            >
              {surface === "mobile" && (
                <motion.span
                  className="surface-active"
                  layoutId="active-surface"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 35 }
                  }
                />
              )}
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <rect x="5" y="2" width="10" height="16" rx="2" />
                <path d="M8 15h4" />
              </svg>
              Mobile
            </button>
            <button
              aria-pressed={surface === "desktop"}
              data-surface="desktop"
              onClick={() => {
                setSurface("desktop");
                setDesign("after");
              }}
            >
              {surface === "desktop" && (
                <motion.span
                  className="surface-active"
                  layoutId="active-surface"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 35 }
                  }
                />
              )}
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <rect x="2" y="2" width="16" height="12" rx="1" />
                <path d="M7 18h6m-3-4v4" />
              </svg>
              Desktop
            </button>
            <button
              aria-pressed={surface === "terminal"}
              data-surface="terminal"
              onClick={() => {
                setSurface("terminal");
                setDesign("after");
              }}
            >
              {surface === "terminal" && (
                <motion.span
                  className="surface-active"
                  layoutId="active-surface"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 35 }
                  }
                />
              )}
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m3 5 5 5-5 5m7 0h7" />
              </svg>
              Terminal
            </button>
          </div>
          <div
            className="compare-switch"
            role="group"
            aria-label="Design state"
          >
            <button
              data-design="before"
              aria-pressed={design === "before"}
              onClick={() => setDesign("before")}
            >
              Before
            </button>
            <button
              data-design="after"
              aria-pressed={design === "after"}
              onClick={() => setDesign("after")}
            >
              <span className="tiny-logo" aria-hidden="true">
                ✳
              </span>{" "}
              With Pixelcraft
            </button>
          </div>
        </div>
        <motion.div
          key={`${surface}-${design}`}
          className="preview-stage"
          data-current-surface={surface}
          data-current-design={design}
          initial={reduce ? false : { opacity: 0.65, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="demo-before" hidden={design !== "before"}>
            <div className="default-nav">
              TravelApp <span>Home　About　Contact</span>
            </div>
            <div className="default-content">
              <span className="default-pill">Your next adventure awaits</span>
              <h3>
                Discover Your Perfect
                <br />
                Travel Experience
              </h3>
              <p>
                Explore amazing destinations and create unforgettable memories
                <br />
                with our all-in-one travel platform.
              </p>
              <button
                data-open-stays=""
                onClick={() => dialog.current?.showModal()}
              >
                Get Started →
              </button>
              <div className="default-features">
                <div>
                  01
                  <br />
                  <strong>Amazing Places</strong>
                </div>
                <div>
                  02
                  <br />
                  <strong>Easy Booking</strong>
                </div>
                <div>
                  03
                  <br />
                  <strong>Great Experiences</strong>
                </div>
              </div>
            </div>
          </div>
          <div
            className="surface-preview preview-web"
            data-preview="web"
            hidden={design === "before" || surface !== "web"}
          >
            <div className="browser-bar">
              <div className="window-dots">
                <i></i>
                <i></i>
                <i></i>
              </div>
              <span>elsewhere.stays</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="stays-page">
              <div className="stays-nav">
                <span className="stays-logo">
                  elsewhere<span>®</span>
                </span>
                <div>
                  <span>Our places</span>
                  <span>The journal</span>
                  <button
                    data-open-stays=""
                    onClick={() => dialog.current?.showModal()}
                  >
                    Find a stay ↗
                  </button>
                </div>
              </div>
              <div className="stays-hero">
                <div className="stays-copy">
                  <div className="stays-eyebrow">
                    <span></span> A LITTLE FURTHER FROM ORDINARY
                  </div>
                  <h3>
                    Somewhere
                    <br />
                    worth
                    <br />
                    <em>staying.</em>
                  </h3>
                  <p>
                    Considered spaces. Unhurried days.
                    <br />A collection of places to feel a world away.
                  </p>
                  <button
                    data-open-stays=""
                    onClick={() => dialog.current?.showModal()}
                    className="stays-cta"
                  >
                    Find your quiet <span>↗</span>
                  </button>
                  <div className="stays-footnote">
                    <span>01 — 03</span>
                    <span>LESS SCROLLING. MORE SKY.</span>
                  </div>
                </div>
                <div className="stays-photo">
                  <img
                    src="/images/alpine-lake.jpg"
                    width="1600"
                    height="1067"
                    alt="A small cabin beside a still alpine lake, surrounded by mountains"
                    fetchPriority="high"
                  />
                  <span className="photo-note">The art of getting away.</span>
                  <div className="location-note">
                    <span>THE LAKESIDE COLLECTION</span>
                    <span>Explore the slower side ↗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="surface-preview preview-mobile"
            data-preview="mobile"
            hidden={design === "before" || surface !== "mobile"}
          >
            <div className="mobile-intro">
              <span className="demo-label">MOBILE / HTML EMULATION</span>
              <h3>
                Room to breathe.
                <br />
                Even on a<br />
                small screen.
              </h3>
              <p>
                Platform-aware spacing.
                <br />
                Clear priorities. Reachable actions.
              </p>
            </div>
            <div className="phone">
              <div className="phone-status">
                <span>9:41</span>
                <span>••• ▰</span>
              </div>
              <div className="phone-header">
                <span>elsewhere®</span>
                <button
                  data-open-stays=""
                  onClick={() => dialog.current?.showModal()}
                  aria-label="Browse demo stays"
                >
                  ↗
                </button>
              </div>
              <p className="phone-greeting">A change of scenery.</p>
              <h4>
                Find your
                <br />
                <em>somewhere.</em>
              </h4>
              <div className="phone-photo">
                <img
                  src="/images/alpine-lake.jpg"
                  width="1600"
                  height="1067"
                  alt="Alpine lakeside cabin"
                  loading="lazy"
                />
                <span>THE LAKESIDE COLLECTION</span>
              </div>
              <div className="phone-place">
                <div>
                  <strong>A little closer to nature.</strong>
                  <span>Quiet places, thoughtfully chosen.</span>
                </div>
                <button
                  className="save-stay"
                  aria-label={saved ? "Unsave demo stay" : "Save demo stay"}
                  aria-pressed={saved}
                  onClick={() => setSaved(!saved)}
                >
                  {saved ? "♥" : "♡"}
                </button>
              </div>
              <button
                className="phone-explore"
                data-open-stays=""
                onClick={() => dialog.current?.showModal()}
              >
                Explore places <span>↗</span>
              </button>
              <div className="phone-home"></div>
            </div>
          </div>
          <div
            className="surface-preview preview-desktop"
            data-preview="desktop"
            hidden={design === "before" || surface !== "desktop"}
          >
            <div className="desktop-window">
              <div className="desktop-title">
                <div className="window-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>Elsewhere — Editorial workspace</span>
                <span>⌘ K</span>
              </div>
              <div className="desktop-app">
                <aside>
                  <strong>elsewhere®</strong>
                  <span className="desktop-nav-active">▦　Overview</span>
                  <span>▤　Collections</span>
                  <span>◷　Schedule</span>
                  <span>◇　Assets</span>
                  <small>ILLUSTRATIVE WORKSPACE</small>
                </aside>
                <div className="desktop-content">
                  <div className="desktop-heading">
                    <div>
                      <span>YOUR CREATIVE SPACE</span>
                      <h3>A quieter kind of workflow.</h3>
                    </div>
                    <button
                      className="save-stay"
                      aria-pressed={draftSaved}
                      onClick={() => setDraftSaved(!draftSaved)}
                    >
                      {draftSaved ? "Saved ✓" : "Save draft"}
                    </button>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-cover">
                      <img
                        src="/images/alpine-lake.jpg"
                        width="1600"
                        height="1067"
                        alt="Alpine landscape in the editorial preview"
                        loading="lazy"
                      />
                      <div>
                        Notes from
                        <br />
                        <em>the slower side.</em>
                      </div>
                      <span>JOURNAL / ISSUE 01</span>
                    </div>
                    <div className="editor-list">
                      <h4>The lakeside collection</h4>
                      <p>A field guide to switching off.</p>
                      <div>
                        <span>Cover story</span>
                        <strong>Ready for review</strong>
                      </div>
                      <div>
                        <span>Photography</span>
                        <strong>Selected</strong>
                      </div>
                      <div>
                        <span>Reading order</span>
                        <strong>Defined</strong>
                      </div>
                      <div className="editor-note">
                        Good tools leave more room for the work.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="surface-preview preview-terminal"
            data-preview="terminal"
            hidden={design === "before" || surface !== "terminal"}
          >
            <div className="terminal-window">
              <div className="terminal-bar">
                <div className="window-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>elsewhere / interface review</span>
                <span>TUI EMULATION</span>
              </div>
              <div className="terminal-body">
                <div className="terminal-brand">
                  ┌─ pixelcraft ──────────────────────────────┐
                  <br />
                  │　Deliberate design. Every surface.　　　　│
                  <br />
                  └──────────────────────────────────────────┘
                </div>
                <p>
                  <span className="terminal-muted">project</span>　elsewhere /
                  terminal-ui
                </p>
                <p>
                  <span className="terminal-muted">direction</span>{" "}
                  quiet-editorial
                </p>
                <div className="terminal-table">
                  <div>
                    <span>CHECK</span>
                    <span>EVIDENCE</span>
                  </div>
                  <div>
                    <span>✓ Focus order</span>
                    <span>rendered</span>
                  </div>
                  <div>
                    <span>✓ Empty state</span>
                    <span>rendered</span>
                  </div>
                  <div>
                    <span>✓ Token mapping</span>
                    <span>static</span>
                  </div>
                  <div>
                    <span>○ Screen reader</span>
                    <span>not-checked</span>
                  </div>
                </div>
                <p className="terminal-muted">
                  Illustrative output, not an executed review.
                </p>
                <div className="terminal-prompt">
                  <span>›</span> What should we make more deliberate?
                  <span className="terminal-caret"></span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="workbench-caption">
          <span>
            <span className="status-dot"></span>
            <span id="preview-description">
              {design === "before"
                ? "An intentionally generic baseline. Same brief, less thought."
                : descriptions[surface]}
            </span>
          </span>
          <span className="fixture-label">
            ILLUSTRATIVE DEMO · NO AI REQUESTS
          </span>
        </div>
      </div>
      <dialog
        ref={dialog}
        id="stays-dialog"
        className="demo-dialog"
        aria-labelledby="stays-dialog-title"
      >
        <div className="dialog-top">
          <span>ELSEWHERE / INTERACTIVE SPECIMEN</span>
          <button
            className="dialog-close"
            onClick={() => dialog.current?.close()}
            aria-label="Close demo"
          >
            ×
          </button>
        </div>
        <img
          src="/images/alpine-lake.jpg"
          width="1600"
          height="1067"
          alt="Mountain lake with a cabin at the water’s edge"
          loading="lazy"
        />
        <div className="dialog-body">
          <span className="section-kicker">
            A small example of deliberate UI
          </span>
          <h2 id="stays-dialog-title">
            Keep a little quiet
            <br />
            for later.
          </h2>
          <p>
            This fictional stay is a design specimen, not a booking service. Try
            saving it, then explore the skills behind the interface.
          </p>
          <button
            className="button button-dark save-stay"
            aria-pressed={saved}
            onClick={() => setSaved(!saved)}
          >
            {saved ? "Saved ✓" : "Save this stay ♡"}
          </button>
          <a className="text-link" href="/skills/craft/">
            Explore the craft skill ↗
          </a>
        </div>
      </dialog>
    </>
  );
}
