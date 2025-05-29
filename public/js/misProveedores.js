// Agregar este script al final de misProveedores.php, justo antes de cerrar el </body>

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const searchInput = document.querySelector('.search-input');
    const sectorFilter = document.getElementById('filter-sector');
    const modalConfirmar = document.getElementById('modal-confirmar');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    const inputRelacionId = document.getElementById('relacion-id-eliminar');
    
    // ===== FILTRADO DE PROVEEDORES =====
    
    // Filtrado por búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filtrarProveedores();
        });
    }
    
    // Filtrado por sector
    if (sectorFilter) {
        sectorFilter.addEventListener('change', function() {
            filtrarProveedores();
        });
    }
    
    function filtrarProveedores() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedSector = sectorFilter ? sectorFilter.value.toLowerCase() : '';
        
        // Seleccionar todos los elementos de proveedor
        const proveedorRows = document.querySelectorAll('.proveedor-row');
        const proveedorCards = document.querySelectorAll('.proveedor-card');
        
        function debeMostrar(element) {
            const nombreProveedor = element.querySelector('.proveedor-name').textContent.toLowerCase();
            const sectorElement = element.querySelector('.tag');
            const sectorClase = sectorElement ? Array.from(sectorElement.classList).find(cls => cls.startsWith('tag-')) : '';
            const sectorProveedor = sectorClase ? sectorClase.replace('tag-', '') : '';
            
            const cumpleBusqueda = !searchTerm || 
                                  nombreProveedor.includes(searchTerm) || 
                                  sectorProveedor.includes(searchTerm);
            
            const cumpleSector = !selectedSector || sectorProveedor === selectedSector;
            
            return cumpleBusqueda && cumpleSector;
        }
        
        // Aplicar filtros a filas de tabla
        proveedorRows.forEach(row => {
            row.style.display = debeMostrar(row) ? '' : 'none';
        });
        
        // Aplicar filtros a tarjetas móviles
        proveedorCards.forEach(card => {
            card.style.display = debeMostrar(card) ? '' : 'none';
        });
    }
    
    // ===== GESTIÓN DE ELIMINACIÓN =====
    
    // Event delegation para botones de eliminar
    document.addEventListener('click', function(e) {
        // Verificar si el click fue en un botón de eliminar
        if (e.target.closest('.btn-remove')) {
            e.preventDefault();
            e.stopPropagation();
            
            const btn = e.target.closest('.btn-remove');
            const relacionId = btn.getAttribute('data-id');
            
            if (!relacionId) {
                mostrarNotificacion('Error: ID de relación no encontrado', 'error');
                return;
            }
            
            // Obtener nombre del proveedor para confirmación
            const card = btn.closest('.proveedor-row, .proveedor-card');
            const nombreProveedor = card ? card.querySelector('.proveedor-name').textContent : 'este proveedor';
            
            // Mostrar modal de confirmación
            if (confirm(`¿Estás seguro de que deseas eliminar la relación con "${nombreProveedor}"? Esta acción no se puede deshacer.`)) {
                eliminarRelacion(relacionId, btn);
            }
        }
    });
    
    // Función para eliminar relación
    function eliminarRelacion(relacionId, btnElement) {
        // Mostrar estado de carga en el botón
        const originalContent = btnElement.innerHTML;
        btnElement.disabled = true;
        btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Preparar datos
        const formData = new FormData();
        formData.append('relacionId', relacionId);
        
        // Enviar solicitud
        fetch('../../php/actions/terminarRelacion.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data); // Debug
            
            if (data.success) {
                // Encontrar y eliminar elementos del DOM
                const elementos = document.querySelectorAll(`[data-id="${relacionId}"]`);
                
                elementos.forEach(elemento => {
                    const contenedor = elemento.closest('.proveedor-row, .proveedor-card');
                    if (contenedor) {
                        // Animación de salida
                        contenedor.style.transition = 'all 0.3s ease';
                        contenedor.style.opacity = '0';
                        contenedor.style.transform = 'translateX(-20px)';
                        
                        setTimeout(() => {
                            contenedor.remove();
                            verificarEstadoVacio();
                        }, 300);
                    }
                });
                
                mostrarNotificacion(data.message || 'Relación eliminada correctamente', 'success');
            } else {
                // Restaurar botón en caso de error
                btnElement.disabled = false;
                btnElement.innerHTML = originalContent;
                
                mostrarNotificacion('Error: ' + (data.message || 'No se pudo eliminar la relación'), 'error');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            
            // Restaurar botón
            btnElement.disabled = false;
            btnElement.innerHTML = originalContent;
            
            mostrarNotificacion('Error de conexión. Verifica tu internet e inténtalo de nuevo.', 'error');
        });
    }
    
    // Verificar si quedan proveedores después de eliminar
    function verificarEstadoVacio() {
        const filasVisibles = document.querySelectorAll('.proveedor-row:not([style*="display: none"])');
        const tarjetasVisibles = document.querySelectorAll('.proveedor-card:not([style*="display: none"])');
        
        if (filasVisibles.length === 0 && tarjetasVisibles.length === 0) {
            // Mostrar mensaje de estado vacío
            const containerTabla = document.querySelector('.proveedores-lista');
            const containerTarjetas = document.querySelector('.proveedores-cards');
            
            const mensajeVacio = `
                <div class="empty-state" style="padding: 40px; text-align: center; width: 100%;">
                    <i class="fas fa-store" style="font-size: 48px; margin-bottom: 20px; color: #cbd5e1;"></i>
                    <p>No tienes proveedores vinculados actualmente.</p>
                    <p>Explora nuevos proveedores para establecer relaciones comerciales.</p>
                    <a href="explorarProveedores.php" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">
                        Explorar Proveedores
                    </a>
                </div>
            `;
            
            if (containerTabla) {
                containerTabla.innerHTML = mensajeVacio;
            }
            
            if (containerTarjetas) {
                containerTarjetas.innerHTML = mensajeVacio;
            }
        }
    }
    
    // ===== FUNCIONES DE UTILIDAD =====
    
    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear contenedor si no existe
        let container = document.querySelector('.notificaciones-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notificaciones-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
        
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        
        const iconos = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const colores = {
            success: { bg: '#d1fae5', color: '#059669' },
            error: { bg: '#fee2e2', color: '#dc2626' },
            warning: { bg: '#fef3c7', color: '#d97706' },
            info: { bg: '#e0f2fe', color: '#0284c7' }
        };
        
        const colorConfig = colores[tipo] || colores.info;
        
        notificacion.innerHTML = `
            <i class="fas ${iconos[tipo] || iconos.info}"></i>
            <span>${mensaje}</span>
            <button class="btn-cerrar-notif" style="background: none; border: none; cursor: pointer; margin-left: auto; opacity: 0.7;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificacion.style.cssText = `
            background-color: ${colorConfig.bg};
            color: ${colorConfig.color};
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 350px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        container.appendChild(notificacion);
        
        // Mostrar con animación
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);
        
        // Configurar botón de cierre
        const btnCerrar = notificacion.querySelector('.btn-cerrar-notif');
        btnCerrar.addEventListener('click', () => cerrarNotificacion(notificacion));
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (notificacion.parentNode) {
                cerrarNotificacion(notificacion);
            }
        }, 5000);
    }
    
    function cerrarNotificacion(notificacion) {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.remove();
                
                // Eliminar contenedor si está vacío
                const container = document.querySelector('.notificaciones-container');
                if (container && container.children.length === 0) {
                    container.remove();
                }
            }
        }, 300);
    }
    
    // ===== CERRAR MODALES =====
    
    // Cerrar modales con botón de cierre
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Cerrar modal al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
