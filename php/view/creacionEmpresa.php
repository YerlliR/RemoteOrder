<?php
session_start();

// Verify user is logged in
if (!isset($_SESSION['usuario']) || !isset($_SESSION['usuario']['id'])) {
    // Redirect to login if not logged in
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Nueva Empresa</title>
    <link rel="stylesheet" href="../../public/styles/crearEmpresa.css">
</head>
<body>
    <div class="floating-shape shape1"></div>
    <div class="floating-shape shape2"></div>
    
    <div class="container">
        <h1>Crear Nueva Empresa</h1>
        
        <form id="company-form" action="../actions/crearEmpresa.php" method="POST" enctype="multipart/form-data">
            <div class="logo-upload">
                <div class="logo-upload-icon">
                    <span>+</span>
                </div>
                <div class="logo-upload-text">Subir logo de la empresa</div>
                <div class="logo-upload-hint">Formatos: JPG, PNG (Máx 2MB)</div>
                <input type="file" id="company-logo" name="logo" style="display: none;">
            </div>
            
            <div class="form-group">
                <label for="company-name">Nombre de la empresa *</label>
                <input type="text" id="company-name" name="nombre" class="form-control" placeholder="Ingrese el nombre completo de la empresa" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="company-sector">Sector *</label>
                    <select id="company-sector" name="sector" class="form-control" required>
                        <option value="" selected disabled>Seleccionar sector</option>
                        <option value="tecnologia">Tecnología</option>
                        <option value="finanzas">Finanzas</option>
                        <option value="marketing">Marketing</option>
                        <option value="salud">Salud</option>
                        <option value="educacion">Educación</option>
                        <option value="otros">Otros</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="company-employees">Número de empleados</label>
                    <input type="number" id="company-employees" name="numero_empleados" class="form-control" placeholder="Ej: 10" min="1">
                </div>
            </div>
            
            <div class="form-group">
                <label for="company-description">Descripción</label>
                <textarea id="company-description" name="descripcion" class="form-control" rows="4" placeholder="Breve descripción de la empresa y sus actividades"></textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="company-phone">Teléfono de contacto</label>
                    <input type="tel" id="company-phone" name="telefono" class="form-control" placeholder="+34 XXX XXX XXX">
                </div>
                
                <div class="form-group">
                    <label for="company-email">Email de contacto *</label>
                    <input type="email" id="company-email" name="email" class="form-control" placeholder="empresa@ejemplo.com" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="company-website">Sitio web</label>
                <input type="url" id="company-website" name="sitio_web" class="form-control" placeholder="https://www.empresa.com">
            </div>
            
            <div class="checkbox-container">
                <input type="checkbox" id="company-active" name="estado" checked>
                <label for="company-active">Establecer como empresa activa</label>
            </div>
            
            <div class="checkbox-container">
                <input type="checkbox" id="terms-conditions" required>
                <label for="terms-conditions">Acepto los términos y condiciones</label>
            </div>
            
            <div class="buttons">
                <button type="submit" class="btn btn-primary">Crear Empresa</button>
                <button type="button" class="btn btn-secondary" onclick="window.location.href='seleccionEmpresa.php'">Cancelar</button>
            </div>
        </form>
    </div>
    
    <script>
        // Script para manejar la carga del logo
        document.querySelector('.logo-upload').addEventListener('click', function() {
            document.getElementById('company-logo').click();
        });
        
        document.getElementById('company-logo').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const fileName = file.name;
                document.querySelector('.logo-upload-text').textContent = fileName;
            }
        });
    </script>
</body>
</html>