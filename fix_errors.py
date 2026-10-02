import os
import re

# Fix layout.tsx
layout_path = r'd:\daud\sourcecode\scrape\ciao-next\src\app\layout.tsx'
with open(layout_path, 'r', encoding='utf-8') as f:
    layout_code = f.read()

layout_code = layout_code.replace('<html ', '<html suppressHydrationWarning ')
layout_code = layout_code.replace('<body ', '<body suppressHydrationWarning ')

layout_code = re.sub(r'<Script src="([^"]+)" strategy="lazyOnload" />', r'<script src="\1"></script>', layout_code)
layout_code = layout_code.replace(
    '<Script id="gsap-register" strategy="lazyOnload" dangerouslySetInnerHTML={{__html: `gsap.registerPlugin(ScrollTrigger,SplitText);`}} />',
    '<script dangerouslySetInnerHTML={{__html: `gsap.registerPlugin(ScrollTrigger,SplitText);`}}></script>'
)

with open(layout_path, 'w', encoding='utf-8') as f:
    f.write(layout_code)

# Fix page.tsx hydration warning
page_path = r'd:\daud\sourcecode\scrape\ciao-next\src\app\page.tsx'
with open(page_path, 'r', encoding='utf-8') as f:
    page_code = f.read()

page_code = page_code.replace('<div dangerouslySetInnerHTML', '<div suppressHydrationWarning dangerouslySetInnerHTML')

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(page_code)

print("Fixed hydration and gsap errors")
