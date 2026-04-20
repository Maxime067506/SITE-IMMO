# 🔐 Outils admin — Delfosse Properties

Ce dossier contient des outils **locaux uniquement** pour gérer les utilisateurs voyageurs en mode sécurisé. Le dossier entier (sauf ce README) est exclu de Git via `.gitignore` pour éviter toute fuite de mots de passe.

---

## 📁 `encrypt-users.js`

Script Node.js qui chiffre tous les profils voyageurs avec AES-256-GCM + PBKDF2 (200 000 itérations). La sortie est directement compatible avec le `DP_USERS_ENC` utilisé par `js/auth.js`.

### Utilisation

1. Édite `encrypt-users.js` → modifie la section `DP_USERS_PLAIN` (ajouter un voyageur, changer un code Wi-Fi, un mot de passe, etc.)
2. Lance :
   ```bash
   node tools/encrypt-users.js
   ```
3. Un fichier `tools/encrypted-output.js` est généré.
4. Copie le contenu (le bloc `const DP_USERS_ENC = {...}`) et colle-le en haut de `js/auth.js` à la place du bloc existant.
5. Bump le cache de `auth.js` (ex: `?v=c5 → c6`) dans `espace.html` et `login.html`.
6. Commit → push → Vercel déploie.

### Pourquoi ce système ?

- Les champs sensibles (mot de passe Wi-Fi, code boîte à clés, numéro de téléphone, etc.) sont chiffrés **dans le code source**.
- Seul le voyageur, connaissant son mot de passe de connexion, peut déchiffrer **son propre profil**.
- Même si quelqu'un télécharge `auth.js`, il ne voit que des blobs base64 — aucune info utile.
- Les 200 000 itérations PBKDF2 rendent les attaques par dictionnaire extrêmement lentes (~100 ms par essai).

### ⚠️ Important

- **Ne commit jamais** `encrypt-users.js` avec les mots de passe en clair — le `.gitignore` le protège déjà, vérifie quand même.
- **Sauvegarde** `encrypt-users.js` localement (par exemple dans un gestionnaire de mot de passe ou un coffre-fort chiffré) — si tu le perds, tu ne peux plus modifier les profils existants sans demander à chaque voyageur son mot de passe.
- Si un voyageur oublie son mot de passe, tu dois regénérer son profil via `encrypt-users.js` avec un nouveau mot de passe → lui transmettre.

---

## 📁 `encrypted-output.js`

Fichier temporaire généré par `encrypt-users.js`. Tu peux le supprimer après copier-coller dans `js/auth.js` — il sera regénéré à la prochaine exécution.
