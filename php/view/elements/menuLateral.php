<?php
session_start();

// Verificar si el usuario tiene sesión activa
if (!isset($_SESSION['usuario'])) {
    header('Location: ../view/login.php');
    exit;
}

// Obtener datos del usuario y empresa
$usuarioNombre = $_SESSION['usuario']['nombre'] ?? 'Usuario';
$usuarioApellidos = $_SESSION['usuario']['apellidos'] ?? '';
$empresaNombre = $_SESSION['empresa']['nombre'] ?? 'Sin empresa';

// Determinar el elemento activo basado en la URL actual
$currentPage = basename($_SERVER['PHP_SELF'], '.php');
?>

<!-- Sidebar / Menú lateral -->
<div class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <h2>REMOTE ORDER</h2>
        <small>Gestión Empresarial</small>
    </div>
    
    <div class="menu-items">
        <!-- Panel Principal -->
        <a href="#" class="menu-item <?php echo $currentPage == 'panelPrincipal' ? 'active' : ''; ?>" data-link="panelPrincipal">
            <i class="fas fa-tachometer-alt"></i>
            <span>Panel Principal</span>
        </a>
        
        <!-- Productos -->
        <a href="#" class="menu-item <?php echo $currentPage == 'productos' ? 'active' : ''; ?>" data-link="productos">
            <i class="fas fa-box"></i>
            <span>Productos</span>
        </a>
        
        <!-- Pedidos con submenú -->
        <div class="menu-item has-submenu <?php echo in_array($currentPage, ['pedidos-recibidos', 'pedidos-enviados']) ? 'active' : ''; ?>">
            <i class="fas fa-clipboard-list"></i>
            <span>Pedidos</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="submenu <?php echo in_array($currentPage, ['pedidos-recibidos', 'pedidos-enviados']) ? 'submenu-active' : ''; ?>">
            <a href="#" class="submenu-item <?php echo $currentPage == 'pedidos-recibidos' ? 'active' : ''; ?>" data-link="pedidos-recibidos">
                Pedidos Recibidos
            </a>
            <a href="#" class="submenu-item <?php echo $currentPage == 'pedidos-enviados' ? 'active' : ''; ?>" data-link="pedidos-enviados">
                Pedidos Enviados
            </a>
        </div>
        
        <!-- Proveedores con submenú -->
        <div class="menu-item has-submenu <?php echo in_array($currentPage, ['misProveedores', 'explorarProveedores']) ? 'active' : ''; ?>">
            <i class="fas fa-truck"></i>
            <span>Proveedores</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="submenu <?php echo in_array($currentPage, ['misProveedores', 'explorarProveedores']) ? 'submenu-active' : ''; ?>">
            <a href="#" class="submenu-item <?php echo $currentPage == 'misProveedores' ? 'active' : ''; ?>" data-link="misProveedores">
                Mis Proveedores
            </a>
            <a href="#" class="submenu-item <?php echo $currentPage == 'explorarProveedores' ? 'active' : ''; ?>" data-link="explorarProveedores">
                Explorar Proveedores
            </a>
        </div>
        
        <!-- Clientes -->
        <a href="#" class="menu-item <?php echo $currentPage == 'clientes' ? 'active' : ''; ?>" data-link="clientes">
            <i class="fas fa-users"></i>
            <span>Clientes</span>
        </a>
    </div>
</div>

<!-- Contenedor principal -->
<div class="main-content">
    <!-- Header superior -->
    <div class="header">
        <div class="header-left">
            <div class="toggle-sidebar" id="toggleSidebar">
                <i class="fas fa-bars"></i>
            </div>
            <div class="header-title">
                <?php echo $empresaNombre; ?>
            </div>
        </div>
        
        <!-- Menú de usuario -->
        <div class="user-menu">
            <div class="user-button" id="userButton">
                <div class="user-avatar">
                    <?php echo strtoupper(substr($usuarioNombre, 0, 1) . substr($usuarioApellidos, 0, 1)); ?>
                </div>
                <span class="user-name"><?php echo $usuarioNombre . ' ' . $usuarioApellidos; ?></span>
                <i class="fas fa-chevron-down"></i>
            </div>
            
            <div class="user-dropdown" id="userDropdown">
                <a href="#" class="dropdown-item" onclick="cambiarEmpresa()">
                    <i class="fas fa-building"></i>
                    Cambiar Empresa
                </a>
                <a href="#" class="dropdown-item" onclick="cerrarSesion()">
                    <i class="fas fa-sign-out-alt"></i>
                    Cerrar Sesión
                </a>
            </div>
        </div>
    </div>
