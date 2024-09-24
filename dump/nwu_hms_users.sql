-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: nwu_hms
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` char(6) NOT NULL,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phoneNum` varchar(10) NOT NULL,
  `userType` enum('Student','Lecturer','Admin') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `refreshToken` varchar(255) DEFAULT NULL,
  `resetCode` varchar(6) DEFAULT NULL,
  `codeExpiry` bigint DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'267767','Jason','Erasmus','$2a$10$ZYJNzkP5DN/j2npKQEcvD.IT2m3vNMrpizwv0VdWykz.Qfh/uEq4q','42811074@mynwu.ac.za','0796946727','Admin','2024-08-19 17:02:49','2024-09-23 23:33:38','$2a$10$NPHkzbD.HqLGIESD1J7zueq6q0CjvUN1vLl7Ox6tzBKBnTH0TM9eC',NULL,NULL,NULL),(2,'254592','Bob','Stevens','$2a$10$yEr/bvOHQhRyz06YiRgREeuGb1U0Wxr8.kEur5lmvJf.coUL2T/m2','254592@mynwu.ac.za','0846942157','Student','2024-08-26 10:56:02','2024-09-23 22:13:01',NULL,NULL,NULL,NULL),(3,'791253','Mark','Hemsworth','$2a$10$OUb5nN3hM/TkUaAGUEOCIuZe8DD9u7Z/7cMra1y.WNJRVLoGsCGF2','791253@mynwu.ac.za','0742346547','Lecturer','2024-08-26 11:10:42','2024-09-23 17:50:47','$2a$10$g6LYG3Gw7uS4m1BwqjZtb.hifGqOh088/qC46IOSiuXVyuqNYnduu',NULL,NULL,NULL),(7,'318863','Even','Smith','$2a$10$hCexppwgMYRBumuVaZzaqeAXMl/eZJ4jk28zs1cgdPUHBO7CIU5.i','318863@mynwu.ac.za','0756782113','Student','2024-08-26 11:38:43','2024-09-22 11:20:11',NULL,NULL,NULL,NULL),(8,'954550','Diana','Stark','$2a$10$9Gl2soQafhZWWKxgJNqRoeFk4gG8K65jJNPndliF5FgFm4cB9hIJO','954550@mynwu.ac.za','0763214566','Lecturer','2024-08-26 12:02:40','2024-08-26 12:02:40',NULL,NULL,NULL,NULL);
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

-- Dump completed on 2024-09-24 10:07:41
