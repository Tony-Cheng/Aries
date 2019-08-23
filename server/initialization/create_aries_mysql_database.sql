CREATE SCHEMA`Aries`;

CREATE TABLE `Aries`.`login`(
  `id` INT NOT NULL AUTO_INCREMENT, `username` VARCHAR(45) NOT NULL, 
  `password` LONGTEXT NULL,
  PRIMARY KEY(`id`), 
  UNIQUE INDEX`username_UNIQUE`(`username` ASC) VISIBLE);

CREATE TABLE `Aries`.`message` (
  `chat_id` INT NOT NULL AUTO_INCREMENT,
  `text` LONGTEXT NOT NULL,
  `isClassified` TINYINT NOT NULL,
  `isToxic` TINYINT NOT NULL,
  PRIMARY KEY (`chat_id`));

ALTER TABLE `Aries`.`message` 
ADD COLUMN `user_id` INT NOT NULL AFTER `isToxic`;

ALTER TABLE `Aries`.`message` 
RENAME TO  `Aries`.`messages` ;

ALTER TABLE `Aries`.`messages` 
CHANGE COLUMN `chat_id` `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT ,
ADD UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE;
;

ALTER TABLE `Aries`.`messages` 
ADD COLUMN `chat_id` INT NOT NULL AFTER `user_id`;
