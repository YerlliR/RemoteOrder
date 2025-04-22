document.addEventListener('DOMContentLoaded', () => {
    // Navegación entre páginas - CORREGIDO
    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const href = link.dataset.link;
            // Solución corregida: asegurar que la ruta es correcta
            window.location.href = `../../php/view/${href}.php`;
        });
    });

    // Toggle sidebar en móvil
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Toggle menú de usuario
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userButton && userDropdown) {
        userButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (userDropdown.classList.contains('active') && 
                !userButton.contains(e.target) && 
                !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Gestión de los submenús
    const menusWithSubmenu = document.querySelectorAll('.has-submenu');
    
    menusWithSubmenu.forEach(menu => {
        const submenu = menu.nextElementSibling;
        const chevron = menu.querySelector('.fa-chevron-down');
        
        if (submenu && submenu.classList.contains('submenu')) {
            // Abrir/cerrar submenú al hacer clic
            menu.addEventListener('click', () => {
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

    // Función para cambiar de empresa
    window.cambiarEmpresa = function() {
        window.location.href = '../../php/view/seleccionEmpresa.php';
    }

    // Función para cerrar sesión
    window.cerrarSesion = function() {
        window.location.href = '../../php/actions/cerrarSesion.php';
    }

    // Adaptación para dispositivos móviles - cerrar sidebar al hacer clic fuera
    document.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && 
            sidebar && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !toggleSidebar.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Consola de depuración para ayudar a identificar problemas
    console.log('menuLateral.js cargado correctamente');
    console.log('Elementos de menú encontrados:', links.length);
    console.log('Submenús encontrados:', menusWithSubmenu.length);
});