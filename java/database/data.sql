BEGIN TRANSACTION;

-- the password for both users is "password"
INSERT INTO users (username,password_hash,role) VALUES ('user','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('admin','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_ADMIN');

--Inserting into sports:
INSERT INTO sport (sport_name) VALUES ('Soccer') RETURNING sport_id;
INSERT INTO sport (sport_name) VALUES ('Baseball') RETURNING sport_id;
INSERT INTO sport (sport_name) VALUES ('PickleBall') RETURNING sport_id;
INSERT INTO sport (sport_name) VALUES ('Chess') RETURNING sport_id;
INSERT INTO sport (sport_name) VALUES ('Esport Mario Kart') RETURNING sport_id;
INSERT INTO sport (sport_name) VALUES ('Esport Pokemon Unite') RETURNING sport_id;

INSERT INTO users (username, password_hash, role, first_name, last_name, email)
VALUES
('Cain',   '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_ADMIN',   'Cain',   'Doe',   'cain@example.com'),
('Nahom',  '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_ADMIN',   'Nahom',  'Doe',   'nahom@example.com'),
('Thomas', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_CAPTAIN', 'Thomas', 'Smith', 'thomas@example.com'),
('Kamal',  '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER',  'Kamal',  'Smith', 'kamal@example.com'),
('Clara',  '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER',  'Clara',  'Doe',   'clara@example.com'),
('jdoe', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'John', 'Doe', 'jdoe@example.com'),
('asmith', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Alice', 'Smith', 'asmith@example.com'),
('bwayne', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Bruce', 'Wayne', 'bwayne@example.com'),
('ckent', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Clark', 'Kent', 'ckent@example.com'),
('dprince', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Diana', 'Prince', 'dprince@example.com'),
('pparker', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Peter', 'Parker', 'pparker@example.com'),
('tstark', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Tony', 'Stark', 'tstark@example.com'),
('srogers', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Steve', 'Rogers', 'srogers@example.com'),
('nromanoff', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Natasha', 'Romanoff', 'nromanoff@example.com'),
('bwilson', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Brian', 'Wilson', 'bwilson@example.com'),
('mjordan', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Michael', 'Jordan', 'mjordan@example.com'),
('lsimmons', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Laura', 'Simmons', 'lsimmons@example.com'),
('rwalker', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Ryan', 'Walker', 'rwalker@example.com'),
('knguyen', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Kim', 'Nguyen', 'knguyen@example.com'),
('dpatel', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Deepa', 'Patel', 'dpatel@example.com'),
('gmartinez', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Gabriel', 'Martinez', 'gmartinez@example.com'),
('hkim', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Hana', 'Kim', 'hkim@example.com'),
('ohernandez', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Oscar', 'Hernandez', 'ohernandez@example.com'),
('mali', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Mei', 'Li', 'mali@example.com'),
('tjackson', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', 'ROLE_PLAYER', 'Tyrone', 'Jackson', 'tjackson@example.com');


-- Inserting into the tournament table with Chicago-themed locations
INSERT INTO tournament (
    sport_id, name, season, start_date, end_date, number_of_rounds, entry_fee, prize_description, location, organizer_id
) VALUES (
    1, 'Spring Soccer Cup 2025', 'Spring 2025', '2025-04-01', '2025-05-15', 4, 50, 'Trophy + Medals', 'Grant Park Stadium', 1
);

INSERT INTO tournament (
    sport_id, name, season, start_date, end_date, number_of_rounds, entry_fee, prize_description, location, organizer_id
) VALUES (
    2, 'Summer Baseball Classic', 'Summer 2025', '2025-06-01', '2025-07-15', 5, 100, 'Gold Bat', 'Wrigley Field', 1
);

INSERT INTO tournament (
    sport_id, name, season, start_date, end_date, number_of_rounds, entry_fee, prize_description, location, organizer_id
) VALUES (
    3, 'Pickleball Showdown', 'Fall 2025', '2025-09-10', '2025-09-30', 3, 25, 'Custom Paddles', 'Lincoln Park Rec Center', 1
);

INSERT INTO tournament (
    sport_id, name, season, start_date, end_date, number_of_rounds, entry_fee, prize_description, location, organizer_id
) VALUES (
    4, 'Grandmaster Open', 'Fall 2025', '2025-10-01', '2025-10-20', 6, 75, 'Cash Prize $500', 'Chicago Public Library Hall', 1
);

INSERT INTO tournament (
    sport_id, name, season, start_date, end_date, number_of_rounds, entry_fee, prize_description, location, organizer_id
) VALUES (
    5, 'Mario Kart Mania', 'Winter 2025', '2025-12-01', '2025-12-15', 4, 10, 'Nintendo Gift Card', 'Navy Pier Esports Arena', 1
);



-- TEAMS (Chicago-themed, smaller set, using existing users only)
INSERT INTO team (sport_id, team_name, user_id, accepting_members, number_of_members)
VALUES
(1, 'Lincoln Park Strikers', 3, TRUE, 7),      -- Thomas as captain
(1, 'Hyde Park United', 4, FALSE, 20),         -- Kamal as captain
(1, 'River North Rovers', 5, TRUE, 8),         -- Clara as captain
(2, 'Wicker Park Sluggers', 3, TRUE, 4),       -- Thomas as captain
(2, 'South Loop Swingers', 4, TRUE, 5),        -- Kamal as captain
(3, 'Bucktown Pickle Pros', 5, TRUE, 6),       -- Clara as captain
(3, 'Logan Square Aces', 3, FALSE, 10),        -- Thomas as captain
(4, 'Gold Coast Chessmasters', 4, TRUE, 2),    -- Kamal as captain
(5, 'Lincoln Square Racers', 5, TRUE, 4);      -- Clara as captain

INSERT INTO team (sport_id, team_name, user_id, accepting_members, number_of_members)
VALUES
(2, 'Columbus Crew', 3, TRUE, 4),
(2, 'South Swingers', 4, TRUE, 5),
(2, 'Bucktown Pickle Pros', 5, TRUE, 6),
(2, 'Lincoln Park Lobbers', 6, FALSE, 8),
(2, 'West Town Whackers', 7, TRUE, 4),
(2, 'Logan Square Smashers', 8, TRUE, 7),
(2, 'Edgewater Aces', 9, FALSE, 6),
(2, 'Humboldt Hitters', 10, TRUE, 5),
(2, 'Roscoe Village Racqueteers', 11, TRUE, 4),
(2, 'Andersonville Dink Masters', 12, FALSE, 6);

INSERT INTO team (sport_id, team_name, user_id, accepting_members, number_of_members) VALUES
(3, 'Rainbow Road Racers', 3, TRUE, 5),
(3, 'Koopa Kart Crew', 4, FALSE, 6),
(3, 'Mushroom Cup Masters', 5, TRUE, 8),
(3, 'Banana Peel Bandits', 6, TRUE, 4),
(3, 'Bowser’s Battlers', 7, FALSE, 10),
(3, 'Luigi’s Lightning', 8, TRUE, 7),
(3, 'Yoshi Speedway Squad', 9, TRUE, 6),
(3, 'Donkey Drift Drivers', 10, FALSE, 9),
(3, 'Peach’s Power Racers', 11, TRUE, 5),
(3, 'Toad Turbo Team', 12, TRUE, 4);

INSERT INTO team (sport_id, team_name, user_id, accepting_members, number_of_members) VALUES
(4, 'Windy City Ballers', 3, TRUE, 12),
(4, 'Lakefront Legends', 4, FALSE, 15),
(4, 'Chi-Town Dunkers', 5, TRUE, 10),
(4, 'United Hoops', 6, TRUE, 14),
(4, 'Downtown Dribblers', 7, FALSE, 16),
(4, 'Northside Nets', 8, TRUE, 9),
(4, 'Southside Swishers', 9, TRUE, 13),
(4, 'West Loop Warriors', 10, FALSE, 11),
(4, 'Skyline Shooters', 11, TRUE, 8),
(4, 'Gold Coast Giants', 12, TRUE, 12);

INSERT INTO team (sport_id, team_name, user_id, accepting_members, number_of_members) VALUES
(5, 'Gold Coast Chessmasters', 4, TRUE, 2),
(5, 'Lincoln Park Knights', 5, FALSE, 4),
(5, 'Hyde Park Rooks', 6, TRUE, 3),
(5, 'River North Bishops', 7, TRUE, 2),
(5, 'West Town Pawns', 8, FALSE, 5),
(5, 'Lakeview Checkmates', 9, TRUE, 3),
(5, 'Bridgeport Strategists', 10, TRUE, 2),
(5, 'South Loop Grandmasters', 11, FALSE, 6),
(5, 'Andersonville Tacticians', 12, TRUE, 3),
(5, 'Logan Square Endgamers', 13, TRUE, 2);


INSERT INTO team (sport_id, team_name, user_id, accepting_members, number_of_members) VALUES
(6, 'North Beach Spikers', 3, TRUE, 8),
(6, 'Lincoln Park Blockers', 4, FALSE, 10),
(6, 'Lakeview Setters', 5, TRUE, 6),
(6, 'West Loop Aces', 6, TRUE, 9),
(6, 'Southside Servers', 7, FALSE, 12),
(6, 'Downtown Diggers', 8, TRUE, 7),
(6, 'Chicago Sand Smashers', 9, TRUE, 6),
(6, 'Andersonville Net Ninjas', 10, FALSE, 10),
(6, 'Bridgeport Bumpers', 11, TRUE, 8),
(6, 'Logan Square Lobbers', 12, TRUE, 9);

COMMIT TRANSACTION;
