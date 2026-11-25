
<?php
session_start();

require_once "conexion.php";

$email = trim($_POST['email'] ?? '');
$pass = $_POST['contrasena'] ?? '';

$stmt = $conexion->prepare(
    "SELECT Id_usuario, Nombre, Email, Contrasena
     FROM USUARIO
     WHERE Email = ?"
);

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

if ($usuario && password_verify($pass, $usuario['Contrasena'])) {

    session_regenerate_id(true);

    $_SESSION['id_usuario'] = $usuario['Id_usuario'];
    $_SESSION['nombre'] = $usuario['Nombre'];
    $_SESSION['email'] = $usuario['Email'];

    header("Location: unidad1.html");
    exit();

} else {
    echo "<script>
        alert('Usuario no encontrado o contraseña incorrecta');
        window.location.href = 'login.html';
    </script>";
}

$stmt->close();
$conexion->close();
?>
