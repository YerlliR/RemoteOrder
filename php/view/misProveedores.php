<?php
session_start();
// Si no hay sesión activa, redirigir al login
if (!isset($_SESSION['usuario'])) {
    header('Location: ../../index.php');
    exit;
}

// Incluir los archivos necesarios
require_once "../dao/RelacionesEmpresaDao.php";
require_once "../model/Empresa.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Proveedores - RemoteOrder</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../public/styles/base.css">
    <link rel="stylesheet" href="../../public/styles/menuLateral.css">
    <link rel="stylesheet" href="../../public/styles/misProveedores.css">
</head>
<body>
    <?php include_once 'elements/menuLateral.php'; ?>
    
    <div class="proveedores-container">
        <div class="proveedores-header">
            <h1 class="section-title">Mis Proveedores</h1>
            <div class="proveedores-actions">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="Buscar proveedor...">
                </div>
                <a href="explorarProveedores.php" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Añadir Proveedor
                </a>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filters-container">
            <select class="filter-select" id="filter-sector">
                <option value="">Todos los sectores</option>
                <option value="tecnologia">Tecnología</option>
                <option value="servicios">Servicios Profesionales</option>
                <option value="comercio">Comercio</option>
                <option value="industria">Industria</option>
                <option value="agricola">Agrícola</option>
                <option value="alimenticio">Alimenticio</option>
            </select>
            <select class="filter-select" id="filter-rating">
                <option value="">Todas las valoraciones</option>
                <option value="5">5 estrellas</option>
                <option value="4">4+ estrellas</option>
                <option value="3">3+ estrellas</option>
            </select>
            <select class="filter-select" id="filter-sort">
                <option value="recent">Recientes primero</option>
                <option value="name-asc">Nombre (A-Z)</option>
                <option value="name-desc">Nombre (Z-A)</option>
                <option value="rating">Mejor valorados</option>
            </select>
        </div>

        <!-- Vista de lista de proveedores -->
        <div class="proveedores-lista">
            <div class="header-row">
                <div class="header-cell">Proveedor</div>
                <div class="header-cell">Sector</div>
                <div class="header-cell">Contacto</div>
                <div class="header-cell">Ubicación</div>
                <div class="header-cell">Valoración</div>
                <div class="header-cell">Acciones</div>
            </div>

            <?php
            // Obtener el ID de la empresa actual
            $idEmpresa = $_SESSION['empresa']['id'];
            if (is_array($idEmpresa)) {
                $idEmpresa = $idEmpresa[0]; // Si es un array, tomar el primer elemento
            }
            
            // Obtener los proveedores de la empresa actual
            $proveedores = obtenerProveedoresDeProveedor($idEmpresa);
            
            if (empty($proveedores)) {
                echo '<div class="empty-state" style="padding: 40px; text-align: center; width: 100%;">
                    <i class="fas fa-store" style="font-size: 48px; margin-bottom: 20px; color: #cbd5e1;"></i>
                    <p>No tienes proveedores vinculados actualmente.</p>
                    <p>Explora nuevos proveedores para establecer relaciones comerciales.</p>
                    <a href="explorarProveedores.php" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">
                        Explorar Proveedores
                    </a>
                </div>';
            } else {
                foreach ($proveedores as $proveedor) {
                    // Generar iniciales del nombre de la empresa para el avatar
                    $iniciales = strtoupper(substr($proveedor['nombre'], 0, 2));
                    
                    echo '<div class="proveedor-row">
                        <div class="proveedor-cell proveedor-info">
                            <div class="proveedor-avatar">';
                    if (!empty($proveedor['ruta_logo'])) {
                        echo '<img src="../../' . $proveedor['ruta_logo'] . '" alt="Logo ' . $proveedor['nombre'] . '">';
                    } else {
                        echo $iniciales;
                    }
                    echo '</div>
                            <div class="proveedor-details">
                                <h3 class="proveedor-name">' . $proveedor['nombre'] . '</h3>
                                <p class="proveedor-location"><i class="fas fa-map-marker-alt"></i> ' . $proveedor['ciudad'] . ', ' . $proveedor['pais'] . '</p>
                            </div>
                        </div>
                        <div class="proveedor-cell proveedor-sector">
                            <span class="tag tag-' . strtolower($proveedor['sector']) . '">' . $proveedor['sector'] . '</span>
                        </div>
                        <div class="proveedor-cell proveedor-contacto">
                            <p><i class="fas fa-envelope"></i> ' . $proveedor['email'] . '</p>
                            <p><i class="fas fa-phone"></i> ' . $proveedor['telefono'] . '</p>
                        </div>
                        <div class="proveedor-cell proveedor-ubicacion">
                            <p>' . $proveedor['ciudad'] . ', ' . $proveedor['pais'] . '</p>
                        </div>
                        <div class="proveedor-cell proveedor-rating">
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>4.5</span>
                            </div>
                        </div>
                        <div class="proveedor-cell proveedor-acciones">
                            <button class="btn-action btn-view" title="Ver perfil" data-id="' . $proveedor['id'] . '">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action btn-order" title="Realizar pedido" data-id="' . $proveedor['id'] . '">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            <button class="btn-action btn-chat" title="Enviar mensaje" data-id="' . $proveedor['id'] . '">
                                <i class="fas fa-comment-alt"></i>
                            </button>
                            <button class="btn-action btn-remove" title="Eliminar proveedor" data-id="' . $proveedor['relacion_id'] . '">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>';
                }
            }
            ?>
        </div>

        <!-- Vista móvil - Tarjetas de proveedores -->
        <div class="proveedores-cards">
            <?php
            if (empty($proveedores)) {
                echo '<div class="empty-state" style="padding: 40px; text-align: center; width: 100%;">
                    <i class="fas fa-store" style="font-size: 48px; margin-bottom: 20px; color: #cbd5e1;"></i>
                    <p>No tienes proveedores vinculados actualmente.</p>
                    <p>Explora nuevos proveedores para establecer relaciones comerciales.</p>
                    <a href="explorarProveedores.php" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">
                        Explorar Proveedores
                    </a>
                </div>';
            } else {
                foreach ($proveedores as $proveedor) {
                    $iniciales = strtoupper(substr($proveedor['nombre'], 0, 2));
                    
                    echo '<div class="proveedor-card">
                        <div class="proveedor-card-header">
                            <div class="proveedor-avatar">';
                    if (!empty($proveedor['ruta_logo'])) {
                        echo '<img src="../../' . $proveedor['ruta_logo'] . '" alt="Logo ' . $proveedor['nombre'] . '">';
                    } else {
                        echo $iniciales;
                    }
                    echo '</div>
                            <div class="proveedor-details">
                                <h3 class="proveedor-name">' . $proveedor['nombre'] . '</h3>
                                <span class="tag tag-' . strtolower($proveedor['sector']) . '">' . $proveedor['sector'] . '</span>
                                <p class="proveedor-location"><i class="fas fa-map-marker-alt"></i> ' . $proveedor['ciudad'] . ', ' . $proveedor['pais'] . '</p>
                            </div>
                        </div>
                        <div class="proveedor-card-body">
                            <div class="card-row">
                                <span class="card-label">Contacto:</span>
                                <div class="card-value">
                                    <p><i class="fas fa-envelope"></i> ' . $proveedor['email'] . '</p>
                                    <p><i class="fas fa-phone"></i> ' . $proveedor['telefono'] . '</p>
                                </div>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Sitio web:</span>
                                <div class="card-value">
                                    <p><i class="fas fa-globe"></i> ' . ($proveedor['sitio_web'] ?: 'No disponible') . '</p>
                                </div>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Valoración:</span>
                                <div class="card-value rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                    <span>4.5</span>
                                </div>
                            </div>
                        </div>
                        <div class="proveedor-card-footer">
                            <button class="btn-action btn-view" title="Ver perfil" data-id="' . $proveedor['id'] . '">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action btn-order" title="Realizar pedido" data-id="' . $proveedor['id'] . '">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            <button class="btn-action btn-chat" title="Enviar mensaje" data-id="' . $proveedor['id'] . '">
                                <i class="fas fa-comment-alt"></i>
                            </button>
                            <button class="btn-action btn-remove" title="Eliminar proveedor" data-id="' . $proveedor['relacion_id'] . '">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>';
                }
            }
            ?>
        </div>

        <!-- Paginación (solo aparece si hay proveedores) -->
        <?php if (!empty($proveedores)): ?>
        <div class="pagination">
            <button class="page-btn disabled"><i class="fas fa-chevron-left"></i></button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
        <?php endif; ?>
    </div>

    <!-- Modal para ver detalle del proveedor -->
    <div id="modal-perfil" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalle del Proveedor</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <!-- El contenido del modal se cargará dinámicamente por JavaScript -->
                <div id="perfil-contenido">
                    <div class="loading-spinner">Cargando información del proveedor...</div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-close">Cerrar</button>
                <button class="btn btn-primary btn-realizar-pedido">Realizar pedido</button>
            </div>
        </div>
    </div>

    <!-- Modal de confirmación para eliminar proveedor -->
    <div id="modal-confirmar" class="modal">
        <div class="modal-content modal-sm">
            <div class="modal-header">
                <h2>Confirmar eliminación</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p>¿Estás seguro de que deseas eliminar a este proveedor de tu lista?</p>
                <p>Esta acción no puede deshacerse.</p>
                <input type="hidden" id="relacion-id-eliminar" value="">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-close">Cancelar</button>
                <button class="btn btn-danger" id="btn-confirmar-eliminar">Eliminar</button>
            </div>
        </div>
    </div>

    <script src="../../public/js/menuLateral.js"></script>
    <script>
        // Script básico para manejar la interacción
        document.addEventListener('DOMContentLoaded', function() {
            // Búsqueda en tiempo real
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase().trim();
                    
                    // Filtrar en la vista de tabla
                    const proveedorRows = document.querySelectorAll('.proveedor-row');
                    proveedorRows.forEach(row => {
                        const nombreProveedor = row.querySelector('.proveedor-name').textContent.toLowerCase();
                        const sectorProveedor = row.querySelector('.tag').textContent.toLowerCase();
                        
                        if (nombreProveedor.includes(searchTerm) || sectorProveedor.includes(searchTerm)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                    
                    // Filtrar en la vista de tarjetas
                    const proveedorCards = document.querySelectorAll('.proveedor-card');
                    proveedorCards.forEach(card => {
                        const nombreProveedor = card.querySelector('.proveedor-name').textContent.toLowerCase();
                        const sectorProveedor = card.querySelector('.tag').textContent.toLowerCase();
                        
                        if (nombreProveedor.includes(searchTerm) || sectorProveedor.includes(searchTerm)) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }
            
            // Filtro por sector
            const sectorFilter = document.getElementById('filter-sector');
            if (sectorFilter) {
                sectorFilter.addEventListener('change', function() {
                    const selectedSector = this.value.toLowerCase();
                    
                    // Filtrar en la vista de tabla
                    const proveedorRows = document.querySelectorAll('.proveedor-row');
                    proveedorRows.forEach(row => {
                        const sectorTag = row.querySelector('.tag');
                        const sectorClase = Array.from(sectorTag.classList)
                            .find(cls => cls.startsWith('tag-'));
                        const sectorProveedor = sectorClase ? sectorClase.replace('tag-', '') : '';
                        
                        if (!selectedSector || sectorProveedor === selectedSector) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                    
                    // Filtrar en la vista de tarjetas
                    const proveedorCards = document.querySelectorAll('.proveedor-card');
                    proveedorCards.forEach(card => {
                        const sectorTag = card.querySelector('.tag');
                        const sectorClase = Array.from(sectorTag.classList)
                            .find(cls => cls.startsWith('tag-'));
                        const sectorProveedor = sectorClase ? sectorClase.replace('tag-', '') : '';
                        
                        if (!selectedSector || sectorProveedor === selectedSector) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }
            
            // Mostrar modal de perfil
            const viewButtons = document.querySelectorAll('.btn-view');
            const modalPerfil = document.getElementById('modal-perfil');
            
            viewButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const proveedorId = this.getAttribute('data-id');
                    
                    // En una implementación real, aquí cargaríamos los datos del proveedor
                    // mediante una petición AJAX
                    // Por ahora simulamos con datos estáticos
                    
                    // Mostrar el modal
                    modalPerfil.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
                });
            });
            
            // Mostrar modal de confirmación para eliminar
            const removeButtons = document.querySelectorAll('.btn-remove');
            const modalConfirmar = document.getElementById('modal-confirmar');
            const inputRelacionId = document.getElementById('relacion-id-eliminar');
            
            removeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const relacionId = this.getAttribute('data-id');
                    inputRelacionId.value = relacionId;
                    
                    modalConfirmar.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });
            
            // Eliminar proveedor al confirmar
            const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
            if (btnConfirmarEliminar) {
                btnConfirmarEliminar.addEventListener('click', function() {
                    const relacionId = inputRelacionId.value;
                    
                    // En una implementación real, aquí enviaríamos una petición AJAX
                    // para eliminar la relación
                    console.log('Eliminando relación:', relacionId);
                    
                    // Cerrar modal y actualizar la página
                    modalConfirmar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    
                    // Recargar la página para reflejar el cambio
                    // En producción es mejor actualizar solo el DOM
                    window.location.reload();
                });
            }
            
            // Cerrar modales
            const closeButtons = document.querySelectorAll('.modal-close');
            
            closeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const modal = this.closest('.modal');
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            });
            
            // Cerrar modal al hacer clic fuera
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    e.target.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });
    </script>
</body>
</html>