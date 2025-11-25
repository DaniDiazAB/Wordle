<?php
header('Content-Type: application/json'); // Para que Vue lo interprete como JSON
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'diccionario';
$user = 'root';
$pass = '';

// Crear conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Conexión fallida: ' . $conn->connect_error]));
}

// Consulta ejemplo
$sql = "SELECT traduccion_palabra FROM palabras WHERE traduccion_palabra NOT LIKE '% %'";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Devolver datos como JSON
echo json_encode($data);

$conn->close();
?>
