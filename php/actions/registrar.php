<?php
include_once '../constantes/constantesRutas.php';  
include_once RUTA_DB;
include_once RUTA_USUARIO_MODEL;
include_once RUTA_USUARIO_DAO;

// Comprobamos si se han enviado los datos del formulario
if($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificamos que todos los campos necesarios existen
    if(isset($_POST['signup-name']) && isset($_POST['signup-email']) && isset($_POST['signup-password']) && isset($_POST['signup-confirm-password'])) {
        $name = $_POST['signup-name'];
        $email = $_POST['signup-email'];
        $password = $_POST['signup-password'];
        $confirmPassword = $_POST['signup-confirm-password'];

        // Verificar si el correo ya existe en la base de datos
        $correoExistente = correoExistente($email);

        if($password == $confirmPassword) {
            if(filter_var($email, FILTER_VALIDATE_EMAIL) && $correoExistente == false) {
                // Separación de nombre y apellidos
                $nombreDividido = explode(" ", trim($name));

                $nombre = array_shift($nombreDividido);
                $apellidos = implode(" ", $nombreDividido);

                // Encriptar contraseña
                $password = password_hash($password, PASSWORD_DEFAULT);

                try {
                    // Registrar usuario en la base de datos
                    registrarUsuario($nombre, $apellidos, $email, $password);
                    
                    // Redirigir al usuario a la página de inicio de sesión
                    header("Location: ../view/login.php");
                    exit();
                } catch (Exception $e) {
                    echo "Error al registrar: " . $e->getMessage();
                }
            } else {
                if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    echo "El formato del correo electrónico no es válido.";
                } else {
                    echo "El correo electrónico ya está registrado.";
                }
            }
        } else {
            echo "Las contraseñas no coinciden.";
        }
    } else {
        echo "Error: Todos los campos son obligatorios.";
    }
} else {
    echo "Error al registrar usuario: Método no permitido.";
}
?>