<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../db/conexionDb.php';
require_once '../dao/ProductoDao.php';
require_once '../includes/alert_helper.php'; // ← NUEVA LÍNEA

session_start(); // Añadir sesión para las alertas

header('Content-Type: application/json'); // ← IMPORTANTE: Respuesta JSON

if (isset($_POST['idProducto'])) {
    $idProducto = $_POST['idProducto'];

    try {
        $result = eliminarProducto($idProducto);

        if ($result) {
            echo AlertHelper::jsonResponse(true, 'El producto se ha eliminado correctamente de tu catálogo', [], 'Producto Eliminado');
        } else {
            echo AlertHelper::jsonResponse(false, 'No se pudo eliminar el producto. Es posible que ya haya sido eliminado o esté siendo usado en pedidos activos', [], 'Error al Eliminar');
        }
    } catch (Exception $e) {
        echo AlertHelper::jsonResponse(false, 'Error del servidor: ' . $e->getMessage(), [], 'Error del Sistema');
    }
} else {
    echo AlertHelper::jsonResponse(false, 'ID de producto no proporcionado', [], 'Datos Incompletos');
}
?>