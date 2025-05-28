document.addEventListener('DOMContentLoaded', function() {
    const heroSearch = document.getElementById('hero-search');
    const searchButton = document.querySelector('.search-button');
    const categoryCards = document.querySelectorAll('.category-card');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const providerCards = document.querySelectorAll('.provider-card');
    const modalContact = document.getElementById('modal-contact');
    const btnSendModalMessage = document.getElementById('btn-send-modal-message');
    const btnCancelContact = document.getElementById('btn-cancel-contact');
    
    let categoryFilter = '';
    let selectedProviderID = null;

    // Búsqueda
    function searchProviders() {
        const searchTerm = heroSearch?.value.toLowerCase().trim() || '';
        let matches = 0;
        
        providerCards.forEach(card => {
            const providerName = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const providerDescription = card.querySelector('.provider-description')?.textContent.toLowerCase() || '';
            const providerTag = card.querySelector('.tag')?.textContent.toLowerCase() || '';
            
            if (providerName.includes(searchTerm) || 
                providerDescription.includes(searchTerm) || 
                providerTag.includes(searchTerm)) {
                card.style.display = '';
                matches++;
            } else {
                card.style.display = 'none';
            }
        });
        
        updateResultsCounter(matches);
    }
    
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
    
    // Filtros por categoría
    function filterByCategory(category) {
        let matches = 0;
        categoryFilter = category;
        
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            categoryTitle.textContent = category ? `de ${category.charAt(0).toUpperCase() + category.slice(1)}` : '';
        }
        
        providerCards.forEach(card => {
            if (!category) {
                card.style.display = '';
                matches++;
                return;
            }
            
            const tagElement = card.querySelector('.tag');
            const tagClass = Array.from(tagElement?.classList || []).find(cls => cls.startsWith('tag-'));
            const providerCategory = tagClass ? tagClass.replace('tag-', '') : '';
            
            if (providerCategory === category) {
                card.style.display = '';
                matches++;
            } else {
                card.style.display = 'none';
            }
        });
        
        updateResultsCounter(matches);
    }
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
            
            const providersSection = document.querySelector('.providers-section');
            if (providersSection) {
                providersSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Reset filtros
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            providerCards.forEach(card => {
                card.style.display = '';
            });
            
            if (categoryFilter) {
                filterByCategory(categoryFilter);
            } else {
                updateResultsCounter(providerCards.length);
            }
        });
    }
    
    // Aplicar filtros
    function applyFilters() {
        const selectedLocations = Array.from(document.querySelectorAll('input[name="location"]:checked'))
            .map(input => input.value);
            
        let matches = 0;
        
        providerCards.forEach(card => {
            if (card.style.display === 'none' && categoryFilter) {
                return;
            }
            
            let shouldShow = true;
            
            if (selectedLocations.length > 0) {
                const locationText = card.querySelector('.provider-location')?.textContent.toLowerCase() || '';
                const matchesLocation = selectedLocations.some(location => 
                    locationText.includes(location.toLowerCase())
                );
                if (!matchesLocation) shouldShow = false;
            }
            
            if (shouldShow) {
                card.style.display = '';
                matches++;
            } else {
                card.style.display = 'none';
            }
        });
        
        updateResultsCounter(matches);
    }
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    function updateResultsCounter(count) {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }
    
    // Ver perfil
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-view-profile') || e.target.closest('.btn-view-profile')) {
            e.preventDefault();
            
            const button = e.target.classList.contains('btn-view-profile') ? e.target : e.target.closest('.btn-view-profile');
            const empresaId = button?.getAttribute('data-empresa-id');
            
            if (empresasDatos && empresasDatos[empresaId]) {
                const empresa = empresasDatos[empresaId];
                
                const modalHtml = `
                <div class="modal active" id="modal-perfil">
                    <div class="modal-content">
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                        <div class="profile-header">
                            <h2>${empresa.nombre}</h2>
                            <p><i class="fas fa-map-marker-alt"></i> ${empresa.ciudad}, ${empresa.pais}</p>
                            <p><i class="fas fa-tag"></i> ${empresa.sector}</p>
                        </div>
                        <div class="profile-content">
                            <h3>Acerca de</h3>
                            <p>${empresa.descripcion}</p>
                            <h3>Contacto</h3>
                            <p><i class="fas fa-envelope"></i> ${empresa.email}</p>
                            <p><i class="fas fa-phone"></i> ${empresa.telefono}</p>
                            <p><i class="fas fa-globe"></i> ${empresa.sitio_web || 'No disponible'}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary modal-close">Cerrar</button>
                            <button class="btn btn-primary btn-solicitar-desde-perfil" data-empresa-id="${empresaId}">Solicitar servicio</button>
                        </div>
                    </div>
                </div>`;
                
                const modalAnterior = document.getElementById('modal-perfil');
                if (modalAnterior) {
                    modalAnterior.remove();
                }
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                document.body.style.overflow = 'hidden';
                
                activarListenersModal();
            }
        }
    });
    
    // Contacto
    const contactButtons = document.querySelectorAll('.btn-contact');
    
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            selectedProviderID = this.getAttribute('data-empresa-id');
            
            const providerCard = this.closest('.provider-card');
            const providerName = providerCard?.querySelector('h3')?.textContent || 'Proveedor';
            
            const contactProviderName = document.getElementById('contact-provider-name');
            if (contactProviderName) {
                contactProviderName.textContent = providerName;
            }
            
            if (modalContact) {
                modalContact.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Solicitar desde perfil
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-solicitar-desde-perfil')) {
            e.preventDefault();
            
            selectedProviderID = e.target.getAttribute('data-empresa-id');
            
            const perfilNombre = document.getElementById('perfil-nombre');
            const providerName = perfilNombre ? perfilNombre.textContent : 'Proveedor';
            
            const modalPerfil = document.getElementById('modal-perfil');
            if (modalPerfil) {
                modalPerfil.classList.remove('active');
            }
            
            const contactProviderName = document.getElementById('contact-provider-name');
            if (contactProviderName) {
                contactProviderName.textContent = providerName;
            }
            
            if (modalContact) {
                modalContact.classList.add('active');
            }
        }
    });
    
    // Enviar solicitud
    if (btnSendModalMessage) {
        btnSendModalMessage.addEventListener('click', function() {
            const subject = document.getElementById('modal-contact-subject')?.value.trim() || '';
            const message = document.getElementById('modal-contact-message')?.value.trim() || '';
            
            if (!selectedProviderID) {
                alert('Error: No se ha seleccionado un proveedor');
                return;
            }
            
            if (!subject || !message) {
                alert('Por favor, complete todos los campos obligatorios');
                return;
            }
            
            btnSendModalMessage.disabled = true;
            btnSendModalMessage.textContent = 'Enviando...';
            
            const solicitudData = {
                id_empresa_proveedor: selectedProviderID,
                asunto: subject,
                mensaje: message
            };
            
            fetch('../../php/actions/procesarSolicitud.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(solicitudData)
            })
            .then(response => response.json())
            .then(data => {
                btnSendModalMessage.disabled = false;
                btnSendModalMessage.textContent = 'Enviar mensaje';
                
                if (data.success) {
                    alert('Solicitud enviada correctamente');
                    closeContactModal();
                } else {
                    alert('Error: ' + (data.mensaje || 'No se pudo enviar la solicitud'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                btnSendModalMessage.disabled = false;
                btnSendModalMessage.textContent = 'Enviar mensaje';
                alert('Error de conexión. Inténtalo de nuevo.');
            });
        });
    }
    
    // Cerrar modales
    if (btnCancelContact) {
        btnCancelContact.addEventListener('click', closeContactModal);
    }
    
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    function activarListenersModal() {
        const modalPerfil = document.getElementById('modal-perfil');
        if (!modalPerfil) return;
        
        const closeBtn = modalPerfil.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modalPerfil.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }
    
    function closeContactModal() {
        if (modalContact) {
            modalContact.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        const subjectInput = document.getElementById('modal-contact-subject');
        const messageInput = document.getElementById('modal-contact-message');
        const nameInput = document.getElementById('modal-contact-name');
        
        if (subjectInput) subjectInput.value = '';
        if (messageInput) messageInput.value = '';
        if (nameInput) nameInput.value = '';
        
        selectedProviderID = null;
    }
});
