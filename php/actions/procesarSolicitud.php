<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../model/Solicitud.php';
require_once '../dao/SolicitudDao.php';
require_once '../includes/alert_helper.php';

// Verificar que el usuario está autenticado
if (!isset($_SESSION['usuario']) || !isset($_SESSION['empresa']['id'])) {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente', [], 'Sesión Expirada');
    exit;
}

// Verificar que la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Método de solicitud no válido', [], 'Error de Solicitud');
    exit;
}

try {
    // Obtener los datos del formulario (formato JSON)
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Verificar que se recibieron datos JSON válidos
    if (!$data) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'Datos de solicitud no válidos', [], 'Datos Inválidos');
        exit;
    }
    
    // Verificar que se recibieron todos los datos necesarios
    if (!isset($data['id_empresa_proveedor']) || !isset($data['asunto']) || !isset($data['mensaje'])) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'Faltan datos obligatorios. Asegúrate de completar todos los campos', [], 'Datos Incompletos');
        exit;
    }
    
    // Limpiar y validar datos
    $asunto = trim($data['asunto']);
    $mensaje = trim($data['mensaje']);
    $idEmpresaProveedor = (int)$data['id_empresa_proveedor'];
    
    // Validar longitud de los campos
    if (strlen($asunto) < 5) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'El asunto debe tener al menos 5 caracteres', [], 'Asunto Muy Corto');
        exit;
    }
    
    if (strlen($asunto) > 100) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'El asunto no puede exceder 100 caracteres', [], 'Asunto Muy Largo');
        exit;
    }
    
    if (strlen($mensaje) < 20) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'El mensaje debe tener al menos 20 caracteres para ser más descriptivo', [], 'Mensaje Muy Corto');
        exit;
    }
    
    if (strlen($mensaje) > 1000) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'El mensaje no puede exceder 1000 caracteres', [], 'Mensaje Muy Largo');
        exit;
    }
    
    // Validar ID del proveedor
    if ($idEmpresaProveedor <= 0) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'ID de proveedor no válido', [], 'Proveedor Inválido');
        exit;
    }
    
    // Obtener ID de empresa desde la sesión
    $idEmpresaSolicitante = $_SESSION['empresa']['id'];
    if (is_array($idEmpresaSolicitante)) {
        $idEmpresaSolicitante = $idEmpresaSolicitante[0];
    }
    $idEmpresaSolicitante = (int)$idEmpresaSolicitante;
    
    // Verificar que no se esté enviando solicitud a sí mismo
    if ($idEmpresaSolicitante === $idEmpresaProveedor) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'No puedes enviarte una solicitud a ti mismo', [], 'Solicitud Inválida');
        exit;
    }
    
    // Verificar si ya existe una solicitud pendiente a esta empresa
    $solicitudesExistentes = findSolicitudesPendientesEnviadas($idEmpresaSolicitante);
    foreach ($solicitudesExistentes as $solicitudExistente) {
        if ($solicitudExistente->getIdEmpresaProveedor() == $idEmpresaProveedor) {
            header('Content-Type: application/json');
            echo AlertHelper::jsonResponse(false, 'Ya tienes una solicitud pendiente con esta empresa. Espera su respuesta antes de enviar otra.', [], 'Solicitud Duplicada');
            exit;
        }
    }
    
    // Crear objeto Solicitud
    $solicitud = new Solicitud(
        null,
        $idEmpresaSolicitante,
        $idEmpresaProveedor,
        $asunto,
        $mensaje,
        'pendiente',
        date('Y-m-d H:i:s')
    );
    
    // Guardar solicitud en la base de datos
    $resultado = guardarSolicitud($solicitud);
    
    // Responder al cliente
    header('Content-Type: application/json');
    if ($resultado) {
        $mensaje = "Tu solicitud '{$asunto}' ha sido enviada correctamente. El proveedor recibirá una notificación y podrá responder a tu solicitud.";
        echo AlertHelper::jsonResponse(true, $mensaje, [], 'Solicitud Enviada');
    } else {
        echo AlertHelper::jsonResponse(false, 'No se pudo enviar la solicitud debido a un error en el servidor', [], 'Error de Envío');
    }
} catch (Exception $e) {
    error_log("Error en procesarSolicitud.php: " . $e->getMessage());
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Se ha producido un error inesperado. Inténtalo de nuevo más tarde.', [], 'Error del Sistema');
}
?>