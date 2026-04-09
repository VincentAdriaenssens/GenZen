-- Schéma de référence PostgreSQL pour GenZen (aligné avec les entités JPA)

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mdp VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE parent_de (
    iduser BIGINT NOT NULL,
    idparent BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (iduser, idparent),
    FOREIGN KEY (iduser) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (idparent) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE missions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(500),
    tmp INTEGER NOT NULL,
    created_by_parent BIGINT
);

CREATE TABLE realise (
    iduser BIGINT NOT NULL,
    idmissions BIGINT NOT NULL,
    valide BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    validated_at TIMESTAMP,
    reward_available_on DATE,
    reward_minutes INTEGER NOT NULL DEFAULT 0,
    reward_consumed_minutes INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (iduser, idmissions),
    FOREIGN KEY (iduser) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (idmissions) REFERENCES missions(id) ON DELETE CASCADE
);

CREATE TABLE temp (
    id BIGSERIAL PRIMARY KEY,
    iduser BIGINT NOT NULL UNIQUE,
    temps_max INTEGER NOT NULL,
    temps_recompenses INTEGER NOT NULL,
    FOREIGN KEY (iduser) REFERENCES users(id) ON DELETE CASCADE
);
