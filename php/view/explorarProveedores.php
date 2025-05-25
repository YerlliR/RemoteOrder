<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['usuario'])) {
    header('Location: ../../index.php');
    exit;
}


include_once "../dao/EmpresaDao.php"; 
include_once "../model/Empresa.php";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explorar Proveedores - RemoteOrder</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../../public/styles/base.css">
    <link rel="stylesheet" href="../../public/styles/menuLateral.css">
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
                    <span class="provider-count"><?php echo contBySector("tecnologia");?> proveedores</span>
                </div>
                <div class="category-card" data-category="finanzas">
                    <div class="category-icon">
                        <i class="fas fa-piggy-bank"></i>
                    </div>
                    <h3>Finanzas</h3>
                    <span class="provider-count"><?php echo contBySector("finanzas");?> proveedores</span>
                </div>
                <div class="category-card" data-category="marketing">
                    <div class="category-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    <h3>Marketing</h3>
                    <span class="provider-count"><?php echo contBySector("marketing");?> proveedores</span>
                </div>
                <div class="category-card" data-category="salud">
                    <div class="category-icon">
                        <i class="fas fa-medkit"></i>
                    </div>
                    <h3>Salud</h3>
                    <span class="provider-count"><?php echo contBySector("salud");?> proveedores</span>
                </div>
                <div class="category-card" data-category="educacion">
                    <div class="category-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h3>Educación</h3>
                    <span class="provider-count"><?php echo contBySector("educacion");?> proveedores</span>
                </div>
                <div class="category-card" data-category="turismo">
                    <div class="category-icon">
                        <i class="fas fa-passport"></i>
                    </div>
                    <h3>Turismo</h3>
                    <span class="provider-count"><?php echo contBySector("turismo");?> proveedores</span>
                </div>
                <div class="category-card" data-category="inmobiliario">
                    <div class="category-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3>Inmobiliario</h3>
                    <span class="provider-count"><?php echo contBySector("inmobiliario");?> proveedores</span>
                </div>
                <div class="category-card" data-category="industrial">
                    <div class="category-icon">
                        <i class="fas fa-industry"></i>
                    </div>
                    <h3>Industrial</h3>
                    <span class="provider-count"><?php echo contBySector("industrial");?> proveedores</span>
                </div>
                <div class="category-card" data-category="alimenticio">
                    <div class="category-icon">
                        <i class="fas fa-concierge-bell"></i>
                    </div>
                    <h3>Alimenticio</h3>
                    <span class="provider-count"><?php echo contBySector("alimenticio");?> proveedores</span>
                </div>
                <div class="category-card" data-category="comercio">
                    <div class="category-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h3>Comercio</h3>
                    <span class="provider-count"><?php echo contBySector("comercio");?> proveedores</span>
                </div>
                <div class="category-card" data-category="agricola">
                    <div class="category-icon">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <h3>Agrícola</h3>
                    <span class="provider-count"><?php echo contBySector("agricola");?> proveedores</span>
                </div>
                <div class="category-card" data-category="energia">
                    <div class="category-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3>Energía</h3>
                    <span class="provider-count"><?php echo contBySector("energia");?> proveedores</span>
                </div>
                <div class="category-card" data-category="transporte">
                    <div class="category-icon">
                        <i class="fas fa-truck"></i>
                    </div>
                    <h3>Transporte</h3>
                    <span class="provider-count"><?php echo contBySector("transporte");?> proveedores</span>
                </div>
                <div class="category-card" data-category="otros">
                    <div class="category-icon">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <h3>Otros</h3>
                    <span class="provider-count"><?php echo contBySector("otros");?> proveedores</span>
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

                        $empresas = findAllEmpresas();

                        foreach($empresas as $empresa){
                            if($empresa->getId() != $_SESSION['empresa']['id']){
                                echo '
                                    <div class="provider-card" data-id="'.$empresa->getId().'">
                                        <div class="provider-favorite">
                                            <button class="btn-favorite "><i class="far fa-heart"></i></button>
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
                                                <span class="tag tag-'.strtolower($empresa->getSector()).'">' . $empresa->getSector() . '</span>
                                            </div>
                                            <p class="provider-description">'. (strlen($empresa->getDescripcion()) > 200 ? substr($empresa->getDescripcion(), 0, 200) . '...' : $empresa->getDescripcion()) . '</p>
                                        </div>
                                        <div class="provider-footer">
                                            <button class="btn-view-profile" data-empresa-id="'.$empresa->getId().'">Ver perfil</button>
                                            <button class="btn-contact" data-empresa-id="'.$empresa->getId().'">Contactar</button>
                                        </div>
                                    </div>
                                
                                ';
                            }
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
    
    <!-- Modal de Contacto -->
    <div class="modal" id="modal-contact">
        <div class="modal-content">
            <button class="modal-close"><i class="fas fa-times"></i></button>
            
            <div class="modal-header">
                <h2>Contactar con <span id="contact-provider-name">Proveedor</span></h2>
            </div>
            
            <div class="modal-body">
                <div class="contact-form">
                    <div class="form-group">
                        <label for="modal-contact-name">Nombre</label>
                        <input type="text" id="modal-contact-name" placeholder="Tu nombre completo">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-contact-subject">Asunto</label>
                        <input type="text" id="modal-contact-subject" placeholder="Asunto del mensaje">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-contact-message">Mensaje</label>
                        <textarea id="modal-contact-message" rows="5" placeholder="Escribe tu mensaje..."></textarea>
                    </div>
                    
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn-secondary" id="btn-cancel-contact">Cancelar</button>
                <button class="btn-primary" id="btn-send-modal-message">Enviar mensaje</button>
            </div>
        </div>
    </div>

    <script src="../../public/js/menuLateral.js"></script>
    <script src="../../public/js/exploradorProveedores.js"></script>


    <!-- Después de los scripts existentes, al final del archivo -->
    <script>
        // Almacenar datos de empresas para uso en JavaScript
        const empresasDatos = <?php 
            $empresasData = [];
            foreach(findAllEmpresas() as $e) {
                if($e->getId() != $_SESSION['empresa']['id']) {
                    $empresasData[$e->getId()] = [
                        'id' => $e->getId(),
                        'nombre' => $e->getNombre(),
                        'sector' => $e->getSector(),
                        'descripcion' => $e->getDescripcion(),
                        'ciudad' => $e->getCiudad(),
                        'pais' => $e->getPais(),
                        'email' => $e->getEmail(),
                        'telefono' => $e->getTelefono(),
                        'sitio_web' => $e->getSitioWeb()
                    ];
                }
            }
            echo json_encode($empresasData);
        ?>;
    </script>
        <?php include_once '../includes/footer_alerts.php'; ?>

</body>
</html>