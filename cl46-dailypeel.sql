-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2026 at 12:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `metaid`, `username`, `password`, `salt`, `address`, `isVarified`, `privalges`, `dateJoined`, `hasprofileimage`, `logedinhash`) VALUES
(32, 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', 'Archtects', '$2a$08$BZMRS7BV08w1dLiPXiTvCe0wR1/UEyNySFbZbvfXgoD9pQVxLPK9u', '', 'ban_14xne4uxkbzy5qwgugmk4jwpg4prpx17ndzds1dfd19dx5j6kaxrd5sngwqd', 'false', '0', '0000-00-00', 'false', 'OZl2cmYb2b6M9Ujg8AA2UTYzuX1NCwY99UJCDm8Dl3TgKGCxPPn/pLFfS2MMk2Gqnu3xAW2y+cpcnaY7lbnkyw=='),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_meta`
--

INSERT INTO `accounts_meta` (`id`, `metaid`, `profileimageurl`, `gradientdefault`, `nickname`, `role`, `blurb`, `account_slug`) VALUES
(6, 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', '', 'linear-gradient(52deg, #4a8a52, #0828d2)', 'Archtects', 'Some bloke who half-assed the system your using right now', 'Been here to long, soggy wont make me a part of the team as she fears the power I could wield.&nbsp;', 'archtects'),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_title`, `post_category`, `post_meta_id`, `post_type`, `connected_user_meta`, `id`, `post_thumbnail`, `post_slug`, `connected_account_slug`, `date`) VALUES
('This is the cool example post that everyones talking about.', 'Example', 'ban_0cXuw6tpqDWDqQMFa7hpHSHTJ++Di71+SkKJwGgZ6wBtG7/dk67xbBtuV00T2YinXMjqVUXRPHJOj/IV68rzyA==2202502257814', 'post', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', 23, '/images/png/placeholder.jpg', 'this-is-the-cool-example-post-that-everyones-talking-about.', 'archtects', '2025-03-02 00:00:00'),
('In Monkiopolis, unity thrived, bound by the golden fruit of happiness.', 'News', 'ban_T3EkdBweSlUoZ9AC8JOKmW46e+lYJwyJONT7yzHg2L7wDpNO1N3nLLtn509E30BFGt9kkxhVuvIUuLXWR6RcuQ==1202622214353', 'post', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', 24, '/images/png/placeholder.jpg', 'in-monkiopolis,-unity-thrived,-bound-by-the-golden-fruit-of-happiness.', 'archtects', '2026-02-23 00:00:00'),
('Well im so excited and i just cant hide it', 'News', 'ban_z49riIpofMbyPuC/qHjL44Q7gfn79hUqPuiEZD0c6M3AdZAb/NtvKcMx3pop0XT3cYBxA3NyuV/ZfpMUqxYTGw==1202622350907', 'post', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', 29, '/images/png/placeholder.jpg', 'well-im-so-excited-and-i-just-cant-hide-it', 'archtects', '2026-02-24 23:44:18'),
('Well isn\'t this a proper @pisstke', 'News', 'ban_IScLDhGP3CC7mMKVZhQO3swpkJQJMpH+/mGTKwc4+8tHz+D1spFSarFMVd/EjU9Zm83a0U7xbWJNjlleoyqaMQ==1202622323157', 'post', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', 31, '/images/png/placeholder.jpg', 'well-isnt-this-a-proper-pisstke', 'archtects', '2026-02-24 23:49:51');

-- --------------------------------------------------------

--
-- Table structure for table `post_body`
--

CREATE TABLE `post_body` (
  `id` int(11) NOT NULL,
  `post_meta_id` longtext NOT NULL,
  `connected_user_meta` longtext NOT NULL,
  `body` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_body`
--

INSERT INTO `post_body` (`id`, `post_meta_id`, `connected_user_meta`, `body`) VALUES
(20, 'ban_0cXuw6tpqDWDqQMFa7hpHSHTJ++Di71+SkKJwGgZ6wBtG7/dk67xbBtuV00T2YinXMjqVUXRPHJOj/IV68rzyA==2202502257814', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', '\"<section class=\"row padded post-heading ui-sortable-handle\"><p id=\"category-tag\" data-flow=\"is-editable\" data-meta=\"ajax-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"category\">Example</span></p><h1 id=\"post-heading-title\" data-flow=\"is-editable\" data-meta=\"ajax-username-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"post-title\">This is the cool example post that everyones talking about.</span></h1><figure><img id=\"post-thumb-nail\" src=\"/images/png/placeholder.jpg\"></figure></section><section class=\"row padded taggable sortable-items droptrue ui-sortable ui-sortable-handle\"><div data-flow=\"heading\" class=\"heading-item-design-wrapper editableTargetSelector ui-sortable-handle\"><h2 class=\"heading-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">Social Dynamics and Bananas.</span></h2></div><div data-flow=\"paragraph\" class=\"paragraph-item-design-wrapper editableTargetSelector ui-sortable-handle\"><p class=\"paragraph-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">While the Cavendish banana is the most common variety found in supermarkets, there are over 1,000 different types of bananas worldwide.</span></p></div><div data-flow=\"paragraph\" class=\"paragraph-item-design-wrapper editableTargetSelector ui-sortable-handle\"><p class=\"paragraph-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">The affinity for bananas is not just a matter of taste. Bananas, with their bright yellow color and high energy content, are easy for monkeys to spot and provide a quick source of energy.</span></p></div><div data-flow=\"blockquote\" class=\"blockquote-item-design-wrapper editableTargetSelector ui-sortable-handle\"><blockquote class=\"blockquote-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">The affinity for bananas is not just a matter of taste</span></blockquote></div></section>\"'),
(21, 'ban_T3EkdBweSlUoZ9AC8JOKmW46e+lYJwyJONT7yzHg2L7wDpNO1N3nLLtn509E30BFGt9kkxhVuvIUuLXWR6RcuQ==1202622214353', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', '\"<section class=\"row padded post-heading ui-sortable-handle\"><p id=\"category-tag\" data-flow=\"is-editable\" data-meta=\"ajax-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"category\">News</span></p><h1 id=\"post-heading-title\" data-flow=\"is-editable\" data-meta=\"ajax-username-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"post-title\">In Monkiopolis, unity thrived, bound by the golden fruit of happiness.</span></h1><figure><img id=\"post-thumb-nail\" src=\"/images/png/placeholder.jpg\"></figure></section><section class=\"row padded taggable sortable-items droptrue ui-sortable-handle ui-sortable\"></section>\"'),
(26, 'ban_z49riIpofMbyPuC/qHjL44Q7gfn79hUqPuiEZD0c6M3AdZAb/NtvKcMx3pop0XT3cYBxA3NyuV/ZfpMUqxYTGw==1202622350907', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', '\"<section class=\"row padded post-heading ui-sortable-handle\"><p id=\"category-tag\" data-flow=\"is-editable\" data-meta=\"ajax-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"category\">News</span></p><h1 id=\"post-heading-title\" data-flow=\"is-editable\" data-meta=\"ajax-username-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"post-title\">Well im so excited and i just cant hide it</span></h1><figure><img id=\"post-thumb-nail\" src=\"/images/png/placeholder.jpg\"></figure></section><section class=\"row padded taggable sortable-items droptrue ui-sortable-handle ui-sortable\"><div data-flow=\"blockquote\" class=\"blockquote-item-design-wrapper editableTargetSelector\"><blockquote class=\"blockquote-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">Our cultural representation of monkeys often includes bananas due to their long-standing relationship</span></blockquote></div></section>\"'),
(28, 'ban_IScLDhGP3CC7mMKVZhQO3swpkJQJMpH+/mGTKwc4+8tHz+D1spFSarFMVd/EjU9Zm83a0U7xbWJNjlleoyqaMQ==1202622323157', 'UwaYRC7JMM8S48F875VmSnT0ETX5mDMHTAiSEAEGWKjyYRwBeU/AfF3jtlAp5444QhQyW+muap6r709eHHk3sQ==23202582022', '\"<section class=\"row padded post-heading ui-sortable-handle\"><p id=\"category-tag\" data-flow=\"is-editable\" data-meta=\"ajax-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"category\">News</span></p><h1 id=\"post-heading-title\" data-flow=\"is-editable\" data-meta=\"ajax-username-updateable\" data-allows-editor=\"false\" class=\"\"> <span contenteditable=\"false\" data-is-name=\"post-title\">Well isn\'t this a proper @pisstke</span></h1><figure><img id=\"post-thumb-nail\" src=\"/images/png/placeholder.jpg\"></figure></section><section class=\"row padded taggable sortable-items droptrue ui-sortable-handle ui-sortable\"><div data-flow=\"paragraph\" class=\"paragraph-item-design-wrapper editableTargetSelector\"><p class=\"paragraph-design-item\" data-flow=\"is-editable\" data-flow-is-post-target=\"true\" data-allows-editor=\"true\"><span contenteditable=\"false\">Bananas are more than just a convenient snack—they are a fruit packed with history, nutrition, and surprising facts. Let\'s dive into the intriguing world of bananas.</span></p></div></section>\"');

-- --------------------------------------------------------

--
-- Table structure for table `post_meta`
--

CREATE TABLE `post_meta` (
  `post_likes` int(11) NOT NULL,
  `post_meta_id` longtext NOT NULL,
  `comment_meta_id` longtext NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `post_body`
--
ALTER TABLE `post_body`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `post_meta`
--
ALTER TABLE `post_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
