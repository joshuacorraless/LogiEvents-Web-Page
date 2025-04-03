//Variable globla que almacena el id del usuario

//VALIDACION DE SEGURIDAD, EVITA QUE LOS USUARIOS ACCEDAN A SITOS SIN PERMISOS
var idUser=sessionStorage.getItem("userID");
var tipoUsuario=sessionStorage.getItem("tipoUsuario");
var correo="";
if (!idUser || !tipoUsuario || tipoUsuario !== "administrador") {
    window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/Login'; 
}


document.addEventListener('DOMContentLoaded', function() {
    traerUsuario();
    // Cargar eventos al iniciar
    cargarEventos();
    document.querySelector('.btn-agregar').addEventListener('click', function() {
        window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/RegistrarEvento';
    });

});


// Función para cargar los eventos
function cargarEventos() {
    fetch('https://requeproyectoweb-production.up.railway.app/api/eventos')
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
                
               
                const fecha = new Date(evento.fecha);
                const fechaEvento = fecha.toLocaleDateString('es-MX');  

                
                // Determinar clase CSS según el estado
                let estadoClase = '';
                let estadoTexto = '';
                
                switch(evento.estado) {
                    case 'Activo':
                        estadoClase = 'bg-success';
                        estadoTexto = 'Activo';
                        break;
                    case 'Agotado':
                        estadoClase = 'bg-danger';
                        estadoTexto = 'Agotado';
                        break;
                    case 'Proximamente':
                        estadoClase = 'bg-warning';
                        estadoTexto = 'Proximamente';
                        break;
                    default:
                        estadoClase = 'bg-secondary';
                        estadoTexto = evento.estado || 'Indefinido';
                }

                fila.innerHTML = `
                    <td>${evento.id_evento || ''}</td>
                    <td>${evento.nombre_evento || 'Sin nombre'}</td>
                    <td>${fechaEvento} ${evento.hora}</td>
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
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${evento.id_evento}" data-status="${evento.estado}">
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
            const estado = this.getAttribute('data-status');
            confirmarEliminacion(idEvento,estado);
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
            window.location.href = `https://requeproyectoweb-production-3d39.up.railway.app/EditarEvento`;
        }
    });
}

// Función para confirmar eliminación
function confirmarEliminacion(idEvento,estado) {
    console.log(idEvento);
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
            if(estado === "Activo" || estado === "Próximamente"){
                eliminarEventoActivo(idEvento,estado);
            }
            else{
                console.log(estado);
                eliminarEventoAgotado(idEvento,estado);
            }
        }
    });
}

// Función para eliminar evento
function eliminarEventoActivo(idEvento,estado) {

    const data = {
        email: correo
    };
    console.log(data);
    fetch(`https://requeproyectoweb-production.up.railway.app/api/events/${idEvento}/request-delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar evento');
        }else{
        }
        return response.json();
    })
    .then(data => {
        solicitarMensajeActivo(idEvento);
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

function eliminarEventoAgotado(idEvento,estado) {
    
    fetch(`https://requeproyectoweb-production.up.railway.app/api/events/${idEvento}/agotado-start-delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar evento');
        }else{
        }
        return response.json();
    })
    .then(data => {
        solicitarSMSAgotado(idEvento);
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


function traerUsuario() {
    

    // Realiza la solicitud HTTP GET al api
    fetch('https://requeproyectoweb-production.up.railway.app/api/usuarios')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {
        console.log(data);
        // Verificar` que los datos estén presentes
        if (data && data.length > 0) {
            const usuario = data.find(user => user.id_usuario === Number(idUser));
            correo=usuario.correo;
            console.log(correo);

        } else {
            console.log('No se encontraron usuarios en los datos.');
        }
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
}

function solicitarMensajeActivo(idEvento){

    Swal.fire({
        icon: 'info',  // Icono de error
        title: '¡Ya casi terminas tu reserva!',
        input: 'text', // Tipo de campo de entrada
        text: 'Hemos enviado una palabra al correo ' + correo + ", ingresa la palabra.",  // Muestra el mensaje de error
        inputPlaceholder: 'Ingresa la palabra',
        showCancelButton: true, // Mostrar el botón de cancelación
        confirmButtonText: 'Enviar', // Texto para el botón de confirmación
        confirmButtonColor: '#D4AF37',
        cancelButtonText: 'Cancelar', // Texto para el botón de cancelación
        inputValidator: (value) => {
            // Validar que el campo no esté vacío
            if (!value) {
                return '¡Necesitas escribir una palabra!';
            }else{

                const palabra = value;
            
                console.log(palabra);

                const data = {
                    code: palabra
                };
                fetch(`https://requeproyectoweb-production.up.railway.app/api/events/${idEvento}/confirm-delete`, {
                    method: "POST", // Enviar como PUT
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (!response.ok) {
                        // Si la respuesta no es ok, lanza un error con el mensaje recibido del servidor
                                return response.json().then(errorData => {
                                    throw new Error(errorData.message); // Lanza el error con el mensaje del servidor
                                });
                            }
                    return response.json(); // Si la respuesta es ok, continua
                })
                .then(data => {

                    Swal.fire('¡Éxito!', `Has eliminado el evento!`, 'success');
                    cargarEventos();
                })
                .catch(error => {
                    console.log(error);
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Ups!',
                        text: error.message,  // Muestra el mensaje de error
                        confirmButtonText: 'Volver a ingresarla',
                        confirmButtonColor: '#D4AF37',  // Color del botón
                    }).then(() => {
                        //en caso de no ser vuelve a solicitar el mensaje
                        solicitarMensajeActivo(idEvento)
                    });
                });

                
            }
        }
    }).then((result) => {});
}

function solicitarSMSAgotado(idEvento){

    Swal.fire({
        icon: 'info',  // Icono de error
        title: '¡Ya casi eliminas el evento!',
        input: 'text', // Tipo de campo de entrada
        text: 'Hemos enviado un SMS ingresa la palabra.',  // Muestra el mensaje de error
        inputPlaceholder: 'Ingresa la palabra',
        showCancelButton: true, // Mostrar el botón de cancelación
        confirmButtonText: 'Enviar', // Texto para el botón de confirmación
        confirmButtonColor: '#D4AF37',
        cancelButtonText: 'Cancelar', // Texto para el botón de cancelación
        inputValidator: (value) => {
            // Validar que el campo no esté vacío
            if (!value) {
                return '¡Necesitas escribir una palabra!';
            }else{

                const palabra = value;
            
                console.log(palabra);

                const data = {
                    word: palabra
                };
                fetch(`https://requeproyectoweb-production.up.railway.app/api/events/${idEvento}/agotado-verify-sms`, {
                    method: "POST", // Enviar como PUT
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (!response.ok) {
                        // Si la respuesta no es ok, lanza un error con el mensaje recibido del servidor
                                return response.json().then(errorData => {
                                    throw new Error(errorData.message); // Lanza el error con el mensaje del servidor
                                });
                            }
                    return response.json(); // Si la respuesta es ok, continua
                })
                .then(data => {

                    enviarEmailAgotado(idEvento);
                    
                })
                .catch(error => {
                    console.log(error);
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Ups!',
                        text: error.message,  // Muestra el mensaje de error
                        confirmButtonText: 'Volver a ingresarla',
                        confirmButtonColor: '#D4AF37',  // Color del botón
                    }).then(() => {
                        //en caso de no ser vuelve a solicitar el mensaje
                        solicitarSMSAgotado(idEvento)
                    });
                });

                
            }
        }
    }).then((result) => {});
}

function solicitarCorreoAgotado(idEvento){

    Swal.fire({
        icon: 'info',  // Icono de error
        title: '¡Ya casi!',
        input: 'text', // Tipo de campo de entrada
        text: 'Hemos enviado una palabra al correo ' + correo + ", ingresa la palabra.",  // Muestra el mensaje de error
        inputPlaceholder: 'Ingresa la palabra',
        showCancelButton: true, // Mostrar el botón de cancelación
        confirmButtonText: 'Enviar', // Texto para el botón de confirmación
        confirmButtonColor: '#D4AF37',
        cancelButtonText: 'Cancelar', // Texto para el botón de cancelación
        inputValidator: (value) => {
            // Validar que el campo no esté vacío
            if (!value) {
                return '¡Necesitas escribir una palabra!';
            }else{

                const palabra = value;
            
                console.log(palabra);

                const data = {
                    code: palabra
                };
                fetch(`https://requeproyectoweb-production.up.railway.app/api/events/${idEvento}/agotado-verify-email`, {
                    method: "POST", // Enviar como PUT
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (!response.ok) {
                        // Si la respuesta no es ok, lanza un error con el mensaje recibido del servidor
                                return response.json().then(errorData => {
                                    throw new Error(errorData.message); // Lanza el error con el mensaje del servidor
                                });
                            }
                    return response.json(); // Si la respuesta es ok, continua
                })
                .then(data => {

                    confirmarEliminarAgotado(idEvento);
                    
                })
                .catch(error => {
                    console.log(error);
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Ups!',
                        text: error.message,  // Muestra el mensaje de error
                        confirmButtonText: 'Volver a ingresarla',
                        confirmButtonColor: '#D4AF37',  // Color del botón
                    }).then(() => {
                        //en caso de no ser vuelve a solicitar el mensaje
                        solicitarMensaje();
                    });
                });

                
            }
        }
    }).then((result) => {});
}

function enviarEmailAgotado(idEvento){


    const data = {
        email: correo
    };
    console.log(data);
    fetch(`https://requeproyectoweb-production.up.railway.app/api/events/${idEvento}/agotado-send-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar evento');
        }else{
        }
        return response.json();
    })
    .then(data => {
        solicitarCorreoAgotado(idEvento);
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

function confirmarEliminarAgotado(idEvento){


    const data = {
        email: correo
    };
    console.log(data);
    fetch(`https://requeproyectoweb-production.up.railway.app/api/events/${idEvento}/agotado-confirm-delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar evento');
        }else{
        }
        return response.json();
    })
    .then(data => {
        cargarEventos();
        Swal.fire({
            title: 'Listo!',
            text: 'El evento fue eliminado',
            icon: 'success'
        });
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