# python/Dockerfile - VERSION DE PRODUCTION

FROM python:3.9-slim

# --- 1. Installation des dépendances système ---
# On installe 'dos2unix' par précaution pour corriger les fins de ligne de notre script.
RUN apt-get update && apt-get install -y dos2unix && apt-get clean && rm -rf /var/lib/apt/lists/*

# --- 2. Préparation de l'environnement Python ---
# On définit le répertoire de travail
WORKDIR /app

# On copie et on installe les paquets Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# On copie le reste de notre code (app.py, haarcascade...xml) dans le conteneur
COPY . .

# --- 3. Préparation du script de démarrage ---
# On copie notre script de démarrage depuis le dossier partagé 'docker-config'
COPY docker-config/entrypoint-python-prod.sh /usr/local/bin/entrypoint-python-prod.sh

# On corrige ses fins de ligne (très important)
RUN dos2unix /usr/local/bin/entrypoint-python-prod.sh

# On le rend exécutable
RUN chmod +x /usr/local/bin/entrypoint-python-prod.sh

# --- 4. Commande de démarrage ---
# On définit ce script comme la commande par défaut que le conteneur doit lancer
CMD ["entrypoint-python-prod.sh"]