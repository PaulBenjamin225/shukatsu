# php/Dockerfile - VERSION AVEC L'ORDRE CORRECT

FROM php:8.2-apache

# 1. Installer toutes les dépendances système et PHP
RUN apt-get update && apt-get install -y git zip unzip libzip-dev dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo_mysql zip
RUN a2enmod rewrite

# 2. Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 3. Définir le répertoire de travail
WORKDIR /var/www/html

# --- 4. LA PARTIE CRUCIALE ---
#    a) On copie TOUT notre code d'abord.
COPY php/ .

#    b) ENSUITE, on installe les dépendances Composer.
#       Le dossier 'vendor' sera créé à l'intérieur de l'image et ne sera plus jamais écrasé.
RUN composer install --no-interaction --no-plugins --no-scripts --no-dev --optimize-autoloader

# 5. On copie les configurations externes
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf
COPY docker-config/entrypoint-prod.sh /usr/local/bin/entrypoint-prod.sh

# 6. On prépare le script de démarrage et les permissions
RUN dos2unix /usr/local/bin/entrypoint-prod.sh
RUN chmod +x /usr/local/bin/entrypoint-prod.sh
RUN chown -R www-data:www-data storage bootstrap/cache

# 7. On définit la commande de démarrage
CMD ["entrypoint-prod.sh"]