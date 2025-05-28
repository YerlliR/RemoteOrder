document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const viewButtons = document.querySelectorAll('.btn-view');
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    const modalPerfil = document.getElementById('modal-perfil');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Búsqueda de empresas
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Filtrar en la tabla
            const tableRows = document.querySelectorAll('.empresas-table tbody tr');
            tableRows.forEach(row => {
                const empresaName = row.querySelector('.empresa-name')?.textContent.toLowerCase() || '';
                const empresaDescription = row.querySelector('.empresa-description')?.textContent.toLowerCase() || '';
                
                if (empresaName.includes(searchTerm) || empresaDescription.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Filtrar en las tarjetas
            const empresaCards = document.querySelectorAll('.empresa-card');
            empresaCards.forEach(card => {
                const empresaName = card.querySelector('.empresa-name')?.textContent.toLowerCase() || '';
                const empresaDescription = card.querySelector('.empresa-description')?.textContent.toLowerCase() || '';
                
                if (empresaName.includes(searchTerm) || empresaDescription.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Ver perfil
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const empresaRow = this.closest('tr');
            const empresaCard = this.closest('.empresa-card');
            
            let empresaName = '';
            
            if (empresaRow) {
                empresaName = empresaRow.querySelector('.empresa-name')?.textContent || '';
            } else if (empresaCard) {
                empresaName = empresaCard.querySelector('.empresa-name')?.textContent || '';
            }
            
            if (modalPerfil) {
                const perfilNombre = document.getElementById('perfil-nombre');
                if (perfilNombre) {
                    perfilNombre.textContent = empresaName;
                }
                modalPerfil.classList.add('active');
            }
        });
    });

    // Favoritos
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                alert('Empresa añadida a favoritos');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                alert('Empresa eliminada de favoritos');
            }
        });
    });
    
    // Cerrar modales
    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
});