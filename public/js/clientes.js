document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const searchInput = document.querySelector('.search-input');
    const btnViewFavorites = document.querySelector('.btn-view-favorites');
    const viewButtons = document.querySelectorAll('.btn-view');
    const contactButtons = document.querySelectorAll('.btn-contact');
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    const modalSolicitud = document.getElementById('modal-solicitud');
    const modalPerfil = document.getElementById('modal-perfil');
    const modalClose = document.querySelectorAll('.modal-close');
    const btnCancel = document.querySelectorAll('.modal-cancel');
    const btnEnviarSolicitud = document.getElementById('enviar-solicitud');
    const btnSolicitarDesdePerfil = document.querySelector('.btn-solicitar-desde-perfil');
    const sectorFilter = document.getElementById('filter-sector');
    const ratingFilter = document.getElementById('filter-rating');
    const sortFilter = document.getElementById('filter-sort');
    
    // Gestionar búsqueda de empresas
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Filtrar en la tabla de empresas
            const tableRows = document.querySelectorAll('.empresas-table tbody tr');
            tableRows.forEach(row => {
                const empresaName = row.querySelector('.empresa-name').textContent.toLowerCase();
                const empresaDescription = row.querySelector('.empresa-description').textContent.toLowerCase();
                
                if (empresaName.includes(searchTerm) || empresaDescription.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Filtrar en las tarjetas para móvil
            const empresaCards = document.querySelectorAll('.empresa-card');
            empresaCards.forEach(card => {
                const empresaName = card.querySelector('.empresa-name').textContent.toLowerCase();
                const empresaDescription = card.querySelector('.empresa-description').textContent.toLowerCase();
                
                if (empresaName.includes(searchTerm) || empresaDescription.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
        
    // Abrir modal de perfil al hacer clic en "Ver perfil"
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const empresaRow = this.closest('tr');
            const empresaCard = this.closest('.empresa-card');
            
            let empresaId, empresaName, empresaDescription;
            
            if (empresaRow) {
                empresaId = "1"; // En una implementación real, aquí tomaríamos el ID de la empresa
                empresaName = empresaRow.querySelector('.empresa-name').textContent;
                empresaDescription = empresaRow.querySelector('.empresa-description').textContent;
            } else if (empresaCard) {
                empresaId = empresaCard.dataset.id;
                empresaName = empresaCard.querySelector('.empresa-name').textContent;
                empresaDescription = empresaCard.querySelector('.empresa-description').textContent;
            }
            
            // Cargar datos en el modal de perfil (simulado)
            document.getElementById('perfil-nombre').textContent = empresaName;
            
            // En una implementación real, aquí cargaríamos todos los datos del perfil
            // mediante una petición AJAX o desde un objeto de datos
            
            modalPerfil.classList.add('active');
        });
    });

    // Añadir/quitar favoritos (simulado)
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Añadir a favoritos
                icon.classList.remove('far');
                icon.classList.add('fas');
                alert('Empresa añadida a favoritos');
            } else {
                // Quitar de favoritos
                icon.classList.remove('fas');
                icon.classList.add('far');
                alert('Empresa eliminada de favoritos');
            }
        });
    });
    
    // Cerrar modales
    modalClose.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    btnCancel.forEach(cancelBtn => {
        cancelBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });
});
    // Navegación entre páginas