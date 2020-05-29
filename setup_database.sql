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
