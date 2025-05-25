<?php
/**
 * Archivo: php/includes/footer_alerts.php
 * Este archivo debe incluirse al final de cada página PHP que use el sistema de alertas
 */

// Incluir el helper de alertas
if (!class_exists('AlertHelper')) {
    require_once __DIR__ . '/alert_helper.php';
}
?>

<!-- Scripts del sistema de alertas -->
<script src="../../public/js/alertSystem.js"></script>

<?php
// Renderizar alertas de la sesión
echo AlertHelper::renderAlertsScript();
?>

<script>
// Configuración global del sistema de alertas
document.addEventListener('DOMContentLoaded', function() {
    // Configurar duraciones personalizadas por tipo
    if (window.alertSystem) {
        window.alertSystem.defaultDuration = 4000;
        
        // Configurar iconos personalizados si se desea
        window.alertSystem.customIcons = {
            success: '✅',
            error: '❌', 
            warning: '⚠️',
            info: 'ℹ️',
            loading: '⏳'
        };
    }
    
    // Manejar errores globales de JavaScript
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        if (window.showAlert) {
            showAlert({
                type: 'error',
                title: 'Error de JavaScript',
                message: 'Se ha producido un error inesperado en la página',
                duration: 6000
            });
        }
    });
    
    // Manejar errores de fetch no capturados
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        if (window.showAlert) {
            showAlert({
                type: 'error',
                title: 'Error de conexión',
                message: 'No se pudo completar la operación solicitada',
                duration: 5000
            });
        }
    });
});

// Función helper para mostrar alertas desde PHP
window.showPhpAlert = function(type, message, title = '') {
    if (window.showAlert) {
        showAlert({
            type: type,
            title: title,
            message: message
        });
    }
};

// Función para manejar respuestas AJAX estándar
window.handleAjaxResponse = function(response, successCallback = null, errorCallback = null) {
    try {
        const data = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (data.success) {
            // Mostrar alerta de éxito
            showAlert({
                type: data.alert_type || 'success',
                title: data.title || 'Éxito',
                message: data.message
            });
            
            // Ejecutar callback de éxito si se proporciona
            if (successCallback) {
                successCallback(data);
            }
        } else {
            // Mostrar alerta de error
            showAlert({
                type: data.alert_type || 'error',
                title: data.title || 'Error',
                message: data.message
            });
            
            // Ejecutar callback de error si se proporciona
            if (errorCallback) {
                errorCallback(data);
            }
        }
    } catch (error) {
        console.error('Error parsing response:', error);
        showAlert({
            type: 'error',
            title: 'Error',
            message: 'Error al procesar la respuesta del servidor'
        });
    }
};

// Función para confirmar acciones con alertas
window.confirmarAccionConAlerta = function(config) {
    return new Promise((resolve) => {
        const confirmed = confirm(config.message || '¿Estás seguro de que deseas continuar?');
        resolve(confirmed);
    });
};

// Función para validar formularios con alertas
window.validarFormularioConAlertas = function(form, rules) {
    const errors = [];
    
    for (const [field, rule] of Object.entries(rules)) {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input) continue;
        
        const value = input.value.trim();
        
        // Validación requerido
        if (rule.required && !value) {
            errors.push(`${rule.label || field} es obligatorio`);
        }
        
        // Validación de longitud mínima
        if (rule.minLength && value.length < rule.minLength) {
            errors.push(`${rule.label || field} debe tener al menos ${rule.minLength} caracteres`);
        }
        
        // Validación de email
        if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${rule.label || field} debe ser un email válido`);
        }
        
        // Validación personalizada
        if (rule.custom && !rule.custom(value)) {
            errors.push(rule.customMessage || `${rule.label || field} no es válido`);
        }
    }
    
    if (errors.length > 0) {
        showAlert({
            type: 'warning',
            title: 'Formulario incompleto',
            message: errors[0], // Mostrar solo el primer error
            duration: 5000
        });
        return false;
    }
    
    return true;
};
</script>