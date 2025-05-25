<?php
session_start();
require_once '../model/Producto.php';
require_once '../dao/ProductoDao.php';
require_once '../includes/alert_helper.php';

if (isset($_POST['codigo_seguimiento']) && isset($_POST['nombre_producto']) && isset($_POST['descripcion']) && isset($_POST['id_categoria']) && isset($_POST['precio']) && isset($_POST['iva'])) {
    
    $codigoSeguimiento = trim($_POST['codigo_seguimiento']);
    $nombreProducto = trim($_POST['nombre_producto']);
    $descripcion = trim($_POST['descripcion']);
    $idCategoria = $_POST['id_categoria'];
    $precio = $_POST['precio'];
    $iva = $_POST['iva'];
    $activo = isset($_POST['activo']) ? true : false;
    
    // Validaciones mejoradas
    if (strlen($nombreProducto) < 2) {
        AlertHelper::error('El nombre del producto debe tener al menos 2 caracteres', 'Nombre Muy Corto');
        header('Location: ../view/creacionProducto.php');
        exit;
    }
    
    if ($precio <= 0) {
        AlertHelper::error('El precio debe ser mayor a 0', 'Precio Inválido');
        header('Location: ../view/creacionProducto.php');
        exit;
    }
    
    if ($iva < 0 || $iva > 100) {
        AlertHelper::error('El IVA debe estar entre 0% y 100%', 'IVA Inválido');
        header('Location: ../view/creacionProducto.php');
        exit;
    }

    // Verificar si el código ya existe
    if (findByCodigoSeguimiento($codigoSeguimiento) == false) {
        $ruta_imagen_producto = '';
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
            // Validar tipo de archivo
            $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($_FILES['imagen']['type'], $allowed_types)) {
                AlertHelper::error('Solo se permiten imágenes JPG, PNG o GIF', 'Formato Inválido');
                header('Location: ../view/creacionProducto.php');
                exit;
            }
            
            // Validar tamaño (2MB máximo)
            if ($_FILES['imagen']['size'] > 2 * 1024 * 1024) {
                AlertHelper::error('La imagen no puede ser mayor a 2MB', 'Archivo Muy Grande');
                header('Location: ../view/creacionProducto.php');
                exit;
            }
            
            $nombre_imagen = uniqid() . "_" . basename($_FILES['imagen']['name']);
            $ruta_destino = '../../uploads/imagenesProductos/' . $nombre_imagen;
            
            // Crear directorio si no existe
            $upload_dir = dirname($ruta_destino);
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta_destino)) {
                $ruta_imagen_producto = '/uploads/imagenesProductos/' . $nombre_imagen;
            } else {
                AlertHelper::warning('No se pudo subir la imagen, pero el producto se creará sin imagen', 'Imagen No Subida');
            }
        }

        $idEmpresa = $_SESSION['empresa']['id'];
        if (is_array($idEmpresa)) {
            $idEmpresa = $idEmpresa[0];
        }

        try {
            $producto = new Producto(null, $codigoSeguimiento, $nombreProducto, $descripcion, $idCategoria, $ruta_imagen_producto, $precio, $iva, $idEmpresa, date('Y-m-d H:i:s'), $activo);
            
            $resultado = crearProducto($producto);
            
            if ($resultado) {
                AlertHelper::success("El producto '{$nombreProducto}' se ha creado correctamente y está disponible en tu catálogo", 'Producto Creado');
            } else {
                AlertHelper::error('Hubo un problema al guardar el producto en la base de datos. Inténtalo de nuevo.', 'Error al Guardar');
            }
            
        } catch (Exception $e) {
            error_log("Error al crear producto: " . $e->getMessage());
            AlertHelper::error('Error del sistema: ' . $e->getMessage(), 'Error Crítico');
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
?>