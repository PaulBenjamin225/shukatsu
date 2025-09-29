# php/Dockerfile - VERSION AUTONOME AVEC GIT CLONE

# Étape 1: Image de base avec les outils
FROM php:8.2-apache AS base
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN a2enmod rewrite headers
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Étape 2: Cloner le code source
FROM base AS source
WORKDIR /app
# Render injecte ces variables d'environnement. On les utilise pour cloner.
RUN git clone --depth 1 --branch $RENDER_GIT_BRANCH $RENDER_GIT_REPO .

# Étape 3: Installer les dépendances
FROM source AS dependencies
WORKDIR /app/php
RUN composer install --no-dev --optimize-autoloader

# Étape 4: Image finale de production
FROM base AS final
WORKDIR /var/www/html

# On copie les dépendances installées
COPY --from=dependencies /app/php/vendor ./vendor
# On copie le code source
COPY --from=source /app/php .
# On copie la configuration Apache
COPY --from=source /app/docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf
# On copie le script de démarrage
COPY --from=source /app/docker-config/entrypoint-prod.sh /usr/local/bin/entrypoint-prod.sh

RUN dos2unix /usr/local/bin/entrypoint-prod.sh
RUN chmod +x /usr/local/bin/entrypoint-prod.sh

# On donne les bonnes permissions
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["entrypoint-prod.sh"]