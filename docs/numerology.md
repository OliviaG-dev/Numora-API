# Documentation Numerology Numora API

Cette documentation couvre l'implementation numerology actuellement en place:

- `POST /api/numerology/calculate`
- Contrat OpenAPI: `docs/numerology.openapi.yaml`

Elle detaille l'architecture, les modules, les donnees JSON, le contrat d'entree/sortie, les validations et les recommandations d'evolution.

---

## Index des docs API

- Auth: `docs/auth.md`
- Readings: `docs/readings.md`
- Numerology: `docs/numerology.md`
- OpenAPI (numerology + readings): `docs/numerology.openapi.yaml`

---

## 1) Vue d'ensemble

L'endpoint numerology centralise les calculs backend et renvoie un profil complet:

1. Le client envoie un profil de base (`fullName`, `birthDate`) et des champs optionnels.
2. Le controller valide les champs obligatoires.
3. Le service `calculateNumerologyProfile` orchestre les modules de calcul.
4. L'API renvoie un objet `result` riche (core, karmic, matrix, arbre de vie, etc.).

Objectif principal: avoir une source unique de verite backend pour les calculs.

---

## 2) Structure des fichiers numerology

- `src/routes/numerology.routes.ts`
  - Declaration de la route `POST /numerology/calculate`
- `src/controllers/numerology.controller.ts`
  - Validation minimale HTTP + mapping des erreurs
- `src/services/numerology.service.ts`
  - Orchestration de tous les calculs
- `src/modules/numerology/*`
  - Calculs numerologiques principaux (core, personal, karmic, etc.)
- `src/modules/matrixDestiny/*`
  - Calcul Matrix Destiny
- `src/modules/arbreDeVie/*`
  - Calcul Arbre de Vie (sephiroth, chemins, piliers)
- `src/data/numerology/*`
  - Donnees JSON de support (defis et karmique)

---

## 3) Endpoint

Base URL locale:

- `http://localhost:3000`

Route:

- `POST /api/numerology/calculate`

---

## 4) Contrat d'entree

### 4.1 Body JSON

```json
{
  "fullName": "Marie Dupont",
  "birthDate": "1990-03-15",
  "referenceDate": "2026-04-14",
  "address": {
    "streetNumber": "12",
    "streetName": "Rue de Paris",
    "allowMasterNumbers": true
  },
  "locality": {
    "postalCode": "75001",
    "city": "Paris",
    "allowMasterNumbers": true
  }
}
```

### 4.2 Champs obligatoires

- `fullName` (string)
- `birthDate` (string, format `YYYY-MM-DD`)

### 4.3 Champs optionnels

- `referenceDate` (string, format date JS parseable, recommande `YYYY-MM-DD`)
- `address`:
  - `streetNumber` (string)
  - `streetName` (string)
  - `allowMasterNumbers` (boolean)
- `locality`:
  - `postalCode` (string)
  - `city` (string)
  - `allowMasterNumbers` (boolean)

---

## 5) Contrat de sortie

Reponse HTTP succes:

- `200 OK`

Format:

```json
{
  "result": {
    "identity": {},
    "core": {},
    "personal": {},
    "challenges": {},
    "karmic": {},
    "matrixDestiny": {},
    "treeOfLife": {},
    "universalVibrations": {},
    "business": {},
    "place": {}
  }
}
```

Blocs retournes:

- `identity`: profil source (`fullName`, `birthDate`)
- `core`: nombres fondamentaux (lifePath, expression, soulUrge, personality, birthday, heart, realisation)
- `personal`: annee/mois/jour personnels
- `challenges`: defis, cycles de vie, periodes de realisation
- `karmic`: nombres karmiques, cycles karmiques, dettes karmiques
- `matrixDestiny`: structure matrix (base, center, chakras, cycles, special, etc.)
- `treeOfLife`: sephiroth, chemins significatifs, equilibre des piliers
- `universalVibrations`: vibrations du jour/mois/annee/universelle
- `business`: expression/actif/hereditaire
- `place`: vibration adresse/localite (si donnees fournies)

---

## 6) Gestion des erreurs

Reponses d'erreur:

- `400 Bad Request` si input incomplet/invalide

Cas principaux:

- `fullName` ou `birthDate` absent
- `birthDate` invalide
- `referenceDate` invalide
- nom invalide (vide) pour les calculs qui le requierent

Format erreur:

```json
{
  "error": "message d'erreur"
}
```

---

## 7) Modules de calcul (outils internes)

### 7.1 `src/modules/numerology`

- `utils.ts`
  - Outils transverses: reduction, normalisation, validations
- `core.ts`
  - Noyau numerologique (life path, expression, soul urge, etc.)
- `daily.ts`
  - Vibrations quotidiennes/universelles
- `personal.ts`
  - Annee/mois/jour personnels
- `business.ts`
  - Calcul business (expression/actif/hereditaire)
- `place.ts`
  - Vibration adresse/localite
- `challenges.ts`
  - Defis, cycles de vie, periodes
- `karmic.ts`
  - Nombres/cycles/dettes karmiques

### 7.2 `src/modules/matrixDestiny`

- `matrixDestiny.ts`
  - Calcul integral de la matrix:
    - base
    - lignes masculine/feminine
    - chakras
    - cycles
    - lignes karmiques
    - relations exterieures

### 7.3 `src/modules/arbreDeVie`

- `calculateSephiroth.ts`
  - Calcul des 10 sephiroth
  - Calcul des chemins significatifs
  - Equilibre des 3 piliers

---

## 8) Donnees JSON disponibles

Donnees actuellement branchees cote backend:

- `src/data/numerology/Basique/ChallengeData.json`
  - descriptions des defis 1..9
- `src/data/numerology/Karmique/KarmicNumberData.json`
  - descriptions des nombres karmiques manquants
- `src/data/numerology/Karmique/CycleKarmicData.json`
  - descriptions des cycles karmiques manquants

Remarque:

- matrix destiny et arbre de vie utilisent aujourd'hui une logique algorithmique dans les modules.
- des datasets additionnels peuvent etre ajoutes ensuite dans `src/data/*` si besoin de interpretations plus detaillees.

---

## 9) Exemple d'appel (PowerShell)

```powershell
Invoke-RestMethod -Method POST http://localhost:3000/api/numerology/calculate `
  -ContentType "application/json" `
  -Body '{
    "fullName": "Marie Dupont",
    "birthDate": "1990-03-15",
    "referenceDate": "2026-04-14",
    "address": {
      "streetNumber": "12",
      "streetName": "Rue de Paris"
    },
    "locality": {
      "postalCode": "75001",
      "city": "Paris"
    }
  }'
```

---

## 10) Verification rapide

- [ ] `npm run build` OK
- [ ] `POST /api/numerology/calculate` repond en `200`
- [ ] test sans `fullName` ou `birthDate` renvoie `400`
- [ ] `referenceDate` invalide renvoie `400`
- [ ] result contient tous les blocs attendus

---

## 11) Evolutions recommandees

1. Ajouter des tests d'integration dedies a l'endpoint numerology
2. Versionner le contrat de reponse si le front depend d'un schema strict
3. Ajouter des validations de schema (zod/joi) avant service
4. Completer `src/data/*` pour enrichir les interpretations metier
5. Ajouter un endpoint health metier numerology (sanity checks calculs)

