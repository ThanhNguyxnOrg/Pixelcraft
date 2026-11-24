export const metadata = { title: "Pixelcraft in motion — The film" };
const transcript = [
  [
    "00:00",
    "The first answer is not the only answer.",
    "A familiar, generic travel interface. Same brief. No clear point of view.",
  ],
  [
    "00:05",
    "Start with Pixelcraft.",
    "Install the skill pack in your coding agent. Frame the project with a concrete brief.",
  ],
  [
    "00:12",
    "Explore. Choose. Build.",
    "Three visual directions, one considered choice. The illustrative Elsewhere project becomes an editorial interface.",
  ],
  [
    "00:20",
    "Every surface. Its own language.",
    "The same design thinking translates into mobile, desktop, and terminal interface emulations.",
  ],
  [
    "00:28",
    "Look at what you made.",
    "Plan, Frame, Diverge, Specify, Build, Verify, Report. Evidence labels distinguish rendered checks, source inspection, judgment, and unknowns.",
  ],
  [
    "00:35",
    "Less default. More deliberate.",
    "Pixelcraft. Open source. MIT licensed. Bring a better process to your next interface.",
  ],
];
export default function Film() {
  return (
    <>
      <header className="page-hero shell">
        <div className="breadcrumbs">
          <a href="/">Pixelcraft</a>
          <span>/</span>
          <span>The film</span>
        </div>
        <span className="section-kicker">Pixelcraft / in practice</span>
        <h1>
          From prompt.
          <br />
          To point of view.
        </h1>
        <p>
          A short look at a more deliberate workflow. Real interface specimens.
          An illustrative agent session. No magic claims.
        </p>
      </header>
      <section
        className="film-page shell"
        aria-label="Pixelcraft promotional film"
      >
        <video
          className="film-video"
          controls
          playsInline
          preload="none"
          poster="/video/poster.jpg"
          aria-label="Pixelcraft: Less default, more deliberate. Promotional film"
        >
          <source src="/video/pixelcraft-promo.mp4" type="video/mp4" />
          <track
            kind="captions"
            src="/video/captions-en.vtt"
            srcLang="en"
            label="English"
            default
          />
          <track
            kind="captions"
            src="/video/captions-vi.vtt"
            srcLang="vi"
            label="Tiếng Việt"
          />
          Your browser cannot play this video.{" "}
          <a href="/video/pixelcraft-promo.mp4">Download the film</a> or read
          the transcript below.
        </video>
        <div className="film-toolbar">
          <p>40 SECONDS / 1080P / CAPTIONS IN ENGLISH & VIETNAMESE</p>
          <a
            href="/video/pixelcraft-promo.mp4"
            download="pixelcraft-promo.mp4"
            className="button button-outline"
          >
            Download the film <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="film-transcript">
          <div>
            <span className="section-kicker">The story, in words</span>
            <h2>
              A workflow.
              <br />
              Not a magic trick.
            </h2>
            <p style={{ fontSize: 12, marginTop: 20 }}>
              The agent sequence is an authored demonstration, not a recording
              of a live model response. The interface specimens are the same
              examples you can explore on this site.
            </p>
            <a
              href="/video/captions-vi.vtt"
              className="text-link"
              style={{ fontSize: 11, marginTop: 15 }}
              download
            >
              Vietnamese captions ↓
            </a>
          </div>
          <ol>
            {transcript.map(([time, title, text]) => (
              <li>
                <time>{time}</time>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
