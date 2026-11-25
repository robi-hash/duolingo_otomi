<?php
session_start();
require_once "conexion.php";
?>
<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['id_usuario'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "mensaje" => "Debes iniciar sesión."
    ]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "otomi_daaiko";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "mensaje" => "Error de conexión."
    ]);
    exit();
}

$datos = json_decode(file_get_contents("php://input"), true);

$experienciaGanada = $datos['experienciaGanada'] ?? null;

if (!is_numeric($experienciaGanada) ||
    (int)$experienciaGanada < 0 ||
    (int)$experienciaGanada != $experienciaGanada) {

    http_response_code(400);
    echo json_encode([
        "success" => false,
        "mensaje" => "La experiencia enviada no es válida."
    ]);
    exit();
}

$experienciaGanada = (int)$experienciaGanada;
$idUsuario = (int)$_SESSION['id_usuario'];

$sql = "UPDATE PROGRESO
        SET Experiencia = COALESCE(Experiencia, 0) + ?,
            Racha = COALESCE(Racha, 0) + 1,
            Porcentaje = LEAST(COALESCE(Porcentaje, 0) + 5, 100),
            Fecha_registro = CURDATE()
        WHERE Id_usuario = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $experienciaGanada, $idUsuario);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode([
        "success" => true,
        "mensaje" => "Progreso actualizado correctamente."
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "mensaje" => "No se encontró un registro de progreso para este usuario."
    ]);
}

$stmt->close();
$conn->close();
?>
