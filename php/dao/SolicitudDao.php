<?php
    if (!defined('RUTA_DB')) {
        include_once '../constantes/constantesRutas.php';
    }
    include_once RUTA_DB;
    include_once '../model/Solicitud.php';

    function findSolicitudById($id) {
        try {
            $db = new conexionDb();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM solicitudes WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $db->closeConnection();
            
            if ($row) {
                return new Solicitud(
                    $row['id'],
                    $row['id_empresa_solicitante'],
                    $row['id_empresa_proveedor'],
                    $row['asunto'],
                    $row['mensaje'],
                    $row['estado'],
                    $row['fecha_creacion']
                );
            }
            
            return null;
        } catch (Exception $e) {
            error_log("Error al buscar solicitud por ID: " . $e->getMessage());
            return null;
        }
    }
    function guardarSolicitud($solicitud) {
        try {
            $db = new conexionDb();
            $conn = $db->getConnection();
            
            // Para depuración, registrar los valores que se intentan insertar
            error_log("Insertando: id_solicitante=" . $solicitud->getIdEmpresaSolicitante() . 
                    ", id_proveedor=" . $solicitud->getIdEmpresaProveedor() . 
                    ", asunto=" . $solicitud->getAsunto());
            
            $stmt = $conn->prepare("INSERT INTO solicitudes (id_empresa_solicitante, id_empresa_proveedor, asunto, mensaje, estado, fecha_creacion) 
                                VALUES (:id_empresa_solicitante, :id_empresa_proveedor, :asunto, :mensaje, :estado, :fecha_creacion)");
            
            $params = [
                ':id_empresa_solicitante' => $solicitud->getIdEmpresaSolicitante(),
                ':id_empresa_proveedor' => $solicitud->getIdEmpresaProveedor(),
                ':asunto' => $solicitud->getAsunto(),
                ':mensaje' => $solicitud->getMensaje(),
                ':estado' => $solicitud->getEstado(),
                ':fecha_creacion' => $solicitud->getFechaCreacion()
            ];
            
            // Para depuración, registrar los parámetros
            error_log("Parámetros: " . print_r($params, true));
            
            $resultado = $stmt->execute($params);
            
            // Si hay algún error en la consulta SQL, registrarlo
            if (!$resultado) {
                $errorInfo = $stmt->errorInfo();
                error_log("Error SQL: " . $errorInfo[2]);
            }
            
            $db->closeConnection();
            
            return $resultado;
        } catch (Exception $e) {
            error_log("Error en guardarSolicitud: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Busca todas las solicitudes enviadas por una empresa
     * @param int $idEmpresa ID de la empresa solicitante
     * @return array Array de objetos Solicitud
     */
    function findSolicitudesEnviadas($idEmpresa) {
        $solicitudes = [];
        try {
            $db = new conexionDb();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM solicitudes WHERE id_empresa_solicitante = :id_empresa ORDER BY fecha_creacion DESC");
            $stmt->bindParam(':id_empresa', $idEmpresa);
            $stmt->execute();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $solicitudes[] = new Solicitud(
                    $row['id'],
                    $row['id_empresa_solicitante'],
                    $row['id_empresa_proveedor'],
                    $row['asunto'],
                    $row['mensaje'],
                    $row['estado'],
                    $row['fecha_creacion']
                );
            }
            
            $db->closeConnection();
        } catch (Exception $e) {
            error_log("Error al buscar solicitudes enviadas: " . $e->getMessage());
        }
        
        return $solicitudes;
    }

    /**
     * Busca todas las solicitudes recibidas por una empresa
     * @param int $idEmpresa ID de la empresa proveedora
     * @return array Array de objetos Solicitud
     */
    function findSolicitudesRecibidas($idEmpresa) {
        $solicitudes = [];
        try {
            $db = new conexionDb();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM solicitudes WHERE id_empresa_proveedor = :id_empresa ORDER BY fecha_creacion DESC");
            $stmt->bindParam(':id_empresa', $idEmpresa);
            $stmt->execute();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $solicitudes[] = new Solicitud(
                    $row['id'],
                    $row['id_empresa_solicitante'],
                    $row['id_empresa_proveedor'],
                    $row['asunto'],
                    $row['mensaje'],
                    $row['estado'],
                    $row['fecha_creacion']
                );
            }
            
            $db->closeConnection();
        } catch (Exception $e) {
            error_log("Error al buscar solicitudes recibidas: " . $e->getMessage());
        }
        
        return $solicitudes;
    }

    /**
     * Actualiza el estado de una solicitud
     * @param int $idSolicitud ID de la solicitud
     * @param string $nuevoEstado Nuevo estado ('pendiente', 'aceptada', 'rechazada')
     * @return bool True si la operación fue exitosa, False en caso contrario
     */
    function actualizarEstadoSolicitud($idSolicitud, $nuevoEstado) {
        try {
            $db = new conexionDb();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("UPDATE solicitudes SET estado = :estado WHERE id = :id");
            
            $resultado = $stmt->execute([
                ':estado' => $nuevoEstado,
                ':id' => $idSolicitud
            ]);
            
            $db->closeConnection();
            
            return $resultado;
        } catch (Exception $e) {
            error_log("Error al actualizar estado de solicitud: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Elimina una solicitud
     * @param int $idSolicitud ID de la solicitud a eliminar
     * @return bool True si la operación fue exitosa, False en caso contrario
     */
    function eliminarSolicitud($idSolicitud) {
        try {
            $db = new conexionDb();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("DELETE FROM solicitudes WHERE id = :id");
            
            $resultado = $stmt->execute([':id' => $idSolicitud]);
            
            $db->closeConnection();
            
            return $resultado;
        } catch (Exception $e) {
            error_log("Error al eliminar solicitud: " . $e->getMessage());
            return false;
        }
    }



    function findSolicitudesPendientesEnviadas($idEmpresa) {
        $solicitudes = [];
        try {
            $db = new conexionDb();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM solicitudes WHERE id_empresa_solicitante = :id_empresa AND estado = 'pendiente' ORDER BY fecha_creacion DESC");
            $stmt->bindParam(':id_empresa', $idEmpresa);
            $stmt->execute();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $solicitudes[] = new Solicitud(
                    $row['id'],
                    $row['id_empresa_solicitante'],
                    $row['id_empresa_proveedor'],
                    $row['asunto'],
                    $row['mensaje'],
                    $row['estado'],
                    $row['fecha_creacion']
                );
            }
            
            $db->closeConnection();
        } catch (Exception $e) {
            error_log("Error al buscar solicitudes enviadas pendientes: " . $e->getMessage());
        }
        
        return $solicitudes;
    }


    function findSolicitudesPendientesRecibidas($idEmpresa) {
        $solicitudes = [];
        try {
            $db = new conexionDb();
            $conn = $db->getConnection();
            $stmt = $conn->prepare("SELECT * FROM solicitudes WHERE id_empresa_proveedor = :id_empresa AND estado = 'pendiente' ORDER BY fecha_creacion DESC");
            $stmt->bindParam(':id_empresa', $idEmpresa);
            $stmt->execute();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $solicitudes[] = new Solicitud(
                    $row['id'],
                    $row['id_empresa_solicitante'],
                    $row['id_empresa_proveedor'],
                    $row['asunto'],
                    $row['mensaje'],
                    $row['estado'],
                    $row['fecha_creacion']
                );
            }
            
            $db->closeConnection();
        } catch (Exception $e) {
            error_log("Error al buscar solicitudes recibidas pendientes: " . $e->getMessage());
        }
        
        return $solicitudes;
    }

?>