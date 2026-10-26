# Réservation directe — Guide de mise en ligne

Tout le système est construit et testé sur la branche `reservation-directe`.
Ce guide liste **les actions à faire pour le mettre en ligne**, dans l'ordre.
On commence **en mode test** (aucun vrai débit), puis on bascule en réel.

---

## 1. Variables d'environnement Vercel

Dans Vercel → projet du site → **Settings → Environment Variables**, ajouter :

| Nom | Valeur | Où la trouver | Secret |
|---|---|---|---|
| `SUPABASE_URL` | `https://cjjfakjysmbifbxojuke.supabase.co` | (déjà connu) | non |
| `SUPABASE_SERVICE_ROLE_KEY` | la clé **secrète** `sb_secret_…` | Supabase → Settings → API Keys → clé « API backend » | **oui** |
| `ADMIN_PASSWORD` | un mot de passe long (tu le choisis) | — | **oui** |
| `STRIPE_SECRET_KEY` | `sk_test_…` (puis `sk_live_…` en réel) | Stripe → Développeurs → Clés API | **oui** |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_…` | Stripe → Clés API | non |
| `SITE_URL` | `https://delfosseproperties.com` | — | non |
| `AIRBNB_ICAL_01` … `AIRBNB_ICAL_08` | les URLs iCal Airbnb | Airbnb → Calendrier → Exporter | non |

E-mails (étape 3, optionnel au début) :

| Nom | Valeur | Secret |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | **oui** |
| `EMAIL_FROM` | `Delfosse Properties <reservation@delfosseproperties.com>` | non |
| `HOST_EMAIL` | `delfossemaximepro@gmail.com` | non |

> Les clés secrètes ne doivent **jamais** aller sur GitHub ni dans un message.
> Elles vivent uniquement ici, dans Vercel.

---

## 2. Déploiement + webhook Stripe

1. Pousser la branche `reservation-directe` → Vercel crée une **URL de preview**.
2. Tester le parcours sur cette URL (téléphone compris).
3. Stripe → **Webhooks → Ajouter une destination** :
   - URL : `https://<ton-url>/api/stripe/webhook/` — **avec le `/` final**
     (obligatoire : le site redirige les URL sans slash, et Stripe ne suit pas
     les redirections).
   - Événements : `checkout.session.completed` et `checkout.session.expired`.
   - (Pas de « signing secret » à copier : la confirmation est sécurisée par
     re-vérification de la session côté serveur.)
   - Fait pour la preview (destination « vibrant-glow »). Pour la production,
     créer une nouvelle destination pointant sur le domaine réel.

---

## 3. E-mails (Resend)

1. Créer un compte sur **resend.com** (gratuit).
2. **Vérifier le domaine** `delfosseproperties.com` : Resend donne 2-3
   enregistrements DNS (SPF/DKIM) à ajouter chez **Namecheap**. (Je t'accompagne.)
3. Récupérer la clé API `re_…` → variable `RESEND_API_KEY` dans Vercel.
4. Tant que ce n'est pas fait : les réservations fonctionnent, seuls les
   e-mails automatiques sont en pause (aucune erreur).

---

## 4. Synchronisation Airbnb (anti-double-réservation)

Pour que les résas du site bloquent aussi Airbnb :
- Dans **chaque annonce Airbnb → Calendrier → Disponibilité → Synchroniser
  les calendriers → Importer un calendrier**, coller :
  `https://delfosseproperties.com/api/booking/ical?apt=NN` (NN = 01…08).

Le sens inverse (Airbnb → site) est déjà en place via `AIRBNB_ICAL_*`.

---

## 5. Passage en réel (quand tout est validé en test)

1. Remplacer dans Vercel `STRIPE_SECRET_KEY` et `STRIPE_PUBLISHABLE_KEY` par
   les clés **live** (`sk_live_…`, `pk_live_…`), après activation du compte
   Stripe (infos entreprise + IBAN).
2. Recréer le webhook Stripe en mode **live**.
3. Fusionner `reservation-directe` dans `main` → le site de production reçoit
   le système.

---

## À préparer avec toi (contenu / juridique)

- **CGV** : ajouter les conditions de réservation directe (paiement, caution,
  politique d'annulation). À rédiger/valider ensemble.
- **Caution** : montant (300 € par défaut), déclenchement de l'empreinte à
  l'approche de l'arrivée, libération au départ — piloté dans l'admin.
- **Taxe de séjour** : 6,70 % plafond 6,43 €/pers/nuit (officiel Nice 2026) —
  à reconfirmer chaque année.

---

## Rappels pratiques

- **Admin réservations** : `/admin-resa` (mot de passe `ADMIN_PASSWORD`).
- **Tarifs** : modifiables dans l'admin, pas besoin de toucher au code.
- **Base de données** : Supabase (Frankfurt), accès serveur uniquement (RLS).
- **Tout est réversible** : rien n'est en production tant que la branche n'est
  pas fusionnée dans `main`.
