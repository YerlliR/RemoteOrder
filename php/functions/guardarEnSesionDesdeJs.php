<?php
include_once '../dao/EmpresaDao.php';
session_start();
$response = ['success' => false];

if (isset($_POST['idEmpresa'])) {
    $empresa = findById($_POST['idEmpresa']);
    
    if ($empresa) {
        $_SESSION['empresa'] = $empresa;
        $response['success'] = true;
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>