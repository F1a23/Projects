-- MOVIE DATABASE SCHEMA --
CREATE DATABASE MovieDB1;
USE MovieDB1;

-- 1. PRODUCTION_COMPANY --
CREATE TABLE ProductionCompany (
    CompanyID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255)
);

-- 2. PERSON (includes both actors and directors)--
CREATE TABLE Person (
    PersonID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DateOfBirth DATE
);

-- 3. MOVIE --
CREATE TABLE MOVIE (
MOVIE_ID INT AUTO_INCREMENT PRIMARY KEY,
MOVIE_NAME VARCHAR(25) NOT NULL,
YEAR_D YEAR NOT NULL,
LENGTH INT,
PLOTOUTLINE TEXT,
CompanyID INT,
CONSTRAINT FK_MOVIE_COMPANY
	FOREIGN KEY (CompanyID)
    REFERENCES ProductionCompany(CompanyID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 4. GENER --
CREATE TABLE GENER (
GENER_ID INT AUTO_INCREMENT PRIMARY KEY,
GENER_NAME VARCHAR(25) UNIQUE
);

-- 5. MOVEI GENER --
CREATE TABLE MOVIE_GENER (
MOVIE_ID INT,
CONSTRAINT FK_MOVIE_GENER
	FOREIGN KEY (MOVIE_ID)
    REFERENCES MOVIE(MOVIE_ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
GENER_ID INT,
CONSTRAINT FK_GENER_ID
	FOREIGN KEY (GENER_ID)
    REFERENCES GENER(GENER_ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
-- 6. MOVEI PERSON --
CREATE TABLE MOVIE_PERSON (
MOVIE_ID INT,
CONSTRAINT FK_MOVIE_ID
	FOREIGN KEY (MOVIE_ID)
    REFERENCES MOVIE(MOVIE_ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
PERSON_ID INT,
CONSTRAINT FK_PERSON_ID
	FOREIGN KEY (PERSON_ID)
    REFERENCES person(PersonID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
ROLE_TYPE VARCHAR(25),
CHARA_NAME VARCHAR(25)
);

-- 7. QUATE --
CREATE TABLE QUOTE (
QUOTE_ID INT AUTO_INCREMENT PRIMARY KEY,
QUOTE_TEXT TEXT,
MOVIE_ID INT,
CONSTRAINT FK_QUOTE_MOVIE
	FOREIGN KEY (MOVIE_ID)
    REFERENCES MOVIE(MOVIE_ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
PERSON_ID INT,
CONSTRAINT FK_QUOTE_PERSON
	FOREIGN KEY (PERSON_ID)
    REFERENCES person(PersonID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- PRODUCTIONCOMPANY
INSERT INTO PRODUCTIONCOMPANY(NAME,ADDRESS)
VALUES("DREAM WORK","USA"),
("WANER BROS","CALIFORNIA"),
("BROS","Oman");

-- PERSON
INSERT INTO PERSON (NAME,DATEOFBIRTH)
VALUES('Christopher Nolan', '1970-07-30'),
       ('Leonardo DiCaprio', '1974-11-11'),
       ('Joseph Gordon-Levitt', '1981-02-17'),
       ('Elliot Page', '1987-02-21'),
       ('Quentin Tarantino', '1963-03-27');
       
-- MOVIE
INSERT INTO MOVIE (MOVIE_NAME,YEAR_D,LENGTH,PLOTOUTLINE,CompanyID)
VALUES('Inception', 2010, 148,'A thief enters dreams to steal secrets.',1),
       ('Pulp Fiction', 1994, 154,'The lives of criminals intertwine in Los Angeles.',2),
		('Inception', 2025, 120, NULL, NULL);
       
-- Genres
INSERT INTO GENER (Gener_Name)
VALUES ('Science Fiction'),
('Crime'),
(NULL);

-- Link Movies with Genres
INSERT INTO Movie_Gener (Movie_ID, Gener_ID)
VALUES (1, 1), -- Inception -> Science Fiction
       (2, 2); -- Pulp Fiction -> Crime
       
-- Movie_Person (Roles)
-- Inception: Nolan (Director), Leonardo, Joseph, Elliot (Actors)
INSERT INTO Movie_Person (Movie_ID, Person_ID, Role_Type, Chara_Name)
VALUES (1, 1, 'Director', NULL),
       (1, 2, 'Actor', 'Cobb'),
       (1, 3, 'Actor', 'Arthur'),
       (1, 4, 'Actor', 'Ariadne');

-- Pulp Fiction: Tarantino (Director + Actor)
INSERT INTO Movie_Person (Movie_ID, Person_ID, Role_Type, Chara_Name)
VALUES (2, 5, 'Director', NULL),
       (2, 5, 'Actor', 'Jimmie Dimmick');

-- Quotes
INSERT INTO Quote (Quote_Text, Movie_ID, Person_ID)
VALUES ('You mustn’t be afraid to dream a little bigger, darling.', 1, 2),
       ('Just because you are a character doesn’t mean you have character.', 2, 5);
    
-- INNER JOIN : only they have order --

SELECT ProductionCompany.CompanyID, ProductionCompany.Name, MOVIE.MOVIE_NAME
FROM ProductionCompany
INNER JOIN MOVIE  ON MOVIE.CompanyID = ProductionCompany.CompanyID;

-- Left JOIN :  

SELECT ProductionCompany.CompanyID, ProductionCompany.Name, MOVIE.MOVIE_NAME
FROM ProductionCompany
left JOIN MOVIE  ON MOVIE.CompanyID = ProductionCompany.CompanyID;


-- right JOIN : 

SELECT ProductionCompany.CompanyID, ProductionCompany.Name, MOVIE.MOVIE_NAME
FROM ProductionCompany
right JOIN MOVIE  ON MOVIE.CompanyID = ProductionCompany.CompanyID;


--  FULL JOIN (FULL OUTER JOIN) --
SELECT ProductionCompany.CompanyID, ProductionCompany.Name, MOVIE.MOVIE_NAME
FROM ProductionCompany
left JOIN MOVIE  ON MOVIE.CompanyID = ProductionCompany.CompanyID
union
SELECT ProductionCompany.CompanyID, ProductionCompany.Name, MOVIE.MOVIE_NAME
FROM ProductionCompany
right JOIN MOVIE  ON MOVIE.CompanyID = ProductionCompany.CompanyID;


-- CROSS JOIN --
SELECT ProductionCompany.CompanyID, ProductionCompany.Name, MOVIE.MOVIE_NAME
FROM ProductionCompany
CROSS JOIN MOVIE ;


-- INNER JOIN with 3 Tables --
SELECT 
MG.GENER_ID,MOVIE_NAME,GENER_NAME
FROM MOVIE_GENER MG

INNER JOIN MOVIE M   ON M.Movie_ID = MG.Movie_ID
INNER JOIN GENER G ON G.GENER_ID = MG.GENER_ID;


-- LEFT JOIN (Show all movies, even if no people assigned yet) --
SELECT 
MG.GENER_ID,MOVIE_NAME,GENER_NAME
FROM MOVIE_GENER MG

LEFT JOIN MOVIE M   ON M.Movie_ID = MG.Movie_ID
LEFT JOIN GENER G ON G.GENER_ID = MG.GENER_ID;

-- RIGHT JOIN
SELECT 
MG.GENER_ID,MOVIE_NAME,GENER_NAME
FROM MOVIE_GENER MG

right JOIN MOVIE M   ON M.Movie_ID = MG.Movie_ID
right JOIN GENER G ON G.GENER_ID = MG.GENER_ID;

--
SELECT 
    m.MOVIE_NAME AS MovieTitle,
    p.Name AS personName,
    mp.Role_type,
    mp.Chara_name

FROM Movie m
INNER JOIN Movie_person mp ON m.Movie_ID = mp.Movie_ID
INNER JOIN Person p ON mp.Person_ID=p.PersonID;

-- create new table from select
CREATE TABLE new_table AS
 SELECT 
    m.MOVIE_NAME AS MovieTitle,
    p.Name AS personName,
    mp.Role_type,
    mp.Chara_name

FROM Movie m
INNER JOIN Movie_person mp ON m.Movie_ID = mp.Movie_ID
INNER JOIN Person p ON mp.Person_ID=p.PersonID;

--  Get Movie Quotes with Actor Names:
SELECT 
    m.MOVIE_NAME AS MovieTitle,
    p.Name AS personName,
    q.QUOTE_TEXT
FROM Quote q
INNER JOIN Movie m ON q.Movie_ID = m.Movie_ID
INNER JOIN Person p ON q.Person_ID = p.PersonID;


-- show all columns
select * from Movie; -- if you are already in the database
select * from moviedb1.Movie; -- using database

-- select specific columns:
select MOVIE_NAME,YEAR_D,LENGTH from Movie;

-- select with a WHERE condition:
select * from Person where Name='Christopher Nolan'; 

-- select with multiple condition:
select * from Movie where YEAR_D>2000 AND LENGTH>140; 

-- using OR
select * from GENER where GENER_NAME='Science Fiction' OR GENER_NAME='Comedy';

-- using LIKE (pattern matching):
select * from Movie where MOVIE_NAME LIKE 'I%'; -- will search from movie name start with I

-- using between:
select * from Movie where YEAR_D BETWEEN 1990 AND 2015;

-- using IN:
select * from Person where Name IN ('Christopher Nolan','Elliot Page','Quentin Tarantino');

-- update:
update movie SET LENGTH=150, PLOTOUTLINE='Updated description for training purpose.'
where MOVIE_NAME='Inception';

-- Delete using condition:
delete from GENER where GENER_NAME='Comedy';

-- delete using condition:
Delete from Person WHERE Name='Matt Damon';

-- delete all rows from a table:
delete from Quote;


-- AGGREGATE function:

SELECT COUNT(*) as TotalMovies FROM Movie;

-- SELECT AVE(LENGTH) as AVgMovies FROM Movie;


-- --- ------------------------------------------

ALTER TABLE Person
DROP COLUMN AGE1;


-- --- ------------------------------------------

ALter table Person ADD AGE1 INT;

SELECT 
    Name,
    DateOfBirth,
    TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) AS Age
FROM Person;

-- --------------------
Update Person SET Age=YEAR(CURDATE())- YEAR(DateOfBirth);  -- second solution to update age

-- GROUP BY:

SELECT CompanyID, COUNT(Movie_ID) AS TotalMovies 
FROM Movie 
GROUP BY CompanyID; 

-- ---------------------------------------------------------------
SELECT CompanyID, COUNT(Movie_ID) AS TotalMovies 
FROM Movie 
GROUP BY Movie_ID; -- after group by to use uniqe id the output all is 1

-- ---------------------------------------------------------------
-- HAVING it used with GROUP BY
SELECT CompanyID, COUNT(Movie_ID) AS TotalMovies 
FROM Movie 
GROUP BY CompanyID
HAVING COUNT(Movie_ID) >1;

-- ---------------------------------------------------------------
-- ORDER BY:
-- ASC (Ascending Order):
	-- Default sorting order if not specified.
    -- Sorts from smallest to largest for numbers, or A → Z for text.
    
-- DESC (Descending Order)
	-- Sorts from largest to smallest for numbers, or Z → A for text.
 
SELECT MOVIE_ID,MOVIE_NAME FROM MOVIE ORDER BY MOVIE_NAME DESC;
-- ----

  SELECT CompanyID, COUNT(Movie_ID) AS TotalMovies 
FROM Movie 
GROUP BY CompanyID
order by  CompanyID DESC;

-- Combining GROUP BY, HAVING, and ORDER BY:

 SELECT CompanyID, COUNT(Movie_ID) AS TotalMovies 
FROM Movie 
GROUP BY CompanyID 
HAVING COUNT(Movie_ID) > 1 
ORDER BY TotalMovies DESC;

-- Count movies by year
SELECT YEAR_D,COUNT(Movie_ID) AS TotalMovies FROM MOVIE GROUP BY YEAR_D;
-- 
SELECT Movie_ID,COUNT(GENER_ID) AS TotalGENER FROM MOVIE_GENER GROUP BY Movie_ID; 

-- count movies per production company , sorted by total movies
SELECT 
	pc.Name AS ProductionCompany,
	COUNT(m.Movie_ID) AS TotalMovies
from productioncompany pc
LEFT JOIN Movie m on pc.CompanyID =m.CompanyID
GROUP BY pc.Name
ORDER BY TotalMovies DESC;


-- show average movie lenght by year , longes first:longes first-->DESC
select YEAR_D,avg(LENGTH) AS AVERGELENGTH from MOVIE group by YEAR_D ORDER BY AVERGELENGTH DESC; -- SOLUTION 1

select YEAR_D,ROUND(avg(LENGTH),2) AS AVERGELENGTH from MOVIE group by YEAR_D ORDER BY AVERGELENGTH DESC;  --  SOLUTION 2 

-- --------------------------------------------------------------

-- SHOW MOVIES THAT BELONG TO 0 OR MORE GENER

SELECT
m.MOVIE_NAME AS MovieTitle,
COUNT(g.GENER_ID) AS NumberOfGener
FROM Movie m
INNER JOIN MOVIE_GENER mg ON m.MOVIE_ID=mg.MOVIE_ID
INNER JOIN GENER g ON mg.GENER_ID=g.GENER_ID
GROUP BY m.MOVIE_NAME
HAVING COUNT(g.GENER_ID)>=0
ORDER BY NumberOfGener DESC;

-- count how many actors per movie
SELECT 
    m.Movie_Name,
    COUNT(mp.Person_ID) AS NumberOfActors
FROM movie m
INNER JOIN movie_person mp ON m.Movie_ID = mp.Movie_ID
where mp.ROLE_TYPE='Actor'
GROUP BY m.Movie_Name
ORDER BY NumberOfActors ASC;

-- count how many movies each director has directed
SELECT
    p.Name AS DirectorName,
    COUNT(m.Movie_ID) AS NumberOfMovies
FROM Person p
INNER JOIN Movie_Person mp ON p.PersonID = mp.Person_ID
INNER JOIN Movie m ON mp.Movie_ID = m.Movie_ID
WHERE mp.Role_Type = 'Director'
GROUP BY p.Name
ORDER BY NumberOfMovies DESC;

-- ------------------------------

SELECT 
    p.Name AS Director,
    COUNT(mp.Movie_ID) AS MoviesDirected
FROM Person p
INNER JOIN movie_person mp ON p.PersonID = mp.Person_ID
WHERE mp.Role_Type IN ('Director', 'Both')
GROUP BY p.Name
HAVING COUNT(mp.Movie_ID) >= 1
ORDER BY MoviesDirected DESC;


-- -------------
-- Average movie length per production company
select CompanyID,avg(LENGTH) AS AVERGELENGTH from MOVIE group by CompanyID ORDER BY AVERGELENGTH DESC; -- SOLUTION 1
--
SELECT 
pc.Name AS ProductionCompany,
AVG(m.LENGTH) AS AverageMovieLength
FROM productioncompany pc
INNER JOIN
Movie m ON pc.CompanyID=m.CompanyID
group by pc.Name,pc.CompanyID 
ORDER BY AverageMovieLength DESC;
-- -----------------------------------
-- COUNT HOW MANY QUOTES EACH PERSON HAS
-- solution 1:
SELECT 
    p.Name AS PersonName,
    COUNT(q.Quote_ID) AS TotalOfQuotes
FROM Person p
LEFT JOIN Quote q ON p.PersonID = q.Person_ID
GROUP BY p.PersonID, p.Name
ORDER BY TotalOfQuotes;

-- solution 2:
SELECT 
    p.Name AS PersonName,
    COUNT(q.Quote_ID) AS TotalOfQuotes
FROM Person p
LEFT JOIN Quote q ON p.PersonID = q.Person_ID
GROUP BY p.Name
HAVING COUNT(q.Quote_ID)>0
ORDER BY TotalOfQuotes DESC;

-- count the total number of roles each person played

-- SOLUTION 1 :
SELECT 
    p.Name AS PersonName,
    COUNT(mp.Role_Type) AS TotalRoles
FROM Person p
LEFT JOIN movie_person mp ON p.PersonID = mp.Person_ID
GROUP BY p.Name
ORDER BY TotalRoles DESC;

-- SOLUTION 2:
SELECT 
    p.Name AS PersonName,
    COUNT(mp.Movie_ID) AS TotalRoles
FROM Person p
LEFT JOIN movie_person mp ON p.PersonID = mp.Person_ID
GROUP BY p.Name
ORDER BY TotalRoles DESC;
