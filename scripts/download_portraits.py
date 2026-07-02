import subprocess
import os
import io
from PIL import Image

# Map our character slug → SF6 website folder name
URL_NAME = {
    'honda':  'ehonda',
    'gouki':  'gouki_akuma',
    'vega':   'vega_mbison',
    # all others match the slug directly
}

SLUGS = [
    'ryu', 'luke', 'kimberly', 'chunli', 'manon', 'zangief', 'jp', 'dhalsim',
    'cammy', 'ken', 'deejay', 'lily', 'aki', 'rashid', 'blanka', 'juri',
    'marisa', 'guile', 'ed', 'honda', 'jamie', 'gouki', 'sagat', 'vega',
    'terry', 'mai', 'elena', 'cviper', 'alex', 'ingrid', 'yasmine', 'arjun', 'tifa', 'bosch'
]

BASE = 'https://www.streetfighter.com/6/assets/images/character/{n}/{n}.png'
HEADERS = [
    '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    '-H', 'Accept: image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    '-H', 'Accept-Language: en-US,en;q=0.9',
    '-H', 'Referer: https://www.streetfighter.com/6/en/character/',
]

BG = (9, 9, 11)   # zinc-950 background
CROP_RATIO = 0.38  # take top 38% of content height for the banner

out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'characters')
os.makedirs(out_dir, exist_ok=True)


def smart_crop(img: Image.Image) -> Image.Image:
    """Composite onto dark background, find content bbox, crop top portion."""
    if img.mode == 'RGBA':
        bg = Image.new('RGB', img.size, BG)
        bg.paste(img, mask=img.split()[3])
        rgb = bg
        # Find bounding box of non-background pixels using alpha
        alpha = img.split()[3]
        bbox = alpha.getbbox()
    else:
        rgb = img.convert('RGB')
        bbox = None

    if bbox is None:
        # No alpha: use full image bounds
        bbox = (0, 0, rgb.width, rgb.height)

    cx0, cy0, cx1, cy1 = bbox
    content_h = cy1 - cy0
    content_w = cx1 - cx0

    crop_h = max(int(content_h * CROP_RATIO), 180)
    crop_h = min(crop_h, content_h)

    # Crop: full width of content, top portion
    cropped = rgb.crop((cx0, cy0, cx1, cy0 + crop_h))

    # Optionally pad sides to content_w if narrower than image
    return cropped


for slug in SLUGS:
    url_name = URL_NAME.get(slug, slug)
    url = BASE.format(n=url_name)
    dest = os.path.join(out_dir, f'{slug}.jpg')

    result = subprocess.run(['curl', '-s', '-f'] + HEADERS + [url], capture_output=True)

    if result.returncode != 0:
        print(f'ERR {slug}: curl exit {result.returncode}')
        continue

    try:
        img = Image.open(io.BytesIO(result.stdout))
        cropped = smart_crop(img)
        cropped.save(dest, 'JPEG', quality=90)
        print(f'OK  {slug:10s}  {img.size} -> {cropped.size}')
    except Exception as e:
        print(f'ERR {slug}: {e}')
