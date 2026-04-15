# Documentation Readings Numora API

Cette documentation decrit l'implementation du module readings:

- `GET /api/readings`
- `POST /api/readings`
- `GET /api/readings/:id`
- `DELETE /api/readings/:id`

Elle couvre l'architecture, la validation, les reponses HTTP, la securite JWT, les tests et des exemples d'utilisation.

---

## 1) Vue d'ensemble

Le module readings permet a un utilisateur authentifie de:

1. creer une lecture numerologique (`POST`)
2. recuperer toutes ses lectures (`GET /readings`)
3. recuperer une lecture precise (`GET /readings/:id`)
4. supprimer une lecture (`DELETE /readings/:id`)

Toutes les routes sont protegees par le middleware `requireAuth`.

Important:

- les donnees sont scopees par `userId`
- un utilisateur ne peut pas consulter/supprimer les lectures d'un autre utilisateur
- les dates sont retournees au format ISO (`toISOString()`)

---

## 2) Structure des fichiers readings

- `src/routes/readings.routes.ts`
  - Wiring des 4 routes readings
- `src/controllers/readings.controller.ts`
  - Logique HTTP, statuts, mapping erreurs
- `src/services/readings.service.ts`
  - Validation metier + appels Prisma
- `src/models/reading.model.ts`
  - Typage `Reading`, `ReadingCategory`, `READING_CATEGORIES`
- `prisma/schema.prisma`
  - Modele `Reading` et relation vers `User`
- `src/middleware/auth.middleware.ts`
  - Verification JWT + injection `res.locals.auth`

---

## 3) Modele de donnees

Modele Prisma `Reading`:

- `id: String` (cuid)
- `userId: String`
- `firstName: String`
- `lastName: String`
- `birthDate: DateTime`
- `category: String`
- `results: Json`
- `createdAt: DateTime`

Relation:

- `Reading.userId -> User.id` avec `onDelete: Cascade`

---

## 4) Regles de validation (creation)

Endpoint concerne: `POST /api/readings`

Regles:

- `firstName`: string requis, non vide apres `trim()`
- `lastName`: string requis, non vide apres `trim()`
- `birthDate`: string parseable en date valide
- `category`: une des valeurs autorisees:
  - `life-path`
  - `compatibility`
  - `forecast`
  - `custom`
- `results`: objet JSON (pas `null`, pas tableau)

En cas d'erreur de validation:

- reponse `400`
- format: `{ "error": "<message>" }`

---

## 5) Details des endpoints

Base URL locale:

- `http://localhost:3000`

Header requis pour tous les endpoints readings:

```http
Authorization: Bearer <jwt>
```

### 5.1 `GET /api/readings`

Retourne la liste des lectures de l'utilisateur courant, triee par `createdAt` descendant.

Reponses possibles:

- `200 OK`
- `401 Unauthorized` (token manquant/invalide)
- `500 Internal Server Error`

Exemple `200`:

```json
{
  "readings": [
    {
      "id": "reading_1",
      "userId": "user_1",
      "firstName": "Marie",
      "lastName": "Dupont",
      "birthDate": "1990-03-15T00:00:00.000Z",
      "category": "life-path",
      "results": {
        "lifePath": 1
      },
      "createdAt": "2026-04-15T20:00:00.000Z"
    }
  ]
}
```

---

### 5.2 `POST /api/readings`

Cree une nouvelle lecture pour l'utilisateur courant.

Body JSON:

```json
{
  "firstName": "Marie",
  "lastName": "Dupont",
  "birthDate": "1990-03-15",
  "category": "life-path",
  "results": {
    "lifePath": 1,
    "expression": 7
  }
}
```

Reponses possibles:

- `201 Created`
- `400 Bad Request` (payload invalide)
- `401 Unauthorized` (token manquant/invalide)
- `500 Internal Server Error`

Exemple `201`:

```json
{
  "reading": {
    "id": "reading_1",
    "userId": "user_1",
    "firstName": "Marie",
    "lastName": "Dupont",
    "birthDate": "1990-03-15T00:00:00.000Z",
    "category": "life-path",
    "results": {
      "lifePath": 1,
      "expression": 7
    },
    "createdAt": "2026-04-15T20:00:00.000Z"
  }
}
```

---

### 5.3 `GET /api/readings/:id`

Retourne une lecture specifique de l'utilisateur courant.

Reponses possibles:

- `200 OK`
- `400 Bad Request` (id invalide)
- `401 Unauthorized` (token manquant/invalide)
- `404 Not Found` (lecture absente ou non accessible)
- `500 Internal Server Error`

Exemple `404`:

```json
{
  "error": "reading not found"
}
```

---

### 5.4 `DELETE /api/readings/:id`

Supprime une lecture specifique de l'utilisateur courant.

Reponses possibles:

- `204 No Content`
- `400 Bad Request` (id invalide)
- `401 Unauthorized` (token manquant/invalide)
- `404 Not Found` (lecture absente ou non accessible)
- `500 Internal Server Error`

---

## 6) Securite et isolation des donnees

Le middleware `requireAuth` extrait l'utilisateur depuis le JWT et stocke:

- `res.locals.auth.userId`
- `res.locals.auth.email` (optionnel)

Ensuite, le service applique toujours un filtre par `userId`:

- liste: `where: { userId }`
- get by id: `where: { id, userId }`
- delete: `where: { id, userId }`

Effet:

- pas d'acces cross-user
- fuite de donnees evitee au niveau query

---

## 7) Erreurs standard

Formats d'erreur utilises:

```json
{ "error": "..." }
```

Messages courants:

- `Unauthorized`
- `Missing or invalid Bearer token`
- `invalid reading id`
- `reading not found`
- `failed to fetch readings`
- `failed to fetch reading`
- `failed to create reading`
- `failed to delete reading`

---

## 8) Contrat OpenAPI

Le contrat OpenAPI qui documente les endpoints readings est dans:

- `docs/numerology.openapi.yaml`

Sections ajoutees:

- `paths./api/readings`
- `paths./api/readings/{id}`
- `components.securitySchemes.bearerAuth`
- `components.schemas.Reading`
- `components.schemas.CreateReadingInput`

---

## 9) Tests implementes

Les tests utilisent `vitest` + `supertest`.

Fichier:

- `tests/readings.integration.test.ts`

Scenarios couverts:

1. flow complet `create -> list -> get -> delete`
2. rejet payload invalide (`400`)
3. isolation multi-utilisateur (`404` sur acces/suppression cross-user)

Commande:

```bash
npm run test -- readings.integration.test.ts
```

---

## 10) Exemples d'utilisation (PowerShell)

### Creer une lecture

```powershell
$token = "<jwt>"
Invoke-RestMethod -Method POST http://localhost:3000/api/readings `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{
    "firstName": "Marie",
    "lastName": "Dupont",
    "birthDate": "1990-03-15",
    "category": "life-path",
    "results": { "lifePath": 1 }
  }'
```

### Lister ses lectures

```powershell
$token = "<jwt>"
Invoke-RestMethod -Method GET http://localhost:3000/api/readings `
  -Headers @{ Authorization = "Bearer $token" }
```

### Recuperer une lecture par id

```powershell
$token = "<jwt>"
$id = "reading_1"
Invoke-RestMethod -Method GET "http://localhost:3000/api/readings/$id" `
  -Headers @{ Authorization = "Bearer $token" }
```

### Supprimer une lecture

```powershell
$token = "<jwt>"
$id = "reading_1"
Invoke-WebRequest -Method DELETE "http://localhost:3000/api/readings/$id" `
  -Headers @{ Authorization = "Bearer $token" }
```
