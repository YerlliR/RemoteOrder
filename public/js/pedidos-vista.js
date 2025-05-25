document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentProveedorId = null;
    let currentProveedorNombre = '';
    
    // ===== FUNCIONES PARA GESTIÓN DE PEDIDOS =====
    
    // Función para ver detalle del pedido
    window.verDetallePedido = function(pedidoId) {
        const loadingId = showAlert({
            type: 'loading',
            title: 'Cargando detalle...',
            message: 'Obteniendo información del pedido',
            persistent: true
        });
        
        fetch(`../../php/actions/obtenerDetallePedido.php?id=${pedidoId}`)
            .then(response => response.json())
            .then(data => {
                hideAlert(loadingId);
                
                if (data.success) {
                    mostrarDetallePedido(data.pedido);
                } else {
                    showAlert({
                        type: 'error',
                        title: 'Error',
                        message: data.mensaje || 'No se pudo cargar el detalle del pedido'
                    });
                }
            })
            .catch(error => {
                hideAlert(loadingId);
                console.error('Error:', error);
                showAlert({
                    type: 'error',
                    title: 'Error de conexión',
                    message: 'No se pudo conectar con el servidor'
                });
            });
    };
    
    // Función para cambiar estado de pedido
    window.cambiarEstadoPedido = function(pedidoId, nuevoEstado) {
        const estadosTexto = {
            'procesando': 'procesar',
            'completado': 'completar',
            'cancelado': 'cancelar'
        };
        
        const accion = estadosTexto[nuevoEstado] || 'actualizar';
        
        confirmarAccionConAlerta({
            type: 'warning',
            title: 'Confirmar acción',
            message: `¿Estás seguro de que deseas ${accion} este pedido?`
        }).then(confirmed => {
            if (confirmed) {
                const loadingId = showAlert({
                    type: 'loading',
                    title: 'Actualizando estado...',
                    message: `${accion.charAt(0).toUpperCase() + accion.slice(1)}ando pedido...`,
                    persistent: true
                });
                
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
                    hideAlert(loadingId);
                    
                    handleAjaxResponse(data, () => {
                        // Actualizar la UI
                        actualizarEstadoEnUI(pedidoId, nuevoEstado);
                    });
                })
                .catch(error => {
                    hideAlert(loadingId);
                    console.error('Error:', error);
                    showAlert({
                        type: 'error',
                        title: 'Error de conexión',
                        message: 'No se pudo actualizar el estado del pedido'
                    });
                });
            }
        });
    };
    
    // Función para imprimir pedido
    window.imprimirPedido = function(pedidoId) {
        showAlert({
            type: 'info',
            title: 'Función en desarrollo',
            message: 'La función de impresión estará disponible próximamente',
            duration: 3000
        });
    };
    
    // Función para abrir el modal de pedido
    window.abrirModalPedido = function(proveedorId, proveedorNombre) {
        currentProveedorId = proveedorId;
        currentProveedorNombre = proveedorNombre || 'Proveedor';
        
        // Crear o mostrar el modal
        let modal = document.getElementById('modal-pedido');
        if (!modal) {
            crearModalPedido();
            modal = document.getElementById('modal-pedido');
        }
        
        // Actualizar título del modal
        document.getElementById('pedido-proveedor-nombre').textContent = currentProveedorNombre;
        
        // Cargar productos del proveedor
        cargarProductosProveedor(proveedorId);
        
        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // ===== FUNCIONES AUXILIARES =====
    
    // Función para mostrar detalle del pedido en modal
    function mostrarDetallePedido(pedido) {
        const modalHtml = `
            <div id="modal-detalle-pedido" class="modal active">
                <div class="modal-content modal-detalle-content">
                    <div class="modal-header">
                        <h2>Detalle del Pedido #${pedido.numero_pedido}</h2>
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="pedido-info-header">
                            <div class="info-section">
                                <h3>Información General</h3>
                                <p><strong>Empresa ${pedido.tipo === 'recibido' ? 'Cliente' : 'Proveedor'}:</strong> ${pedido.nombre_empresa}</p>
                                <p><strong>Email:</strong> ${pedido.email_empresa}</p>
                                <p><strong>Teléfono:</strong> ${pedido.telefono_empresa}</p>
                                <p><strong>Fecha del pedido:</strong> ${new Date(pedido.fecha_pedido).toLocaleDateString()}</p>
                                ${pedido.fecha_entrega_estimada ? `<p><strong>Entrega estimada:</strong> ${new Date(pedido.fecha_entrega_estimada).toLocaleDateString()}</p>` : ''}
                                ${pedido.direccion_entrega ? `<p><strong>Dirección de entrega:</strong> ${pedido.direccion_entrega}</p>` : ''}
                                ${pedido.notas ? `<p><strong>Notas:</strong> ${pedido.notas}</p>` : ''}
                            </div>
                            <div class="estado-section">
                                <div class="pedido-estado estado-${pedido.estado}">
                                    ${pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                </div>
                            </div>
                        </div>
                        
                        <div class="pedido-productos">
                            <h3>Productos del Pedido</h3>
                            <div class="productos-tabla">
                                <div class="tabla-header">
                                    <div>Producto</div>
                                    <div>Cantidad</div>
                                    <div>Precio Unit.</div>
                                    <div>IVA</div>
                                    <div>Total</div>
                                </div>
                                ${pedido.lineas.map(linea => `
                                    <div class="tabla-row">
                                        <div class="producto-nombre">${linea.nombre_producto}</div>
                                        <div>${linea.cantidad}</div>
                                        <div>${parseFloat(linea.precio_unitario).toFixed(2)} €</div>
                                        <div>${linea.iva}%</div>
                                        <div>${parseFloat(linea.total).toFixed(2)} €</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="pedido-totales">
                            <div class="total-row">
                                <span>Subtotal:</span>
                                <span>${parseFloat(pedido.subtotal).toFixed(2)} €</span>
                            </div>
                            <div class="total-row">
                                <span>IVA:</span>
                                <span>${parseFloat(pedido.total_iva).toFixed(2)} €</span>
                            </div>
                            <div class="total-row total-final">
                                <span>Total:</span>
                                <span>${parseFloat(pedido.total).toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-close">Cerrar</button>
                        <button class="btn btn-primary" onclick="imprimirPedido(${pedido.id})">
                            <i class="fas fa-print"></i> Imprimir
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Eliminar modal anterior si existe
        const modalAnterior = document.getElementById('modal-detalle-pedido');
        if (modalAnterior) {
            modalAnterior.remove();
        }
        
        // Añadir nuevo modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.style.overflow = 'hidden';
        
        // Agregar listeners para cerrar
        const modal = document.getElementById('modal-detalle-pedido');
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                setTimeout(() => modal.remove(), 300);
            });
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }
    
    // Función para actualizar el estado en la UI
    function actualizarEstadoEnUI(pedidoId, nuevoEstado) {
        const pedidoCard = document.querySelector(`[data-pedido-id="${pedidoId}"]`);
        if (pedidoCard) {
            const estadoElement = pedidoCard.querySelector('.pedido-estado');
            if (estadoElement) {
                estadoElement.className = `pedido-estado estado-${nuevoEstado}`;
                estadoElement.textContent = nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1);
            }
            
            // Actualizar botones disponibles
            const footer = pedidoCard.querySelector('.pedido-footer');
            if (footer) {
                actualizarBotonesPedido(footer, nuevoEstado, pedidoId);
            }
        }
    }
    
    // Función para actualizar botones según el estado
    function actualizarBotonesPedido(footer, estado, pedidoId) {
        // Remover botones de acción específicos
        const botonesAccion = footer.querySelectorAll('.btn-procesar, .btn-completar, .btn-cancelar');
        botonesAccion.forEach(btn => btn.remove());
        
        // Agregar botones según el nuevo estado
        const btnVerDetalle = footer.querySelector('.btn-ver-detalle');
        
        if (estado === 'pendiente') {
            // Los botones específicos se agregarán según si es recibido o enviado
            if (window.location.pathname.includes('recibidos')) {
                btnVerDetalle.insertAdjacentHTML('afterend', `
                    <button class="btn-pedido btn-procesar" onclick="cambiarEstadoPedido(${pedidoId}, 'procesando')">
                        <i class="fas fa-cog"></i> Procesar
                    </button>
                `);
            } else if (window.location.pathname.includes('enviados')) {
                btnVerDetalle.insertAdjacentHTML('afterend', `
                    <button class="btn-pedido btn-cancelar" onclick="cambiarEstadoPedido(${pedidoId}, 'cancelado')">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                `);
            }
        } else if (estado === 'procesando' && window.location.pathname.includes('recibidos')) {
            btnVerDetalle.insertAdjacentHTML('afterend', `
                <button class="btn-pedido btn-completar" onclick="cambiarEstadoPedido(${pedidoId}, 'completado')">
                    <i class="fas fa-check"></i> Completar
                </button>
            `);
        }
    }
    
    // Función para filtrar pedidos
    function filtrarPedidos() {
        const searchTerm = document.querySelector('.search-input')?.value.toLowerCase() || '';
        const estadoFilter = document.getElementById('filter-estado')?.value || '';
        const fechaFilter = document.getElementById('filter-fecha')?.value || '';
        
        const pedidoCards = document.querySelectorAll('.pedido-card');
        let visibleCount = 0;
        
        pedidoCards.forEach(card => {
            const numeroPedido = card.querySelector('.pedido-numero')?.textContent.toLowerCase() || '';
            const empresa = card.querySelector('.pedido-proveedor, .pedido-cliente')?.textContent.toLowerCase() || '';
            const estado = card.querySelector('.pedido-estado')?.textContent.toLowerCase() || '';
            
            let shouldShow = true;
            
            // Filtro de búsqueda
            if (searchTerm && !numeroPedido.includes(searchTerm) && !empresa.includes(searchTerm)) {
                shouldShow = false;
            }
            
            // Filtro de estado
            if (estadoFilter && !estado.includes(estadoFilter)) {
                shouldShow = false;
            }
            
            // Filtro de fecha (implementación básica)
            if (fechaFilter) {
                const today = new Date();
                // Aquí podrías implementar lógica más específica para fechas
                // Por ahora se mantiene como ejemplo
            }
            
            if (shouldShow) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        if (visibleCount === 0 && pedidoCards.length > 0) {
            mostrarMensajeVacio('No se encontraron pedidos con los filtros seleccionados');
        } else {
            ocultarMensajeVacio();
        }
    }
    
    // Función para mostrar mensaje vacío
    function mostrarMensajeVacio(mensaje) {
        let emptyState = document.querySelector('.empty-state-filter');
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state empty-state-filter';
            emptyState.innerHTML = `
                <i class="fas fa-search"></i>
                <p>${mensaje}</p>
                <button class="btn btn-secondary" onclick="limpiarFiltros()">Limpiar filtros</button>
            `;
            document.querySelector('.pedidos-lista').appendChild(emptyState);
        } else {
            emptyState.querySelector('p').textContent = mensaje;
        }
    }
    
    // Función para ocultar mensaje vacío
    function ocultarMensajeVacio() {
        const emptyState = document.querySelector('.empty-state-filter');
        if (emptyState) {
            emptyState.remove();
        }
    }
    
    // Función para limpiar filtros
    window.limpiarFiltros = function() {
        const searchInput = document.querySelector('.search-input');
        const estadoFilter = document.getElementById('filter-estado');
        const fechaFilter = document.getElementById('filter-fecha');
        
        if (searchInput) searchInput.value = '';
        if (estadoFilter) estadoFilter.value = '';
        if (fechaFilter) fechaFilter.value = '';
        
        filtrarPedidos();
        
        showAlert({
            type: 'info',
            title: 'Filtros limpiados',
            message: 'Se han restablecido todos los filtros',
            duration: 2000
        });
    };
    
    // Función para crear modal de pedido (para compatibilidad)
    function crearModalPedido() {
        const modalHtml = `
            <div id="modal-pedido" class="modal">
                <div class="modal-content modal-pedido-content">
                    <div class="modal-header">
                        <h2>Realizar Pedido a <span id="pedido-proveedor-nombre"></span></h2>
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <p>Modal de pedido en construcción...</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-close">Cancelar</button>
                        <button class="btn btn-primary">Confirmar Pedido</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Configurar event listeners básicos
        const modal = document.getElementById('modal-pedido');
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Función para cargar productos del proveedor (placeholder)
    function cargarProductosProveedor(proveedorId) {
        showAlert({
            type: 'info',
            title: 'Función en desarrollo',
            message: 'La carga de productos estará disponible próximamente',
            duration: 3000
        });
    }
    
    // Función auxiliar para confirmar acciones
    function confirmarAccionConAlerta(config) {
        return new Promise((resolve) => {
            const confirmed = confirm(config.message || '¿Estás seguro de que deseas continuar?');
            resolve(confirmed);
        });
    }
    
    // ===== EVENT LISTENERS =====
    
    // Filtros en tiempo real
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filtrarPedidos);
    }
    
    const estadoFilter = document.getElementById('filter-estado');
    if (estadoFilter) {
        estadoFilter.addEventListener('change', filtrarPedidos);
    }
    
    const fechaFilter = document.getElementById('filter-fecha');
    if (fechaFilter) {
        fechaFilter.addEventListener('change', filtrarPedidos);
    }
    
    // Verificar conexión
    if (!navigator.onLine) {
        showAlert({
            type: 'warning',
            title: 'Sin conexión',
            message: 'Algunas funciones pueden no estar disponibles sin conexión a internet',
            persistent: true
        });
    }
    
    window.addEventListener('online', () => {
        showAlert({
            type: 'success',
            title: 'Conexión restaurada',
            message: 'La conexión a internet se ha restablecido'
        });
    });
    
    window.addEventListener('offline', () => {
        showAlert({
            type: 'warning',
            title: 'Sin conexión',
            message: 'Se ha perdido la conexión a internet',
            persistent: true
        });
    });
    
    // Agregar estilos CSS necesarios si no existen
    if (!document.querySelector('#pedidos-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'pedidos-modal-styles';
        styles.textContent = `
            .empty-state {
                text-align: center;
                padding: 40px 20px;
                color: #94a3b8;
            }
            .empty-state i {
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            }
            .empty-state-filter {
                background: #f8fafc;
                border-radius: 8px;
                margin: 20px 0;
            }
            .productos-tabla {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }
            .tabla-header {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
                gap: 10px;
                padding: 10px;
                background: #f1f5f9;
                font-weight: 600;
                border-radius: 6px 6px 0 0;
            }
            .tabla-row {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
                gap: 10px;
                padding: 10px;
                border-bottom: 1px solid #e2e8f0;
            }
            .tabla-row:last-child {
                border-bottom: none;
            }
            .producto-nombre {
                font-weight: 500;
            }
            .pedido-totales {
                margin-top: 20px;
                padding: 15px;
                background: #f8fafc;
                border-radius: 6px;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;
            }
            .total-final {
                font-weight: 600;
                font-size: 1.1em;
                border-top: 1px solid #cbd5e1;
                padding-top: 10px;
                margin-top: 10px;
            }
            .pedido-info-header {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 20px;
                margin-bottom: 20px;
            }
            .estado-section {
                display: flex;
                align-items: flex-start;
            }
            @media (max-width: 768px) {
                .tabla-header, .tabla-row {
                    grid-template-columns: 1fr;
                    gap: 5px;
                }
                .pedido-info-header {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(styles);
    }
});