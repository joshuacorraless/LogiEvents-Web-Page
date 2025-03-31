document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const form = document.querySelector('form');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    });

    // Validación del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            registrarAdministrador();
        }
    });

    // Función para validar el formulario
    function validarFormulario() {
        let valido = true;
        
        // Validar nombre
        const nombre = document.getElementById('reg_nombre');
        if (!nombre.value.trim()) {
            document.getElementById('nombreError').style.display = 'block';
            valido = false;
        } else {
            document.getElementById('nombreError').style.display = 'none';
        }

        // Validar identificación (formato: 0-0000-0000)
        const identificacion = document.getElementById('reg_identificacion');
        const idRegex = /^\d-\d{4}-\d{4}$/;
        if (!idRegex.test(identificacion.value)) {
            document.getElementById('identificacionError').style.display = 'block';
            valido = false;
        } else {
            document.getElementById('identificacionError').style.display = 'none';
        }

        // Validar email
        const email = document.getElementById('reg_email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            document.getElementById('emailError').style.display = 'block';
            valido = false;
        } else {
            document.getElementById('emailError').style.display = 'none';
        }

        // Validar teléfono (8 dígitos)
        const telefono = document.getElementById('reg_numTelefono');
        const telRegex = /^\d{8}$/;
        if (!telRegex.test(telefono.value)) {
            document.getElementById('telefonoError').style.display = 'block';
            valido = false;
        } else {
            document.getElementById('telefonoError').style.display = 'none';
        }

        // Validar usuario
        const usuario = document.getElementById('reg_usuario');
        if (!usuario.value.trim()) {
            document.getElementById('usuarioError').style.display = 'block';
            valido = false;
        } else {
            document.getElementById('usuarioError').style.display = 'none';
        }

        // Validar contraseña (mínimo 6 caracteres)
        if (passwordInput.value.length < 6) {
            document.getElementById('passError').style.display = 'block';
            valido = false;
        } else {
            document.getElementById('passError').style.display = 'none';
        }

        return valido;
    }

    // Función para registrar administrador
    function registrarAdministrador() {
        const adminData = {
            nombre_completo: document.getElementById('reg_nombre').value,
            identificacion: document.getElementById('reg_identificacion').value,
            correo: document.getElementById('reg_email').value,
            telefono: document.getElementById('reg_numTelefono').value,
            rol: document.getElementById('rol').value,
            id_usuario: document.getElementById('id').value,
            username: document.getElementById('reg_usuario').value,
            password: passwordInput.value,
            tipo_usuario: 'administrador'
        };

        // Mostrar loading
        Swal.fire({
            title: 'Registrando administrador',
            html: 'Por favor espere...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Enviar datos al servidor
        fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Administrador registrado correctamente',
                icon: 'success'
            }).then(() => {
                // Limpiar formulario después de registro exitoso
                form.reset();
                // Redirigir o hacer otra acción
                // window.location.href = 'visualizarAdministradores.html';
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo registrar el administrador: ' + error.message,
                icon: 'error'
            });
        });
    }

    // Botón cancelar
    document.querySelector('.btn-secondary').addEventListener('click', function() {
        Swal.fire({
            title: '¿Cancelar registro?',
            text: 'Los datos no guardados se perderán',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar'
        }).then((result) => {
            if (result.isConfirmed) {
                form.reset();
                window.location.href = 'http://localhost:3000/api/VerAdmins';
            }
        });
    });
});