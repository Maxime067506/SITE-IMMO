"""
indexnow.py
============
Notifie Bing + Yandex + Naver + Seznam (et autres moteurs IndexNow) en quelques
secondes quand tu modifies / publies des pages sur delfosse-properties.com.

IndexNow remplace l'attente naturelle de re-crawl (1-30 jours) par une
indexation quasi-instantanee (quelques heures max).

A noter :
- Google n'utilise pas IndexNow officiellement, mais il regarde le trafic
  Bing/Yandex comme un signal indirect, donc ca aide quand meme.
- Cle (UUID) generee : 2e07914a685c420d92403873d36c69f6
- Fichier de verification : /2e07914a685c420d92403873d36c69f6.txt (deja present
  a la racine du site)

Usage :
    py indexnow.py                       # notifie toutes les URLs publiques
    py indexnow.py sejour-01.html sejour-03.html   # ne notifie que ces pages
    py indexnow.py --host delfosse-properties.com  # surcharge l'host
"""
from __future__ import annotations
import argparse
import json
import sys
import urllib.error
import urllib.request

KEY = "2e07914a685c420d92403873d36c69f6"
DEFAULT_HOST = "delfosse-properties.com"
KEY_LOCATION = f"https://{DEFAULT_HOST}/{KEY}.txt"

# Liste de toutes les pages publiques du site (synchronisee avec sitemap.xml)
PUBLIC_PAGES = [
    "/",
    "/sejour-01.html",
    "/sejour-02.html",
    "/sejour-03.html",
    "/sejour-04.html",
    "/sejour-05.html",
    "/sejour-06.html",
    "/sejour-07.html",
    "/blog/meilleurs-quartiers-nice-ou-loger.html",
    "/blog/que-faire-a-nice-en-3-jours.html",
]

# Endpoints IndexNow connus. On notifie via api.indexnow.org qui relaie a tous.
INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow"


def submit(host: str, urls: list[str]) -> tuple[int, str]:
    """POST le payload IndexNow et renvoie (status_code, body_or_error)."""
    payload = {
        "host": host,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        INDEXNOW_ENDPOINT,
        data=data,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "DelfosseProperties-IndexNow/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.getcode(), r.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8", errors="replace")
        except Exception:
            body = ""
        return e.code, body or str(e)
    except Exception as e:
        return -1, repr(e)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="*", help="Chemins relatifs (ex: sejour-03.html). Vide = toutes les pages publiques.")
    ap.add_argument("--host", default=DEFAULT_HOST, help=f"Host du site (defaut: {DEFAULT_HOST})")
    args = ap.parse_args()

    if args.paths:
        rel = [p if p.startswith("/") else f"/{p}" for p in args.paths]
    else:
        rel = PUBLIC_PAGES

    urls = [f"https://{args.host}{p}" for p in rel]

    print("=== IndexNow ===")
    print(f"Host        : {args.host}")
    print(f"Key         : {KEY}")
    print(f"KeyLocation : {KEY_LOCATION}")
    print(f"URLs        : {len(urls)}")
    for u in urls:
        print(f"  - {u}")
    print()

    code, body = submit(args.host, urls)
    print(f"HTTP {code}")
    if 200 <= code < 300:
        print("[OK] Soumission acceptee par IndexNow.")
        print("    -> Bing, Yandex, Naver, Seznam vont re-crawler en quelques heures.")
    elif code == 202:
        print("[OK] 202 Accepted (en file d'attente).")
    elif code == 400:
        print("[ERR] 400 Bad request - format JSON invalide ?")
        print(f"     Body: {body[:300]}")
    elif code == 403:
        print("[ERR] 403 Forbidden - cle invalide ou keyLocation inaccessible.")
        print(f"     Verifie que {KEY_LOCATION} est accessible publiquement (HTTP 200).")
        print(f"     Body: {body[:300]}")
    elif code == 422:
        print("[ERR] 422 Unprocessable - URL incoherente avec le host (mismatch).")
    elif code == 429:
        print("[ERR] 429 Too many requests - trop de soumissions, attendre 1h.")
    else:
        print(f"[ERR] Code inattendu. Body: {body[:300]}")


if __name__ == "__main__":
    main()
