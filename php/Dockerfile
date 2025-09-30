# php/Dockerfile - VERSION FINALE QUI COPIE LE CODE

FROM php:8.2-apache

# 1. Dépendances système
RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Dépendances PHP
RUN docker-php-ext-install pdo_mysql zip

# 3. Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 4. Configuration Apache
RUN a2enmod rewrite headers
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf

# 5. Préparation de l'application
WORKDIR /var/www/html

# On copie d'abord les fichiers de dépendances pour optimiser le cache Docker
COPY php/composer.json php/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# Ensuite, on copie tout le reste du code Laravel
COPY php/ .

# On génère l'autoloader
RUN composer dump-autoload --optimize

# 6. Préparation du script de démarrage
COPY docker-config/entrypoint-prod.sh /usr/local/bin/entrypoint-prod.sh
RUN dos2unix /usr/local/bin/entrypoint-prod.sh
RUN chmod +x /usr/local/bin/entrypoint-prod.sh

# 7. Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# 8. Commande de démarrage
CMD ["entrypoint-prod.sh"]