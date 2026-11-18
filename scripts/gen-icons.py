"""Render JAPP's あ icons from Noto Sans CJK JP Bold with Python 3 and Pillow.

On Debian/Ubuntu use fonts-noto-cjk, then run `python scripts/gen-icons.py`.
On other platforms pass the Japanese Bold OTF or NotoSansCJK-Bold.ttc path.
The generated PNGs are committed; the application build does not require a font.
"""

import argparse
from pathlib import Path
from shutil import copyfile

from PIL import Image, ImageDraw, ImageFont


ICON_DIR = Path(__file__).resolve().parents[1] / 'public' / 'icons'
DEFAULT_FONT = Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc')
BACKGROUND = '#bf402b'
INK = '#fff8ed'
CHARACTER = '\N{HIRAGANA LETTER A}'


def glyph_mask(path):
    font = ImageFont.truetype(path, size=2048)
    if font.getname() != ('Noto Sans CJK JP', 'Bold'):
        raise ValueError('Expected the Noto Sans CJK JP Bold face')
    left, top, right, bottom = font.getbbox(CHARACTER)
    mask = Image.new('L', (right - left, bottom - top))
    ImageDraw.Draw(mask).text((-left, -top), CHARACTER, font=font, fill=255)
    return mask.crop(mask.getbbox())


def render(mask, size, coverage):
    # Center the ink bounds, rather than the font's em square or its baseline.
    scale = size * coverage / max(mask.size)
    ink = mask.resize((round(mask.width * scale), round(mask.height * scale)), Image.Resampling.LANCZOS)
    x, y = (size - ink.width) // 2, (size - ink.height) // 2
    icon = Image.new('RGB', (size, size), BACKGROUND)
    icon.paste(INK, (x, y, x + ink.width, y + ink.height), ink)
    return icon


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('font', type=Path, nargs='?', default=DEFAULT_FONT)
    args = parser.parse_args()
    mask = glyph_mask(args.font)
    # Maskable ink fits the central 80%-diameter circle even on round launchers.
    variants = [
        ('japp-favicon-v2.png', 32, 0.73),
        ('japp-touch-v2.png', 180, 0.68),
        ('japp-192-v2.png', 192, 0.68),
        ('japp-512-v2.png', 512, 0.68),
        ('japp-maskable-v2.png', 512, 0.61),
    ]
    for filename, size, coverage in variants:
        render(mask, size, coverage).save(ICON_DIR / filename, optimize=True)

    # Older manifests and saved Home Screen shortcuts can still request these URLs.
    for size, filename in [(180, 'japp-touch-v2.png'), (192, 'japp-192-v2.png'), (512, 'japp-512-v2.png')]:
        copyfile(ICON_DIR / filename, ICON_DIR / f'icon-{size}.png')


if __name__ == '__main__':
    main()
