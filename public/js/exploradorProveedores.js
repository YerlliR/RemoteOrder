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
    const contactButtons = document.querySelectorAll('.btn-contact');
    const modalContact = document.getElementById('modal-contact');
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
                if (listView) listView.classList.remove('active-view');
            } else {
                gridView.classList.remove('active-view');
                if (listView) listView.classList.add('active-view');
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
    
    // Gestionar clics en botón "Ver perfil"
    document.addEventListener('click', function(e) {
        // Verificar si el clic fue en un botón "Ver perfil"
        if (e.target.classList.contains('btn-view-profile')) {
            e.preventDefault(); // Prevenir comportamiento por defecto
            
            // Obtener ID de empresa desde el atributo data
            const empresaId = e.target.getAttribute('data-empresa-id');
            
            // Verificar si tenemos datos para esta empresa
            if (empresasDatos[empresaId]) {
                // Obtener datos de la empresa
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
                                <?php
                                
                                $productos = findByEmpresaId($empresa->getId());
                            
                                foreach ($productos as $producto) {
                                ?>
                                    <div class="product-card">
                                        <div class="product-image" style="background-image: url('../../uploads/productos/<?php echo $producto->getRutaImagen(); ?>');"></div>
                                        <h3><?php echo $producto->getNombreProducto(); ?></h3>
                                        <p><?php echo $producto->getDescripcion(); ?></p>
                                        <span class="product-price"><?php echo $producto->getPrecio(); ?>€</span>
                                    </div>
                                <?php
                                }
                                ?>
                                    
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
                                            <span>${empresa.sitio_web}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                alert('No se encontró información para esta empresa.');
            }
        }
    });
    
    // Abrir modal de contacto
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Obtener datos del proveedor
            const providerCard = this.closest('.provider-card, .provider-list-item');
            const providerName = providerCard.querySelector('h3').textContent;
            
            // Actualizar nombre en el modal
            const contactProviderName = document.getElementById('contact-provider-name');
            if (contactProviderName) {
                contactProviderName.textContent = providerName;
            }
            
            // Mostrar modal
            if (modalContact) {
                modalContact.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Función para activar listeners en los elementos del modal
    function activarListenersModal() {
        const modalPerfil = document.getElementById('modal-perfil');
        if (!modalPerfil) return;
        
        // Cerrar modal
        const closeBtn = modalPerfil.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modalPerfil);
            });
        }
        
        // Cerrar modal al hacer clic fuera del contenido
        modalPerfil.addEventListener('click', function(e) {
            if (e.target === modalPerfil) {
                closeModal(modalPerfil);
            }
        });
        
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
    }
    
    // Cerrar modales
    const modalCloseButtons = document.querySelectorAll('.modal-close');
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
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restaurar scroll
        }
    }
    
    // Enviar formulario de contacto (modal)
    if (sendModalMessageBtn) {
        sendModalMessageBtn.addEventListener('click', function() {
            const subject = document.getElementById('modal-contact-subject')?.value.trim();
            const message = document.getElementById('modal-contact-message')?.value.trim();
            const name = document.getElementById('modal-contact-name')?.value.trim();
            
            // Validación básica
            if (!subject || !message || !name) {
                showToast('Por favor, completa todos los campos obligatorios');
                return;
            }
            
            // En una implementación real, aquí enviarías los datos al servidor
            // Simulación de envío exitoso
            showToast('Mensaje enviado correctamente');
            
            // Limpiar formulario y cerrar modal
            if (document.getElementById('modal-contact-subject')) document.getElementById('modal-contact-subject').value = '';
            if (document.getElementById('modal-contact-message')) document.getElementById('modal-contact-message').value = '';
            if (document.getElementById('modal-contact-name')) document.getElementById('modal-contact-name').value = '';
            
            closeModal(modalContact);
        });
    }
    
    // Validación simple de email
    
    
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

    // Referencias a elementos del modal de contacto

    const viewProfileButtons = document.querySelectorAll('.btn-view-profile');
    const contactProviderName = document.getElementById('contact-provider-name');
    const btnSendModalMessage = document.getElementById('btn-send-modal-message');
    const btnCancelContact = document.getElementById('btn-cancel-contact');
    
    // Variables para almacenar el proveedor seleccionado
    let selectedProviderID = null;
    let selectedProviderName = '';
    
    // Abrir modal de contacto al hacer clic en "Contactar"
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Obtener datos del proveedor desde la tarjeta
            const providerCard = this.closest('.provider-card');
            if (providerCard) {
                selectedProviderID = providerCard.getAttribute('data-id');
                selectedProviderName = providerCard.querySelector('h3').textContent;
                
                // Actualizar nombre en el modal
                if (contactProviderName) {
                    contactProviderName.textContent = selectedProviderName;
                }
                
                // Mostrar modal
                if (modalContact) {
                    modalContact.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });
    
    // Abrir modal desde el botón "Contactar" en el perfil
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-solicitar-desde-perfil')) {
            e.preventDefault();
            
            // Cerrar modal de perfil si está abierto
            const modalPerfil = document.getElementById('modal-perfil');
            if (modalPerfil && modalPerfil.classList.contains('active')) {
                modalPerfil.classList.remove('active');
            }
            
            // Abrir modal de contacto
            if (modalContact) {
                // El ID y nombre del proveedor ya deben estar establecidos
                modalContact.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });
    
    // Cerrar modal de contacto
    if (btnCancelContact) {
        btnCancelContact.addEventListener('click', function() {
            closeContactModal();
        });
    }
    
    // También cerrar al hacer clic en el botón X o fuera del modal
    document.addEventListener('click', function(e) {
        if (e.target.matches('.modal-close') || 
            (modalContact && e.target === modalContact)) {
            closeContactModal();
        }
    });
    
    // Función para cerrar el modal de contacto
    function closeContactModal() {
        if (modalContact) {
            modalContact.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Limpiar campos del formulario
            document.getElementById('modal-contact-name').value = '';
            document.getElementById('modal-contact-subject').value = '';
            document.getElementById('modal-contact-message').value = '';
            document.getElementById('modal-contact-terms').checked = false;
        }
    }
    
    // Enviar solicitud al hacer clic en el botón "Enviar mensaje"
    if (btnSendModalMessage) {
        btnSendModalMessage.addEventListener('click', function() {
            // Validar campos
            const subject = document.getElementById('modal-contact-subject').value.trim();
            const message = document.getElementById('modal-contact-message').value.trim();
            const name = document.getElementById('modal-contact-name').value.trim();
            
            // Verificar que se haya seleccionado un proveedor
            if (!selectedProviderID) {
                showToast('Error: No se ha seleccionado un proveedor');
                return;
            }
            
            // Datos para enviar al servidor
            const solicitudData = {
                id_empresa_proveedor: selectedProviderID,
                asunto: subject,
                mensaje: message
            };
            
            // Mostrar indicador de carga
            btnSendModalMessage.disabled = true;
            btnSendModalMessage.textContent = 'Enviando...';
            
            // Enviar solicitud al servidor mediante fetch
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
                    console.error('Error:', data.mensaje || 'No se pudo enviar la solicitud');
                    // Mostrar mensaje de error
                    showToast('Error: ' + (data.mensaje || 'No se pudo enviar la solicitud'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                btnSendModalMessage.disabled = false;
                btnSendModalMessage.textContent = 'Enviar mensaje';
                showToast('Error de conexión. Inténtalo de nuevo.');
            });
        });
    }
    
    // Función mejorada para mostrar notificaciones (toast)
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
    
    // Función simple para validar email
    
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