// ===== ARCHIVO: public/js/exploradorProveedores-fixed.js =====
// Sistema de solicitudes corregido para exploradorProveedores.js

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let selectedProveedorID = null;
    let currentProveedorNombre = '';
    
    // Referencias a elementos del modal de contacto
    const modalContact = document.getElementById('modal-contact');
    const btnSendModalMessage = document.getElementById('btn-send-modal-message');
    const btnCancelContact = document.getElementById('btn-cancel-contact');
    const contactProviderName = document.getElementById('contact-provider-name');
    
    // ===== GESTIONAR CONTACTO CON PROVEEDORES =====
    
    // Asignar eventos a botones de contacto (delegación de eventos)
    document.addEventListener('click', function(e) {
        // Botón "Contactar" en las tarjetas de proveedor
        if (e.target.closest('.btn-contact')) {
            e.preventDefault();
            e.stopPropagation();
            
            const btn = e.target.closest('.btn-contact');
            selectedProveedorID = btn.getAttribute('data-empresa-id');
            
            // Obtener el nombre del proveedor desde la tarjeta
            const providerCard = btn.closest('.provider-card');
            currentProveedorNombre = providerCard ? 
                providerCard.querySelector('h3').textContent.trim() : 'Proveedor';
            
            abrirModalContacto();
        }
        
        // Botón "Solicitar servicio" desde el perfil
        if (e.target.classList.contains('btn-solicitar-desde-perfil')) {
            e.preventDefault();
            
            selectedProveedorID = e.target.getAttribute('data-empresa-id');
            
            // Obtener nombre del proveedor desde el perfil
            const perfilNombre = document.getElementById('perfil-nombre');
            currentProveedorNombre = perfilNombre ? 
                perfilNombre.textContent.trim() : 'Proveedor';
            
            // Cerrar modal de perfil si está abierto
            const modalPerfil = document.getElementById('modal-perfil');
            if (modalPerfil) {
                modalPerfil.classList.remove('active');
            }
            
            abrirModalContacto();
        }
    });
    
    // ===== FUNCIÓN PARA ABRIR MODAL DE CONTACTO =====
    function abrirModalContacto() {
        if (!selectedProveedorID) {
            mostrarAlerta('Error: No se ha seleccionado un proveedor', 'error');
            return;
        }
        
        // Actualizar el nombre en el modal
        if (contactProviderName) {
            contactProviderName.textContent = currentProveedorNombre;
        }
        
        // Limpiar campos del formulario
        limpiarFormularioContacto();
        
        // Mostrar el modal
        if (modalContact) {
            modalContact.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Enfocar el primer campo
            const firstInput = modalContact.querySelector('#modal-contact-subject');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 300);
            }
        }
    }
    
    // ===== FUNCIÓN PARA LIMPIAR FORMULARIO =====
    function limpiarFormularioContacto() {
        const subjectInput = document.getElementById('modal-contact-subject');
        const messageInput = document.getElementById('modal-contact-message');
        const nameInput = document.getElementById('modal-contact-name');
        
        if (subjectInput) subjectInput.value = '';
        if (messageInput) messageInput.value = '';
        if (nameInput) nameInput.value = '';
        
        // Limpiar mensajes de error si existen
        const errorMessages = modalContact.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
    }
    
    // ===== ENVIAR FORMULARIO DE CONTACTO =====
    if (btnSendModalMessage) {
        btnSendModalMessage.addEventListener('click', function(e) {
            e.preventDefault();
            enviarSolicitud();
        });
    }
    
    // También permitir envío con Enter en el textarea
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey && modalContact.classList.contains('active')) {
            e.preventDefault();
            enviarSolicitud();
        }
    });
    
    // ===== FUNCIÓN PRINCIPAL PARA ENVIAR SOLICITUD =====
    function enviarSolicitud() {
        // Verificar que se haya seleccionado un proveedor
        if (!selectedProveedorID) {
            mostrarAlerta('Error: No se ha seleccionado un proveedor', 'error');
            return;
        }
        
        // Obtener valores de los campos
        const subject = document.getElementById('modal-contact-subject')?.value.trim() || '';
        const message = document.getElementById('modal-contact-message')?.value.trim() || '';
        
        // Validación del formulario
        const validationResult = validarFormularioContacto(subject, message);
        if (!validationResult.isValid) {
            mostrarAlerta(validationResult.message, 'warning');
            return;
        }
        
        // Deshabilitar botón para evitar envíos múltiples
        const originalText = btnSendModalMessage.textContent;
        btnSendModalMessage.disabled = true;
        btnSendModalMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Mostrar alerta de carga
        const loadingId = mostrarAlerta('Enviando solicitud...', 'loading', true);
        
        // Datos para enviar al servidor
        const solicitudData = {
            id_empresa_proveedor: parseInt(selectedProveedorID),
            asunto: subject,
            mensaje: message
        };
        
        console.log('Enviando solicitud:', solicitudData); // Para debug
        
        // Enviar solicitud al servidor
        fetch('../../php/actions/procesarSolicitud.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(solicitudData)
        })
        .then(response => {
            console.log('Response status:', response.status); // Para debug
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Response not JSON:', text);
                    throw new Error('Respuesta del servidor no válida');
                }
            });
        })
        .then(data => {
            console.log('Response data:', data); // Para debug
            
            ocultarAlerta(loadingId);
            
            if (data.success) {
                // Éxito: mostrar mensaje y cerrar modal
                mostrarAlerta(
                    data.message || `Solicitud enviada correctamente a ${currentProveedorNombre}`,
                    'success'
                );
                
                cerrarModalContacto();
                
                // Opcional: mostrar información adicional
                setTimeout(() => {
                    mostrarAlerta(
                        'Recibirás una notificación cuando el proveedor responda a tu solicitud',
                        'info'
                    );
                }, 2000);
                
            } else {
                // Error del servidor
                mostrarAlerta(
                    data.message || 'Error al enviar la solicitud',
                    'error'
                );
            }
        })
        .catch(error => {
            console.error('Error en fetch:', error);
            ocultarAlerta(loadingId);
            
            mostrarAlerta(
                'Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.',
                'error'
            );
        })
        .finally(() => {
            // Restablecer botón
            btnSendModalMessage.disabled = false;
            btnSendModalMessage.textContent = originalText;
        });
    }
    
    // ===== FUNCIÓN DE VALIDACIÓN =====
    function validarFormularioContacto(subject, message) {
        // Limpiar mensajes de error previos
        const errorMessages = modalContact.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const errors = [];
        
        // Validar asunto
        if (!subject) {
            errors.push({ field: 'modal-contact-subject', message: 'El asunto es obligatorio' });
        } else if (subject.length < 5) {
            errors.push({ field: 'modal-contact-subject', message: 'El asunto debe tener al menos 5 caracteres' });
        } else if (subject.length > 100) {
            errors.push({ field: 'modal-contact-subject', message: 'El asunto no puede exceder 100 caracteres' });
        }
        
        // Validar mensaje
        if (!message) {
            errors.push({ field: 'modal-contact-message', message: 'El mensaje es obligatorio' });
        } else if (message.length < 20) {
            errors.push({ field: 'modal-contact-message', message: 'El mensaje debe tener al menos 20 caracteres' });
        } else if (message.length > 1000) {
            errors.push({ field: 'modal-contact-message', message: 'El mensaje no puede exceder 1000 caracteres' });
        }
        
        // Mostrar errores en el formulario
        if (errors.length > 0) {
            errors.forEach(error => {
                const field = document.getElementById(error.field);
                if (field) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.style.cssText = 'color: #dc2626; font-size: 12px; margin-top: 4px;';
                    errorDiv.textContent = error.message;
                    
                    field.parentNode.appendChild(errorDiv);
                    field.style.borderColor = '#dc2626';
                }
            });
            
            return {
                isValid: false,
                message: errors[0].message
            };
        }
        
        return { isValid: true };
    }
    
    // ===== CERRAR MODAL DE CONTACTO =====
    function cerrarModalContacto() {
        if (modalContact) {
            modalContact.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Limpiar datos
        setTimeout(() => {
            limpiarFormularioContacto();
            selectedProveedorID = null;
            currentProveedorNombre = '';
        }, 300);
    }
    
    // Event listeners para cerrar modal
    if (btnCancelContact) {
        btnCancelContact.addEventListener('click', cerrarModalContacto);
    }
    
    // Botones de cierre general
    const modalCloseButtons = modalContact?.querySelectorAll('.modal-close');
    modalCloseButtons?.forEach(btn => {
        btn.addEventListener('click', cerrarModalContacto);
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    if (modalContact) {
        modalContact.addEventListener('click', function(e) {
            if (e.target === modalContact) {
                cerrarModalContacto();
            }
        });
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalContact?.classList.contains('active')) {
            cerrarModalContacto();
        }
    });
    
    // ===== SISTEMA DE ALERTAS INTEGRADO =====
    let alertCounter = 0;
    
    function mostrarAlerta(mensaje, tipo = 'info', persistente = false) {
        const alertId = 'alert-' + (++alertCounter);
        
        // Crear contenedor si no existe
        let container = document.querySelector('.alert-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'alert-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        
        // Crear alerta
        const alert = document.createElement('div');
        alert.id = alertId;
        alert.className = `alert alert-${tipo}`;
        
        const iconos = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            loading: 'fa-spinner fa-spin'
        };
        
        const colores = {
            success: { bg: '#d1fae5', color: '#059669' },
            error: { bg: '#fee2e2', color: '#dc2626' },
            warning: { bg: '#fef3c7', color: '#d97706' },
            info: { bg: '#e0f2fe', color: '#0284c7' },
            loading: { bg: '#f3f4f6', color: '#374151' }
        };
        
        const color = colores[tipo] || colores.info;
        
        alert.style.cssText = `
            background: ${color.bg};
            color: ${color.color};
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            opacity: 0.95;
        `;
        
        alert.innerHTML = `
            <i class="fas ${iconos[tipo] || iconos.info}" style="margin-top: 2px; flex-shrink: 0;"></i>
            <span style="flex: 1; line-height: 1.4;">${mensaje}</span>
            ${!persistente ? '<button class="alert-close" style="background: none; border: none; color: inherit; cursor: pointer; opacity: 0.7; padding: 0; margin-left: 10px;">×</button>' : ''}
        `;
        
        container.appendChild(alert);
        
        // Mostrar con animación
        setTimeout(() => {
            alert.style.transform = 'translateX(0)';
        }, 10);
        
        // Botón de cierre
        const closeBtn = alert.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => ocultarAlerta(alertId));
        }
        
        // Auto-ocultar si no es persistente
        if (!persistente && tipo !== 'loading') {
            setTimeout(() => ocultarAlerta(alertId), 5000);
        }
        
        return alertId;
    }
    
    function ocultarAlerta(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.style.transform = 'translateX(100%)';
            alert.style.opacity = '0';
            
            setTimeout(() => {
                alert.remove();
                
                // Limpiar contenedor si está vacío
                const container = document.querySelector('.alert-container');
                if (container && container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }
    }
    
    // ===== VERIFICAR CONEXIÓN =====
    function verificarConexion() {
        if (!navigator.onLine) {
            mostrarAlerta(
                'Sin conexión a internet. Algunas funciones pueden no estar disponibles.',
                'warning',
                true
            );
        }
    }
    
    // Event listeners para estado de conexión
    window.addEventListener('online', () => {
        mostrarAlerta('Conexión a internet restaurada', 'success');
    });
    
    window.addEventListener('offline', () => {
        mostrarAlerta('Se ha perdido la conexión a internet', 'warning', true);
    });
    
    // Verificar conexión inicial
    verificarConexion();
    
    console.log('Sistema de solicitudes inicializado correctamente');
});