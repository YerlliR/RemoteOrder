<?php
// Archivo: php/actions/actualizarSolicitud.php
session_start();
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../dao/SolicitudDao.php';
require_once '../dao/RelacionesEmpresaDao.php'; // Nuevo DAO para relaciones

// Check if user is logged in and has a selected company
if (!isset($_SESSION['usuario']) || !isset($_SESSION['empresa']['id'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Usuario no autorizado']);
    exit;
}

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

// Get the solicitud ID and action
$solicitudId = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$accion = isset($_POST['accion']) ? $_POST['accion'] : '';

// Validate inputs
if (!$solicitudId || !in_array($accion, ['aceptar', 'rechazar'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Datos inválidos']);
    exit;
}

try {
    // Map action to estado
    $estado = ($accion === 'aceptar') ? 'aceptada' : 'rechazada';
    
    // Get the solicitud details before updating
    $solicitud = findSolicitudById($solicitudId);
    
    if (!$solicitud) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'Solicitud no encontrada']);
        exit;
    }
    
    // Update the solicitud estado
    $resultado = actualizarEstadoSolicitud($solicitudId, $estado);
    
    // If the solicitud was accepted, create a client-provider relationship
    if ($resultado && $accion === 'aceptar') {
        $idCliente = $solicitud->getIdEmpresaSolicitante();
        $idProveedor = $solicitud->getIdEmpresaProveedor();
        
        // Create the relationship
        crearRelacionEmpresa($idCliente, $idProveedor, $solicitudId);
    }
    
    // Return the result
    header('Content-Type: application/json');
    if ($resultado) {
        echo json_encode([
            'success' => true, 
            'mensaje' => 'Solicitud ' . ($accion === 'aceptar' ? 'aceptada' : 'rechazada') . ' correctamente'
        ]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'No se pudo actualizar la solicitud']);
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
}
?>