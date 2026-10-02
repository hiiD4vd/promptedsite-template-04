import os
import re

filepath = r'd:\daud\sourcecode\scrape\ciao-next\src\app\page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

counter = 0
def replacer(match):
    global counter
    counter += 1
    t = match.group(1)
    content = match.group(2)
    return f'<Script id="page-script-{counter}" type="{t}">{{`{content}`}}</Script>'

code = re.sub(r'<Script type="(.*?)" dangerouslySetInnerHTML=\{\{__html: `(.*?)`\}\} />', replacer, code, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

filepath_layout = r'd:\daud\sourcecode\scrape\ciao-next\src\app\layout.tsx'
with open(filepath_layout, 'r', encoding='utf-8') as f:
    layout = f.read()

def replacer_layout(match):
    content = match.group(1)
    return f'<Script id="layout-script-1" strategy="beforeInteractive">{{`{content}`}}</Script>'

layout = re.sub(r'<Script strategy="beforeInteractive" dangerouslySetInnerHTML=\{\{__html: `(.*?)`\}\}></Script>', replacer_layout, layout, flags=re.DOTALL)

with open(filepath_layout, 'w', encoding='utf-8') as f:
    f.write(layout)

print('Fixed scripts')
