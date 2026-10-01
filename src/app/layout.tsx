import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "PROMPTEDSITE - The perfect energy drink",
  description: "PROMPTEDSITE, a zero bullshit energy drink range. Less sugar. Natural flavors. Plant-based caffeine. Vitamins. Stevia extracts. 6 flavors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="w-mod-js w-mod-ix lenis" data-wf-domain="www.promptedsite.com" data-wf-page="69fb53371d5b8e9c3f4e4c6a" data-wf-site="69fb53371d5b8e9c3f4e4c69" lang="en-US" style={{ '--color-scheme-1--taste-primary': '#3D2B68', '--color-scheme-1--taste-secondary': '#9089D3' } as any}>
      <head>
        <link rel="stylesheet" href="/69fb53371d5b8e9c3f4e4c69/css/promptedsite.webflow.shared.f33632a1c.min.css" />
        <link rel="icon" href="/69fb53371d5b8e9c3f4e4c69/6a1d9bb2854e5557fe84e7d1_PROMPTEDSITE_energy-fav-dark.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/69fb53371d5b8e9c3f4e4c69/6a1d9bbc9f7df9f37325d9f3_PROMPTEDSITE_energy-fav-light.png" media="(prefers-color-scheme: dark)" />
        <link rel="apple-touch-icon" sizes="180x180" href="/69fb53371d5b8e9c3f4e4c69/6a1d9bb2da9b342b80d39042_PROMPTEDSITE_energy-fav-dark.png" />
        <style dangerouslySetInnerHTML={{__html: `
          .wf-force-outline-none[tabindex="-1"]:focus{outline:none;}
          * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; -o-font-smoothing: antialiased; }
          html.lenis { height: auto; }
          .lenis.lenis-smooth { scroll-behavior: auto; }
          .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
          .lenis.lenis-stopped { overflow: hidden; }
          canvas { position: fixed; inset: 0; }
          .section { pointer-events: none; }
          .gamme_container, .profile_container, .benefits_container, .argument_container, .carousel_title-bis-wrapper, .scan_container { position: fixed; inset: 0; }
          .benefits_nav { position: fixed; }
          .loader { display: flex; }
        `}} />
        <script type="importmap" dangerouslySetInnerHTML={{__html: `
          {
            "imports": {
              "three": "/npm/three@0.161.0/build/three.module.js",
              "three/addons/": "/npm/three@0.161.0/examples/jsm/"
            }
          }
        `}} />
      </head>
      <body style={{ '--loader-reveal': '65.1714vh' } as any}>
        {children}
        <Script src="/js/jquery-3.5.1.min.dc5e7f18c8.js" strategy="lazyOnload" />
        <Script src="/69fb53371d5b8e9c3f4e4c69/js/webflow.9a82b613.29781a31e070a6c4.js" strategy="lazyOnload" />
        <Script src="/gsap/3.15.0/gsap.min.js" strategy="lazyOnload" />
        <Script src="/gsap/3.15.0/ScrollTrigger.min.js" strategy="lazyOnload" />
        <Script src="/gsap/3.15.0/SplitText.min.js" strategy="lazyOnload" />
        <Script id="gsap-register" strategy="lazyOnload" dangerouslySetInnerHTML={{__html: `gsap.registerPlugin(ScrollTrigger,SplitText);`}} />
      </body>
    </html>
  );
}
