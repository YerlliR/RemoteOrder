<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../db/conexionDb.php';
require_once '../dao/ProductoDao.php';

if (isset($_POST['idProducto'])) {
    $idProducto = $_POST['idProducto'];

    $result = eliminarProducto($idProducto);

    if (!$result) {
        echo 'Error al eliminar el producto';
    }


}else {
    echo 'Error al eliminar el producto';
}

?>