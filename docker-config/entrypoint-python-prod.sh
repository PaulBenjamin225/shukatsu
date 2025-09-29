#!/bin/sh

# On se place dans le bon dossier
cd /var/www/html

# On efface l'ancien cache de configuration et on en crée un nouveau
# à partir des variables d'environnement actuelles.
echo "--- Mise en cache de la configuration ---"
php artisan config:cache

# On lance les migrations
echo "--- Lancement des migrations ---"
php artisan migrate --force

# On lance le serveur Apache.
echo "--- Démarrage du serveur Apache ---"
exec apache2-foreground