-- phpMyAdmin SQL Dump
-- version 3.3.8.1
-- http://www.phpmyadmin.net
--
-- 主机: w.rdc.sae.sina.com.cn:3307
-- 生成日期: 2014 年 06 月 24 日 23:02
-- 服务器版本: 5.5.23
-- PHP 版本: 5.3.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `app_receiptocr`
--
CREATE DATABASE `app_receiptocr` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `app_receiptocr`;

-- --------------------------------------------------------

--
-- 表的结构 `workflow`
--

CREATE TABLE IF NOT EXISTS `workflow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `currentstep` varchar(100) NOT NULL,
  `userid` varchar(100) NOT NULL,
  `data` varchar(1000) DEFAULT NULL,
  `datecreate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `workflow`
--

