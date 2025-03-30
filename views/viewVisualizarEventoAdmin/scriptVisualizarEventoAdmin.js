document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar los eventos
    function cargarEventos() {
        fetch('http://localhost:3000/api/eventos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener eventos');
                }
                return response.json();
            })
            .then(data => {
                const tbody = document.querySelector('#tablaEventos tbody');
                tbody.innerHTML = '';

                if (data.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" class="text-center py-4">
                                No hay eventos registrados
                            </td>
                        </tr>
                    `;
                    return;
                }

                data.forEach(evento => {
                    const fila = document.createElement('tr');
                    
                   
                    const fechaEvento = evento.fecha ; 
    
                    
                    // Determinar clase CSS según el estado
                    let estadoClase = '';
                    let estadoTexto = '';
                    
                    switch(evento.estado) {
                        case 'activo':
                            estadoClase = 'bg-success';
                            estadoTexto = 'Activo';
                            break;
                        case 'cancelado':
                            estadoClase = 'bg-danger';
                            estadoTexto = 'Cancelado';
                            break;
                        case 'pendiente':
                            estadoClase = 'bg-warning';
                            estadoTexto = 'Pendiente';
                            break;
                        default:
                            estadoClase = 'bg-secondary';
                            estadoTexto = evento.estado || 'Indefinido';
                    }

                    fila.innerHTML = `
                        <td>${evento.id_evento || ''}</td>
                        <td>${evento.nombre || 'Sin nombre'}</td>
                        <td>${fechaEvento}</td>
                        <td>${evento.asistentes || 0} / ${evento.capacidad || '∞'}</td>
                        <td>
                            <span class="badge ${estadoClase}">
                                ${estadoTexto}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-primary btn-sm btn-editar" data-id="${evento.id_evento}">
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${evento.id_evento}">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </td>
                    `;
                    
                    tbody.appendChild(fila);
                });

                
                agregarEventListeners();
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los eventos',
                    icon: 'error'
                });
            });
    }

    // Función para agregar event listeners a los botones
    function agregarEventListeners() {
        // Botones de editar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const idEvento = this.getAttribute('data-id');
                editarEvento(idEvento);
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const idEvento = this.getAttribute('data-id');
                confirmarEliminacion(idEvento);
            });
        });
    }

    // Función para editar evento
    function editarEvento(idEvento) {
        Swal.fire({
            title: 'Editar Evento',
            text: `¿Deseas editar el evento con ID ${idEvento}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Guardar el ID en sessionStorage
                sessionStorage.setItem('idEventoEditar', idEvento);
                
                // Redirigir a la página de edición
                window.location.href = `http://localhost:3000/api/EditarEvento`;
            }
        });
    }

    // Función para confirmar eliminación
    function confirmarEliminacion(idEvento) {
        Swal.fire({
            title: '¿Eliminar Evento?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarEvento(idEvento);
            }
        });
    }

    // Función para eliminar evento
    function eliminarEvento(idEvento) {
        fetch(`http://localhost:3000/api/eventos/${idEvento}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar evento');
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El evento ha sido eliminado correctamente',
                icon: 'success'
            });
            cargarEventos(); // Recargar la tabla
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el evento',
                icon: 'error'
            });
        });
    }

    // Cargar eventos al iniciar
    cargarEventos();
    document.querySelector('.btn-agregar').addEventListener('click', function() {
        window.location.href = 'http://localhost:3000/AgregarEvento';
    });
});