<?php

session_start();

require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once RUTA_USUARIO_MODEL;
require_once RUTA_USUARIO_DAO;

// Verificar que se reciban los datos del formulario
if (!isset($_POST['login-email'], $_POST['login-password'])) {
    echo "Error al iniciar sesión: Datos de inicio de sesión no proporcionados.";
    exit();
}

$email = $_POST['login-email'];
$password = $_POST['login-password'];

try {
    // Buscar usuario por correo
    $user = findUserByEmail($email);

    if ($user && password_verify($password, $user['contrasenya'])) {
        
        // Crear objeto Usuario (opcional, según cómo lo uses)
        $usuario = new Usuario($user['nombre'], $user['apellidos'], $user['correo'], null, $user['id']);
        
        // Guardar en sesión (puede ser el objeto o solo los datos)
        $_SESSION['usuario'] = [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'correo' => $user['correo']
        ];

        // Redirigir al usuario
        header("Location: ../view/seleccionEmpresa.php");
        exit();

    } else {
        echo "Credenciales incorrectas.";
        // Podés redirigir a un login con mensaje también
        // header("Location: login.php?error=1");
    }

} catch (PDOException $e) {
    // Mostrar error (¡mejor usar logging real en producción!)
    echo "Error al iniciar sesión: " . $e->getMessage();
}
