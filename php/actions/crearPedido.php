<?php
session_start();
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../model/Pedido.php';
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
    // Obtener datos del pedido
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos requeridos
    if (!isset($data['idProveedor']) || !isset($data['productos']) || empty($data['productos'])) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
        exit;
    }
    
    // Obtener ID de empresa cliente desde la sesión
    $idEmpresaCliente = $_SESSION['empresa']['id'];
    if (is_array($idEmpresaCliente)) {
        $idEmpresaCliente = $idEmpresaCliente[0];
    }
    $idEmpresaCliente = (int)$idEmpresaCliente;
    
    // Crear nuevo pedido
    $pedido = new Pedido();
    $pedido->setIdEmpresaCliente($idEmpresaCliente);
    $pedido->setIdEmpresaProveedor((int)$data['idProveedor']);
    $pedido->setFechaEntregaEstimada($data['fechaEntrega'] ?? null);
    $pedido->setNotas($data['notas'] ?? null);
    $pedido->setDireccionEntrega($data['direccionEntrega'] ?? null);
    
    // Agregar líneas de pedido
    foreach ($data['productos'] as $prod) {
        if ($prod['cantidad'] > 0) {
            $linea = new PedidoLinea(
                null,
                null,
                $prod['id'],
                $prod['cantidad'],
                $prod['precio'],
                $prod['iva']
            );
            $pedido->agregarLinea($linea);
        }
    }
    
    // Validar que hay al menos una línea
    if (count($pedido->getLineas()) === 0) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'Debe seleccionar al menos un producto']);
        exit;
    }
    
    // Crear pedido en la base de datos
    $pedidoId = crearPedido($pedido);
    
    if ($pedidoId) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'mensaje' => 'Pedido creado correctamente',
            'pedidoId' => $pedidoId
        ]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'Error al crear el pedido']);
    }
    
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error: ' . $e->getMessage()
    ]);
}
?>