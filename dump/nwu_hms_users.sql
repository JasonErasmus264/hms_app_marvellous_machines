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
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'267767','Jason','Erasmus','$2b$10$nL0uMUaTU4g4YMafLsf9nuHGqjzsmUh/.OdaK0NPOHJE5l9St8.yW','jason@example.com','0796946727','Admin','2024-08-19 17:02:49','2024-09-17 14:28:03','$2a$10$vZBFNkHV2JHIP0yIjdVUEOc7TSSzcY4rK00dGhTdlaqWUb5760Eyu'),(2,'254592','Bob','Stevens','$2a$10$u5PWa2B4ZNoAPyGp9PVcJ.BdupiACzOy.OplgmifE6W/IRHONS8eW','254592@mynwu.ac.za','0846942157','Student','2024-08-26 10:56:02','2024-09-13 13:32:44','$2a$10$Su8TZCiDJKUUnhTPkTLz.OcwVmoPkH2i1UNXuVsJf0yK6ZNnf27BK'),(3,'791253','Mark','Hemsworth','$2a$10$OUb5nN3hM/TkUaAGUEOCIuZe8DD9u7Z/7cMra1y.WNJRVLoGsCGF2','791253@mynwu.ac.za','0742346547','Lecturer','2024-08-26 11:10:42','2024-08-26 11:10:42',NULL),(7,'318863','Even','Smith','$2a$10$hCexppwgMYRBumuVaZzaqeAXMl/eZJ4jk28zs1cgdPUHBO7CIU5.i','318863@mynwu.ac.za','0756782113','Student','2024-08-26 11:38:43','2024-08-26 11:39:58','$2a$10$ej0xchtxohbMI.CTsBmu2u4l33QzfPGT1ERxuaQC11H4v9cbKZQRe'),(8,'954550','Diana','Stark','$2a$10$9Gl2soQafhZWWKxgJNqRoeFk4gG8K65jJNPndliF5FgFm4cB9hIJO','954550@mynwu.ac.za','0763214566','Lecturer','2024-08-26 12:02:40','2024-08-26 12:02:40',NULL);
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

-- Dump completed on 2024-09-18 10:59:45
