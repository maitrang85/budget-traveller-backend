--
-- Table structure for table `camping_comment`
--

CREATE TABLE `camping_comment` (
  `comment_id` bigint(20) NOT NULL,
  `content` text NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `edited_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `post_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `camping_comment`
--

INSERT INTO `camping_comment` (`comment_id`, `content`, `created_date`, `edited_date`, `post_id`, `user_id`) VALUES
(1, 'Wonderful spot', '2021-12-02 08:57:25', '2021-12-02 08:57:25', 4, 1),
(2, 'Too many mosquitoes and bugs', '2021-12-02 08:58:12', '2021-12-02 08:58:12', 3, 2),
(3, 'I heard wolfs howling at night. So scary!', '2021-12-02 08:58:56', '2021-12-02 08:58:56', 2, 3),
(4, 'Dream land on Earth', '2021-12-03 07:17:11', '2021-12-03 07:17:11', 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `camping_follower`
--

CREATE TABLE `camping_follower` (
  `user_id` bigint(20) NOT NULL,
  `follower_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `camping_site`
--

CREATE TABLE `camping_site` (
  `post_id` bigint(20) NOT NULL,
  `title` text NOT NULL,
  `address` text DEFAULT NULL,
  `coords` text DEFAULT NULL,
  `content` text NOT NULL,
  `region_id` enum('Finland','Ahvenanmaa','Etelä-Karjala','Etelä-Pohjanmaa','Etelä-Savo','Kainuu','Kanta-Häme','Keski-Pohjanmaa','Keski-Suomi','Kymenlaakso','Lappi','Pirkanmaa','Pohjanmaa','Pohjois-Karjala','Pohjois-Pohjanmaa','Pohjois-Savo','Päijät-Häme','Satakunta','Uusimaa','Varsinais-Suomi') NOT NULL DEFAULT 'Finland',
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `edited_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `free_or_not` enum('free','paid') NOT NULL DEFAULT 'free',
  `price` decimal(7,2) DEFAULT NULL,
  `filename` text NOT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `camping_site`
--

INSERT INTO `camping_site` (`post_id`, `title`, `address`, `coords`, `content`, `region_id`, `created_date`, `edited_date`, `free_or_not`, `price`, `filename`, `user_id`) VALUES
(1, 'Hidden gem', NULL, '[62.7777539652943,26.199539005192]', 'Difficult to find but totally worth the effort', 'Etelä-Karjala', '2021-11-29 07:02:49', '2021-11-29 07:02:49', 'free', NULL, '', 1),
(2, 'Full of activities for families', 'Santalahdentie 150, 48310 Kotka', '[60.258116666666666,24.84575]', 'This is great place for families. There are a lot of activities for all family member to enjoy themselves and enjoy together', 'Kymenlaakso', '2021-11-29 07:09:58', '2021-11-29 07:09:58', 'paid', '22.00', '', 2),
(3, 'Best value camping site', 'Rauhankatu 3 70700 Kuopio', '[62.7777539652943,26.199539005192]', 'Reasonable price for a whole summer getaway', 'Etelä-Savo', '2021-11-29 07:18:57', '2021-11-29 07:18:57', 'paid', '13.00', '', 4),
(4, 'Scenic spot along a hiking trail', '', '[60.258116666666666,24.84575]', 'The spot is next to a beautiful hiking trail and big bed of mushroom', 'Uusimaa', '2021-12-02 11:22:35', '2021-12-02 11:22:35', 'free', '0.00', '', 3);

-- --------------------------------------------------------

--
-- Table structure for table `camping_user`
--

CREATE TABLE `camping_user` (
  `user_id` bigint(20) NOT NULL,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `role` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `camping_user`
--

INSERT INTO `camping_user` (`user_id`, `username`, `email`, `password`, `role`) VALUES
(1, 'admin', 'admin@metropolia.fi', '1234', 0),
(2, 'camper1', 'camper1@metropolia.fi', 'qwer', 1),
(3, 'camper2', 'camper2@metropolia.fi', 'asdf', 1),
(4, 'camper3', 'camper3@metropolia.fi', 'zxcv', 1);

-- --------------------------------------------------------

--
-- Table structure for table `like_or_dislike`
--

CREATE TABLE `reaction` (
  `post_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `isLiked` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Indexes for table `camping_comment`
--
ALTER TABLE `camping_comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `camping_follower`
--
ALTER TABLE `camping_follower`
  ADD PRIMARY KEY (`user_id`,`follower_id`),
  ADD KEY `follower_id` (`follower_id`);

--
-- Indexes for table `camping_site`
--
ALTER TABLE `camping_site`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `camping_user`
--
ALTER TABLE `camping_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `like_or_dislike`
--
ALTER TABLE `reaction`
  ADD PRIMARY KEY (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `camping_comment`
--
ALTER TABLE `camping_comment`
  MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `camping_site`
--
ALTER TABLE `camping_site`
  MODIFY `post_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `camping_user`
--
ALTER TABLE `camping_user`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `camping_comment`
--
ALTER TABLE `camping_comment`
  ADD CONSTRAINT `camping_comment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `camping_site` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `camping_comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `camping_follower`
--
ALTER TABLE `camping_follower`
  ADD CONSTRAINT `camping_follower_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `camping_follower_ibfk_2` FOREIGN KEY (`follower_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `camping_site`
--
ALTER TABLE `camping_site`
  ADD CONSTRAINT `camping_site_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `like_or_dislike`
--
ALTER TABLE `reaction`
  ADD CONSTRAINT `reaction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reaction_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `camping_site` (`post_id`) ON DELETE CASCADE;