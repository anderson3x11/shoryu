import subprocess
import os
from PIL import Image
import io

SLUGS = [
    'ryu', 'luke', 'kimberly', 'chunli', 'manon', 'zangief', 'jp', 'dhalsim',
    'cammy', 'ken', 'deejay', 'lily', 'aki', 'rashid', 'blanka', 'juri',
    'marisa', 'guile', 'ed', 'honda', 'jamie', 'gouki', 'sagat', 'vega',
    'terry', 'mai', 'elena', 'cviper', 'alex',
]

BASE_URL = 'https://www.streetfighter.com/6/buckler/assets/images/material/character/usagerate/card_{slug}.jpg'

out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'characters')
os.makedirs(out_dir, exist_ok=True)

def autocrop(img: Image.Image, threshold: int = 12) -> Image.Image:
    """Crop black/dark borders from all sides using Pillow only."""
    rgb = img.convert('RGB')
    w, h = rgb.size

    def first_bright_row(start, end, step):
        for y in range(start, end, step):
            for x in range(w):
                r, g, b = rgb.getpixel((x, y))
                if max(r, g, b) > threshold:
                    return y
        return start

    def first_bright_col(start, end, step):
        for x in range(start, end, step):
            for y in range(h):
                r, g, b = rgb.getpixel((x, y))
                if max(r, g, b) > threshold:
                    return x
        return start

    top    = first_bright_row(0, h, 1)
    bottom = first_bright_row(h - 1, -1, -1) + 1
    left   = first_bright_col(0, w, 1)
    right  = first_bright_col(w - 1, -1, -1) + 1

    return img.crop((left, top, right, bottom))

for slug in SLUGS:
    url = BASE_URL.format(slug=slug)
    dest = os.path.join(out_dir, f'{slug}.jpg')

    result = subprocess.run([
        'curl', '-s', '-f',
        '-H', 'Referer: https://www.streetfighter.com/6/buckler/',
        '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        url
    ], capture_output=True)

    if result.returncode != 0:
        print(f'ERR {slug}: curl exit {result.returncode}')
        continue

    img = Image.open(io.BytesIO(result.stdout))
    cropped = autocrop(img)
    cropped.save(dest, 'JPEG', quality=92)
    print(f'OK  {slug}  {img.size} -> {cropped.size}')
