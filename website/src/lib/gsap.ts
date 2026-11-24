import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);

// Motion tokens (pixelcraft-craft/motion.md): input acknowledgement fast, state changes short, scenes longer.
export const EASE = {
  out: "expo.out",
  inOut: "power3.inOut",
  snap: "power4.out",
};
export const DUR = { feedback: 0.12, state: 0.35, scene: 0.9 };

/** Everything decorative runs only when the user has not asked for reduced motion. */
export const MOTION_OK =
  "(prefers-reduced-motion: no-preference) and (forced-colors: none)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
