<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RemoteOrder - Ejemplo con Alertas</title>
    <link rel="stylesheet" href="../../public/styles/base.css">
    <link rel="stylesheet" href="../../public/styles/menuLateral.css">
    <link rel="stylesheet" href="../../public/styles/productos.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    <!-- Sidebar / Menú lateral -->
    <?php include 'elements/menuLateral.php'; ?>

    <!-- Contenido principal -->
    <div class="productos-container">
        <div class="productos-header">
            <h1 class="productos-title">Gestión de Productos</h1>
            <div class="productos-actions">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="Buscar productos...">
                </div>
                <button class="btn-add-producto" onclick="crearNuevoProducto()">
                    <i class="fas fa-plus"></i>
                    Nuevo Producto
                </button>
            </div>
        </div>

        <!-- Formulario de ejemplo con validación y alertas -->
        <div class="form-section" style="margin-bottom: 30px;">
            <h3>Formulario de Ejemplo</h3>
            <form id="ejemplo-form" class="ejemplo-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="nombre">Nombre del Producto</label>
                        <input type="text" id="nombre" name="nombre" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email de Contacto</label>
                        <input type="email" id="email" name="email" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea id="descripcion" name="descripcion" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="limpiarFormulario()">Limpiar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        </div>

        <!-- Botones de ejemplo para probar diferentes tipos de alertas -->
        <div class="demo-section" style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <h3>Ejemplos de Alertas</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-success" onclick="mostrarAlertaExito()">
                    <i class="fas fa-check"></i> Éxito
                </button>
                <button class="btn btn-danger" onclick="mostrarAlertaError()">
                    <i class="fas fa-times"></i> Error
                </button>
                <button class="btn btn-warning" onclick="mostrarAlertaWarning()">
                    <i class="fas fa-exclamation-triangle"></i> Advertencia
                </button>
                <button class="btn btn-info" onclick="mostrarAlertaInfo()">
                    <i class="fas fa-info-circle"></i> Información
                </button>
                <button class="btn btn-primary" onclick="mostrarAlertaCarga()">
                    <i class="fas fa-spinner"></i> Carga
                </button>
                <button class="btn btn-secondary" onclick="mostrarAlertaPersonalizada()">
                    <i class="fas fa-cog"></i> Personalizada
                </button>
                <button class="btn btn-dark" onclick="simularOperacionAjax()">
                    <i class="fas fa-cloud"></i> Simular AJAX
                </button>
            </div>
        </div>

        <!-- Lista de productos (ejemplo) -->
        <div class="productos-grid">
            <div class="add-producto-card" onclick="crearNuevoProducto()">
                <div class="add-icon">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="add-text">Añadir Producto</div>
            </div>

            <!-- Productos de ejemplo -->
            <div class="producto-card">
                <div class="producto-image">
                    <img src="https://via.placeholder.com/250x180" alt="Producto Ejemplo">
                    <span class="producto-badge badge-stock">Activo</span>
                </div>
                <div class="producto-content">
                    <div class="producto-category" style="color: #3b82f6;">Tecnología</div>
                    <h3 class="producto-title">Laptop Empresarial</h3>
                    <p class="producto-desc">Laptop de alto rendimiento para uso empresarial y profesional.</p>
                    <div class="producto-footer">
                        <div class="producto-price">1,299.99€</div>
                        <div class="producto-actions">
                            <div class="btn-producto btn-edit" onclick="editarProducto(1)">
                                <i class="fas fa-pen"></i>
                            </div>
                            <div class="btn-producto btn-delete" onclick="eliminarProducto(1, 'Laptop Empresarial')">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="producto-card">
                <div class="producto-image">
                    <img src="https://via.placeholder.com/250x180" alt="Producto Ejemplo">
                    <span class="producto-badge badge-stock">Activo</span>
                </div>
                <div class="producto-content">
                    <div class="producto-category" style="color: #10b981;">Oficina</div>
                    <h3 class="producto-title">Silla Ergonómica</h3>
                    <p class="producto-desc">Silla de oficina ergonómica con soporte lumbar ajustable.</p>
                    <div class="producto-footer">
                        <div class="producto-price">299.99€</div>
                        <div class="producto-actions">
                            <div class="btn-producto btn-edit" onclick="editarProducto(2)">
                                <i class="fas fa-pen"></i>
                            </div>
                            <div class="btn-producto btn-delete" onclick="eliminarProducto(2, 'Silla Ergonómica')">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="../../public/js/menuLateral.js"></script>
    
    <!-- IMPORTANTE: Incluir el sistema de alertas ANTES de otros scripts -->
    <script src="../../public/js/alertSystem.js"></script>
    
    <!-- Scripts específicos de la página -->
    <script>
        // ===== FUNCIONES DE EJEMPLO PARA DEMOSTRAR EL SISTEMA DE ALERTAS =====
        
        // Función para mostrar diferentes tipos de alertas
        function mostrarAlertaExito() {
            showAlert({
                type: 'success',
                title: 'Operación exitosa',
                message: 'La operación se ha completado correctamente. Todos los cambios han sido guardados.',
                duration: 4000
            });
        }
        
        function mostrarAlertaError() {
            showAlert({
                type: 'error',
                title: 'Error en la operación',
                message: 'No se pudo completar la operación debido a un error en el servidor. Inténtalo de nuevo.',
                duration: 5000
            });
        }
        
        function mostrarAlertaWarning() {
            showAlert({
                type: 'warning',
                title: 'Atención requerida',
                message: 'Hay algunos campos que requieren tu atención antes de continuar.',
                duration: 4500
            });
        }
        
        function mostrarAlertaInfo() {
            showAlert({
                type: 'info',
                title: 'Información importante',
                message: 'Te recomendamos revisar la configuración antes de continuar con el proceso.',
                duration: 4000
            });
        }
        
        function mostrarAlertaCarga() {
            const loadingId = showAlert({
                type: 'loading',
                title: 'Procesando...',
                message: 'Estamos procesando tu solicitud, por favor espera',
                persistent: true
            });
            
            // Simular operación que toma tiempo
            setTimeout(() => {
                hideAlert(loadingId);
                showAlert({
                    type: 'success',
                    title: 'Proceso completado',
                    message: 'La operación se ha completado exitosamente'
                });
            }, 3000);
        }
        
        function mostrarAlertaPersonalizada() {
            showAlert({
                type: 'info',
                title: 'Alerta con acción',
                message: 'Esta alerta tiene una acción personalizada. Haz clic en ella para ver el efecto.',
                duration: 6000,
                action: () => {
                    showAlert({
                        type: 'success',
                        title: '¡Acción ejecutada!',
                        message: 'Has hecho clic en la alerta personalizada'
                    });
                }
            });
        }
        
        // Simular una operación AJAX completa
        function simularOperacionAjax() {
            const loadingId = showAlert({
                type: 'loading',
                title: 'Conectando con el servidor...',
                message: 'Enviando datos y esperando respuesta',
                persistent: true
            });
            
            // Simular delay de red
            setTimeout(() => {
                hideAlert(loadingId);
                
                // Simular respuesta exitosa
                const mockResponse = {
                    success: true,
                    message: 'Los datos se han sincronizado correctamente con el servidor',
                    title: 'Sincronización Completada',
                    alert_type: 'success'
                };
                
                handleAjaxResponse(mockResponse);
            }, 2500);
        }
        
        // ===== FUNCIONES ESPECÍFICAS DE LA PÁGINA =====
        
        function crearNuevoProducto() {
            showAlert({
                type: 'info',
                title: 'Redirigiendo...',
                message: 'Serás redirigido al formulario de creación de productos',
                duration: 2000
            });
            
            setTimeout(() => {
                // En una aplicación real, esto sería una redirección
                showAlert({
                    type: 'success',
                    title: 'Formulario cargado',
                    message: 'Ahora puedes crear un nuevo producto'
                });
            }, 1000);
        }
        
        function editarProducto(id) {
            showAlert({
                type: 'info',
                title: 'Cargando editor...',
                message: `Preparando la edición del producto ID: ${id}`,
                duration: 2000
            });
            
            setTimeout(() => {
                showAlert({
                    type: 'success',
                    title: 'Editor listo',
                    message: 'Ya puedes editar los detalles del producto'
                });
            }, 1000);
        }
        
        async function eliminarProducto(id, nombre) {
            // Usar el sistema de confirmación con alertas
            const confirmed = await confirmarAccionConAlerta({
                type: 'warning',
                title: 'Confirmar eliminación',
                message: `¿Estás seguro de que deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`
            });
            
            if (confirmed) {
                const loadingId = showAlert({
                    type: 'loading',
                    title: 'Eliminando producto...',
                    message: `Eliminando "${nombre}" del catálogo`,
                    persistent: true
                });
                
                // Simular operación de eliminación
                setTimeout(() => {
                    hideAlert(loadingId);
                    
                    showAlert({
                        type: 'success',
                        title: 'Producto eliminado',
                        message: `"${nombre}" ha sido eliminado correctamente del catálogo`
                    });
                    
                    // Simular eliminación visual del elemento
                    const cards = document.querySelectorAll('.producto-card');
                    if (cards[id]) {
                        cards[id].style.transition = 'all 0.5s ease';
                        cards[id].style.transform = 'scale(0.8)';
                        cards[id].style.opacity = '0';
                        
                        setTimeout(() => {
                            cards[id].style.display = 'none';
                        }, 500);
                    }
                }, 1500);
            }
        }
        
        function limpiarFormulario() {
            document.getElementById('ejemplo-form').reset();
            showAlert({
                type: 'info',
                title: 'Formulario limpiado',
                message: 'Todos los campos han sido reiniciados'
            });
        }
        
        // ===== CONFIGURACIÓN DEL FORMULARIO CON VALIDACIÓN =====
        
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('ejemplo-form');
            
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Validar usando el sistema de alertas
                    const isValid = validarFormularioConAlertas(this, {
                        nombre: {
                            required: true,
                            minLength: 3,
                            label: 'Nombre del producto'
                        },
                        email: {
                            required: true,
                            email: true,
                            label: 'Email de contacto'
                        },
                        descripcion: {
                            minLength: 10,
                            label: 'Descripción',
                            custom: (value) => value.trim().split(' ').length >= 3,
                            customMessage: 'La descripción debe tener al menos 3 palabras'
                        }
                    });
                    
                    if (!isValid) return;
                    
                    // Simular envío del formulario
                    const loadingId = showAlert({
                        type: 'loading',
                        title: 'Guardando información...',
                        message: 'Procesando los datos del formulario',
                        persistent: true
                    });
                    
                    setTimeout(() => {
                        hideAlert(loadingId);
                        
                        showAlert({
                            type: 'success',
                            title: 'Información guardada',
                            message: 'Los datos del formulario se han guardado correctamente'
                        });
                        
                        // Limpiar formulario después del éxito
                        this.reset();
                    }, 2000);
                });
            }
            
            // ===== BÚSQUEDA EN TIEMPO REAL CON FEEDBACK =====
            
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                let searchTimeout;
                
                searchInput.addEventListener('input', function() {
                    clearTimeout(searchTimeout);
                    const searchTerm = this.value.toLowerCase().trim();
                    
                    searchTimeout = setTimeout(() => {
                        if (searchTerm.length > 0) {
                            let visibleProducts = 0;
                            const productCards = document.querySelectorAll('.producto-card:not(.add-producto-card)');
                            
                            productCards.forEach(card => {
                                const title = card.querySelector('.producto-title')?.textContent.toLowerCase() || '';
                                const category = card.querySelector('.producto-category')?.textContent.toLowerCase() || '';
                                
                                if (title.includes(searchTerm) || category.includes(searchTerm)) {
                                    card.style.display = '';
                                    visibleProducts++;
                                } else {
                                    card.style.display = 'none';
                                }
                            });
                            
                            if (visibleProducts === 0) {
                                showAlert({
                                    type: 'info',
                                    title: 'Sin resultados',
                                    message: `No se encontraron productos que coincidan con "${searchTerm}"`,
                                    duration: 3000
                                });
                            } else {
                                showAlert({
                                    type: 'success',
                                    title: 'Búsqueda completada',
                                    message: `Se encontraron ${visibleProducts} producto(s) que coinciden con "${searchTerm}"`,
                                    duration: 2000
                                });
                            }
                        } else {
                            // Mostrar todos los productos
                            document.querySelectorAll('.producto-card').forEach(card => {
                                card.style.display = '';
                            });
                        }
                    }, 500);
                });
            }
            
            // ===== DETECCIÓN DE ESTADO DE CONEXIÓN =====
            
            // Verificar conexión inicial
            if (!navigator.onLine) {
                showAlert({
                    type: 'warning',
                    title: 'Sin conexión a internet',
                    message: 'Algunas funciones pueden no estar disponibles',
                    persistent: true
                });
            }
            
            // Escuchar cambios en la conexión
            window.addEventListener('online', () => {
                showAlert({
                    type: 'success',
                    title: 'Conexión restaurada',
                    message: 'La conexión a internet se ha restablecido correctamente'
                });
            });
            
            window.addEventListener('offline', () => {
                showAlert({
                    type: 'warning',
                    title: 'Conexión perdida',
                    message: 'Se ha perdido la conexión a internet. Algunas funciones no estarán disponibles.',
                    persistent: true
                });
            });
            
            // ===== MOSTRAR ALERTA DE BIENVENIDA =====
            
            setTimeout(() => {
                showAlert({
                    type: 'info',
                    title: '¡Bienvenido!',
                    message: 'Esta página demuestra el sistema de alertas en funcionamiento. Prueba los diferentes botones para ver ejemplos.',
                    duration: 5000
                });
            }, 1000);
        });
        
        // ===== FUNCIONES AUXILIARES =====
        
        // Función para simular carga de datos
        function cargarDatos() {
            const loadingId = showAlert({
                type: 'loading',
                title: 'Cargando datos...',
                message: 'Obteniendo información del servidor',
                persistent: true
            });
            
            // Simular diferentes escenarios
            const scenarios = [
                { success: true, delay: 1500 },
                { success: false, delay: 2000 },
                { success: true, delay: 1000 }
            ];
            
            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            
            setTimeout(() => {
                hideAlert(loadingId);
                
                if (scenario.success) {
                    showAlert({
                        type: 'success',
                        title: 'Datos cargados',
                        message: 'La información se ha cargado correctamente'
                    });
                } else {
                    showAlert({
                        type: 'error',
                        title: 'Error al cargar',
                        message: 'No se pudieron cargar los datos. Inténtalo de nuevo.'
                    });
                }
            }, scenario.delay);
        }
        
        // Función para mostrar progreso de operación
        function operacionConProgreso() {
            const steps = [
                'Validando datos...',
                'Conectando con el servidor...',
                'Procesando información...',
                'Guardando cambios...',
                'Finalizando operación...'
            ];
            
            let currentStep = 0;
            
            const showNextStep = () => {
                if (currentStep < steps.length) {
                    const loadingId = showAlert({
                        type: 'loading',
                        title: `Paso ${currentStep + 1} de ${steps.length}`,
                        message: steps[currentStep],
                        persistent: true
                    });
                    
                    setTimeout(() => {
                        hideAlert(loadingId);
                        currentStep++;
                        
                        if (currentStep < steps.length) {
                            showNextStep();
                        } else {
                            showAlert({
                                type: 'success',
                                title: 'Operación completada',
                                message: 'Todos los pasos se han ejecutado correctamente'
                            });
                        }
                    }, 1000);
                }
            };
            
            showNextStep();
        }
        
        // Función para probar alertas en cadena
        function alertasEnCadena() {
            showAlert({
                type: 'info',
                title: 'Iniciando proceso',
                message: 'Se ejecutarán varias alertas en secuencia',
                duration: 2000
            });
            
            setTimeout(() => {
                showAlert({
                    type: 'warning',
                    title: 'Verificando permisos',
                    message: 'Comprobando que tienes los permisos necesarios',
                    duration: 2000
                });
            }, 2500);
            
            setTimeout(() => {
                showAlert({
                    type: 'loading',
                    title: 'Ejecutando...',
                    message: 'Realizando la operación solicitada',
                    duration: 3000
                });
            }, 5000);
            
            setTimeout(() => {
                showAlert({
                    type: 'success',
                    title: 'Proceso completado',
                    message: '¡Todas las alertas en cadena se han mostrado correctamente!'
                });
            }, 8500);
        }
        
        // Exponer funciones para uso en consola de desarrollo
        window.demoFunctions = {
            cargarDatos,
            operacionConProgreso,
            alertasEnCadena,
            eliminarProducto,
            editarProducto,
            crearNuevoProducto
        };
    </script>
    
    <!-- Incluir el sistema de alertas al final -->
    <?php 
    // En una aplicación real, esto estaría en el archivo PHP
    // include_once '../includes/footer_alerts.php'; 
    ?>
    
    <!-- CSS adicional para mejorar la apariencia de los ejemplos -->
    <style>
        .demo-section {
            border: 1px solid #e2e8f0;
        }
        
        .demo-section h3 {
            margin-bottom: 15px;
            color: #374151;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        
        .btn:hover {
            transform: translateY(-1px);
        }
        
        .btn-success { background: #10b981; color: white; }
        .btn-danger { background: #ef4444; color: white; }
        .btn-warning { background: #f59e0b; color: white; }
        .btn-info { background: #3b82f6; color: white; }
        .btn-primary { background: #6366f1; color: white; }
        .btn-secondary { background: #6b7280; color: white; }
        .btn-dark { background: #374151; color: white; }
        
        .form-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .ejemplo-form .form-actions {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        /* Responsivo */
        @media (max-width: 768px) {
            .demo-section > div {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</body>
</html>