# php/Dockerfile 

FROM php:8.2-apache

# --- Étape 1: Installation des dépendances système ---
# On ajoute dos2unix pour corriger les fins de ligne des scripts créés sur Windows.
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --- Étape 2: Installation des extensions PHP ---
RUN docker-php-ext-install pdo_mysql zip

# --- Étape 3: Installation de Composer ---
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# --- Étape 4: Configuration d'Apache ---
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# --- Étape 5: Définir le répertoire de travail ---
WORKDIR /var/www/html

# --- Étape 6: Préparation du script de démarrage ---
# Copier notre script de démarrage de production
COPY docker-config/entrypoint-prod.sh /usr/local/bin/entrypoint-prod.sh

# Convertir les fins de ligne du script au format Unix (LF)
RUN dos2unix /usr/local/bin/entrypoint-prod.sh

# Le rendre exécutable
RUN chmod +x /usr/local/bin/entrypoint-prod.sh

# Définir ce script comme la commande que le conteneur doit lancer au démarrage
CMD ["entrypoint-prod.sh"]