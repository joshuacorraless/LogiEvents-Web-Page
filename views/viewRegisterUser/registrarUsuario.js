document.getElementById('volverLogin').addEventListener('click', function(event) {
    event.preventDefault();  // Previene la acción por defecto del enlace
    window.location.href = "https://requeproyectoweb-production-3d39.up.railway.app/Login";  // Redirige a la nueva URL
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


//VALIDACION DE LOS CAMPOS
// Obtener los elementos de los campos a validar
const nombreInput = document.getElementById('reg_nombre');
const identificacionInput = document.getElementById('reg_identificacion');
const emailInput = document.getElementById('reg_email');
const telefonoInput = document.getElementById('reg_numTelefono');
const usuarioInput = document.getElementById('reg_usuario');
const passInput = document.getElementById('password');
const botonRegistrarse = document.getElementById('btnConfirmarRegistro');

// Obtener los mensajes de error
const nombreError = document.getElementById('nombreError');
const identificacionError = document.getElementById('identificacionError');
const emailError = document.getElementById('emailError');
const telefonoError = document.getElementById('telefonoError');
const usuarioError = document.getElementById('usuarioError');
const passError = document.getElementById('passError');

// Validación en tiempo real
nombreInput.addEventListener('input', function() {
    if (nombreInput.value.trim() === '') {
        nombreError.style.display = 'block';
    } else {
        nombreError.style.display = 'none';
    }
});

identificacionInput.addEventListener('input', function() {
    const regex = /^\d{9}$/;
    if (!regex.test(identificacionInput.value.trim())) {
        identificacionError.style.display = 'block';
    } else {
        identificacionError.style.display = 'none';
    }
});

emailInput.addEventListener('input', function() {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // Formato email
    if (!regex.test(emailInput.value.trim())) {
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});

telefonoInput.addEventListener('input', function() {
    const regex = /^\d{8}$/; // Formato 00000000
    console.log(34234);
    if (!regex.test(telefonoInput.value.trim())) {
        telefonoError.style.display = 'block';
    } else {
        telefonoError.style.display = 'none';
    }
});

usuarioInput.addEventListener('input', function() {
    if (usuarioInput.value.trim() === '') {
        usuarioError.style.display = 'block';
    } else {
        usuarioError.style.display = 'none';
    }
});

passInput.addEventListener('input', function() {
    if (passInput.value.trim().length < 6) {
        passError.style.display = 'block';
    } else {
        passError.style.display = 'none';
    }
});


//VALIDACION DE LOS CAMPOS AL PRESIONAR EL BOTON
botonRegistrarse.addEventListener('click', function() {

    let valid = true;

    if (nombreInput.value.trim() === '') {
        nombreError.style.display = 'block';
        valid = false;
    } else {
        nombreError.style.display = 'none';
    }

    const identificacionRegex = /^\d{9}$/;
    if (!identificacionRegex.test(identificacionInput.value.trim())) {
        identificacionError.style.display = 'block';
        valid = false;
    } else {
        identificacionError.style.display = 'none';
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.style.display = 'block';
        valid = false;
    } else {
        emailError.style.display = 'none';
    }

    const telefonoRegex = /^\d{8}$/; // Formato 00000000
    if (!telefonoRegex.test(telefonoInput.value.trim())) {
        telefonoError.style.display = 'block';
        valid = false;
    } else {
        telefonoError.style.display = 'none';
    }

    if (usuarioInput.value.trim() === '') {
        usuarioError.style.display = 'block';
        valid = false;
    } else {
        usuarioError.style.display = 'none';
    }

    if (passInput.value.trim().length < 6) {
        passError.style.display = 'block';
        valid = false;
    } else {
        passError.style.display = 'none';
    }

    valid = true;
    if (valid) {
        
        enviarRegistro();
        console.log("entro");
    }
});

//Envia el registro que realizo el usuario
function enviarRegistro(){

    const form = document.getElementById("formRegister");

    if (!form) {
        console.error("Formulario no encontrado");
        return;
    }
    const formData = new FormData(form);
    console.log(form);
    const data = {
        nombre_completo: formData.get("reg_nombre"),
        identificacion: formData.get("reg_identificacion"),
        correo: formData.get("reg_email"),
        telefono: formData.get("reg_numTelefono"),
        username: formData.get("reg_usuario"),
        password: formData.get("password"),
        tipo_usuario: "usuario",
    };

    console.log(data);

    fetch(`https://requeproyectoweb-production.up.railway.app/api/usuarios`, {
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
        console.log("Usuario actualizado:", data);
    
        // Muestra una alerta de éxito
        Swal.fire({
            icon: 'success',  // Icono de éxito
            title: '¡Registrado/a!',
            text: 'Inicia sesion para vivir una nueva experiencia.',
            confirmButtonText: 'Iniciar Sesion',
            confirmButtonColor: '#b99725',  // Color del botón
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "https://requeproyectoweb-production-3d39.up.railway.app/Login";
            }
        });
    
    })
    .catch(error => {
        // Muestra una alerta de error
        Swal.fire({
            icon: 'error',  // Icono de error
            title: '¡Ups!',
            text: error.message,  // Muestra el mensaje de error
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#b99725',  // Color del botón
        });
    });

}