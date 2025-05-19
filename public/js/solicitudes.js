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
        });
    });
    
    // Click outside to close
    modalSolicitudes.addEventListener('click', function(e) {
        if (e.target === modalSolicitudes) {
            modalSolicitudes.classList.remove('active');
        }
    });
    
    // Function to load solicitudes
    function loadSolicitudes(type) {
        const container = document.getElementById(`solicitudes-${type}-container`);
        container.innerHTML = '<div class="loading-spinner">Cargando solicitudes...</div>';
        
        // Fetch solicitudes from the server
        fetch(`../../php/actions/obtenerSolicitudes.php?tipo=${type}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderSolicitudes(container, data.solicitudes, type);
                } else {
                    container.innerHTML = `<div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>${data.mensaje || 'No se pudieron cargar las solicitudes'}</p>
                    </div>`;
                }
            })
            .catch(error => {
                console.error('Error fetching solicitudes:', error);
                container.innerHTML = `<div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Ocurrió un error al cargar las solicitudes</p>
                </div>`;
            });
    }
    
    // Function to render solicitudes
    function renderSolicitudes(container, solicitudes, type) {
        if (!solicitudes || solicitudes.length === 0) {
            container.innerHTML = `<div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No tienes solicitudes ${type === 'enviadas' ? 'enviadas' : 'recibidas'} actualmente</p>
            </div>`;
            return;
        }
        
        let html = '<div class="solicitudes-list">';
        
        solicitudes.forEach(solicitud => {
            const isEnviada = type === 'enviadas';
            const empresaNombre = isEnviada ? solicitud.empresa_proveedor : solicitud.empresa_solicitante;
            const iniciales = getInitials(empresaNombre);
            
            html += `
                <div class="solicitud-card" data-id="${solicitud.id}">
                    <div class="solicitud-header">
                        <div class="solicitud-empresa">
                            <div class="solicitud-empresa-avatar">${iniciales}</div>
                            <div class="solicitud-empresa-nombre">${empresaNombre}</div>
                        </div>
                        <div class="solicitud-fecha">${formatDate(solicitud.fecha_creacion)}</div>
                    </div>
                    <div class="solicitud-body">
                        <div class="solicitud-asunto">${solicitud.asunto}</div>
                        <div class="solicitud-mensaje">${solicitud.mensaje}</div>
                    </div>
                    <div class="solicitud-footer">
                        <div class="solicitud-estado estado-${solicitud.estado}">
                            ${capitalizeFirst(solicitud.estado)}
                        </div>`;
            
            // Add action buttons only for received requests that are pending
            if (!isEnviada && solicitud.estado === 'pendiente') {
                html += `
                        <div class="solicitud-acciones">
                            <button class="btn-solicitud btn-aceptar" data-action="aceptar" data-id="${solicitud.id}">
                                Aceptar
                            </button>
                            <button class="btn-solicitud btn-rechazar" data-action="rechazar" data-id="${solicitud.id}">
                                Rechazar
                            </button>
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
                updateSolicitudEstado(solicitudId, action);
            });
        });
    }
    
    // Function to update solicitud estado
    function updateSolicitudEstado(id, action) {
        fetch('../../php/actions/actualizarSolicitud.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${id}&accion=${action}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Reload the current tab
                const activeTab = document.querySelector('.solicitud-tab-btn.active').dataset.tab;
                loadSolicitudes(activeTab);
            } else {
                alert('Error: ' + (data.mensaje || 'No se pudo actualizar la solicitud'));
            }
        })
        .catch(error => {
            console.error('Error updating solicitud:', error);
            alert('Error de conexión. Inténtalo de nuevo.');
        });
    }
    
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
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
    
    // Helper function: Capitalize first letter
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});