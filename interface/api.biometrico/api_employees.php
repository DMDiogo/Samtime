<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'app_empresas';

// Create error log function
function logError($message) {
    $logFile = 'api_error.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Try to connect to the database
try {
    $conn = new mysqli($db_host, $db_username, $db_password, $db_name);

    if ($conn->connect_error) {
        logError("Connection failed: " . $conn->connect_error);
        echo json_encode(array('status' => 'error', 'message' => 'Database connection failed'));
        exit;
    }
    
    // Tenta alterar o tamanho da coluna id para acomodar novos formatos de ID
    $alterTableSQL = "ALTER TABLE employees MODIFY id VARCHAR(30);";
    if (!$conn->query($alterTableSQL)) {
        logError("Warning: Could not alter table column size: " . $conn->error);
        // Continua mesmo se falhar, pois a tabela pode já estar com o tamanho correto
    } else {
        logError("Successfully altered employees table to increase id field size");
    }
    
} catch (Exception $e) {
    logError("Exception connecting to database: " . $e->getMessage());
    echo json_encode(array('status' => 'error', 'message' => 'Database connection exception'));
    exit;
}

// Create employees table if not exists
$sql = "CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    digital_signature BOOLEAN DEFAULT 0,
    empresa_id INT(11) NOT NULL
)";

if (!$conn->query($sql)) {
    logError("Error creating table: " . $conn->error);
    echo json_encode(array('status' => 'error', 'message' => 'Error creating table: ' . $conn->error));
    $conn->close();
    exit;
}

$response = array();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Get the raw POST data
        $rawPostData = file_get_contents("php://input");
        logError("Raw POST data: " . $rawPostData);
        
        // Try to parse the JSON data
        $data = json_decode($rawPostData, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            logError("JSON parse error: " . json_last_error_msg());
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON: ' . json_last_error_msg()));
            break;
        }
        
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'getNextId':
                    // Verificar se o empresa_id foi fornecido
                    if (!isset($data['empresa_id']) || empty($data['empresa_id'])) {
                        logError("Missing empresa_id for getNextId");
                        $response = array('status' => 'error', 'message' => 'ID da empresa não fornecido');
                        break;
                    }

                    $empresaId = intval($data['empresa_id']);
                    
                    // Get the highest ID and increment for this specific company
                    $sql = "SELECT id FROM employees WHERE empresa_id = $empresaId ORDER BY id DESC LIMIT 1";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        $lastId = $row['id'];
                        
                        // Extrair apenas o número sequencial (ignorando o prefixo da empresa)
                        // Se o formato for EMP-123-001, obtemos apenas o 001
                        $parts = explode('-', $lastId);
                        $numPart = isset($parts[2]) ? intval($parts[2]) : 1;
                        $nextNum = $numPart + 1;
                        $nextId = 'EMP-' . $empresaId . '-' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
                    } else {
                        // Nenhum funcionário ainda, começar com 001
                        $nextId = 'EMP-' . $empresaId . '-001';
                    }
                    
                    $response = array('status' => 'success', 'nextId' => $nextId);
                    break;
                    
                case 'registerEmployee':
                    if (!isset($data['id']) || !isset($data['name']) || !isset($data['position']) || !isset($data['department'])) {
                        logError("Missing required fields for registerEmployee");
                        $response = array('status' => 'error', 'message' => 'Missing required fields');
                        break;
                    }
                    
                    // Verificar se o empresa_id foi fornecido
                    if (!isset($data['empresa_id']) || empty($data['empresa_id'])) {
                        logError("Missing empresa_id for registerEmployee");
                        $response = array('status' => 'error', 'message' => 'ID da empresa não fornecido');
                        break;
                    }
                    
                    $id = $conn->real_escape_string($data['id']);
                    $name = $conn->real_escape_string($data['name']);
                    $position = $conn->real_escape_string($data['position']);
                    $department = $conn->real_escape_string($data['department']);
                    $digitalSignature = isset($data['digitalSignature']) ? ($data['digitalSignature'] ? 1 : 0) : 0;
                    $empresaId = intval($data['empresa_id']);
                    
                    $sql = "INSERT INTO employees (id, name, position, department, digital_signature, empresa_id) 
                            VALUES ('$id', '$name', '$position', '$department', $digitalSignature, $empresaId)";
                    
                    if ($conn->query($sql) === TRUE) {
                        $response = array('status' => 'success', 'message' => 'Funcionário cadastrado com sucesso');
                    } else {
                        logError("Error registering employee: " . $conn->error);
                        $response = array('status' => 'error', 'message' => 'Erro ao cadastrar: ' . $conn->error);
                    }
                    break;
                    
                case 'getEmployees':
                    // Verificar se o empresa_id foi fornecido
                    if (!isset($data['empresa_id']) || empty($data['empresa_id'])) {
                        logError("Missing empresa_id for getEmployees");
                        $response = array('status' => 'error', 'message' => 'ID da empresa não fornecido');
                        break;
                    }
                    
                    $empresaId = intval($data['empresa_id']);
                    
                    // Filtrar funcionários pelo ID da empresa
                    $sql = "SELECT * FROM employees WHERE empresa_id = $empresaId ORDER BY id";
                    logError("Executing SQL: " . $sql);
                    $result = $conn->query($sql);
                    
                    if ($result) {
                        $employees = array();
                        while ($row = $result->fetch_assoc()) {
                            // Convert DB format to the format expected by the app
                            $employee = array(
                                'id' => $row['id'],
                                'name' => $row['name'],
                                'position' => $row['position'],
                                'department' => $row['department'],
                                'digitalSignature' => (bool)$row['digital_signature']
                            );
                            $employees[] = $employee;
                        }
                        $response = array('status' => 'success', 'employees' => $employees);
                    } else {
                        logError("Error fetching employees: " . $conn->error);
                        $response = array('status' => 'error', 'message' => 'Error fetching employees: ' . $conn->error);
                    }
                    break;
                    
                case 'updateDigitalSignature':
                    if (!isset($data['id'])) {
                        logError("Missing ID for updateDigitalSignature");
                        $response = array('status' => 'error', 'message' => 'Missing employee ID');
                        break;
                    }
                    
                    // Verificar se o empresa_id foi fornecido
                    if (!isset($data['empresa_id']) || empty($data['empresa_id'])) {
                        logError("Missing empresa_id for updateDigitalSignature");
                        $response = array('status' => 'error', 'message' => 'ID da empresa não fornecido');
                        break;
                    }
                    
                    $id = $conn->real_escape_string($data['id']);
                    $digitalSignature = isset($data['digitalSignature']) ? ($data['digitalSignature'] ? 1 : 0) : 0;
                    $empresaId = intval($data['empresa_id']);
                    
                    // Atualizar apenas funcionários da empresa específica
                    $sql = "UPDATE employees SET digital_signature = $digitalSignature 
                            WHERE id = '$id' AND empresa_id = $empresaId";
                    
                    if ($conn->query($sql) === TRUE) {
                        $response = array('status' => 'success', 'message' => 'Assinatura digital atualizada com sucesso');
                    } else {
                        logError("Error updating signature: " . $conn->error);
                        $response = array('status' => 'error', 'message' => 'Erro ao atualizar assinatura: ' . $conn->error);
                    }
                    break;
                    
                case 'deleteEmployee':
                    if (!isset($data['id'])) {
                        logError("Missing ID for deleteEmployee");
                        $response = array('status' => 'error', 'message' => 'Missing employee ID');
                        break;
                    }
                    
                    // Verificar se o empresa_id foi fornecido
                    if (!isset($data['empresa_id']) || empty($data['empresa_id'])) {
                        logError("Missing empresa_id for deleteEmployee");
                        $response = array('status' => 'error', 'message' => 'ID da empresa não fornecido');
                        break;
                    }
                    
                    $id = $conn->real_escape_string($data['id']);
                    $empresaId = intval($data['empresa_id']);
                    
                    // Excluir apenas funcionários da empresa específica
                    $sql = "DELETE FROM employees WHERE id = '$id' AND empresa_id = $empresaId";
                    
                    if ($conn->query($sql) === TRUE) {
                        $response = array('status' => 'success', 'message' => 'Funcionário removido com sucesso');
                    } else {
                        logError("Error deleting employee: " . $conn->error);
                        $response = array('status' => 'error', 'message' => 'Erro ao remover funcionário: ' . $conn->error);
                    }
                    break;
                    
                default:
                    logError("Unrecognized action: " . $data['action']);
                    $response = array('status' => 'error', 'message' => 'Ação não reconhecida');
                    break;
            }
        } else {
            logError("No action specified in request");
            $response = array('status' => 'error', 'message' => 'Parâmetro de ação não especificado');
        }
        break;
        
    case 'GET':
        // Add a simple GET handler for testing connectivity
        $response = array(
            'status' => 'success', 
            'message' => 'API is running correctly',
            'version' => '1.0'
        );
        break;
        
    default:
        logError("Method not allowed: " . $method);
        $response = array('status' => 'error', 'message' => 'Método não permitido');
        break;
}

$conn->close();
echo json_encode($response);
?> 