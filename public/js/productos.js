document.addEventListener('DOMContentLoaded', () => {
    
    // Botón para crear nuevo producto
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
            }, 500);
        });
    }
    
    // Eliminar producto con confirmación y alertas
    const eliminarProducto = document.querySelectorAll('.btn-delete');
    
    eliminarProducto.forEach(eliminar => {
        eliminar.addEventListener('click', async () => {
            const idProducto = eliminar.dataset.productoId;
            const productoCard = eliminar.closest('.producto-card');
            const nombreProducto = productoCard?.querySelector('.producto-title')?.textContent || 'este producto';
            
            // Confirmación con alerta personalizada
            const confirmed = await confirmarAccionConAlerta({
                type: 'warning',
                title: 'Confirmar eliminación',
                message: `¿Estás seguro de que deseas eliminar "${nombreProducto}"? Esta acción no se puede deshacer y el producto ya no estará disponible en tu catálogo.`
            });
            
            if (confirmed) {
                // Mostrar alerta de carga
                const loadingId = showAlert({
                    type: 'loading',
                    title: 'Eliminando producto...',
                    message: `Eliminando "${nombreProducto}" de tu catálogo`,
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
                    
                    // Manejar respuesta con el sistema de alertas
                    handleAjaxResponse(data, () => {
                        // Éxito: animar eliminación del elemento
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
                        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
                    });
                }
            }
        });
    });

    // Editar producto con feedback
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
            }, 500);
        });
    });
    
    // Búsqueda en tiempo real con feedback
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                if (searchTerm.length > 0) {
                    let visibleProducts = 0;
                    
                    document.querySelectorAll('.producto-card:not(.add-producto-card)').forEach(card => {
                        const title = card.querySelector('.producto-title')?.textContent.toLowerCase() || '';
                        const category = card.querySelector('.producto-category')?.textContent.toLowerCase() || '';
                        
                        if (title.includes(searchTerm) || category.includes(searchTerm)) {
                            card.style.display = '';
                            visibleProducts++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    if (visibleProducts === 0) {
                        showAlert({
                            type: 'info',
                            title: 'Sin resultados',
                            message: `No se encontraron productos que coincidan con "${searchTerm}"`,
                            duration: 3000
                        });
                    } else {
                        showAlert({
                            type: 'success',
                            title: 'Búsqueda completada',
                            message: `Se encontraron ${visibleProducts} producto(s)`,
                            duration: 2000
                        });
                    }
                } else {
                    // Mostrar todos los productos
                    document.querySelectorAll('.producto-card').forEach(card => {
                        card.style.display = '';
                    });
                }
            }, 300);
        });
    }
    
    // Verificar estado de conexión
    if (!navigator.onLine) {
        showAlert({
            type: 'warning',
            title: 'Sin conexión a internet',
            message: 'Algunas funciones pueden no estar disponibles',
            persistent: true
        });
    }
    
    // Escuchar cambios en la conexión
    window.addEventListener('online', () => {
        showAlert({
            type: 'success',
            title: 'Conexión restaurada',
            message: 'La conexión a internet se ha restablecido correctamente'
        });
    });
    
    window.addEventListener('offline', () => {
        showAlert({
            type: 'warning',
            title: 'Conexión perdida',
            message: 'Se ha perdido la conexión a internet. Algunas funciones no estarán disponibles.',
            persistent: true
        });
    });
});

// Función auxiliar para confirmar acciones
async function confirmarAccionConAlerta(config) {
    return new Promise((resolve) => {
        const confirmed = confirm(config.message || '¿Estás seguro de que deseas continuar?');
        resolve(confirmed);
    });
}