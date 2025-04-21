addEventListener('DOMContentLoaded', () => {

    const nuevoProductoCard = document.querySelector('.add-producto-card');

    nuevoProductoCard.addEventListener('click', () => {
        window.location.href = './creacionProducto.php';
    });
    
    const eliminarProducto = document.querySelectorAll('.btn-delete');

    eliminarProducto.forEach(eliminar => {
        eliminar.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                const idProducto = eliminar.dataset.productoId;
                
                fetch('../../php/actions/eliminarProducto.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `idProducto=${encodeURIComponent(idProducto)}`,
                })
                .then(response => response.text())
                .then(window.location.reload())
                .catch(error => {
                    console.error('Error al eliminar el producto:', error);
                })
            }
        });
    });

    const editarProducto = document.querySelectorAll('.btn-edit');

    editarProducto.forEach(editar => {
        editar.addEventListener('click', () => {
            const idProducto = editar.dataset.productoId;
            console.log('Editando producto con id: ' + editar.dataset.productoId);
            window.location.href = `../../php/view/edicionProducto.php?id=${idProducto}`;
        });
    });

});