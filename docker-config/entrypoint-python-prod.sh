#!/bin/sh

# On se place dans le bon dossier
cd /var/www/html

# --- NETTOYAGE COMPLET DES CACHES ---
# C'est la partie la plus importante pour résoudre l'erreur 404
echo "--- Nettoyage des caches Laravel (config, route, cache) ---"
php artisan config:clear
php artisan route:clear
php artisan cache:clear
# --- FIN DU NETTOYAGE ---

# On lance les migrations
echo "--- Lancement des migrations ---"
php artisan migrate --force

# On lance le serveur Apache.
echo "--- Démarrage du serveur Apache ---"
exec apache2-foreground