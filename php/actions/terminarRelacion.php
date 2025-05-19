<?php
    session_start();
    require_once '../constantes/constantesRutas.php';
    require_once RUTA_DB;
    require_once '../dao/RelacionesEmpresaDao.php';

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

    // Obtener el ID de la relación
    $relacionId = isset($_POST['relacionId']) ? (int)$_POST['relacionId'] : 0;

    // Validar input
    if (!$relacionId) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'ID de relación inválido']);
        exit;
    }

    try {
        // Terminar la relación
        $resultado = terminarRelacionEmpresa($relacionId);
        
        // Enviar respuesta
        header('Content-Type: application/json');
        if ($resultado) {
            echo json_encode([
                'success' => true, 
                'mensaje' => 'Relación terminada correctamente'
            ]);
        } else {
            echo json_encode(['success' => false, 'mensaje' => 'No se pudo terminar la relación']);
        }
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
    }
?>