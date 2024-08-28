-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost
-- 生成日時: 2024 年 8 月 28 日 05:51
-- サーバのバージョン： 8.3.0
-- PHP のバージョン: 8.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `u22`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `Code`
--

CREATE TABLE `Code` (
  `CodeID` int NOT NULL,
  `CodeFilePath` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreateDate` date NOT NULL,
  `UserID` int NOT NULL,
  `CodeCategoryID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `CodeCategory`
--

CREATE TABLE `CodeCategory` (
  `CodeCategoryID` int NOT NULL,
  `CodeCategory` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `CodeCategory`
--

INSERT INTO `CodeCategory` (`CodeCategoryID`, `CodeCategory`) VALUES
(1, 'HTML'),
(2, 'CSS'),
(3, 'JavaScript'),
(4, 'Python');

-- --------------------------------------------------------

--
-- テーブルの構造 `User`
--

CREATE TABLE `User` (
  `UserID` int NOT NULL,
  `UserName` varchar(30) NOT NULL,
  `Password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `User`
--

INSERT INTO `User` (`UserID`, `UserName`, `Password`) VALUES
(1, 'test', 'password');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `Code`
--
ALTER TABLE `Code`
  ADD PRIMARY KEY (`CodeID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `CodeCategoryID` (`CodeCategoryID`);

--
-- テーブルのインデックス `CodeCategory`
--
ALTER TABLE `CodeCategory`
  ADD PRIMARY KEY (`CodeCategoryID`);

--
-- テーブルのインデックス `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`UserID`);

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `Code`
--
ALTER TABLE `Code`
  ADD CONSTRAINT `code_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `code_ibfk_2` FOREIGN KEY (`CodeCategoryID`) REFERENCES `CodeCategory` (`CodeCategoryID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
