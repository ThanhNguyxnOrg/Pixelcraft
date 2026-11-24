import type { Metadata } from "next";
import "../styles/global.css";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import Header from "../components/Header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Pixelcraft — Less default. More deliberate.",
  description:
    "Design intelligence for your coding agent. Portable, open-source skills for distinctive interfaces and rigorous UX on every frontend surface.",
  icons: { icon: "/images/favicon.png", apple: "/images/icon-512.png" },
  openGraph: {
    title: "Pixelcraft — Less default. More deliberate.",
    description:
      "Design intelligence for coding agents. Every frontend surface.",
    type: "website",
    images: siteUrl ? ["/images/social-preview.png"] : [],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport = { themeColor: "#090d14" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="manifest"
          href="/site.webmanifest"
          crossOrigin="use-credentials"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer className="site-footer shell">
          <div className="footer-top">
            <a href="/" className="wordmark">
              <img
                src="/images/pixelcraft-logo.png"
                width="30"
                height="30"
                alt=""
              />
              pixelcraft<span className="wordmark-dot">.</span>
            </a>
            <p>
              A little more thought.
              <br />A very different interface.
            </p>
          </div>
          <div className="footer-bottom">
            <span>Open source. MIT licensed. v0.1.0.</span>
            <div>
              <a href="/guide/">Documentation</a>
              <a href="/film/">The film</a>
              <a href="https://github.com/ThanhNguyxnOrg/Pixelcraft">
                Source ↗
              </a>
              <a href="https://github.com/ThanhNguyxnOrg/Pixelcraft/blob/main/LICENSE">
                License
              </a>
            </div>
            <span>Built with Pixelcraft.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
