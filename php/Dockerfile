# php/Dockerfile - VERSION "FORCE COPY"

FROM php:8.2-apache

# 1. On installe nos dépendances
RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql zip
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 2. On active les modules Apache
RUN a2enmod rewrite headers

# 3. On définit le répertoire de travail
WORKDIR /var/www/html

# --- 4. COPIE EXPLICITE DU CODE ---
# C'est la partie la plus importante. On dit à Docker de copier le contenu
# du dossier 'php' de notre projet (qui est le contexte de build)
# dans le répertoire de travail actuel (/var/www/html).
COPY . .

# 5. On copie la configuration Apache
COPY docker-config/apache/my-site.conf /etc/apache2/sites-available/000-default.conf

# 6. On copie le script de démarrage
COPY docker-config/entrypoint-prod.sh /usr/local/bin/entrypoint-prod.sh
RUN dos2unix /usr/local/bin/entrypoint-prod.sh
RUN chmod +x /usr/local/bin/entrypoint-prod.sh

# 7. On s'assure que Apache a les droits sur les fichiers
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

CMD ["entrypoint-prod.sh"]