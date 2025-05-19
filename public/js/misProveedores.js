/**
 * Script para manejar la vista de Mis Proveedores
 * Este script implementa:
 * - Filtrado de proveedores
 * - Consulta de detalles de proveedor
 * - Eliminación de relaciones con proveedores
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const searchInput = document.querySelector('.search-input');
    const sectorFilter = document.getElementById('filter-sector');
    const ratingFilter = document.getElementById('filter-rating');
    const sortFilter = document.getElementById('filter-sort');
    const viewButtons = document.querySelectorAll('.btn-view');
    const removeButtons = document.querySelectorAll('.btn-remove');
    const modalPerfil = document.getElementById('modal-perfil');
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
    
    // Filtrado por valoración
    if (ratingFilter) {
        ratingFilter.addEventListener('change', function() {
            filtrarProveedores();
        });
    }
    
    // Ordenamiento
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            ordenarProveedores(this.value);
        });
    }
    
    // Función para filtrar proveedores según los criterios seleccionados
    function filtrarProveedores() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedSector = sectorFilter ? sectorFilter.value.toLowerCase() : '';
        const selectedRating = ratingFilter ? parseFloat(ratingFilter.value) || 0 : 0;
        
        // Seleccionar todos los elementos de proveedor
        const proveedorRows = document.querySelectorAll('.proveedor-row');
        const proveedorCards = document.querySelectorAll('.proveedor-card');
        
        // Función para determinar si un elemento debe mostrarse
        function debeMostrar(element) {
            // Búsqueda por texto
            const nombreProveedor = element.querySelector('.proveedor-name').textContent.toLowerCase();
            const sectorElement = element.querySelector('.tag');
            const sectorClase = sectorElement ? Array.from(sectorElement.classList).find(cls => cls.startsWith('tag-')) : '';
            const sectorProveedor = sectorClase ? sectorClase.replace('tag-', '') : '';
            
            // Filtro por texto de búsqueda
            const cumpleBusqueda = !searchTerm || 
                                  nombreProveedor.includes(searchTerm) || 
                                  sectorProveedor.includes(searchTerm);
            
            // Filtro por sector
            const cumpleSector = !selectedSector || sectorProveedor === selectedSector;
            
            // Filtro por valoración (simulado)
            const ratingElement = element.querySelector('.rating span');
            const rating = ratingElement ? parseFloat(ratingElement.textContent) : 0;
            const cumpleRating = !selectedRating || rating >= selectedRating;
            
            return cumpleBusqueda && cumpleSector && cumpleRating;
        }
        
        // Aplicar filtros a filas de tabla
        proveedorRows.forEach(row => {
            row.style.display = debeMostrar(row) ? '' : 'none';
        });
        
        // Aplicar filtros a tarjetas móviles
        proveedorCards.forEach(card => {
            card.style.display = debeMostrar(card) ? '' : 'none';
        });
        
        // Actualizar mensaje de estado vacío si no hay resultados
        actualizarEstadoVacio();
    }
    
    // Función para ordenar proveedores
    function ordenarProveedores(criterio) {
        // Contenedores de proveedores
        const tablaProveedores = document.querySelector('.proveedores-lista');
        const tarjetasProveedores = document.querySelector('.proveedores-cards');
        
        if (!tablaProveedores || !tarjetasProveedores) return;
        
        // Función para comparar elementos según el criterio
        function comparar(a, b) {
            switch (criterio) {
                case 'name-asc':
                    return a.querySelector('.proveedor-name').textContent
                        .localeCompare(b.querySelector('.proveedor-name').textContent);
                
                case 'name-desc':
                    return b.querySelector('.proveedor-name').textContent
                        .localeCompare(a.querySelector('.proveedor-name').textContent);
                
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.rating span').textContent);
                    const ratingB = parseFloat(b.querySelector('.rating span').textContent);
                    return ratingB - ratingA;
                
                case 'recent':
                default:
                    // Ordenar por reciente: implementación básica
                    // En una aplicación real, las filas tendrían un atributo data-date
                    return 0;
            }
        }
        
        // Ordenar filas de tabla
        const filas = Array.from(tablaProveedores.querySelectorAll('.proveedor-row'));
        filas.sort(comparar).forEach(fila => {
            tablaProveedores.appendChild(fila);
        });
        
        // Ordenar tarjetas
        const tarjetas = Array.from(tarjetasProveedores.querySelectorAll('.proveedor-card'));
        tarjetas.sort(comparar).forEach(tarjeta => {
            tarjetasProveedores.appendChild(tarjeta);
        });
    }
    
    // Función para mostrar mensaje de estado vacío si no hay resultados visibles
    function actualizarEstadoVacio() {
        const filasVisibles = document.querySelectorAll('.proveedor-row:not([style*="display: none"])');
        const tarjetasVisibles = document.querySelectorAll('.proveedor-card:not([style*="display: none"])');
        
        // Verificar contenedores
        const tablaProveedores = document.querySelector('.proveedores-lista');
        const tarjetasProveedores = document.querySelector('.proveedores-cards');
        
        if (!tablaProveedores || !tarjetasProveedores) return;
        
        // Verificar si hay elementos visibles
        const hayElementosVisibles = filasVisibles.length > 0 || tarjetasVisibles.length > 0;
        
        // Contenido para estado vacío
        const mensajeVacio = `
            <div class="empty-state" style="padding: 40px; text-align: center; width: 100%;">
                <i class="fas fa-filter" style="font-size: 48px; margin-bottom: 20px; color: #cbd5e1;"></i>
                <p>No se encontraron proveedores con los filtros seleccionados.</p>
                <button class="btn btn-secondary" id="reset-filters" style="margin-top: 15px;">
                    Restablecer filtros
                </button>
            </div>
        `;
        
        // Mensaje de estado vacío para filtros
        let estadoVacioTabla = tablaProveedores.querySelector('.empty-state');
        let estadoVacioTarjetas = tarjetasProveedores.querySelector('.empty-state');
        
        // Si no hay resultados y el contenedor tiene elementos (no está vacío por defecto)
        if (!hayElementosVisibles && tablaProveedores.querySelectorAll('.proveedor-row').length > 0) {
            // Mostrar mensaje de filtros vacíos
            if (!estadoVacioTabla) {
                tablaProveedores.insertAdjacentHTML('beforeend', mensajeVacio);
                estadoVacioTabla = tablaProveedores.querySelector('.empty-state');
            }
            
            if (!estadoVacioTarjetas) {
                tarjetasProveedores.insertAdjacentHTML('beforeend', mensajeVacio);
                estadoVacioTarjetas = tarjetasProveedores.querySelector('.empty-state');
            }
            
            // Agregar listener al botón de reset
            const resetButtons = document.querySelectorAll('#reset-filters');
            resetButtons.forEach(btn => {
                btn.addEventListener('click', resetearFiltros);
            });
        } else {
            // Eliminar mensajes vacíos si hay resultados
            if (estadoVacioTabla) estadoVacioTabla.remove();
            if (estadoVacioTarjetas) estadoVacioTarjetas.remove();
        }
    }
    
    // Función para resetear filtros
    function resetearFiltros() {
        if (searchInput) searchInput.value = '';
        if (sectorFilter) sectorFilter.value = '';
        if (ratingFilter) ratingFilter.value = '';
        if (sortFilter) sortFilter.value = 'recent';
        
        // Mostrar todos los elementos
        const proveedorRows = document.querySelectorAll('.proveedor-row');
        const proveedorCards = document.querySelectorAll('.proveedor-card');
        
        proveedorRows.forEach(row => {
            row.style.display = '';
        });
        
        proveedorCards.forEach(card => {
            card.style.display = '';
        });
        
        // Actualizar estado vacío
        actualizarEstadoVacio();
    }
    
    // ===== GESTIÓN DE MODALES =====
    
    // Mostrar modal de perfil de proveedor
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const proveedorId = this.getAttribute('data-id');
            mostrarPerfilProveedor(proveedorId);
        });
    });
    
    // Función para mostrar el perfil del proveedor en el modal
    function mostrarPerfilProveedor(proveedorId) {
        // En una implementación real, aquí harías una petición AJAX
        // para obtener los datos detallados del proveedor
        // Por ahora, simplemente buscar los datos en el DOM
        
        let nombreProveedor, sectorProveedor, emailProveedor, telefonoProveedor, 
            ubicacionProveedor, sitioWebProveedor, logoProveedor;
        
        // Buscar datos en la fila o tarjeta correspondiente
        const filaProveedor = document.querySelector(`.proveedor-row .btn-view[data-id="${proveedorId}"]`).closest('.proveedor-row');
        
        if (filaProveedor) {
            nombreProveedor = filaProveedor.querySelector('.proveedor-name').textContent;
            sectorProveedor = filaProveedor.querySelector('.tag').textContent;
            emailProveedor = filaProveedor.querySelector('.proveedor-contacto p:first-child').textContent.trim();
            telefonoProveedor = filaProveedor.querySelector('.proveedor-contacto p:last-child').textContent.trim();
            ubicacionProveedor = filaProveedor.querySelector('.proveedor-location').textContent.trim();
            
            const avatarImg = filaProveedor.querySelector('.proveedor-avatar img');
            logoProveedor = avatarImg ? avatarImg.src : null;
        }
        
        // Llenar el perfil en el modal
        const perfilContenido = document.getElementById('perfil-contenido');
        
        if (perfilContenido) {
            perfilContenido.innerHTML = `
                <div class="perfil-header">
                    <div class="perfil-avatar">
                        ${logoProveedor ? `<img src="${logoProveedor}" alt="${nombreProveedor}">` : nombreProveedor.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="perfil-info">
                        <h3>${nombreProveedor}</h3>
                        <div class="perfil-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${ubicacionProveedor}</span>
                            <span><i class="fas fa-tag"></i> ${sectorProveedor}</span>
                        </div>
                        <div class="perfil-rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>4.5</span>
                            </div>
                            <span>(16 valoraciones)</span>
                        </div>
                    </div>
                </div>

                <div class="perfil-section">
                    <h4>Información de contacto</h4>
                    <div class="contacto-info">
                        <div class="contacto-item">
                            <div class="contacto-icon"><i class="fas fa-envelope"></i></div>
                            <div class="contacto-text">${emailProveedor}</div>
                        </div>
                        <div class="contacto-item">
                            <div class="contacto-icon"><i class="fas fa-phone"></i></div>
                            <div class="contacto-text">${telefonoProveedor}</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Mostrar el modal
        modalPerfil.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll
    }
    
    // Mostrar modal de confirmación para eliminar proveedor
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const relacionId = this.getAttribute('data-id');
            
            // Guardar el ID para usarlo en la confirmación
            if (inputRelacionId) {
                inputRelacionId.value = relacionId;
            }
            
            // Mostrar modal de confirmación
            modalConfirmar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Eliminar proveedor al confirmar
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function() {
            const relacionId = inputRelacionId.value;
            
            if (relacionId) {
                // Mostrar estado de carga
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Eliminando...';
                
                // Crear datos para enviar
                const formData = new FormData();
                formData.append('relacionId', relacionId);
                
                // Enviar solicitud de eliminación
                fetch('../../php/actions/terminarRelacion.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    // Cerrar modal
                    modalConfirmar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    
                    if (data.success) {
                        // Eliminar elementos del DOM
                        const filasProveedor = document.querySelectorAll(`.btn-remove[data-id="${relacionId}"]`);
                        filasProveedor.forEach(btn => {
                            const fila = btn.closest('.proveedor-row') || btn.closest('.proveedor-card');
                            if (fila) {
                                fila.style.opacity = '0';
                                fila.style.transform = 'translateY(-10px)';
                                setTimeout(() => {
                                    fila.remove();
                                    actualizarEstadoVacio();
                                }, 300);
                            }
                        });
                        
                        // Mostrar mensaje de éxito
                        mostrarNotificacion('Proveedor eliminado correctamente', 'success');
                    } else {
                        // Mostrar error
                        mostrarNotificacion('Error: ' + (data.mensaje || 'No se pudo eliminar el proveedor'), 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarNotificacion('Error de conexión. Inténtalo de nuevo.', 'error');
                })
                .finally(() => {
                    // Restaurar botón
                    this.disabled = false;
                    this.innerHTML = 'Eliminar';
                });
            }
        });
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
    
    // ===== UTILIDADES =====
    
    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'info') {
        // Verificar si ya existe un contenedor de notificaciones
        let notificacionesContainer = document.querySelector('.notificaciones-container');
        
        if (!notificacionesContainer) {
            notificacionesContainer = document.createElement('div');
            notificacionesContainer.className = 'notificaciones-container';
            document.body.appendChild(notificacionesContainer);
            
            // Estilos para el contenedor
            Object.assign(notificacionesContainer.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });
        }
        
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        
        // Agregar ícono según el tipo
        let icono = 'fa-info-circle';
        if (tipo === 'success') icono = 'fa-check-circle';
        if (tipo === 'error') icono = 'fa-exclamation-circle';
        if (tipo === 'warning') icono = 'fa-exclamation-triangle';
        
        notificacion.innerHTML = `
            <i class="fas ${icono}"></i>
            <p>${mensaje}</p>
            <button class="btn-cerrar"><i class="fas fa-times"></i></button>
        `;
        
        // Estilos para la notificación
        Object.assign(notificacion.style, {
            backgroundColor: tipo === 'success' ? '#d1fae5' : 
                            tipo === 'error' ? '#fee2e2' : 
                            tipo === 'warning' ? '#fef3c7' : '#e0f2fe',
            color: tipo === 'success' ? '#059669' : 
                  tipo === 'error' ? '#dc2626' : 
                  tipo === 'warning' ? '#d97706' : '#0284c7',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '350px',
            animation: 'fadeInRight 0.3s ease'
        });
        
        // Agregar la notificación al contenedor
        notificacionesContainer.appendChild(notificacion);
        
        // Configurar botón de cierre
        const btnCerrar = notificacion.querySelector('.btn-cerrar');
        btnCerrar.addEventListener('click', () => {
            notificacion.style.opacity = '0';
            notificacion.style.transform = 'translateX(20px)';
            setTimeout(() => {
                notificacion.remove();
                
                // Eliminar contenedor si está vacío
                if (notificacionesContainer.children.length === 0) {
                    notificacionesContainer.remove();
                }
            }, 300);
        });
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.style.opacity = '0';
                notificacion.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    notificacion.remove();
                    
                    // Eliminar contenedor si está vacío
                    if (notificacionesContainer.children.length === 0) {
                        notificacionesContainer.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Crear estilos para animaciones
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .notificacion {
            transition: all 0.3s ease;
        }
        
        .btn-cerrar {
            background: none;
            border: none;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.7;
        }
        
        .btn-cerrar:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(styleElement);
});