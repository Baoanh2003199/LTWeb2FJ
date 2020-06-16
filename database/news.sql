-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: localhost    Database: News
-- ------------------------------------------------------
-- Server version	8.0.18
create database News;
use News;

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `parentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `parentID` int(11) DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `tinyDesc` varchar(255) NOT NULL,
  `fullDesc` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `isPremium` int(11) DEFAULT NULL,
  `catID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `news_tag`;
CREATE TABLE `news_tag` (
  `newID` int(11) NOT NULL,
  `tagID` int(11) NOT NULL,
  PRIMARY KEY (`newID`,`tagID`)
);

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `tag`;

CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `user_member`;
CREATE TABLE `user_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `userID` int(11) NOT NULL,
  `roleID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`roleID`)
);


ALTER TABLE news ADD  FOREIGN KEY (catID) REFERENCES  category(id);
ALTER TABLE news_tag ADD  FOREIGN KEY (newID) REFERENCES  news(id);
ALTER TABLE news_tag ADD  FOREIGN KEY (tagID) REFERENCES  tag(id);

ALTER TABLE user_role ADD  FOREIGN KEY (userID) REFERENCES  user(id);
ALTER TABLE user_role ADD  FOREIGN KEY (roleID) REFERENCES  role(id);

-- Dump completed on 2020-06-16 10:55:29
