$(document).ready(function() {
    function traerAdministradores() {
        fetch('http://localhost:3000/api/usuarios')
        .then(response => response.json())
        .then(data => {
            console.log(33);
            console.log('Datos recibidos:', data);
            const tbody = document.querySelector('#tablaEventos tbody');
            tbody.innerHTML = '';
    
            // Filtrar solo los administradores
            const administradores = data.filter(user => user.tipo_usuario === 'administrador');
    
            if (administradores.length > 0) {
                administradores.forEach(admin => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${admin.id_usuario || ''}</td>
                        <td>${admin.nombre_completo || ''}</td>
                        <td>${admin.correo || ''}</td>
                        <td>${admin.telefono || ''}</td>
                        <td><span>${admin.identificacion || ''}</span></td>
                        <td>
                            <span class="badge ${admin.tipo_usuario === 'administrador' ? 'bg-success' : 'bg-secondary'}">
                                ${admin.tipo_usuario}
                            </span>
                            <button class="btn btn-primary btn-sm"><i class="bi bi-pencil"></i> Editar</button>
                            <button class="btn btn-danger btn-sm btn-eliminar" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#confirmDeleteModal"
                                    data-id="${admin.id_usuario}">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </td>
                    `;
                    
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay administradores registrados</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al obtener los administradores:', error);
            const tbody = document.querySelector('#tablaEventos tbody');
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar los datos</td></tr>';
            
            // Mostrar alerta de error
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los administradores',
                icon: 'error'
            });
        });
    }
    
    
    // Llamar a la función cuando se cargue la página
    document.addEventListener('DOMContentLoaded', traerAdministradores());

    // Manejar el evento de eliminación
    $('#confirmDeleteBtn').click(function() {
        if ($('#confirmCheckbox').is(':checked')) {
            const userId = $(this).data('userId');
            
            $.ajax({
                url: '/usuarios',
                type: 'DELETE',
                data: { id: userId },
                success: function(response) {
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El administrador ha sido eliminado correctamente',
                        icon: 'success'
                    }).then(() => {
                        $('#confirmDeleteModal').modal('hide');
                        cargarTablaAdministradores();
                    });
                },
                error: function(xhr) {
                    Swal.fire({
                        title: 'Error',
                        text: xhr.responseJSON?.message || 'Error al eliminar',
                        icon: 'error'
                    });
                }
            });
        } else {
            Swal.fire({
                title: 'Advertencia',
                text: 'Debes confirmar que estás seguro',
                icon: 'warning'
            });
        }
    });

    // Pasar el ID del usuario al modal cuando se hace clic en eliminar
    $(document).on('click', '.btn-eliminar', function() {
        const userId = $(this).data('id');
        $('#confirmDeleteBtn').data('userId', userId);
        $('#confirmCheckbox').prop('checked', false);
    });
});