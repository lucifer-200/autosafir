"""Quiet-cinematic 16:9 silent trailer, ~30s.

Uses the selected gold/black listing stills plus higher-resolution
Maybach detail stills. Drops cold utility shots (climate screen,
seat levers). Applies letterbox, warm champagne grade, vignette,
and a real Ken Burns zoom.
"""

from __future__ import annotations

from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent
PHOTOS = ROOT / "photos"
WEB = PHOTOS / "web"
OUTPUT = ROOT / "maybach-s680-intro-30s.mp4"

WIDTH = 1920
HEIGHT = 1080
FPS = 30
# 2.20:1 picture window inside 16:9, matching restrained cinema sites.
CONTENT_HEIGHT = 872
BAR = (HEIGHT - CONTENT_HEIGHT) // 2
CROSSFADE_SECONDS = 0.48

# Luxury sequence only: beauty, two-tone, logo, grille, cabin, rear suite, wheel.
SHOTS = [
    {
        "path": PHOTOS / "listing-34-full.webp",
        "motion": "in",
        "seconds": 3.9,
        "box": (0.02, 0.08, 0.98, 0.88),
    },
    {
        "path": WEB / "wiki-02.jpg",
        "motion": "right",
        "seconds": 4.1,
        "box": (0.08, 0.16, 0.92, 0.86),
    },
    {
        "path": PHOTOS / "listing-front-full.webp",
        "motion": "in",
        "seconds": 3.7,
        "box": (0.12, 0.22, 0.88, 0.70),
    },
    {
        "path": PHOTOS / "listing-rear-full.jpeg",
        "motion": "out",
        "seconds": 3.7,
        "box": (0.04, 0.10, 0.96, 0.90),
    },
    {
        "path": WEB / "emblem.jpg",
        "motion": "in",
        "seconds": 3.8,
        "box": (0.08, 0.16, 0.58, 0.78),
    },
    {
        "path": PHOTOS / "listing-dash-full.jpeg",
        "motion": "left",
        "seconds": 3.8,
        "box": (0.00, 0.00, 0.52, 0.78),
    },
    {
        "path": PHOTOS / "listing-lounge-full.jpeg",
        "motion": "in",
        "seconds": 3.9,
        "box": (0.04, 0.08, 0.96, 0.92),
    },
    {
        "path": PHOTOS / "listing-rear-bench-full.webp",
        "motion": "out",
        "seconds": 3.5,
        "box": (0.10, 0.18, 0.90, 0.88),
    },
    {
        "path": WEB / "wheel.jpg",
        "motion": "in",
        "seconds": 3.7,
        "box": (0.08, 0.08, 0.92, 0.92),
    },
]


def crop_box(image: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    left, top, right, bottom = box
    return image.crop(
        (
            int(image.width * left),
            int(image.height * top),
            int(image.width * right),
            int(image.height * bottom),
        )
    )


def prepare(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")
    target_ratio = WIDTH / CONTENT_HEIGHT
    ratio = image.width / image.height
    if ratio > target_ratio:
        new_width = int(image.height * target_ratio)
        left = (image.width - new_width) // 2
        image = image.crop((left, 0, left + new_width, image.height))
    else:
        new_height = int(image.width / target_ratio)
        top = (image.height - new_height) // 2
        image = image.crop((0, top, image.width, top + new_height))
    # Oversample so Ken Burns never upscales a soft crop.
    return image.resize((int(WIDTH * 1.22), int(CONTENT_HEIGHT * 1.22)), Image.Resampling.LANCZOS)


def ease(progress: float) -> float:
    return progress * progress * (3.0 - 2.0 * progress)


def ken_burns(image: Image.Image, progress: float, motion: str) -> Image.Image:
    t = ease(progress)
    if motion == "in":
        zoom = 1.0 + 0.07 * t
    elif motion == "out":
        zoom = 1.07 - 0.07 * t
    else:
        zoom = 1.03
    crop_w = max(int(WIDTH / zoom), WIDTH)
    crop_h = max(int(CONTENT_HEIGHT / zoom), CONTENT_HEIGHT)
    crop_w = min(crop_w, image.width)
    crop_h = min(crop_h, image.height)
    max_x = max(image.width - crop_w, 0)
    max_y = max(image.height - crop_h, 0)
    if motion == "right":
        x = int(max_x * t)
        y = max_y // 2
    elif motion == "left":
        x = int(max_x * (1.0 - t))
        y = int(max_y * 0.28)
    else:
        x = max_x // 2
        y = int(max_y * (0.28 + 0.36 * t))
    return image.crop((x, y, x + crop_w, y + crop_h)).resize(
        (WIDTH, CONTENT_HEIGHT), Image.Resampling.LANCZOS
    )


def grade(frame: Image.Image) -> Image.Image:
    frame = ImageEnhance.Color(frame).enhance(1.08)
    frame = ImageEnhance.Contrast(frame).enhance(1.12)
    frame = ImageEnhance.Brightness(frame).enhance(0.97)
    frame = frame.filter(ImageFilter.UnsharpMask(radius=1.4, percent=85, threshold=3))
    arr = frame.astype(np.float32) if False else np.asarray(frame, dtype=np.float32)
    arr[..., 0] = np.clip(arr[..., 0] * 1.045 + 4, 0, 255)
    arr[..., 1] = np.clip(arr[..., 1] * 1.01 + 1, 0, 255)
    arr[..., 2] = np.clip(arr[..., 2] * 0.90 - 6, 0, 255)
    yy, xx = np.ogrid[:CONTENT_HEIGHT, :WIDTH]
    cy, cx = CONTENT_HEIGHT / 2, WIDTH / 2
    radius = np.sqrt(((yy - cy) / cy) ** 2 + ((xx - cx) / cx) ** 2)
    vignette = np.clip(1.0 - np.power(radius, 2.1) * 0.34, 0.62, 1.0)[..., None]
    arr *= vignette
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def letterbox(content: Image.Image) -> np.ndarray:
    canvas = Image.new("RGB", (WIDTH, HEIGHT), (8, 8, 8))
    canvas.paste(content, (0, BAR))
    return np.asarray(canvas, dtype=np.uint8)


def blend(left: np.ndarray, right: np.ndarray, amount: float) -> np.ndarray:
    eased = ease(amount)
    return np.clip(
        left.astype(np.float32) * (1.0 - eased) + right.astype(np.float32) * eased,
        0,
        255,
    ).astype(np.uint8)


def frames_for(shot: dict) -> list[np.ndarray]:
    source = prepare(crop_box(Image.open(shot["path"]), shot["box"]))
    count = int(shot["seconds"] * FPS)
    last = max(count - 1, 1)
    out = []
    for index in range(count):
        frame = ken_burns(source, index / last, shot["motion"])
        out.append(letterbox(grade(frame)))
    return out


def main() -> None:
    fade_frames = int(CROSSFADE_SECONDS * FPS)
    writer = imageio.get_writer(
        OUTPUT,
        fps=FPS,
        codec="libx264",
        quality=6,
        pixelformat="yuv420p",
        macro_block_size=1,
        ffmpeg_log_level="error",
    )
    written = 0
    try:
        previous_tail: list[np.ndarray] = []
        for shot_index, shot in enumerate(SHOTS):
            frames = frames_for(shot)
            if shot_index == 0:
                body = frames
            else:
                for fade_index in range(fade_frames):
                    writer.append_data(
                        blend(
                            previous_tail[fade_index],
                            frames[fade_index],
                            (fade_index + 1) / fade_frames,
                        )
                    )
                    written += 1
                body = frames[fade_frames:]
            keep_from = max(len(body) - fade_frames, 0)
            for frame in body[:keep_from]:
                writer.append_data(frame)
                written += 1
            previous_tail = body[keep_from:]
        for frame in previous_tail:
            writer.append_data(frame)
            written += 1
    finally:
        writer.close()

    print(f"Wrote {OUTPUT} ({written / FPS:.1f}s, {written} frames)")


if __name__ == "__main__":
    main()
