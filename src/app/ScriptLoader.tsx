"use client";
import { useEffect } from "react";

export default function ScriptLoader() {
  useEffect(() => {
    if ((window as any).__scriptsLoaded) return;
    (window as any).__scriptsLoaded = true;

    const loadScript = (src: string, type = "text/javascript") => {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.type = type;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });
    };

    const init = async () => {
      try {
        await loadScript("/js/jquery-3.5.1.min.dc5e7f18c8.js");
        await loadScript("/69fb53371d5b8e9c3f4e4c69/js/webflow.9a82b613.29781a31e070a6c4.js");
        await loadScript("/gsap/3.15.0/gsap.min.js");
        await loadScript("/gsap/3.15.0/ScrollTrigger.min.js");
        await loadScript("/gsap/3.15.0/SplitText.min.js");
        await loadScript("/app-init.js");
        await loadScript("/app-module.js", "module");
      } catch (e) {
        console.error("Failed to load script", e);
      }
    };
    init();
  }, []);
  return null;
}
