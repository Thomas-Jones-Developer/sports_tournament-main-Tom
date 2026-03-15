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