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
  `profilePicture` varchar(255) DEFAULT 'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg',
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'267767','Jason','Erasmus','$2a$10$ZYJNzkP5DN/j2npKQEcvD.IT2m3vNMrpizwv0VdWykz.Qfh/uEq4q','42811074@mynwu.ac.za','0796946722','Admin','2024-08-19 17:02:49','2024-09-27 10:57:30',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/EGCZYqxbpjXcMnG/download/1727390223180-logo.jpeg'),(2,'254592','Bob','Stevens','$2a$10$yEr/bvOHQhRyz06YiRgREeuGb1U0Wxr8.kEur5lmvJf.coUL2T/m2','254592@mynwu.ac.za','0846942157','Student','2024-08-26 10:56:02','2024-09-27 10:58:08','$2a$10$RQ7HSYgvx0EEUBRD8FkcIOmXI9Ufbpo2hUlZnyGXA/dIXhUckS2N6',NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(3,'791253','Mark','Hemsworth','$2a$10$OUb5nN3hM/TkUaAGUEOCIuZe8DD9u7Z/7cMra1y.WNJRVLoGsCGF2','791253@mynwu.ac.za','0742346547','Lecturer','2024-08-26 11:10:42','2024-09-27 10:23:42','',NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(7,'318863','Even','Smith','$2a$10$hCexppwgMYRBumuVaZzaqeAXMl/eZJ4jk28zs1cgdPUHBO7CIU5.i','318863@mynwu.ac.za','0756782113','Student','2024-08-26 11:38:43','2024-09-27 10:23:26',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(8,'954550','Diana','Stark','$2a$10$9Gl2soQafhZWWKxgJNqRoeFk4gG8K65jJNPndliF5FgFm4cB9hIJO','954550@mynwu.ac.za','0763214566','Lecturer','2024-08-26 12:02:40','2024-09-27 10:23:26',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(13,'992339','Emily','Johnson','$2a$10$qPnalOH89HRgGYEu/T25zelFlGr69jAE7a6vU4nNKtt9.2zfUHki.','992339@mynwu.ac.za','0630123456','Student','2024-09-27 10:22:39','2024-09-27 10:31:45',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(14,'242196','Michael','Smith','$2a$10$mZsdIVozzcG7rbJoReCF6.zjaU0gMZS5KtHwJ2LJ5JeSy87uoCUPu','242196@mynwu.ac.za','0829012345','Student','2024-09-27 10:24:17','2024-09-27 10:31:45',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(15,'492733','Sarah','Williams','$2a$10$ny.cbFhjlTc5U7XcUxm6Qe.R8Rsst.2rJBOUvkLH4uguqfrTPjmoK','492733@mynwu.ac.za','0718901234','Student','2024-09-27 10:24:37','2024-09-27 10:31:45',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(16,'989976','David','Brown','$2a$10$92X0mavjjd8pLdYlxdU05eMfW7bovorNA7WXcgw6ohXeuPZNebDfy','989976@mynwu.ac.za','0767890123','Student','2024-09-27 10:24:55','2024-09-27 10:31:45',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(17,'235716','Jessica','Davis','$2a$10$U6bUdTHruud15zeWTjmqgO6JQXt8HNYCnZ3rHsN4Tg58CFAYICJea','235716@mynwu.ac.za','0656789012','Student','2024-09-27 10:25:14','2024-09-27 10:31:45',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(18,'419657','Daniel','Garcia','$2a$10$CQ3UlbkBgxxOzlYMmzHbLuB/kdj1QKUih9LSv2htnAyVQTAHnpsbq','419657@mynwu.ac.za','0845678901','Student','2024-09-27 10:25:33','2024-09-27 10:31:45',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(19,'670951','Laura','Martinez','$2a$10$VrkLDkUfRs/36rq9SPy0ouvmFOWuFap86DXN8gP1lQXAkPZhflJhq','670951@mynwu.ac.za','0734567890','Student','2024-09-27 10:25:55','2024-09-27 10:31:45',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(20,'261545','Thandiwe','Nkosi','$2a$10$Pb.9xQWJ9nkSctKeqC/d8OiORDqKX9nqSauOBKZBF1UNidhHOlT/u','261545@mynwu.ac.za','0712345678','Student','2024-09-27 10:26:43','2024-09-27 10:26:43',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(21,'712981','Sipho','Mthembu','$2a$10$/ablSnw0j6ET3gCnOyqbrOTI2BoYdJyUnuL7yZsO0rggDF6Z1FQCC','712981@mynwu.ac.za','0823456789','Lecturer','2024-09-27 10:27:05','2024-09-27 10:27:05',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg'),(22,'354208','Prof. Jan','Pretorius','$2a$10$br0e3P3n6ZdfdoGJ4LLL3u36KcDzcM5XXwENhz7r.2VKe1nOE13nq','354208@mynwu.ac.za','0741234567','Lecturer','2024-09-27 10:28:05','2024-09-27 10:28:05',NULL,NULL,NULL,'https://mia.nl.tab.digital/s/C7jzxcrN6nqkTTb/download/default-profile.jpg');
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

-- Dump completed on 2024-09-27 13:02:56
