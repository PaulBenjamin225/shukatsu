# php/Dockerfile 

FROM php:8.2-apache

# --- Étape 1: Installation des dépendances système ---
# On ajoute libzip-dev, qui est nécessaire pour compiler l'extension PHP 'zip'.
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# --- Étape 2: Installation des extensions PHP ---
# Maintenant que libzip-dev est là, cette commande va réussir.
RUN docker-php-ext-install pdo_mysql zip

# --- Étape 3: Installation de Composer ---
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# --- Étape 4: Configuration d'Apache ---
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# --- Étape 5: Définir le répertoire de travail ---
WORKDIR /var/www/html