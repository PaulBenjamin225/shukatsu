# php/Dockerfile - VERSION FINALE, AUTONOME ET ROBUSTE

FROM php:8.2-apache

# 1. Installer les dépendances système
RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Installer les extensions PHP
RUN docker-php-ext-install pdo_mysql zip

# 3. Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 4. Configurer Apache
RUN a2enmod rewrite headers substitute env
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf

# 5. Préparer le répertoire de l'application
WORKDIR /var/www/html

# 6. Copier le code source de Laravel
COPY php/ .

# 7. Installer les dépendances Composer
RUN composer install --no-interaction --no-plugins --no-scripts --no-dev --optimize-autoloader

# 8. Copier et préparer le script de démarrage
COPY docker-config/entrypoint-prod.sh /usr/local/bin/entrypoint-prod.sh
RUN dos2unix /usr/local/bin/entrypoint-prod.sh
RUN chmod +x /usr/local/bin/entrypoint-prod.sh

# 9. Définir la commande de démarrage
CMD ["entrypoint-prod.sh"]