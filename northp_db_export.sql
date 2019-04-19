-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 19, 2019 at 07:07 AM
-- Server version: 5.7.24
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `northp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `commenter` varchar(60) DEFAULT NULL,
  `commented_image` varchar(120) DEFAULT NULL,
  `comment` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`commenter`, `commented_image`, `comment`) VALUES
('murph08', 'barrel.png', 'Wow! I uploaded an image! Wowwow!'),
('pfmn91', 'barrel.png', 'Nice one!'),
('pfmn91', 'barrel.png', 'How do I upload images on here? :('),
('pfmn91', 'barrel.png', 'Oh wait, I found it lol'),
('Irishboi91', 'player.png', 'Why can\'t I dislike this image? This site sucks!!'),
('Irishboi91', 'barrel.png', 'Terrible'),
('Irishboi91', 'barrel.png', 'Repost!'),
('pfmn91', 'player.png', 'Hey, nobody wants negativity here....'),
('ScarHe8d', 'player.png', 'Never fear! Harry Potter Scarhead boi is here!'),
('ScarHe8d', 'player.png', 'Meaning I liked your image...'),
('ScarHe8d', 'wall.png', 'Deep'),
('pfmn91', 'empty.png', 'REPOST');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `liker` varchar(60) DEFAULT NULL,
  `liked_image` varchar(120) DEFAULT NULL,
  `like_status` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`liker`, `liked_image`, `like_status`) VALUES
('murph08', 'barrel.png', 1),
('pfmn91', 'barrel.png', 1),
('ScarHe8d', 'player.png', 1),
('ScarHe8d', 'wall.png', 1),
('pfmn91', 'empty.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `filename` varchar(120) NOT NULL,
  `username` varchar(60) DEFAULT NULL,
  `uploadDate` varchar(60) DEFAULT NULL,
  `totalLikes` int(100) DEFAULT NULL,
  `totalComments` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `uploads`
--

INSERT INTO `uploads` (`filename`, `username`, `uploadDate`, `totalLikes`, `totalComments`) VALUES
('barrel.png', 'murph08', '2019-04-18 13:19:20.405', 2, 6),
('empty.png', 'pfmn91', '2019-04-19 07:23:16.098', 1, 1),
('player.png', 'pfmn91', '2019-04-18 13:20:36.282', 1, 4),
('victory_point.png', 'ScarHe8d', '2019-04-18 13:38:15.312', 0, 0),
('wall.png', 'ScarHe8d', '2019-04-18 13:37:59.326', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(30) NOT NULL,
  `firstname` varchar(30) DEFAULT NULL,
  `surname` varchar(30) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `firstname`, `surname`, `password`) VALUES
('Irishboi91', 'Young', 'Turk', 'SecurePassword12$'),
('murph08', 'Jake', 'Murphy', 'Dublin123!'),
('pfmn91', 'Peter', 'North', 'MyPassword1968!'),
('ScarHe8d', 'Harry', 'Potter', 'secretlyHorcrux90!');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`filename`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
