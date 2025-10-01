#!/bin/bash
set -e

echo "🚀 Lancement de l’application Laravel..."

# Nettoyage et mise en cache de la config/route/view
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migration de la base (force = pas d'interaction)
php artisan migrate --force || true

echo "✅ Préparation terminée. Lancement d’Apache..."

# Lancer Apache au premier plan
exec apache2-foreground
