"""
convert-webp.py
================
Convertit toutes les images .jpg/.jpeg/.png du dossier img/ en .webp à 85% qualité,
en gardant l'original. Les fichiers .webp sont placés à côté des originaux.

Réduction typique : -40 à -60 % du poids total. Massif gain sur Core Web Vitals
(LCP) et donc sur le ranking SEO Google.

Usage :
    py convert-webp.py            # convertit tout, qualité 85
    py convert-webp.py --quality 80
    py convert-webp.py --dir img/airbnb
    py convert-webp.py --force    # ré-encode même si .webp existe déjà

Pré-requis :
    pip install Pillow
"""
from __future__ import annotations
import argparse
import os
import sys
import time

try:
    from PIL import Image
except ImportError:
    print("[ERREUR] Pillow n'est pas installé.\n"
          "        Installe-le avec :  py -m pip install Pillow\n")
    sys.exit(1)


SITE_ROOT = os.path.dirname(os.path.abspath(__file__))
IMG_EXT = {".jpg", ".jpeg", ".png"}


def human_size(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:6.1f} {unit}"
        n /= 1024
    return f"{n:.1f} GB"


def convert_one(src: str, quality: int, force: bool) -> tuple[int, int, bool]:
    """Renvoie (taille_avant, taille_apres, has_been_converted)."""
    base, _ = os.path.splitext(src)
    dst = base + ".webp"
    src_size = os.path.getsize(src)

    if not force and os.path.exists(dst):
        # Skip si .webp est plus récent que .jpg
        if os.path.getmtime(dst) >= os.path.getmtime(src):
            return src_size, os.path.getsize(dst), False

    try:
        with Image.open(src) as im:
            # JPEGs sometimes have an EXIF rotation tag — preserve it
            im_to_save = im
            if im.mode in ("P", "RGBA"):
                # WebP supports alpha. Keep RGBA for PNG with transparency.
                im_to_save = im.convert("RGBA") if "A" in im.mode else im.convert("RGB")
            elif im.mode != "RGB":
                im_to_save = im.convert("RGB")

            save_kwargs = {"quality": quality, "method": 6}
            # method=6 = best compression (slower but tighter, ~5% better than default 4)
            im_to_save.save(dst, "WEBP", **save_kwargs)
        return src_size, os.path.getsize(dst), True
    except Exception as e:
        print(f"  [FAIL] {src}: {e!r}")
        return src_size, 0, False


def walk_images(root: str):
    for dirpath, _dirnames, filenames in os.walk(root):
        for fn in filenames:
            ext = os.path.splitext(fn)[1].lower()
            if ext in IMG_EXT:
                yield os.path.join(dirpath, fn)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--quality", type=int, default=85, help="Qualite WebP 0-100 (defaut 85)")
    ap.add_argument("--dir", default="img", help="Dossier racine a parcourir (defaut: img)")
    ap.add_argument("--force", action="store_true", help="Reencode meme si .webp existe deja")
    args = ap.parse_args()

    target_dir = os.path.join(SITE_ROOT, args.dir) if not os.path.isabs(args.dir) else args.dir
    if not os.path.isdir(target_dir):
        print(f"[ERREUR] Dossier introuvable : {target_dir}")
        sys.exit(2)

    print(f"=== Conversion WebP ===")
    print(f"Dossier  : {target_dir}")
    print(f"Qualite  : {args.quality}")
    print(f"Force    : {args.force}")
    print()

    total_before = 0
    total_after = 0
    converted = 0
    skipped = 0
    failed = 0
    t0 = time.time()

    for src in walk_images(target_dir):
        rel = os.path.relpath(src, SITE_ROOT)
        before, after, did = convert_one(src, args.quality, args.force)
        total_before += before
        if after > 0:
            total_after += after
            if did:
                pct = 100 * (1 - after / before) if before else 0
                print(f"  [OK]   {rel}  {human_size(before)} -> {human_size(after)}  (-{pct:4.1f}%)")
                converted += 1
            else:
                skipped += 1
        else:
            failed += 1

    dt = time.time() - t0
    print()
    print(f"=== Resume ===")
    print(f"Convertis : {converted}")
    print(f"Sautes    : {skipped}  (deja .webp et a jour)")
    print(f"Echecs    : {failed}")
    if total_before > 0:
        pct = 100 * (1 - total_after / total_before) if total_after else 0
        print(f"Avant     : {human_size(total_before)}")
        print(f"Apres     : {human_size(total_after)}")
        print(f"Gain      : -{pct:.1f}%")
    print(f"Duree     : {dt:.1f}s")


if __name__ == "__main__":
    main()
