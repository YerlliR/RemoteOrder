// Funcionalidad para el modal de categorías
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
            document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
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
        });
    }
    
    // Volver a la vista de categorías
    if (btnVolver) {
        btnVolver.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir envío del formulario
            vistaFormulario.style.display = 'none';
            vistaCategorias.style.display = 'block';
            
            // Limpiar campos del formulario
            document.getElementById('categoria-nombre').value = '';
            document.getElementById('categoria-descripcion').value = '';
            // Desseleccionar colores excepto el primero (por defecto)
            colorOptions.forEach((option, index) => {
                if (index === 0) {
                    option.classList.add('selected');
                    if (colorInput) {
                        colorInput.value = option.getAttribute('data-color');
                    }
                } else {
                    option.classList.remove('selected');
                }
            });
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
        document.body.style.overflow = 'auto'; // Restaurar scroll
        
        // Volver a la vista de categorías para la próxima vez
        setTimeout(() => {
            vistaFormulario.style.display = 'none';
            vistaCategorias.style.display = 'block';
            
            // Limpiar campos del formulario
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
        }, 300);
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
    
    // Eliminar categoría
    categoriaCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoriaId = this.getAttribute('data-id');
            const categoriaNombre = this.querySelector('.categoria-name').innerText;
            
            if (confirm(`¿Estás seguro de eliminar la categoría "${categoriaNombre}"?`)) {
                // Aquí iría la lógica para eliminar la categoría del servidor
                console.log('Eliminando categoría:', categoriaId);
                
                // Animación de eliminación
                this.style.opacity = '0';
                this.style.transform = 'scale(0.8)';

                fetch('../../php/actions/eliminarcategoria.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `idCategoria=${encodeURIComponent(categoriaId)}`,
                })
                .then(response => response.text())
                .then(data => {
                    console.log('Respuesta del servidor:', data);
                })
                .catch(error => {
                    console.error('Error al eliminar la categoría:', error);
                });

                setTimeout(() => {
                    this.remove();
                }, 300);
            }
        });
    });
    
    // Manejar el envío del formulario
    if (categoriaForm) {
        categoriaForm.addEventListener('submit', function(e) {
            const nombre = document.getElementById('categoria-nombre').value.trim();
            const colorSeleccionado = document.querySelector('.color-option.selected, .color-option.active');
            
            // Validación del formulario
            if (!nombre) {
                e.preventDefault();
                alert('Por favor, introduce un nombre para la categoría');
                return false;
            }
            
            if (!colorSeleccionado && !colorInput.value) {
                e.preventDefault();
                alert('Por favor, selecciona un color para la categoría');
                return false;
            }
            
            // El formulario se enviará normalmente si pasa las validaciones
            return true;
        });
    }
    
    // Mantener compatibilidad con el código anterior para guardar categoría
    // Ahora solo validará y dejará que el formulario se envíe normalmente
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function(e) {
            // No prevenimos el evento aquí para permitir que el botón de tipo "submit" funcione
            // Las validaciones se realizan en el evento 'submit' del formulario
        });
    }
});