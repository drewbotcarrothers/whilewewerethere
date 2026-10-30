#!/usr/bin/env python3
"""Draw the PNG mark and the default Open Graph image. Run from the repo root."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1] / "public"
PINE = (30, 70, 57)
CREAM = (246, 241, 232)
GOLD = (224, 177, 90)
INK = (26, 33, 29)
LAKE = (24, 78, 98)
PAPER = (243, 238, 228)
MUTED = (63, 75, 68)

SERIF = "/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf"
SERIF_ITALIC = "/usr/share/fonts/truetype/noto/NotoSerif-Italic.ttf"
SANS = "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def draw_mark(size: int) -> Image.Image:
    image = Image.new("RGB", (size, size), PINE)
    draw = ImageDraw.Draw(image)
    width = max(2, round(size * 0.055))

    def point(x: float, y: float) -> tuple[float, float]:
        return (size * x, size * y)

    draw.line(
        [point(0.20, 0.70), point(0.40, 0.48), point(0.58, 0.58), point(0.80, 0.36)],
        fill=CREAM,
        width=width,
        joint="curve",
    )
    radius = size * 0.055
    center = point(0.46, 0.32)
    draw.ellipse(
        (center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius),
        fill=GOLD,
    )
    return image


def draw_og() -> Image.Image:
    image = Image.new("RGB", (1200, 630), PAPER)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 430, 630), fill=PINE)
    draw.ellipse((176, 118, 254, 196), fill=GOLD)
    draw.line([(78, 430), (150, 330), (230, 380), (340, 250)], fill=CREAM, width=14, joint="curve")

    kicker = font(SANS_BOLD, 22)
    word = font(SERIF_ITALIC, 92)
    eyebrow = font(SANS_BOLD, 22)
    headline = font(SERIF, 58)
    names = font(SANS, 26)
    url = font(SANS, 22)

    draw.text((48, 470), "WHILE WE WERE", font=kicker, fill=CREAM)
    draw.text((48, 508), "there", font=word, fill=CREAM)
    draw.text((490, 150), "TORONTO", font=eyebrow, fill=LAKE)
    draw.text((490, 200), "Family adventures,", font=headline, fill=INK)
    draw.text((490, 274), "written after we", font=headline, fill=INK)
    draw.text((490, 348), "get home.", font=headline, fill=INK)
    draw.text((490, 470), "Andrew, Michelle, Harrison,", font=names, fill=INK)
    draw.text((490, 508), "Sullivan, and Maeve", font=names, fill=INK)
    draw.text((490, 566), "whilewewerethere.com", font=url, fill=MUTED)
    return image


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    for size, name in ((32, "icon-32.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")):
        draw_mark(size).save(ROOT / name, "PNG")
    draw_og().save(ROOT / "og.png", "PNG")
    print("wrote brand pngs")


if __name__ == "__main__":
    main()
