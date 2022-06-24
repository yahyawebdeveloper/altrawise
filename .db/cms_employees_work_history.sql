-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `cms_employees_work_history`;
CREATE TABLE `cms_employees_work_history` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `emp_id` int(5) DEFAULT NULL,
  `dept_id` tinyint(4) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `work_start_date` date DEFAULT NULL,
  `work_end_date` date DEFAULT NULL,
  `salary` double DEFAULT NULL,
  `increment_date` date DEFAULT NULL,
  `increment_amount` double DEFAULT NULL,
  `next_increment_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int(5) unsigned DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(5) unsigned DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- 2022-06-24 09:14:29