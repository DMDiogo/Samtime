-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23-Abr-2025 às 20:57
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
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `digital_signature` tinyint(1) DEFAULT 0,
  `empresa_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `employees`
--

INSERT INTO `employees` (`id`, `name`, `position`, `department`, `digital_signature`, `empresa_id`) VALUES
('EMP001', 'Ud7f7r7t7', 'Ufuf7f', '8yg8g8', 0, 1),
('EMP002', 'Hop0', 'Kpoii', 'Iop', 0, 1);

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
(1, 'Diogo oliveira', 'diogo@gmail.com', '$2y$10$00fS4Fbpvg3GtgtVbPS9j.4.AArOlVTduD10h72Sy/HJ6kAlp5uQu', '2025-04-05 12:59:49'),
(4, 'Diogo_sousa33 ', 'diogo33@gmail.com', '$2y$10$4JvwdU.PSz7CiCpW3ghvruNZBsSUyH5Pm2n2K9NualCikCQ6XIeRe', '2025-04-05 13:35:55'),
(6, 'Diogo', 'diogo6@gmail.com', '$2y$10$4.yuQxRzlfypC7O3dbLGK.sR5R9n09qivv02SObYD6E7qj6ZLlI9u', '2025-04-05 18:50:31'),
(8, 'Diogo dm', 'diogo10@gmail.com', '$2y$10$.2hDS5pCLq3ZBZvi6dDvi.exFsHWWLIhqvDVzqm4tjAEnTU3yvGR6', '2025-04-05 19:00:50'),
(10, 'Diogo', 'diogo0@gmail.com', '$2y$10$8hInx9NKy4bjIO9Ep1PLf.4gbnMW/MCBBNn4UBCO2fE9FjsMQmoEW', '2025-04-05 19:08:36'),
(11, 'Josilde ', 'josilde@gmail.com', '$2y$10$USAjX3faCMruq35VepGdQu9iCSKhAG3DJIlYmh7opSdrwj91ccF/.', '2025-04-05 20:16:04'),
(12, 'Ele', 'ele@gmail.com', '$2y$10$UJlRt74s0QDHCYN5Sa21gucheWqVRsvkqCYzI69MIZ1CCF4GJW5d.', '2025-04-22 17:40:24'),
(13, 'Wuwhw', 'jsjjw@gmail.com', '$2y$10$WbTFaotm6pXgszLloI2FPuRnwwAoKhpTaSQ670OH/Gz.0V7d1x28u', '2025-04-23 18:45:37');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
