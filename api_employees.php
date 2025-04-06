<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'app_empresas';

$conn = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create employees table if not exists
$sql = "CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    digital_signature BOOLEAN DEFAULT 0
)";

if (!$conn->query($sql)) {
    echo json_encode(array('status' => 'error', 'message' => 'Error creating table: ' . $conn->error));
    $conn->close();
    exit;
}

$response = array();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'getNextId':
                    // Get the highest ID and increment
                    $sql = "SELECT id FROM employees ORDER BY id DESC LIMIT 1";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        $lastId = $row['id'];
                        // Extract the number part and increment
                        $numPart = intval(substr($lastId, 3)); // Assuming format EMP001
                        $nextNum = $numPart + 1;
                        $nextId = 'EMP' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
                    } else {
                        // No employees yet, start with EMP001
                        $nextId = 'EMP001';
                    }
                    
                    $response = array('status' => 'success', 'nextId' => $nextId);
                    break;
                    
                case 'registerEmployee':
                    $id = $conn->real_escape_string($data['id']);
                    $name = $conn->real_escape_string($data['name']);
                    $position = $conn->real_escape_string($data['position']);
                    $department = $conn->real_escape_string($data['department']);
                    $digitalSignature = isset($data['digitalSignature']) ? ($data['digitalSignature'] ? 1 : 0) : 0;
                    
                    $sql = "INSERT INTO employees (id, name, position, department, digital_signature) 
                            VALUES ('$id', '$name', '$position', '$department', $digitalSignature)";
                    
                    if ($conn->query($sql) === TRUE) {
                        $response = array('status' => 'success', 'message' => 'Funcionário cadastrado com sucesso');
                    } else {
                        $response = array('status' => 'error', 'message' => 'Erro ao cadastrar: ' . $conn->error);
                    }
                    break;
                    
                case 'getEmployees':
                    $sql = "SELECT * FROM employees ORDER BY id";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
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
                        $response = array('status' => 'success', 'employees' => array());
                    }
                    break;
                    
                case 'updateDigitalSignature':
                    $id = $conn->real_escape_string($data['id']);
                    $digitalSignature = $data['digitalSignature'] ? 1 : 0;
                    
                    $sql = "UPDATE employees SET digital_signature = $digitalSignature WHERE id = '$id'";
                    
                    if ($conn->query($sql) === TRUE) {
                        $response = array('status' => 'success', 'message' => 'Assinatura digital atualizada com sucesso');
                    } else {
                        $response = array('status' => 'error', 'message' => 'Erro ao atualizar assinatura: ' . $conn->error);
                    }
                    break;
                    
                case 'deleteEmployee':
                    $id = $conn->real_escape_string($data['id']);
                    
                    $sql = "DELETE FROM employees WHERE id = '$id'";
                    
                    if ($conn->query($sql) === TRUE) {
                        $response = array('status' => 'success', 'message' => 'Funcionário removido com sucesso');
                    } else {
                        $response = array('status' => 'error', 'message' => 'Erro ao remover funcionário: ' . $conn->error);
                    }
                    break;
                    
                default:
                    $response = array('status' => 'error', 'message' => 'Ação não reconhecida');
                    break;
            }
        } else {
            $response = array('status' => 'error', 'message' => 'Parâmetro de ação não especificado');
        }
        break;
        
    default:
        $response = array('status' => 'error', 'message' => 'Método não permitido');
        break;
}

$conn->close();
echo json_encode($response);
?> 