#!/usr/bin/env python3
"""Generate PNG icons + OG image from scratch using PIL (no svg renderer needed)."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

OUT = os.path.dirname(os.path.abspath(__file__))

def gradient_bg(w, h, colors):
    """Diagonal linear gradient through given color stops."""
    base = Image.new('RGB', (w, h), colors[0])
    px = base.load()
    n = len(colors) - 1
    for y in range(h):
        for x in range(w):
            t = (x / (w - 1) + y / (h - 1)) / 2  # diagonal 0..1
            seg = min(int(t * n), n - 1)
            local = t * n - seg
            c1 = colors[seg]
            c2 = colors[seg + 1]
            px[x, y] = (
                int(c1[0] + (c2[0] - c1[0]) * local),
                int(c1[1] + (c2[1] - c1[1]) * local),
                int(c1[2] + (c2[2] - c1[2]) * local),
            )
    return base

def rounded_mask(w, h, radius):
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius=radius, fill=255)
    return mask

def load_font(size):
    paths = [
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        '/Library/Fonts/Arial Bold.ttf',
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def make_text_gradient(text, font, gradient_colors, size):
    """Render text with horizontal multi-stop gradient fill."""
    w, h = size
    # rendered text mask
    txt_mask = Image.new('L', (w, h), 0)
    td = ImageDraw.Draw(txt_mask)
    bbox = td.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (w - tw) // 2 - bbox[0]
    ty = (h - th) // 2 - bbox[1]
    td.text((tx, ty), text, font=font, fill=255)
    # gradient layer
    grad = Image.new('RGB', (w, h))
    gp = grad.load()
    n = len(gradient_colors) - 1
    for x in range(w):
        t = x / (w - 1)
        seg = min(int(t * n), n - 1)
        local = t * n - seg
        c1 = gradient_colors[seg]
        c2 = gradient_colors[seg + 1]
        col = (
            int(c1[0] + (c2[0] - c1[0]) * local),
            int(c1[1] + (c2[1] - c1[1]) * local),
            int(c1[2] + (c2[2] - c1[2]) * local),
        )
        for y in range(h):
            gp[x, y] = col
    return grad, txt_mask

def make_icon(size, save_path):
    bg_colors = [(56, 189, 248), (59, 130, 246), (99, 102, 241)]
    letter_colors = [(255, 255, 255), (240, 249, 255), (219, 234, 254)]
    bg = gradient_bg(size, size, bg_colors)
    # soft glow spot
    glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse(
        [size * 0.15, size * 0.1, size * 0.6, size * 0.55],
        fill=(186, 230, 253, 90),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(size // 10))
    bg = bg.convert('RGBA')
    bg = Image.alpha_composite(bg, glow)

    # letters
    font = load_font(int(size * 0.55))
    grad, mask = make_text_gradient('EE', font, letter_colors, (size, size))
    # subtle shadow
    shadow_mask = mask.filter(ImageFilter.GaussianBlur(max(1, size // 80)))
    shadow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    shadow.putalpha(shadow_mask.point(lambda v: int(v * 0.5)))
    bg.alpha_composite(shadow)
    letters = Image.new('RGBA', (size, size))
    letters.paste(grad, (0, 0), mask)
    bg.alpha_composite(letters)

    # round corners
    radius = int(size * 0.22)
    final = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    final.paste(bg, (0, 0), rounded_mask(size, size, radius))
    final.save(save_path)
    print(f'wrote {save_path} ({size}x{size})')

def make_og(path):
    w, h = 1200, 630
    bg_colors = [(224, 242, 254), (239, 246, 255), (219, 234, 254)]
    img = gradient_bg(w, h, bg_colors).convert('RGBA')
    # decorative glow
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-200, -200, 600, 600], fill=(59, 130, 246, 70))
    gd.ellipse([700, 300, 1400, 900], fill=(14, 165, 233, 60))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    img = Image.alpha_composite(img, glow)

    letter_colors = [(14, 165, 233), (59, 130, 246), (99, 102, 241)]
    title_font = load_font(130)
    grad, mask = make_text_gradient('ETHOK-ETHOK', title_font, letter_colors, (w, 220))
    title_layer = Image.new('RGBA', (w, 220))
    title_layer.paste(grad, (0, 0), mask)
    img.alpha_composite(title_layer, (0, 200))

    sub_font = load_font(44)
    d = ImageDraw.Draw(img)
    sub = 'Find the impostor among you'
    sbox = d.textbbox((0, 0), sub, font=sub_font)
    sw = sbox[2] - sbox[0]
    d.text(((w - sw) // 2, 440), sub, font=sub_font, fill=(30, 41, 59, 255))

    tag_font = load_font(28)
    tag = 'Social deduction party game • EN / ID • 3–20 players'
    tbox = d.textbbox((0, 0), tag, font=tag_font)
    tw = tbox[2] - tbox[0]
    d.text(((w - tw) // 2, 520), tag, font=tag_font, fill=(71, 85, 105, 255))

    img.convert('RGB').save(path, quality=92)
    print(f'wrote {path} ({w}x{h})')

if __name__ == '__main__':
    make_icon(32, os.path.join(OUT, 'favicon-32.png'))
    make_icon(180, os.path.join(OUT, 'apple-touch-icon.png'))
    make_icon(192, os.path.join(OUT, 'icon-192.png'))
    make_icon(512, os.path.join(OUT, 'icon-512.png'))
    make_og(os.path.join(OUT, 'og-image.png'))
