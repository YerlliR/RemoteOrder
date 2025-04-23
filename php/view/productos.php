<?php

    session_start();
    include_once '../dao/CategoriaDao.php';
    include_once '../model/Empresa.php';
    include_once '../dao/ProductoDao.php';
    include_once '../model/Producto.php';
    include_once '../dao/CategoriaDao.php';

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RemoteOrder - Productos</title>
    <link rel="stylesheet" href="../../public/styles/base.css">
    <link rel="stylesheet" href="../../public/styles/menuLateral.css">
    <link rel="stylesheet" href="../../public/styles/productos.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    <!-- Formas flotantes decorativas -->
    <div class="floating-shape shape1"></div>
    <div class="floating-shape shape2"></div>

    <!-- Sidebar / Menú lateral -->
    <?php include 'elements/menuLateral.php'; ?>

    <!-- Contenido principal - Productos -->
    <div class="productos-container">
        <div class="productos-header">
            <h1 class="productos-title">Catálogo de Productos</h1>
            <div class="productos-actions">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="Buscar productos...">
                </div>
                <button class="btn-add-producto" onclick="window.location.href='../../php/view/creacionProducto.php'">
                    <i class="fas fa-plus"></i>
                    Nuevo Producto
                </button>
                <button class="btn-add-producto btn-categorias">
                    <i class="fas fa-plus"></i>
                    Nueva Categoria
                </button>
            </div>
        </div>

        <!-- <div class="filters-container">
            <select class="filter-select">
                <option value="">Todas las categorías</option>
                <option value="electronicos">Electrónicos</option>
                <option value="hogar">Hogar</option>
                <option value="oficina">Oficina</option>
                <option value="alimentos">Alimentos</option>
            </select>
            <select class="filter-select">
                <option value="">Todos los precios</option>
                <option value="0-50">0€ - 50€</option>
                <option value="50-100">50€ - 100€</option>
                <option value="100-500">100€ - 500€</option>
                <option value="500">+500€</option>
            </select>
            <select class="filter-select">
                <option value="">Disponibilidad</option>
                <option value="stock">En stock</option>
                <option value="low-stock">Stock bajo</option>
                <option value="out-stock">Sin stock</option>
            </select>
        </div> -->

        <div class="productos-grid">
            <!-- Tarjeta para añadir nuevo producto -->
            <div class="add-producto-card">
                <div class="add-icon">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="add-text">Añadir Producto</div>
            </div>

            <?php

                $productos = findByEmpresaId();

                foreach ($productos as $producto) {
                    $categoria = findCategoriaById($producto->getIdCategoria());
                    echo '
                        <div class="producto-card">
                            <div class="producto-image">
                                <img src="../../' . $producto->getRutaImagen() . '" alt="' . $producto->getNombreProducto() . '">
                                '; 
                                if($producto->isActivo() == 1) {
                                    echo '<span class="producto-badge badge-stock">Activo</span>';

                                }else {
                                    echo '<span class="producto-badge badge-out-stock">Inactivo</span>';
                                }; 
                                echo'
                            </div>
                            <div class="producto-content">
                                <div class="producto-category" style="color: ' . $categoria->getColor() . ';">' . $categoria->getNombre() . '</div>
                                <h3 class="producto-title">' . $producto->getNombreProducto() . '</h3>
                                <p class="producto-desc">' . substr($producto->getDescripcion(), 0, 25) . (strlen($producto->getDescripcion()) > 20 ? '...' : '') . '</p>
                                <div class="producto-footer">
                                    <div class="producto-price">' . $producto->getPrecio() . '€</div>
                                    <div class="producto-actions">
                                        <div class="btn-producto btn-edit" data-producto-id="' . $producto->getId() . '">
                                            <i class="fas fa-pen"></i>
                                        </div>
                                        <div class="btn-producto btn-delete" data-producto-id="' . $producto->getId() . '">
                                            <i class="fas fa-trash"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ';
                }
            ?>
        </div>


        <!-- Paginación -->
        <!-- <div class="pagination">
            <div class="page-item disabled">
                <i class="fas fa-chevron-left"></i>
            </div>
            <div class="page-item active">1</div>
            <div class="page-item">2</div>
            <div class="page-item">3</div>
            <div class="page-item">4</div>
            <div class="page-item">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div> -->

    </div>
    <!-- Modal para categorías -->
    <div id="modal-categoria" class="modal">
        <div class="modal-content">
            <!-- Vista de lista de categorías -->
            <div class="modal-view" id="vista-categorias">
                <div class="modal-header">
                    <h2>Gestionar Categorías</h2>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="categorias-grid">
                        <?php
                            $idEmpresa = (string) $_SESSION['empresa']['id'];
                            
                            $categorias = findCategoriaByEmpresaId($idEmpresa[0]);

                            foreach ($categorias as $categoria) {
                                echo '<div class="categoria-card" data-id="' . $categoria->getId() . '">
                                        <div class="categoria-color" style="background-color: ' . $categoria->getColor() . ';"></div>
                                        <div class="categoria-name">' . $categoria->getNombre() . '</div>
                                        <div class="delete-indicator"><i class="fas fa-trash"></i> Eliminar</div>
                                    </div>';
                            }
                            if (count($categorias) == 0) {
                                echo 'SIN CATEGORIAS';
                            }

                        ?>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-cancel">Cerrar</button>
                    <button class="btn btn-primary" id="btn-nueva-categoria">
                        <i class="fas fa-plus"></i> Añadir Categoría
                    </button>
                </div>
            </div>

            <!-- Vista de formulario para nueva categoría -->
            <div class="modal-view" id="vista-formulario" style="display: none;">
                <div class="modal-header">
                    <h2>Nueva Categoría</h2>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <form action="../actions/crearCategoria.php" method="POST">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="categoria-nombre">Nombre de la categoría</label>
                            <input type="text" id="categoria-nombre" class="form-control" placeholder="Ej: Electrónicos, Ropa, Alimentos..." name="nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="categoria-descripcion">Descripción (opcional)</label>
                            <textarea id="categoria-descripcion" class="form-control textarea-control" placeholder="Descripción breve de la categoría..." name="descripcion"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Color identificativo</label>
                            <div class="color-selector">
                                <div class="color-option active" style="background-color: #3b82f6;" data-color="#3b82f6"></div>
                                <div class="color-option" style="background-color: #059669;" data-color="#059669"></div>
                                <div class="color-option" style="background-color: #d97706;" data-color="#d97706"></div>
                                <div class="color-option" style="background-color: #dc2626;" data-color="#dc2626"></div>
                                <div class="color-option" style="background-color: #7c3aed;" data-color="#7c3aed"></div>
                                <div class="color-option" style="background-color: #db2777;" data-color="#db2777"></div>
                            </div>
                            <input type="hidden" name="color" id="categoria-color" value="#3b82f6">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="btn-volver">Volver</button>
                        <button type="submit" class="btn btn-primary" id="guardar-categoria">Guardar Categoría</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


    <script src="../../public/js/menuLateral.js"></script>
    <script src="../../public/js/productos.js"></script>
    <script src="../../public/js/categorias.js"></script>
</body>
</html>