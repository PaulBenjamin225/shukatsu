# php/Dockerfile - Version Finale et Définitive

FROM php:8.2-apache

# 1. Installer les dépendances système et PHP
RUN apt-get update && apt-get install -y git zip unzip libzip-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo_mysql zip
RUN a2enmod rewrite

# 2. Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 3. Préparer le répertoire de travail
WORKDIR /var/www/html

# 4. Copier TOUT le code de l'application (depuis le sous-dossier 'php' du contexte)
# C'est la source de toutes nos erreurs. On ne peut pas le faire comme ça.

# -- NOUVELLE APPROCHE --
# On copie d'abord les fichiers de dépendances
COPY php/composer.json php/composer.lock ./
# On installe les dépendances. Le dossier /vendor est créé ici.
RUN composer install --no-interaction --no-plugins --no-scripts --no-dev --optimize-autoloader

# ENSUITE, on copie tout le reste des fichiers de l'application
COPY php/ .

# 5. On copie la configuration Apache et on définit les permissions
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf
RUN chown -R www-data:www-data storage bootstrap/cache

# 6. Commande de démarrage par défaut
CMD ["apache2-foreground"]