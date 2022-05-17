-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           10.5.9-MariaDB - mariadb.org binary distribution
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour smmcdb
CREATE DATABASE IF NOT EXISTS `smmcdb` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `smmcdb`;

-- Listage de la structure de la table smmcdb. depannage
CREATE TABLE IF NOT EXISTS `depannage` (
  `ref_dep` int(11) NOT NULL AUTO_INCREMENT,
  `tech_id` varchar(15) NOT NULL,
  `id_mat` varchar(15) NOT NULL,
  `date_dep` date NOT NULL,
  `diagnostique` text DEFAULT NULL,
  `liste_piece` varchar(255) DEFAULT NULL,
  `tech_name` varchar(255) DEFAULT NULL,
  `mat_user` varchar(255) DEFAULT NULL,
  `mat_info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ref_dep`) USING BTREE,
  KEY `Fk_mat_dep` (`id_mat`),
  KEY `Fk_tech_dep` (`tech_id`),
  CONSTRAINT `Fk_mat_dep` FOREIGN KEY (`id_mat`) REFERENCES `materiel` (`id_mat`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Fk_tech_dep` FOREIGN KEY (`tech_id`) REFERENCES `utilisateur` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. departement
CREATE TABLE IF NOT EXISTS `departement` (
  `id` varchar(10) NOT NULL DEFAULT '0',
  `nom_dep` varchar(100) NOT NULL,
  `dir_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departement_unique` (`nom_dep`),
  KEY `FK_DirDepartement` (`dir_id`),
  CONSTRAINT `FK_DirDepartement` FOREIGN KEY (`dir_id`) REFERENCES `direction` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. departement_seq
CREATE TABLE IF NOT EXISTS `departement_seq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. direction
CREATE TABLE IF NOT EXISTS `direction` (
  `id` varchar(10) NOT NULL DEFAULT '0',
  `nom_dir` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `direction_unique` (`nom_dir`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. direction_seq
CREATE TABLE IF NOT EXISTS `direction_seq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. materiel
CREATE TABLE IF NOT EXISTS `materiel` (
  `id_mat` varchar(15) NOT NULL,
  `type` varchar(100) NOT NULL,
  `marque` varchar(255) NOT NULL,
  `config` text NOT NULL,
  `Etat` varchar(50) NOT NULL,
  `work_id` varchar(10) NOT NULL,
  PRIMARY KEY (`id_mat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. mat_seq
CREATE TABLE IF NOT EXISTS `mat_seq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. message
CREATE TABLE IF NOT EXISTS `message` (
  `id_message` varchar(15) NOT NULL,
  `description_msg` varchar(255) DEFAULT NULL,
  `contenu_msg` longtext DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id_sender` varchar(15) NOT NULL,
  `id_receiver` varchar(15) NOT NULL,
  `date_msg` datetime DEFAULT NULL,
  PRIMARY KEY (`id_message`),
  KEY `FK_receive` (`id_receiver`),
  CONSTRAINT `FK_receive` FOREIGN KEY (`id_receiver`) REFERENCES `utilisateur` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. modification
CREATE TABLE IF NOT EXISTS `modification` (
  `ref_dep` int(11) NOT NULL,
  `id_pdr` varchar(15) NOT NULL,
  KEY `FK_dep_mod` (`ref_dep`),
  KEY `FK_pdr_mod` (`id_pdr`),
  CONSTRAINT `FK_dep_mod` FOREIGN KEY (`ref_dep`) REFERENCES `depannage` (`ref_dep`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_pdr_mod` FOREIGN KEY (`id_pdr`) REFERENCES `pdr` (`id_pdr`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. pdr
CREATE TABLE IF NOT EXISTS `pdr` (
  `id_pdr` varchar(15) NOT NULL,
  `marque` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `nombre` int(11) NOT NULL,
  `dateArrivee` date NOT NULL,
  PRIMARY KEY (`id_pdr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. pdr_seq
CREATE TABLE IF NOT EXISTS `pdr_seq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. role
CREATE TABLE IF NOT EXISTS `role` (
  `id_role` int(11) NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `role_unique` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. service
CREATE TABLE IF NOT EXISTS `service` (
  `id` varchar(10) NOT NULL DEFAULT '0',
  `nom_sce` varchar(100) NOT NULL,
  `dep_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departement_unique` (`nom_sce`),
  KEY `FK_DepService` (`dep_id`),
  CONSTRAINT `FK_DepService` FOREIGN KEY (`dep_id`) REFERENCES `departement` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. service_seq
CREATE TABLE IF NOT EXISTS `service_seq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. sms_seq
CREATE TABLE IF NOT EXISTS `sms_seq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. user_seq
CREATE TABLE IF NOT EXISTS `user_seq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. utilisateur
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `user_id` varchar(15) NOT NULL DEFAULT '0',
  `nom` varchar(100) NOT NULL,
  `prenoms` varchar(255) DEFAULT NULL,
  `fonction` varchar(255) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `path_photo` varchar(255) DEFAULT NULL,
  `work_id` varchar(10) NOT NULL,
  `role` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `utilisateur_unique` (`email`),
  KEY `FK_RoleUser` (`role`),
  CONSTRAINT `FK_RoleUser` FOREIGN KEY (`role`) REFERENCES `role` (`id_role`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table smmcdb. utilisation
CREATE TABLE IF NOT EXISTS `utilisation` (
  `user_id` varchar(15) NOT NULL,
  `id_mat` varchar(15) NOT NULL,
  `debut` date NOT NULL,
  `fin` date DEFAULT NULL,
  PRIMARY KEY (`user_id`,`id_mat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de déclencheur smmcdb. tg_departement_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER tg_departement_insert
	BEFORE INSERT ON departement
	FOR EACH ROW
	BEGIN
  	INSERT INTO departement_seq VALUES (NULL);
  	SET NEW.id = CONCAT("DEP", LPAD(LAST_INSERT_ID(), 4, '0'));
	END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Listage de la structure de déclencheur smmcdb. tg_direction_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER tg_direction_insert
	BEFORE INSERT ON direction
	FOR EACH ROW
	BEGIN
  	INSERT INTO direction_seq VALUES (NULL);
  	SET NEW.id = CONCAT('DIR', LPAD(LAST_INSERT_ID(), 4, '0'));
	END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Listage de la structure de déclencheur smmcdb. tg_materiel_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER tg_materiel_insert
	BEFORE INSERT ON materiel
	FOR EACH ROW
	BEGIN
  	INSERT INTO mat_seq VALUES (NULL);
  	SET NEW.id_mat = CONCAT('M', LPAD(LAST_INSERT_ID(), 5, '0'));
	END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Listage de la structure de déclencheur smmcdb. tg_pdr_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER tg_pdr_insert
	BEFORE INSERT ON PDR
	FOR EACH ROW
	BEGIN
  	INSERT INTO pdr_seq VALUES (NULL);
  	SET NEW.id_pdr = CONCAT('P', LPAD(LAST_INSERT_ID(), 5, '0'));
	END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Listage de la structure de déclencheur smmcdb. tg_service_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER tg_service_insert
	BEFORE INSERT ON service
	FOR EACH ROW
	BEGIN
  	INSERT INTO service_seq VALUES (NULL);
  	SET NEW.id = CONCAT("SCE", LPAD(LAST_INSERT_ID(), 4, '0'));
	END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Listage de la structure de déclencheur smmcdb. tg_sms_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER tg_sms_insert
	BEFORE INSERT ON message
	FOR EACH ROW
	BEGIN
  	INSERT INTO sms_seq VALUES (NULL);
  	SET NEW.id_message = CONCAT('MSS', LPAD(LAST_INSERT_ID(), 7, '0'));
	END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Listage de la structure de déclencheur smmcdb. tg_user_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER tg_user_insert
	BEFORE INSERT ON utilisateur
	FOR EACH ROW
	BEGIN
  	INSERT INTO user_seq VALUES (NULL);
  	SET NEW.user_id = CONCAT(NEW.user_id, LPAD(LAST_INSERT_ID(), 5, '0'));
	END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
