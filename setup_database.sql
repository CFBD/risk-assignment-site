SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

CREATE TABLE public.assignment (
    id integer NOT NULL,
    turn_id smallint NOT NULL,
    territory_id smallint NOT NULL,
    weight numeric NOT NULL,
    min_stars smallint,
    max_stars smallint,
    mvp_farm boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.assignment_id_seq OWNED BY public.assignment.id;

CREATE TABLE public.player (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    reminder boolean
);

CREATE TABLE public.player_assignment (
    id integer NOT NULL,
    assignment_id integer NOT NULL,
    player_id integer NOT NULL,
    stars smallint NOT NULL,
    mvps smallint
);
CREATE SEQUENCE public.player_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.player_assignment_id_seq OWNED BY public.player_assignment.id;
CREATE SEQUENCE public.player_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.player_id_seq OWNED BY public.player.id;

CREATE TABLE public.player_role (
    id integer NOT NULL,
    player_id integer NOT NULL,
    role_id smallint NOT NULL
);
CREATE SEQUENCE public.player_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.player_role_id_seq OWNED BY public.player_role.id;

CREATE TABLE public.role (
    id smallint NOT NULL,
    name character varying(15) NOT NULL
);
CREATE SEQUENCE public.role_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;

CREATE TABLE public.territory (
    id smallint NOT NULL,
    name character varying(35) NOT NULL
);

ALTER TABLE ONLY public.assignment ALTER COLUMN id SET DEFAULT nextval('public.assignment_id_seq'::regclass);
ALTER TABLE ONLY public.player ALTER COLUMN id SET DEFAULT nextval('public.player_id_seq'::regclass);
ALTER TABLE ONLY public.player_assignment ALTER COLUMN id SET DEFAULT nextval('public.player_assignment_id_seq'::regclass);
ALTER TABLE ONLY public.player_role ALTER COLUMN id SET DEFAULT nextval('public.player_role_id_seq'::regclass);
ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.player_assignment
    ADD CONSTRAINT player_assignment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.player_role
    ADD CONSTRAINT player_role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.territory
    ADD CONSTRAINT territory_pkey PRIMARY KEY (id);

CREATE INDEX fki_fk_assignment_territory ON public.assignment USING btree (territory_id);
CREATE INDEX fki_fk_player_assignment_assignment ON public.player_assignment USING btree (assignment_id);
CREATE INDEX fki_fk_player_assignment_player ON public.player_assignment USING btree (player_id);
CREATE INDEX fki_fk_player_role_player ON public.player_role USING btree (player_id);
CREATE INDEX fki_fk_player_role_role ON public.player_role USING btree (role_id);
CREATE INDEX ix_assignment_turn ON public.assignment USING btree (turn_id);
CREATE UNIQUE INDEX ix_player_role_cover ON public.player_role USING btree (player_id, role_id);
CREATE UNIQUE INDEX ux_assignment_turn_territory ON public.assignment USING btree (turn_id, territory_id);

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT fk_assignment_territory FOREIGN KEY (territory_id) REFERENCES public.territory(id) NOT VALID;
ALTER TABLE ONLY public.player_assignment
    ADD CONSTRAINT fk_player_assignment_assignment FOREIGN KEY (assignment_id) REFERENCES public.assignment(id) NOT VALID;
ALTER TABLE ONLY public.player_assignment
    ADD CONSTRAINT fk_player_assignment_player FOREIGN KEY (player_id) REFERENCES public.player(id) NOT VALID;
ALTER TABLE ONLY public.player_role
    ADD CONSTRAINT fk_player_role_player FOREIGN KEY (player_id) REFERENCES public.player(id) NOT VALID;
ALTER TABLE ONLY public.player_role
    ADD CONSTRAINT fk_player_role_role FOREIGN KEY (role_id) REFERENCES public.role(id) NOT VALID;

INSERT INTO public.role(id, name)
VALUES  (1,'unvetted'),
        (2,'vetted'),
        (3,'mod'),
        (4,'allied'),
        (5,'blacklisted');

INSERT INTO public.territory(id, name)
VALUES  (1,'Air Force'),
        (2,'Akron'),
        (3,'Alabama'),
        (4,'Appalachian State'),
        (5,'Arizona'),
        (6,'Arizona State'),
        (7,'Arkansas'),
        (8,'Arkansas State'),
        (9,'Army'),
        (10,'Auburn'),
        (11,'Ball State'),
        (12,'Baylor'),
        (13,'Boise State'),
        (14,'Boston College'),
        (15,'Bowling Green'),
        (16,'Buffalo'),
        (17,'BYU'),
        (18,'California'),
        (19,'Central Michigan'),
        (20,'Chaos'),
        (21,'Charlotte'),
        (22,'Cincinnati'),
        (23,'Clemson'),
        (24,'Coastal Carolina'),
        (25,'Colorado'),
        (26,'Colorado State'),
        (27,'Connecticut'),
        (28,'Duke'),
        (29,'East Carolina'),
        (30,'Eastern Michigan'),
        (31,'Florida'),
        (32,'Florida Atlantic'),
        (33,'Florida International'),
        (34,'Florida State'),
        (35,'Fresno State'),
        (36,'Georgia'),
        (37,'Georgia Southern'),
        (38,'Georgia State'),
        (39,'Georgia Tech'),
        (40,'Hawai''i'),
        (41,'Houston'),
        (42,'Illinois'),
        (43,'Indiana'),
        (44,'Iowa'),
        (45,'Iowa State'),
        (46,'Kansas'),
        (47,'Kansas State'),
        (48,'Kent State'),
        (49,'Kentucky'),
        (50,'Liberty'),
        (51,'Louisiana'),
        (52,'Louisiana Monroe'),
        (53,'Louisiana Tech'),
        (54,'Louisville'),
        (55,'LSU'),
        (56,'Marshall'),
        (57,'Maryland'),
        (58,'Memphis'),
        (59,'Miami'),
        (60,'Miami (OH)'),
        (61,'Michigan'),
        (62,'Michigan State'),
        (63,'Middle Tennessee'),
        (64,'Minnesota'),
        (65,'Mississippi State'),
        (66,'Missouri'),
        (67,'Navy'),
        (68,'NC State'),
        (69,'Nebraska'),
        (70,'Nevada'),
        (71,'New Mexico'),
        (72,'New Mexico State'),
        (73,'North Carolina'),
        (74,'Northern Illinois'),
        (75,'North Texas'),
        (76,'Northwestern'),
        (77,'Notre Dame'),
        (78,'Ohio'),
        (79,'Ohio State'),
        (80,'Oklahoma'),
        (81,'Oklahoma State'),
        (82,'Old Dominion'),
        (83,'Ole Miss'),
        (84,'Oregon'),
        (85,'Oregon State'),
        (86,'Penn State'),
        (87,'Pittsburgh'),
        (88,'Purdue'),
        (89,'Rice'),
        (90,'Rutgers'),
        (91,'San Diego State'),
        (92,'San José State'),
        (93,'SMU'),
        (94,'South Alabama'),
        (95,'South Carolina'),
        (96,'Southern Mississippi'),
        (97,'South Florida'),
        (98,'Stanford'),
        (99,'Syracuse'),
        (100,'TCU'),
        (101,'Temple'),
        (102,'Tennessee'),
        (103,'Texas'),
        (104,'Texas A&M'),
        (105,'Texas State'),
        (106,'Texas Tech'),
        (107,'Toledo'),
        (108,'Troy'),
        (109,'Tulane'),
        (110,'Tulsa'),
        (111,'UAB'),
        (112,'UCF'),
        (113,'UCLA'),
        (114,'UMass'),
        (115,'UNLV'),
        (116,'USC'),
        (117,'Utah'),
        (118,'Utah State'),
        (119,'UTEP'),
        (120,'UT San Antonio'),
        (121,'Vanderbilt'),
        (122,'Virginia'),
        (123,'Virginia Tech'),
        (124,'Wake Forest'),
        (125,'Washington'),
        (126,'Washington State'),
        (127,'Western Kentucky'),
        (128,'Western Michigan'),
        (129,'West Virginia'),
        (130,'Wisconsin'),
        (131,'Wyoming');