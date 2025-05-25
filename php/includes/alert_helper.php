<?php
/**
 * Sistema de Alertas para RemoteOrder
 * Archivo: php/includes/alert_helper.php
 */

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
?>