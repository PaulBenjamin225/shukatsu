# python/Dockerfile - VERSION AUTONOME

FROM python:3.9-slim

# On installe les dépendances système, SANS dos2unix pour l'instant
RUN apt-get update && apt-get install -y --no-install-recommends gcc && apt-get clean && rm -rf /var/lib/apt/lists/*

# On définit notre répertoire de travail
WORKDIR /app

# On copie UNIQUEMENT le fichier des dépendances
COPY requirements.txt .

# On installe les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# On copie TOUT LE CODE SOURCE (app.py, haarcascade.xml)
COPY . .

# On définit la commande de démarrage directement ici
# On utilise la méthode "exec" pour être sûr
CMD ["gunicorn", "--chdir", "/app", "--bind", "0.0.0.0:10000", "app:app"]