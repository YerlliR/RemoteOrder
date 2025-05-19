<?php
session_start();
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../model/Solicitud.php';
require_once '../dao/SolicitudDao.php';

header('index.php');
// Verificar que el usuario está autenticado
if (!isset($_SESSION['usuario']) || !isset($_SESSION['empresa']['id'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Usuario no autorizado']);
    exit;
}

// Verificar que la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

// Obtener los datos del formulario
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se recibieron todos los datos necesarios
if (!isset($data['id_empresa_proveedor']) || !isset($data['asunto']) || !isset($data['mensaje'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

$idEmpresaSolicitante = $_SESSION['empresa']['id'];
$idEmpresaProveedor = $data['id_empresa_proveedor'];
$asunto = $data['asunto'];
$mensaje = $data['mensaje'];

// Crear objeto Solicitud
$solicitud = new Solicitud(
    null, // ID será asignado por la base de datos
    $idEmpresaSolicitante,
    $idEmpresaProveedor,
    $asunto,
    $mensaje,
    'pendiente', // Estado inicial
    date('Y-m-d H:i:s') // Fecha actual
);

// Guardar solicitud en la base de datos
$resultado = guardarSolicitud($solicitud);

// Responder al cliente
header('Content-Type: application/json');
if ($resultado) {
    echo json_encode(['success' => true, 'mensaje' => 'Solicitud enviada correctamente']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al enviar la solicitud']);
}
?>