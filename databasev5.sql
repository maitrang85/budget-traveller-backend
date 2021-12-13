CREATE TABLE `camping_comment` (
  `comment_id` bigint(20) NOT NULL,
  `content` text NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `edited_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `camping_follower` (
  `user_id` bigint(20) NOT NULL,
  `follower_id` bigint(20) NOT NULL,
  `follow_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `camping_reaction` (
  `post_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `isLiked` tinyint(1) NOT NULL,
  `reaction_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `camping_site` (
  `post_id` bigint(20) NOT NULL,
  `title` text NOT NULL,
  `address` text DEFAULT NULL,
  `coords` text NOT NULL,
  `content` text NOT NULL,
  `region_id` enum('Ahvenanmaa','Etelä-Karjala','Etelä-Pohjanmaa','Etelä-Savo','Kainuu','Kanta-Häme','Keski-Pohjanmaa','Keski-Suomi','Kymenlaakso','Lappi','Pirkanmaa','Pohjanmaa','Pohjois-Karjala','Pohjois-Pohjanmaa','Pohjois-Savo','Päijät-Häme','Satakunta','Uusimaa','Varsinais-Suomi') NOT NULL DEFAULT 'Finland',
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `edited_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `free_or_not` enum('free','paid') NOT NULL DEFAULT 'free',
  `price` decimal(7,2) DEFAULT NULL,
  `filename` text NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `camping_user` (
  `user_id` bigint(20) NOT NULL,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `role` int(11) NOT NULL DEFAULT 1,
  `register_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `camping_user` (`user_id`, `username`, `email`, `password`, `role`, `register_date`) VALUES
(1, 'admin', 'admin@metropolia.fi', '$2a$12$dr16uEr4YZGKYGSsBMC8A.f/oHiwitsQQBAOJLZ6YiIiHRnhEbF2q', 0, '2021-12-13 10:29:32');

ALTER TABLE `camping_comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `camping_follower`
  ADD PRIMARY KEY (`user_id`,`follower_id`),
  ADD KEY `follower_id` (`follower_id`);

ALTER TABLE `camping_reaction`
  ADD PRIMARY KEY (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

ALTER TABLE `camping_site`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `camping_user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`) USING HASH;

ALTER TABLE `camping_comment`
  MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `camping_site`
  MODIFY `post_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `camping_user`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `camping_comment`
  ADD CONSTRAINT `camping_comment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `camping_site` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `camping_comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `camping_follower`
  ADD CONSTRAINT `camping_follower_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `camping_follower_ibfk_2` FOREIGN KEY (`follower_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `camping_reaction`
  ADD CONSTRAINT `camping_reaction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `camping_reaction_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `camping_site` (`post_id`) ON DELETE CASCADE;

ALTER TABLE `camping_site`
  ADD CONSTRAINT `camping_site_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `camping_user` (`user_id`) ON DELETE CASCADE;

