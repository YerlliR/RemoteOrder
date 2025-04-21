<?php
    session_start();
    require_once '../model/Producto.php';
    require_once '../dao/ProductoDao.php';

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

        if (findByCodigoSeguimiento($codigoSeguimiento) == false) {
            $ruta_imagen_producto = '';
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
                $nombre_imagen = uniqid() . "_" . basename($_FILES['imagen']['name']);
                $ruta_destino = '../../uploads/imagenesProductos/' . $nombre_imagen;
                
                if (move_uploaded_file($_FILES['imagen']['tmp_name'], $ruta_destino)) {
                    $ruta_imagen_producto = '/uploads/imagenesProductos/' . $nombre_imagen;
                }
            }

            $idEmpresa = (string) $_SESSION['empresa']['id'];

            $producto = new Producto(null, $codigoSeguimiento,$nombreProducto, $descripcion, $idCategoria, $ruta_imagen_producto, $precio, $iva, $idEmpresa[0], date('Y-m-d H:i:s'), $activo);

            
            crearProducto($producto);
            header('Location: ../view/productos.php');
        }else {
            echo 'El codigo de seguimiento ya existe';
        }
    }
?>
