<?php
// Ejemplo de integración del sistema de alertas en PHP
// Archivo: php/includes/alert_helper.php

class AlertHelper {
    
    /**
     * Añadir alerta a la sesión para mostrar en la siguiente página
     */
    public static function addAlert($type, $message, $title = '') {
        if (!isset($_SESSION['alerts'])) {
            $_SESSION['alerts'] = [];
        }
        
        $_SESSION['alerts'][] = [
            'type' => $type,
            'message' => $message,
            'title' => $title,
            'timestamp' => time()
        ];
    }
    
    /**
     * Métodos de conveniencia para diferentes tipos de alertas
     */
    public static function success($message, $title = 'Éxito') {
        self::addAlert('success', $message, $title);
    }
    
    public static function error($message, $title = 'Error') {
        self::addAlert('error', $message, $title);
    }
    
    public static function warning($message, $title = 'Atención') {
        self::addAlert('warning', $message, $title);
    }
    
    public static function info($message, $title = 'Información') {
        self::addAlert('info', $message, $title);
    }
    
    /**
     * Obtener alertas y limpiar la sesión
     */
    public static function getAlerts() {
        if (!isset($_SESSION['alerts'])) {
            return [];
        }
        
        $alerts = $_SESSION['alerts'];
        unset($_SESSION['alerts']);
        return $alerts;
    }
    
    /**
     * Generar JavaScript para mostrar alertas
     */
    public static function renderAlertsScript() {
        $alerts = self::getAlerts();
        if (empty($alerts)) {
            return '';
        }
        
        $script = '<script>';
        $script .= 'document.addEventListener("DOMContentLoaded", function() {';
        
        foreach ($alerts as $alert) {
            $message = addslashes($alert['message']);
            $title = addslashes($alert['title']);
            $type = $alert['type'];
            
            $script .= "showAlert({";
            $script .= "type: '{$type}',";
            $script .= "title: '{$title}',";
            $script .= "message: '{$message}'";
            $script .= "});";
        }
        
        $script .= '});';
        $script .= '</script>';
        
        return $script;
    }
    
    /**
     * Respuesta JSON con alerta incluida
     */
    public static function jsonResponse($success, $message, $data = [], $title = '') {
        $response = [
            'success' => $success,
            'message' => $message,
            'data' => $data
        ];
        
        if ($title) {
            $response['title'] = $title;
        }
        
        // Determinar tipo de alerta basado en el éxito
        $response['alert_type'] = $success ? 'success' : 'error';
        
        return json_encode($response);
    }
}

// Ejemplo de uso en actions/crearProducto.php - MODIFICADO
if (isset($_POST['nombre_producto'])) {
    // ... lógica de validación ...
    
    if (findByCodigoSeguimiento($codigoSeguimiento) == false) {
        // ... lógica de creación ...
        
        $producto = new Producto(/* ... parámetros ... */);
        $resultado = crearProducto($producto);
        
        if ($resultado) {
            AlertHelper::success('El producto se ha creado correctamente', 'Producto Creado');
            header('Location: ../view/productos.php');
        } else {
            AlertHelper::error('No se pudo crear el producto. Intenta de nuevo.', 'Error al Crear');
            header('Location: ../view/creacionProducto.php');
        }
    } else {
        AlertHelper::warning('El código de seguimiento ya existe. Usa uno diferente.', 'Código Duplicado');
        header('Location: ../view/creacionProducto.php');
    }
}

// Ejemplo de uso en actions/eliminarProducto.php - MODIFICADO
if (isset($_POST['idProducto'])) {
    $idProducto = $_POST['idProducto'];
    $result = eliminarProducto($idProducto);

    if ($result) {
        AlertHelper::success('El producto se ha eliminado correctamente');
        echo AlertHelper::jsonResponse(true, 'Producto eliminado correctamente');
    } else {
        AlertHelper::error('No se pudo eliminar el producto');
        echo AlertHelper::jsonResponse(false, 'Error al eliminar el producto');
    }
} else {
    echo AlertHelper::jsonResponse(false, 'ID de producto no proporcionado');
}

// Ejemplo de uso en actions/crearPedido.php - MODIFICADO
try {
    // ... lógica de creación de pedido ...
    
    $pedidoId = crearPedido($pedido);
    
    if ($pedidoId) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(
            true, 
            'Pedido creado correctamente. Número de pedido: #' . $pedido->getNumeroPedido(),
            ['pedidoId' => $pedidoId],
            'Pedido Enviado'
        );
    } else {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'Error al procesar el pedido. Intenta de nuevo.');
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Error del servidor: ' . $e->getMessage());
}

// Ejemplo de uso en actions/actualizarEstadoPedido.php - MODIFICADO
try {
    $resultado = actualizarEstadoPedido($pedidoId, $nuevoEstado);
    
    if ($resultado) {
        $mensajes = [
            'procesando' => 'El pedido está siendo procesado',
            'completado' => 'El pedido se ha completado exitosamente',
            'cancelado' => 'El pedido ha sido cancelado'
        ];
        
        $mensaje = $mensajes[$nuevoEstado] ?? 'Estado actualizado correctamente';
        
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(true, $mensaje, [], 'Estado Actualizado');
    } else {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'No se pudo actualizar el estado del pedido');
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Error: ' . $e->getMessage());
}

?>