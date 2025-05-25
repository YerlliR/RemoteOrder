// Sistema de Alertas Global para RemoteOrder
// Archivo: public/js/alertSystem.js

class AlertSystem {
    constructor() {
        this.container = null;
        this.alerts = [];
        this.maxAlerts = 5;
        this.defaultDuration = 4000;
        this.init();
    }

    init() {
        // Crear contenedor de alertas si no existe
        this.createContainer();
        
        // Inyectar estilos CSS
        this.injectStyles();
        
        // Hacer el sistema disponible globalmente
        window.showAlert = this.show.bind(this);
        window.hideAlert = this.hide.bind(this);
        window.clearAlerts = this.clearAll.bind(this);
    }

    createContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'alert-container';
            this.container.className = 'alert-container';
            document.body.appendChild(this.container);
        }
    }

    injectStyles() {
        if (document.getElementById('alert-system-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'alert-system-styles';
        styles.textContent = `
            .alert-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 400px;
                width: 100%;
            }

            .alert {
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                border-left: 4px solid;
                padding: 16px 20px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                pointer-events: auto;
                position: relative;
                overflow: hidden;
                min-height: 60px;
                backdrop-filter: blur(10px);
            }

            .alert::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, currentColor, transparent);
                opacity: 0.3;
            }

            .alert.show {
                transform: translateX(0);
                opacity: 1;
            }

            .alert.hide {
                transform: translateX(100%);
                opacity: 0;
                margin-top: -80px;
                margin-bottom: 0;
            }

            /* Tipos de alerta */
            .alert.success {
                border-left-color: #10b981;
                background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
                color: #065f46;
            }

            .alert.error {
                border-left-color: #ef4444;
                background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
                color: #7f1d1d;
            }

            .alert.warning {
                border-left-color: #f59e0b;
                background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
                color: #78350f;
            }

            .alert.info {
                border-left-color: #3b82f6;
                background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
                color: #1e3a8a;
            }

            .alert.loading {
                border-left-color: #8b5cf6;
                background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);
                color: #581c87;
            }

            /* Iconos */
            .alert-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: white;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .alert.success .alert-icon {
                background: #10b981;
            }

            .alert.error .alert-icon {
                background: #ef4444;
            }

            .alert.warning .alert-icon {
                background: #f59e0b;
            }

            .alert.info .alert-icon {
                background: #3b82f6;
            }

            .alert.loading .alert-icon {
                background: #8b5cf6;
                animation: spin 1s linear infinite;
            }

            /* Contenido */
            .alert-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .alert-title {
                font-weight: 600;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
            }

            .alert-message {
                font-size: 13px;
                line-height: 1.4;
                opacity: 0.9;
                margin: 0;
            }

            /* Botón de cerrar */
            .alert-close {
                background: none;
                border: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0.5;
                transition: all 0.2s ease;
                font-size: 16px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .alert-close:hover {
                opacity: 1;
                background: rgba(0, 0, 0, 0.1);
            }

            /* Barra de progreso */
            .alert-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 2px;
                background: currentColor;
                opacity: 0.3;
                transition: width linear;
            }

            /* Animaciones */
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .alert.pulse {
                animation: pulse 0.6s ease-in-out;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .alert-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }

                .alert {
                    padding: 14px 16px;
                    gap: 10px;
                }

                .alert-title {
                    font-size: 13px;
                }

                .alert-message {
                    font-size: 12px;
                }
            }

            /* Tema oscuro */
            @media (prefers-color-scheme: dark) {
                .alert {
                    background: #1f2937;
                    color: #f9fafb;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .alert.success {
                    background: linear-gradient(135deg, #064e3b 0%, #1f2937 100%);
                }

                .alert.error {
                    background: linear-gradient(135deg, #7f1d1d 0%, #1f2937 100%);
                }

                .alert.warning {
                    background: linear-gradient(135deg, #78350f 0%, #1f2937 100%);
                }

                .alert.info {
                    background: linear-gradient(135deg, #1e3a8a 0%, #1f2937 100%);
                }

                .alert.loading {
                    background: linear-gradient(135deg, #581c87 0%, #1f2937 100%);
                }
            }
        `;
        document.head.appendChild(styles);
    }

    show(options) {
        if (typeof options === 'string') {
            options = { message: options };
        }

        const config = {
            type: 'info',
            title: '',
            message: '',
            duration: this.defaultDuration,
            persistent: false,
            action: null,
            ...options
        };

        // Limitar número de alertas
        if (this.alerts.length >= this.maxAlerts) {
            this.hide(this.alerts[0].id);
        }

        const alert = this.createAlert(config);
        this.alerts.push(alert);
        this.container.appendChild(alert.element);

        // Mostrar alerta con animación
        setTimeout(() => {
            alert.element.classList.add('show');
        }, 50);

        // Auto-hide si no es persistente
        if (!config.persistent && config.duration > 0) {
            this.startProgress(alert, config.duration);
            alert.timeout = setTimeout(() => {
                this.hide(alert.id);
            }, config.duration);
        }

        return alert.id;
    }

    createAlert(config) {
        const id = 'alert-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        const element = document.createElement('div');
        element.className = `alert ${config.type}`;
        element.setAttribute('data-alert-id', id);

        const icon = this.getIcon(config.type);
        
        element.innerHTML = `
            <div class="alert-icon">${icon}</div>
            <div class="alert-content">
                ${config.title ? `<div class="alert-title">${this.escapeHtml(config.title)}</div>` : ''}
                <div class="alert-message">${this.escapeHtml(config.message)}</div>
            </div>
            <button class="alert-close" type="button" aria-label="Cerrar">×</button>
            ${!config.persistent && config.duration > 0 ? '<div class="alert-progress"></div>' : ''}
        `;

        // Event listeners
        const closeBtn = element.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => this.hide(id));

        // Acción personalizada
        if (config.action) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', (e) => {
                if (e.target === closeBtn) return;
                config.action();
            });
        }

        return {
            id,
            element,
            config,
            timeout: null
        };
    }

    startProgress(alert, duration) {
        const progressBar = alert.element.querySelector('.alert-progress');
        if (progressBar) {
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.style.width = '0%';
                progressBar.style.transition = `width ${duration}ms linear`;
            }, 50);
        }
    }

    hide(alertId) {
        const alertIndex = this.alerts.findIndex(a => a.id === alertId);
        if (alertIndex === -1) return;

        const alert = this.alerts[alertIndex];
        
        // Limpiar timeout si existe
        if (alert.timeout) {
            clearTimeout(alert.timeout);
        }

        // Animación de salida
        alert.element.classList.add('hide');
        
        setTimeout(() => {
            if (alert.element.parentNode) {
                alert.element.parentNode.removeChild(alert.element);
            }
            this.alerts.splice(alertIndex, 1);
        }, 400);
    }

    clearAll() {
        this.alerts.forEach(alert => {
            if (alert.timeout) {
                clearTimeout(alert.timeout);
            }
            if (alert.element.parentNode) {
                alert.element.parentNode.removeChild(alert.element);
            }
        });
        this.alerts = [];
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
            loading: '⟳'
        };
        return icons[type] || icons.info;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Métodos de conveniencia
    success(message, options = {}) {
        return this.show({ ...options, message, type: 'success' });
    }

    error(message, options = {}) {
        return this.show({ ...options, message, type: 'error' });
    }

    warning(message, options = {}) {
        return this.show({ ...options, message, type: 'warning' });
    }

    info(message, options = {}) {
        return this.show({ ...options, message, type: 'info' });
    }

    loading(message, options = {}) {
        return this.show({ 
            ...options, 
            message, 
            type: 'loading', 
            persistent: true,
            duration: 0 
        });
    }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.alertSystem = new AlertSystem();
});

// También inicializar inmediatamente si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.alertSystem = new AlertSystem();
    });
} else {
    window.alertSystem = new AlertSystem();
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlertSystem;
}