# HumanRing

Une application web pour créer et gérer des engagements numériques entre utilisateurs.

## 📋 Table des matières
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)

## 🚀 Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure) ou yarn
- MongoDB (version 5.0 ou supérieure)
- Compte Auth0 (pour l'authentification)

## 🛠 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/AmineKLS/HumanRing.git
   cd HumanRing
   ```

2. **Backend**
   ```bash
   cd humanring-backend
   npm install
   # ou
   yarn
   ```

3. **Frontend**
   ```bash
   cd ../humanring-frontend
   npm install
   # ou
   yarn
   ```

## ⚙️ Configuration

### Auth0 Configuration

1. **Create a Post-Login Action** in your Auth0 dashboard:
   - Go to Actions > Flows > Login
   - Click "+" to add a new action
   - Select "Build Custom"
   - Name it "Add UUID and Sync to MongoDB"
   - Paste the following code:

```javascript
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");

exports.onExecutePostLogin = async (event, api) => {
  const namespace = "https://humanring.com/";
  let uuidToUse = event.user.app_metadata.uuid;

  if (!uuidToUse) {
    uuidToUse = uuidv4();
    await api.user.setAppMetadata('uuid', uuidToUse);
  }

  api.idToken.setCustomClaim(namespace + 'uuid', uuidToUse);
  api.accessToken.setCustomClaim(namespace + "uuid", uuidToUse);

  const uri = event.secrets.MONGO_DB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("humanringdb");
    const collection = db.collection("users");

    await collection.updateOne(
      { uuid: uuidToUse },
      {
        $set: {
          auth0sub: event.user.user_id,
          displayName: event.user.name,
          email: event.user.email,
          lastLogin: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  } finally {
    await client.close();
  }
};
```

2. **Add Required Secrets** to the Action:
   - `MONGO_DB_URI`: Your MongoDB connection string

3. **Deploy** the action and add it to your Login flow.

### Backend (humanring-backend)
Créez un fichier `.env` dans le dossier `humanring-backend` :
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/humanring
JWT_SECRET=votre_secret_jwt
AUTH0_DOMAIN=votre-domaine.auth0.com
AUTH0_AUDIENCE=votre-audience
```

### Frontend (humanring-frontend)
Créez un fichier `.env` dans le dossier `humanring-frontend` :
```env
VITE_AUTH0_DOMAIN=votre-domaine.auth0.com
VITE_AUTH0_CLIENT_ID=votre-client-id
VITE_AUTH0_AUDIENCE=votre-audience
VITE_API_URL=http://localhost:3000
```

## 🚀 Démarrage

1. **Démarrer le serveur MongoDB**
   Assurez-vous que MongoDB est en cours d'exécution localement.

2. **Démarrer le backend**
   ```bash
   cd humanring-backend
   npm run start:dev
   # ou
   yarn start:dev
   ```
   Le serveur sera accessible à : http://localhost:3000

3. **Démarrer le frontend**
   ```bash
   cd ../humanring-frontend
   npm run dev
   # ou
   yarn dev
   ```
   L'application sera accessible à : http://localhost:5173

## 🏗 Structure du projet

```
humanring/
├── humanring-backend/      # API NestJS
│   ├── src/
│   │   ├── auth/          # Authentification et autorisation
│   │   ├── rings/         # Gestion des engagements
│   │   ├── users/         # Gestion des utilisateurs
│   │   └── ...
│   └── ...
│
└── humanring-frontend/     # Application React
    ├── src/
    │   ├── components/    # Composants réutilisables
    │   ├── pages/         # Pages de l'application
    │   ├── services/      # Appels API
    │   └── ...
    └── ...
```

## 🛠 Technologies utilisées

### Backend
- NestJS
- MongoDB avec Mongoose
- JWT pour l'authentification
- Passport.js
- TypeScript

### Frontend
- React 18
- Vite
- Ant Design
- React Router
- Auth0 pour l'authentification
- Axios pour les appels API

