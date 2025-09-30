#!/bin/sh

cd /var/www/html

# ... (génération de la clé, etc.)

echo "--- Mise en cache de la configuration et des routes ---"
php artisan config:cache
php artisan route:cache

echo "--- Lancement des migrations ---"
php artisan migrate --force

# --- AJOUT IMPORTANT ---
# On s'assure que l'application n'est plus en mode maintenance
echo "--- Activation de l'application ---"
php artisan up
# --- FIN DE L'AJOUT ---

# On donne les permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "--- Démarrage du serveur Apache ---"
exec apache2-foreground