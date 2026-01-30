
# 🧾 Application de vente de formations – Frontend Angular

## 📌 Description

Ce projet est une application **frontend Angular** dédiée à la consultation et à la gestion de **formations** (trainings), avec fonctionnalités de recherche, panier, gestion des clients et commandes.

L’application est structurée de manière modulaire et suit les bonnes pratiques Angular :

* séparation **composants / services / modèles**
* routage centralisé
* services dédiés à la logique métier
* composants orientés UI

---

## 🚀 Fonctionnalités principales

* 📚 **Liste des formations**

  * Affichage des formations disponibles
  * Recherche par mot-clé
* 🔍 **Barre de recherche**

  * Filtrage dynamique des formations
* 🛒 **Panier**

  * Ajout de formations
  * Consultation du contenu du panier
* 👤 **Clients**

  * Création et affichage des clients
* 📦 **Commandes**

  * Création d’une commande à partir du panier
* ❌ **Page 404**

  * Gestion des routes inexistantes

---

## 🗂️ Structure du projet

```text
src/
│
├── app/
│   ├── components/        # Composants visuels
│   │   ├── cart/           # Panier
│   │   ├── customer/       # Création / édition client
│   │   ├── customer-list/  # Liste des clients
│   │   ├── order/          # Commandes
│   │   ├── search-bar/     # Recherche de formations
│   │   ├── trainings/      # Liste des formations
│   │   └── not-found/      # Page 404
│   │
│   ├── model/             # Modèles métier
│   │   ├── cart/
│   │   ├── customer/
│   │   └── training/
│   │
│   ├── services/          # Services applicatifs
│   │   ├── cart/
│   │   ├── customer/
│   │   └── search-bar/
│   │
│   ├── app.routes.ts      # Définition des routes
│   ├── app.config.ts      # Configuration de l’application
│   └── app.ts             # Composant racine
│
├── index.html
├── main.ts                # Point d’entrée Angular
└── styles.css             # Styles globaux
```

---

## 🧠 Architecture

* **Composants**
  Responsables de l’affichage et de l’interaction utilisateur.

* **Services**
  Centralisent la logique métier (panier, clients, recherche).

* **Modèles**
  Représentent les entités métier (`Training`, `Customer`, `Cart`, etc.).

* **Routage**
  Géré via `app.routes.ts`, avec une route fallback vers `NotFoundComponent`.

---

## ⚙️ Prérequis

* Node.js ≥ 18
* Angular CLI ≥ 17

---

## ▶️ Lancer le projet

```bash
npm install
ng serve
```

Puis ouvrir :
👉 `http://localhost:4200`

---

## 🧪 Tests

Les fichiers `*.spec.ts` sont présents pour les tests unitaires.

```bash
ng test
```

---

## 🔧 Améliorations possibles

* Connexion à une API backend
* Persistance du panier (LocalStorage ou backend)
* Authentification utilisateur
* Validation avancée des formulaires
* Gestion des erreurs et loading states

---

## 📄 Licence

Projet à but pédagogique / académique.


