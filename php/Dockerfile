# Utilise l’image officielle PHP avec Apache
FROM php:8.2-apache

# 1. Installer les dépendances système et extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo_mysql zip
RUN a2enmod rewrite

# 2. Installer Composer (copié depuis l’image officielle Composer)
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 3. Définir le répertoire de travail
WORKDIR /var/www/html

# 4. Copier les fichiers de dépendances en premier (cache Docker optimisé)
COPY php/composer.json php/composer.lock ./

# 5. Installer les dépendances (vendor/)
RUN composer install --no-interaction --no-scripts --no-dev --optimize-autoloader

# 6. Copier le reste du projet
COPY php/ .

# 7. Copier la config Apache
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf

# 8. Permissions pour Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

# 9. Copier le script d’entrée
COPY docker-config/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# 10. Commande de démarrage
CMD ["entrypoint.sh"]
