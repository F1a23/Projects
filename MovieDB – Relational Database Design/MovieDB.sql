
-- ===========================================================
-- MovieDB - Complete SQL Script
-- Generated: 2025-11-13
-- Compatible with MySQL / MySQL Workbench
-- ===========================================================


DROP DATABASE IF EXISTS MovieDB1;
CREATE DATABASE MovieDB1;
USE MovieDB1;

-- ===========================================================
-- TABLE: ProductionCompany
-- Stores production companies that produce movies.
-- ===========================================================
CREATE TABLE IF NOT EXISTS ProductionCompany (
    CompanyID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255),
    Founded YEAR NULL,
    Country VARCHAR(100) DEFAULT 'Unknown'
) ;

-- ===========================================================
-- TABLE: Person
-- Stores people involved in movies: actors, directors, etc.
-- ===========================================================
CREATE TABLE IF NOT EXISTS Person (
    PersonID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    DateOfBirth DATE NULL,
    Country VARCHAR(100) DEFAULT 'Unknown'
);

-- ===========================================================
-- TABLE: Movie
-- Stores movies. CompanyID references ProductionCompany.CompanyID.
-- ===========================================================
CREATE TABLE IF NOT EXISTS Movie (
    MovieID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Year YEAR NOT NULL,
    Length INT, -- length in minutes
    PlotOutline TEXT,
    CompanyID INT NULL,
    Rating DECIMAL(3,1) NULL, -- e.g., 8.7
    Language VARCHAR(50) DEFAULT 'English',
    CONSTRAINT fk_movie_company
        FOREIGN KEY (CompanyID)
        REFERENCES ProductionCompany(CompanyID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ===========================================================
-- TABLE: Genre
-- Movie genres (unique names).
-- ===========================================================
CREATE TABLE IF NOT EXISTS Genre (
    GenreID INT AUTO_INCREMENT PRIMARY KEY,
    GenreName VARCHAR(50) NOT NULL UNIQUE
);

-- ===========================================================
-- TABLE: Movie_Genre
-- Many-to-many relationship between Movie and Genre.
-- ===========================================================
CREATE TABLE IF NOT EXISTS Movie_Genre (
    MovieID INT NOT NULL,
    GenreID INT NOT NULL,
    PRIMARY KEY (MovieID, GenreID),
    CONSTRAINT fk_moviegenre_movie
        FOREIGN KEY (MovieID)
        REFERENCES Movie(MovieID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_moviegenre_genre
        FOREIGN KEY (GenreID)
        REFERENCES Genre(GenreID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================================================
-- TABLE: Movie_Person
-- Unified relationship: stores which people worked on a movie and their role.
-- RoleType can be 'Actor', 'Director', or 'Both'.
-- CharacterName is used when RoleType includes Actor.
-- ===========================================================
CREATE TABLE IF NOT EXISTS Movie_Person (
    MovieID INT NOT NULL,
    PersonID INT NOT NULL,
    RoleType ENUM('Actor','Director','Both') NOT NULL,
    CharacterName VARCHAR(150) NULL,
    PRIMARY KEY (MovieID, PersonID, RoleType),
    CONSTRAINT fk_movieperson_movie
        FOREIGN KEY (MovieID)
        REFERENCES Movie(MovieID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_movieperson_person
        FOREIGN KEY (PersonID)
        REFERENCES Person(PersonID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================================================
-- TABLE: Quote
-- Quotes from movies, optionally attributed to a person.
-- PersonID is NULLABLE to allow anonymous quotes.
-- ===========================================================
CREATE TABLE IF NOT EXISTS Quote (
    QuoteID INT AUTO_INCREMENT PRIMARY KEY,
    QuoteText TEXT NOT NULL,
    MovieID INT NOT NULL,
    PersonID INT NULL,
    CONSTRAINT fk_quote_movie
        FOREIGN KEY (MovieID)
        REFERENCES Movie(MovieID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_quote_person
        FOREIGN KEY (PersonID)
        REFERENCES Person(PersonID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ===========================================================
-- SAMPLE DATA INSERTS
-- We'll insert multiple realistic records across tables.
-- ===========================================================

-- Production Companies (10)
INSERT INTO ProductionCompany (Name, Address, Founded, Country) VALUES
('Warner Bros.', 'Burbank, CA', 1923, 'USA'),
('Universal Pictures', 'Universal City, CA', 1912, 'USA'),
('Paramount Pictures', 'Hollywood, CA', 1912, 'USA'),
('20th Century Studios', 'Los Angeles, CA', 1935, 'USA'),
('Columbia Pictures', 'Culver City, CA', 1918, 'USA'),
('Marvel Studios', 'Burbank, CA', 1993, 'USA'),
('DreamWorks Pictures', 'Universal City, CA', 1994, 'USA'),
('A24', 'New York, NY', 2012, 'USA'),
('StudioCanal', 'Paris, France', 1988, 'France'),
('BBC Films', 'London, UK', 1990, 'UK');

-- People (actors, directors, etc.) — 25
INSERT INTO Person (Name, DateOfBirth, Country) VALUES
('Christopher Nolan', '1970-07-30', 'UK'),
('Quentin Tarantino', '1963-03-27', 'USA'),
('Steven Spielberg', '1946-12-18', 'USA'),
('Martin Scorsese', '1942-11-17', 'USA'),
('Greta Gerwig', '1983-08-04', 'USA'),
('Leonardo DiCaprio', '1974-11-11', 'USA'),
('Brad Pitt', '1963-12-18', 'USA'),
('Natalie Portman', '1981-06-09', 'Israel'),
('Tom Hanks', '1956-07-09', 'USA'),
('Emma Stone', '1988-11-06', 'USA'),
('Joseph Gordon-Levitt', '1981-02-17', 'USA'),
('Elliot Page', '1987-02-21', 'Canada'),
('Christian Bale', '1974-01-30', 'UK'),
('Michael Caine', '1933-03-14', 'UK'),
('Ridley Scott', '1937-11-30', 'UK'),
('Hans Zimmer', '1957-09-12', 'Germany'),
('Guy Ritchie', '1968-09-10', 'UK'),
('Saoirse Ronan', '1994-04-12', 'Ireland'),
('Tom Hardy', '1977-09-15', 'UK'),
('Sharon Stone', '1958-03-10', 'USA'),
('Samuel L. Jackson', '1948-12-21', 'USA'),
('Uma Thurman', '1970-04-29', 'USA'),
('Anthony Hopkins', '1937-12-31', 'UK'),
('Daniel Day-Lewis', '1957-04-29', 'UK'),
('Cate Blanchett', '1969-05-14', 'Australia');

-- Genres (8)
INSERT INTO Genre (GenreName) VALUES
('Science Fiction'),
('Drama'),
('Action'),
('Crime'),
('Thriller'),
('Comedy'),
('Fantasy'),
('Romance');

-- Movies (15-20)
INSERT INTO Movie (Title, Year, Length, PlotOutline, CompanyID, Rating, Language) VALUES
('Inception', 2010, 148, 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.', 1, 8.8, 'English'),
('The Dark Knight', 2008, 152, 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.', 1, 9.0, 'English'),
('Pulp Fiction', 1994, 154, 'Interconnected stories of crime and redemption in Los Angeles.', 3, 8.9, 'English'),
('The Shawshank Redemption', 1994, 142, 'Two imprisoned men bond over years, finding solace and eventual redemption.', 2, 9.3, 'English'),
('Fight Club', 1999, 139, 'An insomniac office worker and a soapmaker form an underground fight club.', 2, 8.8, 'English'),
('The Grand Budapest Hotel', 2014, 99, 'Adventures of a legendary concierge and his lobby boy at a famous European hotel between the wars.', 8, 8.1, 'English'),
('Gladiator', 2000, 155, 'A former Roman General sets out to exact vengeance against the corrupt emperor.', 3, 8.5, 'English'),
('Alien', 1979, 117, 'The crew of a commercial spacecraft encounter a deadly lifeform.', 9, 8.4, 'English'),
('La La Land', 2016, 128, 'A musician and an aspiring actress fall in love while pursuing their dreams in Los Angeles.', 8, 8.0, 'English'),
('Interstellar', 2014, 169, 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 1, 8.6, 'English'),
('The Martian', 2015, 144, 'An astronaut becomes stranded on Mars and uses his ingenuity to survive.', 2, 8.0, 'English'),
('The Prestige', 2006, 130, 'Two magicians engage in a rivalry to create the ultimate stage illusion.', 1, 7.5, 'English'),
('Django Unchained', 2012, 165, 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal plantation owner.', 3, 8.4, 'English'),
('The King''s Speech', 2010, 118, 'The story of King George VI and his speech therapist.', 10, 8.0, 'English'),
('Blade Runner', 1982, 117, 'A blade runner must pursue and terminate four replicants who stole a ship in space, and returned to Earth to find their creator.', 9, 8.1, 'English'),
('The Social Network', 2010, 120, 'The founding of Facebook and the resulting lawsuits.', 5, 7.7, 'English'),
('Mad Max: Fury Road', 2015, 120, 'In a post-apocalyptic wasteland, Max helps a woman rebel against a tyrant.', 4, 8.1, 'English'),
('Goodfellas', 1990, 146, 'The rise and fall of mob associate Henry Hill.', 3, 8.7, 'English'),
('The Revenant', 2015, 156, 'A frontiersman fights for survival and revenge after being mauled by a bear.', 2, 8.0, 'English'),
('The Hobbit: An Unexpected Journey', 2012, 169, 'A reluctant Hobbit sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home.', 7, 7.8, 'English');

-- Movie <-> Genre links
INSERT INTO Movie_Genre (MovieID, GenreID) VALUES
(1,1),(1,5),       -- Inception: Sci-Fi, Thriller
(2,3),(2,5),       -- Dark Knight: Action, Thriller
(3,4),(3,2),       -- Pulp Fiction: Crime, Drama
(4,2),             -- Shawshank: Drama
(5,5),(5,2),       -- Fight Club: Thriller, Drama
(6,6),(6,2),       -- Grand Budapest: Comedy, Drama
(7,3),(7,2),       -- Gladiator: Action, Drama
(8,1),(8,5),       -- Alien: Sci-Fi, Thriller
(9,8),(9,6),       -- La La Land: Romance, Comedy
(10,1),(10,2),     -- Interstellar: Sci-Fi, Drama
(11,1),(11,2),     -- The Martian: Sci-Fi, Drama
(12,5),(12,2),     -- The Prestige: Thriller, Drama
(13,4),(13,2),     -- Django Unchained: Crime, Drama
(14,2),            -- The King's Speech: Drama
(15,1),(15,5),     -- Blade Runner: Sci-Fi, Thriller
(16,2),(16,6),     -- The Social Network: Drama, Comedy
(17,3),(17,1),     -- Mad Max: Action, Sci-Fi
(18,4),(18,2),     -- Goodfellas: Crime, Drama
(19,2),(19,5),     -- The Revenant: Drama, Thriller
(20,7),(20,6);     -- The Hobbit: Fantasy, Comedy

-- Movie_Person relations (who acted or directed)
-- Note: PersonIDs correspond to insertion order above.
-- Christopher Nolan (1) directed Inception, The Dark Knight, Interstellar, The Prestige
INSERT INTO Movie_Person (MovieID, PersonID, RoleType, CharacterName) VALUES
(1,1,'Director',NULL),
(2,1,'Director',NULL),
(10,1,'Director',NULL),
(12,1,'Director',NULL),

-- Quentin Tarantino (2) directed Django Unchained and acted in Pulp Fiction (role Jimmie Dimmick)
(13,2,'Director',NULL),
(3,2,'Actor','Jimmie Dimmick'),

-- Steven Spielberg (3) directed The Martian? (No) - we'll add him as director for 'E.T.' if present; here he is left as sample.
(3,3,'Actor',NULL),

-- Martin Scorsese (4) directed Goodfellas
(18,4,'Director',NULL),

-- Greta Gerwig (5) director example
(6,5,'Director',NULL),

-- Leonardo DiCaprio (6) acted in Inception? (played Cobb) and The Revenant, The Wolf of Wall Street not in list
(1,6,'Actor','Dom Cobb'),
(19,6,'Actor','Hugh Glass'),

-- Brad Pitt (7) acted in Fight Club (played Tyler Durden)
(5,7,'Actor','Tyler Durden'),

-- Natalie Portman (8) not in inserted movies above; included for extensibility
(9,8,'Actor','Mia Dolan'),

-- Tom Hanks (9)
(4,9,'Actor','Andy Dufresne'),

-- Emma Stone (10)
(9,10,'Actor','Mia Dolan'),

-- Joseph Gordon-Levitt (11)
(1,11,'Actor','Arthur'),

-- Elliot Page (12)
(1,12,'Actor','Ariadne'),

-- Christian Bale (13) acted in The Dark Knight (Bruce Wayne)
(2,13,'Actor','Bruce Wayne'),

-- Michael Caine (14)
(2,14,'Actor','Alfred'),

-- Ridley Scott (15) directed Blade Runner and Gladiator
(7,15,'Director',NULL),
(15,15,'Director',NULL),

-- Hans Zimmer (16) is a composer (we'll add as Person with role Director as sample)
(1,16,'Both',NULL),

-- Guy Ritchie (17)
(17,17,'Director',NULL),

-- Saoirse Ronan (18)
(20,18,'Actor','Young Hobbit (sample)'),

-- Tom Hardy (19)
(2,19,'Actor','Bane'),

-- Samuel L. Jackson (21)
(3,21,'Actor','Jules Winnfield'),

-- Uma Thurman (22)
(3,22,'Actor','Mia Wallace'),

-- Anthony Hopkins (23)
(14,23,'Actor','Lionel Logue'),

-- Daniel Day-Lewis (24)
(19,24,'Actor','Frontiersman (sample)'),

-- Cate Blanchett (25)
(20,25,'Actor','Galadriel');

-- Quotes (sample)
INSERT INTO Quote (QuoteText, MovieID, PersonID) VALUES
('You mustn''t be afraid to dream a little bigger, darling.', 1, 6),
('Why so serious?', 2, NULL),
('Say ''what'' again. I dare you. I double dare you, motherf****r!', 3, 21),
('Hope is a good thing, maybe the best of things, and no good thing ever dies.', 4, NULL),
('The first rule of Fight Club is: you do not talk about Fight Club.', 5, NULL),
('There''s a concept called love? - No, there''s.', 9, 10),
('I''m going to make him an offer he can''t refuse.', 7, NULL),
('Get busy living, or get busy dying.', 4, NULL);

-- ===========================================================
-- EXTRA SAMPLE INSERTS (to increase dataset size)
-- We'll add a handful more people and movies to make the dataset richer.
-- ===========================================================
INSERT INTO Person (Name, DateOfBirth, Country) VALUES
('Adam Driver', '1983-11-19', 'USA'),
('Zoe Saldana', '1978-06-19', 'USA'),
('Chris Pratt', '1979-06-21', 'USA'),
('Emily Blunt', '1983-02-23', 'UK');

INSERT INTO Movie (Title, Year, Length, PlotOutline, CompanyID, Rating, Language) VALUES
('Edge of Tomorrow', 2014, 113, 'A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies.', 2, 7.9, 'English'),
('A Quiet Place', 2018, 90, 'In a post-apocalyptic world, a family must live in silence to hide from creatures that hunt by sound.', 2, 7.5, 'English'),
('Guardians of the Galaxy', 2014, 121, 'A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.', 6, 8.0, 'English');

-- Link these new movies with genres
INSERT INTO Movie_Genre (MovieID, GenreID) VALUES
(21,1),(21,3), -- Edge of Tomorrow: Sci-Fi, Action
(22,5),(22,1), -- A Quiet Place: Thriller, Sci-Fi
(23,1),(23,6); -- Guardians: Sci-Fi, Comedy

-- Link people to these movies
-- Adam Driver -> A Quiet Place (sample role)
INSERT INTO Movie_Person (MovieID, PersonID, RoleType, CharacterName) VALUES
(22,26,'Actor','Man in Field'),
(21,26,'Actor','Specialist (sample)'),
(23,27,'Actor','Gamora'),
(23,28,'Actor','Star-Lord'),
(21,29,'Director',NULL);

-- ===========================================================
-- INDEXES and FINAL NOTES
-- Adding a few helpful indexes for faster lookups.
-- ===========================================================
-- CREATE INDEX idx_movie_title ON Movie(Title);
-- CREATE INDEX idx_person_name ON Person(Name);
-- CREATE INDEX idx_genre_name ON Genre(GenreName);

-- ===========================================================
-- TEST / DEMO QUERIES
-- Basic SELECTs, JOINs, Aggregations, Subqueries and more.
-- ===========================================================

-- 1) Simple SELECT: show a few movies
SELECT MovieID, Title, Year, Length, Rating FROM Movie ORDER BY Year DESC LIMIT 10;

-- 2) Join: movie titles with production company
SELECT m.Title AS MovieTitle, pc.Name AS CompanyName
FROM Movie m
LEFT JOIN ProductionCompany pc ON m.CompanyID = pc.CompanyID
ORDER BY pc.Name, m.Title;

-- 3) Many-to-many join: movies and their genres
SELECT m.Title, GROUP_CONCAT(g.GenreName SEPARATOR ', ') AS Genres
FROM Movie m
JOIN Movie_Genre mg ON m.MovieID = mg.MovieID
JOIN Genre g ON mg.GenreID = g.GenreID
GROUP BY m.MovieID, m.Title
ORDER BY m.Title;

-- 4) People involved in a movie
SELECT m.Title, p.Name, mp.RoleType, mp.CharacterName
FROM Movie m
JOIN Movie_Person mp ON m.MovieID = mp.MovieID
JOIN Person p ON mp.PersonID = p.PersonID
WHERE m.Title = 'Inception';

-- 5) Aggregation: number of movies per company
SELECT pc.Name AS Company, COUNT(m.MovieID) AS MovieCount
FROM ProductionCompany pc
LEFT JOIN Movie m ON m.CompanyID = pc.CompanyID
GROUP BY pc.CompanyID
HAVING MovieCount > 0
ORDER BY MovieCount DESC;

-- 6) Aggregation: average rating per genre (uses subquery)
SELECT g.GenreName,
       ROUND(AVG(m.Rating),2) AS AvgRating
FROM Genre g
JOIN Movie_Genre mg ON g.GenreID = mg.GenreID
JOIN Movie m ON mg.MovieID = m.MovieID
GROUP BY g.GenreID, g.GenreName
ORDER BY AvgRating DESC;

-- 7) Subquery: movies where average actor birth year (approx) is before 1970
SELECT m.Title, m.Year
FROM Movie m
WHERE m.MovieID IN (
    SELECT DISTINCT mp.MovieID
    FROM Movie_Person mp
    JOIN Person p2 ON mp.PersonID = p2.PersonID
    WHERE YEAR(p2.DateOfBirth) < 1970
)
ORDER BY m.Year DESC;

-- 8) Window function example (MySQL 8+): rank movies by rating
SELECT MovieID, Title, Rating,
       RANK() OVER (ORDER BY Rating DESC) AS RatingRank
FROM Movie
ORDER BY Rating DESC
LIMIT 20;

-- 9) Full text-like search (simple LIKE): find movies with 'dark' or 'darkness' in title
SELECT Title, Year FROM Movie WHERE Title LIKE '%Dark%';

-- 10) Create a view for movie basic info
DROP VIEW IF EXISTS vw_MovieBasic;
CREATE VIEW vw_MovieBasic AS
SELECT m.MovieID, m.Title, m.Year, pc.Name AS ProductionCompany, m.Rating
FROM Movie m
LEFT JOIN ProductionCompany pc ON m.CompanyID = pc.CompanyID;

-- 11) Example of updating a record
-- UPDATE Movie SET Rating = 9.1 WHERE Title = 'Inception';

-- 12) Delete example (careful: cascades will remove related rows)
-- DELETE FROM Movie WHERE Title = 'kk';

-- 13) Create a materialized-like table (snapshot)
DROP TABLE IF EXISTS MovieSnapshot;
CREATE TABLE MovieSnapshot AS
SELECT MovieID, Title, Year, Length, Rating FROM Movie;

-- 14) Count movies per genre (show top genres)
SELECT g.GenreName, COUNT(*) AS MovieCount
FROM Genre g
JOIN Movie_Genre mg ON g.GenreID = mg.GenreID
GROUP BY g.GenreID, g.GenreName
ORDER BY MovieCount DESC;

-- 15) Example of a complex join: get quotes with movie and speaker if available
SELECT q.QuoteText, m.Title AS MovieTitle, p.Name AS Speaker
FROM Quote q
JOIN Movie m ON q.MovieID = m.MovieID
LEFT JOIN Person p ON q.PersonID = p.PersonID
ORDER BY m.Title;

-- ===========================================================
-- End of script. Enjoy exploring MovieDB!
-- Save this file as MovieDB.sql and run in MySQL Workbench.
-- ===========================================================

