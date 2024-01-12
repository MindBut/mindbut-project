#CREATE DATABASE mindbut;
use mindbut;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_kakaotalk` varchar(100) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `bot_name` varchar(100) DEFAULT NULL,	
  `survey_question_one` varchar(100) DEFAULT NULL,
  `survey_question_two` varchar(100) DEFAULT NULL,
  `survey_question_three` varchar(100) DEFAULT NULL,	
  `survey_question_four` varchar(100) DEFAULT NULL,
  `survey_question_five` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `moodtrackings` (
  `moodtracking_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `moodtracking_date` date DEFAULT NULL,
  `message_prompt` varchar(1000) DEFAULT NULL,
  `message_first` varchar(1000) DEFAULT NULL,
  `message_second` varchar(1000) DEFAULT NULL,
  `message_first_answer` varchar(1000) DEFAULT NULL,
  `message_second_answer` varchar(1000) DEFAULT NULL,
  `message_model` varchar(10000) DEFAULT NULL,
  `emotion_reason` varchar(100) DEFAULT NULL,	
  `emotion_one` varchar(100) DEFAULT NULL,	
  `emotion_two` varchar(100) DEFAULT NULL,
  `emotion_intensity` double DEFAULT NULL,
  PRIMARY KEY (`moodtracking_id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `counsels` (
  `counsel_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `counsel_date` date DEFAULT NULL,
  `counsel_emotion` varchar(100) DEFAULT NULL,	
  PRIMARY KEY (`counsel_id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `chattings` (
  `chatting_id` int(11) NOT NULL AUTO_INCREMENT,
  `counsel_id` int(11) DEFAULT NULL,
  `chatting_datetime` datetime DEFAULT NULL,
  `chatting_user` varchar(1000) DEFAULT NULL,
  `chatting_computer` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`chatting_id`),
  FOREIGN KEY (`counsel_id`) REFERENCES counsels(`counsel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
