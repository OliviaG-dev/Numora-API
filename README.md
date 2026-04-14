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
- Mot de passe `register`: au moins 10 caracteres, 1 majuscule, 1 minuscule, 1 chiffre

## Documentation

- Documentation complete de l'auth: `docs/auth.md`
- Documentation complete numerology: `docs/numerology.md`
- Contrat OpenAPI numerology: `docs/numerology.openapi.yaml`

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

### Routes scaffoldees (non implementees)

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
3. CRUD des `readings`
4. Deplacement des calculs numerologiques cote backend ✅
5. Connexion du front React à l'API
