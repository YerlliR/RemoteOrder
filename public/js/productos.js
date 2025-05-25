

document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que el sistema de alertas esté disponible
    const initProductos = () => {
        if (typeof showAlert !== 'function') {
            setTimeout(initProductos, 100);
            return;
        }
        
        // Nuevo producto
        const nuevoProductoCard = document.querySelector('.add-producto-card');
        if (nuevoProductoCard) {
            nuevoProductoCard.addEventListener('click', () => {
                showAlert({
                    type: 'info',
                    title: 'Redirigiendo...',
                    message: 'Serás redirigido al formulario de creación de productos',
                    duration: 2000
                });
                
                setTimeout(() => {
                    window.location.href = './creacionProducto.php';
                }, 1000);
            });
        }
        
        // Eliminar producto
        const eliminarProducto = document.querySelectorAll('.btn-delete');
        eliminarProducto.forEach(eliminar => {
            eliminar.addEventListener('click', async () => {
                const idProducto = eliminar.dataset.productoId;
                const productoCard = eliminar.closest('.producto-card');
                const nombreProducto = productoCard?.querySelector('.producto-title')?.textContent || 'este producto';
                
                if (confirm(`¿Estás seguro de que deseas eliminar "${nombreProducto}"?`)) {
                    const loadingId = showAlert({
                        type: 'loading',
                        title: 'Eliminando producto...',
                        message: `Eliminando "${nombreProducto}"`,
                        persistent: true
                    });
                    
                    try {
                        const response = await fetch('../../php/actions/eliminarProducto.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `idProducto=${encodeURIComponent(idProducto)}`,
                        });
                        
                        const data = await response.json();
                        hideAlert(loadingId);
                        
                        handleAjaxResponse(data, () => {
                            // Animar eliminación
                            productoCard.style.transition = 'all 0.5s ease';
                            productoCard.style.transform = 'scale(0.8)';
                            productoCard.style.opacity = '0';
                            
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        });
                        
                    } catch (error) {
                        hideAlert(loadingId);
                        console.error('Error:', error);
                        showAlert({
                            type: 'error',
                            title: 'Error de conexión',
                            message: 'No se pudo conectar con el servidor'
                        });
                    }
                }
            });
        });
        
        // Editar producto
        const editarProducto = document.querySelectorAll('.btn-edit');
        editarProducto.forEach(editar => {
            editar.addEventListener('click', () => {
                const idProducto = editar.dataset.productoId;
                const productoCard = editar.closest('.producto-card');
                const nombreProducto = productoCard?.querySelector('.producto-title')?.textContent || 'el producto';
                
                showAlert({
                    type: 'info',
                    title: 'Editando producto',
                    message: `Serás redirigido para editar "${nombreProducto}"`,
                    duration: 2000
                });
                
                setTimeout(() => {
                    window.location.href = `../../php/view/edicionProducto.php?id=${idProducto}`;
                }, 1000);
            });
        });
    };
    
    // Inicializar
    initProductos();
});
