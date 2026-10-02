import re
with open(r'd:\daud\sourcecode\scrape\ciao-next\public\69fb53371d5b8e9c3f4e4c69\js\webflow.9a82b613.29781a31e070a6c4.js', 'r', encoding='utf-8') as f:
    code = f.read()

match = re.search(r'\.p\s*=\s*[\'\"](.*?)[\'\"]', code)
if match:
    print('Public path:', match.group(1))
else:
    print('No public path found')

import urllib.request
try:
    # Let's see if the achunk actually 404s
    # In earlier Next.js logs: GET / 200 in 110ms
    # There are no 404s in the dev server log! 
    # But let's check what URL webflow builds.
    pass
except Exception:
    pass
