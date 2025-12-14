
---

# Frontend – `frontend/README.md`

Interface web pour Smart City Hub, développée avec **React 18** + **Vite**.  
Permet aux différents rôles (citoyen, agent, superviseur, admin) de gérer et visualiser les incidents, la carte, les notifications temps réel et les dashboards.

## Stack Technique

- React 18
- Vite
- React Router DOM v6
- Axios
- SockJS + STOMP (WebSocket)
- React Leaflet + Leaflet
- Emotion (CSS-in-JS)
- React Hook Form + Yup
- React Toastify
- Recharts (dashboards)

## Structure du Projet

```
frontend/
├── src/
│ ├── api/ # Clients API (auth, incidents, users, categories...)
│ ├── components/ # Composants UI réutilisables
│ ├── context/ # AuthContext, NotificationContext, etc.
│ ├── hooks/ # Hooks personnalisés (useAuth, useWebSocket...)
│ ├── pages/ # Pages (Login, Register, Incidents, Map, Dashboards...)
│ ├── router/ # Définition des routes
│ ├── styles/ # Thème global, styles Emotion
│ ├── utils/ # Helpers (dates, formatage, constantes)
│ ├── App.jsx
│ └── main.jsx
├── public/
├── index.html
├── package.json
└── vite.config.js
```


## Prérequis

- Node.js 18+
- npm ou yarn
- Backend démarré sur `http://localhost:8080`

## Configuration

Créer un fichier `frontend/.env` :

```
VITE_API_BASE_URL=http://localhost:8080
VITE_WEBSOCKET_URL=http://localhost:8080/ws
```


## Installation & Lancement

```
cd frontend

Installer dépendances
npm install

ou
yarn install

Lancer en mode développement
npm run dev

ou
yarn dev
```

- Application accessible sur : `http://localhost:5173` (par défaut Vite)

## Build production :

```
npm run build
npm run preview
```



## Authentification côté Frontend

- Login / Register connectés à l’API backend (`/auth/login`, `/auth/register`).
- JWT stocké dans `localStorage`.
- Intercepteur Axios ajoute automatiquement `Authorization: Bearer <token>`.
- **AuthContext** gère :
  - utilisateur courant
  - rôle
  - état connecté / déconnecté
  - redirections (guard routes)

Pages typiques :

- `/login`
- `/register`
- `/` – Dashboard selon rôle
- `/incidents`
- `/incidents/new`
- `/incidents/:id`
- `/map`
- `/admin/users`
- `/admin/categories`

## Notifications Temps Réel

- Connexion via SockJS + STOMP à `VITE_WEBSOCKET_URL`.
- `NotificationContext` stocke les notifications.
- Affichage :
  - Icône cloche avec compteur
  - Liste des notifications
  - Toasts (React Toastify) pour les nouveaux événements importants

## Carte Interactive

- Page `/map` :
  - Carte Leaflet centrée sur la ville
  - Marqueurs colorés en fonction du statut (nouveau, en cours, résolu, critique)
  - Popup avec résumé + lien vers détails incident
  - Bouton “Me localiser”
  - Filtres (catégorie, statut, urgence)

## Dashboards

- **CitizenDashboard** :
  - Nombre d’incidents créés
  - Répartition par statut (donut)
  - Derniers incidents

- **AgentDashboard** :
  - Incidents assignés
  - Incidents résolus (semaine / mois)
  - Temps moyen de résolution
  - Score de satisfaction

- **AdminDashboard** :
  - Total incidents / incidents actifs / résolus
  - Graphiques : incidents par catégorie, évolution temporelle
  - Classement des agents

## Lint & Qualité

```
npm run lint
```


Configurer éventuellement Prettier + ESLint selon vos règles.

---

# Intégration Backend/Frontend

- Le frontend consomme les API exposées par le backend via Axios :
  - Base URL : `VITE_API_BASE_URL`
  - Toutes les routes protégées exigent un JWT valide.
- WebSocket :
  - Frontend se connecte à `VITE_WEBSOCKET_URL` avec le token pour recevoir :
    - création d’incidents
    - changements de statut
    - assignations
    - demandes d’évaluation

---

