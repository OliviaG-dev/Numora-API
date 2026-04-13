# Documentation Auth Numora API

Cette documentation decrit l'implementation auth actuellement en place dans l'API:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Elle couvre l'architecture, le flux complet, les regles de securite, les erreurs, les variables d'environnement et les tests.

---

## 1) Vue d'ensemble

L'authentification est basee sur un token JWT (stateless):

1. Un utilisateur cree son compte via `register`.
2. L'utilisateur se connecte via `login`.
3. L'API renvoie un token JWT signe.
4. Le client envoie ensuite ce token dans `Authorization: Bearer <token>`.
5. Le middleware `requireAuth` valide le token et injecte l'identite dans `res.locals.auth`.

Le mot de passe n'est jamais retourne dans les reponses HTTP.

---

## 2) Structure des fichiers auth

- `src/controllers/auth.controller.ts`
  - Logique des endpoints `register`, `login`, `me`
- `src/middleware/auth.middleware.ts`
  - Verification du Bearer token et du JWT
- `src/middleware/rate-limit.middleware.ts`
  - Protection anti-bruteforce sur `register` et `login`
- `src/utils/auth.ts`
  - Utilitaires auth centralises (email, password policy, JWT)
- `src/types/express.d.ts`
  - Typage TypeScript de `res.locals.auth`
- `src/routes/auth.routes.ts`
  - Wiring des routes auth
- `src/server.ts`
  - Validation "fail-fast" de la configuration JWT au demarrage

---

## 3) Variables d'environnement

Variables utilisees:

- `JWT_SECRET` (obligatoire)
  - Secret de signature JWT
  - **Minimum 32 caracteres**
  - Si absent ou trop court: le serveur refuse de demarrer
- `JWT_EXPIRES_IN` (optionnelle)
  - Duree de vie du token (defaut: `7d`)
  - Exemples: `15m`, `1h`, `7d`
- `AUTH_RATE_LIMIT_WINDOW_MS` (optionnelle)
  - Fenetre du rate-limit en millisecondes
  - Defaut: `900000` (15 minutes)
- `AUTH_RATE_LIMIT_MAX` (optionnelle)
  - Nombre maximal de tentatives auth par IP sur la fenetre
  - Defaut: `10`

Exemple `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/numora"
JWT_SECRET="replace_with_a_very_long_random_secret_at_least_32_chars"
JWT_EXPIRES_IN="7d"
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10
```

---

## 4) Regles de validation

### 4.1 Email

- Normalisation systematique: `trim()` + `toLowerCase()`
- Validation format via regex simple: `^[^\s@]+@[^\s@]+\.[^\s@]+$`

### 4.2 Mot de passe (`register`)

Regles minimales:

- au moins 10 caracteres
- au moins 1 majuscule
- au moins 1 minuscule
- au moins 1 chiffre

### 4.3 Hashing

- Hash du mot de passe via `bcryptjs`
- Cost factor: `12`
- Le hash est stocke en base (`User.password`), jamais le mot de passe brut

---

## 5) Details des endpoints

Base URL locale:

- `http://localhost:3000`

### 5.1 `POST /api/auth/register`

Cree un nouvel utilisateur.

Body JSON:

```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```

Reponses possibles:

- `201 Created`
  - Utilisateur cree
- `400 Bad Request`
  - body invalide / email invalide / password trop faible
- `409 Conflict`
  - email deja utilise
- `500 Internal Server Error`
  - erreur interne

Exemple reponse `201`:

```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "createdAt": "2026-04-13T20:00:00.000Z"
  }
}
```

---

### 5.2 `POST /api/auth/login`

Authentifie un utilisateur et renvoie un JWT.

Body JSON:

```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```

Reponses possibles:

- `200 OK`
  - authentification reussie, token retourne
- `400 Bad Request`
  - body invalide
- `401 Unauthorized`
  - identifiants invalides
- `429 Too Many Requests`
  - rate limit atteint
- `500 Internal Server Error`
  - erreur interne

Exemple reponse `200`:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "createdAt": "2026-04-13T20:00:00.000Z"
  }
}
```

---

### 5.3 `GET /api/auth/me`

Retourne l'utilisateur courant a partir du token Bearer.

Header requis:

```http
Authorization: Bearer <jwt>
```

Reponses possibles:

- `200 OK`
  - utilisateur authentifie retourne
- `401 Unauthorized`
  - token absent, invalide ou expire
- `404 Not Found`
  - utilisateur introuvable
- `500 Internal Server Error`
  - erreur interne

Exemple reponse `200`:

```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "createdAt": "2026-04-13T20:00:00.000Z"
  }
}
```

---

## 6) Fonctionnement du middleware `requireAuth`

Le middleware execute les etapes suivantes:

1. Verifie que le header `Authorization` existe et commence par `Bearer `.
2. Extrait le token.
3. Verifie la signature et l'expiration via `verifyAccessToken`.
4. Verifie que `payload.sub` est present et de type string.
5. Injecte l'identite dans `res.locals.auth`:
   - `userId`
   - `email` (si present dans le token)
6. Passe au handler suivant via `next()`.

En cas d'echec, renvoie `401`.

---

## 7) Contenu du JWT

Claims actuellement signes:

- `sub`: id utilisateur (source de verite pour l'auth)
- `email`: email utilisateur (claim informative)
- `exp`: gere automatiquement via `expiresIn`

Le token est signe via `jsonwebtoken` avec `JWT_SECRET`.

---

## 8) Rate limiting auth

Les endpoints suivants sont limites:

- `POST /api/auth/register`
- `POST /api/auth/login`

Comportement:

- Jusqu'a `AUTH_RATE_LIMIT_MAX` requetes par IP sur `AUTH_RATE_LIMIT_WINDOW_MS`
- Ensuite reponse `429`:

```json
{
  "error": "Too many authentication attempts, please retry later"
}
```

---

## 9) Typage TypeScript de l'auth

Le fichier `src/types/express.d.ts` etend `Express.Locals`:

- `res.locals.auth?: { userId: string; email?: string }`

Benefices:

- Evite les casts fragiles dans les controllers
- Rend l'intention claire pour les routes protegees

---

## 10) Scenarios de test implementes

Les tests utilisent `vitest` + `supertest`.

### 10.1 `tests/auth.integration.test.ts`

- flow complet `register -> login -> me`
- rejet mot de passe faible a l'inscription
- rejet identifiants invalides a la connexion
- rejet `/me` sans Bearer token

### 10.2 `tests/auth.rate-limit.test.ts`

- validation du retour `429` quand la limite est depassee

### 10.3 `tests/server.config.test.ts`

- validation du fail-fast serveur quand `JWT_SECRET` est trop court

Commande:

```bash
npm test
```

---

## 11) Exemples d'utilisation (PowerShell)

### Register

```powershell
Invoke-RestMethod -Method POST http://localhost:3000/api/auth/register `
  -ContentType "application/json" `
  -Body '{"email":"user@example.com","password":"StrongPass123"}'
```

### Login

```powershell
$login = Invoke-RestMethod -Method POST http://localhost:3000/api/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"user@example.com","password":"StrongPass123"}'
```

### Me

```powershell
Invoke-RestMethod -Method GET http://localhost:3000/api/auth/me `
  -Headers @{ Authorization = "Bearer $($login.token)" }
```

---

## 12) Limites actuelles et recommandations

L'implementation actuelle est solide pour un MVP/projet en production simple, mais voici les prochaines ameliorations recommandees:

1. Ajouter un systeme de refresh token (rotation, revocation)
2. Ajouter une strategie logout (blacklist ou token versionning)
3. Uniformiser le format d'erreur API sur toute l'application
4. Ajouter des tests e2e reels avec une base de test Postgres
5. Ajouter protection brute-force avancee (lockout utilisateur, captcha selon contexte)
6. Ajouter observabilite securite (audit logs auth)

---

## 13) Checklist de verification rapide

- [ ] `JWT_SECRET` >= 32 caracteres
- [ ] migration Prisma appliquee
- [ ] `npm run build` OK
- [ ] `npm test` OK
- [ ] `register`, `login`, `me` verifies manuellement
- [ ] rate limit observe en local (optionnel)

