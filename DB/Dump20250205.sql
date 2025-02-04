CREATE DATABASE  IF NOT EXISTS `lagona_express` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `lagona_express`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: lagona_express
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `admin_user`
--

DROP TABLE IF EXISTS `admin_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_user` (
  `au_user_id` int NOT NULL AUTO_INCREMENT,
  `au_admin_id` int NOT NULL,
  `au_user_name` varchar(255) NOT NULL,
  `au_password` varchar(255) NOT NULL,
  `au_role` varchar(50) NOT NULL,
  `au_otp` longtext,
  `au_otp_valid` datetime DEFAULT NULL,
  `au_forgotpass_token` longtext,
  `au_forgotpass_exp` datetime DEFAULT NULL,
  `au_user_status` varchar(255) NOT NULL,
  PRIMARY KEY (`au_user_id`),
  KEY `au_admin_id` (`au_admin_id`),
  CONSTRAINT `admin_user_ibfk_1` FOREIGN KEY (`au_admin_id`) REFERENCES `master_admin` (`ma_admin_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user`
--

LOCK TABLES `admin_user` WRITE;
/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;
INSERT INTO `admin_user` VALUES (1,1,'admin','7a230f308a8d2056813affcc0ae3d3b5','Admin','789','2025-01-14 00:00:00','789','2025-01-14 00:00:00','Active');
/*!40000 ALTER TABLE `admin_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_address`
--

DROP TABLE IF EXISTS `customer_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_address` (
  `ca_address_id` int NOT NULL AUTO_INCREMENT,
  `ca_customer_id` int NOT NULL,
  `ca_address` longtext,
  `ca_geo_code` longtext,
  `ca_latitude` longtext,
  `ca_longitude` longtext,
  `ca_type` varchar(255) NOT NULL,
  `ca_status` varchar(255) NOT NULL,
  `ca_create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`ca_address_id`),
  KEY `ca_customer_id` (`ca_customer_id`),
  CONSTRAINT `customer_address_ibfk_1` FOREIGN KEY (`ca_customer_id`) REFERENCES `master_customer` (`mc_customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_address`
--

LOCK TABLES `customer_address` WRITE;
/*!40000 ALTER TABLE `customer_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_cart`
--

DROP TABLE IF EXISTS `customer_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_cart` (
  `cc_cart_id` int NOT NULL AUTO_INCREMENT,
  `cc_customer_id` int NOT NULL,
  `cc_product_id` int NOT NULL,
  `cc_merchant_id` int NOT NULL,
  `cc_cart_qty` int DEFAULT NULL,
  `cc_cart_order_type` int DEFAULT NULL,
  `cc_create_date` datetime DEFAULT NULL,
  `cc_cart_status` varchar(255) NOT NULL,
  PRIMARY KEY (`cc_cart_id`),
  KEY `cc_customer_id` (`cc_customer_id`),
  KEY `cc_product_id` (`cc_product_id`),
  KEY `cc_merchant_id` (`cc_merchant_id`),
  CONSTRAINT `customer_cart_ibfk_1` FOREIGN KEY (`cc_customer_id`) REFERENCES `master_customer` (`mc_customer_id`),
  CONSTRAINT `customer_cart_ibfk_2` FOREIGN KEY (`cc_product_id`) REFERENCES `master_product` (`mp_product_id`),
  CONSTRAINT `customer_cart_ibfk_3` FOREIGN KEY (`cc_merchant_id`) REFERENCES `master_merchant` (`mm_merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_cart`
--

LOCK TABLES `customer_cart` WRITE;
/*!40000 ALTER TABLE `customer_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hub_reload_history`
--

DROP TABLE IF EXISTS `hub_reload_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hub_reload_history` (
  `hrh_history_id` int NOT NULL AUTO_INCREMENT,
  `hrh_reload_id` int NOT NULL,
  `hrh_amount` decimal(10,2) DEFAULT NULL,
  `hrh_status` varchar(255) NOT NULL,
  `hrh_create_date` datetime DEFAULT NULL,
  `hrh_create_by` varchar(255) NOT NULL,
  PRIMARY KEY (`hrh_history_id`),
  KEY `hrh_reload_id` (`hrh_reload_id`),
  CONSTRAINT `hub_reload_history_ibfk_1` FOREIGN KEY (`hrh_reload_id`) REFERENCES `hub_station_reload` (`hsr_reload_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hub_reload_history`
--

LOCK TABLES `hub_reload_history` WRITE;
/*!40000 ALTER TABLE `hub_reload_history` DISABLE KEYS */;
INSERT INTO `hub_reload_history` VALUES (4,4,500.00,'Credited','2025-02-05 00:49:29','System'),(5,5,1000.00,'Credited','2025-02-05 00:51:53','System'),(6,6,200.00,'Credited','2025-02-05 00:53:16','System'),(7,7,50.00,'Credited','2025-02-05 01:18:58','System'),(8,8,50.00,'Credited','2025-02-05 01:18:58','System'),(9,9,50.00,'Credited','2025-02-05 01:18:58','System'),(10,10,50.00,'Credited','2025-02-05 01:18:59','System'),(11,11,50.00,'Credited','2025-02-05 01:18:59','System'),(12,12,50.00,'Credited','2025-02-05 01:18:59','System'),(13,13,50.00,'Credited','2025-02-05 01:18:59','System'),(14,14,50.00,'Credited','2025-02-05 01:18:59','System'),(15,15,50.00,'Credited','2025-02-05 01:18:59','System'),(16,16,50.00,'Credited','2025-02-05 01:19:00','System'),(17,17,50.00,'Credited','2025-02-05 01:19:00','System'),(18,18,10.00,'Credited','2025-02-05 01:28:37','System'),(19,19,10.00,'Credited','2025-02-05 01:28:38','System'),(20,20,10.00,'Credited','2025-02-05 01:32:19','System'),(21,21,1.00,'Credited','2025-02-05 01:34:02','System'),(22,22,2.00,'Credited','2025-02-05 01:34:09','System'),(23,23,3.00,'Credited','2025-02-05 01:34:16','System'),(24,24,0.50,'Credited','2025-02-05 01:38:16','System');
/*!40000 ALTER TABLE `hub_reload_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hub_station_reload`
--

DROP TABLE IF EXISTS `hub_station_reload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hub_station_reload` (
  `hsr_reload_id` int NOT NULL AUTO_INCREMENT,
  `hsr_hub_station_id` int NOT NULL,
  `hsr_reference_code` varchar(255) NOT NULL,
  `hsr_amount` decimal(10,2) DEFAULT NULL,
  `hsr_attachment` longtext,
  `hsr_reload_status` varchar(255) DEFAULT NULL,
  `hsr_create_date` datetime DEFAULT NULL,
  `hsr_date_response` datetime DEFAULT NULL,
  PRIMARY KEY (`hsr_reload_id`),
  KEY `hsr_hub_station_id` (`hsr_hub_station_id`),
  CONSTRAINT `hub_station_reload_ibfk_1` FOREIGN KEY (`hsr_hub_station_id`) REFERENCES `master_hub_station` (`msh_hub_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hub_station_reload`
--

LOCK TABLES `hub_station_reload` WRITE;
/*!40000 ALTER TABLE `hub_station_reload` DISABLE KEYS */;
INSERT INTO `hub_station_reload` VALUES (4,1,'SOUL8XENHB',500.00,NULL,'Credited','2025-02-05 00:49:00','2025-02-05 00:49:00'),(5,1,'J1X2JSE6B7',1000.00,NULL,'Credited','2025-02-05 00:51:00','2025-02-05 00:51:00'),(6,1,'SCNBHPSJAV',200.00,NULL,'Credited','2025-02-05 00:53:00','2025-02-05 00:53:00'),(7,1,'9C9II47S7F',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(8,1,'PZAO2PJ3IO',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(9,1,'MM8WNEY139',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(10,1,'IRFP4SG2SN',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(11,1,'HJSWMUU8R3',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(12,1,'X0084ZXVPF',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(13,1,'0XWGDTEKH5',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(14,1,'3EXDRHHWIW',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(15,1,'HIEZ4VKQZT',50.00,NULL,'Credited','2025-02-05 01:18:00','2025-02-05 01:18:00'),(16,1,'B2LW9790WI',50.00,NULL,'Credited','2025-02-05 01:19:00','2025-02-05 01:19:00'),(17,1,'3Z60TU5T60',50.00,NULL,'Credited','2025-02-05 01:19:00','2025-02-05 01:19:00'),(18,1,'B5UJHF446X',10.00,NULL,'Credited','2025-02-05 01:28:00','2025-02-05 01:28:00'),(19,1,'S84A659U8K',10.00,NULL,'Credited','2025-02-05 01:28:00','2025-02-05 01:28:00'),(20,1,'JJMA0YGMAW',10.00,NULL,'Credited','2025-02-05 01:32:00','2025-02-05 01:32:00'),(21,1,'G3XM0BATQL',1.00,NULL,'Credited','2025-02-05 01:34:00','2025-02-05 01:34:00'),(22,1,'V5AALFYRI7',2.00,NULL,'Credited','2025-02-05 01:34:00','2025-02-05 01:34:00'),(23,1,'45TRU947F0',3.00,NULL,'Credited','2025-02-05 01:34:00','2025-02-05 01:34:00'),(24,1,'OAVCJEGPI2',0.50,NULL,'Credited','2025-02-05 01:38:00','2025-02-05 01:38:00');
/*!40000 ALTER TABLE `hub_station_reload` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `hub_station_reload_AFTER_INSERT` AFTER INSERT ON `hub_station_reload` FOR EACH ROW BEGIN
    DECLARE new_status VARCHAR(20);

    -- Determine status based on hsr_amount
    SET new_status = CASE 
                        WHEN NEW.hsr_amount > 0 THEN 'Credited' 
                        ELSE 'Not Credited' 
                    END;

    -- Insert into hub_reload_history
    INSERT INTO hub_reload_history (hrh_reload_id, hrh_amount, hrh_status, hrh_create_date, hrh_create_by)
    VALUES (NEW.hsr_reload_id, NEW.hsr_amount, new_status, NOW(), 'System');

    -- If status is 'Credited', add hsr_amount to master_hub_station
    IF new_status = 'Credited' THEN
        UPDATE master_hub_station
        SET msh_budget = msh_budget + NEW.hsr_amount
        WHERE msh_hub_id = NEW.hsr_hub_station_id;
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `load_reload_history`
--

DROP TABLE IF EXISTS `load_reload_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `load_reload_history` (
  `lrh_history_id` int NOT NULL AUTO_INCREMENT,
  `lrh_reload_id` int NOT NULL,
  `lrh_amount` decimal(10,2) DEFAULT NULL,
  `lrh_status` varchar(255) NOT NULL,
  `lrh_create_date` datetime DEFAULT NULL,
  `lrh_create_by` varchar(255) NOT NULL,
  PRIMARY KEY (`lrh_history_id`),
  KEY `lrh_reload_id` (`lrh_reload_id`),
  CONSTRAINT `load_reload_history_ibfk_1` FOREIGN KEY (`lrh_reload_id`) REFERENCES `hub_station_reload` (`hsr_reload_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `load_reload_history`
--

LOCK TABLES `load_reload_history` WRITE;
/*!40000 ALTER TABLE `load_reload_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `load_reload_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `load_station_reload`
--

DROP TABLE IF EXISTS `load_station_reload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `load_station_reload` (
  `lsr_reload_id` int NOT NULL AUTO_INCREMENT,
  `lsr_load_station_id` int NOT NULL,
  `lsr_amount` decimal(10,2) DEFAULT NULL,
  `lsr_attachment` longtext,
  `lsr_reload_status` varchar(255) NOT NULL,
  `lsr_create_date` datetime DEFAULT NULL,
  `lsr_date_response` datetime DEFAULT NULL,
  PRIMARY KEY (`lsr_reload_id`),
  KEY `lsr_load_station_id` (`lsr_load_station_id`),
  CONSTRAINT `load_station_reload_ibfk_1` FOREIGN KEY (`lsr_load_station_id`) REFERENCES `master_load_station` (`mls_station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `load_station_reload`
--

LOCK TABLES `load_station_reload` WRITE;
/*!40000 ALTER TABLE `load_station_reload` DISABLE KEYS */;
/*!40000 ALTER TABLE `load_station_reload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_admin`
--

DROP TABLE IF EXISTS `master_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_admin` (
  `ma_admin_id` int NOT NULL AUTO_INCREMENT,
  `ma_image` longtext,
  `ma_first_name` varchar(255) NOT NULL,
  `ma_middle_name` varchar(255) NOT NULL,
  `ma_last_name` varchar(255) NOT NULL,
  `ma_mobile_no` varchar(255) NOT NULL,
  `ma_email` varchar(255) NOT NULL,
  `ma_create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `ma_create_by` varchar(255) NOT NULL,
  `ma_status` varchar(255) NOT NULL,
  PRIMARY KEY (`ma_admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_admin`
--

LOCK TABLES `master_admin` WRITE;
/*!40000 ALTER TABLE `master_admin` DISABLE KEYS */;
INSERT INTO `master_admin` VALUES (1,NULL,'Sample','','Admin','0923658961','admin@gmail.com','2024-12-21 00:00:00','Admin','Active');
/*!40000 ALTER TABLE `master_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_customer`
--

DROP TABLE IF EXISTS `master_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_customer` (
  `mc_customer_id` int NOT NULL AUTO_INCREMENT,
  `mc_first_name` varchar(255) NOT NULL,
  `mc_middle_name` varchar(255) NOT NULL,
  `mc_last_name` varchar(255) NOT NULL,
  `mc_valid_id` longtext,
  `mc_email` varchar(255) NOT NULL,
  `mc_username` varchar(255) NOT NULL,
  `mc_password` varchar(255) NOT NULL,
  `mc_mobile` varchar(255) NOT NULL,
  `mc_otp` longtext,
  `mc_otp_valid` datetime DEFAULT NULL,
  `mc_forgot_pass_token` longtext,
  `mc_forgot_pass_exp` datetime DEFAULT NULL,
  `mc_create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`mc_customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_customer`
--

LOCK TABLES `master_customer` WRITE;
/*!40000 ALTER TABLE `master_customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `master_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_hub_station`
--

DROP TABLE IF EXISTS `master_hub_station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_hub_station` (
  `msh_hub_id` int NOT NULL AUTO_INCREMENT,
  `msh_hub_name` varchar(255) NOT NULL,
  `msh_hub_code` varchar(255) NOT NULL,
  `msh_owner_name` varchar(255) NOT NULL,
  `msh_hub_address` varchar(255) NOT NULL,
  `msh_phone_number` varchar(255) NOT NULL,
  `msh_email` varchar(255) NOT NULL,
  `msh_budget` decimal(10,2) DEFAULT NULL,
  `msh_username` varchar(255) NOT NULL,
  `msh_password` text NOT NULL,
  `msh_otp` varchar(255) DEFAULT NULL,
  `msh_forgot_pass_token` longtext,
  `msh_forgot_pass_exp` datetime DEFAULT NULL,
  `msh_status` varchar(255) NOT NULL,
  `msh_create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`msh_hub_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_hub_station`
--

LOCK TABLES `master_hub_station` WRITE;
/*!40000 ALTER TABLE `master_hub_station` DISABLE KEYS */;
INSERT INTO `master_hub_station` VALUES (1,'Wendell Hub','O38P3','Wendell','Sampl Address','Existing Phone Number','sample@gmail.com',102286.50,'samplehubuser','manasarias',NULL,NULL,NULL,'Active','2025-02-04 22:05:00');
/*!40000 ALTER TABLE `master_hub_station` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_load_station`
--

DROP TABLE IF EXISTS `master_load_station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_load_station` (
  `mls_station_id` int NOT NULL AUTO_INCREMENT,
  `mls_load_name` varchar(255) NOT NULL,
  `mls_load_code` varchar(255) NOT NULL,
  `mls_owner_name` varchar(255) NOT NULL,
  `mls_load_address` varchar(255) NOT NULL,
  `mls_phone_number` varchar(255) NOT NULL,
  `mls_email` varchar(255) NOT NULL,
  `mls_budget` decimal(10,2) DEFAULT NULL,
  `mls_username` varchar(255) NOT NULL,
  `mls_password` text,
  `mls_otp` varchar(255) NOT NULL,
  `mls_forgot_pass_token` longtext,
  `mls_forgot_pass_exp` datetime DEFAULT NULL,
  `mls_status` varchar(255) NOT NULL,
  `mls_create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`mls_station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_load_station`
--

LOCK TABLES `master_load_station` WRITE;
/*!40000 ALTER TABLE `master_load_station` DISABLE KEYS */;
/*!40000 ALTER TABLE `master_load_station` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_merchant`
--

DROP TABLE IF EXISTS `master_merchant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_merchant` (
  `mm_merchant_id` int NOT NULL AUTO_INCREMENT,
  `mm_merchant_fullname` varchar(255) NOT NULL,
  `mm_business_name` varchar(255) NOT NULL,
  `mm_business_branch` varchar(255) NOT NULL,
  `mm_merchant_address` varchar(255) NOT NULL,
  `mm_merchant_geo_code` longtext,
  `mm_latitude` longtext,
  `mm_longitude` longtext,
  `mm_mobile` varchar(255) NOT NULL,
  `mm_email` varchar(255) NOT NULL,
  `mm_username` varchar(255) NOT NULL,
  `mm_password` varchar(255) NOT NULL,
  `mm_logo` varchar(255) NOT NULL,
  `mm_payment_qr_code` longtext,
  `mm_status` varchar(255) NOT NULL,
  `mm_forgot_pass_token` longtext,
  `mm_forgot_pass_exp` datetime DEFAULT NULL,
  `mm_create_date` datetime DEFAULT NULL,
  `mm_create_by` varchar(255) NOT NULL,
  PRIMARY KEY (`mm_merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_merchant`
--

LOCK TABLES `master_merchant` WRITE;
/*!40000 ALTER TABLE `master_merchant` DISABLE KEYS */;
/*!40000 ALTER TABLE `master_merchant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_order`
--

DROP TABLE IF EXISTS `master_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_order` (
  `mo_order_id` int NOT NULL AUTO_INCREMENT,
  `mo_order_code` varchar(50) NOT NULL,
  `mo_merchant_id` int NOT NULL,
  `mo_customer_id` int NOT NULL,
  `mo_order_type` varchar(50) NOT NULL,
  `mo_order_type_charge` decimal(10,2) DEFAULT NULL,
  `mo_order_details` longtext,
  `mo_order_note` longtext,
  `mo_delivery_fee` decimal(10,2) DEFAULT NULL,
  `mo_order_fee` decimal(10,2) DEFAULT NULL,
  `mo_lagona_fee` decimal(10,2) DEFAULT NULL,
  `mo_order_total` decimal(10,2) DEFAULT NULL,
  `mo_payment_screenshots` longtext,
  PRIMARY KEY (`mo_order_id`),
  KEY `mo_merchant_id` (`mo_merchant_id`),
  KEY `mo_customer_id` (`mo_customer_id`),
  CONSTRAINT `master_order_ibfk_1` FOREIGN KEY (`mo_merchant_id`) REFERENCES `master_merchant` (`mm_merchant_id`),
  CONSTRAINT `master_order_ibfk_2` FOREIGN KEY (`mo_customer_id`) REFERENCES `master_customer` (`mc_customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_order`
--

LOCK TABLES `master_order` WRITE;
/*!40000 ALTER TABLE `master_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `master_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_product`
--

DROP TABLE IF EXISTS `master_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_product` (
  `mp_product_id` int NOT NULL AUTO_INCREMENT,
  `mp_merchant_id` int NOT NULL,
  `mp_name` varchar(255) NOT NULL,
  `mp_description` longtext,
  `mp_price` decimal(10,2) DEFAULT NULL,
  `mp_meal_type` varchar(255) NOT NULL,
  `mp_status` varchar(255) NOT NULL,
  `mp_create_date` datetime DEFAULT NULL,
  `mp_create_by` varchar(255) NOT NULL,
  `mp_product_image` longtext,
  `mp_category` varchar(255) NOT NULL,
  PRIMARY KEY (`mp_product_id`),
  KEY `mp_merchant_id` (`mp_merchant_id`),
  CONSTRAINT `master_product_ibfk_1` FOREIGN KEY (`mp_merchant_id`) REFERENCES `master_merchant` (`mm_merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_product`
--

LOCK TABLES `master_product` WRITE;
/*!40000 ALTER TABLE `master_product` DISABLE KEYS */;
/*!40000 ALTER TABLE `master_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_rider`
--

DROP TABLE IF EXISTS `master_rider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_rider` (
  `mr_rider_id` int NOT NULL AUTO_INCREMENT,
  `mr_rider_code` varchar(255) NOT NULL,
  `mr_first_name` varchar(255) NOT NULL,
  `mr_middle_name` varchar(255) NOT NULL,
  `mr_last_name` varchar(255) NOT NULL,
  `mr_mobile_number` varchar(12) NOT NULL,
  `mr_email` varchar(255) NOT NULL,
  `mr_rider_otp` longtext,
  `mr_rider_otp_valid` datetime DEFAULT NULL,
  `mr_rider_status` varchar(50) NOT NULL,
  `mr_user_name` longtext,
  `mr_password` longtext,
  `mr_rider_selfie` longtext,
  `mr_driver_license` longtext,
  `mr_OR` longtext,
  `mr_CR` longtext,
  `mr_vehicle_image` longtext,
  `mr_vehicle_type` varchar(50) NOT NULL,
  `mr_rider_account_status` varchar(50) NOT NULL,
  `mr_rider_registration_date` datetime DEFAULT NULL,
  `mr_forgot_pass_token` longtext,
  `mr_forgot_pass_exp` datetime DEFAULT NULL,
  `mr_budget` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`mr_rider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_rider`
--

LOCK TABLES `master_rider` WRITE;
/*!40000 ALTER TABLE `master_rider` DISABLE KEYS */;
/*!40000 ALTER TABLE `master_rider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details_table`
--

DROP TABLE IF EXISTS `order_details_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details_table` (
  `odt_details_id` int NOT NULL AUTO_INCREMENT,
  `odt_order_id` int NOT NULL,
  `odt_product_id` int NOT NULL,
  `odt_quantity` int NOT NULL,
  `odt_status` varchar(50) DEFAULT NULL,
  `odt_create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`odt_details_id`),
  KEY `odt_order_id` (`odt_order_id`),
  KEY `odt_product_id` (`odt_product_id`),
  CONSTRAINT `order_details_table_ibfk_1` FOREIGN KEY (`odt_order_id`) REFERENCES `master_order` (`mo_order_id`),
  CONSTRAINT `order_details_table_ibfk_2` FOREIGN KEY (`odt_product_id`) REFERENCES `master_product` (`mp_product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details_table`
--

LOCK TABLES `order_details_table` WRITE;
/*!40000 ALTER TABLE `order_details_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_riders_table`
--

DROP TABLE IF EXISTS `order_riders_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_riders_table` (
  `ort_details_rider_id` int NOT NULL AUTO_INCREMENT,
  `ort_order_id` int NOT NULL,
  `ort_rider_id` int NOT NULL,
  `ort_take_order_time` datetime DEFAULT NULL,
  `ort_take_order_out` datetime DEFAULT NULL,
  `ort_status` varchar(50) DEFAULT NULL,
  `ort_pick_up_time` time DEFAULT NULL,
  `ort_drop_off_time` time DEFAULT NULL,
  `ort_order_complete` datetime DEFAULT NULL,
  `ort_distance` varchar(50) DEFAULT NULL,
  `ort_del_fee` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ort_details_rider_id`),
  KEY `ort_order_id` (`ort_order_id`),
  KEY `ort_rider_id` (`ort_rider_id`),
  CONSTRAINT `order_riders_table_ibfk_1` FOREIGN KEY (`ort_order_id`) REFERENCES `master_order` (`mo_order_id`),
  CONSTRAINT `order_riders_table_ibfk_2` FOREIGN KEY (`ort_rider_id`) REFERENCES `master_rider` (`mr_rider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_riders_table`
--

LOCK TABLES `order_riders_table` WRITE;
/*!40000 ALTER TABLE `order_riders_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_riders_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rider_reload`
--

DROP TABLE IF EXISTS `rider_reload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rider_reload` (
  `rr_reload_id` int NOT NULL AUTO_INCREMENT,
  `rr_rider_id` int NOT NULL,
  `rr_load_station_id` int NOT NULL,
  `rr_amount` decimal(10,2) DEFAULT NULL,
  `rr_attachment` longtext,
  `rr_create_date` datetime DEFAULT NULL,
  `rr_date_response` datetime DEFAULT NULL,
  `rr_reload_status` varchar(50) NOT NULL,
  PRIMARY KEY (`rr_reload_id`),
  KEY `rr_rider_id` (`rr_rider_id`),
  KEY `rr_load_station_id` (`rr_load_station_id`),
  CONSTRAINT `rider_reload_ibfk_1` FOREIGN KEY (`rr_rider_id`) REFERENCES `master_rider` (`mr_rider_id`),
  CONSTRAINT `rider_reload_ibfk_2` FOREIGN KEY (`rr_load_station_id`) REFERENCES `master_load_station` (`mls_station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rider_reload`
--

LOCK TABLES `rider_reload` WRITE;
/*!40000 ALTER TABLE `rider_reload` DISABLE KEYS */;
/*!40000 ALTER TABLE `rider_reload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rider_reload_history`
--

DROP TABLE IF EXISTS `rider_reload_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rider_reload_history` (
  `rrh_history_id` int NOT NULL AUTO_INCREMENT,
  `rrh_rider_id` int NOT NULL,
  `rrh_load_station_id` int NOT NULL,
  `rrh_amount` decimal(10,2) DEFAULT NULL,
  `rrh_attachment` longtext,
  `rrh_create_date` datetime DEFAULT NULL,
  `rrh_date_response` datetime DEFAULT NULL,
  `rrh_reload_type` varchar(50) NOT NULL,
  `rrh_status` varchar(50) NOT NULL,
  `rrh_reload_reference_id` int NOT NULL,
  PRIMARY KEY (`rrh_history_id`),
  KEY `rrh_rider_id` (`rrh_rider_id`),
  KEY `rrh_load_station_id` (`rrh_load_station_id`),
  KEY `rrh_reload_reference_id` (`rrh_reload_reference_id`),
  CONSTRAINT `rider_reload_history_ibfk_1` FOREIGN KEY (`rrh_rider_id`) REFERENCES `master_rider` (`mr_rider_id`),
  CONSTRAINT `rider_reload_history_ibfk_2` FOREIGN KEY (`rrh_load_station_id`) REFERENCES `master_load_station` (`mls_station_id`),
  CONSTRAINT `rider_reload_history_ibfk_3` FOREIGN KEY (`rrh_reload_reference_id`) REFERENCES `rider_reload` (`rr_reload_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rider_reload_history`
--

LOCK TABLES `rider_reload_history` WRITE;
/*!40000 ALTER TABLE `rider_reload_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `rider_reload_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'lagona_express'
--

--
-- Dumping routines for database 'lagona_express'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-05  1:49:26
