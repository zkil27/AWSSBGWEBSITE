import os
import re

files_to_check = [
    'assets/js/data/speakers.js',
    'assets/js/data/directors.js',
    'assets/js/data/sponsors.js',
    'assets/js/data/chapters.js',
    'index.html'
]

missing = []
found = []

for fpath in files_to_check:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    # match assets/images/... up to quote or html angle bracket
    matches = re.findall(r'assets/images/[^"\'<>\n\r]+', content)
    for m in matches:
        m = m.strip()
        clean_p = m.replace('/', os.sep)
        if os.path.exists(clean_p):
            found.append((fpath, m))
        else:
            missing.append((fpath, m))

print(f"Total image references checked: {len(found) + len(missing)}")
print(f"Valid existing images: {len(found)}")
if missing:
    print("MISSING IMAGES:")
    for f, m in missing:
        print(f"  In {f}: '{m}'")
else:
    print("ALL IMAGE REFERENCES EXIST ON DISK AND ARE 100% VALID!")
