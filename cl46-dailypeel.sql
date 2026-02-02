-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 02, 2026 at 10:11 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cl46-dailypeel`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `metaid` mediumtext NOT NULL,
  `username` text NOT NULL,
  `password` varchar(100) NOT NULL,
  `salt` text NOT NULL,
  `address` text NOT NULL,
  `isVarified` text NOT NULL,
  `privalges` text NOT NULL,
  `dateJoined` date NOT NULL DEFAULT current_timestamp(),
  `hasprofileimage` text NOT NULL,
  `logedinhash` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `metaid`, `username`, `password`, `salt`, `address`, `isVarified`, `privalges`, `dateJoined`, `hasprofileimage`, `logedinhash`) VALUES
(32, 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', 'Archtects', '$2a$08$BZMRS7BV08w1dLiPXiTvCe0wR1/UEyNySFbZbvfXgoD9pQVxLPK9u', '', 'ban_14xne4uxkbzy5qwgugmk4jwpg4prpx17ndzds1dfd19dx5j6kaxrd5sngwqd', 'false', '0', '0000-00-00', 'false', '5765OB7GdlUS1/o2s9i4psh9L4acC4VjWZppBONi+1sCzjofrx0gQeiz1w3Jjg0RTe4p6I7poE7i0KH+gPW7Bw=='),
(33, 'wHb4INziIUmU0lUQ5EgZTNVfQq+TJcK9MPVlW2dNLtumn31qo/KWAWJh6LPtprzvW1MzpN08e4K/ZsuGo2p60A==332025282111', 'verycutecat', '$2a$08$XqMdgkuHAXnb0sejOPgxDuY5fF5jVhGvPgauDWUxqz8IzbDptAXRq', '', 'ban_3cutecatnrudh8ncfd5m3xbi18z33ecn9ewfn99afq5o6ywddcupmzjs681e', 'false', '0', '0000-00-00', 'false', 'wHb4INziIUmU0lUQ5EgZTNVfQq+TJcK9MPVlW2dNLtumn31qo/KWAWJh6LPtprzvW1MzpN08e4K/ZsuGo2p60A==');

-- --------------------------------------------------------

--
-- Table structure for table `accounts_meta`
--

CREATE TABLE `accounts_meta` (
  `id` int(11) NOT NULL,
  `metaid` mediumtext NOT NULL,
  `profileimageurl` longtext NOT NULL,
  `gradientdefault` mediumtext NOT NULL,
  `nickname` text NOT NULL,
  `role` longtext NOT NULL,
  `blurb` longtext NOT NULL,
  `account_slug` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accounts_meta`
--

INSERT INTO `accounts_meta` (`id`, `metaid`, `profileimageurl`, `gradientdefault`, `nickname`, `role`, `blurb`, `account_slug`) VALUES
(6, 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', '', 'linear-gradient(52deg, #4a8a52, #0828d2)', 'Archtects', 'Some guy', 'I\'m a passionate advocate for animal welfare, particularly primates. My fascination with these intelligent creatures began with childhood memories of mischievous monkeys swinging through trees and enjoying juicy bananas.', 'archtects'),
(7, 'wHb4INziIUmU0lUQ5EgZTNVfQq+TJcK9MPVlW2dNLtumn31qo/KWAWJh6LPtprzvW1MzpN08e4K/ZsuGo2p60A==332025282111', '', 'linear-gradient(178deg, #4a51c5, #841876)', 'verycutecat', 'Blog Author', 'I\'m a passionate advocate for animal welfare, particularly primates. My fascination with these intelligent creatures began with childhood memories of mischievous monkeys swinging through trees and enjoying juicy bananas.', 'verycutecat');

-- --------------------------------------------------------

--
-- Table structure for table `comments_meta`
--

CREATE TABLE `comments_meta` (
  `id` int(11) NOT NULL,
  `post_meta_id` longtext NOT NULL,
  `comment_meta_id` longtext NOT NULL,
  `user_meta` longtext NOT NULL,
  `comment_body` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_title` longtext NOT NULL,
  `post_category` mediumtext NOT NULL,
  `post_meta_id` longtext NOT NULL,
  `post_type` longtext NOT NULL,
  `connected_user_meta` longtext NOT NULL,
  `id` int(11) NOT NULL,
  `post_thumbnail` longtext NOT NULL,
  `post_slug` longtext NOT NULL,
  `connected_account_slug` text NOT NULL,
  `date` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_title`, `post_category`, `post_meta_id`, `post_type`, `connected_user_meta`, `id`, `post_thumbnail`, `post_slug`, `connected_account_slug`, `date`) VALUES
('This is the cool example post that everyones talking about.', 'Example', 'ban_0cXuw6tpqDWDqQMFa7hpHSHTJ++Di71+SkKJwGgZ6wBtG7/dk67xbBtuV00T2YinXMjqVUXRPHJOj/IV68rzyA==2202502257814', 'post', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', 23, '/images/png/placeholder.jpg', 'this-is-the-cool-example-post-that-everyones-talking-about.', 'archtects', '2/3/2025');

-- --------------------------------------------------------

--
-- Table structure for table `post_body`
--

CREATE TABLE `post_body` (
  `id` int(11) NOT NULL,
  `post_meta_id` longtext NOT NULL,
  `connected_user_meta` longtext NOT NULL,
  `body` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post_body`
--

INSERT INTO `post_body` (`id`, `post_meta_id`, `connected_user_meta`, `body`) VALUES
(20, 'ban_0cXuw6tpqDWDqQMFa7hpHSHTJ++Di71+SkKJwGgZ6wBtG7/dk67xbBtuV00T2YinXMjqVUXRPHJOj/IV68rzyA==2202502257814', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', '\"<section class=\"row padded post-heading ui-sortable-handle\"><p id=\"category-tag\" data-flow=\"is-editable\" data-meta=\"ajax-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"category\">Example</span></p><h1 id=\"post-heading-title\" data-flow=\"is-editable\" data-meta=\"ajax-username-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"post-title\">This is the cool example post that everyones talking about.</span></h1><figure><img id=\"post-thumb-nail\" src=\"/images/png/placeholder.jpg\"></figure></section><section class=\"row padded taggable sortable-items droptrue ui-sortable-handle ui-sortable\"><div data-flow=\"heading\" class=\"heading-item-design-wrapper editableTargetSelector\"><h2 class=\"heading-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">Social Dynamics and Bananas.</span></h2></div><div data-flow=\"paragraph\" class=\"paragraph-item-design-wrapper editableTargetSelector\"><p class=\"paragraph-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">While the Cavendish banana is the most common variety found in supermarkets, there are over 1,000 different types of bananas worldwide.</span></p></div><div data-flow=\"paragraph\" class=\"paragraph-item-design-wrapper editableTargetSelector\"><p class=\"paragraph-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">The affinity for bananas is not just a matter of taste. Bananas, with their bright yellow color and high energy content, are easy for monkeys to spot and provide a quick source of energy.</span></p></div><div data-flow=\"blockquote\" class=\"blockquote-item-design-wrapper editableTargetSelector\"><blockquote class=\"blockquote-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">The affinity for bananas is not just a matter of taste</span></blockquote></div></section>\"');

-- --------------------------------------------------------

--
-- Table structure for table `post_meta`
--

CREATE TABLE `post_meta` (
  `post_likes` int(11) NOT NULL,
  `post_meta_id` longtext NOT NULL,
  `comment_meta_id` longtext NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `accounts_meta`
--
ALTER TABLE `accounts_meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments_meta`
--
ALTER TABLE `comments_meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_body`
--
ALTER TABLE `post_body`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_meta`
--
ALTER TABLE `post_meta`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `accounts_meta`
--
ALTER TABLE `accounts_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `comments_meta`
--
ALTER TABLE `comments_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `post_body`
--
ALTER TABLE `post_body`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `post_meta`
--
ALTER TABLE `post_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
