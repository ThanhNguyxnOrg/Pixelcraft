import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Img,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  registerRoot,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

const paper = "#f5f2ea";
const ink = "#242426";
const blue = "#3439ce";
const orange = "#bd4229";
const sans = "Film Manrope, sans-serif";
const serif = "Film Serif, Georgia, serif";
const mono = "Film Mono, monospace";
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const tween = (f: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(f, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
const pop = (f: number, delay = 0) =>
  spring({
    fps: 30,
    frame: Math.max(0, f - delay),
    config: { damping: 22, stiffness: 130, mass: 1 },
  });

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: "48px 80px auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 8,
        color: light ? paper : ink,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <Img
          src={staticFile("images/pixelcraft-logo.png")}
          style={{ width: 42, height: 42 }}
        />
        <span style={{ fontSize: 30, fontWeight: 750, letterSpacing: -1.4 }}>
          pixelcraft.
        </span>
      </div>
      <span style={{ font: `13px ${mono}`, letterSpacing: 1.5 }}>
        DESIGN INTELLIGENCE / v0.1.0
      </span>
    </div>
  );
}
function Label({
  children,
  color = blue,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div style={{ font: `14px ${mono}`, letterSpacing: 1.4, color }}>
      {children}
    </div>
  );
}
function Asset({
  name,
  style = {},
}: {
  name: string;
  style?: React.CSSProperties;
}) {
  return (
    <Img
      src={staticFile(`video/assets/${name}.png`)}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
        ...style,
      }}
    />
  );
}
function Scene({
  children,
  background = paper,
  first = false,
}: {
  children: React.ReactNode;
  background?: string;
  first?: boolean;
}) {
  const f = useCurrentFrame();
  const reveal = first ? 1 : tween(f, 0, 14);
  return (
    <AbsoluteFill
      style={{
        background,
        color: ink,
        clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
}
function Roll({
  text,
  frame,
  delay = 0,
  size = 225,
  color = ink,
}: {
  text: string;
  frame: number;
  delay?: number;
  size?: number;
  color?: string;
}) {
  return (
    <div
      aria-label={text}
      style={{
        display: "flex",
        overflow: "hidden",
        fontSize: size,
        fontWeight: 650,
        lineHeight: 1.08,
        letterSpacing: -size * 0.065,
        color,
      }}
    >
      {[...text].map((letter, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            minWidth: letter === " " ? size * 0.25 : undefined,
            transform: `translateY(${(1 - pop(frame, delay + i * 3)) * 115}%) rotate(${(1 - pop(frame, delay + i * 3)) * 12}deg)`,
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
function Opening() {
  const f = useCurrentFrame();
  return (
    <Scene first>
      <Brand />
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 170,
          transform: `translateX(${tween(f, 65, 105, 0, -35)}px)`,
        }}
      >
        <Roll text="GOOD CODE." frame={f} size={235} />
        <Roll
          text="IS A START."
          frame={f}
          delay={22}
          size={235}
          color={orange}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 115,
          bottom: 160,
          transform: `translateY(${tween(f, 50, 80, 45, 0)}px)`,
          opacity: tween(f, 50, 70),
        }}
      >
        <Label>A CODING-AGENT SKILL PACK.</Label>
        <p style={{ fontSize: 35, margin: "19px 0 0", letterSpacing: -1 }}>
          Not another UI template.
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          bottom: 145,
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: blue,
          display: "grid",
          placeItems: "center",
          color: paper,
          fontSize: 60,
          transform: `rotate(${tween(f, 40, 90, -90, -20)}deg) scale(${pop(f, 35)})`,
        }}
      >
        ↗
      </div>
    </Scene>
  );
}
function Instinct() {
  const f = useCurrentFrame();
  return (
    <Scene>
      <Brand />
      <div style={{ position: "absolute", top: 183, left: 105 }}>
        <Label>01 / INSTALL A BETTER WAY OF THINKING</Label>
        <h1
          style={{
            fontSize: 143,
            fontWeight: 550,
            letterSpacing: -10,
            lineHeight: 1.02,
            margin: "37px 0 0",
            transform: `translateY(${(1 - pop(f, 8)) * 100}px)`,
          }}
        >
          Your agent.
          <br />
          With a point
          <br />
          of{" "}
          <em
            style={{
              fontFamily: serif,
              fontWeight: 400,
              color: orange,
              fontSize: 181,
            }}
          >
            view.
          </em>
        </h1>
      </div>
      <div
        style={{
          position: "absolute",
          width: 555,
          height: 555,
          right: 120,
          top: 205,
          borderRadius: "50% 50% 8% 8%",
          background: "#dce5ce",
          transform: `rotate(${tween(f, 0, 100, 12, -5)}deg) scale(${0.75 + pop(f, 12) * 0.25})`,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("images/alpine-lake.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: "auto 35px 30px",
            color: "white",
            font: `italic 81px/.9 ${serif}`,
            letterSpacing: -3,
          }}
        >
          Not the first
          <br />
          plausible answer.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 105,
          right: 105,
          bottom: 78,
          borderRadius: 70,
          background: ink,
          color: paper,
          padding: "27px 35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transform: `translateY(${(1 - pop(f, 42)) * 160}px)`,
        }}
      >
        <code style={{ font: `25px ${mono}` }}>
          <span style={{ color: "#d8f694", marginRight: 20 }}>$</span>npx skills
          add ThanhNguyxnOrg/Pixelcraft
        </code>
        <span style={{ font: `13px ${mono}`, color: "#d6d4ca" }}>
          YOUR AGENT. YOUR STACK. ↗
        </span>
      </div>
    </Scene>
  );
}
function Directions() {
  const f = useCurrentFrame();
  const spread = tween(f, 22, 82);
  return (
    <Scene>
      <Brand />
      <div style={{ position: "absolute", top: 145, left: 105 }}>
        <Label>02 / FRAME. DIVERGE. CHOOSE.</Label>
        <h1
          style={{
            fontSize: 99,
            letterSpacing: -6,
            fontWeight: 550,
            margin: "19px 0 0",
          }}
        >
          One brief.{" "}
          <em style={{ fontFamily: serif, color: orange, fontWeight: 400 }}>
            More possibility.
          </em>
        </h1>
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 345,
          width: 260,
          opacity: tween(f, 0, 16, 1, 0.9),
        }}
      >
        <Label>THE ILLUSTRATIVE BRIEF</Label>
        <p
          style={{
            font: `45px/1.15 ${serif}`,
            marginTop: 20,
            letterSpacing: -1,
          }}
        >
          A travel brand.
          <br />
          Unhurried places.
          <br />
          <em>Nothing generic.</em>
        </p>
        <div
          style={{ font: `12px/1.9 ${mono}`, color: "#69655e", marginTop: 28 }}
        >
          Authored demonstration.
          <br />
          Not a live model response.
        </div>
      </div>
      {["editorial", "electric", "sunlit"].map((name, i) => {
        const x = 1095 + (i - 1) * 465 * spread;
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              top: 410 + (i === 1 ? 15 : 50) * spread,
              left: x,
              width: 460,
              height: 360,
              borderRadius: 12,
              boxShadow: "0 25px 65px #29231e25",
              overflow: "hidden",
              transform: `translateX(-50%) translateY(${(1 - pop(f, 10 + i * 9)) * 400}px) rotate(${(i - 1) * 8 * spread}deg)`,
              zIndex: i === 1 ? 3 : 2,
            }}
          >
            <Asset name={`direction-${name}`} />
            <span
              style={{
                position: "absolute",
                bottom: 15,
                left: 17,
                background: paper,
                color: ink,
                borderRadius: 20,
                padding: "8px 13px",
                font: `12px ${mono}`,
                textTransform: "uppercase",
              }}
            >
              {name}
            </span>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          bottom: 78,
          right: 115,
          font: `15px ${mono}`,
          color: blue,
          opacity: tween(f, 95, 115),
        }}
      >
        NOT THREE COLORS. THREE POINTS OF VIEW. ↗
      </div>
    </Scene>
  );
}
function Transformation() {
  const f = useCurrentFrame();
  const reveal = tween(f, 45, 100);
  return (
    <Scene>
      <Brand />
      <div style={{ position: "absolute", left: 105, top: 145 }}>
        <Label>03 / BUILD THE WHOLE EXPERIENCE</Label>
        <h1
          style={{
            fontSize: 90,
            fontWeight: 550,
            letterSpacing: -5,
            margin: "20px 0 0",
          }}
        >
          A different kind of{" "}
          <em style={{ fontFamily: serif, color: orange, fontWeight: 400 }}>
            somewhere.
          </em>
        </h1>
      </div>
      <div
        style={{
          position: "absolute",
          top: 324,
          left: 185,
          width: 1550,
          height: 595,
          borderRadius: 20,
          background: "#e7e9df",
          overflow: "hidden",
          boxShadow: "0 30px 70px #26252125",
          transform: `perspective(1800px) rotateY(${tween(f, 0, 70, -7, 0)}deg) rotateZ(${tween(f, 0, 75, -2.8, 0)}deg) scale(${tween(f, 100, 230, 1, 1.045)})`,
        }}
      >
        <Asset name="before" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#e7e9df",
            clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
          }}
        >
          <Asset name="web" />
        </div>
        {reveal > 0 && reveal < 1 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${reveal * 100}%`,
              width: 5,
              background: blue,
            }}
          />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 110,
          right: 110,
          display: "flex",
          justifyContent: "space-between",
          font: `14px ${mono}`,
          color: "#625e57",
        }}
      >
        <span>
          {reveal < 0.5
            ? "BEFORE / THE FAMILIAR FIRST DRAFT"
            : "WITH PIXELCRAFT / AN AUTHORED EXAMPLE"}
        </span>
        <span>HIERARCHY. RHYTHM. CHARACTER.</span>
      </div>
    </Scene>
  );
}
function Surfaces() {
  const f = useCurrentFrame();
  const part = f < 75 ? 0 : f < 150 ? 1 : 2;
  const local = f - [0, 75, 150][part];
  return (
    <Scene background="#e4e4f0">
      <Brand />
      {part === 0 && (
        <>
          <div
            style={{
              position: "absolute",
              top: 235,
              left: 150,
              transform: `translateX(${(1 - pop(local)) * -140}px)`,
            }}
          >
            <Label>04 / MOBILE</Label>
            <h1
              style={{
                fontSize: 115,
                fontWeight: 550,
                lineHeight: 1.02,
                letterSpacing: -7,
                margin: "35px 0 0",
              }}
            >
              Native-minded.
              <br />
              <em style={{ fontFamily: serif, color: blue, fontWeight: 400 }}>
                Not web-shaped.
              </em>
            </h1>
            <p
              style={{
                fontSize: 25,
                lineHeight: 1.6,
                color: "#5e5b6d",
                marginTop: 40,
              }}
            >
              Clear priorities.
              <br />
              Reachable actions.
              <br />
              Room to breathe.
            </p>
            <div style={{ marginTop: 38 }}>
              <Label color="#625c72">HTML INTERFACE EMULATION</Label>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: 285,
              top: 150,
              width: 440,
              height: 800,
              filter: "drop-shadow(0 35px 35px #24205035)",
              transform: `perspective(1200px) rotateY(${tween(local, 0, 65, -14, 1)}deg) rotateZ(${tween(local, 0, 70, 7, -3)}deg) translateY(${(1 - pop(local, 4)) * 750}px)`,
            }}
          >
            <Asset name="mobile" />
          </div>
        </>
      )}
      {part === 1 && (
        <>
          <div style={{ position: "absolute", left: 105, top: 145 }}>
            <Label>04 / DESKTOP</Label>
            <h1
              style={{
                fontSize: 99,
                fontWeight: 550,
                letterSpacing: -6,
                margin: "20px 0 0",
              }}
            >
              Dense.{" "}
              <em style={{ fontFamily: serif, color: blue, fontWeight: 400 }}>
                Not difficult.
              </em>
            </h1>
          </div>
          <div
            style={{
              position: "absolute",
              top: 320,
              left: 190,
              width: 1540,
              height: 575,
              filter: "drop-shadow(0 25px 35px #24205025)",
              transform: `perspective(1800px) rotateX(${tween(local, 0, 60, 9, 0)}deg) translateY(${(1 - pop(local)) * 450}px) scale(${tween(local, 0, 70, 0.9, 1.025)})`,
            }}
          >
            <Asset name="desktop" />
          </div>
          <div style={{ position: "absolute", bottom: 65, right: 110 }}>
            <Label color="#625c72">WORKSPACE / HTML EMULATION</Label>
          </div>
        </>
      )}
      {part === 2 && (
        <>
          <div style={{ position: "absolute", left: 105, top: 145 }}>
            <Label>04 / TERMINAL</Label>
            <h1
              style={{
                fontSize: 99,
                fontWeight: 550,
                letterSpacing: -6,
                margin: "20px 0 0",
              }}
            >
              Even here,{" "}
              <em style={{ fontFamily: serif, color: blue, fontWeight: 400 }}>
                intent matters.
              </em>
            </h1>
          </div>
          <div
            style={{
              position: "absolute",
              top: 325,
              left: 245,
              width: 1430,
              height: 610,
              filter: "drop-shadow(0 25px 40px #24205030)",
              transform: `translateY(${(1 - pop(local)) * 140}px) scale(${tween(local, 0, 90, 0.96, 1.015)})`,
            }}
          >
            <Asset name="terminal" />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 58,
              left: 110,
              right: 110,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Label color="#625c72">
              TUI EMULATION / ILLUSTRATIVE OUTPUT, NOT AN EXECUTED REVIEW
            </Label>
            <Label>EVERY FRONTEND SURFACE ↗</Label>
          </div>
        </>
      )}
    </Scene>
  );
}
function Rigor() {
  const f = useCurrentFrame();
  const stages = [
    "Plan",
    "Frame",
    "Diverge",
    "Specify",
    "Build",
    "Verify",
    "Report",
  ];
  return (
    <Scene background={blue}>
      <Brand light />
      <div style={{ position: "absolute", top: 190, left: 105, color: paper }}>
        <Label color="#d5ee98">05 / FREEDOM IS NOT A SHORTCUT</Label>
        <h1
          style={{
            fontSize: 130,
            fontWeight: 500,
            letterSpacing: -8,
            lineHeight: 1.02,
            margin: "38px 0 0",
            transform: `translateX(${(1 - pop(f, 5)) * -200}px)`,
          }}
        >
          Freedom in the look.
          <br />
          <em style={{ fontFamily: serif, fontWeight: 400, color: "#d9f293" }}>
            Rigor in the work.
          </em>
        </h1>
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 570,
          display: "flex",
          gap: 15,
        }}
      >
        {stages.map((name, i) => (
          <div
            key={name}
            style={{
              flex: 1,
              transform: `translateY(${(1 - pop(f, 25 + i * 5)) * 120}px)`,
              color: paper,
            }}
          >
            <div
              style={{
                borderTop: "1px solid #a5a8ef",
                paddingTop: 16,
                font: `13px ${mono}`,
                color: "#d5d7ff",
              }}
            >
              0{i}
            </div>
            <div style={{ fontSize: 38, letterSpacing: -1.4, marginTop: 13 }}>
              {name}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          bottom: 133,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: tween(f, 80, 105),
        }}
      >
        <Label color="#d5ee98">SAY WHAT YOU ACTUALLY CHECKED.</Label>
        {["rendered", "static", "model-judgment", "not-checked", "waived"].map(
          (name) => (
            <span
              key={name}
              style={{
                color: paper,
                border: "1px solid #979ce5",
                borderRadius: 40,
                padding: "12px 18px",
                font: `13px ${mono}`,
              }}
            >
              {name}
            </span>
          ),
        )}
      </div>
    </Scene>
  );
}
function Closing() {
  const f = useCurrentFrame();
  return (
    <Scene>
      <Brand />
      <div style={{ position: "absolute", left: 105, top: 180 }}>
        <Label>26 FOCUSED SKILLS. NO FIXED AESTHETIC.</Label>
        <h1
          style={{
            fontSize: 145,
            lineHeight: 1,
            fontWeight: 550,
            letterSpacing: -9,
            margin: "35px 0 0",
            transform: `translateY(${(1 - pop(f, 8)) * 130}px)`,
          }}
        >
          Make something
          <br />
          unmistakably
          <br />
          <em
            style={{
              fontFamily: serif,
              fontWeight: 400,
              fontSize: 205,
              color: orange,
            }}
          >
            yours.
          </em>
        </h1>
      </div>
      <div
        style={{
          position: "absolute",
          width: 410,
          height: 410,
          right: 100,
          top: 285,
          borderRadius: "50%",
          background: "#e1e3f5",
          display: "grid",
          placeItems: "center",
          transform: `scale(${0.7 + pop(f, 15) * 0.3}) rotate(${tween(f, 0, 160, -13, 9)}deg)`,
        }}
      >
        <Img
          src={staticFile("images/pixelcraft-logo.png")}
          style={{ width: 240, height: 240, imageRendering: "pixelated" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 105,
          right: 105,
          bottom: 85,
          background: blue,
          color: paper,
          borderRadius: 70,
          padding: "30px 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transform: `translateY(${(1 - pop(f, 35)) * 160}px)`,
        }}
      >
        <code style={{ font: `25px ${mono}` }}>
          <span style={{ color: "#d6f293", marginRight: 20 }}>$</span>npx skills
          add ThanhNguyxnOrg/Pixelcraft
        </code>
        <div
          style={{
            textAlign: "right",
            font: `12px/1.7 ${mono}`,
            color: "#e4e6ff",
          }}
        >
          OPEN SOURCE. MIT LICENSED.
          <br />
          YOUR NEXT INTERFACE STARTS HERE. ↗
        </div>
      </div>
    </Scene>
  );
}

function Promo() {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading bundled film fonts"));
  useEffect(() => {
    Promise.all([
      document.fonts.load('550 100px "Film Manrope"'),
      document.fonts.load('400 25px "Film Mono"'),
      document.fonts.load('400 150px "Film Serif"'),
      document.fonts.load('italic 400 150px "Film Serif"'),
    ])
      .then(() => continueRender(handle))
      .catch(cancelRender);
  }, [handle]);
  return (
    <AbsoluteFill style={{ fontFamily: sans, background: paper }}>
      <style>{`@font-face{font-family:'Film Manrope';src:url('${staticFile("video/assets/manrope.woff2")}') format('woff2');font-weight:200 800}@font-face{font-family:'Film Mono';src:url('${staticFile("video/assets/mono.woff2")}') format('woff2');font-weight:400}@font-face{font-family:'Film Serif';src:url('${staticFile("video/assets/serif-normal.woff2")}') format('woff2');font-weight:400}@font-face{font-family:'Film Serif';src:url('${staticFile("video/assets/serif-italic.woff2")}') format('woff2');font-weight:400;font-style:italic}*{box-sizing:border-box}h1,p{padding:0}`}</style>
      <Audio src={staticFile("video/assets/soundtrack.m4a")} volume={0.85} />
      <Sequence from={0} durationInFrames={120}>
        <Opening />
      </Sequence>
      <Sequence from={105} durationInFrames={135}>
        <Instinct />
      </Sequence>
      <Sequence from={225} durationInFrames={165}>
        <Directions />
      </Sequence>
      <Sequence from={375} durationInFrames={240}>
        <Transformation />
      </Sequence>
      <Sequence from={600} durationInFrames={255}>
        <Surfaces />
      </Sequence>
      <Sequence from={840} durationInFrames={195}>
        <Rigor />
      </Sequence>
      <Sequence from={1020} durationInFrames={180}>
        <Closing />
      </Sequence>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          height: 4,
          width: `${(f + 1) / 12}%`,
          background: f >= 840 && f < 1020 ? "#d6f293" : blue,
        }}
      />
    </AbsoluteFill>
  );
}
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
