# EP-Backend API

## Description

Backend API pour l'application EP (Event Planning), développée avec NestJS et Prisma. Cette API permet la gestion d'événements, d'utilisateurs et de réservations.

## Technologies

- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript
- JWT pour l'authentification
- Jest pour les tests

## Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- PostgreSQL
- Un fichier .env (voir configuration)

## Configuration

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
JWT_SECRET="votre_secret_jwt"
PORT=3000
```

## Installation

```bash
# Installation des dépendances
$ npm install

# Configuration de la base de données
$ npx prisma migrate dev
$ npx prisma generate
```

## Lancement de l'application

```bash
# Mode développement
$ npm run start:dev

# Mode production
$ npm run start:prod
```

## Structure du projet

```
src/
├── auth/           # Authentification
├── users/          # Gestion des utilisateurs
├── events/         # Gestion des événements
├── bookings/       # Gestion des réservations
├── common/         # Utilitaires partagés
└── prisma/         # Schémas et migrations Prisma
```

## API Endpoints

### Authentification

- POST /auth/login - Connexion
- POST /auth/register - Inscription

### Utilisateurs

- GET /users - Liste des utilisateurs
- GET /users/:id - Détails d'un utilisateur
- PATCH /users/:id - Modification d'un utilisateur
- DELETE /users/:id - Suppression d'un utilisateur

### Événements

- GET /events - Liste des événements
- POST /events - Création d'un événement
- GET /events/:id - Détails d'un événement
- PATCH /events/:id - Modification d'un événement
- DELETE /events/:id - Suppression d'un événement

### Réservations

- GET /bookings - Liste des réservations
- POST /bookings - Création d'une réservation
- GET /bookings/:id - Détails d'une réservation
- PATCH /bookings/:id - Modification d'une réservation
- DELETE /bookings/:id - Suppression d'une réservation

## Tests

```bash
# Tests unitaires
$ npm run test

# Tests e2e
$ npm run test:e2e

# Couverture des tests
$ npm run test:cov
```

## Déploiement

1. Construire l'application :

```bash
$ npm run build
```

2. Configurer les variables d'environnement de production

3. Lancer l'application :

```bash
$ npm run start:prod
```

## Documentation API

La documentation complète de l'API est disponible sur :

- Swagger UI : `http://localhost:3000/api`
- Documentation JSON : `http://localhost:3000/api-json`

## Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Sécurité

Pour signaler une vulnérabilité de sécurité, veuillez envoyer un email à [votre-email@domain.com]

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

- Développeur - [Votre Nom]
- Email - [votre-email@domain.com]
- Projet Link: [https://github.com/Jaybee-v/ep-backend](https://github.com/Jaybee-v/ep-backend)
