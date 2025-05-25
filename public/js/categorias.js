// Funcionalidad para el modal de categorías con sistema de alertas
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const btnGestionCategorias = document.querySelector('.btn-categorias');
    const modal = document.getElementById('modal-categoria');
    const vistaCategorias = document.getElementById('vista-categorias');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnNuevaCategoria = document.getElementById('btn-nueva-categoria');
    const btnVolver = document.getElementById('btn-volver');
    const btnsCerrar = modal.querySelectorAll('.modal-close');
    const btnCancelar = modal.querySelector('.modal-cancel');
    const btnGuardar = document.getElementById('guardar-categoria');
    const colorOptions = modal.querySelectorAll('.color-option');
    const categoriaCards = modal.querySelectorAll('.categoria-card');
    const categoriaForm = document.querySelector('#vista-formulario form');
    const colorInput = document.getElementById('categoria-color');
    
    // Abrir modal de gestión de categorías
    if (btnGestionCategorias) {
        btnGestionCategorias.addEventListener('click', function() {
            // Mostrar vista de categorías por defecto
            vistaCategorias.style.display = 'block';
            vistaFormulario.style.display = 'none';
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            showAlert({
                type: 'info',
                title: 'Gestión de categorías',
                message: 'Aquí puedes crear, ver y eliminar categorías para tus productos',
                duration: 3000
            });
        });
    }
    
    // Cambiar a vista de formulario
    if (btnNuevaCategoria) {
        btnNuevaCategoria.addEventListener('click', function() {
            vistaCategorias.style.display = 'none';
            vistaFormulario.style.display = 'block';
            
            // Asegurar que hay un color seleccionado por defecto
            if (!document.querySelector('.color-option.selected, .color-option.active')) {
                colorOptions[0].classList.add('selected');
                if (colorInput) {
                    colorInput.value = colorOptions[0].getAttribute('data-color');
                }
            }
            
            showAlert({
                type: 'info',
                title: 'Nueva categoría',
                message: 'Completa los datos para crear una nueva categoría',
                duration: 2000
            });
        });
    }
    
    // Volver a la vista de categorías
    if (btnVolver) {
        btnVolver.addEventListener('click', function(e) {
            e.preventDefault();
            vistaFormulario.style.display = 'none';
            vistaCategorias.style.display = 'block';
            
            // Limpiar campos del formulario
            limpiarFormulario();
        });
    }
    
    // Cerrar modal (botones X)
    btnsCerrar.forEach(btn => {
        btn.addEventListener('click', function() {
            cerrarModal();
        });
    });
    
    // Cerrar modal (botón Cerrar)
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            cerrarModal();
        });
    }
    
    // Cerrar modal si se hace clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    // Función para cerrar el modal
    function cerrarModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Volver a la vista de categorías para la próxima vez
        setTimeout(() => {
            vistaFormulario.style.display = 'none';
            vistaCategorias.style.display = 'block';
            limpiarFormulario();
        }, 300);
    }
    
    // Función para limpiar el formulario
    function limpiarFormulario() {
        document.getElementById('categoria-nombre').value = '';
        document.getElementById('categoria-descripcion').value = '';
        
        // Reiniciar selección de color al primero
        colorOptions.forEach((option, index) => {
            if (index === 0) {
                option.classList.add('selected');
                option.classList.add('active');
                if (colorInput) {
                    colorInput.value = option.getAttribute('data-color');
                }
            } else {
                option.classList.remove('selected');
                option.classList.remove('active');
            }
        });
    }
    
    // Selección de color
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Quitar la clase 'selected' de todas las opciones
            colorOptions.forEach(op => {
                op.classList.remove('selected');
                op.classList.remove('active');
            });
            
            // Añadir las clases 'selected' y 'active' a la opción clicada
            this.classList.add('selected');
            this.classList.add('active');
            
            // Asignar el color al input oculto para el envío del formulario
            if (colorInput) {
                colorInput.value = this.getAttribute('data-color');
            }
            
            showAlert({
                type: 'info',
                title: 'Color seleccionado',
                message: 'Color actualizado para la nueva categoría',
                duration: 1500
            });
        });
    });
    
    // Establecer color por defecto si no hay ninguno seleccionado
    if (colorOptions.length > 0) {
        const selectedColor = document.querySelector('.color-option.selected, .color-option.active');
        if (!selectedColor) {
            colorOptions[0].classList.add('selected');
            colorOptions[0].classList.add('active');
            if (colorInput) {
                colorInput.value = colorOptions[0].getAttribute('data-color');
            }
        } else if (colorInput && !colorInput.value) {
            colorInput.value = selectedColor.getAttribute('data-color');
        }
    }
    
    // Eliminar categoría con confirmación y alertas
    categoriaCards.forEach(card => {
        card.addEventListener('click', async function() {
            const categoriaId = this.getAttribute('data-id');
            const categoriaNombre = this.querySelector('.categoria-name').innerText;
            
            // Confirmación con alertas
            const confirmed = await confirmarAccionConAlerta({
                type: 'warning',
                title: 'Confirmar eliminación',
                message: `¿Estás seguro de eliminar la categoría "${categoriaNombre}"? Los productos asociados quedarán sin categoría.`
            });
            
            if (confirmed) {
                // Mostrar alerta de carga
                const loadingId = showAlert({
                    type: 'loading',
                    title: 'Eliminando categoría...',
                    message: `Eliminando "${categoriaNombre}"`,
                    persistent: true
                });
                
                // Animación de eliminación
                this.style.opacity = '0';
                this.style.transform = 'scale(0.8)';

                try {
                    const response = await fetch('../../php/actions/eliminarCategoria.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `idCategoria=${encodeURIComponent(categoriaId)}`,
                    });
                    
                    const data = await response.json();
                    hideAlert(loadingId);
                    
                    // Manejar respuesta
                    handleAjaxResponse(data, () => {
                        // Éxito: eliminar elemento del DOM
                        setTimeout(() => {
                            this.remove();
                            
                            // Verificar si quedan categorías
                            const categoriasRestantes = document.querySelectorAll('.categoria-card').length;
                            if (categoriasRestantes === 0) {
                                const categoriaGrid = document.querySelector('.categorias-grid');
                                categoriaGrid.innerHTML = '<p class="empty-state">No hay categorías creadas aún</p>';
                            }
                        }, 300);
                    });
                    
                } catch (error) {
                    hideAlert(loadingId);
                    console.error('Error al eliminar la categoría:', error);
                    
                    // Restaurar la apariencia del elemento
                    this.style.opacity = '1';
                    this.style.transform = 'scale(1)';
                    
                    showAlert({
                        type: 'error',
                        title: 'Error de conexión',
                        message: 'No se pudo conectar con el servidor. Inténtalo de nuevo.'
                    });
                }
            }
        });
    });
    
    // Manejar el envío del formulario con validación y alertas
    if (categoriaForm) {
        categoriaForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir envío normal para usar alertas
            
            const nombre = document.getElementById('categoria-nombre').value.trim();
            const descripcion = document.getElementById('categoria-descripcion').value.trim();
            const colorSeleccionado = document.querySelector('.color-option.selected, .color-option.active');
            
            // Validación del formulario con alertas
            if (!nombre) {
                showAlert({
                    type: 'warning',
                    title: 'Campo obligatorio',
                    message: 'Por favor, introduce un nombre para la categoría'
                });
                return false;
            }
            
            if (nombre.length < 2) {
                showAlert({
                    type: 'warning',
                    title: 'Nombre muy corto',
                    message: 'El nombre de la categoría debe tener al menos 2 caracteres'
                });
                return false;
            }
            
            if (nombre.length > 50) {
                showAlert({
                    type: 'warning',
                    title: 'Nombre muy largo',
                    message: 'El nombre de la categoría no puede exceder 50 caracteres'
                });
                return false;
            }
            
            if (!colorSeleccionado && !colorInput.value) {
                showAlert({
                    type: 'warning',
                    title: 'Color requerido',
                    message: 'Por favor, selecciona un color para la categoría'
                });
                return false;
            }
            
            // Mostrar alerta de envío
            const sendingId = showAlert({
                type: 'loading',
                title: 'Creando categoría...',
                message: `Guardando "${nombre}"`,
                persistent: true
            });
            
            // Crear FormData para el envío
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('color', colorInput.value);
            
            // Enviar formulario con fetch
            fetch('../../php/actions/crearCategoria.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                hideAlert(sendingId);
                
                if (response.ok) {
                    showAlert({
                        type: 'success',
                        title: 'Categoría creada',
                        message: `"${nombre}" se ha guardado correctamente`
                    });
                    
                    // Cerrar modal y recargar página
                    cerrarModal();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            })
            .catch(error => {
                hideAlert(sendingId);
                console.error('Error:', error);
                showAlert({
                    type: 'error',
                    title: 'Error al guardar',
                    message: 'No se pudo crear la categoría. Inténtalo de nuevo.'
                });
            });
            
            return false;
        });
    }
});

// Función auxiliar para confirmar acciones
async function confirmarAccionConAlerta(config) {
    return new Promise((resolve) => {
        const confirmed = confirm(config.message || '¿Estás seguro de que deseas continuar?');
        resolve(confirmed);
    });
}