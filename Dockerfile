FROM php:8.2-apache

RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && a2enmod rewrite \
    && sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf \
    && rm -rf /var/lib/apt/lists/*

RUN { \
      echo "upload_max_filesize = 16M"; \
      echo "post_max_size = 18M"; \
      echo "max_file_uploads = 20"; \
    } > /usr/local/etc/php/conf.d/uploads.ini

COPY backend/ /var/www/html/

RUN mkdir -p uploads/gallery uploads/payments uploads/profiles uploads/events \
    && chown -R www-data:www-data uploads \
    && chmod -R 755 uploads

COPY docker/apache-entrypoint.sh /usr/local/bin/apache-entrypoint.sh
RUN chmod +x /usr/local/bin/apache-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["apache-entrypoint.sh"]
