#!/bin/sh

# On se place dans le bon dossier
cd /var/www/html

# On utilise le chemin absolu vers PHP pour être sûr
echo "--- Lancement des migrations ---"
/usr/local/bin/php artisan migrate --force

# On lance Apache
echo "--- Démarrage du serveur Apache ---"
exec apache2-foreground