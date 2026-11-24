"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <motion.div
        className="reading-progress"
        style={{ scaleX: reduce ? 0 : scrollYProgress }}
        aria-hidden="true"
      />
      <header className="site-header">
        <div className="shell header-inner">
          <a href="/" className="wordmark" aria-label="Pixelcraft home">
            <img
              src="/images/pixelcraft-logo.png"
              width="34"
              height="34"
              alt=""
            />
            pixelcraft<span className="wordmark-dot">.</span>
          </a>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            Menu <span aria-hidden="true">+</span>
          </button>
          <nav
            id="main-nav"
            className={open ? "is-open" : ""}
            aria-label="Main navigation"
            onClick={() => setOpen(false)}
          >
            <a href="/#difference">The difference</a>
            <a href="/#skills">Skills</a>
            <a href="/guide/">Docs</a>
            <a
              href="https://github.com/ThanhNguyxnOrg/Pixelcraft"
              target="_blank"
              rel="noreferrer"
              className="github-link"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <motion.a
              href="/#install"
              className="nav-install"
              whileHover={reduce ? {} : { y: -2 }}
              whileTap={reduce ? {} : { scale: 0.98 }}
            >
              Get Pixelcraft <span aria-hidden="true">↗</span>
            </motion.a>
          </nav>
        </div>
      </header>
    </>
  );
}
