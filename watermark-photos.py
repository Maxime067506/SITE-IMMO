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
# Logo source : utilise le nouveau monogramme DP entrelace 1024x1024
# Fallback sur l'ancien delfosse-mark.png si le nouveau n'existe pas.
_NEW_LOGO = os.path.join(SITE_ROOT, "img", "delfosse-mark-new.png")
_OLD_LOGO = os.path.join(SITE_ROOT, "img", "delfosse-mark.png")
LOGO_SRC = _NEW_LOGO if os.path.exists(_NEW_LOGO) else _OLD_LOGO


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


def sample_logo_zone_luminance(photo: Image.Image, logo_size_ratio: float = 0.13,
                                margin_factor: float = 1.6) -> float:
    """Echantillonne la luminance de la zone EXACTE ou le logo sera pose,
    avec une legere marge autour (margin_factor * taille_logo).

    Cette mesure precise evite le piege ou la moyenne large est claire
    mais le spot exact du logo tombe sur une zone sombre (ex: meuble noir,
    coin d'ombre, etc.).

    logo_size_ratio : largeur du logo / largeur photo (defaut 0.13)
    margin_factor : multiplie la taille pour couvrir logo + halo (1.6 = +30% autour)
    Retourne 0.0-1.0 (0 = noir, 1 = blanc).
    """
    pw, ph = photo.size
    # Taille echantillonnee = logo + marge
    sw = int(pw * logo_size_ratio * margin_factor)
    sh = sw  # carre, suffisant car le logo est ~carre
    sx = (pw - sw) // 2
    sy = (ph - sh) // 2
    crop = photo.crop((sx, sy, sx + sw, sy + sh)).convert("L")
    crop.thumbnail((64, 64))
    pixels = list(crop.getdata())
    if not pixels:
        return 0.5
    return sum(pixels) / (len(pixels) * 255.0)


# Backward compat alias
def sample_center_luminance(photo: Image.Image, sample_ratio: float = 0.4) -> float:
    return sample_logo_zone_luminance(photo, logo_size_ratio=sample_ratio / 3, margin_factor=3)


def watermark_photo(photo_path: str, logo_master_black: Image.Image, logo_master_white: Image.Image,
                    size_ratio: float, opacity: float, margin_ratio: float,
                    shadow: bool = True, adaptive: bool = True,
                    threshold: float = 0.45) -> tuple[Image.Image, str]:
    """Applique le watermark sur une photo. Renvoie (image_finale, couleur_utilisee).

    Mode adaptive : echantillonne la zone centrale et choisit AUTOMATIQUEMENT :
      - logo NOIR si zone centrale claire (luminance > threshold)
      - logo BLANC si zone centrale sombre (luminance <= threshold)
    Le halo est toujours de la couleur opposee pour maximiser le contraste.
    """
    photo = Image.open(photo_path).convert("RGBA")
    pw, ph = photo.size

    # Choix adaptatif de la couleur du logo : sample la ZONE EXACTE du logo
    # + une marge (couvre logo + halo), pas une moyenne large qui peut tromper.
    if adaptive:
        lum = sample_logo_zone_luminance(photo, logo_size_ratio=size_ratio, margin_factor=1.6)
        use_white = lum <= threshold  # zone sombre -> logo blanc
        color_used = "white" if use_white else "black"
    else:
        use_white = False
        color_used = "black"

    logo_master = logo_master_white if use_white else logo_master_black
    logo_rgb = (255, 255, 255) if use_white else (0, 0, 0)
    halo_rgb = (0, 0, 0) if use_white else (255, 255, 255)  # halo = couleur opposee

    # Taille du logo : size_ratio * largeur photo
    target_w = int(pw * size_ratio)
    aspect = logo_master.width / logo_master.height
    target_h = int(target_w / aspect)
    logo = logo_master.resize((target_w, target_h), Image.LANCZOS)

    # Applique l'opacite sur le canal alpha
    alpha = logo.getchannel("A")
    alpha = alpha.point(lambda p: int(p * opacity))
    logo.putalpha(alpha)

    # Position : CENTRE exact de l'image (visible quel que soit le crop)
    x = (pw - target_w) // 2
    y = (ph - target_h) // 2

    overlay = Image.new("RGBA", photo.size, (0, 0, 0, 0))

    # Halo de couleur OPPOSEE au logo (pour lisibilite garantie sur tout fond)
    # 2 couches : un halo large diffus + une couche plus serree pour densifier.
    if shadow:
        logo_alpha = logo.getchannel("A")
        silhouette = Image.new("RGBA", logo.size, (*halo_rgb, 255))
        silhouette.putalpha(logo_alpha)
        # Couche 1 : halo large et diffus (effet "glow")
        blur_large = max(6, int(target_w * 0.055))
        halo_large = silhouette.filter(ImageFilter.GaussianBlur(radius=blur_large))
        overlay.paste(halo_large, (x, y), halo_large)
        # Couche 2 : halo serre pour densifier le contraste local
        blur_tight = max(3, int(target_w * 0.020))
        halo_tight = silhouette.filter(ImageFilter.GaussianBlur(radius=blur_tight))
        overlay.paste(halo_tight, (x, y), halo_tight)
        # Couche 3 : halo TRES serre pour creer un "stroke" autour du logo
        blur_stroke = max(2, int(target_w * 0.008))
        halo_stroke = silhouette.filter(ImageFilter.GaussianBlur(radius=blur_stroke))
        overlay.paste(halo_stroke, (x, y), halo_stroke)

    # Logo par-dessus le halo
    overlay.paste(logo, (x, y), logo)
    result = Image.alpha_composite(photo, overlay).convert("RGB")
    return result, color_used


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
    ap.add_argument("--opacity", type=float, default=0.70, help="0.0-1.0 (defaut 0.70)")
    ap.add_argument("--size", type=float, default=0.12, help="Largeur logo / largeur photo (defaut 0.12 = 12%%)")
    ap.add_argument("--color", choices=["black", "white", "adaptive"], default="adaptive",
                    help="Couleur du logo (defaut adaptive : noir sur clair / blanc sur sombre)")
    ap.add_argument("--threshold", type=float, default=0.55,
                    help="Seuil de luminance pour mode adaptive (0.55 = bascule vers blanc en dessous)")
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

    adaptive_mode = (args.color == "adaptive")
    print(f"[1] Preparation des logos (mode={args.color})...")
    logo_master_black = prepare_logo(LOGO_SRC, color="black")
    logo_master_white = prepare_logo(LOGO_SRC, color="white")
    print(f"    Logo prepare : {logo_master_black.size}")
    if adaptive_mode:
        print(f"    Mode ADAPTIVE : seuil luminance = {args.threshold:.2f}")

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
            if adaptive_mode:
                result, color_used = watermark_photo(
                    src, logo_master_black, logo_master_white,
                    args.size, args.opacity, args.margin,
                    shadow=not args.no_shadow, adaptive=True, threshold=args.threshold,
                )
            else:
                # Force la couleur choisie (compat retro)
                logo_chosen = logo_master_white if args.color == "white" else logo_master_black
                result, color_used = watermark_photo(
                    src, logo_chosen, logo_chosen,
                    args.size, args.opacity, args.margin,
                    shadow=not args.no_shadow, adaptive=False,
                )
            result.save(wm_jpg, "JPEG", quality=args.quality, optimize=True)
            result.save(wm_webp, "WEBP", quality=args.webp_quality, method=6)
            sz_before = os.path.getsize(src)
            sz_jpg = os.path.getsize(wm_jpg)
            sz_webp = os.path.getsize(wm_webp)
            total_before += sz_before
            total_after_jpg += sz_jpg
            total_after_webp += sz_webp
            done += 1
            color_tag = f"[{color_used.upper()}]"
            print(f"  [OK] {color_tag} {rel}")
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
