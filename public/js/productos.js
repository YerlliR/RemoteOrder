document.addEventListener('DOMContentLoaded', function() {
    const initProductos = () => {
        if (typeof showAlert !== 'function') {
            setTimeout(initProductos, 100);
            return;
        }
        
        // Nuevo producto
        const nuevoProductoCard = document.querySelector('.add-producto-card');
        if (nuevoProductoCard) {
            nuevoProductoCard.addEventListener('click', () => {
                window.location.href = './creacionProducto.php';
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
                    try {
                        const response = await fetch('../../php/actions/eliminarProducto.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `idProducto=${encodeURIComponent(idProducto)}`,
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            productoCard.style.transition = 'all 0.5s ease';
                            productoCard.style.transform = 'scale(0.8)';
                            productoCard.style.opacity = '0';
                            
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        } else {
                            alert('Error: ' + (data.mensaje || 'No se pudo eliminar el producto'));
                        }
                        
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Error de conexión');
                    }
                }
            });
        });
        
        // Editar producto
        const editarProducto = document.querySelectorAll('.btn-edit');
        editarProducto.forEach(editar => {
            editar.addEventListener('click', () => {
                const idProducto = editar.dataset.productoId;
                window.location.href = `../../php/view/edicionProducto.php?id=${idProducto}`;
            });
        });
    };
    
    initProductos();
});
