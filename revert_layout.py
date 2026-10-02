import os
import re

filepath = r'd:\daud\sourcecode\scrape\ciao-next\src\app\layout.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r'<ScriptLoader />\n*', '', code)
code = re.sub(r'<ErrorLogger />\n*', '', code)
code = re.sub(r'import ScriptLoader from "./ScriptLoader";\n', '', code)
code = re.sub(r'import ErrorLogger from "./ErrorLogger";\n', '', code)

scripts = """
        <Script src="/js/jquery-3.5.1.min.dc5e7f18c8.js" strategy="beforeInteractive" />
        <Script src="/69fb53371d5b8e9c3f4e4c69/js/webflow.9a82b613.29781a31e070a6c4.js" strategy="beforeInteractive" />
        <Script src="/gsap/3.15.0/gsap.min.js" strategy="beforeInteractive" />
        <Script src="/gsap/3.15.0/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="/gsap/3.15.0/SplitText.min.js" strategy="beforeInteractive" />
        <Script src="/app-init.js" strategy="beforeInteractive" />
        <script type="module" src="/app-module.js"></script>
"""

code = code.replace('{children}', '{children}\n' + scripts)
if 'import Script from' not in code:
    code = code.replace('import "./globals.css";', 'import "./globals.css";\nimport Script from "next/script";')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated layout.tsx")
