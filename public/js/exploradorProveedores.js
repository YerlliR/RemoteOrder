document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const heroSearch = document.getElementById('hero-search');
    const searchButton = document.querySelector('.search-button');
    const categoryCards = document.querySelectorAll('.category-card');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const filterRadios = document.querySelectorAll('.filter-options input[type="radio"]');
    const sortSelect = document.getElementById('sort-providers');
    const viewToggleBtns = document.querySelectorAll('.toggle-btn');
    const gridView = document.getElementById('grid-view');
    const listView = document.getElementById('list-view');
    const providerCards = document.querySelectorAll('.provider-card, .provider-list-item');
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    const viewProfileButtons = document.querySelectorAll('.btn-view-profile');
    const contactButtons = document.querySelectorAll('.btn-contact');
    const modalPerfil = document.getElementById('modal-perfil');
    const modalContact = document.getElementById('modal-contact');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const cancelContactBtn = document.getElementById('btn-cancel-contact');
    const sendModalMessageBtn = document.getElementById('btn-send-modal-message');
    const pageButtons = document.querySelectorAll('.page-btn');

    let categoryFilter = '';
    let resultsCount = 25; // Valor inicial
    
    // Función para buscar proveedores
    function searchProviders() {
        const searchTerm = heroSearch.value.toLowerCase().trim();
        if (!searchTerm) return;
        
        let matches = 0;
        
        // Filtrar proveedores según el término de búsqueda
        providerCards.forEach(card => {
            const providerName = card.querySelector('h3').textContent.toLowerCase();
            const providerDescription = card.querySelector('.provider-description, .provider-description').textContent.toLowerCase();
            const providerTag = card.querySelector('.tag').textContent.toLowerCase();
            
            if (providerName.includes(searchTerm) || 
                providerDescription.includes(searchTerm) || 
                providerTag.includes(searchTerm)) {
                card.style.display = '';
                matches++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Actualizar el contador de resultados
        updateResultsCounter(matches);
    }
    
    // Event listeners para búsqueda
    if (heroSearch) {
        heroSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProviders();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', searchProviders);
    }
    
    // Filtrar por categoría
    function filterByCategory(category) {
        let matches = 0;
        categoryFilter = category;
        
        // Actualizar título de categoría
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            categoryTitle.textContent = category ? `de ${category.charAt(0).toUpperCase() + category.slice(1)}` : '';
        }
        
        // Filtrar proveedores según la categoría
        providerCards.forEach(card => {
            if (!category) {
                card.style.display = '';
                matches++;
                return;
            }
            
            const tagElement = card.querySelector('.tag');
            const tagClass = Array.from(tagElement.classList).find(cls => cls.startsWith('tag-'));
            const providerCategory = tagClass ? tagClass.replace('tag-', '') : '';
            
            if (providerCategory === category) {
                card.style.display = '';
                matches++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Actualizar el contador de resultados
        updateResultsCounter(matches);
    }
    
    // Event listeners para tarjetas de categoría
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
            
            // Desplazar la pantalla hasta la sección de proveedores
            document.querySelector('.providers-section').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Resetear filtros
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Desmarcar todos los checkboxes y radios
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            filterRadios.forEach(radio => {
                radio.checked = false;
            });
            
            // Restaurar ordenamiento original
            if (sortSelect) {
                sortSelect.value = 'relevance';
            }
            
            // Mostrar todos los proveedores
            providerCards.forEach(card => {
                card.style.display = '';
            });
            
            // Restaurar filtro de categoría si estaba activo
            if (categoryFilter) {
                filterByCategory(categoryFilter);
            } else {
                updateResultsCounter(providerCards.length);
            }
        });
    }
    
    // Aplicar filtros cuando cambian los checkboxes o radios
    function applyFilters() {
        // Obtener valores de filtros
        const selectedLocations = Array.from(document.querySelectorAll('input[name="location"]:checked'))
            .map(input => input.value);
            
        const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
        
        const selectedExperience = Array.from(document.querySelectorAll('input[name="experience"]:checked'))
            .map(input => input.value);
            
        const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
            .map(input => input.value);
        
        let matches = 0;
        
        // Aplicar filtros a cada proveedor
        providerCards.forEach(card => {
            // Si ya está oculto por el filtro de categoría, mantenerlo oculto
            if (card.style.display === 'none' && categoryFilter) {
                return;
            }
            
            let shouldShow = true;
            
            // Filtro de ubicación
            if (selectedLocations.length > 0) {
                const locationText = card.querySelector('.provider-location').textContent.toLowerCase();
                const matchesLocation = selectedLocations.some(location => 
                    locationText.includes(location.toLowerCase())
                );
                if (!matchesLocation) shouldShow = false;
            }
            
            // Filtro de valoración
            if (selectedRating && shouldShow) {
                const ratingText = card.querySelector('.provider-rating span').textContent;
                const rating = parseFloat(ratingText);
                if (rating < parseFloat(selectedRating)) shouldShow = false;
            }
            
            // Aquí podrían incluirse los filtros de experiencia y servicios
            // en una implementación real con datos completos
            
            // Aplicar visibilidad
            if (shouldShow) {
                card.style.display = '';
                matches++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Actualizar contador de resultados
        updateResultsCounter(matches);
    }
    
    // Event listeners para filtros
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    filterRadios.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    // Ordenar proveedores
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            
            // Obtener todos los proveedores visibles
            const visibleProviders = Array.from(providerCards).filter(card => 
                card.style.display !== 'none'
            );
            
            // Ordenar según el criterio seleccionado
            visibleProviders.sort((a, b) => {
                if (sortValue === 'name-asc') {
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                } else if (sortValue === 'name-desc') {
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                } else if (sortValue === 'rating-desc') {
                    const ratingA = parseFloat(a.querySelector('.provider-rating span').textContent);
                    const ratingB = parseFloat(b.querySelector('.provider-rating span').textContent);
                    return ratingB - ratingA;
                }
                // Para 'relevance' no hacemos nada, se mantiene el orden original
                return 0;
            });
            
            // Reordenar en el DOM
            const container = visibleProviders[0].parentNode;
            visibleProviders.forEach(card => {
                container.appendChild(card);
            });
        });
    }
    
    // Actualizar contador de resultados
    function updateResultsCounter(count) {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = count;
        }
        resultsCount = count;
    }
    
    // Cambiar vista de cuadrícula a lista
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.dataset.view;
            
            // Actualizar clases activas de los botones
            viewToggleBtns.forEach(button => {
                button.classList.remove('active');
            });
            this.classList.add('active');
            
            // Mostrar vista correspondiente
            if (viewType === 'grid') {
                gridView.classList.add('active-view');
                listView.classList.remove('active-view');
            } else {
                gridView.classList.remove('active-view');
                listView.classList.add('active-view');
            }
        });
    });
    
    // Gestionar favoritos
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se active el clic en la tarjeta
            
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Añadir a favoritos
                icon.classList.remove('far');
                icon.classList.add('fas');
                
                // Mostrar notificación o feedback (opcional)
                showToast('Proveedor añadido a favoritos');
            } else {
                // Quitar de favoritos
                icon.classList.remove('fas');
                icon.classList.add('far');
                
                // Mostrar notificación o feedback (opcional)
                showToast('Proveedor eliminado de favoritos');
            }
        });
    });
    
    // Función para mostrar notificaciones (toast)
    function showToast(message) {
        // Implementación simple de notificación
        // En una aplicación real, podrías usar una librería de notificaciones o crear uno más elaborado
        alert(message);
    }
    
    // Abrir modal de perfil
    viewProfileButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Obtener datos del proveedor (en una implementación real, podrías hacer una petición AJAX)
            const providerCard = this.closest('.provider-card, .provider-list-item');
            const providerName = providerCard.querySelector('h3').textContent;
            
            // Actualizar nombre en el modal
            document.getElementById('perfil-nombre').textContent = providerName;
            
            // Mostrar modal
            modalPerfil.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
        });
    });
    
    // Abrir modal de contacto
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Obtener datos del proveedor
            const providerCard = this.closest('.provider-card, .provider-list-item');
            const providerName = providerCard.querySelector('h3').textContent;
            
            // Actualizar nombre en el modal
            document.getElementById('contact-provider-name').textContent = providerName;
            
            // Mostrar modal
            modalContact.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Gestionar tabs del perfil
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Actualizar botones activos
            tabButtons.forEach(button => {
                button.classList.remove('active');
            });
            this.classList.add('active');
            
            // Mostrar contenido correspondiente
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });
    
    // Cerrar modales
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    if (cancelContactBtn) {
        cancelContactBtn.addEventListener('click', function() {
            closeModal(modalContact);
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
    
    // Enviar formulario de contacto (modal)
    if (sendModalMessageBtn) {
        sendModalMessageBtn.addEventListener('click', function() {
            const subject = document.getElementById('modal-contact-subject').value.trim();
            const message = document.getElementById('modal-contact-message').value.trim();
            const name = document.getElementById('modal-contact-name').value.trim();
            const email = document.getElementById('modal-contact-email').value.trim();
            const termsAccepted = document.getElementById('modal-contact-terms').checked;
            
            // Validación básica
            if (!subject || !message || !name || !email) {
                showToast('Por favor, completa todos los campos obligatorios');
                return;
            }
            
            if (!validateEmail(email)) {
                showToast('Por favor, introduce un email válido');
                return;
            }
            
            if (!termsAccepted) {
                showToast('Debes aceptar los términos y condiciones');
                return;
            }
            
            // En una implementación real, aquí enviarías los datos al servidor
            // Simulación de envío exitoso
            showToast('Mensaje enviado correctamente');
            
            // Limpiar formulario y cerrar modal
            document.getElementById('modal-contact-subject').value = '';
            document.getElementById('modal-contact-message').value = '';
            document.getElementById('modal-contact-name').value = '';
            document.getElementById('modal-contact-email').value = '';
            document.getElementById('modal-contact-terms').checked = false;
            
            closeModal(modalContact);
        });
    }
    
    // Validación simple de email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Gestionar paginación
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('disabled') || this.classList.contains('active')) {
                return;
            }
            
            // Actualizar botones activos
            document.querySelector('.page-btn.active')?.classList.remove('active');
            this.classList.add('active');
            
            // En una implementación real, aquí cargarías los datos de la página correspondiente
            // Por ahora simplemente fingimos que hemos cambiado de página
            window.scrollTo({
                top: document.querySelector('.providers-section').offsetTop,
                behavior: 'smooth'
            });
        });
    });




    function adjustCardLayout() {
        const marketplaceContent = document.querySelector('.marketplace-content');
        const providersGrid = document.querySelector('.providers-grid');
        
        if (marketplaceContent && providersGrid) {
            // Ajustar el ancho del contenedor según el espacio disponible
            if (window.innerWidth <= 768) {
                marketplaceContent.style.maxWidth = '100%';
            } else {
                // En pantallas más grandes, considerar el espacio del sidebar
                marketplaceContent.style.maxWidth = '1200px';
            }
        }
        
        // Recalcular el tamaño óptimo para las tarjetas según el ancho disponible
        if (providersGrid) {
            const containerWidth = providersGrid.clientWidth;
            let optimalColumns;
            
            if (containerWidth > 1200) {
                optimalColumns = Math.floor(containerWidth / 280); // Más tarjetas para pantallas grandes
            } else if (containerWidth > 768) {
                optimalColumns = Math.floor(containerWidth / 260);
            } else if (containerWidth > 576) {
                optimalColumns = Math.floor(containerWidth / 230);
            } else {
                optimalColumns = 1; // Una tarjeta por fila en móviles pequeños
            }
            
            // Aplicar el ajuste solo si es necesario
            if (optimalColumns > 0) {
                const minWidth = Math.floor((containerWidth / optimalColumns) - 25) + 'px';
                providersGrid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth}, 1fr))`;
            }
        }
    }
    
    // Ejecutar al cargar y al cambiar el tamaño de ventana
    adjustCardLayout();
    window.addEventListener('resize', adjustCardLayout);
    
    // Mejorar la interacción entre el toggle del sidebar y el contenido
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleSidebar && sidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            
            // Volver a ajustar el layout después de la transición del sidebar
            setTimeout(adjustCardLayout, 300);
        });
    }
    
    // Detectar clicks fuera del sidebar para cerrarlo en móviles
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            sidebar && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== toggleSidebar) {
            sidebar.classList.remove('active');
            setTimeout(adjustCardLayout, 300);
        }
    });

    // Corregir el comportamiento de los enlaces en el sidebar
    const menuLinks = document.querySelectorAll('.sidebar a');
    menuLinks.forEach(link => {
        // Asegurar que los enlaces funcionan correctamente
        link.addEventListener('click', function(e) {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                // No prevenir la navegación para enlaces válidos
            } else {
                e.preventDefault();
            }
            
            // Si estamos en móvil, cerrar el sidebar al hacer clic en un enlace
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });
});