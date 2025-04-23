<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'app_empresas';

// Função para logs
function logError($message) {
    $logFile = 'alter_table.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

try {
    $conn = new mysqli($db_host, $db_username, $db_password, $db_name);

    if ($conn->connect_error) {
        logError("Connection failed: " . $conn->connect_error);
        echo json_encode(array('status' => 'error', 'message' => 'Database connection failed'));
        exit;
    }
    
    // Alterar a tabela para permitir IDs mais longos
    $sql = "ALTER TABLE employees MODIFY id VARCHAR(30);";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array('status' => 'success', 'message' => 'Tabela alterada com sucesso'));
    } else {
        logError("Error altering table: " . $conn->error);
        echo json_encode(array('status' => 'error', 'message' => 'Error altering table: ' . $conn->error));
    }
    
    $conn->close();
} catch (Exception $e) {
    logError("Exception: " . $e->getMessage());
    echo json_encode(array('status' => 'error', 'message' => 'Exception: ' . $e->getMessage()));
}
?> 