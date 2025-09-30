# php/Dockerfile - Version de la dernière chance

FROM php:8.2-apache

# 1. Installer les dépendances
RUN apt-get update && apt-get install -y git zip unzip libzip-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo_mysql zip

# 2. Activer le module de réécriture d'Apache
RUN a2enmod rewrite

# 3. Définir le répertoire de travail
WORKDIR /var/www/html

# 4. Copier TOUT le projet dans ce répertoire
#    On copie depuis la racine du contexte de build, qui contient notre dossier 'php'
COPY ./php/ .

# 5. Installer les dépendances Composer
RUN composer install --no-dev --optimize-autoloader

# 6. Définir les permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# 7. Copier la configuration Apache
COPY ./docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf