import subprocess
import os

SLUGS = [
    'ryu', 'luke', 'kimberly', 'chunli', 'manon', 'zangief', 'jp', 'dhalsim',
    'cammy', 'ken', 'deejay', 'lily', 'aki', 'rashid', 'blanka', 'juri',
    'marisa', 'guile', 'ed', 'honda', 'jamie', 'gouki', 'sagat', 'vega',
    'terry', 'mai', 'elena', 'cviper', 'alex',
]

BASE_URL = 'https://www.streetfighter.com/6/buckler/assets/images/material/character/character_{slug}_l.png'

out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'characters')
os.makedirs(out_dir, exist_ok=True)

for slug in SLUGS:
    url = BASE_URL.format(slug=slug)
    dest = os.path.join(out_dir, f'{slug}.png')
    result = subprocess.run([
        'curl', '-s', '-f', '-o', dest,
        '-H', 'Referer: https://www.streetfighter.com/6/buckler/',
        '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        url
    ], capture_output=True)
    if result.returncode == 0:
        size = os.path.getsize(dest) // 1024
        print(f'OK  {slug}  ({size}KB)')
    else:
        print(f'ERR {slug}: curl exit {result.returncode}')
