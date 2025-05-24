DROP DATABASE IF EXISTS fladale_db;
CREATE DATABASE fladale_db;
USE fladale_db;

CREATE USER IF NOT EXISTS "admin"@"localhost" IDENTIFIED BY "adminpassword";
GRANT ALL PRIVILEGES ON fladale_db.* TO "admin"@"localhost";
FLUSH PRIVILEGES;

DROP TABLE IF EXISTS utenti;
CREATE TABLE utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(100),
    cognome VARCHAR(100),
    telefono VARCHAR(30),
    citta VARCHAR(100),
    indirizzo VARCHAR(255),
    token_accesso VARCHAR(255),
    attivo BOOLEAN DEFAULT FALSE,
    token_attivazione VARCHAR(255)
);

DROP TABLE IF EXISTS piante;
CREATE TABLE piante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descrizione TEXT,
    immagine_url VARCHAR(255),
    hover_url VARCHAR(255),
    richiesta_acqua_giorni INT
);

DROP TABLE IF EXISTS tags;
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    categoria VARCHAR(100)
);

DROP TABLE IF EXISTS piante_tags;
CREATE TABLE piante_tags (
    id_piante INT,
    id_tags INT,
    PRIMARY KEY (id_piante, id_tags),
    FOREIGN KEY (id_piante) REFERENCES piante(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tags) REFERENCES tags(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS preferiti;
CREATE TABLE preferiti (
    id_utente INT,
    id_pianta INT,
    percentuale_annaffiamento INT CHECK (percentuale_annaffiamento BETWEEN 0 AND 100),
    data_ultimo_annaffiamento DATE,
    PRIMARY KEY (id_utente, id_pianta),
    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pianta) REFERENCES piante(id) ON DELETE CASCADE
);

INSERT INTO piante (nome, descrizione, immagine_url, hover_url, richiesta_acqua_giorni) VALUES
/*1*/("AGLAONEMA", "Pianta ornamentale da interno, facile da curare", "aglaonema.jpeg", "aglaonema_hover.jpeg", 7),
/*2*/("ALOE VERA", "Pianta succulenta con proprieta' curative", "aloeVera.jpeg", "aloeVera_hover.jpeg", 14),
/*3*/("ANTHURIUM", "Pianta da fiore rosso o rosa, elegante e tropicale", "anthurium.jpeg", "anthurium_hover.jpeg", 4),
/*4*/("ARECA", "Palma tropicale elegante per ambienti interni", "areca.jpeg", "areca_hover.jpeg", 5),
/*5*/("AZALEA", "Pianta fiorita da interno o balcone, molto colorata", "azalea.jpeg", "azalea_hover.jpeg", 3),
/*6*/("BAMBU", "Pianta resistente e decorativa, anche in vaso", "bambu.jpeg", "bambu_hover.jpeg", 3),
/*7*/("BANANO", "Pianta tropicale ornamentale con grandi foglie", "banano.jpeg", "banano_hover.jpeg", 4),
/*8*/("BASILICO", "Pianta aromatica molto usata in cucina", "basilico.jpeg", "basilico_hover.jpeg", 2),
/*9*/("BEGONIA", "Pianta da fiore con varieta' decorative e vivaci", "begonia.jpeg", "begonia_hover.jpeg", 5),
/*10*/("CACTUS", "Pianta succulenta che richiede poca acqua", "cactus.jpeg", "cactus_hover.jpeg", 20),
/*11*/("CALATHEA", "Pianta decorativa con foglie variegate", "calathea.jpeg", "calathea_hover.jpeg", 4),
/*12*/("CAMELIA", "Fiore elegante e raffinato, fiorisce in inverno-primavera", "camelia.jpeg", "camelia_hover.jpeg", 5),
/*13*/("CHLOROPHYTUM", "Pianta d'appartamento resistente, purifica l'aria", "chlorophytum.jpeg", "chlorophytum_hover.jpeg", 7),
/*14*/("CICLAMINO", "Pianta invernale da fiore, ideale per appartamenti freschi", "ciclamino.jpeg", "ciclamino_hover.jpeg", 3),
/*15*/("DALIA", "Pianta ornamentale dai fiori spettacolari e variegati", "dalia.jpeg", "dalia_hover.jpeg", 4),
/*16*/("DRACENA", "Pianta sempreverde perfetta per interni", "dracena.jpeg", "dracena_hover.jpeg", 10),
/*17*/("EDERA", "Rampicante versatile per interno ed esterno", "edera.jpeg", "edera_hover.jpeg", 5),
/*18*/("ERBA CIPOLLINA", "Aromatica per cucina, facile da coltivare", "erbaCipollina.jpeg", "erbaCipollina_hover.jpeg", 3),
/*19*/("EUPHORBIA", "Succulenta decorativa, richiede poca cura", "euphorbia.jpeg", "euphorbia_hover.jpeg", 15),
/*20*/("FELCE", "Pianta verde per interni ombrosi e umidi", "felce.jpeg", "felce_hover.jpeg", 2),
/*21*/("FICUS", "Pianta d'appartamento resistente e decorativa", "ficus.jpeg", "ficus_hover.jpeg", 6),
/*22*/("FICUS ELASTICA", "Ficus con foglie spesse e lucide, molto robusto", "ficusElas.jpeg", "ficusElas_hover.jpeg", 8),
/*23*/("GARDENIA", "Pianta da fiore profumata, richiede cura", "gardenia.jpeg", "gardenia_hover.jpeg", 3),
/*24*/("GERANIO", "Pianta da balcone, resistente con fiori vivaci", "geranio.jpeg", "geranio_hover.jpeg", 4),
/*25*/("GIADA", "Pianta grassa simbolo di prosperita'", "giada.jpeg", "giada_hover.jpeg", 10),
/*26*/("GIGLIO", "Pianta a fiore grande e profumato, ideale per aiuole e vasi", "giglio.jpeg", "giglio_hover.jpeg", 3),
/*27*/("HIBISCUS", "Pianta tropicale con grandi fiori vistosi", "hibiscus.jpeg", "hibiscus_hover.jpeg", 2),
/*28*/("KALANCHOE", "Pianta grassa fiorita, molto resistente", "kalanchoe.jpeg", "kalanchoe_hover.jpeg", 10),
/*29*/("KENTIA", "Palma elegante per ambienti interni", "kentia.jpeg", "kentia_hover.jpeg", 5),
/*30*/("LANTANA", "Pianta estiva dai fiori multicolore, molto amata dagli insetti impollinatori", "lantana.jpeg", "lantana_hover.jpeg", 3),
/*31*/("LAVANDA", "Pianta aromatica da esterno, profumata e utile", "lavanda.jpeg", "lavanda_hover.jpeg", 4),
/*32*/("MENTA", "Aromatica per infusi, fresca e rigogliosa", "menta.jpeg", "menta_hover.jpeg", 3),
/*33*/("MARGHERITA", "Fiore semplice e solare, ideale per giardini e balconi", "margherita.jpeg", "margherita_hover.jpeg", 2),
/*34*/("MONSTERA", "Pianta tropicale con foglie forate, molto decorativa", "monstera.jpeg", "monstera_hover.jpeg", 6),
/*35*/("NARCISO", "Fiore primaverile profumato, simbolo di rinascita", "narciso.jpeg", "narciso_hover.jpeg", 3),
/*36*/("ORTENSIA", "Pianta con grandi fiori a palla, ideale in mezzombra", "ortensia.jpeg", "ortensia_hover.jpeg", 4),
/*37*/("PEPEROMIA", "Piccola pianta da interno, decorativa e facile", "peperomia.jpeg", "peperomia_hover.jpeg", 5),
/*38*/("PETUNIA", "Pianta fiorita da balcone, ricca di colori e profumi", "petunia.jpeg", "petunia_hover.jpeg", 3),
/*39*/("POTHOS", "Rampicante facile e resistente per interni", "pothos.jpeg", "pothos_hover.jpeg", 7),
/*40*/("PRIMULA", "Fiore colorato che annuncia la primavera", "primula.jpeg", "primula_hover.jpeg", 3),
/*41*/("ROSA", "Fiore classico, simbolo di bellezza e amore, da esterno o vaso", "rosa.jpeg", "rosa_hover.jpeg", 3),
/*42*/("ROSMARINO", "Aromatica per cucina, resistente al sole", "rosmarino.jpeg", "rosmarino_hover.jpeg", 4),
/*43*/("SANSEVIERIA", "Pianta d'appartamento robusta e purificante", "sansevieria.jpeg", "sansevieria_hover.jpeg", 14),
/*44*/("SCHEFFLERA", "Pianta verde decorativa da interno", "schefflera.jpeg", "schefflera_hover.jpeg", 5),
/*45*/("SPATHIFILLO", "Pianta da fiore bianco, purifica l'aria", "spatifillo.jpeg", "spatifillo_hover.jpeg", 4),
/*46*/("STELLA DI NATALE", "Pianta festiva con brattee rosse decorative", "stella.jpeg", "stella_hover.jpeg", 6),
/*47*/("TULIPANO", "Fiore primaverile dai colori brillanti", "tulipano.jpeg", "tulipano_hover.jpeg", 3),
/*48*/("VALERIANA", "Pianta officinale con proprieta' rilassanti", "valeriana.jpeg", "valeriana_hover.jpeg", 3),
/*49*/("VIOLA", "Piccolo fiore resistente, adatto anche all'inverno", "viola.jpeg", "viola_hover.jpeg", 4),
/*50*/("ZAMIOCULCAS", "Pianta sempreverde molto resistente", "zamioculcas.jpeg", "zamioculcas_hover.jpeg", 10);


INSERT INTO tags (nome, categoria) VALUES
/*1*/("Esterno", "Luogo"),
/*2*/("Ufficio", "Luogo"),
/*3*/("Salotto", "Luogo"),
/*4*/("Cucina", "Luogo"),
/*5*/("Camera", "Luogo"),
/*6*/("Bagno", "Luogo"),
/*7*/("Facile", "Cura"),
/*8*/("Intermedio", "Cura"),
/*9*/("Difficile", "Cura"),
/*10*/("Umido", "Ambiente"),
/*11*/("Secco", "Ambiente"),
/*12*/("Sole", "Luce"),
/*13*/("Ombra", "Luce"),
/*14*/("Penombra", "Luce"),
/*15*/("Piccola", "Grandezza"),
/*16*/("Media", "Grandezza"),
/*17*/("Grande", "Grandezza"),
/*18*/("Depurativa", "Altro"),
/*19*/("Tropicale", "Altro"),
/*20*/("Aromatica", "Altro"),
/*21*/("Fiore", "Altro"),
/*22*/("Scopri-Ufficio", "Hidden"),
/*23*/("Scopri-Salotto", "Hidden"),
/*24*/("Scopri-Cucina", "Hidden"),
/*25*/("Scopri-Camera", "Hidden"),
/*26*/("Scopri-Bagno", "Hidden");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AGLAONEMA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AGLAONEMA" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AGLAONEMA" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AGLAONEMA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AGLAONEMA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AGLAONEMA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AGLAONEMA" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ALOE VERA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ALOE VERA" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ALOE VERA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ALOE VERA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ALOE VERA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ALOE VERA" AND t.nome = "Scopri-Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ALOE VERA" AND t.nome = "Scopri-Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ALOE VERA" AND t.nome = "Scopri-Cucina");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Difficile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Tropicale");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Aromatica");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ARECA" AND t.nome = "Scopri-Salotto");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BAMBU" AND t.nome = "Scopri-Bagno");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BANANO" AND t.nome = "Difficile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BANANO" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BANANO" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BANANO" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BANANO" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BANANO" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BANANO" AND t.nome = "Scopri-Bagno");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Difficile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Aromatica");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Tropicale");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BASILICO" AND t.nome = "Scopri-Cucina");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Difficile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CACTUS" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Scopri-Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CALATHEA" AND t.nome = "Scopri-Bagno");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Tropicale");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Scopri-Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CHLOROPHYTUM" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DRACENA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DRACENA" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DRACENA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DRACENA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DRACENA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DRACENA" AND t.nome = "Scopri-Salotto");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Aromatica");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Scopri-Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EDERA" AND t.nome = "Scopri-Camera");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ERBA CIPOLLINA" AND t.nome = "Scopri-Cucina");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EUPHORBIA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EUPHORBIA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EUPHORBIA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EUPHORBIA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EUPHORBIA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EUPHORBIA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "EUPHORBIA" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FELCE" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FELCE" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FELCE" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FELCE" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FELCE" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FELCE" AND t.nome = "Tropicale");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FELCE" AND t.nome = "Scopri-Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FELCE" AND t.nome = "Scopri-Camera");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Aromatica");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Scopri-Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS ELASTICA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS ELASTICA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS ELASTICA" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS ELASTICA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS ELASTICA" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS ELASTICA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "FICUS ELASTICA" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GARDENIA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GARDENIA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GARDENIA" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GARDENIA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GARDENIA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GARDENIA" AND t.nome = "Aromatica");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GARDENIA" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GARDENIA" AND t.nome = "Scopri-Camera");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Difficile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIADA" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KENTIA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KENTIA" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KENTIA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KENTIA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KENTIA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KENTIA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KENTIA" AND t.nome = "Scopri-Salotto");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Scopri-Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LAVANDA" AND t.nome = "Scopri-Cucina");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Tropicale");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MENTA" AND t.nome = "Scopri-Cucina");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MONSTERA" AND t.nome = "Scopri-Salotto");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Tropicale");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PEPEROMIA" AND t.nome = "Scopri-Cucina");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Aromatica");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Scopri-Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Scopri-Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "POTHOS" AND t.nome = "Scopri-Cucina");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSMARINO" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSMARINO" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSMARINO" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSMARINO" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSMARINO" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSMARINO" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSMARINO" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSMARINO" AND t.nome = "Scopri-Cucina");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Tropicale");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Scopri-Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Scopri-Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Scopri-Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SANSEVIERIA" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Difficile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Aromatica");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SCHEFFLERA" AND t.nome = "Scopri-Salotto");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Depurativa");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Scopri-Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "SPATHIFILLO" AND t.nome = "Scopri-Camera");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VALERIANA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VALERIANA" AND t.nome = "Umido");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VALERIANA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VALERIANA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VALERIANA" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VALERIANA" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VALERIANA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VALERIANA" AND t.nome = "Scopri-Camera");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Secco");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Camera");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Cucina");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Bagno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Fiore");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Scopri-Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ZAMIOCULCAS" AND t.nome = "Scopri-Ufficio");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ANTHURIUM" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ANTHURIUM" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ANTHURIUM" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ANTHURIUM" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ANTHURIUM" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AZALEA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AZALEA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AZALEA" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AZALEA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "AZALEA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BEGONIA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BEGONIA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BEGONIA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BEGONIA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "BEGONIA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CICLAMINO" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CICLAMINO" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CICLAMINO" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CICLAMINO" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CICLAMINO" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GERANIO" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GERANIO" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GERANIO" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GERANIO" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GERANIO" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "HIBISCUS" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "HIBISCUS" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "HIBISCUS" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "HIBISCUS" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "HIBISCUS" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KALANCHOE" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KALANCHOE" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KALANCHOE" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KALANCHOE" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "KALANCHOE" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LANTANA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LANTANA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LANTANA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LANTANA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "LANTANA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PRIMULA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PRIMULA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PRIMULA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PRIMULA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PRIMULA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "STELLA DI NATALE" AND t.nome = "Salotto");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "STELLA DI NATALE" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "STELLA DI NATALE" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "STELLA DI NATALE" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "STELLA DI NATALE" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSA" AND t.nome = "Difficile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ROSA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MARGHERITA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MARGHERITA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MARGHERITA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MARGHERITA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "MARGHERITA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PETUNIA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PETUNIA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PETUNIA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PETUNIA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "PETUNIA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VIOLA" AND t.nome = "Ufficio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VIOLA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VIOLA" AND t.nome = "Ombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VIOLA" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "VIOLA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CAMELIA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CAMELIA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CAMELIA" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CAMELIA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "CAMELIA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ORTENSIA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ORTENSIA" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ORTENSIA" AND t.nome = "Penombra");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ORTENSIA" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "ORTENSIA" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "TULIPANO" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "TULIPANO" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "TULIPANO" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "TULIPANO" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "TULIPANO" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "NARCISO" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "NARCISO" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "NARCISO" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "NARCISO" AND t.nome = "Piccola");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "NARCISO" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIGLIO" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIGLIO" AND t.nome = "Intermedio");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIGLIO" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIGLIO" AND t.nome = "Grande");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "GIGLIO" AND t.nome = "Fiore");

INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DALIA" AND t.nome = "Esterno");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DALIA" AND t.nome = "Facile");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DALIA" AND t.nome = "Sole");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DALIA" AND t.nome = "Media");
INSERT INTO piante_tags (id_piante, id_tags)
(SELECT p.id, t.id FROM piante p, tags t WHERE p.nome = "DALIA" AND t.nome = "Fiore");