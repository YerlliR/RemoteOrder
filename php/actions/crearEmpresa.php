<?php  

session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once '../constantes/constantesRutas.php';  
include_once RUTA_DB;
include_once RUTA_EMPRESA_MODEL;
include_once RUTA_EMPRESA_DAO;

if (isset($_POST['nombre']) && isset($_POST['sector']) && isset($_POST['numero_empleados']) && isset($_POST['descripcion']) && isset($_POST['telefono']) && isset($_POST['email']) && isset($_POST['sitio_web']) && isset($_POST['estado']) && isset($_POST['pais']) && isset($_POST['ciudad'])) {
    $nombre = $_POST['nombre'] ?? '';
    $sector = $_POST['sector'] ?? '';
    $numero_empleados = $_POST['numero_empleados'] ?? 0;
    $descripcion = $_POST['descripcion'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $email = $_POST['email'] ?? '';
    $sitio_web = $_POST['sitio_web'] ?? '';
    $estado = isset($_POST['estado']) ? 'Activa' : 'Inactiva';
    $pais = $_POST['pais'] ?? '';
    $ciudad = $_POST['ciudad'] ?? '';

    
    if (isset($_SESSION['usuario']) && isset($_SESSION['usuario']['id'])) {
        $usuario_id = $_SESSION['usuario']['id'];
    } else {
        echo "Error: No hay sesión de usuario activa. Por favor, inicie sesión nuevamente.";

        exit();
    }
    
    $ruta_logo = '';
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] == 0) {
        $nombre_logo = uniqid() . "_" . basename($_FILES['logo']['name']);
        $ruta_destino = RUTA_LOGOS . $nombre_logo;
        
        if (move_uploaded_file($_FILES['logo']['tmp_name'], $ruta_destino)) {
            $ruta_logo = '/uploads/logosEmpresas/' . $nombre_logo;
        }
    }

    $empresa = new Empresa(null, $nombre, $sector, $numero_empleados, $descripcion, $telefono, $email, $sitio_web, $estado, $ruta_logo, $usuario_id, $pais, $ciudad);
    $result = crearEmpresa($empresa);
    
    if ($result > 0) {
        header("Location: ../view/seleccionEmpresa.php");
        exit();
    } else {
        echo "Error al crear la empresa: No se pudo guardar en la base de datos.";
    }
} else {
    echo "Error al crear la empresa: Datos de empresa no proporcionados.";
}
?>
