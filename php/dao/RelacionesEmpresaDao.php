<?php

if (!defined('RUTA_DB')) {
    include_once '../constantes/constantesRutas.php';
}
include_once RUTA_DB;


function crearRelacionEmpresa($idCliente, $idProveedor, $solicitudId) {
    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        
        // Comprobar si ya existe la relación
        $stmt = $conn->prepare("SELECT id FROM relaciones_empresa WHERE id_empresa_cliente = :id_cliente AND id_empresa_proveedor = :id_proveedor");
        $stmt->bindParam(':id_cliente', $idCliente);
        $stmt->bindParam(':id_proveedor', $idProveedor);
        $stmt->execute();
        
        $existeRelacion = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existeRelacion) {
            // La relación ya existe, actualizamos el estado
            $stmt = $conn->prepare("UPDATE relaciones_empresa SET estado = 'activa', fecha_inicio = NOW() WHERE id = :id");
            $stmt->bindParam(':id', $existeRelacion['id']);
            $resultado = $stmt->execute();
        } else {
            // Crear una nueva relación
            $stmt = $conn->prepare("INSERT INTO relaciones_empresa (id_empresa_cliente, id_empresa_proveedor, solicitud_id) VALUES (:id_cliente, :id_proveedor, :solicitud_id)");
            $stmt->bindParam(':id_cliente', $idCliente);
            $stmt->bindParam(':id_proveedor', $idProveedor);
            $stmt->bindParam(':solicitud_id', $solicitudId);
            $resultado = $stmt->execute();
        }
        
        $db->closeConnection();
        return $resultado;
    } catch (Exception $e) {
        error_log("Error al crear relación empresa: " . $e->getMessage());
        return false;
    }
}

function obtenerClientesDeProveedor($idProveedor) {
    $clientes = [];
    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        
        $sql = "SELECT e.*, r.fecha_inicio, r.id as relacion_id 
                FROM empresas e 
                INNER JOIN relaciones_empresa r ON e.id = r.id_empresa_cliente 
                WHERE r.id_empresa_proveedor = :id_proveedor 
                AND r.estado = 'activa'";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id_proveedor', $idProveedor);
        $stmt->execute();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $clientes[] = $row;
        }
        
        $db->closeConnection();
    } catch (Exception $e) {
        error_log("Error al obtener clientes: " . $e->getMessage());
    }
    
    return $clientes;
}


function obtenerProveedoresDeCliente($idCliente) {
    $proveedores = [];
    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        
        $sql = "SELECT e.*, r.fecha_inicio, r.id as relacion_id 
                FROM empresas e 
                INNER JOIN relaciones_empresa r ON e.id = r.id_empresa_proveedor 
                WHERE r.id_empresa_proveedor = :id_cliente 
                AND r.estado = 'activa'";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id_cliente', $idCliente);
        $stmt->execute();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $proveedores[] = $row;
        }
        
        $db->closeConnection();
    } catch (Exception $e) {
        error_log("Error al obtener proveedores: " . $e->getMessage());
    }
    
    return $proveedores;
}

function terminarRelacionEmpresa($relacionId) {
    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        
        // Primero verificar que la relación existe
        $stmt = $conn->prepare("SELECT id FROM relaciones_empresa WHERE id = :id");
        $stmt->bindParam(':id', $relacionId);
        $stmt->execute();
        
        if (!$stmt->fetch()) {
            $db->closeConnection();
            return false; // La relación no existe
        }
        
        // Actualizar el estado a 'terminada' o eliminar completamente
        // Opción 1: Marcar como terminada (recomendado para mantener historial)
        $stmt = $conn->prepare("UPDATE relaciones_empresa SET estado = 'terminada' WHERE id = :id");
        $stmt->bindParam(':id', $relacionId);
        $resultado = $stmt->execute();
        
        // Opción 2: Eliminar completamente (descomentar si prefieres eliminar)
        // $stmt = $conn->prepare("DELETE FROM relaciones_empresa WHERE id = :id");
        // $stmt->bindParam(':id', $relacionId);
        // $resultado = $stmt->execute();
        
        $db->closeConnection();
        return $resultado;
    } catch (Exception $e) {
        error_log("Error al terminar relación: " . $e->getMessage());
        return false;
    }
}

// Si decides eliminar completamente, también deberías actualizar las consultas
// para obtener proveedores para que solo muestren relaciones activas:

function obtenerProveedoresDeProveedor($idCliente) {
    $proveedores = [];
    try {
        $db = new conexionDb();
        $conn = $db->getConnection();
        
        $sql = "SELECT e.*, r.fecha_inicio, r.id as relacion_id 
                FROM empresas e 
                INNER JOIN relaciones_empresa r ON e.id = r.id_empresa_proveedor 
                WHERE r.id_empresa_cliente = :id_cliente 
                AND r.estado = 'activa'"; // Solo relaciones activas
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id_cliente', $idCliente);
        $stmt->execute();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $proveedores[] = $row;
        }
        
        $db->closeConnection();
    } catch (Exception $e) {
        error_log("Error al obtener proveedores: " . $e->getMessage());
    }
    
    return $proveedores;
}
?>
?>