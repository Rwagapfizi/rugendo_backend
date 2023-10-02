-- MariaDB dump 10.19-11.2.0-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: rugendo
-- ------------------------------------------------------
-- Server version	11.2.0-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `boughttickets`
--

DROP TABLE IF EXISTS `boughttickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boughttickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketFormatID` int(11) DEFAULT NULL,
  `customerID` int(11) NOT NULL,
  `ticketDate` date NOT NULL,
  `plaqueNumber` varchar(255) NOT NULL,
  `paymentMethodUsed` varchar(255) NOT NULL,
  `timeBought` timestamp NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'BOUGHT',
  PRIMARY KEY (`id`),
  KEY `fk_customer` (`customerID`),
  KEY `fk_ticket_format` (`ticketFormatID`),
  CONSTRAINT `fk_customer` FOREIGN KEY (`customerID`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_ticket_format` FOREIGN KEY (`ticketFormatID`) REFERENCES `ticketformats` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=713 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boughttickets`
--

LOCK TABLES `boughttickets` WRITE;
/*!40000 ALTER TABLE `boughttickets` DISABLE KEYS */;
INSERT INTO `boughttickets` VALUES
(2,4,12,'2023-12-12','RAC239P','Momo','2023-08-30 09:02:55','BOUGHT'),
(3,4,12,'2023-12-12','RAC239P','Momo','2023-08-30 09:02:55','BOUGHT'),
(4,1,5,'2023-11-21','RAC849P','Airtel','2023-08-30 09:02:55','BOUGHT'),
(5,1,5,'2023-11-21','RAC849P','Airtel','2023-08-30 09:02:55','BOUGHT'),
(6,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(7,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(8,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(9,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(10,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(11,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(12,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(13,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(14,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(15,4,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(16,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(17,1,12,'2023-02-11','RAC312Y','Airtel','2023-08-30 09:02:55','BOUGHT'),
(18,1,5,'2023-11-11','RAC342B','mtn','2023-08-30 09:02:55','BOUGHT'),
(19,1,6,'2023-08-24','RAC345B','mtn','2023-08-30 09:02:55','BOUGHT'),
(491,5,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:42:06','BOUGHT'),
(492,5,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:42:10','BOUGHT'),
(493,5,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:43:23','BOUGHT'),
(494,5,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:46:19','BOUGHT'),
(495,5,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:46:39','BOUGHT'),
(496,5,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:49:03','BOUGHT'),
(497,3,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:49:47','BOUGHT'),
(498,1,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:51:53','BOUGHT'),
(499,1,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:52:46','BOUGHT'),
(500,1,24,'2023-09-30','RAC345B','mtn','2023-09-17 18:53:32','BOUGHT'),
(501,3,24,'2023-09-30','RAC345B','mtn','2023-09-18 08:42:42','BOUGHT'),
(502,3,24,'2023-09-30','RAC345B','mtn','2023-09-18 08:43:13','BOUGHT'),
(503,1,24,'2023-09-30','RAC345B','mtn','2023-09-18 09:47:41','BOUGHT'),
(504,1,6,'2023-09-30','RAC345B','mtn','2023-09-18 18:18:17','BOUGHT'),
(505,2,6,'2023-09-30','RAC345B','mtn','2023-09-18 18:37:00','BOUGHT'),
(506,2,6,'2023-09-30','RAC345B','mtn','2023-09-18 18:37:05','CANCELLED'),
(507,3,24,'2023-09-30','RAC345B','mtn','2023-09-18 20:46:22','BOUGHT'),
(508,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 10:55:05','BOUGHT'),
(509,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 10:57:26','BOUGHT'),
(510,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:01:50','BOUGHT'),
(511,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:01:50','BOUGHT'),
(512,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:04:49','BOUGHT'),
(513,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:04:49','BOUGHT'),
(514,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:06:15','BOUGHT'),
(515,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:06:15','BOUGHT'),
(516,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:06:43','BOUGHT'),
(517,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:06:43','BOUGHT'),
(518,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:09:17','BOUGHT'),
(519,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:09:17','BOUGHT'),
(520,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:09:39','BOUGHT'),
(521,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:09:39','BOUGHT'),
(522,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:10:11','BOUGHT'),
(523,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:10:11','BOUGHT'),
(524,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:10:29','BOUGHT'),
(525,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:10:29','BOUGHT'),
(526,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:10:34','BOUGHT'),
(527,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:10:34','BOUGHT'),
(528,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:10:57','BOUGHT'),
(529,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:10:57','BOUGHT'),
(530,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:11:01','BOUGHT'),
(531,1,24,'2023-09-30','RAC345B','mtn','2023-09-19 11:11:01','BOUGHT'),
(532,1,24,'2023-09-29','RAC345B','mtn','2023-09-19 11:12:27','BOUGHT'),
(533,1,24,'2023-09-29','RAC345B','mtn','2023-09-19 11:12:28','BOUGHT'),
(534,1,24,'2023-09-29','RAC345B','mtn','2023-09-19 11:12:28','BOUGHT'),
(535,1,24,'2023-09-28','RAC345B','mtn','2023-09-19 13:08:21','BOUGHT'),
(536,1,24,'2023-09-28','RAC345B','mtn','2023-09-19 13:55:12','BOUGHT'),
(537,1,24,'2023-09-28','RAC345B','mtn','2023-09-19 13:56:48','BOUGHT'),
(538,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 13:59:02','BOUGHT'),
(539,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:00:10','BOUGHT'),
(540,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:01:22','BOUGHT'),
(541,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:01:51','BOUGHT'),
(542,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:02:19','BOUGHT'),
(543,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:03:09','BOUGHT'),
(544,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:04:20','BOUGHT'),
(545,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:04:54','BOUGHT'),
(546,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:06:25','BOUGHT'),
(547,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:08:19','BOUGHT'),
(548,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 14:08:51','BOUGHT'),
(549,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:24:33','BOUGHT'),
(550,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:26:04','BOUGHT'),
(551,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:26:25','BOUGHT'),
(552,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:27:15','BOUGHT'),
(553,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:30:22','BOUGHT'),
(554,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:38:43','BOUGHT'),
(555,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:47:38','BOUGHT'),
(556,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:48:28','BOUGHT'),
(557,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:49:30','BOUGHT'),
(558,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:51:49','BOUGHT'),
(559,1,5,'2023-09-29','RAC345B','mtn','2023-09-19 17:52:15','BOUGHT'),
(560,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 17:54:53','BOUGHT'),
(561,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 17:57:25','BOUGHT'),
(562,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 17:58:22','BOUGHT'),
(563,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 17:58:54','BOUGHT'),
(564,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 17:59:39','BOUGHT'),
(565,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 17:59:39','BOUGHT'),
(566,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:01:33','BOUGHT'),
(567,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:02:44','BOUGHT'),
(568,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:03:12','BOUGHT'),
(569,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:04:19','BOUGHT'),
(570,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:04:42','BOUGHT'),
(571,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:06:09','BOUGHT'),
(572,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:06:45','BOUGHT'),
(573,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:07:40','BOUGHT'),
(574,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:07:47','BOUGHT'),
(575,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:09:16','BOUGHT'),
(576,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:11:01','BOUGHT'),
(577,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:12:10','BOUGHT'),
(578,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:12:19','BOUGHT'),
(579,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:14:03','BOUGHT'),
(580,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:14:03','BOUGHT'),
(581,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:14:26','BOUGHT'),
(582,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:14:26','BOUGHT'),
(583,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:15:21','BOUGHT'),
(584,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:16:53','BOUGHT'),
(585,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:16:58','BOUGHT'),
(586,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:18:47','BOUGHT'),
(587,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:18:53','BOUGHT'),
(588,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:18:58','BOUGHT'),
(589,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 18:20:31','BOUGHT'),
(590,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:28:22','BOUGHT'),
(591,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:28:42','BOUGHT'),
(592,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:29:09','BOUGHT'),
(593,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:30:11','BOUGHT'),
(594,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:30:37','BOUGHT'),
(595,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:31:33','BOUGHT'),
(596,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:32:08','BOUGHT'),
(597,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:40:56','BOUGHT'),
(598,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:41:29','BOUGHT'),
(599,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:41:42','BOUGHT'),
(600,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:59:43','BOUGHT'),
(601,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 19:59:57','BOUGHT'),
(602,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:00:16','BOUGHT'),
(603,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:01:28','BOUGHT'),
(604,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:04:32','BOUGHT'),
(605,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:05:23','BOUGHT'),
(606,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:07:45','BOUGHT'),
(607,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:09:47','BOUGHT'),
(608,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:10:44','BOUGHT'),
(609,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:10:57','BOUGHT'),
(610,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:12:47','BOUGHT'),
(611,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:13:04','BOUGHT'),
(612,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:14:07','BOUGHT'),
(613,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:14:11','BOUGHT'),
(614,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:14:57','BOUGHT'),
(615,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:16:07','BOUGHT'),
(616,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:16:22','BOUGHT'),
(617,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:16:39','BOUGHT'),
(618,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:25:34','BOUGHT'),
(619,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:27:04','BOUGHT'),
(620,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:39:51','BOUGHT'),
(621,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:40:31','BOUGHT'),
(622,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:53:26','BOUGHT'),
(623,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:53:38','BOUGHT'),
(624,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:53:57','BOUGHT'),
(625,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:54:17','BOUGHT'),
(626,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:55:31','BOUGHT'),
(627,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:56:03','BOUGHT'),
(628,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:56:29','BOUGHT'),
(629,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:57:08','BOUGHT'),
(630,1,5,'2023-09-25','RAC345B','mtn','2023-09-19 20:58:54','BOUGHT'),
(631,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 06:44:25','BOUGHT'),
(632,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 06:44:52','BOUGHT'),
(633,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 06:52:33','BOUGHT'),
(634,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 06:53:05','BOUGHT'),
(635,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 06:53:52','BOUGHT'),
(636,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 06:57:39','BOUGHT'),
(637,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 06:59:11','BOUGHT'),
(638,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 07:01:00','BOUGHT'),
(639,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 07:02:10','BOUGHT'),
(640,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 07:03:09','BOUGHT'),
(641,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 07:03:36','BOUGHT'),
(642,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 07:04:23','BOUGHT'),
(643,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 07:38:27','BOUGHT'),
(644,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 07:39:15','BOUGHT'),
(645,1,5,'2023-09-25','RAC345B','mtn','2023-09-20 07:46:59','BOUGHT'),
(646,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 07:51:18','BOUGHT'),
(647,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 07:51:18','BOUGHT'),
(648,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 07:51:18','BOUGHT'),
(649,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:09:37','BOUGHT'),
(650,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:09:37','BOUGHT'),
(651,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:09:37','BOUGHT'),
(652,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:12:09','BOUGHT'),
(653,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:12:09','BOUGHT'),
(654,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:12:09','BOUGHT'),
(655,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:13:09','BOUGHT'),
(656,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:13:09','BOUGHT'),
(657,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:13:09','BOUGHT'),
(658,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:15:41','BOUGHT'),
(659,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:15:41','BOUGHT'),
(660,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:15:41','BOUGHT'),
(661,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:19:51','BOUGHT'),
(662,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:19:51','BOUGHT'),
(663,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:19:51','BOUGHT'),
(664,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:20:14','BOUGHT'),
(665,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:20:14','BOUGHT'),
(666,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:20:14','BOUGHT'),
(667,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:30:25','BOUGHT'),
(668,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:30:26','BOUGHT'),
(669,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:30:26','BOUGHT'),
(670,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:31:36','BOUGHT'),
(671,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:31:36','BOUGHT'),
(672,1,5,'2023-09-24','RAC345B','mtn','2023-09-20 09:31:36','BOUGHT'),
(673,1,5,'2023-10-01','RAC345B','mtn','2023-09-20 09:33:20','BOUGHT'),
(674,1,5,'2023-10-01','RAC345B','mtn','2023-09-20 09:33:20','BOUGHT'),
(675,1,5,'2023-10-01','RAC345B','mtn','2023-09-20 09:33:20','BOUGHT'),
(676,1,5,'2023-10-01','RAC345B','mtn','2023-09-20 09:33:20','BOUGHT'),
(677,1,6,'2023-10-01','RAC345B','mtn','2023-09-20 09:58:19','BOUGHT'),
(678,1,6,'2023-10-01','RAC345B','mtn','2023-09-20 09:58:19','BOUGHT'),
(679,1,6,'2023-10-02','RAC345B','mtn','2023-09-20 10:12:54','BOUGHT'),
(680,1,6,'2023-09-27','RAC345B','mtn','2023-09-20 19:36:48','BOUGHT'),
(681,1,6,'2023-09-27','RAC345B','mtn','2023-09-20 19:36:48','BOUGHT'),
(682,1,6,'2023-09-27','RAC345B','mtn','2023-09-20 19:37:44','BOUGHT'),
(683,1,6,'2023-09-27','RAC345B','mtn','2023-09-20 19:37:44','BOUGHT'),
(684,7,5,'2023-10-02','RAC345B','mtn','2023-09-21 10:18:39','BOUGHT'),
(685,7,5,'2023-10-02','RAC345B','mtn','2023-09-21 10:18:39','BOUGHT'),
(686,1,25,'2023-10-04','RAC345B','mtn','2023-09-21 13:24:24','BOUGHT'),
(687,1,25,'2023-10-04','RAC345B','mtn','2023-09-21 13:24:24','BOUGHT'),
(688,1,25,'2023-10-04','RAC345B','mtn','2023-09-21 13:24:24','BOUGHT'),
(689,1,25,'2023-10-04','RAC345B','mtn','2023-09-21 13:24:24','BOUGHT'),
(690,3,5,'2023-10-08','RAC345B','mtn','2023-09-26 10:13:49','BOUGHT'),
(691,3,5,'2023-10-08','RAC345B','mtn','2023-09-26 10:13:49','BOUGHT'),
(692,3,6,'2023-10-08','RAC345B','mtn','2023-09-26 13:23:36','BOUGHT'),
(693,3,6,'2023-10-08','RAC345B','mtn','2023-09-26 13:23:36','CANCELLED'),
(694,3,6,'2023-10-08','RAC345B','mtn','2023-09-26 13:23:36','CANCELLED'),
(695,3,6,'2023-10-06','RAC345B','mtn','2023-09-26 14:27:31','BOUGHT'),
(696,3,6,'2023-10-06','RAC345B','mtn','2023-09-26 14:27:31','BOUGHT'),
(697,16,6,'2023-10-08','RAC345B','mtn','2023-09-26 21:05:56','BOUGHT'),
(698,3,27,'2023-10-06','RAC345B','mtn','2023-09-27 09:19:10','BOUGHT'),
(699,3,27,'2023-10-06','RAC345B','mtn','2023-09-27 09:19:10','CANCELLED'),
(700,3,6,'2023-10-06','RAC345B','mtn','2023-09-27 09:32:00','BOUGHT'),
(701,3,6,'2023-10-06','RAC345B','mtn','2023-09-27 09:32:00','BOUGHT'),
(702,3,6,'2023-10-06','RAC345B','mtn','2023-09-27 09:32:00','CANCELLED'),
(703,3,6,'2023-10-06','RAC345B','mtn','2023-09-27 09:32:00','CANCELLED'),
(704,3,5,'2023-10-05','RAC345B','mtn','2023-09-27 15:52:52','BOUGHT'),
(705,3,27,'2023-10-05','RAC345B','mtn','2023-09-27 15:57:02','BOUGHT'),
(706,3,27,'2023-10-05','RAC345B','mtn','2023-09-27 15:57:02','BOUGHT'),
(707,3,6,'2023-10-28','RAC345B','mtn','2023-10-01 09:25:40','BOUGHT'),
(708,3,6,'2023-10-19','RAC345B','mtn','2023-10-01 09:25:40','BOUGHT'),
(709,11,6,'2023-10-17','RAC345B','mtn','2023-10-01 09:56:46','BOUGHT'),
(710,3,5,'2023-10-02','RAC345B','mtn','2023-10-02 10:02:29','BOUGHT'),
(711,3,5,'2023-10-02','RAC345B','mtn','2023-10-02 10:02:29','BOUGHT'),
(712,3,5,'2023-10-02','RAC345B','mtn','2023-10-02 10:02:29','BOUGHT');
/*!40000 ALTER TABLE `boughttickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plaqueNumber` varchar(20) NOT NULL,
  `maxCapacity` int(11) NOT NULL,
  `model` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `companyID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `companyID` (`companyID`),
  CONSTRAINT `buses_ibfk_1` FOREIGN KEY (`companyID`) REFERENCES `companies` (`companyID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES
(1,'RAC123A',40,'COASTER','$2b$10$e0iUpGlSLkYgSW3xIH9qx.P4eKO.PLkznjvt4FXl2tEkDnBCfsyPa',160),
(2,'RAD456B',40,'COASTER','$2b$10$JsKup78ZyW8qZb3lmPcT3OEM0WGkFbzYFk4YkgM0IXkHKPpmYTa1e',160),
(3,'RAC390B',30,'COASTER','$2b$10$99J7mMC6uk8fhfVZRdm6VO9c4hkjXmFYG.iy5zbTVOaxJLcOJcEEK',160),
(4,'RAC000B',30,'COASTER','$2b$10$GU43Sq7MsgXYOzi01Jncwef2YMSY.pESiT80/Qlm2zlS.6DEOmoRq',160),
(5,'RAB839L',30,'COASTER','$2b$10$MZTVrjQa4NyhemdPknjQhujlLDnQq8.zUFQ9SNiIINBQ3bs8cEVcu',160),
(6,'RAC951Y',50,'COASTER','$2b$10$K3DVoirg3kPX0TtTJF6p0eyEs5Tr5Z0ofcsx4mLjyxL.EAQXBvFX6',160),
(7,'RAD873G',40,'COASTER','$2b$10$7rDoSKqH3Riq6Rx9RhK7KuhrE5nv5qYfl0gumrUl6GR7QA9HNXk/2',160);
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `companyID` int(11) NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `companyLocation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`companyID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES
(0,NULL,NULL),
(160,'VOLCANO','Kigali'),
(306,'RITCO','Kigali'),
(538,'PEAPER','Kigali'),
(648,'GORILLA','Musanze'),
(747,'xzcxzc','Musanze'),
(897,'KivuBelt','Rubavu'),
(956,'DELL','Musanze'),
(964,'asdsadsad','Musanze');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deliveries` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `SenderID` int(11) DEFAULT NULL,
  `TicketFormatID` int(11) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `ReceiverName` varchar(255) DEFAULT NULL,
  `ReceiverPhone` varchar(15) DEFAULT NULL,
  `DeliveryDate` date DEFAULT NULL,
  `TimeForDelivery` time DEFAULT NULL,
  `timePaid` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ID`),
  KEY `SenderID` (`SenderID`),
  KEY `TicketFormatID` (`TicketFormatID`),
  CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`SenderID`) REFERENCES `users` (`id`),
  CONSTRAINT `deliveries_ibfk_2` FOREIGN KEY (`TicketFormatID`) REFERENCES `ticketformats` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

LOCK TABLES `deliveries` WRITE;
/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
INSERT INTO `deliveries` VALUES
(2,24,1,'Egg 10 10','Muhirwa Romain','+250791826733','2023-09-30','12:30:00','2023-09-19 06:45:12'),
(3,24,1,'Eggs 4 10, Banana 5 10','Muhirwa Romain','+250791826732','2023-09-30','12:30:00','2023-09-19 06:45:12'),
(4,24,1,'Egg 10 10','Muhirwa Romain','+250791826733','2023-09-30','12:30:00','2023-09-19 06:45:12'),
(9,24,1,'Egg 10 10','Muhirwa Romain','+250791826733','2023-09-30','15:00:00','2023-09-19 06:45:12'),
(10,24,1,'Eggs 4 10, Banana 30 30','Muhirwa Romain','+250791826732','2023-09-30','16:00:00','2023-09-19 08:05:23'),
(11,24,1,'Eggs 4 10','Igor Roggy','0791816733','2023-09-30','16:00:00','2023-09-19 08:11:05'),
(12,24,2,'Phones 10 10, Banana 20 30, Pens 0.1 20','Muhirwa Romain','+250791826732','2023-09-30','00:10:00','2023-09-19 09:22:38'),
(13,24,2,'Phones 10 10, Banana 30 30, Pens 0.1 20','Muhirwa Romain','+250791826732','2023-09-30','00:10:00','2023-09-19 09:27:12'),
(14,5,7,'Phones 222 10','one piece red','+250791826732','2023-10-02','17:00:00','2023-09-21 10:24:49'),
(15,5,1,'Chicken 5 1, Rice 20 1','Muhirwa Romain','+250791826732','2023-10-04','16:00:00','2023-09-21 13:28:50'),
(16,6,1,'Bag_of_Rice 30 1','Muhirwa Romain','+250791826732','2023-10-04','16:00:00','2023-09-22 05:55:50'),
(17,6,3,'Bag_of_Rice 20 1','Muhirwa Romain','+250791826732','2023-10-06','12:30:00','2023-09-26 14:32:49');
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_name` varchar(255) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES
(1,'KIGALI'),
(2,'RWAMAGANA'),
(3,'MUSANZE'),
(4,'NYANZA'),
(5,'RUBAVU');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stations` (
  `station_id` int(11) NOT NULL,
  `station_name` varchar(255) NOT NULL,
  `station_location` int(11) DEFAULT NULL,
  PRIMARY KEY (`station_id`),
  KEY `station_location` (`station_location`),
  CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`station_location`) REFERENCES `locations` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES
(1,'NYABUGOGO BUS STATION',1),
(2,'DOWNTOWN BUS STATION',1),
(3,'MUSANZE BUS STATION',3),
(4,'RWAMAGANA BUS STATION',2),
(5,'NYANZA BUS STATION',4),
(6,'RUBAVU BUS STATION',5);
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticketassignments`
--

DROP TABLE IF EXISTS `ticketassignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticketassignments` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `boughtTicketID` int(11) DEFAULT NULL,
  `busID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `boughtTicketID` (`boughtTicketID`),
  KEY `busID` (`busID`),
  CONSTRAINT `ticketassignments_ibfk_1` FOREIGN KEY (`boughtTicketID`) REFERENCES `boughttickets` (`id`),
  CONSTRAINT `ticketassignments_ibfk_2` FOREIGN KEY (`busID`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketassignments`
--

LOCK TABLES `ticketassignments` WRITE;
/*!40000 ALTER TABLE `ticketassignments` DISABLE KEYS */;
INSERT INTO `ticketassignments` VALUES
(1,711,4),
(2,712,3),
(3,684,3),
(4,712,1),
(5,710,1),
(6,711,1),
(7,710,4),
(8,711,4),
(9,712,4),
(10,710,4),
(11,711,4),
(12,712,4),
(13,684,7),
(14,685,7);
/*!40000 ALTER TABLE `ticketassignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticketformats`
--

DROP TABLE IF EXISTS `ticketformats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticketformats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `originLocation` int(11) DEFAULT NULL,
  `destinationLocation` int(11) DEFAULT NULL,
  `ticketTime` time NOT NULL,
  `distance` float NOT NULL,
  `duration` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `companyID` int(11) DEFAULT NULL,
  `plaqueNumber` varchar(50) DEFAULT 'RAC123B',
  `maxSeats` int(11) DEFAULT 30,
  PRIMARY KEY (`id`),
  KEY `originLocation` (`originLocation`),
  KEY `destinationLocation` (`destinationLocation`),
  CONSTRAINT `ticketformats_ibfk_1` FOREIGN KEY (`originLocation`) REFERENCES `locations` (`location_id`),
  CONSTRAINT `ticketformats_ibfk_2` FOREIGN KEY (`destinationLocation`) REFERENCES `locations` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketformats`
--

LOCK TABLES `ticketformats` WRITE;
/*!40000 ALTER TABLE `ticketformats` DISABLE KEYS */;
INSERT INTO `ticketformats` VALUES
(1,1,3,'15:00:00',5000,60,5000.00,160,'RAC123B',30),
(2,3,4,'23:00:00',5000,70,6000.00,160,'RAC390B',30),
(3,2,1,'12:00:00',30,30,7000.00,160,'RAC951Y',30),
(4,2,4,'15:32:00',50,60,5000.00,897,'RAC345P',30),
(5,3,5,'12:43:00',50,60,5000.00,306,'RAC593F',30),
(7,3,5,'16:00:00',5,60,6000.00,160,'RAC223D',60),
(8,5,3,'16:00:00',5,70,7000.00,160,'RAC123B',30),
(11,4,2,'03:00:00',60,120,7000.00,160,'RAC000B',30),
(14,4,5,'16:00:00',59,60,7000.00,160,'RAC123B',30),
(15,4,1,'13:00:00',60,60,8000.00,160,'RAB839L',30),
(16,5,1,'21:00:00',70,60,7500.00,160,'RAC723T',40);
/*!40000 ALTER TABLE `ticketformats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `nationalID` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `companyID` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_company` (`companyID`),
  CONSTRAINT `fk_company` FOREIGN KEY (`companyID`) REFERENCES `companies` (`companyID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'John','Doe','dslnnalsd@gmail.com','0788000000','100000000000000','$2b$10$Iv9f3E/3UWRIe83WN0QpAu9INx3RWJ/wkVuvGyMNpdZN558r1r8m2','CUSTOMER',0),
(2,'John','Doe','dsasdadsdsasdald@gmail.com','0792555555','650000006000000','$2b$10$KbgygozsEaE2748LTtXar.WgF9s9DsAQCqfgzqPoNQ5.hwAw4Nc4e','CUSTOMER',0),
(4,'John','Doe','sadsadas@gmail.com','0788006000','100000000000600','$2b$10$ne7uavIMDChbSUxniFMGNu/gVo1IbesC7GdeajX1fNY54.8.k3PAC','CUSTOMER',0),
(5,'Igor','Roggy','rwagapfizi04@gmail.com','+250791826733','990000000000000','$2b$10$BoZi6jfsJVWN3Po82J624OdU/WBecmaku9epyE2u8Sgd4vhj7S03S','CUSTOMER',0),
(6,'Yohana','Doe','rwagapfizi10@gmail.com','+250791826733','650000000000000','$2b$10$K6cONm1eqnvunvMpDzya0O7VvcM.h4F2tRixbOfFlXaR4D4c0.oR6','WORKER',160),
(7,'Gisa','Teta','demo123@gmail.com','0791885346','900000000000000','$2b$10$M54WsDJ.Ovg8ZLGgzULue.esniHeDqGwX3NhWuYlEpogrZT7gLnpi','CUSTOMER',0),
(12,'Jane','Doella','abc123@gmail.com','0795100000','963000000000000','$2b$10$ocdlu3KO/S3nl1yCjyHQleSUwc7NuaU871gxv5C3vx9Ccxn.UxiX6','WORKER',306),
(13,'Igor','Roggy','rwagapfiziroggy@gmail.com','0791826733','100000000200800','$2b$10$dgtAJ3EsPM5TdUXZyIXHC.MWpPWkiom.4rj34UAupd9cOpvQEm2L.','CUSTOMER',0),
(23,'John','Doeeoe','wakawaka@gmail.com','+250791826733','1000100002008004','$2b$10$L0pCgCajUrIcONd3SKwygeXorJvYiZWw7tiRV9bXfqHvf7luUna.e','WORKER',160),
(24,'Igor','Roggy','rwagapfizi@gmail.com','+250791826733','1240100022008004','$2b$10$fe/oytO.p3ddSrJG4..z6O5YRiPsvfrms8yyj9xt9xsPHQCjsZujq','CUSTOMER',0),
(26,'Mugabo','Romain','abcdef@gmail.com','+250781149892','1234567890123456','$2b$10$tizDvMt4dJflYBA8qQYxAeKPV/O9BwKTPGi4fOUvrgBmwI92NBrK2','CUSTOMER',0),
(27,'romain','muhirwa','romainmuhirwa3@gmail.com','+250791174883','9876543210123456','$2b$10$oNKFQqUOkwvidCpVOn0OzeWiGyt74PRdmJyHCOdRd.lR8CBOXYF9C','CUSTOMER',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-02 20:47:20
