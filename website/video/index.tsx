import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  continueRender,
  delayRender,
  interpolate,
  registerRoot,
  staticFile,
  useCurrentFrame,
} from "remotion";

const C = {
  bg: "#090d14",
  text: "#f0f3fa",
  muted: "#a1aabc",
  accent: "#55e8d0",
  line: "#2b3946",
};
const sans = "Film Manrope, sans-serif";
const mono = "Film Mono, monospace";
const fade = (f: number, start: number, duration = 18) =>
  interpolate(f, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
const rise = (f: number, start: number) =>
  interpolate(f, [start, start + 24], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
const Label = ({
  children,
  color = C.accent,
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: 2, color }}>
    {children}
  </div>
);
const Title = ({
  children,
  size = 93,
}: {
  children: React.ReactNode;
  size?: number;
}) => (
  <h1
    style={{
      fontFamily: sans,
      fontWeight: 550,
      fontSize: size,
      letterSpacing: -5,
      lineHeight: 1.06,
      margin: "30px 0",
      color: C.text,
    }}
  >
    {children}
  </h1>
);
const Asset = ({
  name,
  style = {},
}: {
  name: string;
  style?: React.CSSProperties;
}) => (
  <Img
    src={staticFile(`video/assets/${name}.png`)}
    style={{ width: "100%", borderRadius: 8, ...style }}
  />
);

const Promo = () => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading bundled film fonts"));
  useEffect(() => {
    Promise.all([
      document.fonts.load('550 90px "Film Manrope"'),
      document.fonts.load('400 28px "Film Mono"'),
    ]).then(() => continueRender(handle));
  }, [handle]);
  const scene =
    f < 150
      ? 0
      : f < 270
        ? 1
        : f < 360
          ? 2
          : f < 480
            ? 3
            : f < 600
              ? 4
              : f < 840
                ? 5
                : f < 1050
                  ? 6
                  : 7;
  const start = [0, 150, 270, 360, 480, 600, 840, 1050][scene];
  const local = f - start;
  const opacity = fade(f, start, 12);
  const caption = [
    "THE FIRST ANSWER IS NOT THE ONLY ANSWER.",
    "START WITH A BETTER PROCESS.",
    "A REAL BRIEF. NOT “MAKE IT POP”.",
    "EXPLORE BEFORE YOU COMMIT.",
    "SAME BRIEF. A DIFFERENT POINT OF VIEW.",
    "EVERY SURFACE. ITS OWN LANGUAGE.",
    "EVIDENCE, NOT “LOOKS GOOD”.",
    "YOUR NEXT INTERFACE STARTS HERE.",
  ][scene];
  return (
    <AbsoluteFill style={{ background: C.bg, color: C.text, fontFamily: sans }}>
      <style>{`@font-face{font-family:'Film Manrope';src:url('${staticFile("video/assets/manrope.woff2")}') format('woff2');font-weight:200 800}@font-face{font-family:'Film Mono';src:url('${staticFile("video/assets/mono.woff2")}') format('woff2');font-weight:400}*{box-sizing:border-box}`}</style>
      <Audio src={staticFile("video/assets/soundtrack.m4a")} volume={0.65} />
      <div
        style={{
          position: "absolute",
          top: 53,
          left: 88,
          right: 88,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${C.line}`,
          paddingBottom: 26,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <Img
            src={staticFile("images/pixelcraft-logo.png")}
            style={{ width: 43, height: 43 }}
          />
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1.6 }}>
            pixelcraft<span style={{ color: C.accent }}>.</span>
          </span>
        </div>
        <span
          style={{
            fontFamily: mono,
            fontSize: 15,
            letterSpacing: 2,
            color: C.muted,
          }}
        >
          DESIGN INTELLIGENCE / v0.1.0
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          inset: "166px 88px 133px",
          opacity,
          transform: `translateY(${rise(f, start)}px)`,
        }}
      >
        {scene === 0 && (
          <>
            <Label>THE DEFAULT IS NOT THE DESTINATION</Label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "0.9fr 1.35fr",
                alignItems: "center",
                gap: 65,
                height: "100%",
              }}
            >
              <div style={{ paddingBottom: 70 }}>
                <Title>
                  Good code.
                  <br />
                  Same old
                  <br />
                  <span style={{ color: C.muted }}>interface?</span>
                </Title>
                <p style={{ color: C.muted, fontSize: 27, lineHeight: 1.7 }}>
                  The first plausible layout
                  <br />
                  doesn’t have to be the last.
                </p>
              </div>
              <div
                style={{
                  transform: `scale(${1 + local / 6500})`,
                  marginBottom: 55,
                }}
              >
                <Asset name="before" />
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 14,
                    color: C.muted,
                    marginTop: 20,
                  }}
                >
                  ILLUSTRATIVE BASELINE / FICTIONAL TRAVEL PROJECT
                </div>
              </div>
            </div>
          </>
        )}
        {scene === 1 && (
          <div style={{ paddingTop: 45 }}>
            <Label>01 / INSTALL</Label>
            <Title>
              Give your agent
              <br />a better eye<span style={{ color: C.accent }}>.</span>
            </Title>
            <div
              style={{
                marginTop: 50,
                border: `1px solid #405347`,
                padding: "35px 38px",
                background: "#101d1b",
                borderRadius: 8,
                display: "flex",
                gap: 23,
                alignItems: "center",
              }}
            >
              <span style={{ color: C.accent, fontFamily: mono, fontSize: 32 }}>
                $
              </span>
              <code
                style={{ fontFamily: mono, fontSize: 32, color: "#d4ede3" }}
              >
                {"npx skills add ThanhNguyxnOrg/Pixelcraft".slice(
                  0,
                  Math.min(44, Math.floor(local * 1.0)),
                )}
              </code>
              <span
                style={{
                  width: 15,
                  height: 36,
                  background: C.accent,
                  opacity: Math.floor(local / 15) % 2 ? 0.3 : 1,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 53,
                color: C.muted,
                fontSize: 22,
                marginTop: 40,
              }}
            >
              <span>Claude Code</span>
              <span>Codex</span>
              <span>Cursor</span>
              <span>Gemini CLI</span>
              <span>And more ↗</span>
            </div>
            <p
              style={{
                fontFamily: mono,
                fontSize: 17,
                color: C.muted,
                marginTop: 55,
              }}
            >
              OPEN SOURCE · MIT LICENSED · YOUR EXISTING AGENT
            </p>
          </div>
        )}
        {scene === 2 && (
          <div style={{ paddingTop: 30 }}>
            <Label>02 / FRAME THE JOB</Label>
            <Title size={78}>
              A real brief.
              <br />A clear point of view.
            </Title>
            <div
              style={{
                border: `1px solid ${C.line}`,
                borderRadius: 9,
                padding: "33px 40px",
                background: "#101923",
                marginTop: 30,
                maxWidth: 1530,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 15,
                  color: C.accent,
                  marginBottom: 20,
                }}
              >
                YOU → YOUR CODING AGENT
              </div>
              <p
                style={{
                  fontFamily: mono,
                  fontSize: 28,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                “Use Pixelcraft to build an editorial travel site.
                <br />
                Explore three different directions. Keep the existing stack.
                <br />
                Build for mobile too. Render it. Report what you checked.”
              </p>
            </div>
            <p
              style={{
                color: C.muted,
                fontFamily: mono,
                fontSize: 15,
                marginTop: 25,
              }}
            >
              ILLUSTRATIVE AGENT SESSION — NOT A LIVE MODEL RESPONSE
            </p>
          </div>
        )}
        {scene === 3 && (
          <div style={{ paddingTop: 22 }}>
            <Label>03 / DIVERGE BEFORE YOU COMMIT</Label>
            <Title size={80}>
              Not one answer.
              <br />
              Three considered directions.
            </Title>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 28,
                marginTop: 45,
              }}
            >
              {[
                {
                  name: "A / FIELD JOURNAL",
                  bg: "#e2e0ce",
                  ink: "#2b493c",
                  title: "Somewhere\nworth staying.",
                  note: "EDITORIAL · UNHURRIED · MATERIAL-LED",
                  selected: true,
                },
                {
                  name: "B / SWISS INDEX",
                  bg: "#c8d0dc",
                  ink: "#172d48",
                  title: "Find a place.\nMake it yours.",
                  note: "SYSTEMATIC · TYPOGRAPHIC · PRECISE",
                  selected: false,
                },
                {
                  name: "C / OUTDOOR ATLAS",
                  bg: "#183f48",
                  ink: "#d3e9cb",
                  title: "Go a little\nfurther.",
                  note: "CARTOGRAPHIC · EXPANSIVE · EXPLORATORY",
                  selected: false,
                },
              ].map((d, i) => (
                <div
                  key={d.name}
                  style={{
                    opacity: fade(local, i * 10, 12),
                    transform: `translateY(${rise(local, i * 10)}px)`,
                    border: `2px solid ${d.selected ? C.accent : C.line}`,
                    borderRadius: 7,
                    padding: 17,
                    background: "#111922",
                  }}
                >
                  <div
                    style={{
                      background: d.bg,
                      color: d.ink,
                      padding: "25px 23px",
                      minHeight: 245,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: mono,
                        fontSize: 12,
                        marginBottom: 28,
                      }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        fontFamily: i === 0 ? "Georgia,serif" : sans,
                        whiteSpace: "pre-line",
                        fontSize: 43,
                        lineHeight: 1.08,
                        letterSpacing: -1.8,
                      }}
                    >
                      {d.title}
                    </div>
                    <div
                      style={{
                        height: 4,
                        width: i === 2 ? 100 : 40,
                        background: d.ink,
                        marginTop: 22,
                      }}
                    />
                  </div>
                  <div style={{ padding: "23px 7px 8px" }}>
                    <div
                      style={{ fontFamily: mono, fontSize: 11, color: C.muted }}
                    >
                      {d.note}
                    </div>
                    <div
                      style={{
                        marginTop: 15,
                        fontSize: 18,
                        color: d.selected ? C.accent : C.muted,
                      }}
                    >
                      {d.selected
                        ? "✓ Chosen for this brief"
                        : "A different path, not a recolor"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {scene === 4 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Label>04 / BUILD WITH INTENT</Label>
                <Title size={73}>
                  Same brief.
                  <br />A different interface.
                </Title>
              </div>
              <p style={{ color: C.muted, fontSize: 21, paddingBottom: 20 }}>
                Typography. Hierarchy. Material.
                <br />A complete point of view.
              </p>
            </div>
            <div
              style={{
                width: 1345,
                margin: "5px auto 0",
                transform: `scale(${1 + local / 15000})`,
                transformOrigin: "50% 20%",
                boxShadow: "0 30px 90px #0006",
              }}
            >
              <Asset name="web" />
            </div>
          </>
        )}
        {scene === 5 && (
          <>
            <Label>05 / TRANSLATE THE THINKING, NOT THE CSS</Label>
            <Title size={80}>
              Every surface.
              <br />
              Its own language.
            </Title>
            <div style={{ position: "relative", height: 445, marginTop: 25 }}>
              {local < 85 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 100,
                    height: "100%",
                  }}
                >
                  <div style={{ width: 920 }}>
                    <Asset name="mobile" />
                  </div>
                  <div>
                    <Label>MOBILE</Label>
                    <p style={{ fontSize: 38, lineHeight: 1.3, color: C.text }}>
                      Clear priorities.
                      <br />
                      Reachable actions.
                      <br />
                      Room to breathe.
                    </p>
                    <p
                      style={{
                        fontFamily: mono,
                        fontSize: 14,
                        marginTop: 30,
                        color: C.muted,
                      }}
                    >
                      HTML INTERFACE EMULATION
                    </p>
                  </div>
                </div>
              ) : local < 165 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 75,
                    height: "100%",
                  }}
                >
                  <div style={{ width: 1100 }}>
                    <Asset name="desktop" />
                  </div>
                  <div>
                    <Label>DESKTOP</Label>
                    <p style={{ fontSize: 34, lineHeight: 1.4 }}>
                      A workspace
                      <br />
                      built for focus.
                    </p>
                    <p
                      style={{
                        fontFamily: mono,
                        fontSize: 13,
                        marginTop: 25,
                        color: C.muted,
                      }}
                    >
                      HTML EMULATION
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 85,
                    height: "100%",
                  }}
                >
                  <div style={{ width: 1080 }}>
                    <Asset
                      name="terminal"
                      style={{
                        height: 430,
                        objectFit: "contain",
                        objectPosition: "left center",
                      }}
                    />
                  </div>
                  <div>
                    <Label>TERMINAL</Label>
                    <p style={{ fontSize: 34, lineHeight: 1.4 }}>
                      Structure.
                      <br />
                      Rhythm.
                      <br />
                      Clarity.
                    </p>
                    <p
                      style={{
                        fontFamily: mono,
                        fontSize: 13,
                        marginTop: 25,
                        color: C.muted,
                      }}
                    >
                      TUI EMULATION
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 15,
                color: C.muted,
                position: "absolute",
                bottom: -20,
              }}
            >
              ALSO: DATA APPS / EMAIL / DOCUMENTS / MEDIA / CHAT / EXTENSIONS /
              GAMES / SPATIAL UI
            </div>
          </>
        )}
        {scene === 6 && (
          <div style={{ paddingTop: 25 }}>
            <Label>06 / CLOSE THE LOOP</Label>
            <Title size={90}>
              Look at what you made.
              <br />
              <span style={{ color: C.muted }}>Then say what you know.</span>
            </Title>
            <div style={{ display: "flex", gap: 13, marginTop: 65 }}>
              {[
                "Plan",
                "Frame",
                "Diverge",
                "Specify",
                "Build",
                "Verify",
                "Report",
              ].map((name, i) => (
                <div
                  key={name}
                  style={{
                    flex: 1,
                    padding: "20px 15px",
                    borderTop: `2px solid ${local > i * 10 ? C.accent : C.line}`,
                    background: local > i * 10 ? "#142421" : "#101620",
                    opacity: fade(local, i * 7, 10),
                  }}
                >
                  <span
                    style={{ fontFamily: mono, fontSize: 14, color: C.accent }}
                  >
                    0{i}
                  </span>
                  <div style={{ fontSize: 29, fontWeight: 550, marginTop: 15 }}>
                    {name}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 25,
                padding: "31px 0",
                marginTop: 40,
                borderTop: `1px solid ${C.line}`,
                opacity: fade(local, 80),
              }}
            >
              {[
                "rendered",
                "static",
                "model-judgment",
                "not-checked",
                "waived",
              ].map((label, i) => (
                <div
                  key={label}
                  style={{
                    fontFamily: mono,
                    fontSize: 19,
                    color: [C.accent, "#92b5ff", "#e2a8db", C.muted, "#e1d7a2"][
                      i
                    ],
                  }}
                >
                  ● {label}
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: 23,
                color: C.muted,
                opacity: fade(local, 110),
              }}
            >
              A passing build is not a visual review. An unchecked state is not
              a pass.
            </p>
          </div>
        )}
        {scene === 7 && (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Label>OPEN SOURCE. MIT LICENSED. EVERY FRONTEND SURFACE.</Label>
            <Title size={137}>
              Less default.
              <br />
              <span style={{ color: C.accent }}>More deliberate.</span>
            </Title>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginTop: 35,
              }}
            >
              <div
                style={{
                  border: `1px solid #487969`,
                  background: "#152e26",
                  borderRadius: 7,
                  padding: "22px 30px",
                  fontFamily: mono,
                  fontSize: 25,
                  color: "#bdebd6",
                }}
              >
                <span style={{ color: C.accent, marginRight: 18 }}>$</span>npx
                skills add ThanhNguyxnOrg/Pixelcraft
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 19,
                  color: C.muted,
                  lineHeight: 1.7,
                }}
              >
                26 FOCUSED SKILLS
                <br />
                ONE BETTER PROCESS ↗
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 42,
          left: 88,
          right: 88,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${C.line}`,
          paddingTop: 20,
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 14,
            color: C.muted,
            letterSpacing: 1.1,
          }}
        >
          {caption}
        </span>
        <span style={{ fontFamily: mono, fontSize: 14, color: C.accent }}>
          {String(scene + 1).padStart(2, "0")} / 08
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 3,
          width: `${((f + 1) / 1200) * 100}%`,
          background: C.accent,
        }}
      />
    </AbsoluteFill>
  );
};

registerRoot(() => (
  <Composition
    id="PixelcraftPromo"
    component={Promo}
    durationInFrames={1200}
    fps={30}
    width={1920}
    height={1080}
  />
));
