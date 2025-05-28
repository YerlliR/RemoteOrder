document.addEventListener('DOMContentLoaded', function() {
    const btnGestionCategorias = document.querySelector('.btn-categorias');
    const modal = document.getElementById('modal-categoria');
    const vistaCategorias = document.getElementById('vista-categorias');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnNuevaCategoria = document.getElementById('btn-nueva-categoria');
    const btnVolver = document.getElementById('btn-volver');
    const btnsCerrar = modal.querySelectorAll('.modal-close');
    const btnCancelar = modal.querySelector('.modal-cancel');
    const colorOptions = modal.querySelectorAll('.color-option');
    const categoriaCards = modal.querySelectorAll('.categoria-card');
    const categoriaForm = document.querySelector('#vista-formulario form');
    const colorInput = document.getElementById('categoria-color');
    
    // Abrir modal
    if (btnGestionCategorias) {
        btnGestionCategorias.addEventListener('click', function() {
            vistaCategorias.style.display = 'block';
            vistaFormulario.style.display = 'none';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Cambiar a vista de formulario
    if (btnNuevaCategoria) {
        btnNuevaCategoria.addEventListener('click', function() {
            vistaCategorias.style.display = 'none';
            vistaFormulario.style.display = 'block';
            
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
            e.preventDefault();
            vistaFormulario.style.display = 'none';
            vistaCategorias.style.display = 'block';
            limpiarFormulario();
        });
    }
    
    // Cerrar modal
    btnsCerrar.forEach(btn => {
        btn.addEventListener('click', cerrarModal);
    });
    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cerrarModal);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    function cerrarModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            vistaFormulario.style.display = 'none';
            vistaCategorias.style.display = 'block';
            limpiarFormulario();
        }, 300);
    }
    
    function limpiarFormulario() {
        document.getElementById('categoria-nombre').value = '';
        document.getElementById('categoria-descripcion').value = '';
        
        colorOptions.forEach((option, index) => {
            if (index === 0) {
                option.classList.add('selected', 'active');
                if (colorInput) {
                    colorInput.value = option.getAttribute('data-color');
                }
            } else {
                option.classList.remove('selected', 'active');
            }
        });
    }
    
    // Selección de color
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(op => {
                op.classList.remove('selected', 'active');
            });
            
            this.classList.add('selected', 'active');
            
            if (colorInput) {
                colorInput.value = this.getAttribute('data-color');
            }
        });
    });
    
    // Establecer color por defecto
    if (colorOptions.length > 0) {
        const selectedColor = document.querySelector('.color-option.selected, .color-option.active');
        if (!selectedColor) {
            colorOptions[0].classList.add('selected', 'active');
            if (colorInput) {
                colorInput.value = colorOptions[0].getAttribute('data-color');
            }
        } else if (colorInput && !colorInput.value) {
            colorInput.value = selectedColor.getAttribute('data-color');
        }
    }
    
    // Eliminar categoría
    categoriaCards.forEach(card => {
        card.addEventListener('click', async function() {
            const categoriaId = this.getAttribute('data-id');
            const categoriaNombre = this.querySelector('.categoria-name').innerText;
            
            if (confirm(`¿Estás seguro de eliminar la categoría "${categoriaNombre}"?`)) {
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
                    
                    if (data.success) {
                        setTimeout(() => {
                            this.remove();
                            const categoriasRestantes = document.querySelectorAll('.categoria-card').length;
                            if (categoriasRestantes === 0) {
                                const categoriaGrid = document.querySelector('.categorias-grid');
                                categoriaGrid.innerHTML = '<p class="empty-state">No hay categorías creadas aún</p>';
                            }
                        }, 300);
                    } else {
                        this.style.opacity = '1';
                        this.style.transform = 'scale(1)';
                        alert('Error: ' + data.mensaje);
                    }
                    
                } catch (error) {
                    console.error('Error:', error);
                    this.style.opacity = '1';
                    this.style.transform = 'scale(1)';
                    alert('Error de conexión. Inténtalo de nuevo.');
                }
            }
        });
    });
    
    // Envío del formulario
    if (categoriaForm) {
        categoriaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('categoria-nombre').value.trim();
            const descripcion = document.getElementById('categoria-descripcion').value.trim();
            const colorSeleccionado = document.querySelector('.color-option.selected, .color-option.active');
            
            if (!nombre) {
                alert('Por favor, introduce un nombre para la categoría');
                return false;
            }
            
            if (nombre.length < 2) {
                alert('El nombre de la categoría debe tener al menos 2 caracteres');
                return false;
            }
            
            if (nombre.length > 50) {
                alert('El nombre de la categoría no puede exceder 50 caracteres');
                return false;
            }
            
            if (!colorSeleccionado && !colorInput.value) {
                alert('Por favor, selecciona un color para la categoría');
                return false;
            }
            
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('color', colorInput.value);
            
            fetch('../../php/actions/crearCategoria.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    cerrarModal();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('No se pudo crear la categoría. Inténtalo de nuevo.');
            });
            
            return false;
        });
    }
});