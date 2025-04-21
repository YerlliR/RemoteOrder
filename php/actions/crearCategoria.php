<?php 
require_once '../dao/categoriaDao.php';
session_start();

if (isset($_POST['nombre'])) {

    $categoria = new Categoria(null, $_POST['nombre'], $_POST['descripcion'], $_POST['color'],  $_SESSION['empresa']['id'], date('Y-m-d H:i:s'));
    
    guardarCategoria($categoria);

    header('Location: ../view/productos.php');
}
?>
