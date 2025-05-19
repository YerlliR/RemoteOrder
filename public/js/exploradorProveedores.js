document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM frecuentemente utilizados
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
    const providerCards = document.querySelectorAll('.provider-card');
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    const modalContact = document.getElementById('modal-contact');
    const pageButtons = document.querySelectorAll('.page-btn');

    // Variable para almacenar el filtro de categoría activo
    let categoryFilter = '';
    
    // Variable global para almacenar el ID del proveedor seleccionado
    let selectedProviderID = null;

    // ===== BÚSQUEDA =====
    function searchProviders() {
        const searchTerm = heroSearch.value.toLowerCase().trim();
        if (!searchTerm) return;
        
        let matches = 0;
        
        // Filtrar proveedores según el término de búsqueda
        providerCards.forEach(card => {
            const providerName = card.querySelector('h3').textContent.toLowerCase();
            const providerDescription = card.querySelector('.provider-description').textContent.toLowerCase();
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
    
    // ===== FILTROS POR CATEGORÍA =====
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
    
    // ===== RESETEAR FILTROS =====
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
    
    // ===== APLICAR FILTROS =====
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
    
    // ===== ORDENAR PROVEEDORES =====
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
    
    // ===== ACTUALIZAR CONTADOR DE RESULTADOS =====
    function updateResultsCounter(count) {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }
    
    // ===== CAMBIAR VISTA (CUADRÍCULA/LISTA) =====
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
                if (listView) listView.classList.remove('active-view');
            } else {
                gridView.classList.remove('active-view');
                if (listView) listView.classList.add('active-view');
            }
        });
    });
    
    // ===== GESTIONAR FAVORITOS =====
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se active el clic en la tarjeta
            
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Añadir a favoritos
                icon.classList.remove('far');
                icon.classList.add('fas');
                
                showToast('Proveedor añadido a favoritos');
            } else {
                // Quitar de favoritos
                icon.classList.remove('fas');
                icon.classList.add('far');
                
                showToast('Proveedor eliminado de favoritos');
            }
        });
    });
    
    // ===== GESTIÓN DE PERFIL DE PROVEEDOR =====
    // Manejar clicks en botones "Ver perfil"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-view-profile') || e.target.closest('.btn-view-profile')) {
            e.preventDefault();
            
            // Obtener el botón (puede ser el propio elemento o su padre)
            const button = e.target.classList.contains('btn-view-profile') ? e.target : e.target.closest('.btn-view-profile');
            
            // Obtener ID de empresa desde el atributo data
            const empresaId = button.getAttribute('data-empresa-id');
            
            // Verificar si tenemos datos para esta empresa
            if (empresasDatos && empresasDatos[empresaId]) {
                const empresa = empresasDatos[empresaId];
                
                // Construir el modal dinámicamente
                const modalHtml = `
                <div class="modal active" id="modal-perfil">
                    <div class="modal-content">
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                        
                        <div class="profile-header">
                            <div class="profile-cover"></div>
                            <div class="profile-main">
                                <div class="profile-logo">TS</div>
                                <div class="profile-info">
                                    <h2 id="perfil-nombre">${empresa.nombre}</h2>
                                    <br>
                                    <div class="profile-meta">
                                        <span class="profile-location"><i class="fas fa-map-marker-alt"></i> ${empresa.ciudad}, ${empresa.pais}</span>
                                        <span class="profile-category"><i class="fas fa-tag"></i> ${empresa.sector}</span>
                                    </div>
                                    <div class="profile-rating">
                                        <div class="stars">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star-half-alt"></i>
                                            <span>4.5</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-tabs">
                            <button class="tab-btn active" data-tab="info">Información</button>
                            <button class="tab-btn" data-tab="products">Productos</button>
                            <button class="tab-btn" data-tab="contact">Contacto</button>
                        </div>
                        
                        <div class="profile-content">
                            <!-- Tab: Información -->
                            <div class="tab-content active" id="tab-info">
                                <div class="profile-section">
                                    <h3>Acerca de</h3>
                                    <p>${empresa.descripcion}</p>
                                </div>
                            </div>
                            
                            <!-- Tab: Productos -->
                            <div class="tab-content" id="tab-products">
                                <div class="products-grid">
                                    <p>No hay productos disponibles actualmente.</p>
                                </div>
                            </div>
                            
                            <!-- Tab: Contacto -->
                            <div class="tab-content" id="tab-contact">
                                <div class="profile-section">
                                    <h3>Información de contacto</h3>
                                    <div class="contact-info">
                                        <div class="contact-item">
                                            <i class="fas fa-envelope"></i>
                                            <span>${empresa.email}</span>
                                        </div>
                                        <div class="contact-item">
                                            <i class="fas fa-phone"></i>
                                            <span>${empresa.telefono}</span>
                                        </div>
                                        <div class="contact-item">
                                            <i class="fas fa-globe"></i>
                                            <span>${empresa.sitio_web || 'No disponible'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button class="btn btn-secondary modal-close">Cerrar</button>
                            <button class="btn btn-primary btn-solicitar-desde-perfil" data-empresa-id="${empresaId}">Solicitar servicio</button>
                        </div>
                    </div>
                </div>`;
                
                // Eliminar modal anterior si existe
                const modalAnterior = document.getElementById('modal-perfil');
                if (modalAnterior) {
                    modalAnterior.remove();
                }
                
                // Añadir el modal al body
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                
                // Evitar scroll en el fondo
                document.body.style.overflow = 'hidden';
                
                // Activar listeners para el nuevo modal
                activarListenersModal();
            } else {
                // Mostrar mensaje de error si no hay datos
                showToast('No se encontró información para esta empresa.');
            }
        }
    });
    
    // ===== GESTIONAR CONTACTO CON PROVEEDORES =====
    // Asignar eventos a botones de contacto
    const contactButtons = document.querySelectorAll('.btn-contact');
    
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Obtener el ID del proveedor
            selectedProviderID = this.getAttribute('data-empresa-id');
            
            // Obtener el nombre del proveedor desde la tarjeta
            const providerCard = this.closest('.provider-card');
            const providerName = providerCard ? providerCard.querySelector('h3').textContent : 'Proveedor';
            
            // Actualizar el nombre en el modal
            const contactProviderName = document.getElementById('contact-provider-name');
            if (contactProviderName) {
                contactProviderName.textContent = providerName;
            }
            
            // Mostrar el modal
            if (modalContact) {
                modalContact.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // ===== GESTIONAR SOLICITUDES DESDE PERFIL =====
    // Escuchar clicks en botón "Solicitar servicio" del perfil
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-solicitar-desde-perfil')) {
            e.preventDefault();
            
            // Obtener ID del proveedor
            selectedProviderID = e.target.getAttribute('data-empresa-id');
            
            // Obtener nombre del proveedor
            const perfilNombre = document.getElementById('perfil-nombre');
            const providerName = perfilNombre ? perfilNombre.textContent : 'Proveedor';
            
            // Cerrar modal de perfil
            const modalPerfil = document.getElementById('modal-perfil');
            if (modalPerfil) {
                modalPerfil.classList.remove('active');
            }
            
            // Actualizar el nombre en el modal de contacto
            const contactProviderName = document.getElementById('contact-provider-name');
            if (contactProviderName) {
                contactProviderName.textContent = providerName;
            }
            
            // Abrir modal de contacto
            if (modalContact) {
                modalContact.classList.add('active');
            }
        }
    });
    
    // ===== ENVIAR FORMULARIO DE CONTACTO =====
    const btnSendModalMessage = document.getElementById('btn-send-modal-message');
    if (btnSendModalMessage) {
        btnSendModalMessage.addEventListener('click', function() {
            // Validar campos
            const subject = document.getElementById('modal-contact-subject').value.trim();
            const message = document.getElementById('modal-contact-message').value.trim();
            
            // Verificar que se haya seleccionado un proveedor
            if (!selectedProviderID) {
                showToast('Error: No se ha seleccionado un proveedor');
                return;
            }
            
            // Validación simple
            if (!subject || !message) {
                showToast('Por favor, complete todos los campos obligatorios');
                return;
            }
            
            // Deshabilitar botón para evitar envíos múltiples
            btnSendModalMessage.disabled = true;
            btnSendModalMessage.textContent = 'Enviando...';
            
            // Datos para enviar al servidor
            const solicitudData = {
                id_empresa_proveedor: selectedProviderID,
                asunto: subject,
                mensaje: message
            };
            
            // Enviar solicitud al servidor
            fetch('../../php/actions/procesarSolicitud.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(solicitudData)
            })
            .then(response => response.json())
            .then(data => {
                // Restablecer botón
                btnSendModalMessage.disabled = false;
                btnSendModalMessage.textContent = 'Enviar mensaje';
                
                if (data.success) {
                    // Mostrar mensaje de éxito
                    showToast('Solicitud enviada correctamente');
                    
                    // Cerrar modal y limpiar campos
                    closeContactModal();
                } else {
                    // Mostrar error detallado
                    showToast('Error: ' + (data.mensaje || 'No se pudo enviar la solicitud'));
                }
            })
            .catch(error => {
                console.error('Error en fetch:', error);
                btnSendModalMessage.disabled = false;
                btnSendModalMessage.textContent = 'Enviar mensaje';
                showToast('Error de conexión. Inténtalo de nuevo.');
            });
        });
    }
    
    // ===== CERRAR MODALES =====
    // Botones para cerrar modal de contacto
    const btnCancelContact = document.getElementById('btn-cancel-contact');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    if (btnCancelContact) {
        btnCancelContact.addEventListener('click', closeContactModal);
    }
    
    // Botones de cierre general
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ===== PAGINACIÓN =====
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('disabled') || this.classList.contains('active')) {
                return;
            }
            
            // Actualizar botones activos
            document.querySelector('.page-btn.active')?.classList.remove('active');
            this.classList.add('active');
            
            // En una implementación real, aquí cargarías los datos de la página correspondiente
            window.scrollTo({
                top: document.querySelector('.providers-section').offsetTop,
                behavior: 'smooth'
            });
        });
    });
    
    // ===== FUNCIONES AUXILIARES =====
    
    // Función para activar listeners en los elementos del modal de perfil
    function activarListenersModal() {
        const modalPerfil = document.getElementById('modal-perfil');
        if (!modalPerfil) return;
        
        // Gestionar tabs del perfil
        const tabButtons = modalPerfil.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Actualizar botones activos
                tabButtons.forEach(button => {
                    button.classList.remove('active');
                });
                this.classList.add('active');
                
                // Mostrar contenido correspondiente
                const tabContents = modalPerfil.querySelectorAll('.tab-content');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                modalPerfil.querySelector(`#tab-${tabId}`).classList.add('active');
            });
        });
        
        // Botón de cierre
        const closeBtn = modalPerfil.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modalPerfil.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }
    
    // Función para cerrar el modal de contacto
    function closeContactModal() {
        if (modalContact) {
            modalContact.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Limpiar campos
        const subjectInput = document.getElementById('modal-contact-subject');
        const messageInput = document.getElementById('modal-contact-message');
        const nameInput = document.getElementById('modal-contact-name');
        
        if (subjectInput) subjectInput.value = '';
        if (messageInput) messageInput.value = '';
        if (nameInput) nameInput.value = '';
        
        // Resetear el ID del proveedor
        selectedProviderID = null;
    }
    
    // Función para mostrar notificaciones (toast)
    function showToast(message) {
        // Verificar si ya existe un toast
        let toastContainer = document.querySelector('.toast-container');
        
        // Si no existe, crear el contenedor de toasts
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Estilos para el contenedor de toasts
            Object.assign(toastContainer.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });
        }
        
        // Crear el toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Estilos para el toast
        Object.assign(toast.style, {
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '300px',
            animation: 'fadeIn 0.3s ease, fadeOut 0.3s ease 2.7s'
        });
        
        // Añadir el toast al contenedor
        toastContainer.appendChild(toast);
        
        // Eliminar el toast después de 3 segundos
        setTimeout(() => {
            toast.remove();
            
            // Eliminar el contenedor si no hay más toasts
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 3000);
    }
    
    // ===== AJUSTE DE LAYOUTS =====
    
    // Ajustar layout de la cuadrícula para diferentes tamaños de pantalla
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
    
    // Añadir keyframes para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
});