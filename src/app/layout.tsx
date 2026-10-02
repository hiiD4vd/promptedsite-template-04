import type { Metadata } from "next";
import "./globals.css";

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
    <html suppressHydrationWarning className="w-mod-js w-mod-ix lenis" data-wf-domain="www.promptedsite.com" data-wf-page="69fb53371d5b8e9c3f4e4c6a" data-wf-site="69fb53371d5b8e9c3f4e4c69" lang="en-US" style={{ '--color-scheme-1--taste-primary': '#3D2B68', '--color-scheme-1--taste-secondary': '#9089D3' } as any}>
      <head>
        <link rel="stylesheet" href="/69fb53371d5b8e9c3f4e4c69/css/promptedsite.webflow.shared.f33632a1c.min.css" />

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
      <body suppressHydrationWarning style={{ '--loader-reveal': '65.1714vh' } as any}>
        {children}

        <script src="/js/jquery-3.5.1.min.dc5e7f18c8.js" defer></script>
        <script src="/69fb53371d5b8e9c3f4e4c69/js/webflow.9a82b613.29781a31e070a6c4.js" defer></script>
        <script src="/gsap/3.15.0/gsap.min.js" defer></script>
        <script src="/gsap/3.15.0/ScrollTrigger.min.js" defer></script>
        <script src="/gsap/3.15.0/SplitText.min.js" defer></script>
        <script src="/app-init.js" defer></script>
        <script type="module" src="/app-module.js"></script>

                        
        
        
        
        
      </body>
    </html>
  );
}
