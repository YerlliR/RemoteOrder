addEventListener('DOMContentLoaded', () => {

    const addCompanyCard = document.querySelector('.add-company-card');

    addCompanyCard.addEventListener('click', () => {
        window.location.href = './creacionEmpresa.php';
    });

    const companyCards = document.querySelectorAll('.company-card');

    companyCards.forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = './panelPrincipal.php';
        });
    });

});