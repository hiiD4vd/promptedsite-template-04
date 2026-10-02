import os

filepath = r'd:\daud\sourcecode\scrape\ciao-next\src\app\layout.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('<script src=', '<Script strategy="beforeInteractive" src=')
code = code.replace('<script dangerouslySetInnerHTML', '<Script strategy="beforeInteractive" dangerouslySetInnerHTML')
code = code.replace('</script>', '</Script>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

# And now check page.tsx to ensure we don't have stray `<script>` tags, especially from webflow embeds inside dangerouslySetInnerHTML.
filepath_page = r'd:\daud\sourcecode\scrape\ciao-next\src\app\page.tsx'
with open(filepath_page, 'r', encoding='utf-8') as f:
    page_code = f.read()

# Webflow puts <script>...</script> inside the HTML strings sometimes.
# We extracted body scripts, but maybe we missed nested ones?
# Wait, "Encountered a script tag while rendering React component" is triggered if dangerouslySetInnerHTML contains a <script> tag.
# We need to remove any <script>...</script> from the __html string in page.tsx.
# The user's error trace shows `<div class="script---button w-embed w-script"><script>` was present before!
# Oh, we extracted them, but wait... did we?
# Beautifulsoup `soup.body.find_all('script')` finds them, and we `decompose()` them.
# So they shouldn't be in the HTML string anymore.
# Let's verify if there are any <script> tags inside page.tsx HTML string.

print("Done")
