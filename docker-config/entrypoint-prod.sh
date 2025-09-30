#!/bin/sh

# On se place dans le bon dossier
cd /var/www/html

# --- SÉQUENCE DE PRÉPARATION POUR LA PRODUCTION ---

# 1. On efface tous les anciens fichiers de cache pour être sûr.
echo "--- Nettoyage de tous les caches ---"
php artisan optimize:clear

# 2. On recrée les fichiers de cache optimisés pour la production.
#    'config:cache' lit les variables d'environnement (comme CORS).
#    'route:cache' lit vos fichiers de routes et crée le carnet d'adresses.
echo "--- Mise en cache de la configuration et des routes ---"
php artisan config:cache
php artisan route:cache

# 3. On lance les migrations de la base de données.
echo "--- Lancement des migrations ---"
php artisan migrate --force

# 4. On lance le serveur Apache.
echo "--- Démarrage du serveur Apache ---"
exec apache2-foreground