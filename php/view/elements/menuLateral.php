<?php
// ===== ARCHIVO CORREGIDO: php/view/elements/menuLateral.php =====

// NO llamar session_start() aquí - debe estar ya iniciada en la página padre
// Si necesitas verificar la sesión, hazlo de forma segura:
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Verificar que hay sesión activa
if (!isset($_SESSION['usuario']) || !isset($_SESSION['empresa'])) {
    // Redirigir al login si no hay sesión
    echo '<script>window.location.href = "../../php/view/login.php";</script>';
    exit;
}

// Obtener datos de la sesión de forma segura
$usuario = $_SESSION['usuario'];
$empresa = $_SESSION['empresa'];

// Manejar el caso donde empresa puede ser un array
$empresaNombre = '';
$empresaId = '';

if (is_array($empresa)) {
    $empresaNombre = isset($empresa['nombre']) ? $empresa['nombre'] : 'Empresa';
    $empresaId = isset($empresa['id']) ? (is_array($empresa['id']) ? $empresa['id'][0] : $empresa['id']) : '';
} else {
    $empresaNombre = 'Empresa';
}

$usuarioNombre = isset($usuario['nombre']) ? $usuario['nombre'] : 'Usuario';
$usuarioApellidos = isset($usuario['apellidos']) ? $usuario['apellidos'] : '';
$usuarioIniciales = strtoupper(substr($usuarioNombre, 0, 1) . substr($usuarioApellidos, 0, 1));
?>

<!-- Sidebar / Menú lateral -->
<div class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <h2>RemoteOrder</h2>
        <small>Panel de Control</small>
    </div>
    
    <div class="menu-items">
        <!-- Dashboard -->
        <a href="#" class="menu-item" data-link="panelPrincipal">
            <i class="fas fa-chart-pie"></i>
            <span>Dashboard</span>
        </a>
        
        <!-- Productos -->
        <a href="#" class="menu-item" data-link="productos">
            <i class="fas fa-box"></i>
            <span>Productos</span>
        </a>
        
        <!-- Pedidos -->
        <div class="menu-item has-submenu">
            <i class="fas fa-shopping-cart"></i>
            <span>Pedidos</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="submenu">
            <a href="#" class="submenu-item" data-link="pedidos-recibidos">Pedidos Recibidos</a>
            <a href="#" class="submenu-item" data-link="pedidos-enviados">Pedidos Enviados</a>
        </div>
        
        <!-- Proveedores -->
        <div class="menu-item has-submenu">
            <i class="fas fa-truck"></i>
            <span>Proveedores</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="submenu">
            <a href="#" class="submenu-item" data-link="misProveedores">Mis Proveedores</a>
            <a href="#" class="submenu-item" data-link="explorarProveedores">Explorar Proveedores</a>
        </div>
        
        <!-- Clientes -->
        <a href="#" class="menu-item" data-link="clientes">
            <i class="fas fa-users"></i>
            <span>Clientes</span>
        </a>
        
        <!-- Configuración -->
        <a href="#" class="menu-item">
            <i class="fas fa-cog"></i>
            <span>Configuración</span>
        </a>
    </div>
</div>

<!-- Header / Navbar -->
<div class="main-content">
    <div class="header">
        <div class="header-left">
            <div class="toggle-sidebar" id="toggleSidebar">
                <i class="fas fa-bars"></i>
            </div>
            <div class="header-title">
                <?php echo htmlspecialchars($empresaNombre); ?>
            </div>
        </div>
        
        <div class="user-menu">
            <div class="user-button" id="userButton">
                <div class="user-avatar">
                    <?php echo $usuarioIniciales; ?>
                </div>
                <span class="user-name">
                    <?php echo htmlspecialchars($usuarioNombre . ' ' . $usuarioApellidos); ?>
                </span>
                <i class="fas fa-chevron-down"></i>
            </div>
            
            <div class="user-dropdown" id="userDropdown">
                <a href="#" class="dropdown-item" onclick="cambiarEmpresa()">
                    <i class="fas fa-building"></i>
                    <span>Cambiar Empresa</span>
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-user"></i>
                    <span>Mi Perfil</span>
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-cog"></i>
                    <span>Configuración</span>
                </a>
                <div style="border-top: 1px solid #e5e7eb; margin: 8px 0;"></div>
                <a href="#" class="dropdown-item" onclick="cerrarSesion()" style="color: #dc2626;">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Cerrar Sesión</span>
                </a>
            </div>
        </div>
    </div>

    <!-- El contenido de la página se renderizará aquí -->

<!-- ===== SCRIPT MEJORADO PARA EL MENÚ ===== -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');
    const links = document.querySelectorAll('[data-link]');
    const menusWithSubmenu = document.querySelectorAll('.has-submenu');
    
    // Navegación entre páginas
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const href = this.dataset.link;
            
            // Mostrar feedback de navegación si está disponible el sistema de alertas
            if (typeof showAlert === 'function') {
                showAlert({
                    type: 'info',
                    title: 'Navegando...',
                    message: 'Cargando página',
                    duration: 1000
                });
            }
            
            // Navegar después de un breve delay
            setTimeout(() => {
                window.location.href = `../../php/view/${href}.php`;
            }, 200);
        });
    });

    // Toggle sidebar en móvil
    if (toggleSidebar && sidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Toggle menú de usuario
    if (userButton && userDropdown) {
        userButton.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (userDropdown.classList.contains('active') && 
                !userButton.contains(e.target) && 
                !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Gestión de los submenús
    menusWithSubmenu.forEach(menu => {
        const submenu = menu.nextElementSibling;
        const chevron = menu.querySelector('.fa-chevron-down');
        
        if (submenu && submenu.classList.contains('submenu')) {
            // Abrir/cerrar submenú al hacer clic
            menu.addEventListener('click', function() {
                submenu.classList.toggle('submenu-active');
                
                if (chevron) {
                    chevron.style.transform = submenu.classList.contains('submenu-active') 
                        ? 'rotate(180deg)' 
                        : 'rotate(0)';
                }
            });
            
            // Si hay un elemento activo en el submenú, mantenerlo abierto
            if (submenu.querySelector('.active') || menu.classList.contains('active')) {
                submenu.classList.add('submenu-active');
                if (chevron) {
                    chevron.style.transform = 'rotate(180deg)';
                }
            }
        }
    });

    // Cerrar sidebar en móvil al hacer clic fuera
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && 
            sidebar && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            (!toggleSidebar || !toggleSidebar.contains(e.target))) {
            sidebar.classList.remove('active');
        }
    });
    
    // Marcar elemento activo según la página actual
    const currentPage = window.location.pathname.split('/').pop().replace('.php', '');
    const activeLink = document.querySelector(`[data-link="${currentPage}"]`);
    
    if (activeLink) {
        // Remover clase active de todos los elementos
        document.querySelectorAll('.menu-item, .submenu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Añadir clase active al elemento actual
        activeLink.classList.add('active');
        
        // Si es un submenu item, abrir el submenu padre
        if (activeLink.classList.contains('submenu-item')) {
            const parentSubmenu = activeLink.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('submenu-active');
                const parentMenu = parentSubmenu.previousElementSibling;
                if (parentMenu) {
                    const chevron = parentMenu.querySelector('.fa-chevron-down');
                    if (chevron) {
                        chevron.style.transform = 'rotate(180deg)';
                    }
                }
            }
        }
    }
});

// Funciones globales para las acciones del usuario
window.cambiarEmpresa = function() {
    if (typeof showAlert === 'function') {
        showAlert({
            type: 'info',
            title: 'Cambiando empresa...',
            message: 'Redirigiendo a la selección de empresa',
            duration: 2000
        });
    }
    
    setTimeout(() => {
        window.location.href = '../../php/view/seleccionEmpresa.php';
    }, 500);
};

window.cerrarSesion = function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        if (typeof showAlert === 'function') {
            showAlert({
                type: 'info',
                title: 'Cerrando sesión...',
                message: 'Hasta pronto',
                duration: 2000
            });
        }
        
        setTimeout(() => {
            window.location.href = '../../php/actions/cerrarSesion.php';
        }, 500);
    }
};

// Log para depuración
console.log('MenuLateral cargado correctamente');
</script>

