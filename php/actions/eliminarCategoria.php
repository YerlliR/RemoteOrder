<?php 

require_once '../dao/categoriaDao.php';
session_start();

if (isset($_POST['idCategoria'])) {

    eliminarCategoria($_POST['idCategoria']);
}
?>
