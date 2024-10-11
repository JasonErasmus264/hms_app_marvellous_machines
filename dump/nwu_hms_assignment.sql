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
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment` (
  `assignmentID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `moduleID` int NOT NULL,
  `assignName` varchar(50) NOT NULL,
  `assignDesc` varchar(10000) NOT NULL,
  `assignOpenDate` datetime NOT NULL,
  `assignDueDate` datetime NOT NULL,
  `assignTotalMarks` decimal(5,2) NOT NULL,
  `assignCreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `assignUpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignmentID`),
  KEY `userID_idx` (`userID`),
  KEY `moduleID_idx` (`moduleID`),
  CONSTRAINT `assignModuleID` FOREIGN KEY (`moduleID`) REFERENCES `module` (`moduleID`) ON DELETE CASCADE,
  CONSTRAINT `assignUserID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
INSERT INTO `assignment` VALUES (1,1,1,'Pushups','Record yourself doing pushups over a period of time and track the resaults.','2024-09-01 04:00:00','2024-11-01 15:00:00',100.00,'2024-09-01 19:40:26','2024-10-09 18:24:03'),(2,3,1,'Situps','Record yourself doing situps','2024-11-01 08:00:00','2024-11-08 23:00:00',30.00,'2024-09-02 12:58:23','2024-09-09 20:46:31'),(7,1,1,'Muscular Strength Analysis','Submit a video of yourself performing a 1-repetition max (1RM) test for a major compound lift (e.g., bench press, squat, or deadlift).','2024-10-09 17:11:00','2024-11-05 17:11:00',100.00,'2024-09-22 19:11:55','2024-10-10 11:19:12'),(11,1,2,'Cardiovascular Endurance Assessment','Perform a 12-minute Cooper Test on a flat track.\n\nRecord the distance you cover during this time, and submit a video demonstrating your performance. \n\nInclude a written reflection on how you felt before, during, and after the test, and explain the importance of cardiovascular endurance in overall fitness.','2024-09-30 10:45:00','2024-10-09 10:46:00',100.00,'2024-09-27 10:46:03','2024-09-27 10:46:03');
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-11 21:38:39
