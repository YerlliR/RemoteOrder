addEventListener('DOMContentLoaded', () => {

    const links = document.querySelectorAll('[data-link]');
    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const href = link.dataset.link;
            window.location.href = `./${href}.php`;
        });
    });
});