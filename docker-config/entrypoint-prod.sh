#!/bin/sh

# On se place dans le bon dossier
cd /var/www/html

# On exécute les migrations (c'est indispensable)
php artisan migrate --force

# On lance Apache
exec apache2-foreground