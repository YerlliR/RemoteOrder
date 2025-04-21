document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const btnAddCliente = document.querySelector('.btn-add-cliente');
    const modal = document.getElementById('modal-cliente');
    const modalClose = modal.querySelector('.modal-close');
    const btnCancel = modal.querySelector('.modal-cancel');
    const btnGuardar = document.getElementById('guardar-cliente');
    const viewButtons = document.querySelectorAll('.btn-view');
    const editButtons = document.querySelectorAll('.btn-edit');
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const checkSelectAll = document.getElementById('select-all');
    const clienteCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    // Mostrar modal al hacer clic en "Nuevo Cliente"
    btnAddCliente.addEventListener('click', function() {
        // Resetear formulario si es necesario
        document.getElementById('form-cliente').reset();
        modal.querySelector('.modal-header h2').textContent = 'Nuevo Cliente';
        modal.classList.add('active');
    });
    
    // Cerrar modal
    modalClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    
    function closeModal() {
        modal.classList.remove('active');
    }
    
    // Guardar cliente (aquí se implementaría la lógica real)
    btnGuardar.addEventListener('click', function() {
        // Aquí iría la lógica para guardar el cliente
        // En una implementación real, se enviarían los datos al servidor
        
        // Simulación de guardado exitoso
        alert('Cliente guardado con éxito');
        closeModal();
    });
    
    // Botones de ver detalles
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const clienteId = this.closest('tr') ? 
                this.closest('tr').querySelector('input[type="checkbox"]').id.replace('select-', '') : 
                this.closest('.cliente-card').dataset.id;
            
            // Aquí se implementaría la lógica para ver detalles
            alert(`Ver detalles del cliente ID: ${clienteId}`);
        });
    });
    
    // Botones de editar
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const clienteId = this.closest('tr') ? 
                this.closest('tr').querySelector('input[type="checkbox"]').id.replace('select-', '') : 
                this.closest('.cliente-card').dataset.id;
            
            // Aquí se cargarían los datos del cliente y se abriría el modal
            modal.querySelector('.modal-header h2').textContent = 'Editar Cliente';
            modal.classList.add('active');
            
            // Simulación de carga de datos (aquí se cargarían los datos del cliente)
            document.getElementById('nombre-cliente').value = 'Nombre del Cliente ' + clienteId;
            document.getElementById('email-cliente').value = 'cliente' + clienteId + '@ejemplo.com';
        });
    });
    
    // Botones de eliminar
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const clienteId = this.closest('tr') ? 
                this.closest('tr').querySelector('input[type="checkbox"]').id.replace('select-', '') : 
                this.closest('.cliente-card').dataset.id;
            
            // Confirmar eliminación
            if (confirm(`¿Estás seguro que deseas eliminar el cliente ID: ${clienteId}?`)) {
                // Aquí iría la lógica para eliminar
                alert(`Cliente ${clienteId} eliminado con éxito`);
            }
        });
    });
    
    // Seleccionar/deseleccionar todos
    if (checkSelectAll) {
        checkSelectAll.addEventListener('change', function() {
            clienteCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
        
        // Actualizar "Seleccionar todos" cuando se cambian las selecciones individuales
        clienteCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectAllCheckbox);
        });
        
        function updateSelectAllCheckbox() {
            const checkedCount = document.querySelectorAll('tbody input[type="checkbox"]:checked').length;
            checkSelectAll.checked = checkedCount === clienteCheckboxes.length;
        }
    }
    
    // Formulario: si se selecciona tipo "Particular", cambiar etiqueta CIF/NIF a NIF
    const tipoClienteSelect = document.getElementById('tipo-cliente');
    const cifNifLabel = document.querySelector('label[for="cif-nif"]');
    
    if (tipoClienteSelect && cifNifLabel) {
        tipoClienteSelect.addEventListener('change', function() {
            if (this.value === 'particular') {
                cifNifLabel.textContent = 'NIF';
            } else if (this.value === 'empresa') {
                cifNifLabel.textContent = 'CIF';
            } else {
                cifNifLabel.textContent = 'CIF/NIF';
            }
        });
    }
    
    // Función para filtrar la tabla de clientes (simulada)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Simulación de filtro en las filas de la tabla
            const tableRows = document.querySelectorAll('.clientes-table tbody tr');
            tableRows.forEach(row => {
                const clienteName = row.querySelector('.cliente-name').textContent.toLowerCase();
                const clienteEmail = row.querySelector('.cliente-email').textContent.toLowerCase();
                
                if (clienteName.includes(searchTerm) || clienteEmail.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Simulación de filtro en las tarjetas para móvil
            const clienteCards = document.querySelectorAll('.cliente-card');
            clienteCards.forEach(card => {
                if (card.classList.contains('add-company-card')) return;
                
                const clienteName = card.querySelector('.cliente-name').textContent.toLowerCase();
                const clienteEmail = card.querySelector('.cliente-email').textContent.toLowerCase();
                
                if (clienteName.includes(searchTerm) || clienteEmail.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Para la paginación (simulada)
    const pageItems = document.querySelectorAll('.pagination .page-item:not(.disabled)');
    pageItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            document.querySelector('.pagination .page-item.active').classList.remove('active');
            this.classList.add('active');
            
            // Aquí se cargarían los datos de la página correspondiente
            // En una implementación real, se haría una petición AJAX
        });
    });
});