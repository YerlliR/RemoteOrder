addEventListener('DOMContentLoaded', () => {

    const nuevoProductoCard = document.querySelector('.add-producto-card');

    nuevoProductoCard.addEventListener('click', () => {
        window.location.href = './creacionProducto.php';
    });

});