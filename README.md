# Numora API

Backend REST API pour Numora, construit avec Node.js, Express et TypeScript.

## Stack

- Node.js + Express
- TypeScript
- PostgreSQL (via Prisma)
- Auth JWT (`jsonwebtoken`)
- Hash mot de passe (`bcryptjs`)

## Structure du projet

```text
src/
├── controllers/   # logique des endpoints
├── middleware/    # middlewares (auth, etc.)
├── models/        # types métier
├── routes/        # définition des routes API
├── services/      # logique métier
├── utils/         # helpers
├── app.ts         # configuration express
└── server.ts      # point d'entrée

prisma/
└── schema.prisma  # schéma PostgreSQL
```

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Créer ton fichier d'environnement :

```bash
copy .env.example .env
```

Puis adapte les valeurs dans `.env` (DB + JWT).

### Exigences Auth (production)

- `JWT_SECRET` doit faire au moins 32 caracteres
- `JWT_EXPIRES_IN` permet de regler la duree du token (defaut: `7d`)
- `AUTH_RATE_LIMIT_WINDOW_MS` et `AUTH_RATE_LIMIT_MAX` protègent `/auth/register` et `/auth/login`
- `CORS_ALLOWED_ORIGINS` limite les domaines autorises (liste separee par des virgules)
- `API_RATE_LIMIT_WINDOW_MS` et `API_RATE_LIMIT_MAX` definissent la limite globale API
- `NUMEROLOGY_RATE_LIMIT_WINDOW_MS` et `NUMEROLOGY_RATE_LIMIT_MAX` protegent `POST /api/numerology/calculate`
- Mot de passe `register`: au moins 10 caracteres, 1 majuscule, 1 minuscule, 1 chiffre

### Exemple `.env` (securite et limites)

```env
PORT=3000
JWT_SECRET=replace_with_a_very_long_secret_at_least_32_chars
JWT_EXPIRES_IN=7d

# Autoriser front local + prod
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://app.numora.com

# Rate limit global API
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX=300

# Rate limit auth
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10

# Rate limit calcul numerology
NUMEROLOGY_RATE_LIMIT_WINDOW_MS=900000
NUMEROLOGY_RATE_LIMIT_MAX=60
```

## Documentation

- Documentation complete de l'auth: `docs/auth.md`
- Documentation complete des readings: `docs/readings.md`
- Documentation complete numerology: `docs/numerology.md`
- Contrat OpenAPI (numerology + readings): `docs/numerology.openapi.yaml`

## Démarrer PostgreSQL en local (Docker)

Le projet inclut un `docker-compose.yml` prêt à l'emploi.

```bash
docker compose up -d
```

Quand la base tourne, exécute :

```bash
npm run prisma:generate
npx prisma migrate dev --name init
```

## Scripts

- `npm run dev` : lance l'API en développement (hot reload)
- `npm run build` : compile TypeScript vers `dist/`
- `npm run start` : lance la version compilée
- `npm run prisma:generate` : génère le client Prisma
- `npm run prisma:migrate` : lance une migration Prisma en dev
- `npm run prisma:studio` : ouvre Prisma Studio

## Endpoints disponibles

### Santé API

- `GET /api/ping` : vérifie que l'API répond et expose `database.connected`

### Auth (implemente)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Routes numerology

- `POST /api/numerology/calculate`
- `GET /api/numerology/data`
- `GET /api/numerology/data/:datasetId`
- `GET /api/numerology/data/:datasetId/:entryKey`

### Readings (implemente)

- `GET /api/readings`
- `POST /api/readings`
- `GET /api/readings/:id`
- `DELETE /api/readings/:id`

## Modèle de données (Prisma)

### `User`

- `id`
- `email`
- `password`
- `createdAt`

### `Reading`

- `id`
- `userId`
- `firstName`
- `lastName`
- `birthDate`
- `category`
- `results` (JSON)
- `createdAt`

## Roadmap recommandée

1. Connexion PostgreSQL + migrations Prisma
2. Auth complete JWT (`register`, `login`, `me`) ✅
3. CRUD des `readings` ✅
4. Deplacement des calculs numerologiques cote backend ✅
5. Connexion du front React à l'API

## Exemples API numerology data

### 1) Lister les datasets disponibles

```bash
curl -X GET http://localhost:3000/api/numerology/data
```

Reponse (exemple) :

```json
{
  "datasets": [
    { "id": "challengeData", "kind": "object", "size": 9 },
    { "id": "crystalPathData", "kind": "array", "size": 11 }
  ]
}
```

### 2) Recuperer un dataset complet

```bash
curl -X GET http://localhost:3000/api/numerology/data/challengeData
```

Reponse (exemple) :

```json
{
  "datasetId": "challengeData",
  "dataset": {
    "1": {
      "description": "Apprendre l'independance, la confiance en soi et le courage."
    }
  }
}
```

### 3) Recuperer une entree precise d'un dataset

```bash
curl -X GET http://localhost:3000/api/numerology/data/challengeData/1
```

Reponse (exemple) :

```json
{
  "datasetId": "challengeData",
  "entryKey": "1",
  "entry": {
    "description": "Apprendre l'independance, la confiance en soi et le courage."
  }
}
```
