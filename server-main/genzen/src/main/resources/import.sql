-- Jeu de donnees de demo GenZen

DELETE FROM realise;
DELETE FROM parent_de;
DELETE FROM temp;
DELETE FROM missions;
DELETE FROM users;

INSERT INTO users (id, email, mdp, admin) VALUES (1, 'parent.martin@genzen.local', 'parent123', true);
INSERT INTO users (id, email, mdp, admin) VALUES (2, 'parent.durand@genzen.local', 'parent123', true);
INSERT INTO users (id, email, mdp, admin) VALUES (3, 'emma@genzen.local', 'enfant123', false);
INSERT INTO users (id, email, mdp, admin) VALUES (4, 'leo@genzen.local', 'enfant123', false);
INSERT INTO users (id, email, mdp, admin) VALUES (5, 'nina@genzen.local', 'enfant123', false);

INSERT INTO parent_de (iduser, idparent, created_at) VALUES (3, 1, TIMESTAMP '2026-03-01 08:00:00');
INSERT INTO parent_de (iduser, idparent, created_at) VALUES (4, 1, TIMESTAMP '2026-03-01 08:00:00');
INSERT INTO parent_de (iduser, idparent, created_at) VALUES (5, 2, TIMESTAMP '2026-03-01 08:00:00');

INSERT INTO temp (id, iduser, temps_max, temps_recompenses) VALUES (1, 3, 90, 30);
INSERT INTO temp (id, iduser, temps_max, temps_recompenses) VALUES (2, 4, 60, 20);
INSERT INTO temp (id, iduser, temps_max, temps_recompenses) VALUES (3, 5, 75, 25);

INSERT INTO missions (id, title, description, tmp, created_by_parent) VALUES (1, 'Ranger la chambre', 'Ranger et aspirer la chambre', 20, 1);
INSERT INTO missions (id, title, description, tmp, created_by_parent) VALUES (2, 'Faire les devoirs', 'Devoirs termines et cartable prepare', 30, 1);
INSERT INTO missions (id, title, description, tmp, created_by_parent) VALUES (3, 'Lecture', 'Lire 20 minutes sans ecran', 20, 1);
INSERT INTO missions (id, title, description, tmp, created_by_parent) VALUES (4, 'Aider en cuisine', 'Mettre la table puis debarrasser', 15, 2);
INSERT INTO missions (id, title, description, tmp, created_by_parent) VALUES (5, 'Sortie marche', 'Marche de 30 minutes', 30, 2);

INSERT INTO realise (iduser, idmissions, valide, completed_at, validated_at, reward_available_on, reward_minutes, reward_consumed_minutes) VALUES (3, 1, true, TIMESTAMP '2026-03-06 18:10:00', TIMESTAMP '2026-03-06 20:00:00', DATE '2026-03-07', 30, 10);
INSERT INTO realise (iduser, idmissions, valide, completed_at, validated_at, reward_available_on, reward_minutes, reward_consumed_minutes) VALUES (3, 2, true, TIMESTAMP '2026-03-08 18:20:00', TIMESTAMP '2026-03-08 20:15:00', DATE '2026-03-09', 30, 0);
INSERT INTO realise (iduser, idmissions, valide, completed_at, validated_at, reward_available_on, reward_minutes, reward_consumed_minutes) VALUES (3, 3, false, TIMESTAMP '2026-03-09 17:40:00', NULL, NULL, 0, 0);
INSERT INTO realise (iduser, idmissions, valide, completed_at, validated_at, reward_available_on, reward_minutes, reward_consumed_minutes) VALUES (4, 1, false, TIMESTAMP '2026-03-05 18:30:00', TIMESTAMP '2026-03-05 20:00:00', NULL, 0, 0);
INSERT INTO realise (iduser, idmissions, valide, completed_at, validated_at, reward_available_on, reward_minutes, reward_consumed_minutes) VALUES (4, 2, true, TIMESTAMP '2026-03-04 18:15:00', TIMESTAMP '2026-03-04 19:45:00', DATE '2026-03-05', 20, 20);
INSERT INTO realise (iduser, idmissions, valide, completed_at, validated_at, reward_available_on, reward_minutes, reward_consumed_minutes) VALUES (5, 4, true, TIMESTAMP '2026-03-06 18:00:00', TIMESTAMP '2026-03-06 19:00:00', DATE '2026-03-07', 25, 0);
INSERT INTO realise (iduser, idmissions, valide, completed_at, validated_at, reward_available_on, reward_minutes, reward_consumed_minutes) VALUES (5, 5, true, TIMESTAMP '2026-03-07 11:00:00', TIMESTAMP '2026-03-07 20:00:00', DATE '2026-03-08', 25, 5);

-- Recalage des sequences identity apres insertion manuelle des IDs
ALTER TABLE users ALTER COLUMN id RESTART WITH 100;
ALTER TABLE missions ALTER COLUMN id RESTART WITH 100;
ALTER TABLE temp ALTER COLUMN id RESTART WITH 100;
