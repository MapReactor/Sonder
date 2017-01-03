-- THIS FILE JUST SERVES AS A REFERENCE.  ALL SCHEMA IS INCLUDED IN index.js
-- Run this command to load schema into DB
-- mysql -u root < schema.sql
drop DATABASE if exists sonder;
CREATE DATABASE sonder;

USE sonder;

drop table if exists users;
drop table if exists friendlist;
drop table if exists locations;

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(40) NOT NULL,
    token varchar(40) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE friendlist (
  id int NOT NULL AUTO_INCREMENT,
  userID int NOT NULL,
  friendID int NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE locations (
  id int NOT NULL AUTO_INCREMENT,
  userID int NOT NULL,
  longitude varchar(200) NOT NULL,
  latitude varchar(200) NOT NULL,
  bearing varchar(200) NOT NULL,
  locationTime TIMESTAMP NOT NULL,
  PRIMARY KEY (ID)
);
