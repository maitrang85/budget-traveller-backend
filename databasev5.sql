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
-- Table structure for table `camping_reaction`
--

CREATE TABLE `camping_reaction` (
  `post_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `isLiked` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `camping_site`
--

CREATE TABLE `camping_site` (
  `post_id` bigint(20) NOT NULL,
  `title` text NOT NULL,
  `address` text DEFAULT NULL,
  `coords` text NOT NULL,
  `content` text NOT NULL,
  `region_id` enum('Finland','Ahvenanmaa','Etelä-Karjala','Etelä-Pohjanmaa','Etelä-Savo','Kainuu','Kanta-Häme','Keski-Pohjanmaa','Keski-Suomi','Kymenlaakso','Lappi','Pirkanmaa','Pohjanmaa','Pohjois-Karjala','Pohjois-Pohjanmaa','Pohjois-Savo','Päijät-Häme','Satakunta','Uusimaa','Varsinais-Suomi') NOT NULL DEFAULT 'Finland',
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `edited_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `free_or_not` enum('free','paid') NOT NULL DEFAULT 'free',
  `price` decimal(7,2) DEFAULT NULL,
  `filename` text NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(1, 'admin', 'admin@metropolia.fi', '$2a$12$6PDuc7il71H8nu52h1nBhe/Dzr8n7uTHE7HeVvNQ4gvYKCLQfcxOe', 0);

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
-- Indexes for table `camping_reaction`
--
ALTER TABLE `camping_reaction`
  ADD PRIMARY KEY (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `camping_comment`
--
ALTER TABLE `camping_comment`
  MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `camping_site`
--
ALTER TABLE `camping_site`
  MODIFY `post_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `camping_user`
--
ALTER TABLE `camping_user`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- Constraints for table `camping_reaction`
--
ALTER TABLE `camping_reaction`
  ADD CONSTRAINT `camping_reaction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `camping_reaction_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `camping_site` (`post_id`) ON DELETE CASCADE;

--
-- Constraints for table `camping_site`
--
ALTER TABLE `camping_site`
  ADD CONSTRAINT `camping_site_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE;

