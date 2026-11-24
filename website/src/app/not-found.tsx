export default function NotFound() {
  return (
    <>
      <section className="not-found shell">
        <span className="section-kicker">A small wrong turn</span>
        <h1>
          404<span>.</span>
        </h1>
        <h2>This pixel is missing.</h2>
        <p>The page may have moved. The rest of the toolkit is right here.</p>
        <a className="button button-primary" href="/">
          Back to Pixelcraft ↗
        </a>
      </section>
    </>
  );
}
