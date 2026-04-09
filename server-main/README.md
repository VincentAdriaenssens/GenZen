# Projet Server (GenZen)

Backend de l'application GenZen développé avec Spring Boot.

## Fonctionnement

L'application est une API REST pour la gestion des missions, écrans et utilisateurs.

### Structure

- `genzen/` : Module Spring Boot
  - `src/main/java/fr/but3/genzen/beans/` : Entités JPA
  - `src/main/java/fr/but3/genzen/controller/` : Contrôleurs REST
  - `src/main/java/fr/but3/genzen/service/` : Logique métier
  - `src/main/java/fr/but3/genzen/repository/` : Accès aux données
  - `src/main/resources/application.properties` : Configuration

### Branches

- **`main`** : Version actuelle sans sécurité avancée (configuration de production actuelle)
- **`security`** : Version de qualité avec Spring Security et chiffrement des mots de passe
  - Spring Security activé
  - Chiffrement BCrypt des mots de passe
  - Configuration des rôles (USER, ADMIN)
  - Pour utiliser : `git checkout security`
  - Configurer `application.properties` avec les variables d'environnement pour la production

## Compilation et Exécution

**Note :** Le `pom.xml` est dans `genzen/`. Exécutez Maven depuis ce dossier.

### Compilation
```bash
cd genzen
mvn clean compile
```

### Exécution
```bash
cd genzen
mvn spring-boot:run
```

L'application est accessible sur `http://localhost:8080`.

### Configuration de production actuelle (branche main)

Voici la configuration actuellement utilisée en production sur la branche `main` :

```properties
server.port=8080
spring.application.name=genzen

# DATABASE PROD CONFIG WITH POSTGRES
spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.PostgreSQLDialect
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=admin

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.open-in-view=false

spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:import.sql

app.cors.allowed-origin-patterns=http://localhost:*,http://127.0.0.1:*,http://192.168.*:*,http://10.*:*
```

**Note :** Cette configuration fonctionne actuellement en production, mais la version de qualité est sur la branche `security` qui intègre la sécurité Spring Security et le chiffrement des mots de passe.

### Configuration production (branche security)

Dans `application.properties`, utilisez les variables d'environnement :
```properties
server.port=8080
spring.application.name=genzen

spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.PostgreSQLDialect
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:import.sql

app.cors.allowed-origin-patterns=${APP_CORS_ALLOWED_ORIGIN_PATTERNS}
server.servlet.session.secret=${SERVER_SERVLET_SESSION_SECRET}
```

## API Principale

- `GET /api/users` : Liste des utilisateurs
- `POST /api/users` : Création d'utilisateur
- `POST /api/users/login` : Connexion
- `GET /api/missions` : Liste des missions
- `POST /api/missions` : Création de mission

## Tests
```bash
cd genzen
mvn test
```
