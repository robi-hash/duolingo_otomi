<?php
session_start();
require_once "conexion.php";
?>
<?php

session_start();

require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['id_usuario'])) {

    echo json_encode([
        'success' => false,
        'mensaje' => 'No hay una sesión iniciada.'
    ]);

    exit();
}

$id_usuario = $_SESSION['id_usuario'];

$sql = "
    SELECT
        u.Nombre AS nombre,
        u.Email AS email,
        u.Pais AS pais,
        u.Nivel AS nivel,
        u.Fecha_registro AS fecha_ingreso,

        COALESCE(p.Porcentaje, 0) AS porcentaje,
        COALESCE(p.Experiencia, 0) AS experiencia,
        COALESCE(p.Racha, 0) AS racha

    FROM USUARIO u

    LEFT JOIN PROGRESO p
        ON u.Id_usuario = p.Id_usuario

    WHERE u.Id_usuario = ?

    ORDER BY p.Fecha_registro DESC

    LIMIT 1
";

$stmt = $conn->prepare($sql);

if (!$stmt) {

    echo json_encode([
        'success' => false,
        'mensaje' => 'Error al preparar la consulta.'
    ]);

    exit();
}

$stmt->bind_param("i", $id_usuario);

$stmt->execute();

$resultado = $stmt->get_result();

if ($fila = $resultado->fetch_assoc()) {

    echo json_encode([
        'success' => true,
        'datos' => $fila
    ], JSON_UNESCAPED_UNICODE);

} else {

    echo json_encode([
        'success' => false,
        'mensaje' => 'No se encontró el usuario.'
    ]);

}

$stmt->close();
$conn->close();

?>
