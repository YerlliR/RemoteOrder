<?php
    session_start();
    // Aquí iría la lógica para cargar las empresas disponibles
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RemoteOrder - Explorador de Empresas</title>
    <link rel="stylesheet" href="../../public/styles/base.css">
    <link rel="stylesheet" href="../../public/styles/menuLateral.css">
    <link rel="stylesheet" href="../../public/styles/clientes.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    <!-- Formas flotantes decorativas -->
    <div class="floating-shape shape1"></div>
    <div class="floating-shape shape2"></div>

    <!-- Sidebar / Menú lateral -->
    <?php include 'elements/menuLateral.php'; ?>

    <!-- Contenido principal - Explorador de Empresas -->
    <div class="empresas-container">
        <div class="empresas-header">
            <h1 class="empresas-title">Explorador de Empresas</h1>
            <div class="empresas-actions">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="Buscar empresas...">
                </div>
                <button class="btn-view-favorites" id="btn-mis-favoritos">
                    <i class="fas fa-star"></i>
                    Mis Favoritos
                </button>
                <button class="btn-view-favorites" id="btn-mis-solicitudes">
                    <i class="fas fa-envelope" style="color: #ffffff;"></i>
                    Mis Solicitudes
                </button>
            </div>
        </div>

        <div class="filters-container">
            <select class="filter-select" id="filter-sector">
                <option value="">Todos los sectores</option>
                <option value="tecnologia">Tecnología</option>
                <option value="servicios">Servicios Profesionales</option>
                <option value="comercio">Comercio</option>
                <option value="industria">Industria</option>
            </select>
            <select class="filter-select" id="filter-rating">
                <option value="">Todas las valoraciones</option>
                <option value="5">5 estrellas</option>
                <option value="4">4+ estrellas</option>
                <option value="3">3+ estrellas</option>
            </select>
            <select class="filter-select" id="filter-sort">
                <option value="">Ordenar por</option>
                <option value="popular">Más populares</option>
                <option value="reciente">Más recientes</option>
                <option value="valoracion">Mejor valorados</option>
            </select>
        </div>

        <!-- Vista de tabla para escritorio -->
        <div class="empresas-table-container">
            <table class="empresas-table">
                <thead>
                    <tr>
                        <th>
                            <div class="th-content">
                                Empresa <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>
                            <div class="th-content">
                                Contacto <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>
                            <div class="th-content">
                                Sector <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>
                            <div class="th-content">
                                Valoración <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="empresa-info">
                                <div class="empresa-avatar">EG</div>
                                <div class="empresa-details">
                                    <div class="empresa-name">Empresa Global S.L.</div>
                                    <div class="empresa-description">Servicios tecnológicos integrales</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="empresa-contact">
                                <div>contacto@empresaglobal.com</div>
                                <div>+34 612 345 678</div>
                            </div>
                        </td>
                        <td><span class="tag tag-tecnologia">Tecnología</span></td>
                        <td>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>4.5</span>
                            </div>
                        </td>
                        <td>
                            <div class="actions-container">
                                <button class="btn-action btn-view" title="Ver perfil">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-favorite" title="Añadir a favoritos">
                                    <i class="far fa-star"></i>
                                </button>
                            </div>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

        <!-- Vista de tarjetas para móvil -->
        <div class="empresas-cards">
            <!-- Empresa 1 -->
            <div class="empresa-card" data-id="1">
                <div class="empresa-card-header">
                    <div class="empresa-info">
                        <div class="empresa-avatar">EG</div>
                        <div class="empresa-details">
                            <div class="empresa-name">Empresa Global S.L.</div>
                            <div class="empresa-description">Servicios tecnológicos integrales</div>
                        </div>
                    </div>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>4.5</span>
                    </div>
                </div>
                <div class="empresa-card-body">
                    <div class="info-row">
                        <div class="info-label">Email:</div>
                        <div class="info-value">contacto@empresaglobal.com</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Teléfono:</div>
                        <div class="info-value">+34 612 345 678</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Sector:</div>
                        <div class="info-value"><span class="tag tag-tecnologia">Tecnología</span></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Servicios:</div>
                        <div class="info-value">Desarrollo web, Consultoría IT, Cloud</div>
                    </div>
                </div>
                <div class="empresa-card-footer">
                    <button class="btn-action btn-view" title="Ver perfil">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-contact" title="Solicitar servicio">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn-action btn-favorite" title="Añadir a favoritos">
                        <i class="far fa-star"></i>
                    </button>
                </div>
            </div>

            <!-- Empresa 2 -->
            <div class="empresa-card" data-id="2">
                <div class="empresa-card-header">
                    <div class="empresa-info">
                        <div class="empresa-avatar">TP</div>
                        <div class="empresa-details">
                            <div class="empresa-name">Tecnologías Profesionales</div>
                            <div class="empresa-description">Desarrollo de software a medida</div>
                        </div>
                    </div>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <span>5.0</span>
                    </div>
                </div>
                <div class="empresa-card-body">
                    <div class="info-row">
                        <div class="info-label">Email:</div>
                        <div class="info-value">info@tecnopro.com</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Teléfono:</div>
                        <div class="info-value">+34 623 456 789</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Sector:</div>
                        <div class="info-value"><span class="tag tag-tecnologia">Tecnología</span></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Servicios:</div>
                        <div class="info-value">Desarrollo de software, Apps móviles</div>
                    </div>
                </div>
                <div class="empresa-card-footer">
                    <button class="btn-action btn-view" title="Ver perfil">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-contact" title="Solicitar servicio">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <button class="btn-action btn-favorite" title="Añadir a favoritos">
                        <i class="far fa-star"></i>
                    </button>
                </div>
            </div>
        </div>


    </div>

    <!-- Modal para ver perfil detallado -->
    <div id="modal-perfil" class="modal">
        <div class="modal-content modal-perfil-content">
            <div class="modal-header">
                <h2>Perfil de Empresa</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="perfil-header">
                    <div class="empresa-avatar perfil-avatar">EG</div>
                    <div class="perfil-info">
                        <h3 id="perfil-nombre">Empresa Global S.L.</h3>
                        <div class="perfil-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                            <span>4.5</span> (127 opiniones)
                        </div>
                        <div class="perfil-metadata">
                            <span class="tag tag-tecnologia">Tecnología</span>
                            <span class="metadata-item"><i class="fas fa-map-marker-alt"></i> Madrid, España</span>
                            <span class="metadata-item"><i class="fas fa-calendar-alt"></i> Desde 2015</span>
                        </div>
                    </div>
                </div>

                <div class="perfil-section">
                    <h4>Sobre la empresa</h4>
                    <p id="perfil-descripcion">Empresa Global S.L. es una empresa líder en servicios tecnológicos que ofrece soluciones integrales para negocios de todos los tamaños. Especializada en desarrollo web, consultoría IT y servicios cloud, con más de 8 años de experiencia en el sector.</p>
                </div>

                <div class="perfil-section">
                    <h4>Servicios</h4>
                    <div class="servicios-tags">
                        <span class="service-tag">Desarrollo Web</span>
                        <span class="service-tag">Consultoría IT</span>
                        <span class="service-tag">Cloud Computing</span>
                        <span class="service-tag">Seguridad Informática</span>
                        <span class="service-tag">Soporte Técnico</span>
                    </div>
                </div>

                <div class="perfil-section">
                    <h4>Contacto</h4>
                    <div class="contacto-info">
                        <div class="contacto-item">
                            <i class="fas fa-envelope"></i>
                            <span id="perfil-email">contacto@empresaglobal.com</span>
                        </div>
                        <div class="contacto-item">
                            <i class="fas fa-phone"></i>
                            <span id="perfil-telefono">+34 612 345 678</span>
                        </div>
                        <div class="contacto-item">
                            <i class="fas fa-globe"></i>
                            <span id="perfil-web">www.empresaglobal.com</span>
                        </div>
                    </div>
                </div>

                <div class="perfil-section">
                    <h4>Valoraciones recientes</h4>
                    <div class="valoraciones">
                        <div class="valoracion-item">
                            <div class="valoracion-header">
                                <div class="valoracion-autor">María L.</div>
                                <div class="valoracion-estrellas">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                            </div>
                            <div class="valoracion-fecha">Hace 2 semanas</div>
                            <div class="valoracion-texto">
                                Excelente servicio. El desarrollo web superó nuestras expectativas y el soporte posterior a la entrega ha sido impecable.
                            </div>
                        </div>
                        <div class="valoracion-item">
                            <div class="valoracion-header">
                                <div class="valoracion-autor">Carlos P.</div>
                                <div class="valoracion-estrellas">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="far fa-star"></i>
                                </div>
                            </div>
                            <div class="valoracion-fecha">Hace 1 mes</div>
                            <div class="valoracion-texto">
                                Muy satisfecho con la migración cloud que realizaron. Profesionales y eficientes.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary btn-solicitar-desde-perfil">Solicitar Servicio</button>
            </div>
        </div>
    </div>

    <script src="../../public/js/menuLateral.js"></script>
    <script src="../../public/js/clientes.js"></script>
</body>
</html>