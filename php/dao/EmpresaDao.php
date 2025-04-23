<?php

if (!defined('RUTA_DB')) {
    include_once '../constantes/constantesRutas.php';
}
include_once RUTA_DB;
include_once RUTA_EMPRESA_MODEL;

function crearEmpresa(Empresa $empresa) {

    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("INSERT INTO empresas (nombre, sector, email, numero_empleados, descripcion, telefono, sitio_web, estado, ruta_logo, usuario_id, pais, ciudad) VALUES (:nombre, :sector, :email, :numero_empleados, :descripcion, :telefono, :sitio_web, :estado, :ruta_logo, :usuario_id, :pais, :ciudad)");
        $stmt->execute([
            ':nombre' => $empresa->getNombre(),
            ':sector' => $empresa->getSector(),
            ':email' => $empresa->getEmail(),
            ':numero_empleados' => $empresa->getNumeroEmpleados(),
            ':descripcion' => $empresa->getDescripcion(),
            ':telefono' => $empresa->getTelefono(),
            ':sitio_web' => $empresa->getSitioWeb(),
            ':estado' => $empresa->getEstado(),
            ':ruta_logo' => $empresa->getRutaLogo(),
            ':usuario_id' => $empresa->getUsuarioId(),
            ':pais' => $empresa->getPais(),
            ':ciudad' => $empresa->getCiudad()
        ]);
        $result = $stmt->rowCount();
        $db->closeConnection();
    } catch (Exception $e) {
        echo "Error al crear la empresa: " . $e->getMessage();
    }

    return $result;
}

function findEmpresaByUserId($userId) {
    $empresas = [];
    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT * FROM empresas WHERE usuario_id = :userId");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $empresas[] = new Empresa(
                $row['id'],
                $row['nombre'],
                $row['sector'],
                $row['numero_empleados'],
                $row['descripcion'],
                $row['telefono'],
                $row['email'],
                $row['sitio_web'],
                $row['estado'],
                $row['ruta_logo'],
                $row['usuario_id'],
                $row['pais'],
                $row['ciudad']
            );
        }
        $db->closeConnection();
    } catch (Exception $e) {
        echo "Error al buscar las empresas: " . $e->getMessage();
    }

    return $empresas;
}

function findById($empresaId) {
    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT * FROM empresas WHERE id = :empresaId");
        $stmt->bindParam(':empresaId', $empresaId);
        $stmt->execute();
        $empresa = $stmt->fetch(PDO::FETCH_ASSOC);
        $db->closeConnection();
    } catch (Exception $e) {
        echo "Error al buscar la empresa: " . $e->getMessage();
    }

    return $empresa;
}

function findAllEmpresas() {
    $empresas = [];
    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        $stmt = $conn->prepare("SELECT * FROM empresas");
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $empresas[] = new Empresa(
                $row['id'],
                $row['nombre'],
                $row['sector'],
                $row['numero_empleados'],
                $row['descripcion'],
                $row['telefono'],
                $row['email'],
                $row['sitio_web'],
                $row['estado'],
                $row['ruta_logo'],
                $row['usuario_id'],
                $row['pais'],
                $row['ciudad']
            );
        }
        $db->closeConnection();
    } catch (Exception $e) {
        echo "Error al buscar las empresas: " . $e->getMessage();
    }

    return $empresas;
}

?>
