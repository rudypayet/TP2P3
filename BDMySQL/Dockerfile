# Utiliser l'image officielle de MySQL
FROM mysql:8

# Définir les variables d'environnement pour MySQL
ENV MYSQL_ROOT_PASSWORD=rootpass
ENV MYSQL_DATABASE=licences
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=userpass

# Copier le fichier init.sql dans le dossier de MySQL pour l'initialisation
COPY init.sql /docker-entrypoint-initdb.d/

# Exposer le port 3306 pour MySQL
EXPOSE 3306
