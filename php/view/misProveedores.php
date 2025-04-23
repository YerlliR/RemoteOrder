<?php
session_start();
// Si no hay sesión activa, redirigir al login
if (!isset($_SESSION['usuario'])) {
    header('Location: ../../index.php');
    exit;
}
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
                <div class="header-cell">Último pedido</div>
                <div class="header-cell">Valoración</div>
                <div class="header-cell">Acciones</div>
            </div>

            <!-- Proveedor 1 -->
            <div class="proveedor-row">
                <div class="proveedor-cell proveedor-info">
                    <div class="proveedor-avatar">
                        <img src="../../uploads/logosEmpresas/placeholder.png" alt="Logo Proveedor">
                    </div>
                    <div class="proveedor-details">
                        <h3 class="proveedor-name">Suministros Globales S.L.</h3>
                        <p class="proveedor-location"><i class="fas fa-map-marker-alt"></i> Madrid, España</p>
                    </div>
                </div>
                <div class="proveedor-cell proveedor-sector">
                    <span class="tag tag-tecnologia">Tecnología</span>
                </div>
                <div class="proveedor-cell proveedor-contacto">
                    <p><i class="fas fa-envelope"></i> info@suministrosglobales.com</p>
                    <p><i class="fas fa-phone"></i> +34 912 456 789</p>
                </div>
                <div class="proveedor-cell proveedor-pedido">
                    <p class="pedido-fecha">15 Abril, 2025</p>
                    <p class="pedido-estado">
                        <span class="status status-completed">Completado</span>
                    </p>
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
                    <button class="btn-action btn-view" title="Ver perfil">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-order" title="Realizar pedido">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-action btn-chat" title="Enviar mensaje">
                        <i class="fas fa-comment-alt"></i>
                    </button>
                    <button class="btn-action btn-remove" title="Eliminar proveedor">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <!-- Proveedor 2 -->
            <div class="proveedor-row">
                <div class="proveedor-cell proveedor-info">
                    <div class="proveedor-avatar">
                        <img src="../../uploads/logosEmpresas/placeholder.png" alt="Logo Proveedor">
                    </div>
                    <div class="proveedor-details">
                        <h3 class="proveedor-name">Componentes Electrónicos Barcelona</h3>
                        <p class="proveedor-location"><i class="fas fa-map-marker-alt"></i> Barcelona, España</p>
                    </div>
                </div>
                <div class="proveedor-cell proveedor-sector">
                    <span class="tag tag-industria">Industria</span>
                </div>
                <div class="proveedor-cell proveedor-contacto">
                    <p><i class="fas fa-envelope"></i> ventas@componentesbcn.com</p>
                    <p><i class="fas fa-phone"></i> +34 933 789 456</p>
                </div>
                <div class="proveedor-cell proveedor-pedido">
                    <p class="pedido-fecha">8 Abril, 2025</p>
                    <p class="pedido-estado">
                        <span class="status status-processing">En proceso</span>
                    </p>
                </div>
                <div class="proveedor-cell proveedor-rating">
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <span>5.0</span>
                    </div>
                </div>
                <div class="proveedor-cell proveedor-acciones">
                    <button class="btn-action btn-view" title="Ver perfil">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-order" title="Realizar pedido">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-action btn-chat" title="Enviar mensaje">
                        <i class="fas fa-comment-alt"></i>
                    </button>
                    <button class="btn-action btn-remove" title="Eliminar proveedor">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <!-- Proveedor 3 -->
            <div class="proveedor-row">
                <div class="proveedor-cell proveedor-info">
                    <div class="proveedor-avatar">
                        <img src="../../uploads/logosEmpresas/placeholder.png" alt="Logo Proveedor">
                    </div>
                    <div class="proveedor-details">
                        <h3 class="proveedor-name">Distribuciones Alimentarias Valencia</h3>
                        <p class="proveedor-location"><i class="fas fa-map-marker-alt"></i> Valencia, España</p>
                    </div>
                </div>
                <div class="proveedor-cell proveedor-sector">
                    <span class="tag tag-alimentacion">Alimenticio</span>
                </div>
                <div class="proveedor-cell proveedor-contacto">
                    <p><i class="fas fa-envelope"></i> pedidos@distribuciones-av.com</p>
                    <p><i class="fas fa-phone"></i> +34 960 123 456</p>
                </div>
                <div class="proveedor-cell proveedor-pedido">
                    <p class="pedido-fecha">27 Marzo, 2025</p>
                    <p class="pedido-estado">
                        <span class="status status-completed">Completado</span>
                    </p>
                </div>
                <div class="proveedor-cell proveedor-rating">
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <span>4.0</span>
                    </div>
                </div>
                <div class="proveedor-cell proveedor-acciones">
                    <button class="btn-action btn-view" title="Ver perfil">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-order" title="Realizar pedido">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-action btn-chat" title="Enviar mensaje">
                        <i class="fas fa-comment-alt"></i>
                    </button>
                    <button class="btn-action btn-remove" title="Eliminar proveedor">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <!-- Proveedor 4 -->
            <div class="proveedor-row">
                <div class="proveedor-cell proveedor-info">
                    <div class="proveedor-avatar">
                        <img src="../../uploads/logosEmpresas/placeholder.png" alt="Logo Proveedor">
                    </div>
                    <div class="proveedor-details">
                        <h3 class="proveedor-name">Consultores Financieros Madrid</h3>
                        <p class="proveedor-location"><i class="fas fa-map-marker-alt"></i> Madrid, España</p>
                    </div>
                </div>
                <div class="proveedor-cell proveedor-sector">
                    <span class="tag tag-servicios">Servicios</span>
                </div>
                <div class="proveedor-cell proveedor-contacto">
                    <p><i class="fas fa-envelope"></i> contacto@consultores-fm.com</p>
                    <p><i class="fas fa-phone"></i> +34 914 789 321</p>
                </div>
                <div class="proveedor-cell proveedor-pedido">
                    <p class="pedido-fecha">20 Marzo, 2025</p>
                    <p class="pedido-estado">
                        <span class="status status-cancelled">Cancelado</span>
                    </p>
                </div>
                <div class="proveedor-cell proveedor-rating">
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <span>3.0</span>
                    </div>
                </div>
                <div class="proveedor-cell proveedor-acciones">
                    <button class="btn-action btn-view" title="Ver perfil">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-order" title="Realizar pedido">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-action btn-chat" title="Enviar mensaje">
                        <i class="fas fa-comment-alt"></i>
                    </button>
                    <button class="btn-action btn-remove" title="Eliminar proveedor">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Vista móvil - Tarjetas de proveedores -->
        <div class="proveedores-cards">
            <!-- Proveedor 1 -->
            <div class="proveedor-card">
                <div class="proveedor-card-header">
                    <div class="proveedor-avatar">
                        <img src="../../uploads/logosEmpresas/placeholder.png" alt="Logo Proveedor">
                    </div>
                    <div class="proveedor-details">
                        <h3 class="proveedor-name">Suministros Globales S.L.</h3>
                        <span class="tag tag-tecnologia">Tecnología</span>
                        <p class="proveedor-location"><i class="fas fa-map-marker-alt"></i> Madrid, España</p>
                    </div>
                </div>
                <div class="proveedor-card-body">
                    <div class="card-row">
                        <span class="card-label">Contacto:</span>
                        <div class="card-value">
                            <p><i class="fas fa-envelope"></i> info@suministrosglobales.com</p>
                            <p><i class="fas fa-phone"></i> +34 912 456 789</p>
                        </div>
                    </div>
                    <div class="card-row">
                        <span class="card-label">Último pedido:</span>
                        <div class="card-value">
                            <p>15 Abril, 2025</p>
                            <p><span class="status status-completed">Completado</span></p>
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
                    <button class="btn-action btn-view" title="Ver perfil">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-order" title="Realizar pedido">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-action btn-chat" title="Enviar mensaje">
                        <i class="fas fa-comment-alt"></i>
                    </button>
                    <button class="btn-action btn-remove" title="Eliminar proveedor">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <!-- Proveedor 2 -->
            <div class="proveedor-card">
                <div class="proveedor-card-header">
                    <div class="proveedor-avatar">
                        <img src="../../uploads/logosEmpresas/placeholder.png" alt="Logo Proveedor">
                    </div>
                    <div class="proveedor-details">
                        <h3 class="proveedor-name">Componentes Electrónicos Barcelona</h3>
                        <span class="tag tag-industria">Industria</span>
                        <p class="proveedor-location"><i class="fas fa-map-marker-alt"></i> Barcelona, España</p>
                    </div>
                </div>
                <div class="proveedor-card-body">
                    <div class="card-row">
                        <span class="card-label">Contacto:</span>
                        <div class="card-value">
                            <p><i class="fas fa-envelope"></i> ventas@componentesbcn.com</p>
                            <p><i class="fas fa-phone"></i> +34 933 789 456</p>
                        </div>
                    </div>
                    <div class="card-row">
                        <span class="card-label">Último pedido:</span>
                        <div class="card-value">
                            <p>8 Abril, 2025</p>
                            <p><span class="status status-processing">En proceso</span></p>
                        </div>
                    </div>
                    <div class="card-row">
                        <span class="card-label">Valoración:</span>
                        <div class="card-value rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <span>5.0</span>
                        </div>
                    </div>
                </div>
                <div class="proveedor-card-footer">
                    <button class="btn-action btn-view" title="Ver perfil">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-order" title="Realizar pedido">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-action btn-chat" title="Enviar mensaje">
                        <i class="fas fa-comment-alt"></i>
                    </button>
                    <button class="btn-action btn-remove" title="Eliminar proveedor">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Paginación -->
        <div class="pagination">
            <button class="page-btn disabled"><i class="fas fa-chevron-left"></i></button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
    </div>

    <!-- Modal para ver detalle del proveedor -->
    <div id="modal-perfil" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalle del Proveedor</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <!-- Contenido del modal... -->
                <div class="perfil-header">
                    <div class="perfil-avatar">
                        <img src="../../uploads/logosEmpresas/placeholder.png" alt="Logo Proveedor">
                    </div>
                    <div class="perfil-info">
                        <h3>Suministros Globales S.L.</h3>
                        <div class="perfil-meta">
                            <span><i class="fas fa-map-marker-alt"></i> Madrid, España</span>
                            <span><i class="fas fa-tag"></i> Tecnología</span>
                            <span><i class="fas fa-calendar"></i> Desde 2018</span>
                        </div>
                        <div class="perfil-rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>4.5</span>
                            </div>
                            <span>(16 valoraciones)</span>
                        </div>
                    </div>
                </div>

                <div class="perfil-section">
                    <h4>Descripción</h4>
                    <p>Suministros Globales S.L. es una empresa líder en la distribución de componentes electrónicos y equipos informáticos para empresas. Con más de 7 años de experiencia en el sector, ofrecemos soluciones completas adaptadas a las necesidades específicas de cada cliente.</p>
                </div>

                <div class="perfil-section">
                    <h4>Información de contacto</h4>
                    <div class="contacto-info">
                        <div class="contacto-item">
                            <div class="contacto-icon"><i class="fas fa-envelope"></i></div>
                            <div class="contacto-text">info@suministrosglobales.com</div>
                        </div>
                        <div class="contacto-item">
                            <div class="contacto-icon"><i class="fas fa-phone"></i></div>
                            <div class="contacto-text">+34 912 456 789</div>
                        </div>
                        <div class="contacto-item">
                            <div class="contacto-icon"><i class="fas fa-globe"></i></div>
                            <div class="contacto-text">www.suministrosglobales.com</div>
                        </div>
                        <div class="contacto-item">
                            <div class="contacto-icon"><i class="fas fa-clock"></i></div>
                            <div class="contacto-text">Lun-Vie: 9:00 - 18:00</div>
                        </div>
                    </div>
                </div>

                <div class="perfil-section">
                    <h4>Historial de pedidos</h4>
                    <div class="historial-pedidos">
                        <div class="pedido-item">
                            <div class="pedido-fecha">15 Abril, 2025</div>
                            <div class="pedido-id">#PED-2025-042</div>
                            <div class="pedido-monto">1,250.00 €</div>
                            <div class="pedido-estado"><span class="status status-completed">Completado</span></div>
                        </div>
                        <div class="pedido-item">
                            <div class="pedido-fecha">2 Marzo, 2025</div>
                            <div class="pedido-id">#PED-2025-028</div>
                            <div class="pedido-monto">875.50 €</div>
                            <div class="pedido-estado"><span class="status status-completed">Completado</span></div>
                        </div>
                        <div class="pedido-item">
                            <div class="pedido-fecha">15 Febrero, 2025</div>
                            <div class="pedido-id">#PED-2025-015</div>
                            <div class="pedido-monto">2,340.75 €</div>
                            <div class="pedido-estado"><span class="status status-completed">Completado</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-close">Cerrar</button>
                <button class="btn btn-primary">Realizar pedido</button>
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
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-close">Cancelar</button>
                <button class="btn btn-danger">Eliminar</button>
            </div>
        </div>
    </div>

    <script src="../../public/js/menuLateral.js"></script>
    <script>
        // Script básico para manejar la interacción
        document.addEventListener('DOMContentLoaded', function() {
            // Mostrar modal de perfil
            const viewButtons = document.querySelectorAll('.btn-view');
            const modalPerfil = document.getElementById('modal-perfil');
            
            viewButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    modalPerfil.classList.add('active');
                });
            });
            
            // Mostrar modal de confirmación para eliminar
            const removeButtons = document.querySelectorAll('.btn-remove');
            const modalConfirmar = document.getElementById('modal-confirmar');
            
            removeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    modalConfirmar.classList.add('active');
                });
            });
            
            // Cerrar modales
            const closeButtons = document.querySelectorAll('.modal-close');
            
            closeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const modal = this.closest('.modal');
                    modal.classList.remove('active');
                });
            });
            
            // Cerrar modal al hacer clic fuera
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    e.target.classList.remove('active');
                }
            });
        });
    </script>
</body>
</html>