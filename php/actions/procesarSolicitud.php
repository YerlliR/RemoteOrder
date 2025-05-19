<?php
session_start();
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../model/Solicitud.php';
require_once '../dao/SolicitudDao.php';

// Para depuración, registremos los mensajes de error
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

try {
    // Obtener los datos del formulario (formato JSON)
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Registrar los datos recibidos para depuración
    error_log("Datos recibidos: " . print_r($data, true));
    
    // Verificar que se recibieron todos los datos necesarios
    if (!isset($data['id_empresa_proveedor']) || !isset($data['asunto']) || !isset($data['mensaje'])) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
        exit;
    }
    
    // Obtener ID de empresa desde la sesión
    $idEmpresaSolicitante = $_SESSION['empresa']['id'];
    
    // Si el ID de empresa es un array (a veces sucede en la sesión)
    if (is_array($idEmpresaSolicitante)) {
        $idEmpresaSolicitante = $idEmpresaSolicitante[0]; // Tomar el primer elemento
    }
    
    // Asegurarse de que sea un entero
    $idEmpresaSolicitante = (int)$idEmpresaSolicitante;
    
    $idEmpresaProveedor = $data['id_empresa_proveedor'];
    $asunto = $data['asunto'];
    $mensaje = $data['mensaje'];
    
    // Registrar los valores para depuración
    error_log("ID Empresa Solicitante: " . $idEmpresaSolicitante);
    error_log("ID Empresa Proveedor: " . $idEmpresaProveedor);
    
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
        echo json_encode(['success' => false, 'mensaje' => 'Error al guardar en la base de datos']);
    }
} catch (Exception $e) {
    // Capturar cualquier excepción y enviar respuesta de error
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
    
    // Registrar el error
    error_log("Error en procesarSolicitud.php: " . $e->getMessage());
}
?>