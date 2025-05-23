document.addEventListener('DOMContentLoaded', function() {
    // Variable global para el ID del proveedor actual
    let currentProveedorId = null;
    let currentProveedorNombre = '';
    
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
    
    // Función para crear el modal de pedido
    function crearModalPedido() {
        const modalHtml = `
            <div id="modal-pedido" class="modal">
                <div class="modal-content modal-pedido-content">
                    <div class="modal-header">
                        <h2>Realizar Pedido a <span id="pedido-proveedor-nombre"></span></h2>
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="pedido-info">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="fecha-entrega">Fecha de entrega deseada</label>
                                    <input type="date" id="fecha-entrega" class="form-control" 
                                           min="${new Date().toISOString().split('T')[0]}">
                                </div>
                                <div class="form-group">
                                    <label for="direccion-entrega">Dirección de entrega</label>
                                    <input type="text" id="direccion-entrega" class="form-control" 
                                           placeholder="Dirección completa de entrega">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="notas-pedido">Notas del pedido (opcional)</label>
                                <textarea id="notas-pedido" class="form-control textarea-control" 
                                          placeholder="Instrucciones especiales, observaciones..."></textarea>
                            </div>
                        </div>
                        
                        <div class="productos-section">
                            <h3>Seleccionar Productos</h3>
                            <div class="productos-filtro">
                                <input type="text" id="buscar-producto" class="form-control" 
                                       placeholder="Buscar producto...">
                            </div>
                            <div id="productos-container" class="productos-pedido-container">
                                <div class="loading-spinner">Cargando productos...</div>
                            </div>
                        </div>
                        
                        <div class="pedido-resumen">
                            <h3>Resumen del Pedido</h3>
                            <div class="resumen-items" id="resumen-items">
                                <p class="empty-resumen">No hay productos seleccionados</p>
                            </div>
                            <div class="resumen-totales">
                                <div class="total-row">
                                    <span>Subtotal:</span>
                                    <span id="pedido-subtotal">0.00 €</span>
                                </div>
                                <div class="total-row">
                                    <span>IVA:</span>
                                    <span id="pedido-iva">0.00 €</span>
                                </div>
                                <div class="total-row total-final">
                                    <span>Total:</span>
                                    <span id="pedido-total">0.00 €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-close">Cancelar</button>
                        <button class="btn btn-primary" id="btn-confirmar-pedido">
                            <i class="fas fa-shopping-cart"></i> Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Agregar event listeners
        configurarEventListeners();
    }
    
    // Función para configurar los event listeners del modal
    function configurarEventListeners() {
        const modal = document.getElementById('modal-pedido');
        
        // Cerrar modal
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', cerrarModalPedido);
        });
        
        // Click fuera del modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalPedido();
            }
        });
        
        // Buscar productos
        const buscarInput = document.getElementById('buscar-producto');
        if (buscarInput) {
            buscarInput.addEventListener('input', function() {
                filtrarProductos(this.value);
            });
        }
        
        // Confirmar pedido
        const btnConfirmar = document.getElementById('btn-confirmar-pedido');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', confirmarPedido);
        }
    }
    
    // Función para cerrar el modal
    function cerrarModalPedido() {
        const modal = document.getElementById('modal-pedido');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Limpiar datos
            setTimeout(() => {
                document.getElementById('fecha-entrega').value = '';
                document.getElementById('direccion-entrega').value = '';
                document.getElementById('notas-pedido').value = '';
                document.getElementById('buscar-producto').value = '';
                document.getElementById('productos-container').innerHTML = '<div class="loading-spinner">Cargando productos...</div>';
                actualizarResumen();
            }, 300);
        }
    }
    
    // Función para cargar productos del proveedor
    function cargarProductosProveedor(proveedorId) {
        fetch(`../../php/actions/obtenerProductosProveedor.php?id=${proveedorId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarProductos(data.productos);
                } else {
                    mostrarError('No se pudieron cargar los productos');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al cargar los productos');
            });
    }
    
    // Función para mostrar productos
    function mostrarProductos(productosPorCategoria) {
        const container = document.getElementById('productos-container');
        
        if (Object.keys(productosPorCategoria).length === 0) {
            container.innerHTML = '<p class="empty-state">Este proveedor no tiene productos disponibles</p>';
            return;
        }
        
        let html = '';
        
        for (const [categoria, datosCategoria] of Object.entries(productosPorCategoria)) {
            html += `
                <div class="categoria-section">
                    <h4 class="categoria-titulo" style="color: ${datosCategoria.color}">
                        ${categoria}
                    </h4>
                    <div class="productos-grid">
            `;
            
            datosCategoria.productos.forEach(producto => {
                html += `
                    <div class="producto-pedido-card" data-producto-id="${producto.id}">
                        <div class="producto-imagen">
                            ${producto.ruta_imagen ? 
                                `<img src="../../${producto.ruta_imagen}" alt="${producto.nombre_producto}">` :
                                '<div class="no-imagen"><i class="fas fa-box"></i></div>'
                            }
                        </div>
                        <div class="producto-info">
                            <h5>${producto.nombre_producto}</h5>
                            <p class="producto-codigo">Código: ${producto.codigo_seguimiento}</p>
                            <div class="producto-precio">
                                <span class="precio">${parseFloat(producto.precio).toFixed(2)} €</span>
                                <span class="iva-info">IVA: ${producto.iva}%</span>
                            </div>
                        </div>
                        <div class="producto-cantidad">
                            <button class="btn-cantidad btn-menos" data-producto='${JSON.stringify(producto)}'>
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="cantidad-input" value="0" min="0" 
                                   data-producto-id="${producto.id}"
                                   data-precio="${producto.precio}"
                                   data-iva="${producto.iva}"
                                   data-nombre="${producto.nombre_producto}">
                            <button class="btn-cantidad btn-mas" data-producto='${JSON.stringify(producto)}'>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        // Agregar event listeners a los botones de cantidad
        container.querySelectorAll('.btn-menos').forEach(btn => {
            btn.addEventListener('click', function() {
                const producto = JSON.parse(this.dataset.producto);
                cambiarCantidad(producto.id, -1);
            });
        });
        
        container.querySelectorAll('.btn-mas').forEach(btn => {
            btn.addEventListener('click', function() {
                const producto = JSON.parse(this.dataset.producto);
                cambiarCantidad(producto.id, 1);
            });
        });
        
        container.querySelectorAll('.cantidad-input').forEach(input => {
            input.addEventListener('change', function() {
                const cantidad = Math.max(0, parseInt(this.value) || 0);
                this.value = cantidad;
                actualizarResumen();
            });
        });
    }
    
    // Función para cambiar cantidad
    function cambiarCantidad(productoId, cambio) {
        const input = document.querySelector(`.cantidad-input[data-producto-id="${productoId}"]`);
        if (input) {
            const nuevaCantidad = Math.max(0, parseInt(input.value || 0) + cambio);
            input.value = nuevaCantidad;
            actualizarResumen();
        }
    }
    
    // Función para actualizar el resumen del pedido
    function actualizarResumen() {
        const productos = [];
        let subtotal = 0;
        let totalIva = 0;
        
        // Recopilar productos con cantidad > 0
        document.querySelectorAll('.cantidad-input').forEach(input => {
            const cantidad = parseInt(input.value || 0);
            if (cantidad > 0) {
                const precio = parseFloat(input.dataset.precio);
                const iva = parseFloat(input.dataset.iva);
                const subtotalProducto = cantidad * precio;
                const ivaProducto = subtotalProducto * (iva / 100);
                
                productos.push({
                    id: input.dataset.productoId,
                    nombre: input.dataset.nombre,
                    cantidad: cantidad,
                    precio: precio,
                    iva: iva,
                    subtotal: subtotalProducto,
                    totalIva: ivaProducto
                });
                
                subtotal += subtotalProducto;
                totalIva += ivaProducto;
            }
        });
        
        // Mostrar resumen
        const resumenContainer = document.getElementById('resumen-items');
        if (productos.length === 0) {
            resumenContainer.innerHTML = '<p class="empty-resumen">No hay productos seleccionados</p>';
        } else {
            let html = '<div class="resumen-lista">';
            productos.forEach(prod => {
                html += `
                    <div class="resumen-item">
                        <div class="item-info">
                            <span class="item-nombre">${prod.nombre}</span>
                            <span class="item-detalle">${prod.cantidad} x ${prod.precio.toFixed(2)} €</span>
                        </div>
                        <span class="item-total">${prod.subtotal.toFixed(2)} €</span>
                    </div>
                `;
            });
            html += '</div>';
            resumenContainer.innerHTML = html;
        }
        
        // Actualizar totales
        const total = subtotal + totalIva;
        document.getElementById('pedido-subtotal').textContent = subtotal.toFixed(2) + ' €';
        document.getElementById('pedido-iva').textContent = totalIva.toFixed(2) + ' €';
        document.getElementById('pedido-total').textContent = total.toFixed(2) + ' €';
        
        // Habilitar/deshabilitar botón de confirmar
        const btnConfirmar = document.getElementById('btn-confirmar-pedido');
        btnConfirmar.disabled = productos.length === 0;
    }
    
    // Función para filtrar productos
    function filtrarProductos(busqueda) {
        const termino = busqueda.toLowerCase().trim();
        const cards = document.querySelectorAll('.producto-pedido-card');
        
        cards.forEach(card => {
            const nombre = card.querySelector('h5').textContent.toLowerCase();
            const codigo = card.querySelector('.producto-codigo').textContent.toLowerCase();
            
            if (nombre.includes(termino) || codigo.includes(termino)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Función para confirmar pedido
    function confirmarPedido() {
        // Recopilar productos seleccionados
        const productos = [];
        document.querySelectorAll('.cantidad-input').forEach(input => {
            const cantidad = parseInt(input.value || 0);
            if (cantidad > 0) {
                productos.push({
                    id: input.dataset.productoId,
                    cantidad: cantidad,
                    precio: parseFloat(input.dataset.precio),
                    iva: parseFloat(input.dataset.iva)
                });
            }
        });
        
        if (productos.length === 0) {
            mostrarNotificacion('Debe seleccionar al menos un producto', 'warning');
            return;
        }
        
        // Obtener datos del pedido
        const pedidoData = {
            idProveedor: currentProveedorId,
            fechaEntrega: document.getElementById('fecha-entrega').value,
            direccionEntrega: document.getElementById('direccion-entrega').value,
            notas: document.getElementById('notas-pedido').value,
            productos: productos
        };
        
        // Deshabilitar botón
        const btnConfirmar = document.getElementById('btn-confirmar-pedido');
        btnConfirmar.disabled = true;
        btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        
        // Enviar pedido
        fetch('../../php/actions/crearPedido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion('Pedido realizado correctamente', 'success');
                cerrarModalPedido();
                
                // Opcional: redirigir a pedidos enviados
                setTimeout(() => {
                    window.location.href = '../../php/view/pedidos-enviados.php';
                }, 2000);
            } else {
                mostrarNotificacion(data.mensaje || 'Error al crear el pedido', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión', 'error');
        })
        .finally(() => {
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = '<i class="fas fa-shopping-cart"></i> Confirmar Pedido';
        });
    }
    
    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'info') {
        // Implementación similar a la que ya existe en otros archivos
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 
                             tipo === 'error' ? 'exclamation-circle' : 
                             tipo === 'warning' ? 'exclamation-triangle' : 
                             'info-circle'}"></i>
            <span>${mensaje}</span>
        `;
        
        document.body.appendChild(notificacion);
        
        // Mostrar con animación
        setTimeout(() => notificacion.classList.add('show'), 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notificacion.classList.remove('show');
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }
    
    // Función para mostrar error en el contenedor de productos
    function mostrarError(mensaje) {
        const container = document.getElementById('productos-container');
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${mensaje}</p>
            </div>
        `;
    }
    
    // Asignar event listeners a botones de pedido existentes
    document.addEventListener('click', function(e) {
        // Para botones en la vista de proveedores
        if (e.target.closest('.btn-order')) {
            e.preventDefault();
            const btn = e.target.closest('.btn-order');
            const proveedorId = btn.getAttribute('data-id');
            
            // Obtener nombre del proveedor
            const card = btn.closest('.proveedor-row, .proveedor-card');
            const nombre = card ? card.querySelector('.proveedor-name').textContent : 'Proveedor';
            
            abrirModalPedido(proveedorId, nombre);
        }
    });
    
    // Agregar estilos CSS necesarios si no existen
    if (!document.querySelector('#pedidos-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'pedidos-modal-styles';
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
            .notificacion-warning {
                background-color: #fef3c7;
                color: #d97706;
            }
            .notificacion-info {
                background-color: #e0f2fe;
                color: #0284c7;
            }
            .loading-spinner {
                text-align: center;
                padding: 40px;
                color: #94a3b8;
            }
            .empty-state, .error-state {
                text-align: center;
                padding: 40px 20px;
                color: #94a3b8;
            }
            .empty-state i, .error-state i {
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            }
            .error-state {
                color: #dc2626;
            }
        `;
        document.head.appendChild(styles);
    }
});