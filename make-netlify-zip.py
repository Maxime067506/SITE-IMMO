"""Packaging Netlify — crée DELFOSSE_netlify.zip avec forward-slash paths.

Inclut : index, sejour-01..07, login, espace, moodboard, css/, js/, img/,
_redirects, netlify.toml. Exclut : gen-sejours.py, make-netlify-zip.py, zips.
"""
import os
import zipfile

SITE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(SITE, "DELFOSSE_netlify.zip")

# Fichiers à la racine
ROOT_FILES = [
    "index.html",
    "login.html",
    "espace.html",
    "moodboard.html",
    "sejour-01.html", "sejour-02.html", "sejour-03.html", "sejour-04.html",
    "sejour-05.html", "sejour-06.html", "sejour-07.html",
    "_redirects",
    "netlify.toml",
]

# Dossiers récursifs (tous les fichiers)
RECURSIVE_DIRS = ["css", "js", "img", "doc"]

# Exclure certains suffixes (temp, caches)
EXCLUDE_SUFFIXES = (".pyc", ".zip")
EXCLUDE_NAMES = {".DS_Store", "Thumbs.db"}


def add_file(zf, path_abs, path_rel):
    """Ajoute un fichier au zip avec un chemin relatif forward-slash."""
    path_rel = path_rel.replace("\\", "/")
    zf.write(path_abs, path_rel)
    print(f"  + {path_rel}")


def main():
    if os.path.exists(OUT):
        os.remove(OUT)

    total = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zf:
        # Racine
        for rel in ROOT_FILES:
            full = os.path.join(SITE, rel)
            if os.path.isfile(full):
                add_file(zf, full, rel)
                total += 1
            else:
                print(f"  ! MISSING {rel}")

        # Dossiers
        for d in RECURSIVE_DIRS:
            root_dir = os.path.join(SITE, d)
            if not os.path.isdir(root_dir):
                print(f"  ! MISSING dir {d}")
                continue
            for dirpath, _dirs, files in os.walk(root_dir):
                for name in files:
                    if name in EXCLUDE_NAMES:
                        continue
                    if name.endswith(EXCLUDE_SUFFIXES):
                        continue
                    full = os.path.join(dirpath, name)
                    rel = os.path.relpath(full, SITE)
                    add_file(zf, full, rel)
                    total += 1

    size = os.path.getsize(OUT)
    print(f"\nDONE {OUT}")
    print(f"  {total} files   {size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
