```php
<?php
session_start();

require_once "conexion.php";

$nombre = trim($_POST['nombre'] ?? '');
$email = trim($_POST['email'] ?? '');
$contrasena = $_POST['contrasena'] ?? '';

if ($nombre === '' || $email === '' || $contrasena === '') {
    die("Completa todos los campos.");
}

$hash = password_hash($contrasena, PASSWORD_DEFAULT);

$sql = "INSERT INTO USUARIO
        (Nombre, Email, Contrasena, Fecha_registro)
        VALUES (?, ?, ?, CURDATE())";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("sss", $nombre, $email, $hash);

if ($stmt->execute()) {
    echo "<script>
        alert('¡Cuenta creada correctamente!');
        window.location.href = 'login.html';
    </script>";
} else {
    if ($conexion->errno === 1062) {
        echo "Ese correo ya está registrado.";
    } else {
        echo "Error al registrar: " . $stmt->error;
    }
}

$stmt->close();
$conexion->close();
?>
```
