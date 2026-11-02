# JobRadar — Frontend

Tableau de bord Next.js (App Router) pour la veille d'offres d'alternance.

Nécessite l'API du projet séparé `jobradar-backend` (par défaut sur http://localhost:8000).

## Prérequis
- Docker Desktop + Docker Compose, ou Node.js 20+

## Démarrage
1. Copier `.env.example` vers `.env` et ajuster `NEXT_PUBLIC_API_URL` si l'API n'est pas sur `http://localhost:8000`.
2. Lancer l'API (`jobradar-backend`).
3. Lancer : `docker compose up --build`
   - ou hors Docker : `npm install` puis `npm run dev`
4. Interface : http://localhost:3000

`NEXT_PUBLIC_API_URL` est intégrée au moment du build : reconstruire l'image après l'avoir modifiée. Côté API, `CORS_ORIGINS` doit autoriser l'URL du frontend.
