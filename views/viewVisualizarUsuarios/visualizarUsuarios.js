
    function traerAdministradores() {
        fetch('https://requeproyectoweb-production.up.railway.app/api/usuarios')
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
                            <button class="btn btn-primary btn-sm btn-editar" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#modificarUsuarioModal"
                                    data-id="${admin.id_usuario}"
                                <i class="bi bi-pencil"></i> Editar
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

   /* // Manejar el evento de eliminación
    $('#confirmDeleteBtn').click(function() {
        if ($('#confirmCheckbox').is(':checked')) {
            const userId = $(this).data('userId');
            
            fetch(`https://requeproyectoweb-production.up.railway.app/api/usuarios/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Error al eliminar el usuario');
                    });
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El administrador ha sido eliminado correctamente',
                    icon: 'success'
                }).then(() => {
                    $('#confirmDeleteModal').modal('hide');
                    traerAdministradores();
                });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'Error al eliminar',
                    icon: 'error'
                });
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
    */


document.addEventListener("DOMContentLoaded", function() {
    const agregarEventoButton = document.getElementById("agregarAdmin");

    if (agregarEventoButton) {
        agregarEventoButton.addEventListener("click", function() {
            // Lógica a ejecutar cuando se presiona el botón
            console.log("Botón de agregar evento presionado");

            // Redirige a la página de agregar evento
            window.location.href = "https://requeproyectoweb-production-3d39.up.railway.app/AgregarAdmin"; 
        });
    }
});



$(document).on('click', '.btn-editar', function() {
    const userId = $(this).data('id');
    const correo = $(this).data('correo');
    const telefono = $(this).data('telefono');
    
    // Almacenar el ID temporalmente (alternativa a sessionStorage)
    $('#btnGuardarUsuarioM').data('userId', userId);
    
    // Llenar los campos del modal
    $('#correo').val(correo);
    $('#telefono').val(telefono);
    const modal = document.getElementById('modificarUsuarioModal');

    modal.addEventListener('shown.bs.modal', function () {
        modal.removeAttribute('inert');  // El modal ahora es interactivo
    });
    
    modal.addEventListener('hidden.bs.modal', function () {
        modal.setAttribute('inert', 'true');  // El modal se vuelve inactivo cuando se cierra
    });

    // Mostrar el modal
    $('#modificarUsuarioModal').modal('show');
});

// Configurar el botón de guardar cambios
$('#btnGuardarUsuarioM').click(function() {
    const userId = $(this).data('userId');
    const correo = $('#correo').val();
    const telefono = $('#telefono').val();
    
    if (!correo || !telefono) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    
    const data = {
        correo: correo,
        telefono: telefono
    };
    
    fetch(`https://requeproyectoweb-production.up.railway.app/api/usuarios/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Error al actualizar el usuario');
            });
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: '¡Usuario actualizado correctamente!',
            text: 'Los cambios se guardaron con éxito.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#b99725',
        });
        
        // Cerrar el modal
        $('#modificarUsuarioModal').modal('hide');
        
        // Actualizar la tabla
        traerAdministradores();
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: error.message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#b99725',
        });
    });
});
function editarAdministrador(button){
    
    const eventId = button.getAttribute('data-id');

    sessionStorage.setItem('eventoId', eventId);
    
    // Redirigir a otra página
    window.location.href = 'https://requeproyectoweb-production.up.railway.app/AgregarAdmin'; 

}
window.onload = function() {
    traerAdministradores();
    modalload();
    btnModificar();
    //configurarEliminacion();
};
