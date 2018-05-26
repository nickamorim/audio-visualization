FROM sismics/apache2:latest

RUN rm -fr /var/www/html/*
ADD .  /var/www/html
