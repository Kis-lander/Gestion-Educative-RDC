# Déploiement Render gratuit

Cette configuration sert uniquement aux tests.

## Limites du gratuit

- Le service web peut s'endormir après une période sans trafic.
- Le système de fichiers est éphémère: les fichiers envoyés dans `public/uploads` peuvent disparaître après redémarrage ou redeploy.
- La base PostgreSQL gratuite expire après 30 jours.

## Étapes

1. Poussez le projet sur GitHub, GitLab ou Bitbucket.
2. Allez sur Render, puis **New > Blueprint**.
3. Choisissez le dépôt du projet.
4. Render détecte `render.yaml`.
5. Lancez la création.
6. Une fois le premier déploiement terminé, ouvrez l'URL `.onrender.com`.

## Configuration créée

- Service web Node.js gratuit.
- Base PostgreSQL gratuite.
- Migrations exécutées au démarrage du service, car Render ne supporte pas `preDeployCommand` sur le plan gratuit.
- Node.js fixé à `24.14.1`, la version par défaut récente de Render compatible avec AdonisJS.
- Le build installe les dépendances de développement nécessaires à `node ace build`, puis le dossier `build` réinstalle uniquement les dépendances de production.
- Sessions en cookies.
- Emails en mode console pour les tests.

## À prévoir avant production

- Passer la base PostgreSQL en plan payant.
- Ajouter un stockage persistant pour les fichiers joints.
- Configurer un vrai service email, par exemple Brevo.
- Mettre `APP_KEY` dans un secret stable et ne plus le régénérer.
