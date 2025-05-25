<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../dao/RelacionesEmpresaDao.php';
require_once '../includes/alert_helper.php'; // ← NUEVA LÍNEA

// Verificar que el usuario está autenticado
if (!isset($_SESSION['usuario']) || !isset($_SESSION['empresa']['id'])) {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente', [], 'Sesión Expirada');
    exit;
}

// Verificar que la solicitud es de tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Método de solicitud no válido', [], 'Método Incorrecto');
    exit;
}

// Obtener el ID de la relación
$relacionId = isset($_POST['relacionId']) ? (int)$_POST['relacionId'] : 0;

// Validar input
if (!$relacionId) {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'ID de relación no válido o faltante', [], 'Datos Inválidos');
    exit;
}

try {
    // Verificar que la relación existe y pertenece a la empresa actual
    // (Aquí podrías añadir una validación adicional para verificar permisos)
    
    // Terminar la relación
    $resultado = terminarRelacionEmpresa($relacionId);
    
    // Enviar respuesta
    header('Content-Type: application/json');
    if ($resultado) {
        echo AlertHelper::jsonResponse(true, 'La relación comercial se ha terminado correctamente. El proveedor ya no aparecerá en tu lista.', [], 'Relación Terminada');
    } else {
        echo AlertHelper::jsonResponse(false, 'No se pudo terminar la relación. Es posible que ya haya sido eliminada anteriormente.', [], 'Error al Terminar');
    }
} catch (Exception $e) {
    error_log("Error en terminarRelacion.php: " . $e->getMessage());
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Error del sistema. Inténtalo de nuevo más tarde.', [], 'Error del Sistema');
}
?>
