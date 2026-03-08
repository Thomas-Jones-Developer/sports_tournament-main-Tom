BEGIN;
-- Drop in dependency order to avoid FK errors
DROP TABLE IF EXISTS match_games;
DROP TABLE IF EXISTS team_member;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS tournament;
DROP TABLE IF EXISTS sport;
DROP TABLE IF EXISTS users;
-- USERS
CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    role          VARCHAR(50)  NOT NULL,
    first_name    VARCHAR(50),
    last_name     VARCHAR(50),
    email         VARCHAR(100) UNIQUE
    -- ,registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- SPORTS
CREATE TABLE sport (
    sport_id   SERIAL PRIMARY KEY,
    sport_name VARCHAR(50) NOT NULL UNIQUE
);
-- TOURNAMENTS
CREATE TABLE tournament (
    tournament_id     SERIAL PRIMARY KEY,
    sport_id          INT REFERENCES sport(sport_id) ON DELETE SET NULL,
    name              VARCHAR(100) NOT NULL,
    season            VARCHAR(50),
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    number_of_rounds  INT,
    organizer_id      INT REFERENCES users(user_id) ON DELETE SET NULL,
    entry_fee         INT,
    prize_description VARCHAR(100) NOT NULL,
    location          VARCHAR(100) NOT NULL,
    tournament_state VARCHAR(100),
    CONSTRAINT chk_dates CHECK (start_date <= end_date)
);
-- TEAMS
CREATE TABLE team (
    team_id           SERIAL PRIMARY KEY,
    sport_id          INT REFERENCES sport(sport_id) ON DELETE SET NULL,
    team_name         VARCHAR(100) NOT NULL,
    user_id   INT REFERENCES users(user_id) ON DELETE SET NULL,
    accepting_members BOOLEAN DEFAULT TRUE,
    number_of_members INT DEFAULT 0,
    CONSTRAINT unique_team_name_per_sport UNIQUE (sport_id, team_name)
);
-- TEAM MEMBERSHIP (many-to-many users<->teams)
CREATE TABLE team_member (
    team_id INT REFERENCES team(team_id)   ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id)  ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);
-- MATCHES (avoid keyword "match"; use match_games)
CREATE TABLE match_games (
    match_id        SERIAL PRIMARY KEY,
    tournament_id   INT REFERENCES tournament(tournament_id) ON DELETE CASCADE,
    match_name      VARCHAR(100) NOT NULL,
    match_date      DATE,
    match_time      TIME,
    location        VARCHAR(100),
    team_1_id       INT REFERENCES team(team_id) ON DELETE SET NULL,
    team_2_id       INT REFERENCES team(team_id) ON DELETE SET NULL,
    team_1_score    INT,
    team_2_score    INT,
    winning_team_id INT REFERENCES team(team_id) ON DELETE SET NULL,
    round_number INT NOT NULL DEFAULT 1,  -- Track which round this match belongs to
    CONSTRAINT chk_teams_distinct CHECK (team_1_id IS NULL OR team_2_id IS NULL OR team_1_id <> team_2_id)
);


CREATE TABLE team_join_request (
    request_id   SERIAL PRIMARY KEY,
    team_id      INT REFERENCES team(team_id) ON DELETE CASCADE,
    user_id      INT REFERENCES users(user_id) ON DELETE CASCADE,
    status       VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (team_id, user_id) -- prevents duplicate requests
);


COMMIT;
