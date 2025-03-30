document.getElementById('Registrarme').addEventListener('click', function(event) {
    event.preventDefault();  // Previene la acción por defecto del enlace
    window.location.href = "http://localhost:3000/RegistarUsuario";  // Redirige a la nueva URL
});

document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    const icon = this.querySelector('i');

    // Alternar el tipo de input entre password y text
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash'); // Cambiar el ícono al de ojo cerrado
    } else {
        passwordField.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye'); // Cambiar el ícono al de ojo abierto
    }
});

function validarLogin(){

    const formData = new FormData(form);
    telefono =formData.get("loginForm");
    const data = {
        correo: formData.get("reserva_email"),
        telefono: '506'+formData.get("reserva_numeroTelefono"),
        nombre_completo: formData.get("reserva_nombre"),
        cantidad: formData.get("reserva_cantidadentradas"),
        id_evento: idEvento,
        id_usuario: 1
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
            // Si la respuesta no es ok, lanzamos un error con el mensaje recibido del servidor
                    return response.json().then(errorData => {
                        throw new Error(errorData.message); // Lanza el error con el mensaje del servidor
                    });
                }
        return response.json(); // Si la respuesta es ok, continuamos
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