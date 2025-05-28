document.addEventListener('DOMContentLoaded', function() {
    window.verDetallePedido = function(pedidoId) {
        fetch(`../../php/actions/obtenerDetallePedido.php?id=${pedidoId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarDetallePedido(data.pedido);
                } else {
                    alert('Error: ' + (data.mensaje || 'No se pudo cargar el detalle'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión');
            });
    };
    
    window.cambiarEstadoPedido = function(pedidoId, nuevoEstado) {
        const estadosTexto = {
            'procesando': 'procesar',
            'completado': 'completar',
            'cancelado': 'cancelar'
        };
        
        const accion = estadosTexto[nuevoEstado] || 'actualizar';
        
        if (confirm(`¿Estás seguro de que deseas ${accion} este pedido?`)) {
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
                    alert(data.message || 'Estado actualizado correctamente');
                    actualizarEstadoEnUI(pedidoId, nuevoEstado);
                } else {
                    alert('Error: ' + (data.message || 'No se pudo actualizar el estado'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión');
            });
        }
    };
    
    
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
        
        const modalAnterior = document.getElementById('modal-detalle-pedido');
        if (modalAnterior) {
            modalAnterior.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.style.overflow = 'hidden';
        
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
    
    function actualizarEstadoEnUI(pedidoId, nuevoEstado) {
        const pedidoCard = document.querySelector(`[data-pedido-id="${pedidoId}"]`);
        if (pedidoCard) {
            const estadoElement = pedidoCard.querySelector('.pedido-estado');
            if (estadoElement) {
                estadoElement.className = `pedido-estado estado-${nuevoEstado}`;
                estadoElement.textContent = nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1);
            }
            
            const footer = pedidoCard.querySelector('.pedido-footer');
            if (footer) {
                actualizarBotonesPedido(footer, nuevoEstado, pedidoId);
            }
        }
    }
    
    function actualizarBotonesPedido(footer, estado, pedidoId) {
        const botonesAccion = footer.querySelectorAll('.btn-procesar, .btn-completar, .btn-cancelar');
        botonesAccion.forEach(btn => btn.remove());
        
        const btnVerDetalle = footer.querySelector('.btn-ver-detalle');
        
        if (estado === 'pendiente') {
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
    
    // Filtros
    const searchInput = document.querySelector('.search-input');
    const estadoFilter = document.getElementById('filter-estado');
    const fechaFilter = document.getElementById('filter-fecha');
    
    function filtrarPedidos() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const estadoFilter = document.getElementById('filter-estado')?.value || '';
        
        const pedidoCards = document.querySelectorAll('.pedido-card');
        
        pedidoCards.forEach(card => {
            const numeroPedido = card.querySelector('.pedido-numero')?.textContent.toLowerCase() || '';
            const empresa = card.querySelector('.pedido-proveedor, .pedido-cliente')?.textContent.toLowerCase() || '';
            const estado = card.querySelector('.pedido-estado')?.textContent.toLowerCase() || '';
            
            let shouldShow = true;
            
            if (searchTerm && !numeroPedido.includes(searchTerm) && !empresa.includes(searchTerm)) {
                shouldShow = false;
            }
            
            if (estadoFilter && !estado.includes(estadoFilter)) {
                shouldShow = false;
            }
            
            card.style.display = shouldShow ? '' : 'none';
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filtrarPedidos);
    }
    
    if (estadoFilter) {
        estadoFilter.addEventListener('change', filtrarPedidos);
    }
    
    if (fechaFilter) {
        fechaFilter.addEventListener('change', filtrarPedidos);
    }
});