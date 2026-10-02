import os
import re

page_path = r'd:\daud\sourcecode\scrape\ciao-next\src\app\page.tsx'
layout_path = r'd:\daud\sourcecode\scrape\ciao-next\src\app\layout.tsx'

with open(page_path, 'r', encoding='utf-8') as f:
    page_code = f.read()

inline_scripts = re.findall(r'<Script id="page-script-\d+" type="(.*?)">\{`(.*?)`\}</Script>', page_code, flags=re.DOTALL)
regular_js = []
module_js = []

for t, content in inline_scripts:
    content = content.replace('\\`', '`').replace('\\$', '$')
    if t == 'module':
        module_js.append(content)
    else:
        regular_js.append(content)

regular_js.insert(0, "gsap.registerPlugin(ScrollTrigger,SplitText);")

with open(r'd:\daud\sourcecode\scrape\ciao-next\public\app-init.js', 'w', encoding='utf-8') as f:
    f.write('\n\n'.join(regular_js))

with open(r'd:\daud\sourcecode\scrape\ciao-next\public\app-module.js', 'w', encoding='utf-8') as f:
    f.write('\n\n'.join(module_js))

page_code = re.sub(r'<Script id="page-script-\d+".*?</Script>', '', page_code, flags=re.DOTALL)
page_code = page_code.replace("import Script from 'next/script';", "")
with open(page_path, 'w', encoding='utf-8') as f:
    f.write(page_code)

with open(layout_path, 'r', encoding='utf-8') as f:
    layout_code = f.read()

layout_code = re.sub(r'<Script .*?</Script>', '', layout_code, flags=re.DOTALL)
layout_code = re.sub(r'import Script from "next/script";\n', '', layout_code)

with open(r'd:\daud\sourcecode\scrape\ciao-next\src\app\ScriptLoader.tsx', 'w', encoding='utf-8') as f:
    f.write('''"use client";
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
''')

layout_code = layout_code.replace('import "./globals.css";', 'import "./globals.css";\nimport ScriptLoader from "./ScriptLoader";')
layout_code = layout_code.replace('{children}', '{children}\n        <ScriptLoader />')

with open(layout_path, 'w', encoding='utf-8') as f:
    f.write(layout_code)

print("Refactored successfully")
