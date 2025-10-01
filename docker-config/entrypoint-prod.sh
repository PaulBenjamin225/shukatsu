#!/bin/sh

cd /var/www/html

# On s'assure que les caches sont à jour avec les variables d'environnement
php artisan config:cache
php artisan route:cache

# On lance les migrations
php artisan migrate --force

# On lance Apache
exec apache2-foreground