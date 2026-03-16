BEGIN;

-- Drop and recreate team_join_request without the unique constraint on team_id/user_id
-- and with the type column built in from the start
DROP TABLE IF EXISTS public.team_join_request CASCADE;

CREATE TABLE IF NOT EXISTS public.team_join_request
(
    request_id serial NOT NULL,
    team_id integer,
    user_id integer,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    request_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    type character varying(20) DEFAULT 'JOIN_REQUEST',
    CONSTRAINT team_join_request_pkey PRIMARY KEY (request_id),
    CONSTRAINT team_join_request_team_id_user_id_type_key UNIQUE (team_id, user_id, type)
);

ALTER TABLE IF EXISTS public.team_join_request
    ADD CONSTRAINT team_join_request_team_id_fkey FOREIGN KEY (team_id)
    REFERENCES public.team (team_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.team_join_request
    ADD CONSTRAINT team_join_request_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

COMMIT;


--TESTING ITEMS:
SELECT * FROM team_join_request;
SELECT * FROM team_member;

DELETE FROM team_join_request WHERE request_id = 1;
DELETE FROM team_member WHERE team_id = 67 AND user_id = 45;

DELETE FROM team_join_request;
DELETE FROM team_member;
DELETE FROM team;

SELECT * FROM team;
SELECT * FROM users;

SELECT * FROM sport;

DELETE FROM team_join_request 
WHERE status = 'ACCEPTED' 
AND (team_id, user_id) NOT IN (
    SELECT team_id, user_id FROM team_member
);

ALTER TABLE team_join_request ADD COLUMN hidden BOOLEAN DEFAULT FALSE;

ALTER TABLE team_join_request ADD COLUMN hidden_sender BOOLEAN DEFAULT FALSE;
ALTER TABLE team_join_request ADD COLUMN hidden_receiver BOOLEAN DEFAULT FALSE;

ALTER TABLE team_join_request DROP COLUMN hidden;

CREATE TABLE IF NOT EXISTS public.match_challenge (
    challenge_id serial NOT NULL,
    challenger_team_id integer NOT NULL,
    challenged_team_id integer NOT NULL,
    status character varying(20) DEFAULT 'PENDING',
    challenge_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hidden_sender boolean DEFAULT FALSE,
    hidden_receiver boolean DEFAULT FALSE,
    CONSTRAINT match_challenge_pkey PRIMARY KEY (challenge_id),
    CONSTRAINT match_challenge_challenger_fkey FOREIGN KEY (challenger_team_id)
        REFERENCES public.team (team_id) ON DELETE CASCADE,
    CONSTRAINT match_challenge_challenged_fkey FOREIGN KEY (challenged_team_id)
        REFERENCES public.team (team_id) ON DELETE CASCADE
);

SELECT * FROM match_challenge;

SELECT team_id, team_name, user_id FROM team;
DELETE FROM match_challenge;


ALTER TABLE match_challenge ADD COLUMN location_name VARCHAR(100);
ALTER TABLE match_challenge ADD COLUMN location_address VARCHAR(200);
ALTER TABLE match_challenge ADD COLUMN match_time TIMESTAMP;

SELECT * FROM match_challenge WHERE challenge_id = 12;
SELECT challenge_id, location_name, location_address, match_time FROM match_challenge WHERE challenge_id = 12;

CREATE TABLE IF NOT EXISTS public.parks (
    park_id serial NOT NULL,
    park_name character varying(100) NOT NULL,
    address character varying(200) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(50) NOT NULL,
    CONSTRAINT parks_pkey PRIMARY KEY (park_id)
);

INSERT INTO parks (park_name, address, city, state) VALUES
('Goodale Park', '120 W Goodale St', 'Columbus', 'Ohio'),
('Schiller Park', '1069 Jaeger St', 'Columbus', 'Ohio'),
('Berliner Park', '1300 Duxberry Ave', 'Columbus', 'Ohio'),
('Antrim Park', '5800 Olentangy River Rd', 'Columbus', 'Ohio'),
('Whetstone Park', '3923 N High St', 'Columbus', 'Ohio'),
('Wolfe Park', '3480 E Broad St', 'Columbus', 'Ohio'),
('Blendon Woods Metro Park', '4265 E Dublin Granville Rd', 'Columbus', 'Ohio'),
('Hayden Falls Park', '4326 Hayden Falls Dr', 'Columbus', 'Ohio'),
('Scioto Audubon Metro Park', '400 W Whittier St', 'Columbus', 'Ohio'),
('Bicentennial Park', '233 Civic Center Dr', 'Columbus', 'Ohio'),
('Genoa Park', '303 W Broad St', 'Columbus', 'Ohio'),
('Indian Village Park', '3200 Indianola Ave', 'Columbus', 'Ohio'),
('Fancyburg Park', '1155 Oakland Park Ave', 'Columbus', 'Ohio'),
('Driving Park', '1100 Kelton Ave', 'Columbus', 'Ohio'),
('Tuttle Park', '1-99 W Lane Ave', 'Columbus', 'Ohio'),
('Griggs Reservoir Park', '2323 Hayden Rd', 'Columbus', 'Ohio'),
('Holton Beard Park', '905 E Livingston Ave', 'Columbus', 'Ohio'),
('Miller Kelce Park', '500 E 11th Ave', 'Columbus', 'Ohio');
