-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.4-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for movie_app_database
DROP DATABASE IF EXISTS `movie_app_database`;
CREATE DATABASE IF NOT EXISTS `movie_app_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `movie_app_database`;

-- Dumping structure for table movie_app_database.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table movie_app_database.administrator: ~1 rows (approximately)
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(1, 'milos@paun', '$2b$11$t7pSbKWIddBE8hJ81Mt2ge9JNOkxQ96xM88YIYPUZIr68CYM.A14q', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `parent__category_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  KEY `fk_category_parent__category_id` (`parent__category_id`),
  CONSTRAINT `fk_category_parent__category_id` FOREIGN KEY (`parent__category_id`) REFERENCES `category` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=33336 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.category: ~8 rows (approximately)
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `image_path`, `parent__category_id`) VALUES
	(1, 'History', NULL, NULL),
	(2, 'Family', NULL, NULL),
	(3, 'Fantasy', NULL, NULL),
	(4, 'Romantic', NULL, NULL),
	(5, 'Scary ', NULL, NULL),
	(6, 'Western', NULL, NULL),
	(7, 'Disney', NULL, NULL),
	(8, 'Marvel', NULL, NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.episodes
DROP TABLE IF EXISTS `episodes`;
CREATE TABLE IF NOT EXISTS `episodes` (
  `episodes_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `show_id` int(10) unsigned NOT NULL,
  `season` varchar(2) NOT NULL,
  `episode_name` varchar(64) NOT NULL,
  `episode_num` varchar(3) NOT NULL,
  `description` varchar(255) NOT NULL,
  `realise_date` date NOT NULL,
  PRIMARY KEY (`episodes_id`),
  KEY `fk_episodes_show_id` (`show_id`),
  CONSTRAINT `fk_episodes_show_id` FOREIGN KEY (`show_id`) REFERENCES `show` (`show_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table movie_app_database.episodes: ~0 rows (approximately)
/*!40000 ALTER TABLE `episodes` DISABLE KEYS */;
/*!40000 ALTER TABLE `episodes` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.film
DROP TABLE IF EXISTS `film`;
CREATE TABLE IF NOT EXISTS `film` (
  `film_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `serbian_title` varchar(64) NOT NULL,
  `year` varchar(4) NOT NULL,
  `director_name` varchar(32) NOT NULL,
  `description` varchar(255) NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`film_id`),
  KEY `fk_film_category_id` (`category_id`),
  CONSTRAINT `fk_film_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table movie_app_database.film: ~27 rows (approximately)
/*!40000 ALTER TABLE `film` DISABLE KEYS */;
INSERT INTO `film` (`film_id`, `title`, `serbian_title`, `year`, `director_name`, `description`, `category_id`) VALUES
	(1, 'Titanic', 'Titanik', '1997', 'James Cameron', 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.', 4),
	(3, 'Beauty and the Beast', 'Lepotica i zver', '2017', 'Bill Condon', 'A selfish Prince is cursed to become a monster for the rest of his life, unless he learns to fall in love with a beautiful young woman he keeps prisoner.', 7),
	(4, 'Maleficent', 'Grdana', '2014', 'Robert Stromberg', 'A vengeful fairy is driven to curse an infant princess, only to discover that the child may be the one person who can restore peace to their troubled land.', 7),
	(5, 'Maleficent: Mistress of Evil ', 'Grdana-Gospodarica zla', '2019', 'Joachim Rønning', 'Maleficent and her goddaughter Aurora begin to question the complex family ties that bind them as they are pulled in different directions by impending nuptials, unexpected allies and dark new forces at play.', 7),
	(6, 'Black Panter', 'Crni Panter', '2018', 'Ryan Coogler', 'T\'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country\'s past.', 8),
	(7, 'Guardians of the Galaxy', 'Cuvari Galaksije', '2014', 'James Gunn', 'A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.', 8),
	(8, 'Guardians of the Galaxy Vol. 2', 'Cuvari Galaksije 2 ', '2017', 'James Gunn', 'The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord\'s encounter with his father the ambitious celestial being Ego.', 8),
	(9, 'Thor', 'Tor', '2011', 'Kenneth Branagh', 'The powerful but arrogant god Thor is cast out of Asgard to live amongst humans in Midgard (Earth), where he soon becomes one of their finest defenders.', 8),
	(10, 'X-Men: Dark Phoenix\r\n', 'Iks ljudi: Mracni Feniks', '2019', 'Simon Kinberg', 'Jean Grey begins to develop incredible powers that corrupt and turn her into a Dark Phoenix, causing the X-Men to decide if her life is worth more than all of humanity.', 8),
	(11, 'A Star Is Born', 'Zvezda Je Rodjena', '2018', 'Bradley Cooper', 'A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.', 4),
	(12, 'The Notebook', 'Beleznica', '2004', 'Nick Cassavetes', 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.', 4),
	(13, 'Me Before You', 'Dok nisam srela tebe', '2016', 'Thea Sharrock', 'A girl in a small town forms an unlikely bond with a recently-paralyzed man she\'s taking care of.', 4),
	(14, 'Hereditary', 'Nasledjeno zlo ', '2018', 'Ari Aster', 'A grieving family is haunted by tragic and disturbing occurrences.', 5),
	(15, 'It', 'To', '2017', 'Andy Muschietti', 'In the summer of 1989, a group of bullied kids band together to destroy a shape-shifting monster, which disguises itself as a clown and preys on the children of Derry, their small Maine town.', 5),
	(16, 'The Shining', 'Isijavanje', '1980', 'Stanley Kubrick', 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.', 5),
	(17, 'Insidious', 'Astralna podmuklost', '2010', 'James Wan', 'A family looks to prevent evil spirits from trapping their comatose child in a realm called The Further.', 5),
	(18, 'Aladdin', 'Aladin', '2019', 'Guy Ritchie', 'A kind-hearted street urchin and a power-hungry Grand Vizier vie for a magic lamp that has the power to make their deepest wishes come true.', 7),
	(19, 'Avatar', 'Avatar', '2009', 'James Cameron', 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.', 3),
	(20, 'The Lord of the Rings: The Fellowship of the Ring', 'Gospodar Prstenova:Druzina prstena', '2003', 'Peter Jackson ', 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.', 3),
	(21, 'The Shape of Water', 'Oblik vode', '2017', 'Guillermo del Toro', 'At a top secret research facility in the 1960s, a lonely janitor forms a unique relationship with an amphibious creature that is being held in captivity.', 3),
	(22, 'Home Alone', 'Samo u kuci', '1990', 'Chris Columbus', 'An eight-year-old troublemaker must protect his house from a pair of burglars when he is accidentally left home alone by his family during Christmas vacation.', 2),
	(23, 'Troy', 'Troja', '2004', 'Wolfgang Petersen', 'An adaptation of Homer\'s great epic, the film follows the assault on Troy by the united Greek forces and chronicles the fates of the men involved.', 1),
	(24, 'First Man', 'Prvi covek na mesecu', '2018', 'Damien Chazelle', 'A look at the life of the astronaut, Neil Armstrong, and the legendary space mission that led him to become the first man to walk on the Moon on July 20, 1969.', 1),
	(25, 'X-Men', 'Iks-Ljudi', '2000', 'Bryan Singer', 'In a world where mutants (evolved super-powered humans) exist and are discriminated against, two groups form for an inevitable clash: the supremacist Brotherhood, and the pacifist X-Men.', 8),
	(26, 'X2: X-Men United', 'Iks-Ljudi 2 ', '2003', 'Bryan Singer', 'When anti-mutant Colonel William Stryker kidnaps Professor X and attacks his school, the X-Men must ally with their archenemy Magneto to stop him.', 8),
	(27, 'X-Men: The Last Stand', 'Iks-Ljudi: Poslednje uporiste', '2006', 'Brett Ratner', 'The human government develops a cure for mutations, and Jean Gray becomes a darker uncontrollable persona called the Phoenix who allies with Magneto, causing escalation into an all-out battle for the X-Men.', 8),
	(28, 'Maleficent: Mistress of Evil 3', 'Grdana-Gospodarica zla 3', '2015', 'Joachim Rønning', 'Maleficent and her goddaughter Aurora begin to question the complex family ties that bind them as they are pulled in different directions by impending nuptials, unexpected allies and dark new forces at play.', 7);
/*!40000 ALTER TABLE `film` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.film_genre
DROP TABLE IF EXISTS `film_genre`;
CREATE TABLE IF NOT EXISTS `film_genre` (
  `film_genre_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `film_id` int(10) unsigned NOT NULL,
  `genre_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`film_genre_id`),
  UNIQUE KEY `uq_film_genre_film_id_genre_id` (`film_id`,`genre_id`),
  KEY `fk_film_genre_genre_id` (`genre_id`),
  KEY `fk_film_genre_film_id` (`film_id`),
  CONSTRAINT `fk_film_genre_film_id` FOREIGN KEY (`film_id`) REFERENCES `film` (`film_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_film_genre_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.film_genre: ~13 rows (approximately)
/*!40000 ALTER TABLE `film_genre` DISABLE KEYS */;
INSERT INTO `film_genre` (`film_genre_id`, `film_id`, `genre_id`) VALUES
	(36, 1, 4),
	(37, 1, 14),
	(3, 4, 6),
	(7, 5, 1),
	(38, 6, 1),
	(4, 11, 4),
	(2, 12, 2),
	(41, 13, 14),
	(10, 16, 8),
	(1, 19, 2),
	(6, 23, 2),
	(39, 24, 4),
	(40, 24, 15);
/*!40000 ALTER TABLE `film_genre` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.film_tag
DROP TABLE IF EXISTS `film_tag`;
CREATE TABLE IF NOT EXISTS `film_tag` (
  `film_tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `film_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`film_tag_id`),
  KEY `fk_film_tag_film_id` (`film_id`),
  KEY `fk_film_tag_tag_id` (`tag_id`),
  CONSTRAINT `fk_film_tag_film_id` FOREIGN KEY (`film_id`) REFERENCES `film` (`film_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_film_tag_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`tag_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.film_tag: ~2 rows (approximately)
/*!40000 ALTER TABLE `film_tag` DISABLE KEYS */;
INSERT INTO `film_tag` (`film_tag_id`, `film_id`, `tag_id`) VALUES
	(1, 1, 2),
	(2, 1, 1);
/*!40000 ALTER TABLE `film_tag` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.genre
DROP TABLE IF EXISTS `genre`;
CREATE TABLE IF NOT EXISTS `genre` (
  `genre_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`genre_id`),
  UNIQUE KEY `uq_genre_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.genre: ~9 rows (approximately)
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` (`genre_id`, `name`) VALUES
	(1, 'Action'),
	(2, 'Adventure'),
	(3, 'Comedy'),
	(5, 'Crime'),
	(4, 'Drama'),
	(6, 'Fantasy'),
	(14, 'Romance'),
	(15, 'Si-fi'),
	(8, 'Thriller');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(128) NOT NULL,
  `film_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `fk_photo_film_id` (`film_id`),
  CONSTRAINT `fk_photo_film_id` FOREIGN KEY (`film_id`) REFERENCES `film` (`film_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.photo: ~23 rows (approximately)
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `image_path`, `film_id`) VALUES
	(9, 'static/uploads/2021/09/0c78afc0-fe42-4024-9131-2ea96cfdc6c0-x-men-last-stand.jpg', 27),
	(10, 'static/uploads/2021/09/eacf2a50-5571-4ffa-b617-3228a26b6a7a-titanic.jpg', 1),
	(11, 'static/uploads/2021/09/a5aa8043-85fc-47ad-a2f2-133bad532f36-beauty-and-the-beast.jpg', 3),
	(12, 'static/uploads/2021/09/2bbd1a8b-ea24-4aa2-863b-93a8b0dc7cb6-maleficent.jpg', 4),
	(13, 'static/uploads/2021/09/47af7db4-a0a9-45e7-b2ba-444120e09045-maleficent-master-of-evil.jpg', 5),
	(14, 'static/uploads/2021/09/7419512a-783d-4a2c-b348-0077f595359d-black-panter.jpg', 6),
	(15, 'static/uploads/2021/09/9cd54521-36c9-4657-b81f-cab5d3c76557-guardian-of-the-galaxy.jpg', 7),
	(16, 'static/uploads/2021/09/f2b70ea6-be4d-4e74-9468-2bfe9d575db6-guardian-of-the-galaxy-vol2.jpg', 8),
	(17, 'static/uploads/2021/09/fdf63979-7bcb-4c0c-b0de-b671daf6493b-thor.jpg', 9),
	(18, 'static/uploads/2021/09/e3df0cd7-5ca5-477a-b8ed-878cd35e7a0f-dark-phoenix.png', 10),
	(19, 'static/uploads/2021/09/fd4eee78-06ac-4bea-923f-39e01db08e27-star-is-born.jpg', 11),
	(20, 'static/uploads/2021/09/a5655ab4-2b36-4c9d-9699-0d1dd093c1c0-notebook.jpg', 12),
	(21, 'static/uploads/2021/09/52bbbcf5-ad78-4f01-981b-626ed805faee-me-before-you.jpg', 13),
	(22, 'static/uploads/2021/09/b04eb9a8-0747-4bd2-b0ed-16dcf63f858c-it.jpg', 15),
	(23, 'static/uploads/2021/09/deb74509-5c25-417f-8117-ebee67722cba-the-shining.jpg', 16),
	(24, 'static/uploads/2021/09/246703b3-8dce-4c42-81d0-0249eceaba38-insidious.jpg', 17),
	(25, 'static/uploads/2021/09/814c3ee3-3fe3-450b-ba74-95e4478aa101-aladdin.jpg', 18),
	(26, 'static/uploads/2021/09/e936c963-f324-4973-972d-ac71c3705266-avatar.jpg', 19),
	(27, 'static/uploads/2021/09/1f46b6b8-b65e-4e9e-9db5-4ec9c0a2654b-lord-of-rings.jpg', 20),
	(28, 'static/uploads/2021/09/7e48ed71-2da6-4736-8e8e-40cf16b4ee5f-shape-of-water.jpg', 21),
	(29, 'static/uploads/2021/09/564148e1-9beb-45a3-abe3-7d56477abc32-home-alone.jpg', 22),
	(30, 'static/uploads/2021/09/f80579f5-2c1b-49c5-ba7a-059a180ed325-troy.jpg', 23),
	(31, 'static/uploads/2021/09/a7427ddb-d298-4c04-b735-5241c21e8daf-first-man.jpg', 24);
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.review
DROP TABLE IF EXISTS `review`;
CREATE TABLE IF NOT EXISTS `review` (
  `review_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `review_text` varchar(255) NOT NULL,
  `rating` varchar(2) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `film_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `fk_review_user_id` (`user_id`),
  KEY `fk_review_film_id` (`film_id`),
  CONSTRAINT `fk_review_film_id` FOREIGN KEY (`film_id`) REFERENCES `film` (`film_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_review_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.review: ~0 rows (approximately)
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.show
DROP TABLE IF EXISTS `show`;
CREATE TABLE IF NOT EXISTS `show` (
  `show_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `serbian_title` varchar(64) NOT NULL,
  `year` varchar(4) NOT NULL,
  `director_name` varchar(32) NOT NULL,
  `description` text NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`show_id`),
  KEY `fk_show_category_id` (`category_id`),
  CONSTRAINT `fk_show_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.show: ~1 rows (approximately)
/*!40000 ALTER TABLE `show` DISABLE KEYS */;
INSERT INTO `show` (`show_id`, `title`, `serbian_title`, `year`, `director_name`, `description`, `image_path`, `category_id`) VALUES
	(1, 'Game of thrones', 'Igra prestola', '2011', '\r\nDavid BenioffD.B. Weiss', 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.', 'static/photos/game-of-thrones', 3);
/*!40000 ALTER TABLE `show` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.show_genre
DROP TABLE IF EXISTS `show_genre`;
CREATE TABLE IF NOT EXISTS `show_genre` (
  `show_genre_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `show_id` int(10) unsigned NOT NULL,
  `genre_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`show_genre_id`),
  KEY `fk_show_genre_show_id` (`show_id`),
  KEY `fk_show_genre_genre_id` (`genre_id`),
  CONSTRAINT `fk_show_genre_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_show_genre_show_id` FOREIGN KEY (`show_id`) REFERENCES `show` (`show_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.show_genre: ~2 rows (approximately)
/*!40000 ALTER TABLE `show_genre` DISABLE KEYS */;
INSERT INTO `show_genre` (`show_genre_id`, `show_id`, `genre_id`) VALUES
	(1, 1, 6),
	(2, 1, 2);
/*!40000 ALTER TABLE `show_genre` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.tag
DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `uq_tag_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table movie_app_database.tag: ~3 rows (approximately)
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` (`tag_id`, `name`) VALUES
	(2, 'Emotional'),
	(3, 'Violent'),
	(1, 'Well-acted');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;

-- Dumping structure for table movie_app_database.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `username` varchar(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `forename` varchar(32) NOT NULL,
  `surname` varchar(64) NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_username` (`username`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table movie_app_database.user: ~2 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `created_at`, `username`, `email`, `password_hash`, `forename`, `surname`, `is_active`) VALUES
	(1, '2021-09-10 22:04:41', 'Paun2017', 'milos.paunovic.17@singimail.rs', '$2b$11$mbVxnYTfdaDqgbuntmvdee34KVs3nfN1v95MYEMl7JojhSWIuT.jC', 'Milos', 'Paunovic', 1),
	(4, '2021-09-11 12:42:01', 'Nikola224', 'nikola.nikolic223355@gmail.com', '$2b$11$rbRlVu7036cC78gzsYNOC.7KCvkG8lYGTgu4lM3PwdY5ADfjdUjLq', 'Nikola', 'Nikolic', 1),
	(5, '2021-09-12 01:42:44', 'petar98', 'petar.petrovic12345@gmail.com', '$2b$11$UAR3Y37S2m/XpU5trG1.D.y9z0p4y.IhU10wQv0.rPhdVW7u2cvVi', 'Petar', 'Petrovic', 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
