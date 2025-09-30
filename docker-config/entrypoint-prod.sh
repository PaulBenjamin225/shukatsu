#!/bin/sh

# On se place dans le bon dossier
cd /var/www/html

# On utilise le chemin absolu vers l'exécutable PHP
echo "--- Nettoyage des caches ---"
/usr/local/bin/php artisan optimize:clear

echo "--- Lancement des migrations ---"
/usr/local/bin/php artisan migrate --force

# On lance Apache
echo "--- Démarrage du serveur Apache ---"
exec apache2-foreground