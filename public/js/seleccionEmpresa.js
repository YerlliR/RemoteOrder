document.addEventListener('DOMContentLoaded', () => {
    const empresaSeleccionada = document.querySelectorAll('[data-empresa-id]');

    empresaSeleccionada.forEach(card => {
        card.addEventListener('click', () => {
            const idEmpresa = card.dataset.empresaId;

            fetch("../../php/functions/guardarEnSesionDesdeJs.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `idEmpresa=${encodeURIComponent(idEmpresa)}`
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = './panelPrincipal.php';
                } else {
                    console.error('Error al guardar la empresa en sesión');
                }
            })
            .catch(error => {
                console.error('Error en la petición:', error);
            });
        });
    });

    const addCompanyCard = document.querySelector('.add-company-card');
    if (addCompanyCard) {
        addCompanyCard.addEventListener('click', () => {
            window.location.href = './creacionEmpresa.php';
        });
    }
});