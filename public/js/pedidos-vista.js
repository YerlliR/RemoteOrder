document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos
    const searchInput = document.querySelector('.search-input');
    const filterEstado = document.getElementById('filter-estado');
    const filterFecha = document.getElementById('filter-fecha');
    const modalDetalle = document.getElementById('modal-detalle-pedido');
    
    // Event listeners para filtros
    if (searchInput) {
        searchInput.addEventListener('input', filtrarPedidos);
    }
    
    if (filterEstado) {
        filterEstado.addEventListener('change', filtrarPedidos);
    }
    
    if (filterFecha) {
        filterFecha.addEventListener('change', filtrarPedidos);
    }
    
    // Función para filtrar pedidos
    function filtrarPedidos() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const estadoFilter = filterEstado ? filterEstado.value : '';
        const fechaFilter = filterFecha ? filterFecha.value : '';
        
        const pedidoCards = document.querySelectorAll('.pedido-card');
        
        pedidoCards.forEach(card => {
            let mostrar = true;
            
            // Filtro por búsqueda
            if (searchTerm) {
                const numeroPedido = card.querySelector('.pedido-numero').textContent.toLowerCase();
                const cliente = card.querySelector('.pedido-cliente, .pedido-proveedor').textContent.toLowerCase();
                
                if (!numeroPedido.includes(searchTerm) && !cliente.includes(searchTerm)) {
                    mostrar = false;
                }
            }
            
            // Filtro por estado
            if (estadoFilter && mostrar) {
                const estadoElement = card.querySelector('.pedido-estado');
                const estado = estadoElement.className.match(/estado-(\w+)/)[1];
                
                if (estado !== estadoFilter) {
                    mostrar = false;
                }
            }
            
            // Filtro por fecha
            if (fechaFilter && mostrar) {
                const fechaTexto = card.querySelector('.detalle-item i.fa-calendar').parentElement.textContent;
                const fechaPedido = parsearFecha(fechaTexto);
                
                if (!cumpleFiltroFecha(fechaPedido, fechaFilter)) {
                    mostrar = false;
                }
            }
            
            // Mostrar u ocultar la tarjeta
            card.style.display = mostrar ? '' : 'none';
        });
        
        // Mostrar mensaje si no hay resultados
        actualizarEstadoVacio();
    }
    
    // Función para parsear fecha del texto
    function parsearFecha(textoFecha) {
        // Extraer fecha en formato dd/mm/yyyy
        const match = textoFecha.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (match) {
            return new Date(match[3], match[2] - 1, match[1]);
        }
        return null;
    }
    
    // Función para verificar si la fecha cumple el filtro
    function cumpleFiltroFecha(fecha, filtro) {
        if (!fecha) return false;
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        switch (filtro) {
            case 'hoy':
                return fecha.toDateString() === hoy.toDateString();
                
            case 'semana':
                const inicioSemana = new Date(hoy);
                inicioSemana.setDate(hoy.getDate() - hoy.getDay());
                return fecha >= inicioSemana;
                
            case 'mes':
                return fecha.getMonth() === hoy.getMonth() && 
                       fecha.getFullYear() === hoy.getFullYear();
                
            default:
                return true;
        }
    }
    
    // Función para actualizar estado vacío
    function actualizarEstadoVacio() {
        const pedidosVisibles = document.querySelectorAll('.pedido-card:not([style*="display: none"])');
        const emptyState = document.querySelector('.empty-state');
        const pedidosLista = document.querySelector('.pedidos-lista');
        
        if (pedidosVisibles.length === 0 && !emptyState) {
            // Crear mensaje de no resultados
            const noResultsHtml = `
                <div class="empty-state no-results">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron pedidos con los filtros aplicados</p>
                    <button class="btn btn-secondary" onclick="limpiarFiltros()">
                        Limpiar filtros
                    </button>
                </div>
            `;
            
            // Verificar si ya existe un mensaje de no resultados
            const existingNoResults = pedidosLista.querySelector('.no-results');
            if (!existingNoResults) {
                pedidosLista.insertAdjacentHTML('beforeend', noResultsHtml);
            }
        } else if (pedidosVisibles.length > 0) {
            // Eliminar mensaje de no resultados si existe
            const noResults = pedidosLista.querySelector('.no-results');
            if (noResults) {
                noResults.remove();
            }
        }
    }
    
    // Función global para limpiar filtros
    window.limpiarFiltros = function() {
        if (searchInput) searchInput.value = '';
        if (filterEstado) filterEstado.value = '';
        if (filterFecha) filterFecha.value = '';
        
        filtrarPedidos();
    };
    
    // Función para ver detalle del pedido
    window.verDetallePedido = function(pedidoId) {
        // Mostrar loading
        const detalleContent = document.getElementById('detalle-pedido-content');
        detalleContent.innerHTML = '<div class="loading-spinner">Cargando detalles del pedido...</div>';
        
        // Mostrar modal
        modalDetalle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Cargar detalles del pedido
        fetch(`../../php/actions/obtenerDetallePedido.php?id=${pedidoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarDetallePedido(data.pedido);
                } else {
                    mostrarError('No se pudo cargar el detalle del pedido');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al cargar el detalle del pedido');
            });
    };
    
    // Función para mostrar el detalle del pedido
    function mostrarDetallePedido(pedido) {
        const detalleContent = document.getElementById('detalle-pedido-content');
        
        let html = `
            <div class="detalle-pedido-header">
                <div class="detalle-info-group">
                    <h4>Información del Pedido</h4>
                    <div class="detalle-info-row">
                        <span class="detalle-info-label">Número:</span>
                        <span class="detalle-info-value">#${pedido.numero_pedido}</span>
                    </div>
                    <div class="detalle-info-row">
                        <span class="detalle-info-label">Fecha:</span>
                        <span class="detalle-info-value">${formatearFecha(pedido.fecha_pedido)}</span>
                    </div>
                    <div class="detalle-info-row">
                        <span class="detalle-info-label">Estado:</span>
                        <span class="detalle-info-value">
                            <span class="pedido-estado estado-${pedido.estado}">
                                ${capitalizar(pedido.estado)}
                            </span>
                        </span>
                    </div>
                </div>
                
                <div class="detalle-info-group">
                    <h4>${pedido.tipo === 'recibido' ? 'Cliente' : 'Proveedor'}</h4>
                    <div class="detalle-info-row">
                        <span class="detalle-info-label">Empresa:</span>
                        <span class="detalle-info-value">${pedido.nombre_empresa}</span>
                    </div>
                    <div class="detalle-info-row">
                        <span class="detalle-info-label">Email:</span>
                        <span class="detalle-info-value">${pedido.email_empresa}</span>
                    </div>
                    <div class="detalle-info-row">
                        <span class="detalle-info-label">Teléfono:</span>
                        <span class="detalle-info-value">${pedido.telefono_empresa}</span>
                    </div>
                </div>
            </div>
            
            ${pedido.notas ? `
            <div class="detalle-notas">
                <h4>Notas del pedido</h4>
                <p>${pedido.notas}</p>
            </div>
            ` : ''}
            
            ${pedido.direccion_entrega ? `
            <div class="detalle-direccion">
                <h4>Dirección de entrega</h4>
                <p>${pedido.direccion_entrega}</p>
            </div>
            ` : ''}
            
            <div class="detalle-productos">
                <h4>Productos</h4>
                <div class="productos-tabla">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unit.</th>
                                <th>IVA</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        // Agregar líneas de productos
        pedido.lineas.forEach(linea => {
            html += `
                <tr>
                    <td>${linea.nombre_producto}</td>
                    <td>${linea.cantidad}</td>
                    <td>${formatearPrecio(linea.precio_unitario)}</td>
                    <td>${linea.iva}%</td>
                    <td>${formatearPrecio(linea.subtotal)}</td>
                </tr>
            `;
        });
        
        // Agregar totales
        html += `
                        </tbody>
                        <tfoot>
                            <tr class="totales-row">
                                <td colspan="4" style="text-align: right;">Subtotal:</td>
                                <td>${formatearPrecio(pedido.subtotal)}</td>
                            </tr>
                            <tr class="totales-row">
                                <td colspan="4" style="text-align: right;">IVA:</td>
                                <td>${formatearPrecio(pedido.total_iva)}</td>
                            </tr>
                            <tr class="totales-row total-final">
                                <td colspan="4" style="text-align: right;">Total:</td>
                                <td>${formatearPrecio(pedido.total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
        
        detalleContent.innerHTML = html;
    }
    
    // Función para cambiar estado del pedido
    window.cambiarEstadoPedido = function(pedidoId, nuevoEstado) {
        if (!confirm(`¿Está seguro de cambiar el estado del pedido a "${capitalizar(nuevoEstado)}"?`)) {
            return;
        }
        
        // Deshabilitar botón
        const btn = event.target;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        
        fetch('../../php/actions/actualizarEstadoPedido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pedidoId: pedidoId,
                estado: nuevoEstado
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion('Estado actualizado correctamente', 'success');
                // Recargar la página para mostrar los cambios
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                mostrarNotificacion(data.mensaje || 'Error al actualizar el estado', 'error');
                btn.disabled = false;
                // Restaurar texto original del botón
                restaurarTextoBoton(btn, nuevoEstado);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión', 'error');
            btn.disabled = false;
            restaurarTextoBoton(btn, nuevoEstado);
        });
    };
    
    // Función para restaurar texto del botón
    function restaurarTextoBoton(btn, estado) {
        switch(estado) {
            case 'procesando':
                btn.innerHTML = '<i class="fas fa-cog"></i> Procesar';
                break;
            case 'completado':
                btn.innerHTML = '<i class="fas fa-check"></i> Completar';
                break;
            case 'cancelado':
                btn.innerHTML = '<i class="fas fa-times"></i> Cancelar';
                break;
        }
    }
    
    // Función para imprimir pedido
    window.imprimirPedido = function(pedidoId) {
        window.open(`../../php/actions/imprimirPedido.php?id=${pedidoId}`, '_blank');
    };
    
    // Cerrar modal
    if (modalDetalle) {
        modalDetalle.querySelector('.modal-close').addEventListener('click', cerrarModalDetalle);
        modalDetalle.addEventListener('click', function(e) {
            if (e.target === modalDetalle) {
                cerrarModalDetalle();
            }
        });
    }
    
    function cerrarModalDetalle() {
        modalDetalle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Funciones auxiliares
    function formatearFecha(fecha) {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function formatearPrecio(precio) {
        return parseFloat(precio).toFixed(2) + ' €';
    }
    
    function capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    function mostrarError(mensaje) {
        const detalleContent = document.getElementById('detalle-pedido-content');
        detalleContent.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${mensaje}</p>
            </div>
        `;
    }
    
    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 
                             tipo === 'error' ? 'exclamation-circle' : 
                             'info-circle'}"></i>
            <span>${mensaje}</span>
        `;
        
        // Agregar estilos si no existen
        if (!document.querySelector('#notificacion-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notificacion-styles';
            styles.textContent = `
                .notificacion {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .notificacion.show {
                    transform: translateX(0);
                }
                .notificacion-success {
                    background-color: #d1fae5;
                    color: #059669;
                }
                .notificacion-error {
                    background-color: #fee2e2;
                    color: #dc2626;
                }
                .notificacion-info {
                    background-color: #e0f2fe;
                    color: #0284c7;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notificacion);
        
        // Mostrar con animación
        setTimeout(() => notificacion.classList.add('show'), 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notificacion.classList.remove('show');
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }
});