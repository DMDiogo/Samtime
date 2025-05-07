-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 04-Maio-2025 às 12:36
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `app_empresas`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `employees`
--

CREATE TABLE `employees` (
  `id` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `digital_signature` tinyint(1) DEFAULT 0,
  `empresa_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `empresas`
--

CREATE TABLE `empresas` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `empresas`
--

INSERT INTO `empresas` (`id`, `nome`, `email`, `senha`, `data_cadastro`) VALUES
(15, 'Jorge', 'Jorge@gmail.com', '$2y$10$s7Ve0HZcXHP42y0g58ofhefH1KSC0oIc0ZCgtg9DET9mmtDrJFYQm', '2025-04-23 19:25:37'),
(16, 'Diogo ', 'dm@gmail.com', '$2y$10$A9TdafBnFTnpgcfs/SnyCOxB5ILd0PMJk3iEuDyDJ3B2ocqRWdhay', '2025-04-23 19:26:03'),
(17, 'Dd@gmail.com', 'dd@gmail.com', '$2y$10$VMSo2m2IUL0TfW4kY2lcPeH9Wi11B4oDZmvOXqiOk8uHxSjwmfiSa', '2025-04-26 18:37:35'),
(20, 'Douglas sola', 'dg@gmail.com', '$2y$10$iRhDS1kL8V4Sxuxbatg5dOdnI7V5SJJOWBol4TMPwzVT9Kf5i3Ii6', '2025-04-30 18:58:21'),
(21, 'FEr', 'fer@gmail.com', '$2y$10$gVkC1tSsNFcgkuHgWA8Y0esHFKcuNWbljVEAyWjzSWl/UdfKVSERy', '2025-05-03 10:59:35'),
(22, 'FFG', 'F@gmail.com', '$2y$10$cH7y6KWv3W8IqTehgOjomurU7Usv542D1Pp5esC74sILKwWPRP/1O', '2025-05-04 10:05:07');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
