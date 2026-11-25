<?php
$host = "localhost";
$usuario = "root";
$password = ""; // déjalo vacío si no le pusiste contraseña a root
$base_datos = "otomi_daaiko";

$conexion = new mysqli($host, $usuario, $password, $base_datos);

if ($conexion->connect_error) {
    die("❌ Error de conexión: " . $conexion->connect_error);
} else {
    echo "✅ ¡Conexión exitosa! La base de datos está funcionando.";
}

$conexion->close();
?>