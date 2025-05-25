document.addEventListener('DOMContentLoaded', function() {
    // References to DOM elements
    const btnMisSolicitudes = document.getElementById('btn-mis-solicitudes');
    const modalSolicitudes = document.getElementById('modal-solicitudes');
    const tabButtons = document.querySelectorAll('.solicitud-tab-btn');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Open solicitudes modal
    if (btnMisSolicitudes) {
        btnMisSolicitudes.addEventListener('click', function() {
            modalSolicitudes.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            showAlert({
                type: 'info',
                title: 'Cargando solicitudes',
                message: 'Obteniendo tus solicitudes...',
                duration: 2000
            });
            
            loadSolicitudes('enviadas'); // Load enviadas by default
        });
    }
    
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            document.querySelectorAll('.solicitud-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`tab-${tabType}`).classList.add('active');
            
            // Load solicitudes for the selected tab
            loadSolicitudes(tabType);
        });
    });
    
    // Close modal
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modalSolicitudes.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Click outside to close
    modalSolicitudes.addEventListener('click', function(e) {
        if (e.target === modalSolicitudes) {
            modalSolicitudes.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Function to load solicitudes
    function loadSolicitudes(type) {
        const container = document.getElementById(`solicitudes-${type}-container`);
        container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Cargando solicitudes...</div>';
        
        // Fetch solicitudes from the server
        fetch(`../../php/actions/obtenerSolicitudes.php?tipo=${type}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    renderSolicitudes(container, data.solicitudes, type);
                    
                    showAlert({
                        type: 'success',
                        title: 'Solicitudes cargadas',
                        message: `Se encontraron ${data.solicitudes.length} solicitudes ${type}`,
                        duration: 2000
                    });
                } else {
                    container.innerHTML = `<div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>${data.mensaje || 'No se pudieron cargar las solicitudes'}</p>
                    </div>`;
                    
                    showAlert({
                        type: 'warning',
                        title: 'Sin solicitudes',
                        message: data.mensaje || 'No se encontraron solicitudes',
                        duration: 3000
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching solicitudes:', error);
                container.innerHTML = `<div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Ocurrió un error al cargar las solicitudes</p>
                    <button class="btn btn-secondary" onclick="loadSolicitudes('${type}')">Reintentar</button>
                </div>`;
                
                showAlert({
                    type: 'error',
                    title: 'Error de conexión',
                    message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
                });
            });
    }
    
    // Function to render solicitudes
    function renderSolicitudes(container, solicitudes, type) {
        if (!solicitudes || solicitudes.length === 0) {
            const tipoTexto = type === 'enviadas' ? 'enviadas' : 'recibidas';
            container.innerHTML = `<div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No tienes solicitudes ${tipoTexto} actualmente</p>
                <p class="text-muted">${type === 'enviadas' ? 'Explora proveedores para enviar nuevas solicitudes' : 'Las solicitudes que recibas aparecerán aquí'}</p>
            </div>`;
            return;
        }
        
        let html = '<div class="solicitudes-list">';
        
        solicitudes.forEach(solicitud => {
            const isEnviada = type === 'enviadas';
            const empresaNombre = isEnviada ? solicitud.empresa_proveedor : solicitud.empresa_solicitante;
            const iniciales = getInitials(empresaNombre);
            const estadoClase = `estado-${solicitud.estado}`;
            const estadoTexto = capitalizeFirst(solicitud.estado);
            
            html += `
                <div class="solicitud-card" data-id="${solicitud.id}">
                    <div class="solicitud-header">
                        <div class="solicitud-empresa">
                            <div class="solicitud-empresa-avatar">${iniciales}</div>
                            <div class="solicitud-empresa-info">
                                <div class="solicitud-empresa-nombre">${empresaNombre}</div>
                                <div class="solicitud-empresa-tipo">${isEnviada ? 'Proveedor' : 'Solicitante'}</div>
                            </div>
                        </div>
                        <div class="solicitud-meta">
                            <div class="solicitud-fecha">${formatDate(solicitud.fecha_creacion)}</div>
                            <div class="solicitud-estado ${estadoClase}">${estadoTexto}</div>
                        </div>
                    </div>
                    <div class="solicitud-body">
                        <div class="solicitud-asunto">${solicitud.asunto}</div>
                        <div class="solicitud-mensaje">${truncateText(solicitud.mensaje, 150)}</div>
                    </div>
                    <div class="solicitud-footer">`;
            
            // Add action buttons only for received requests that are pending
            if (!isEnviada && solicitud.estado === 'pendiente') {
                html += `
                        <div class="solicitud-acciones">
                            <button class="btn-solicitud btn-aceptar" data-action="aceptar" data-id="${solicitud.id}">
                                <i class="fas fa-check"></i> Aceptar
                            </button>
                            <button class="btn-solicitud btn-rechazar" data-action="rechazar" data-id="${solicitud.id}">
                                <i class="fas fa-times"></i> Rechazar
                            </button>
                        </div>`;
            } else {
                html += `<div class="solicitud-info">
                    <small class="text-muted">${getSolicitudStatusText(solicitud.estado, isEnviada)}</small>
                </div>`;
            }
            
            html += `
                    </div>
                </div>`;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Add event listeners for action buttons
        const actionButtons = container.querySelectorAll('.btn-solicitud');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const solicitudId = this.dataset.id;
                const action = this.dataset.action;
                const solicitudCard = this.closest('.solicitud-card');
                const empresaNombre = solicitudCard.querySelector('.solicitud-empresa-nombre').textContent;
                
                updateSolicitudEstado(solicitudId, action, empresaNombre);
            });
        });
    }
    
    // Function to update solicitud estado with enhanced alerts
    function updateSolicitudEstado(id, action, empresaNombre) {
        const actionText = action === 'aceptar' ? 'aceptar' : 'rechazar';
        const mensaje = `¿Estás seguro de que deseas ${actionText} la solicitud de "${empresaNombre}"?`;
        
        confirmarAccionConAlerta({
            type: 'warning',
            title: `Confirmar ${actionText}`,
            message: mensaje
        }).then(confirmed => {
            if (confirmed) {
                const loadingId = showAlert({
                    type: 'loading',
                    title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)}ando solicitud...`,
                    message: `Procesando la solicitud de "${empresaNombre}"`,
                    persistent: true
                });
                
                fetch('../../php/actions/actualizarSolicitud.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `id=${id}&accion=${action}`
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    hideAlert(loadingId);
                    
                    handleAjaxResponse(data, () => {
                        // Success callback
                        const activeTab = document.querySelector('.solicitud-tab-btn.active').dataset.tab;
                        loadSolicitudes(activeTab);
                        
                        // Show additional info for accepted requests
                        if (action === 'aceptar') {
                            setTimeout(() => {
                                showAlert({
                                    type: 'info',
                                    title: 'Relación establecida',
                                    message: `"${empresaNombre}" ahora aparecerá en tu lista de clientes`,
                                    duration: 5000
                                });
                            }, 1000);
                        }
                    });
                })
                .catch(error => {
                    hideAlert(loadingId);
                    console.error('Error updating solicitud:', error);
                    showAlert({
                        type: 'error',
                        title: 'Error de conexión',
                        message: 'No se pudo procesar la solicitud. Verifica tu conexión e inténtalo de nuevo.'
                    });
                });
            }
        });
    }
    
    // Make loadSolicitudes available globally for retry buttons
    window.loadSolicitudes = loadSolicitudes;
    
    // Helper function: Get initials from name
    function getInitials(name) {
        if (!name) return '??';
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }
    
    // Helper function: Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Hace 1 día';
        } else if (diffDays < 7) {
            return `Hace ${diffDays} días`;
        } else {
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
    }
    
    // Helper function: Capitalize first letter
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Helper function: Truncate text
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    // Helper function: Get status text for solicitudes
    function getSolicitudStatusText(estado, isEnviada) {
        if (estado === 'pendiente') {
            return isEnviada ? 'Esperando respuesta del proveedor' : 'Pendiente de respuesta';
        } else if (estado === 'aceptada') {
            return isEnviada ? 'Solicitud aceptada - Relación establecida' : 'Solicitud aceptada';
        } else if (estado === 'rechazada') {
            return isEnviada ? 'Solicitud rechazada' : 'Solicitud rechazada';
        }
        return '';
    }
    
    // Helper function: Confirm action with alerts
    function confirmarAccionConAlerta(config) {
        return new Promise((resolve) => {
            const confirmed = confirm(config.message || '¿Estás seguro de que deseas continuar?');
            resolve(confirmed);
        });
    }
});