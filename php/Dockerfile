# php/Dockerfile - VERSION FINALE PROD

FROM php:8.2-apache

# --- 1. Installation des dépendances système ---
# On installe tout ce dont on a besoin en une seule fois.
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --- 2. Installation des extensions PHP ---
RUN docker-php-ext-install pdo_mysql zip

# --- 3. Installation de Composer ---
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# --- 4. Configuration d'Apache ---
# On active les modules AVANT de copier notre configuration qui les utilise.
RUN a2enmod rewrite headers
# On copie notre fichier de configuration Apache.
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf

# --- 5. Préparation de l'application ---
# On définit le répertoire de travail
WORKDIR /var/www/html

# On copie et prépare notre script de démarrage
COPY docker-config/entrypoint-prod.sh /usr/local/bin/entrypoint-prod.sh
RUN dos2unix /usr/local/bin/entrypoint-prod.sh
RUN chmod +x /usr/local/bin/entrypoint-prod.sh

# --- 6. Commande de démarrage ---
# On définit ce script comme la commande par défaut
CMD ["entrypoint-prod.sh"]