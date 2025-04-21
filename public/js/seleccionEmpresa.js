addEventListener('DOMContentLoaded', () => {

    const empresaSeleccionada = document.querySelectorAll('[data-empresa-id]');

    empresaSeleccionada.forEach(card => {
        card.addEventListener('click', () => {
            idEmpresa = card.dataset.empresaId;

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



    // const companyCards = document.querySelectorAll('.tarjetaEmpresaJs');

    // companyCards.forEach(card => {
    //     card.addEventListener('click', () => {
    //         window.location.href = './panelPrincipal.php';
    //     });
    // });

    const addCompanyCard = document.querySelector('.add-company-card');

    addCompanyCard.addEventListener('click', () => {
        window.location.href = './creacionEmpresa.php';
    });

// Guarda algo en la sesión del servidor (vía AJAX)
// const dato = "Hola desde JS";




});