document.getElementById('Registrarme').addEventListener('click', function(event) {
    event.preventDefault();  // Previene la acción por defecto del enlace
    window.location.href = "https://requeproyectoweb-production-3d39.up.railway.app//RegistarUsuario";  // Redirige a la nueva URL
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


document.getElementById('btnAcceder').addEventListener('click', function(event) {
    event.preventDefault();  // Previene la acción por defecto del enlace

    //valida los campos del username y la contrasena
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");

    let valid = true;

        // Limpiar los mensajes de error previos
        usernameError.style.display = "none";
        passwordError.style.display = "none";

        // Validar el campo de usuario
        if (!usernameInput.value.trim()) {
            usernameError.style.display = "block";  // Mostrar mensaje de error
            valid = false;
        }

        // Validar el campo de contraseña
        if (!passwordInput.value.trim()) {
            passwordError.style.display = "block";  // Mostrar mensaje de error
            valid = false;
        }

        if (valid) { //si no hay errores, validad las credenciales
            validarLogin();
        }
    
});


function validarLogin(){

    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const data = {
        username: formData.get("username"),
        password: formData.get("password"),
    };
    
    console.log(data);
    fetch(`https://requeproyectoweb-production-3d39.up.railway.app//api/Login`, {
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
        console.log(data);
        validarUsuario(data.id, data.tipo);
            
    })
    .catch(error => {
        // Muestra una alerta de error
        Swal.fire({
        icon: 'info',  // Icono de error
        title: '¡Ups!',
        text: error.message,  // Muestra el mensaje de error
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#D4AF37',  // Color del botón
        });
    });

}

function validarUsuario(id, tipoUsuario){
    sessionStorage.setItem("userID", id);  //Id del usuario utilizado en las paginas
    sessionStorage.setItem("tipoUsuario", tipoUsuario);  //Tipo del usuario utilizado en las paginas
    console.log(id);
    console.log(tipoUsuario);
    if (tipoUsuario === "usuario") {
        window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app//VerEventos';
    } else if (tipoUsuario === "administrador") {
        window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app//DashBoard';
    }

}