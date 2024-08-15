-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 08, 2024 at 10:27 PM
-- Server version: 8.0.35
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int NOT NULL,
  `admin_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `admin_name`, `admin_email`, `admin_password`, `createdAt`) VALUES
(1, 'Admin 1', 'abc@xyz.com', '$2y$10$lXVjayJZtapjnnO1XuyLLOJl8PXy/QlNTsDOwuPa.kohooJrSW.Cy', '2024-08-02 23:12:09');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `emp_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('present','absent') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'absent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`emp_id`, `start_time`, `end_time`, `createdAt`, `status`) VALUES
(1, '2024-07-23 08:30:00', '2024-07-23 17:00:00', '2024-07-23 12:01:00', 'absent'),
(1, '2024-07-24 08:30:00', '2024-07-24 17:00:00', '2024-07-24 12:01:00', 'absent'),
(1, '2024-07-25 08:30:00', '2024-07-25 17:00:00', '2024-07-25 12:01:00', 'absent'),
(1, '2024-07-26 08:30:00', '2024-07-26 17:00:00', '2024-07-26 12:01:00', 'absent'),
(1, '2024-07-27 08:30:00', '2024-07-27 17:00:00', '2024-07-27 12:01:00', 'absent'),
(1, '2024-08-03 23:54:14', '2024-08-03 23:54:18', '2024-08-03 21:16:05', 'absent'),
(1, '2024-08-08 22:10:48', NULL, '2024-08-08 20:10:48', 'absent'),
(2, '2024-07-23 09:00:00', '2024-07-23 17:00:00', '2024-07-23 12:01:00', 'absent'),
(2, '2024-07-24 09:00:00', '2024-07-24 17:00:00', '2024-07-24 12:01:00', 'absent'),
(2, '2024-07-25 09:00:00', '2024-07-25 17:00:00', '2024-07-25 12:01:00', 'absent'),
(2, '2024-07-26 09:00:00', '2024-07-26 17:00:00', '2024-07-26 12:01:00', 'absent'),
(2, '2024-07-27 09:00:00', '2024-07-27 17:00:00', '2024-07-27 12:01:00', 'absent'),
(2, '2024-08-03 23:54:53', '2024-08-03 23:55:00', '2024-08-03 01:48:39', 'absent'),
(2, '2024-08-08 22:10:48', NULL, '2024-08-08 20:10:48', 'absent'),
(3, '2024-07-23 08:45:00', '2024-07-23 17:15:00', '2024-07-23 12:16:00', 'absent'),
(3, '2024-07-24 08:45:00', '2024-07-24 17:15:00', '2024-07-24 12:16:00', 'absent'),
(3, '2024-07-25 08:45:00', '2024-07-25 17:15:00', '2024-07-25 12:16:00', 'absent'),
(3, '2024-07-26 08:45:00', '2024-07-26 17:15:00', '2024-07-26 12:16:00', 'absent'),
(3, '2024-07-27 08:45:00', '2024-07-27 17:15:00', '2024-07-27 12:16:00', 'absent'),
(3, '2024-08-03 23:54:53', '2024-08-03 23:54:58', '2024-08-03 01:46:48', 'absent'),
(3, '2024-08-04 15:46:01', NULL, '2024-08-04 13:46:01', 'absent'),
(3, '2024-08-08 22:10:47', NULL, '2024-08-08 20:10:47', 'absent'),
(4, '2024-07-23 08:00:00', '2024-07-23 16:00:00', '2024-07-23 11:01:00', 'absent'),
(4, '2024-07-24 08:00:00', '2024-07-24 16:00:00', '2024-07-24 11:01:00', 'absent'),
(4, '2024-07-25 08:00:00', '2024-07-25 16:00:00', '2024-07-25 11:01:00', 'absent'),
(4, '2024-07-26 08:00:00', '2024-07-26 16:00:00', '2024-07-26 11:01:00', 'absent'),
(4, '2024-07-27 08:00:00', '2024-07-27 16:00:00', '2024-07-27 11:01:00', 'absent'),
(4, '2024-08-03 23:54:50', '2024-08-03 23:54:59', '2024-08-03 01:13:33', 'absent'),
(4, '2024-08-04 17:24:34', '2024-08-04 19:01:45', '2024-08-04 13:45:59', 'absent'),
(4, '2024-08-08 22:10:50', NULL, '2024-08-08 20:09:19', 'absent'),
(5, '2024-07-23 09:00:00', '2024-07-23 17:00:00', '2024-07-23 12:01:00', 'absent'),
(5, '2024-07-24 09:00:00', '2024-07-24 17:00:00', '2024-07-24 12:01:00', 'absent'),
(5, '2024-07-25 09:00:00', '2024-07-25 17:00:00', '2024-07-25 12:01:00', 'absent'),
(5, '2024-07-26 09:00:00', '2024-07-26 17:00:00', '2024-07-26 12:01:00', 'absent'),
(5, '2024-07-27 09:00:00', '2024-07-27 17:00:00', '2024-07-27 12:01:00', 'absent'),
(5, '2024-08-03 23:54:49', NULL, '2024-08-03 21:34:19', 'absent'),
(5, '2024-08-04 00:19:41', '2024-08-04 00:19:45', '2024-08-03 22:05:23', 'absent'),
(5, '2024-08-05 13:32:00', NULL, '2024-08-05 11:32:00', 'absent'),
(5, '2024-08-08 22:10:49', NULL, '2024-08-08 20:10:42', 'absent'),
(6, '2024-08-03 23:54:52', '2024-08-03 23:54:55', '2024-08-03 01:21:48', 'absent'),
(6, '2024-08-04 17:24:31', '2024-08-04 19:01:46', '2024-08-04 15:24:31', 'absent'),
(6, '2024-08-08 22:10:46', NULL, '2024-08-08 20:10:46', 'absent');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int NOT NULL,
  `department_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `createdAt`) VALUES
(1, 'IT Hub', '2024-08-02 23:31:26'),
(2, 'Design', '2024-08-02 23:31:26'),
(3, 'HR', '2024-08-02 23:31:26'),
(4, 'Finance', '2024-08-02 23:31:26'),
(5, 'Marketing', '2024-08-02 23:31:26'),
(6, 'WEB', '2024-08-02 23:41:40');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `emp_id` int NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `job_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `department` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`emp_id`, `first_name`, `last_name`, `job_title`, `picture`, `birthday`, `department`, `createdAt`) VALUES
(1, 'John 1', 'Doe 1', 'Developer 1', '66b0ba5bc42cd-Screenshot 2024-08-04 223210.png', '1985-01-15', NULL, '2024-01-10 04:00:00'),
(2, 'Jane', 'Smith', 'Designer', '66ad8e33b0bf5-Screenshot 2024-07-25 085031.png', '1990-03-22', 2, '2024-01-11 04:00:00'),
(3, 'Emily', 'Davis', 'Manager', '66ad8e164915e-Screenshot 2024-07-24 011659.png', '1982-11-05', 3, '2024-01-12 04:00:00'),
(4, 'Michael', 'Brown', 'Analyst', '66ad8e20a163b-Screenshot 2024-08-01 031029.png', '1988-07-30', 4, '2024-01-13 04:00:00'),
(5, 'Sarah', 'Wilson', 'Developer', '66ad70a0333ae-Screenshot 2024-07-24 064641.png', '1992-08-04', 5, '2024-01-14 04:00:00'),
(6, 'Anas', 'Syed', 'Web DEv', '66ad7012b7c00-Contact Us.png', NULL, 2, '2024-08-02 23:47:30'),
(7, 'Syed 1', 'Bukhari', 'Designer', '66b5281184d6a-01_homepage1.jpg', '2024-08-01', 1, '2024-08-08 20:18:07'),
(8, 'Syed', 'Bukhari', 'Designer', '66b5281184d6a-01_homepage1.jpg', '2024-08-01', 1, '2024-08-08 20:18:25');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `header_bg_color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `main_bg_color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `main_bg_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `header_bg_color`, `main_bg_color`, `main_bg_image`, `updatedAt`) VALUES
(1, '#fff0f0', '#ebf9ff', NULL, '2024-08-04 14:31:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admin_email` (`admin_email`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`emp_id`,`start_time`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`emp_id`),
  ADD KEY `department` (`department`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `emp_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
