<?php

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../../public/styles/base.css">
    <link rel="stylesheet" href="../../public/styles/menuLateral.css">
    <link rel="stylesheet" href="../../public/styles/panelPrincipal.css">
</head>
<body>
    <!-- Elementos decorativos -->
    <div class="floating-shape shape1"></div>
    <div class="floating-shape shape2"></div>

    <!-- Sidebar / Menú lateral -->
    <?php include 'elements/menuLateral.php'; ?>

    <!-- Contenido principal -->
        <div class="dashboard">
            <h2 class="dashboard-title">Resumen de Actividad</h2>
            
            <div class="dashboard-summary">
                <div class="summary-card">
                    <h3><i class="fas fa-inbox"></i> Pedidos Recibidos</h3>
                    <div class="stats">
                        <div class="stat-item">Total: <strong>42</strong></div>
                        <div class="stat-item">Pendientes: <strong>12</strong></div>
                        <div class="stat-item">Completados: <strong>30</strong></div>
                    </div>
                </div>
                <div class="summary-card">
                    <h3><i class="fas fa-paper-plane"></i> Pedidos Enviados</h3>
                    <div class="stats">
                        <div class="stat-item">Total: <strong>35</strong></div>
                        <div class="stat-item">En Proceso: <strong>8</strong></div>
                        <div class="stat-item">Completados: <strong>27</strong></div>
                    </div>
                </div>
            </div>

            <div class="order-table">
                <div class="table-header">
                    <h3>Pedidos Recibidos Recientes</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#1089</td>
                            <td>Empresa ABC, S.L.</td>
                            <td>18/04/2025</td>
                            <td>2.850,00 €</td>
                            <td><span class="status status-pending">Pendiente</span></td>
                        </tr>
                        <tr>
                            <td>#1088</td>
                            <td>Distribuciones XYZ</td>
                            <td>17/04/2025</td>
                            <td>1.540,75 €</td>
                            <td><span class="status status-processing">En Proceso</span></td>
                        </tr>
                        <tr>
                            <td>#1087</td>
                            <td>Comercial Innovadora</td>
                            <td>16/04/2025</td>
                            <td>3.200,00 €</td>
                            <td><span class="status status-completed">Completado</span></td>
                        </tr>
                        <tr>
                            <td>#1086</td>
                            <td>Suministros Rápidos</td>
                            <td>15/04/2025</td>
                            <td>780,25 €</td>
                            <td><span class="status status-cancelled">Cancelado</span></td>
                        </tr>
                        <tr>
                            <td>#1085</td>
                            <td>Industrias Tecnológicas</td>
                            <td>14/04/2025</td>
                            <td>5.430,00 €</td>
                            <td><span class="status status-completed">Completado</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="order-table" style="margin-top: 30px;">
                <div class="table-header">
                    <h3>Pedidos Enviados Recientes</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Proveedor</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#2056</td>
                            <td>Suministros Globales</td>
                            <td>18/04/2025</td>
                            <td>4.320,00 €</td>
                            <td><span class="status status-pending">Pendiente</span></td>
                        </tr>
                        <tr>
                            <td>#2055</td>
                            <td>Fabricantes Unidos</td>
                            <td>16/04/2025</td>
                            <td>2.180,50 €</td>
                            <td><span class="status status-processing">En Proceso</span></td>
                        </tr>
                        <tr>
                            <td>#2054</td>
                            <td>Importaciones Europa</td>
                            <td>15/04/2025</td>
                            <td>1.875,30 €</td>
                            <td><span class="status status-completed">Completado</span></td>
                        </tr>
                        <tr>
                            <td>#2053</td>
                            <td>Materiales Premium</td>
                            <td>14/04/2025</td>
                            <td>960,75 €</td>
                            <td><span class="status status-completed">Completado</span></td>
                        </tr>
                        <tr>
                            <td>#2052</td>
                            <td>Componentes Técnicos</td>
                            <td>13/04/2025</td>
                            <td>3.450,00 €</td>
                            <td><span class="status status-completed">Completado</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Incluir el archivo JavaScript del menú lateral -->
    <script src="../../public/js/menuLateral.js"></script>
        <?php include_once '../includes/footer_alerts.php'; ?>

</body>
</html>