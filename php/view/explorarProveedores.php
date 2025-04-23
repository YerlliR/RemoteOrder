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
    <title>Explorar Proveedores - RemoteOrder</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../public/styles/panelPrincipal.css">
    <link rel="stylesheet" href="../../public/styles/exploradorProveedores.css">
</head>
<body>
    <?php include_once 'elements/menuLateral.php'; ?>
    
    <div class="marketplace-container">
        <!-- Hero section -->
        <div class="marketplace-hero">
            <div class="hero-content">
                <h1>Descubre proveedores de confianza</h1>
                <p>Conecta con los mejores proveedores para impulsar tu negocio</p>
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="hero-search" placeholder="Busca proveedores por nombre, sector o producto...">
                    <button class="search-button">Buscar</button>
                </div>
            </div>
        </div>

        <!-- Categorías principales -->
        <div class="categories-section">
            <h2>Explora por categoría</h2>
            <div class="categories-grid">
                <div class="category-card" data-category="tecnologia">
                    <div class="category-icon">
                        <i class="fas fa-microchip"></i>
                    </div>
                    <h3>Tecnología</h3>
                    <span class="provider-count">24 proveedores</span>
                </div>
                <div class="category-card" data-category="finanzas">
                    <div class="category-icon">
                        <i class="fas fa-piggy-bank"></i>
                    </div>
                    <h3>Finanzas</h3>
                    <span class="provider-count">18 proveedores</span>
                </div>
                <div class="category-card" data-category="marketing">
                    <div class="category-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    <h3>Marketing</h3>
                    <span class="provider-count">15 proveedores</span>
                </div>
                <div class="category-card" data-category="salud">
                    <div class="category-icon">
                        <i class="fas fa-medkit"></i>
                    </div>
                    <h3>Salud</h3>
                    <span class="provider-count">21 proveedores</span>
                </div>
                <div class="category-card" data-category="educacion">
                    <div class="category-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h3>Educación</h3>
                    <span class="provider-count">19 proveedores</span>
                </div>
                <div class="category-card" data-category="turismo">
                    <div class="category-icon">
                        <i class="fas fa-passport"></i>
                    </div>
                    <h3>Turismo</h3>
                    <span class="provider-count">26 proveedores</span>
                </div>
                <div class="category-card" data-category="inmobiliario">
                    <div class="category-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3>Inmobiliario</h3>
                    <span class="provider-count">18 proveedores</span>
                </div>
                <div class="category-card" data-category="industrial">
                    <div class="category-icon">
                        <i class="fas fa-industry"></i>
                    </div>
                    <h3>Industrial</h3>
                    <span class="provider-count">15 proveedores</span>
                </div>
                <div class="category-card" data-category="alimenticio">
                    <div class="category-icon">
                        <i class="fas fa-concierge-bell"></i>
                    </div>
                    <h3>Alimenticio</h3>
                    <span class="provider-count">26 proveedores</span>
                </div>
                <div class="category-card" data-category="comercio">
                    <div class="category-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h3>Comercio</h3>
                    <span class="provider-count">21 proveedores</span>
                </div>
                <div class="category-card" data-category="agricola">
                    <div class="category-icon">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <h3>Agrícola</h3>
                    <span class="provider-count">19 proveedores</span>
                </div>

                <div class="category-card" data-category="energia">
                    <div class="category-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3>Energía</h3>
                    <span class="provider-count">18 proveedores</span>
                </div>
                <div class="category-card" data-category="transporte">
                    <div class="category-icon">
                        <i class="fas fa-truck"></i>
                    </div>
                    <h3>Transporte</h3>
                    <span class="provider-count">15 proveedores</span>
                </div>
                <div class="category-card" data-category="otros">
                    <div class="category-icon">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <h3>Otros</h3>
                    <span class="provider-count">26 proveedores</span>
                </div>
            </div>
        </div>
        

        <!-- Sección de filtros y proveedores -->
        <div class="marketplace-content">
            <!-- Panel lateral de filtros -->
            <div class="filters-sidebar">
                <div class="filters-header">
                    <h3>Filtros</h3>
                    <button id="reset-filters" class="btn-reset">Restablecer</button>
                </div>
                
                <div class="filter-group">
                    <h4>Ubicación</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" name="location" value="madrid"> Madrid
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="location" value="barcelona"> Barcelona
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="location" value="valencia"> Valencia
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="location" value="sevilla"> Sevilla
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="location" value="bilbao"> Bilbao
                        </label>
                    </div>
                </div>
                
                <div class="filter-group">
                    <h4>Valoración</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="radio" name="rating" value="5"> 
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="rating" value="4"> 
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                                <span>y superior</span>
                            </div>
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="rating" value="3"> 
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <span>y superior</span>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="filter-group">
                    <h4>Años de experiencia</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" name="experience" value="1-3"> 1-3 años
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="experience" value="4-7"> 4-7 años
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="experience" value="8+"> 8+ años
                        </label>
                    </div>
                </div>
                
                <div class="filter-group">
                    <h4>Servicios adicionales</h4>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" name="services" value="delivery"> Entrega en 24h
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="services" value="installation"> Instalación
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="services" value="support"> Soporte técnico
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="services" value="warranty"> Garantía extendida
                        </label>
                    </div>
                </div>
            </div>
            
            <!-- Proveedores -->
            <div class="providers-section">
                <div class="providers-header">
                    <div class="results-info">
                        <h2>Proveedores <span id="category-title"></span></h2>
                        <p>Mostrando <span id="results-count">25</span> resultados</p>
                    </div>
                    <div class="providers-actions">
                        <div class="view-toggle">
                            <button class="toggle-btn active" data-view="grid"><i class="fas fa-th-large"></i></button>
                            <button class="toggle-btn" data-view="list"><i class="fas fa-list"></i></button>
                        </div>
                        <select class="sort-select" id="sort-providers">
                            <option value="relevance">Relevancia</option>
                            <option value="rating-desc">Mejor valorados</option>
                            <option value="name-asc">Nombre (A-Z)</option>
                            <option value="name-desc">Nombre (Z-A)</option>
                        </select>
                    </div>
                </div>
                
                <!-- Vista de cuadrícula (por defecto) -->
                <div class="providers-grid active-view" id="grid-view">
                    <?php
                        include_once "../dao/EmpresaDao.php"; 
                        include_once "../model/Empresa.php";
                        $empresas = findAllEmpresas();

                       

                        foreach($empresas as $empresa){
                            echo '
                            <div class="provider-card" data-id="'.$empresa->getId().'">
                                <div class="provider-favorite">
                                    <button class="btn-favorite"><i class="far fa-heart"></i></button>
                                </div>
                                <div class="provider-header">
                                    <div class="provider-logo"><img src="../../'.$empresa->getRutaLogo().'" alt="Logo de la empresa '.$empresa->getNombre().'" class="provider-logo"></div>
                                    <div style="margin-right: 2.3rem;" class="provider-rating">
                                        <div class="stars">
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star-half-alt"></i>
                                        </div>
                                        <span>4.5</span>
                                    </div>
                                </div>
                                <div class="provider-body">
                                    <h3>'.$empresa->getNombre().'</h3>
                                    <div class="provider-location">
                                        <i class="fas fa-map-marker-alt"> </i> '.$empresa->getCiudad().', '.$empresa->getPais().'
                                    </div>
                                    <div class="provider-tags">
                                        <span class="tag tag-tecnologia">' . $empresa->getSector() . '</span>
                                    </div>
                                    <p class="provider-description">' . substr($empresa->getDescripcion(), 0, 110) . (strlen($empresa->getDescripcion()) > 200 ? '...' : '') . '</p>
                                </div>
                                <div class="provider-footer">
                                    <button class="btn-view-profile">Ver perfil</button>
                                    <button class="btn-contact">Contactar</button>
                                </div>
                            </div>
                        
                        ';
                        }
                    
                    ?>
                    
                </div>
                
                <!-- Paginación -->
                <div class="pagination">
                    <button class="page-btn disabled"><i class="fas fa-chevron-left"></i></button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">4</button>
                    <button class="page-btn">5</button>
                    <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal de Perfil del Proveedor -->
    <div class="modal" id="modal-perfil">
        <div class="modal-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            
            <div class="profile-header">
                <div class="profile-cover"></div>
                <div class="profile-main">
                    <div class="profile-logo">TS</div>
                    <div class="profile-info">
                        <h2 id="perfil-nombre">TechSupplies S.L.</h2>
                        <div class="profile-meta">
                            <span class="profile-location"><i class="fas fa-map-marker-alt"></i> Madrid, España</span>
                            <span class="profile-category"><i class="fas fa-tag"></i> Tecnología</span>
                            <span class="profile-since"><i class="fas fa-calendar-alt"></i> Desde 2015</span>
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
                            <span class="rating-count">(28 valoraciones)</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="profile-tabs">
                <button class="tab-btn active" data-tab="info">Información</button>
                <button class="tab-btn" data-tab="products">Productos</button>
                <button class="tab-btn" data-tab="reviews">Valoraciones</button>
                <button class="tab-btn" data-tab="contact">Contacto</button>
            </div>
            
            <div class="profile-content">
                <!-- Tab: Información -->
                <div class="tab-content active" id="tab-info">
                    <div class="profile-section">
                        <h3>Acerca de</h3>
                        <p>TechSupplies S.L. es una empresa líder en la distribución de componentes electrónicos y tecnológicos. Contamos con más de 8 años de experiencia en el sector y una amplia red de socios internacionales que nos permiten ofrecer los mejores productos a precios competitivos.</p>
                        <p>Nos especializamos en semiconductores, placas base, componentes pasivos, y todo tipo de materiales para la fabricación de dispositivos electrónicos.</p>
                    </div>
                    
                    <div class="profile-section">
                        <h3>Servicios</h3>
                        <div class="services-tags">
                            <div class="service-tag">Semiconductores</div>
                            <div class="service-tag">Placas base</div>
                            <div class="service-tag">Componentes pasivos</div>
                            <div class="service-tag">Herramientas de montaje</div>
                            <div class="service-tag">Kits de desarrollo</div>
                            <div class="service-tag">Asesoría técnica</div>
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3>Clientes destacados</h3>
                        <div class="clients-grid">
                            <div class="client-logo">EC</div>
                            <div class="client-logo">IN</div>
                            <div class="client-logo">DT</div>
                            <div class="client-logo">TL</div>
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3>Certificaciones</h3>
                        <div class="certifications">
                            <div class="certification-item">
                                <i class="fas fa-certificate"></i>
                                <span>ISO 9001:2015</span>
                            </div>
                            <div class="certification-item">
                                <i class="fas fa-certificate"></i>
                                <span>ISO 14001:2015</span>
                            </div>
                            <div class="certification-item">
                                <i class="fas fa-certificate"></i>
                                <span>Distribuidor Autorizado</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tab: Productos -->
                <div class="tab-content" id="tab-products">
                    <div class="products-grid">
                        <div class="product-card">
                            <div class="product-image"></div>
                            <h3>Kit de desarrollo Arduino</h3>
                            <p>Kit completo con placa Arduino, sensores y componentes</p>
                            <span class="product-price">89.99€</span>
                        </div>
                        <div class="product-card">
                            <div class="product-image"></div>
                            <h3>Componentes pasivos</h3>
                            <p>Paquete de resistencias, condensadores y LEDs variados</p>
                            <span class="product-price">24.50€</span>
                        </div>
                        <div class="product-card">
                            <div class="product-image"></div>
                            <h3>Placa base industrial</h3>
                            <p>Placa base reforzada para entornos industriales</p>
                            <span class="product-price">149.95€</span>
                        </div>
                        <div class="product-card">
                            <div class="product-image"></div>
                            <h3>Set de herramientas</h3>
                            <p>Kit de herramientas de precisión para electrónica</p>
                            <span class="product-price">75.00€</span>
                        </div>
                    </div>
                </div>
                
                <!-- Tab: Valoraciones -->
                <div class="tab-content" id="tab-reviews">
                    <div class="reviews-summary">
                        <div class="review-average">
                            <span class="average-rating">4.5</span>
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                        </div>
                        <div class="rating-bars">
                            <div class="rating-bar-item">
                                <span class="rating-label">5</span>
                                <div class="rating-bar">
                                    <div class="bar-fill" style="width: 70%"></div>
                                </div>
                                <span class="rating-count">19</span>
                            </div>
                            <div class="rating-bar-item">
                                <span class="rating-label">4</span>
                                <div class="rating-bar">
                                    <div class="bar-fill" style="width: 20%"></div>
                                </div>
                                <span class="rating-count">6</span>
                            </div>
                            <div class="rating-bar-item">
                                <span class="rating-label">3</span>
                                <div class="rating-bar">
                                    <div class="bar-fill" style="width: 7%"></div>
                                </div>
                                <span class="rating-count">2</span>
                            </div>
                            <div class="rating-bar-item">
                                <span class="rating-label">2</span>
                                <div class="rating-bar">
                                    <div class="bar-fill" style="width: 3%"></div>
                                </div>
                                <span class="rating-count">1</span>
                            </div>
                            <div class="rating-bar-item">
                                <span class="rating-label">1</span>
                                <div class="rating-bar">
                                    <div class="bar-fill" style="width: 0%"></div>
                                </div>
                                <span class="rating-count">0</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="reviews-list">
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-logo">ED</div>
                                    <div class="reviewer-details">
                                        <h4>Empresa Digital S.A.</h4>
                                        <span class="review-date">15 abril, 2025</span>
                                    </div>
                                </div>
                                <div class="review-rating">
                                    <div class="stars">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                    </div>
                                    <span>5.0</span>
                                </div>
                            </div>
                            <div class="review-content">
                                <p>Excelente proveedor, siempre tienen stock de los componentes que necesitamos y los envíos llegan antes de lo esperado. La calidad de sus productos es inmejorable y su servicio de atención al cliente es excepcional.</p>
                            </div>
                        </div>
                        
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-logo">EM</div>
                                    <div class="reviewer-details">
                                        <h4>Electrónica Moderna</h4>
                                        <span class="review-date">2 marzo, 2025</span>
                                    </div>
                                </div>
                                <div class="review-rating">
                                    <div class="stars">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="far fa-star"></i>
                                    </div>
                                    <span>4.0</span>
                                </div>
                            </div>
                            <div class="review-content">
                                <p>Buenos productos y servicio rápido. El único inconveniente es que a veces los precios son algo elevados comparados con otros proveedores, pero la calidad compensa. Recomendamos sus kits de desarrollo.</p>
                            </div>
                        </div>
                        
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-logo">ST</div>
                                    <div class="reviewer-details">
                                        <h4>Smart Technologies</h4>
                                        <span class="review-date">18 febrero, 2025</span>
                                    </div>
                                </div>
                                <div class="review-rating">
                                    <div class="stars">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star-half-alt"></i>
                                    </div>
                                    <span>4.5</span>
                                </div>
                            </div>
                            <div class="review-content">
                                <p>Hemos trabajado con TechSupplies en varios proyectos y siempre han respondido con profesionalidad. Su catálogo de semiconductores es muy completo y su asesoramiento técnico nos ha sido de gran ayuda.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
    <script src="../../public/js/menuLateral.js"></script>
    <script src="../../public/js/exploradorProveedores.js"></script>
</body>
</html>