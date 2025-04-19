<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RemoteOrder - Productos</title>
    <link rel="stylesheet" href="../../public/styles/productos.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="../../public/styles/panelPrincipal.css">
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
                <button class="btn-add-producto">
                    <i class="fas fa-plus"></i>
                    Nuevo Producto
                </button>
                <button class="btn-add-producto btn-add-category">
                    <i class="fas fa-plus"></i>
                    Nueva Categoria
                </button>
            </div>
        </div>

        <div class="filters-container">
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
        </div>

        <div class="productos-grid">
            <!-- Tarjeta para añadir nuevo producto -->
            <div class="add-producto-card">
                <div class="add-icon">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="add-text">Añadir Producto</div>
            </div>

            <!-- Producto 1 -->
            <div class="producto-card">
                <div class="producto-image">
                    <img src="/api/placeholder/400/320" alt="Laptop Pro X">
                    <span class="producto-badge badge-stock">En Stock</span>
                </div>
                <div class="producto-content">
                    <div class="producto-category">Electrónicos</div>
                    <h3 class="producto-title">Laptop Pro X Ultra HD</h3>
                    <p class="producto-desc">Potente laptop con procesador de última generación, 16GB RAM y SSD de 512GB.</p>
                    <div class="producto-footer">
                        <div class="producto-price">899.99€</div>
                        <div class="producto-actions">
                            <div class="btn-producto btn-edit">
                                <i class="fas fa-pen"></i>
                            </div>
                            <div class="btn-producto btn-delete">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Paginación -->
        <div class="pagination">
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
        </div>
    </div>
    <script src="../../public/js/productos.js"></script>
</body>
</html>