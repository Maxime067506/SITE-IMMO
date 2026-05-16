# API Calendar — Configuration

Fonction Vercel serverless qui fetch les calendriers iCal Airbnb et retourne les disponibilités en JSON.

## Configuration des variables d'environnement Vercel

Pour activer le calendrier connecté sur chaque appartement, ajouter les **7 URLs iCal Airbnb** comme variables d'environnement dans le dashboard Vercel.

### Étape 1 — Récupérer les URLs iCal Airbnb

Pour chaque appartement (1 à 7) :

1. Va sur https://www.airbnb.com/hosting/calendar
2. Sélectionne l'appartement concerné
3. Clique sur ⚙️ **Disponibilité** (en haut à droite)
4. Section **Synchroniser les calendriers** → **Exporter le calendrier**
5. Copie l'URL `.ics` (format : `https://www.airbnb.fr/calendar/ical/XXX.ics?s=XXX`)

### Étape 2 — Ajouter dans Vercel

1. Va sur https://vercel.com/dashboard
2. Sélectionne le projet **delfosseproperties** (ou nom équivalent)
3. **Settings** → **Environment Variables**
4. Ajoute chaque variable, **environment** : Production :

```
AIRBNB_ICAL_01 = https://www.airbnb.fr/calendar/ical/XXX.ics?s=XXX
AIRBNB_ICAL_02 = https://www.airbnb.fr/calendar/ical/XXX.ics?s=XXX
AIRBNB_ICAL_03 = https://www.airbnb.fr/calendar/ical/XXX.ics?s=XXX
AIRBNB_ICAL_04 = https://www.airbnb.fr/calendar/ical/XXX.ics?s=XXX
AIRBNB_ICAL_05 = https://www.airbnb.fr/calendar/ical/XXX.ics?s=XXX
AIRBNB_ICAL_06 = https://www.airbnb.fr/calendar/ical/XXX.ics?s=XXX
AIRBNB_ICAL_07 = https://www.airbnb.fr/calendar/ical/XXX.ics?s=XXX
```

### Étape 3 — Redéployer

Après avoir ajouté les variables, **redéploie** le projet :
- Soit via le dashboard Vercel : **Deployments** → bouton **⋯** sur le dernier deploy → **Redeploy**
- Soit via un nouveau commit Git (le calendrier sera dispo automatiquement)

## Mapping appartement → variable

| Appartement | Page FR | Page EN | Variable d'env |
|---|---|---|---|
| Port (Amiral) | `/sejour-01.html` | `/en/stay-01.html` | `AIRBNB_ICAL_01` |
| Port (Commodore) | `/sejour-02.html` | `/en/stay-02.html` | `AIRBNB_ICAL_02` |
| Notre-Dame | `/sejour-03.html` | `/en/stay-03.html` | `AIRBNB_ICAL_03` |
| Art Déco / Gare | `/sejour-04.html` | `/en/stay-04.html` | `AIRBNB_ICAL_04` |
| Ultra design / Musiciens | `/sejour-05.html` | `/en/stay-05.html` | `AIRBNB_ICAL_05` |
| Musiciens (rénové) | `/sejour-06.html` | `/en/stay-06.html` | `AIRBNB_ICAL_06` |
| Design / Musiciens | `/sejour-07.html` | `/en/stay-07.html` | `AIRBNB_ICAL_07` |

## Comportement

- Le calendrier fetch les disponibilités via `/api/calendar?id=XX`
- Cache CDN Vercel : **1h** (`s-maxage=3600`) + 24h stale-while-revalidate
- Aucun risque de "hammer" Airbnb : on fetch leur iCal au max 24x/jour par appartement
- Si variable d'env manquante : message "Calendrier indisponible" + CTA vers Airbnb
- Si Airbnb répond pas : fallback gracieux + CTA Airbnb

## Test rapide

Une fois les vars configurées, teste l'endpoint :
```
https://delfosseproperties.com/api/calendar?id=01
```

Tu dois obtenir un JSON :
```json
{
  "id": "01",
  "events": [
    { "start": "2026-06-15", "end": "2026-06-20", "summary": "Reserved" },
    ...
  ],
  "count": 12,
  "fetched": "2026-05-16T18:30:00.000Z"
}
```
