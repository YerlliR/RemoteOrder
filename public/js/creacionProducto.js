document.addEventListener('DOMContentLoaded', () => {
    // Imagen Upload Functionality
    const imageUploadContainer = document.getElementById('imageUploadContainer');
    const inputImagen = document.getElementById('imagen');
    const previewImage = document.getElementById('previewImage');

    // Cuando se hace clic en el contenedor de carga de imagen, activa el input de archivo
    imageUploadContainer.addEventListener('click', () => {
        inputImagen.click();
    });

    // Cuando se selecciona un archivo, muestra la vista previa
    inputImagen.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                
                // Cambia el estilo del contenedor para mostrar que tiene una imagen
                imageUploadContainer.classList.add('has-image');
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Opcional: Arrastrar y soltar archivos
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