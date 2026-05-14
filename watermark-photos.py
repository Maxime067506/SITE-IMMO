"""
watermark-photos.py
====================
Applique un watermark Delfosse Properties (logo blanc translucide, coin bas-droit)
sur toutes les photos du site. Garde les originaux intacts (option B).

Pour chaque img/airbnb/*/photo-*.jpg :
  -> creer img/airbnb/*/photo-*_wm.jpg
  -> creer img/airbnb/*/photo-*_wm.webp

Logo source : img/delfosse-mark.png (auto-inverse en blanc)

Usage :
    py watermark-photos.py                    # tout
    py watermark-photos.py --opacity 0.35     # plus subtil
    py watermark-photos.py --opacity 0.50     # plus visible
    py watermark-photos.py --size 0.08        # logo plus petit (8% au lieu de 10%)
    py watermark-photos.py --test             # test sur 1 photo seulement
    py watermark-photos.py --force            # ecrase les _wm existants
"""
from __future__ import annotations
import argparse
import os
import sys
import time

try:
    from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
except ImportError:
    print("[ERREUR] Pillow non installe. Run: py -m pip install Pillow")
    sys.exit(1)


SITE_ROOT = os.path.dirname(os.path.abspath(__file__))
LOGO_SRC = os.path.join(SITE_ROOT, "img", "delfosse-mark.png")


def human_size(n: int) -> str:
    for unit in ("B", "KB", "MB"):
        if n < 1024 or unit == "MB":
            return f"{n:6.1f} {unit}"
        n /= 1024
    return f"{n:.1f} MB"


def prepare_logo(src_path: str, color: str = "black") -> Image.Image:
    """Charge le logo et le convertit en silhouette unicolore en preservant
    l'alpha (la silhouette suit la forme du logo source).

    color = "black" : logo noir (mieux sur photos claires)
    color = "white" : logo blanc (mieux sur photos sombres)
    """
    target_rgb = (0, 0, 0) if color == "black" else (255, 255, 255)
    logo = Image.open(src_path).convert("RGBA")
    width, height = logo.size
    pixels = logo.load()
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            # Brightness 0 (noir) -> alpha conserve (silhouette visible)
            # Brightness 255 (blanc/fond) -> alpha 0 (invisible)
            brightness = (r + g + b) / 3
            darkness = 1 - (brightness / 255)
            new_a = int(a * darkness)
            pixels[x, y] = (*target_rgb, new_a)
    return logo


# Backward compat
prepare_white_logo = prepare_logo


def watermark_photo(photo_path: str, logo_master: Image.Image,
                    size_ratio: float, opacity: float, margin_ratio: float,
                    shadow: bool = True) -> Image.Image:
    """Applique le watermark sur une photo, renvoie l'image finale (RGB).

    Si shadow=True (recommande), applique une ombre portee douce derriere le
    logo blanc. Resultat : reste lisible sur fond clair ET sombre, sans paraitre
    aggressif. C'est la technique standard des photographes pro."""
    photo = Image.open(photo_path).convert("RGBA")
    pw, ph = photo.size

    # Taille du logo : size_ratio * largeur photo
    target_w = int(pw * size_ratio)
    aspect = logo_master.width / logo_master.height
    target_h = int(target_w / aspect)
    logo = logo_master.resize((target_w, target_h), Image.LANCZOS)

    # Applique l'opacite sur le canal alpha
    alpha = logo.getchannel("A")
    alpha = alpha.point(lambda p: int(p * opacity))
    logo.putalpha(alpha)

    # Position : CENTRE-BAS de l'image (visible quel que soit le crop horizontal)
    margin = int(min(pw, ph) * margin_ratio)
    x = (pw - target_w) // 2
    y = ph - target_h - margin

    overlay = Image.new("RGBA", photo.size, (0, 0, 0, 0))

    # Halo blanc subtil derriere le logo (pour lisibilite sur fonds sombres)
    # SANS pastille visible : juste un glow doux qui suit la silhouette
    if shadow:
        logo_alpha = logo.getchannel("A")
        # Halo blanc doux
        silhouette = Image.new("RGBA", logo.size, (255, 255, 255, 255))
        halo_alpha = logo_alpha.point(lambda p: int(p * 0.90))
        silhouette.putalpha(halo_alpha)
        # Blur leger pour creer un glow autour
        blur_radius = max(4, int(target_w * 0.04))
        halo = silhouette.filter(ImageFilter.GaussianBlur(radius=blur_radius))
        overlay.paste(halo, (x, y), halo)
        # 2e passe plus serree pour densifier
        tight = silhouette.filter(ImageFilter.GaussianBlur(radius=max(2, int(target_w * 0.015))))
        overlay.paste(tight, (x, y), tight)

    # Logo noir par-dessus le halo
    overlay.paste(logo, (x, y), logo)
    result = Image.alpha_composite(photo, overlay).convert("RGB")
    return result


def collect_photos(root: str):
    """Trouve tous les .jpg/.jpeg dans img/airbnb/ + nice-sunset.jpg."""
    photos = []
    airbnb_root = os.path.join(root, "img", "airbnb")
    for dirpath, _dirs, files in os.walk(airbnb_root):
        for f in files:
            if f.lower().endswith((".jpg", ".jpeg")) and "_wm" not in f:
                photos.append(os.path.join(dirpath, f))
    # Photo hero
    hero = os.path.join(root, "img", "nice-sunset.jpg")
    if os.path.exists(hero):
        photos.append(hero)
    return photos


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--opacity", type=float, default=0.65, help="0.0-1.0 (defaut 0.65)")
    ap.add_argument("--size", type=float, default=0.12, help="Largeur logo / largeur photo (defaut 0.12 = 12%%)")
    ap.add_argument("--color", choices=["black", "white"], default="black", help="Couleur du logo (defaut black)")
    ap.add_argument("--margin", type=float, default=0.025, help="Marge depuis le bord (ratio, defaut 0.025)")
    ap.add_argument("--quality", type=int, default=90, help="Qualite JPG (defaut 90)")
    ap.add_argument("--webp-quality", type=int, default=85, help="Qualite WebP (defaut 85)")
    ap.add_argument("--no-shadow", action="store_true", help="Desactive l'ombre portee")
    ap.add_argument("--test", action="store_true", help="Traite 1 seule photo en demo")
    ap.add_argument("--force", action="store_true", help="Reecrit les _wm existants")
    args = ap.parse_args()

    if not os.path.exists(LOGO_SRC):
        print(f"[ERREUR] Logo introuvable : {LOGO_SRC}")
        sys.exit(2)

    print("=== Watermarking Delfosse Properties ===")
    print(f"Logo source : {LOGO_SRC}")
    print(f"Opacite     : {args.opacity:.2f}")
    print(f"Taille      : {args.size:.2f} (largeur photo)")
    print(f"Marge       : {args.margin:.3f}")
    print(f"Test mode   : {args.test}")
    print()

    print(f"[1] Preparation du logo {args.color}...")
    logo_master = prepare_logo(LOGO_SRC, color=args.color)
    print(f"    Logo prepare : {logo_master.size}")

    photos = collect_photos(SITE_ROOT)
    if args.test:
        photos = photos[:1]
    print(f"\n[2] Photos a traiter : {len(photos)}")
    print()

    total_before = 0
    total_after_jpg = 0
    total_after_webp = 0
    done = 0
    skipped = 0
    failed = 0
    t0 = time.time()

    for src in photos:
        rel = os.path.relpath(src, SITE_ROOT)
        base, ext = os.path.splitext(src)
        wm_jpg = base + "_wm.jpg"
        wm_webp = base + "_wm.webp"

        if not args.force and os.path.exists(wm_jpg) and os.path.exists(wm_webp):
            if os.path.getmtime(wm_jpg) >= os.path.getmtime(src):
                skipped += 1
                continue

        try:
            result = watermark_photo(src, logo_master, args.size, args.opacity, args.margin, shadow=not args.no_shadow)
            result.save(wm_jpg, "JPEG", quality=args.quality, optimize=True)
            result.save(wm_webp, "WEBP", quality=args.webp_quality, method=6)
            sz_before = os.path.getsize(src)
            sz_jpg = os.path.getsize(wm_jpg)
            sz_webp = os.path.getsize(wm_webp)
            total_before += sz_before
            total_after_jpg += sz_jpg
            total_after_webp += sz_webp
            done += 1
            print(f"  [OK] {rel}")
            print(f"       -> _wm.jpg  {human_size(sz_jpg)}")
            print(f"       -> _wm.webp {human_size(sz_webp)}")
        except Exception as e:
            failed += 1
            print(f"  [FAIL] {rel}: {e!r}")

    dt = time.time() - t0
    print()
    print("=== Resume ===")
    print(f"Traites  : {done}")
    print(f"Sautes   : {skipped} (deja a jour)")
    print(f"Echecs   : {failed}")
    if done > 0:
        print(f"Original : {human_size(total_before)}")
        print(f"WM JPG   : {human_size(total_after_jpg)}")
        print(f"WM WebP  : {human_size(total_after_webp)}")
    print(f"Duree    : {dt:.1f}s")
    if args.test:
        print(f"\nTest produit :")
        print(f"  {photos[0].replace('.jpg', '_wm.jpg')}")
        print(f"  Ouvre-le et valide. Puis relance sans --test pour tout traiter.")


if __name__ == "__main__":
    main()
