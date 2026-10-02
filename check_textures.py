import re
import os

with open(r'd:\daud\sourcecode\scrape\ciao-next\public\app-module.js', 'r', encoding='utf-8') as f:
    code = f.read()

textures = re.findall(r'[\'"](/[^(\'|")]+\.(?:png|jpg|jpeg|webp))[\'"]', code)
base = r'd:\daud\sourcecode\scrape\ciao-next\public'
missing = []
for t in set(textures):
    full = base + t.replace('/', '\\')
    if not os.path.exists(full):
        missing.append(t)

print('Textures missing:', missing)
