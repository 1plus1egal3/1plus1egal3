# 1+1=3 — l'application

Application mobile (iPhone et Android) pour les couples.
Elle est construite avec **Expo (React Native)** et **Supabase**, et son code est rangé sur **GitHub**.

---

## Ce qui est déjà dans l'app

| Écran | État |
|---|---|
| **Intro** : mouvement horloger photo, rouage animé, cœurs, logo au scroll | ✅ |
| **Accueil** : mouvement, « Jour N de votre histoire », phrase selon l'heure, ciel du couple, « Vos espaces » animés | ✅ |
| **Barre d'onglets** : Accueil · Crise (médaillon ECG) · 1+1=3 (cœur qui bat) · Couple (médaillon grenat, arc doré) · Activité | ✅ |
| **Les parcours du nous** : 23 thèmes, recherche, accès de sécurité, page thème, page parcours (lecteur de podcast + PDF) | ✅ |
| **Souvenirs — Notre histoire** : compteurs, ajout photo / pensée / moment (date, lieu, phrase) | ✅ |
| Couple, Activité, Crise | 🕓 Écrans d'attente (« en conception ») |

Tant que Supabase n'est pas branché, l'app tourne avec des **données d'exemple** (Léa & Hugo).

---

## 1. Mettre le code sur GitHub

1. Sur github.com, ouvre le dépôt **1plus1egal3**.
2. Clique sur **Add file → Upload files**.
3. Glisse **le contenu** du dossier `1plus1egal3` (pas le dossier lui-même). Le `.zip` ne contient pas de `node_modules`, c'est normal.
4. Clique sur **Commit changes**.

## 2. Préparer Supabase

1. Sur supabase.com, crée un projet en **région Europe**.
2. Va dans **SQL Editor**, colle tout le fichier `supabase/migrations/20261020000000_init.sql`, puis clique sur **Run**.
   Ça crée les tables, la sécurité (chaque couple ne voit que ses données), les espaces de stockage et les 23 thèmes / 46 parcours.
3. Va dans **Project Settings → API Keys**. Copie l'URL du projet et la **publishable key**.
4. Dans le projet, copie `.env.example` en `.env` et colle ces deux valeurs.
   Ne mets **jamais** le fichier `.env` sur GitHub (il est déjà ignoré).

## 3. Lancer l'app sur ton téléphone

Il faut **Node.js** installé sur l'ordinateur (version LTS sur nodejs.org).

```bash
npm install
npx expo start
```

Ensuite, deux possibilités :
- **Scanne le QR code avec l'app Expo Go** sur ton téléphone.
- Si une fonction native manque dans Expo Go, crée une version de développement avec `npx eas-cli@latest build --profile development`.

## 4. Publier sur l'App Store et Google Play

1. Crée un compte **Apple Developer** (abonnement annuel) et un compte **Google Play Console** (frais uniques).
2. Lance ces commandes :

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform all --profile production
npx eas-cli@latest submit --platform all
```

Les identifiants de l'app sont dans `app.json`, à ajuster si besoin :
- iOS : `com.unplusunegaltrois.app`
- Android : `com.unplusunegaltrois.app`

---

## Où trouver quoi

```
src/app/index.tsx                     Intro
src/app/(tabs)/accueil.tsx            Accueil
src/app/(tabs)/parcours/              Les parcours du nous (catalogue, thème, parcours)
src/app/(tabs)/souvenirs.tsx          Notre histoire
src/app/(tabs)/couple.tsx, crise.tsx, activite.tsx   (à construire)
src/components/tab-bar.tsx            Barre d'onglets animée
src/components/animated-icons.tsx     Cœur qui bat, ECG, anneaux, arc doré, soleil, polaroïd
src/components/movement.tsx           Mouvement horloger photoréaliste animé
src/constants/theme.ts                Couleurs et typographies (identité validée — pas de jaune)
src/data/themes.ts                    Les 23 thèmes et 46 parcours
src/lib/supabase.ts                   Connexion Supabase
supabase/migrations/                  Schéma de la base de données
```

## Prochaines étapes

- Connexion des comptes (e-mail ou Apple / Google) et **invitation du ou de la partenaire** : les fonctions `create_couple` et `join_couple` sont déjà prêtes dans la base.
- Brancher les podcasts et les PDF : dépose les fichiers dans le stockage Supabase « contenus », puis renseigne `podcast_path` et `pdf_path` dans la table `parcours`.
- Construire les onglets **Couple**, **Activité** et **Crise**.
- Gérer les **abonnements** dans l'app (RevenueCat conseillé).
