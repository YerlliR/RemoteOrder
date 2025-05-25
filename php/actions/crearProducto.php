<?php
// ====== EJEMPLO 1: Modificación de crearProducto.php ======
// Archivo: php/actions/crearProducto.php (MODIFICADO)

session_start();
require_once '../model/Producto.php';
require_once '../dao/ProductoDao.php';
require_once '../includes/alert_helper.php'; // ← NUEVA LÍNEA

if (isset($_POST['codigo_seguimiento']) && isset($_POST['nombre_producto']) && isset($_POST['descripcion']) && isset($_POST['id_categoria']) && isset($_POST['precio']) && isset($_POST['iva'])) {
    
    $codigoSeguimiento = $_POST['codigo_seguimiento'];
    $nombreProducto = $_POST['nombre_producto'];
    $descripcion = $_POST['descripcion'];
    $idCategoria = $_POST['id_categoria'];
    $precio = $_POST['precio'];
    $iva = $_POST['iva'];
    $activo = $_POST['activo'];
    
    if (isset($_POST['activo'])) {
        $activo = true;
    }

    // Verificar si el código ya existe
    if (findByCodigoSeguimiento($codigoSeguimiento) == false) {
        $ruta_imagen_producto = '';
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
            $nombre_imagen = uniqid() . "_" . basename($_FILES['imagen']['name']);
            $ruta_destino = '../../uploads/imagenesProductos/' . $nombre_imagen;
            
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta_destino)) {
                $ruta_imagen_producto = '/uploads/imagenesProductos/' . $nombre_imagen;
            } else {
                // Error al subir imagen
                AlertHelper::error('No se pudo subir la imagen del producto', 'Error de Archivo');
                header('Location: ../view/creacionProducto.php');
                exit;
            }
        }

        $idEmpresa = (string) $_SESSION['empresa']['id'];
        $producto = new Producto(null, $codigoSeguimiento, $nombreProducto, $descripcion, $idCategoria, $ruta_imagen_producto, $precio, $iva, $idEmpresa[0], date('Y-m-d H:i:s'), $activo);

        $resultado = crearProducto($producto);
        
        if ($resultado) {
            AlertHelper::success("El producto '{$nombreProducto}' se ha creado correctamente y está disponible en tu catálogo", 'Producto Creado');
        } else {
            AlertHelper::error('Hubo un problema al guardar el producto en la base de datos. Inténtalo de nuevo.', 'Error al Guardar');
        }
        
    } else {
        AlertHelper::warning("El código de seguimiento '{$codigoSeguimiento}' ya existe. Por favor, usa un código diferente.", 'Código Duplicado');
    }
    
    header('Location: ../view/productos.php');
    exit;
} else {
    AlertHelper::error('Faltan datos obligatorios para crear el producto', 'Datos Incompletos');
    header('Location: ../view/creacionProducto.php');
    exit;
}

// ====== EJEMPLO 2: Modificación de eliminarProducto.php ======
// Archivo: php/actions/eliminarProducto.php (MODIFICADO)

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../db/conexionDb.php';
require_once '../dao/ProductoDao.php';
require_once '../includes/alert_helper.php'; // ← NUEVA LÍNEA

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

// ====== EJEMPLO 3: Modificación de crearPedido.php ======
// Archivo: php/actions/crearPedido.php (MODIFICADO)

session_start();
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../model/Pedido.php';
require_once '../dao/PedidoDao.php';
require_once '../includes/alert_helper.php'; // ← NUEVA LÍNEA

// Verificar autenticación
if (!isset($_SESSION['usuario']) || !isset($_SESSION['empresa']['id'])) {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente', [], 'Sesión Expirada');
    exit;
}

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Método de solicitud no válido', [], 'Error de Solicitud');
    exit;
}

try {
    // Obtener datos del pedido
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos requeridos
    if (!isset($data['idProveedor']) || !isset($data['productos']) || empty($data['productos'])) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'Faltan datos obligatorios. Asegúrate de seleccionar un proveedor y al menos un producto', [], 'Datos Incompletos');
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
    $totalProductos = 0;
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
            $totalProductos += $prod['cantidad'];
        }
    }
    
    // Validar que hay al menos una línea
    if (count($pedido->getLineas()) === 0) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'Debes seleccionar al menos un producto con cantidad mayor a cero', [], 'Pedido Vacío');
        exit;
    }
    
    // Crear pedido en la base de datos
    $pedidoId = crearPedido($pedido);
    
    if ($pedidoId) {
        $numeroPedido = $pedido->getNumeroPedido();
        $mensaje = "Tu pedido #{$numeroPedido} ha sido enviado correctamente. ";
        $mensaje .= "Total de productos: {$totalProductos}. ";
        $mensaje .= "El proveedor recibirá la solicitud y podrá procesarla.";
        
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(true, $mensaje, [
            'pedidoId' => $pedidoId,
            'numeroPedido' => $numeroPedido
        ], 'Pedido Enviado');
    } else {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'No se pudo procesar tu pedido debido a un error en el servidor. Inténtalo de nuevo.', [], 'Error al Procesar');
    }
    
} catch (Exception $e) {
    error_log("Error en crearPedido.php: " . $e->getMessage());
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Se ha producido un error inesperado. Por favor, inténtalo de nuevo más tarde.', [], 'Error del Sistema');
}

// ====== EJEMPLO 4: Modificación de actualizarEstadoPedido.php ======
// Archivo: php/actions/actualizarEstadoPedido.php (MODIFICADO)

session_start();
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../dao/PedidoDao.php';
require_once '../includes/alert_helper.php'; // ← NUEVA LÍNEA

// Verificar autenticación
if (!isset($_SESSION['usuario']) || !isset($_SESSION['empresa']['id'])) {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Tu sesión ha expirado', [], 'Sesión Expirada');
    exit;
}

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Método no permitido', [], 'Error de Solicitud');
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
        echo AlertHelper::jsonResponse(false, 'Los datos proporcionados no son válidos', [], 'Datos Inválidos');
        exit;
    }
    
    // Verificar que el pedido existe y el usuario tiene acceso
    $pedido = findPedidoById($pedidoId);
    if (!$pedido) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'El pedido solicitado no existe o no tienes permisos para verlo', [], 'Pedido No Encontrado');
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
    
    // Validar permisos específicos
    if (($nuevoEstado == 'procesando' || $nuevoEstado == 'completado') && !$esProveedor) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'Solo el proveedor puede marcar el pedido como procesando o completado', [], 'Sin Permisos');
        exit;
    }
    
    if ($nuevoEstado == 'cancelado' && !$esCliente) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'Solo el cliente puede cancelar el pedido', [], 'Sin Permisos');
        exit;
    }
    
    // Actualizar estado
    $resultado = actualizarEstadoPedido($pedidoId, $nuevoEstado);
    
    if ($resultado) {
        // Mensajes personalizados según el estado
        $mensajes = [
            'procesando' => 'El pedido está ahora siendo procesado. El cliente será notificado del cambio de estado.',
            'completado' => 'El pedido se ha marcado como completado exitosamente. ¡Excelente trabajo!',
            'cancelado' => 'El pedido ha sido cancelado. El proveedor será notificado de la cancelación.'
        ];
        
        $mensaje = $mensajes[$nuevoEstado] ?? 'El estado del pedido se ha actualizado correctamente';
        
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(true, $mensaje, ['nuevoEstado' => $nuevoEstado], 'Estado Actualizado');
    } else {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'No se pudo actualizar el estado del pedido. Inténtalo de nuevo.', [], 'Error de Actualización');
    }
    
} catch (Exception $e) {
    error_log("Error en actualizarEstadoPedido.php: " . $e->getMessage());
    header('Content-Type: application/json');
    echo AlertHelper::jsonResponse(false, 'Se ha producido un error inesperado en el servidor', [], 'Error del Sistema');
}

// ====== EJEMPLO 5: Modificación de procesarSolicitud.php ======
// Archivo: php/actions/procesarSolicitud.php (MODIFICADO)

session_start();
require_once '../constantes/constantesRutas.php';
require_once RUTA_DB;
require_once '../model/Solicitud.php';
require_once '../dao/SolicitudDao.php';
require_once '../includes/alert_helper.php'; // ← NUEVA LÍNEA

error_reporting(E_ALL);
ini_set('display_errors', 1);

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
    
    // Verificar que se recibieron todos los datos necesarios
    if (!isset($data['id_empresa_proveedor']) || !isset($data['asunto']) || !isset($data['mensaje'])) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'Faltan datos obligatorios. Asegúrate de completar todos los campos', [], 'Datos Incompletos');
        exit;
    }
    
    // Validar longitud de los campos
    if (strlen(trim($data['asunto'])) < 5) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'El asunto debe tener al menos 5 caracteres', [], 'Asunto Muy Corto');
        exit;
    }
    
    if (strlen(trim($data['mensaje'])) < 20) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'El mensaje debe tener al menos 20 caracteres para ser más descriptivo', [], 'Mensaje Muy Corto');
        exit;
    }
    
    // Obtener ID de empresa desde la sesión
    $idEmpresaSolicitante = $_SESSION['empresa']['id'];
    if (is_array($idEmpresaSolicitante)) {
        $idEmpresaSolicitante = $idEmpresaSolicitante[0];
    }
    $idEmpresaSolicitante = (int)$idEmpresaSolicitante;
    
    $idEmpresaProveedor = (int)$data['id_empresa_proveedor'];
    
    // Verificar que no se esté enviando solicitud a sí mismo
    if ($idEmpresaSolicitante === $idEmpresaProveedor) {
        header('Content-Type: application/json');
        echo AlertHelper::jsonResponse(false, 'No puedes enviarte una solicitud a ti mismo', [], 'Solicitud Inválida');
        exit;
    }
    
    $asunto = trim($data['asunto']);
    $mensaje = trim($data['mensaje']);
    
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

// ====== EJEMPLO 6: Modificación de una vista PHP para incluir alertas ======
// Archivo: php/view/productos.php (FRAGMENTO MODIFICADO)

/*
Al final del archivo productos.php, antes de </body>, añadir:
*/
?>

<!-- Antes de cerrar </body> en productos.php -->
<?php include_once '../includes/footer_alerts.php'; ?>

<script>
// Script específico para la página de productos con alertas mejoradas
document.addEventListener('DOMContentLoaded', function() {
    
    // Nuevo producto con validación y alertas
    const nuevoProductoCard = document.querySelector('.add-producto-card');
    if (nuevoProductoCard) {
        nuevoProductoCard.addEventListener('click', () => {
            showAlert({
                type: 'info',
                title: 'Crear Producto',
                message: 'Serás redirigido al formulario de creación de productos',
                duration: 2000
            });
            
            setTimeout(() => {
                window.location.href = './creacionProducto.php';
            }, 500);
        });
    }
    
    // Eliminar producto con confirmación mejorada
    const eliminarProducto = document.querySelectorAll('.btn-delete');
    eliminarProducto.forEach(eliminar => {
        eliminar.addEventListener('click', async () => {
            const idProducto = eliminar.dataset.productoId;
            const productoCard = eliminar.closest('.producto-card');
            const nombreProducto = productoCard?.querySelector('.producto-title')?.textContent || 'este producto';
            
            // Confirmación personalizada
            const confirmed = await confirmarAccionConAlerta({
                type: 'warning',
                title: 'Confirmar eliminación',
                message: `¿Estás seguro de que deseas eliminar "${nombreProducto}"? Esta acción no se puede deshacer y el producto ya no estará disponible en tu catálogo.`
            });
            
            if (confirmed) {
                // Mostrar loading
                const loadingId = showAlert({
                    type: 'loading',
                    title: 'Eliminando producto...',
                    message: `Eliminando "${nombreProducto}" de tu catálogo`,
                    persistent: true
                });
                
                try {
                    const response = await fetch('../../php/actions/eliminarProducto.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `idProducto=${encodeURIComponent(idProducto)}`,
                    });
                    
                    const data = await response.json();
                    hideAlert(loadingId);
                    
                    handleAjaxResponse(data, () => {
                        // Animar eliminación del elemento
                        productoCard.style.transition = 'all 0.5s ease';
                        productoCard.style.transform = 'scale(0.8)';
                        productoCard.style.opacity = '0';
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    });
                    
                } catch (error) {
                    hideAlert(loadingId);
                    console.error('Error:', error);
                    showAlert({
                        type: 'error',
                        title: 'Error de conexión',
                        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
                    });
                }
            }
        });
    });

    // Editar producto con feedback
    const editarProducto = document.querySelectorAll('.btn-edit');
    editarProducto.forEach(editar => {
        editar.addEventListener('click', () => {
            const idProducto = editar.dataset.productoId;
            const productoCard = editar.closest('.producto-card');
            const nombreProducto = productoCard?.querySelector('.producto-title')?.textContent || 'el producto';
            
            showAlert({
                type: 'info',
                title: 'Editando producto',
                message: `Serás redirigido para editar "${nombreProducto}"`,
                duration: 2000
            });
            
            setTimeout(() => {
                window.location.href = `../../php/view/edicionProducto.php?id=${idProducto}`;
            }, 500);
        });
    });
    
    // Búsqueda en tiempo real con feedback
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                if (searchTerm.length > 0) {
                    let visibleProducts = 0;
                    
                    document.querySelectorAll('.producto-card:not(.add-producto-card)').forEach(card => {
                        const title = card.querySelector('.producto-title')?.textContent.toLowerCase() || '';
                        const category = card.querySelector('.producto-category')?.textContent.toLowerCase() || '';
                        
                        if (title.includes(searchTerm) || category.includes(searchTerm)) {
                            card.style.display = '';
                            visibleProducts++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    if (visibleProducts === 0) {
                        showAlert({
                            type: 'info',
                            title: 'Sin resultados',
                            message: `No se encontraron productos que coincidan con "${searchTerm}"`,
                            duration: 3000
                        });
                    }
                } else {
                    // Mostrar todos los productos
                    document.querySelectorAll('.producto-card').forEach(card => {
                        card.style.display = '';
                    });
                }
            }, 300);
        });
    }
});
</script>

<?php
// ====== EJEMPLO 7: Archivo alert_helper.php completo ======
// Archivo: php/includes/alert_helper.php

class AlertHelper {
    
    /**
     * Añadir alerta a la sesión para mostrar en la siguiente página
     */
    public static function addAlert($type, $message, $title = '') {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
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
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
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
        $script .= 'if (window.showAlert) {';
        
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
        
        $script .= '}';
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
    
    /**
     * Limpiar alertas antiguas (más de 1 hora)
     */
    public static function cleanOldAlerts() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['alerts'])) {
            return;
        }
        
        $currentTime = time();
        $_SESSION['alerts'] = array_filter($_SESSION['alerts'], function($alert) use ($currentTime) {
            return ($currentTime - $alert['timestamp']) < 3600; // 1 hora
        });
    }
}