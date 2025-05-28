document.addEventListener('DOMContentLoaded', () => {
    const imageUploadContainer = document.getElementById('imageUploadContainer');
    const inputImagen = document.getElementById('imagen');
    const previewImage = document.getElementById('previewImage');

    if (!imageUploadContainer || !inputImagen || !previewImage) return;

    // Click en el contenedor para abrir selector de archivo
    imageUploadContainer.addEventListener('click', () => {
        inputImagen.click();
    });

    // Vista previa al seleccionar archivo
    inputImagen.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                imageUploadContainer.classList.add('has-image');
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Drag and drop
    imageUploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadContainer.classList.add('drag-over');
    });

    imageUploadContainer.addEventListener('dragleave', () => {
        imageUploadContainer.classList.remove('drag-over');
    });

    imageUploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadContainer.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            inputImagen.files = e.dataTransfer.files;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                imageUploadContainer.classList.add('has-image');
            };
            
            reader.readAsDataURL(file);
        }
    });
});