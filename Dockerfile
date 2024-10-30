# Stage de développement
FROM node:18-alpine AS development

# Créer le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances avec tous les devDependencies
RUN npm install

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Compiler l'application
RUN npm run build

# Stage de production
FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# Copier le code compilé et les fichiers nécessaires du stage de développement
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/main"]