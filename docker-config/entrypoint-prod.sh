#!/bin/sh

# On se place dans le bon dossier
cd /var/www/html

# On lance les migrations
echo "--- Lancement des migrations ---"
php artisan migrate --force

# On lance le serveur Apache.
# "exec" est important, il remplace le processus du script par celui d'Apache,
# ce qui permet à Render de le superviser correctement.
echo "--- Démarrage du serveur Apache ---"
exec apache2-foreground