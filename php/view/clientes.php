<?php
    session_start();
    // Aquí iría la lógica para cargar clientes
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RemoteOrder - Clientes</title>
    <link rel="stylesheet" href="../../public/styles/clientes.css">
    <link rel="stylesheet" href="../../public/styles/panelPrincipal.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    <!-- Formas flotantes decorativas -->
    <div class="floating-shape shape1"></div>
    <div class="floating-shape shape2"></div>

    <!-- Sidebar / Menú lateral -->
    <?php include 'elements/menuLateral.php'; ?>

    <!-- Contenido principal - Clientes -->
    <div class="clientes-container">
        <div class="clientes-header">
            <h1 class="clientes-title">Gestión de Clientes</h1>
            <div class="clientes-actions">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="Buscar clientes...">
                </div>
                <button class="btn-add-cliente">
                    <i class="fas fa-plus"></i>
                    Nuevo Cliente
                </button>
            </div>
        </div>

        <div class="filters-container">
            <select class="filter-select">
                <option value="">Todos los tipos</option>
                <option value="empresa">Empresa</option>
                <option value="particular">Particular</option>
            </select>
            <select class="filter-select">
                <option value="">Estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
            </select>
            <select class="filter-select">
                <option value="">Ordenar por</option>
                <option value="nombre-asc">Nombre (A-Z)</option>
                <option value="nombre-desc">Nombre (Z-A)</option>
                <option value="reciente">Más recientes</option>
                <option value="antiguo">Más antiguos</option>
            </select>
        </div>

        <!-- Vista de tabla -->
        <div class="clientes-table-container">
            <table class="clientes-table">
                <thead>
                    <tr>
                        <th>
                            <div class="th-content">
                                <input type="checkbox" id="select-all">
                                <label for="select-all"></label>
                            </div>
                        </th>
                        <th>
                            <div class="th-content">
                                Cliente <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>
                            <div class="th-content">
                                Contacto <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>
                            <div class="th-content">
                                CIF/NIF <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>
                            <div class="th-content">
                                Tipo <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>
                            <div class="th-content">
                                Estado <i class="fas fa-sort"></i>
                            </div>
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Ejemplo de datos -->
                    <tr>
                        <td>
                            <div class="td-content">
                                <input type="checkbox" id="select-1">
                                <label for="select-1"></label>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-info">
                                <div class="cliente-avatar">EG</div>
                                <div class="cliente-details">
                                    <div class="cliente-name">Empresa Global S.L.</div>
                                    <div class="cliente-email">contacto@empresaglobal.com</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-contact">
                                <div>María Rodríguez</div>
                                <div>+34 612 345 678</div>
                            </div>
                        </td>
                        <td>B12345678</td>
                        <td><span class="tag tag-empresa">Empresa</span></td>
                        <td><span class="status status-active">Activo</span></td>
                        <td>
                            <div class="actions-container">
                                <button class="btn-action btn-view" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" title="Editar">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="btn-action btn-delete" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="td-content">
                                <input type="checkbox" id="select-2">
                                <label for="select-2"></label>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-info">
                                <div class="cliente-avatar">TP</div>
                                <div class="cliente-details">
                                    <div class="cliente-name">Tecnologías Profesionales</div>
                                    <div class="cliente-email">info@tecnopro.com</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-contact">
                                <div>Carlos Sánchez</div>
                                <div>+34 623 456 789</div>
                            </div>
                        </td>
                        <td>B87654321</td>
                        <td><span class="tag tag-empresa">Empresa</span></td>
                        <td><span class="status status-active">Activo</span></td>
                        <td>
                            <div class="actions-container">
                                <button class="btn-action btn-view" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" title="Editar">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="btn-action btn-delete" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="td-content">
                                <input type="checkbox" id="select-3">
                                <label for="select-3"></label>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-info">
                                <div class="cliente-avatar">JL</div>
                                <div class="cliente-details">
                                    <div class="cliente-name">Juan López García</div>
                                    <div class="cliente-email">juanlopez@email.com</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-contact">
                                <div>Juan López</div>
                                <div>+34 634 567 890</div>
                            </div>
                        </td>
                        <td>12345678A</td>
                        <td><span class="tag tag-particular">Particular</span></td>
                        <td><span class="status status-active">Activo</span></td>
                        <td>
                            <div class="actions-container">
                                <button class="btn-action btn-view" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" title="Editar">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="btn-action btn-delete" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="td-content">
                                <input type="checkbox" id="select-4">
                                <label for="select-4"></label>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-info">
                                <div class="cliente-avatar">DS</div>
                                <div class="cliente-details">
                                    <div class="cliente-name">Distribuciones Sur</div>
                                    <div class="cliente-email">ventas@distsur.com</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-contact">
                                <div>Ana Martínez</div>
                                <div>+34 645 678 901</div>
                            </div>
                        </td>
                        <td>B98765432</td>
                        <td><span class="tag tag-empresa">Empresa</span></td>
                        <td><span class="status status-inactive">Inactivo</span></td>
                        <td>
                            <div class="actions-container">
                                <button class="btn-action btn-view" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" title="Editar">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="btn-action btn-delete" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="td-content">
                                <input type="checkbox" id="select-5">
                                <label for="select-5"></label>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-info">
                                <div class="cliente-avatar">LR</div>
                                <div class="cliente-details">
                                    <div class="cliente-name">Laura Ruiz Fernández</div>
                                    <div class="cliente-email">lauraruiz@email.com</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="cliente-contact">
                                <div>Laura Ruiz</div>
                                <div>+34 656 789 012</div>
                            </div>
                        </td>
                        <td>87654321B</td>
                        <td><span class="tag tag-particular">Particular</span></td>
                        <td><span class="status status-active">Activo</span></td>
                        <td>
                            <div class="actions-container">
                                <button class="btn-action btn-view" title="Ver detalles">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" title="Editar">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="btn-action btn-delete" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Vista de tarjetas para móvil -->
        <div class="clientes-cards">
            <!-- Cliente 1 -->
            <div class="cliente-card">
                <div class="cliente-card-header">
                    <div class="cliente-info">
                        <div class="cliente-avatar">EG</div>
                        <div class="cliente-details">
                            <div class="cliente-name">Empresa Global S.L.</div>
                            <div class="cliente-email">contacto@empresaglobal.com</div>
                        </div>
                    </div>
                    <span class="status status-active">Activo</span>
                </div>
                <div class="cliente-card-body">
                    <div class="info-row">
                        <div class="info-label">Contacto:</div>
                        <div class="info-value">María Rodríguez</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Teléfono:</div>
                        <div class="info-value">+34 612 345 678</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">CIF/NIF:</div>
                        <div class="info-value">B12345678</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Tipo:</div>
                        <div class="info-value"><span class="tag tag-empresa">Empresa</span></div>
                    </div>
                </div>
                <div class="cliente-card-footer">
                    <button class="btn-action btn-view" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" title="Editar">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-action btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <!-- Cliente 2 -->
            <div class="cliente-card">
                <div class="cliente-card-header">
                    <div class="cliente-info">
                        <div class="cliente-avatar">JL</div>
                        <div class="cliente-details">
                            <div class="cliente-name">Juan López García</div>
                            <div class="cliente-email">juanlopez@email.com</div>
                        </div>
                    </div>
                    <span class="status status-active">Activo</span>
                </div>
                <div class="cliente-card-body">
                    <div class="info-row">
                        <div class="info-label">Contacto:</div>
                        <div class="info-value">Juan López</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Teléfono:</div>
                        <div class="info-value">+34 634 567 890</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">CIF/NIF:</div>
                        <div class="info-value">12345678A</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Tipo:</div>
                        <div class="info-value"><span class="tag tag-particular">Particular</span></div>
                    </div>
                </div>
                <div class="cliente-card-footer">
                    <button class="btn-action btn-view" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" title="Editar">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-action btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
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
            <div class="page-item">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
    </div>

    <!-- Modal para añadir/editar cliente -->
    <div id="modal-cliente" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Nuevo Cliente</h2>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <form id="form-cliente">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tipo-cliente">Tipo de Cliente</label>
                            <select id="tipo-cliente" class="form-control" required>
                                <option value="">Seleccionar tipo</option>
                                <option value="empresa">Empresa</option>
                                <option value="particular">Particular</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="cif-nif">CIF/NIF</label>
                            <input type="text" id="cif-nif" class="form-control" placeholder="CIF/NIF" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="nombre-cliente">Nombre/Razón Social</label>
                        <input type="text" id="nombre-cliente" class="form-control" placeholder="Nombre completo o razón social" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="email-cliente">Email</label>
                            <input type="email" id="email-cliente" class="form-control" placeholder="correo@ejemplo.com" required>
                        </div>
                        <div class="form-group">
                            <label for="telefono-cliente">Teléfono</label>
                            <input type="tel" id="telefono-cliente" class="form-control" placeholder="+34 XXX XXX XXX">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="direccion-cliente">Dirección</label>
                        <input type="text" id="direccion-cliente" class="form-control" placeholder="Calle, número, piso...">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="ciudad-cliente">Ciudad</label>
                            <input type="text" id="ciudad-cliente" class="form-control" placeholder="Ciudad">
                        </div>
                        <div class="form-group">
                            <label for="cp-cliente">Código Postal</label>
                            <input type="text" id="cp-cliente" class="form-control" placeholder="Código postal">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="contacto-nombre">Nombre de Contacto</label>
                        <input type="text" id="contacto-nombre" class="form-control" placeholder="Nombre de la persona de contacto">
                    </div>

                    <div class="form-group">
                        <label for="notas-cliente">Notas</label>
                        <textarea id="notas-cliente" class="form-control textarea-control" placeholder="Información adicional sobre el cliente"></textarea>
                    </div>

                    <div class="checkbox-container">
                        <input type="checkbox" id="cliente-activo" checked>
                        <label for="cliente-activo">Cliente activo</label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-cancel">Cancelar</button>
                <button class="btn btn-primary" id="guardar-cliente">Guardar Cliente</button>
            </div>
        </div>
    </div>

    <script src="../../public/js/menuLateral.js"></script>
    <script src="../../public/js/clientes.js"></script>
</body>
</html>