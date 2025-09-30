#!/bin/sh

# On se place dans le répertoire de l'application
cd /var/www/html

# On attend que la base de données soit prête (sécurité supplémentaire)
# (Cette partie est optionnelle mais peut aider)
# docker-php-ext-install bcmath # Nécessaire pour le wait-for-it.sh si on l'utilisait

# On génère la clé d'application si elle n'existe pas
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
fi

# On force la mise en cache de la configuration et des routes
# C'est la solution à nos problèmes de CORS et de 404
echo "--- Mise en cache de la configuration et des routes ---"
php artisan config:cache
php artisan route:cache

# On lance les migrations
echo "--- Lancement des migrations ---"
php artisan migrate --force

# On donne les bonnes permissions AU DERNIER MOMENT
# pour être sûr que tous les fichiers (logs, cache) sont accessibles par Apache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# On lance Apache. 'exec' est crucial.
echo "--- Démarrage du serveur Apache ---"
exec apache2-foreground