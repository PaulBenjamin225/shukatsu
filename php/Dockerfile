# php/Dockerfile - Version de la dernière chance

FROM php:8.2-apache

# 1. Installer les dépendances système et PHP
RUN apt-get update && apt-get install -y git zip unzip libzip-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo_mysql zip
RUN a2enmod rewrite

# 2. Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 3. Définir le répertoire de travail
WORKDIR /var/www/html

# 4. Copier TOUT le code de l'application Laravel
#    On copie depuis le sous-dossier 'php' du contexte de build
COPY ./php/ .

# 5. Installer les dépendances Composer
#    Cela se fait DANS l'image, en utilisant le code qu'on vient de copier
RUN composer install --no-interaction --no-plugins --no-scripts --no-dev --optimize-autoloader

# 6. Copier la configuration Apache
#    On copie depuis le dossier 'docker-config' du contexte de build
COPY ./docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf

# 7. Définir les permissions pour Laravel
RUN chown -R www-data:www-data storage bootstrap/cache