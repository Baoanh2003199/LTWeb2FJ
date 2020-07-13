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
  `parentID` int(11) DEFAULT 0,
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


DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `isPremium` int(11) DEFAULT NULL,
  `openTime` timestamp default null,
  -- nếu bị lỗi thì bỏ comment dòng bên dưới và comment dòng bên trên
  -- `openTime` timestamp default current_timestamp,
  `filePdf` varchar(255) default null,
  `catID` int(11) DEFAULT NULL,
   `createdBy` int(11) DEFAULT NULL,
   `note` nvarchar(255) default NULL,
   `status` nvarchar(255) default 0,
   `views` int(11) default 0,
   `thumbnail` nvarchar(255) default null,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
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
  `code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `reset_password`;
CREATE TABLE `reset_password` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `token_reset` varchar(255) NOT NULL,
  `expired` timestamp,
  `sent_times` int(11),
  `available_times` timestamp,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `subscriber`;
CREATE TABLE `subscriber` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  `expired` timestamp,
  PRIMARY KEY (`id`)
);


DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `registerToken`
CREATE TABLE `registerToken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `expired` timestamp,
  PRIMARY KEY (`id`)
);



--DROP TABLE IF EXISTS `user_role`;
--CREATE TABLE `user_role` (
--  `userID` int(11) NOT NULL,
--  `roleID` int(11) NOT NULL,
--  PRIMARY KEY (`userID`,`roleID`)
--);


-- ALTER TABLE news ADD  FOREIGN KEY (catID) REFERENCES  category(id);
-- ALTER TABLE news ADD  FOREIGN KEY (createdBy) REFERENCES  `user`(id);
-- ALTER TABLE news_tag ADD  FOREIGN KEY (newID) REFERENCES  news(id);
-- ALTER TABLE news_tag ADD  FOREIGN KEY (tagID) REFERENCES  tag(id);

-- ALTER TABLE user_role ADD  FOREIGN KEY (userID) REFERENCES  user(id);
-- ALTER TABLE user_role ADD  FOREIGN KEY (roleID) REFERENCES  role(id);


-- Dump completed on 2020-06-16 10:55:29

insert into category value(null, 'Thể thao', 0);
insert into category value(null, 'Thời sự', 0);
insert into category value(null, 'Giải trí', 0);
insert into category value(null, 'Bóng đá', 1);
insert into category value(null, 'Tennis', 1);
insert into category value(null, 'Giao thông', 2);
insert into category value(null, 'Chống dịch', 2);
insert into category value(null, 'Phim', 3);
insert into category value(null, 'Truyện', 3);

insert into tag values(null, 'covid 19');
insert into tag values(null, 'sức khỏe');
insert into tag values(null, 'AFF-Cup');
insert into tag values(null, 'Tuyển Việt Nam');
insert into tag values(null, 'Hành động');
insert into tag values(null, 'Kich tính');
insert into tag values(null, 'Kinh dị');


insert into news values(null, 'Tiêu đề 1', 'Mô tả 1', 'Nội dung 1', 0, now(), null, 3, null, 'Ghi chú', 0);
insert into news values(null, 'Tiêu đề 2', 'Mô tả 2', 'Nội dung 2', 1, now(), null, 4, null, 'Ghi chú', 0);
insert into news values(null, 'Tiêu đề 3', 'Mô tả 3', 'Nội dung 3', 0, now(), null, 5, null, 'Ghi chú', 0);
insert into news values(null, 'Tiêu đề 4', 'Mô tả 4', 'Nội dung 4', 1, now(), null, 3, null, 'Ghi chú', 0);
insert into news values(null, 'Tiêu đề 5', 'Mô tả 5', 'Nội dung 5', 1, now(), null, 6, null, 'Ghi chú', 0);
insert into news values(null, 'Tiêu đề 6', 'Mô tả 6', 'Nội dung 6', 0, now(), null, 6, null, 'Ghi chú', 0);
insert into news values(null, 'Tiêu đề 7', 'Mô tả 7', 'Nội dung 7', 0, now(), null, 7, null, 'Ghi chú', 0);

insert into news_tag values(1, 1);
insert into news_tag values(1, 2);
insert into news_tag values(2, 1);
insert into news_tag values(2, 3);
insert into news_tag values(3, 1);
insert into news_tag values(4, 1);
insert into news_tag values(4, 2);
insert into news_tag values(4, 6);
insert into news_tag values(5, 2);
insert into news_tag values(5, 3);
insert into news_tag values(5, 7);
insert into news_tag values(6, 1);
insert into news_tag values(7, 7);

insert into role values(null, 'Quản trị','ADMINSTRATOR');
insert into role values(null, 'Biên tập','EDITOR');
insert into role values(null, 'Phóng viên','WRITER');
insert into role values(null, 'Đọc giả','SUBSCRIBER');


