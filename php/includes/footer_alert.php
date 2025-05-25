<?php
// Archivo: php/includes/footer_alerts.php
// Este archivo debe incluirse al final de cada página PHP que use el sistema de alertas

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

// Función para validar formularios antes de envío
window.validateAndSubmit = function(form, validationRules, submitUrl, options = {}) {
    const formData = new FormData(form);
    const errors = [];
    
    // Validación básica
    for (const [field, rules] of Object.entries(validationRules)) {
        const value = formData.get(field);
        
        if (rules.required && (!value || value.trim() === '')) {
            errors.push(`${rules.label || field} es obligatorio`);
        }
        
        if (rules.minLength && value && value.length < rules.minLength) {
            errors.push(`${rules.label || field} debe tener al menos ${rules.minLength} caracteres`);
        }
        
        if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${rules.label || field} debe ser un email válido`);
        }
    }
    
    if (errors.length > 0) {
        showAlert({
            type: 'warning',
            title: 'Formulario incompleto',
            message: errors[0]
        });
        return false;
    }
    
    // Mostrar loading
    const loadingId = showAlert({
        type: 'loading',
        title: options.loadingTitle || 'Procesando...',
        message: options.loadingMessage || 'Por favor espera',
        persistent: true
    });
    
    // Enviar formulario
    fetch(submitUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        hideAlert(loadingId);
        
        if (response.headers.get('content-type')?.includes('application/json')) {
            return response.json();
        } else {
            // Si no es JSON, asumir que es una redirección exitosa
            if (response.ok) {
                showAlert({
                    type: 'success',
                    title: options.successTitle || 'Éxito',
                    message: options.successMessage || 'Operación completada correctamente'
                });
                
                if (options.redirectUrl) {
                    setTimeout(() => {
                        window.location.href = options.redirectUrl;
                    }, 1500);
                }
                return { success: true };
            } else {
                throw new Error('Error en el servidor');
            }
        }
    })
    .then(data => {
        if (data && typeof data === 'object') {
            handleAjaxResponse(data, options.onSuccess, options.onError);
        }
    })
    .catch(error => {
        hideAlert(loadingId);
        console.error('Error:', error);
        showAlert({
            type: 'error',
            title: 'Error',
            message: options.errorMessage || 'No se pudo completar la operación'
        });
        
        if (options.onError) {
            options.onError(error);
        }
    });
    
    return true;
};
</script>

<?php
// Ejemplo de cómo usar en una página específica:
/*
// Al final de tu archivo PHP (antes de </body>), incluir:
include_once __DIR__ . '/../includes/footer_alerts.php';

// Para añadir alertas desde PHP antes de redireccionar:
AlertHelper::success('Producto creado correctamente', 'Éxito');
header('Location: productos.php');
exit;

// Para enviar respuesta JSON con alerta:
header('Content-Type: application/json');
echo AlertHelper::jsonResponse(true, 'Operación completada', ['id' => 123]);
exit;
*/
?>