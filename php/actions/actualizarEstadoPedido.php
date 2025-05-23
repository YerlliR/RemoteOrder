<?php
session_start();
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../dao/PedidoDao.php';

// Verificar autenticación
if (!isset($_SESSION['usuario']) || !isset($_SESSION['empresa']['id'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Usuario no autorizado']);
    exit;
}

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

try {
    // Obtener datos
    $data = json_decode(file_get_contents('php://input'), true);
    
    $pedidoId = isset($data['pedidoId']) ? (int)$data['pedidoId'] : 0;
    $nuevoEstado = isset($data['estado']) ? $data['estado'] : '';
    
    // Validar datos
    if (!$pedidoId || !in_array($nuevoEstado, ['pendiente', 'procesando', 'completado', 'cancelado'])) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'Datos inválidos']);
        exit;
    }
    
    // Verificar que el pedido existe y el usuario tiene acceso
    $pedido = findPedidoById($pedidoId);
    if (!$pedido) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'Pedido no encontrado']);
        exit;
    }
    
    // Obtener ID de empresa del usuario
    $idEmpresa = $_SESSION['empresa']['id'];
    if (is_array($idEmpresa)) {
        $idEmpresa = $idEmpresa[0];
    }
    
    // Verificar permisos según el tipo de cambio
    $esProveedor = ($pedido->getIdEmpresaProveedor() == $idEmpresa);
    $esCliente = ($pedido->getIdEmpresaCliente() == $idEmpresa);
    
    // Solo el proveedor puede cambiar a procesando o completado
    if (($nuevoEstado == 'procesando' || $nuevoEstado == 'completado') && !$esProveedor) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'No tienes permiso para realizar esta acción']);
        exit;
    }
    
    // Solo el cliente puede cancelar un pedido pendiente
    if ($nuevoEstado == 'cancelado' && !$esCliente) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'No tienes permiso para cancelar este pedido']);
        exit;
    }
    
    // Actualizar estado
    $resultado = actualizarEstadoPedido($pedidoId, $nuevoEstado);
    
    if ($resultado) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'mensaje' => 'Estado actualizado correctamente'
        ]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'No se pudo actualizar el estado']);
    }
    
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error: ' . $e->getMessage()
    ]);
}
?>