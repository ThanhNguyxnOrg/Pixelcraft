"use client";
import { useEffect, useRef, useState } from "react";

export default function CopyButton({
  target,
  label = "Copy command",
}: {
  target: string;
  label?: string;
}) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    const node = document.getElementById(target);
    if (!node) return;
    try {
      await navigator.clipboard.writeText(node.textContent?.trim() ?? "");
      setMessage("Command copied. Paste it into your terminal.");
    } catch {
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      setMessage("Clipboard unavailable. Command selected — copy it manually.");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 5000);
  }
  return (
    <>
      <button
        type="button"
        className="copy-button"
        onClick={copy}
        aria-label={label}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V4H4v12h4" />
        </svg>
      </button>
      <span
        className={`toast ${message ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </span>
    </>
  );
}
