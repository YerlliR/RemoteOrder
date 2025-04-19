<div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h2>RemoteOrder</h2>
            <small>Panel de Control</small>
        </div>
        <div class="menu-items">
            <div class="menu-item active" data-link="panelPrincipal">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
            </div>
            <div class="menu-item has-submenu">
                <i class="fas fa-shopping-cart"></i>
                <span>Pedidos</span>
                <i class="fas fa-chevron-down" style="margin-left: auto;"></i>
            </div>
            <div class="submenu">
                <div class="submenu-item" data-link="pedidos-recibidos">Recibidos</div>
                <div class="submenu-item" data-link="pedidos-enviados">Enviados</div>
            </div>
            <div class="menu-item" data-link="productos">
                <i class="fas fa-box"></i>
                <span>Productos</span>
            </div>
            <div class="menu-item" data-link="clientes">
                <i class="fas fa-users"></i>
                <span>Clientes</span>
            </div>
            <div class="menu-item" data-link="proveedores">
                <i class="fas fa-truck"></i>
                <span>Proveedores</span>
            </div>
            <div class="menu-item" data-link="facturacion">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>Facturación</span>
            </div>
        </div>
    </div>


    <div class="main-content">
        <div class="header">
            <div class="header-left">
                <div class="toggle-sidebar" id="toggleSidebar">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="header-title">Dashboard</div>
            </div>
            <div class="user-menu">
                <div class="user-button" id="userButton">
                    <div class="user-avatar">U</div>
                    <div class="user-name">Usuario</div>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="user-dropdown" id="userDropdown">
                    <div class="dropdown-item">
                        <i class="fas fa-building"></i>
                        <span>Cambiar Empresa</span>
                    </div>
                    <div class="dropdown-item">
                        <i class="fas fa-cog"></i>
                        <span>Ajustes</span>
                    </div>
                    <div class="dropdown-item">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Cerrar Sesión</span>
                    </div>
                </div>
            </div>
        </div>


        <script src="../../public/js/menuLateral.js"></script>