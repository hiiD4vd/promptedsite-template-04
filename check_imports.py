import os
import re

base_dir = r'd:\daud\sourcecode\scrape\ciao-next\public'
with open(os.path.join(base_dir, 'app-module.js'), 'r', encoding='utf-8') as f:
    code = f.read()

imports = re.findall(r'import\s+.*?\s+from\s+[\'"](.*?)[\'"]', code)
print("Checking imports...")
for imp in imports:
    if imp.startswith('/'):
        path = os.path.join(base_dir, imp.lstrip('/'))
    elif imp == 'three':
        path = os.path.join(base_dir, r'npm\three@0.161.0\build\three.module.js')
    elif imp.startswith('three/addons/'):
        path = os.path.join(base_dir, r'npm\three@0.161.0\examples\jsm', imp.replace('three/addons/', ''))
    else:
        path = imp # unknown
    
    exists = os.path.exists(path)
    print(f"{imp} -> {exists}")

