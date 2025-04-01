//VALIDACION DE SEGURIDAD, EVITA QUE LOS USUARIOS ACCEDAN A SITOS SIN PERMISOS
let idUser = sessionStorage.getItem("userID");
let tipoUsuario = sessionStorage.getItem("tipoUsuario");
console.log(tipoUsuario);
console.log(idUser);

if (!idUser || tipoUsuario !== "usuario") {
    window.location.href = 'http://localhost:3000/Login';
}


var precio = 0;
var precioTotal = precio;
var idEvento = 0;
var tempReservationId =0;
var telefono =0;
document.addEventListener("DOMContentLoaded", () => {
    // Obtener el parámetro id de la URL
    
    idEvento = sessionStorage.getItem("idEvento");
    const nombre = sessionStorage.getItem("nombreEvento");
    precio = sessionStorage.getItem("precio");

    document.getElementById("reserva_nameEvent").textContent = nombre;
    document.getElementById("precioEntrada").textContent = "Precio por entrada: ₡"+precio;
    precioTotalElement.textContent = `Precio total: ₡${precio}`;
});

document.getElementById("CancelarReserva").addEventListener("click", function() {
    // Redirigir a otra página
    window.location.href = 'http://localhost:3000/VerEventos';
});

// Obtener los elementos del DOM
const cantidadEntradasInput = document.getElementById("reserva_cantidadentradas");
const precioTotalElement = document.getElementById("precioTotal");

// Función para calcular el precio total
function actualizarPrecioTotal() {
    const cantidadEntradas = parseInt(cantidadEntradasInput.value) || 0;  // Asegurarse de que es un número, 0 si no es válido
    const precioTotal = precio * cantidadEntradas;
    
    // Actualizar el contenido del precio total
    precioTotalElement.textContent = `Precio total: ₡${precioTotal}`;
}

// Escuchar el cambio en el número de entradas
cantidadEntradasInput.addEventListener("input", actualizarPrecioTotal);


//Envio de los datos
// Obtener el botón por su id
const btnConfirmarReserva = document.getElementById('btnConfirmarReserva');

const form = document.getElementById("formReservaEvento");
    
    
    
btnConfirmarReserva.addEventListener("click", function (event) {
            
    event.preventDefault();  // Evita que el formulario se envíe de inmediato

    const numeroTelefono = document.getElementById('reserva_numeroTelefono').value;
    const email = document.getElementById('reserva_email').value;
    const regexTelefono = /^[0-9]{8}$/;
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;  // Validación de correo electrónico
    const nombre = document.getElementById('reserva_nombre').value;

    

    if (!regexEmail.test(email)) {
        Swal.fire('¡Ups!', 'El correo electrónico no tiene un formato válido.', 'info');
    } 

    // Verifica si el nombre no está vacío
    if (nombre.trim() === '') {
        Swal.fire('¡Ups!', 'Ingresa un nombre válido.', 'info');
    }

    if ( regexEmail.test(email) && nombre.trim() !== '') {
        
        enviarReserva();
    }

    
});

function enviarReserva(){

    const formData = new FormData(form);
    telefono =formData.get("reserva_numeroTelefono");
    const data = {
        correo: formData.get("reserva_email"),
        telefono: formData.get("reserva_numeroTelefono"),
        nombre_completo: formData.get("reserva_nombre"),
        cantidad: formData.get("reserva_cantidadentradas"),
        id_evento: idEvento,
        id_usuario: idUser
    };
    
    console.log(data);
    fetch(`http://localhost:3000/api/reservations/start`, {
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
        console.log("Reserva hecha:", data);
        tempReservationId = data.tempReservationId;  
        solicitarMensaje();
            
            
        })
    .catch(error => {
        // Muestra una alerta de error
        Swal.fire({
        icon: 'error',  // Icono de error
        title: '¡Ups!',
        text: error.message,  // Muestra el mensaje de error
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#D4AF37',  // Color del botón
        });
    });

}

function solicitarMensaje(){

    // Mostrar el modal con SweetAlert2
    Swal.fire({
        icon: 'info',  // Icono de error
        title: '¡Ya casi terminas tu reserva!',
        input: 'text', // Tipo de campo de entrada
        text: 'Hemos enviado una palabra al numero ' + telefono + ", ingresa la palabra.",  // Muestra el mensaje de error
        inputPlaceholder: 'Ingresa la palabra',
        showCancelButton: true, // Mostrar el botón de cancelación
        confirmButtonText: 'Enviar', // Texto para el botón de confirmación
        confirmButtonColor: '#D4AF37',
        cancelButtonText: 'Cancelar', // Texto para el botón de cancelación
        inputValidator: (value) => {
            // Validar que el campo no esté vacío
            if (!value) {
                return '¡Necesitas escribir una palabra!';
            }
        }
    }).then((result) => {
        // Si el usuario hizo clic en el botón de confirmación
        if (result.isConfirmed) {
            // Obtien la palabra ingresada
            const palabra = result.value;
           
            console.log(palabra, tempReservationId);

            const data = {
                tempReservationId: tempReservationId,
                word: palabra
            };
            fetch(`http://localhost:3000/api/reservations/verify`, {
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

                    Swal.fire('¡Éxito!', `Has reservado el evento!`, 'success');
                    generarNotificacion(document.getElementById("reserva_nameEvent").textContent);
                        
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
    });

}

/*// Listener para el número de teléfono
document.getElementById('reserva_numeroTelefono').addEventListener('input', function () {
    const numeroTelefono = document.getElementById('reserva_numeroTelefono').value;
    const regexTelefono = /^[0-9]{8}$/;

    // Verifica si el número de teléfono es válido
    if (!regexTelefono.test(numeroTelefono)) {
        document.getElementById('reserva_numeroTelefono').classList.add('is-invalid');
    } else {
        document.getElementById('reserva_numeroTelefono').classList.remove('is-invalid');
    }
});*/

// Listener para el correo electrónico
document.getElementById('reserva_email').addEventListener('input', function () {
    const email = document.getElementById('reserva_email').value;
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


    // Verifica si el correo electrónico es válido
    if (!regexEmail.test(email)) {
        document.getElementById('reserva_email').classList.add('is-invalid');
    } else {
        document.getElementById('reserva_email').classList.remove('is-invalid');
    }
});

document.getElementById('reserva_nombre').addEventListener('input', function () {
    const nombre = document.getElementById('reserva_nombre').value;

    // Verifica si el campo nombre está vacío
    if (nombre.trim() === '') {
        document.getElementById('reserva_nombre').classList.add('is-invalid');
    } else {
        document.getElementById('reserva_nombre').classList.remove('is-invalid');
    }
});

function generarNotificacion(nombreEvento) {
    // Usar template literals para interpolar el valor de nombreEvento
    const notification = [
      { title: 'Acabas de realizar una reservación!', description: `Recuerda vivir tu experiencia con ${nombreEvento}` }
    ];
  
    // Guardar la notificación en sessionStorage
    sessionStorage.setItem('notifications', JSON.stringify(notification));
}