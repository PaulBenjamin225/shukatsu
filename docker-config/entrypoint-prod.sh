#!/bin/sh

# On se place dans le répertoire de l'application
cd /app

# On utilise le chemin absolu vers PHP pour une robustesse maximale
echo "--- Lancement des migrations ---"
/usr/local/bin/php artisan migrate --force

# On lance le serveur Octane. 'exec' est crucial.
echo "--- Démarrage du serveur Octane sur le port 10000 ---"
exec /usr/local/bin/php artisan octane:start --host=0.0.0.0 --port=10000