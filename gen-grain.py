"""Génère une texture de grain pellicule 240x240 en PNG.
Remplace le SVG feTurbulence inline qui était recalculé à chaque paint.
"""
import os
import random
import struct
import zlib

SITE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SITE, "img", "grain.png")
SIZE = 240

random.seed(42)  # reproductible


def png_chunk(type_code, data):
    c = type_code + data
    crc = zlib.crc32(c)
    return struct.pack(">I", len(data)) + c + struct.pack(">I", crc)


def make_grain_png():
    # IHDR : 240x240, 8-bit grayscale
    ihdr = struct.pack(">IIBBBBB", SIZE, SIZE, 8, 0, 0, 0, 0)

    # Raster : chaque ligne = 1 byte filter (0) + SIZE bytes de gris
    raw = bytearray()
    for _ in range(SIZE):
        raw.append(0)  # filter type none
        for _ in range(SIZE):
            # Noise tiré d'une gaussienne pour un look de pellicule
            g = random.gauss(128, 38)
            g = max(0, min(255, int(g)))
            raw.append(g)

    compressed = zlib.compress(bytes(raw), 9)

    png = (
        b"\x89PNG\r\n\x1a\n"
        + png_chunk(b"IHDR", ihdr)
        + png_chunk(b"IDAT", compressed)
        + png_chunk(b"IEND", b"")
    )

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "wb") as f:
        f.write(png)

    print(f"OK {OUT}  {os.path.getsize(OUT)} bytes")


if __name__ == "__main__":
    make_grain_png()
