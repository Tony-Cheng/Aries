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
