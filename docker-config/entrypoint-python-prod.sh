#!/bin/sh

# On se place dans le bon dossier
cd /app

# On lance Gunicorn depuis le bon dossier
echo "--- Démarrage du serveur Gunicorn ---"
exec gunicorn --bind 0.0.0.0:$PORT app:app