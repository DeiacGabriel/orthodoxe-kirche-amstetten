FROM php:8.2-apache

# Aktiviere mod_rewrite
RUN a2enmod rewrite

# Installiere zusätzliche PHP-Erweiterungen falls benötigt
RUN docker-php-ext-install pdo pdo_mysql

# Kopiere die Projekt-Dateien
COPY . /var/www/html/

# Ändere DocumentRoot auf _public_html
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/_public_html|g' /etc/apache2/sites-available/000-default.conf

# Konfiguriere Apache für Zugriff auf alle Verzeichnisse
RUN echo '<Directory /var/www/html/>' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    Options Indexes FollowSymLinks' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    AllowOverride All' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    Require all granted' >> /etc/apache2/sites-available/000-default.conf && \
    echo '</Directory>' >> /etc/apache2/sites-available/000-default.conf

# Erstelle ein Startup-Script für Berechtigungen
RUN echo '#!/bin/bash\n\
chown -R www-data:www-data /var/www/html/_public_html/uploads\n\
chmod -R 777 /var/www/html/_public_html/uploads\n\
chown -R www-data:www-data /var/www/html/admin/Home\n\
chmod -R 777 /var/www/html/admin/Home\n\
chown -R www-data:www-data /var/www/html/admin/AboutUs\n\
chmod -R 777 /var/www/html/admin/AboutUs\n\
exec apache2-foreground' > /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exponiere Port 80
EXPOSE 80

# Verwende das Startup-Script
CMD ["/usr/local/bin/docker-entrypoint.sh"]
