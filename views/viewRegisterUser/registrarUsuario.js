document.getElementById('volverLogin').addEventListener('click', function(event) {
    event.preventDefault();  // Previene la acción por defecto del enlace
    window.location.href = "http://localhost:3000/Login";  // Redirige a la nueva URL
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



// Obtener los elementos de los campos
const nombreInput = document.getElementById('reg_nombre');
const identificacionInput = document.getElementById('reg_identificacion');
const emailInput = document.getElementById('reg_email');
const telefonoInput = document.getElementById('reg_numTelefono');
const usuarioInput = document.getElementById('reg_usuario');
const passInput = document.getElementById('password');

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
    const regex = /^\d{1}-\d{4}-\d{4}$/; // Formato 0-0000-0000
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


