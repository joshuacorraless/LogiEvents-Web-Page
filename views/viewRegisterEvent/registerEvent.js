document.getElementById('regevento_imagen').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagenEvento').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

 // Validación de Nombre
 document.getElementById('regevento_nombre').addEventListener('input', function() {
    var nombre = document.getElementById('regevento_nombre').value;
    if (nombre.trim() === "") {
        document.getElementById('nombreError').style.display = "block";
    } else {
        document.getElementById('nombreError').style.display = "none";
    }
});

// Validación de Fecha
document.getElementById('regevento_fecha').addEventListener('input', function() {
    var fechaInput = document.getElementById('regevento_fecha').value;
    var fechaActual = new Date();
    var fechaActualString = fechaActual.toISOString().slice(0, 16); // El formato es "YYYY-MM-DDTHH:MM"
    
    if (fechaInput < fechaActualString) {
        document.getElementById('fechaError').style.display = "block";
    } else {
        document.getElementById('fechaError').style.display = "none";
    }
});

// Validación de Capacidad
document.getElementById('regevento_capacidad').addEventListener('input', function() {
    var capacidad = document.getElementById('regevento_capacidad').value;
    if (capacidad <= 0) {
        document.getElementById('capacidadError').style.display = "block";
    } else {
        document.getElementById('capacidadError').style.display = "none";
    }
});

// Validación de Ubicación
document.getElementById('regevento_ubicacion').addEventListener('input', function() {
    var ubicacion = document.getElementById('regevento_ubicacion').value;
    if (ubicacion.trim() === "") {
        document.getElementById('ubicacionError').style.display = "block";
    } else {
        document.getElementById('ubicacionError').style.display = "none";
    }
});

// Validación de Ubicación
document.getElementById('regevento_descripcion').addEventListener('input', function() {
    var ubicacion = document.getElementById('regevento_descripcion').value;
    if (ubicacion.trim() === "") {
        document.getElementById('descError').style.display = "block";
    } else {
        document.getElementById('descError').style.display = "none";
    }
});

document.getElementById('regevento_imagen').addEventListener('input', function() {
    var imagenInput = document.getElementById('regevento_imagen');
    if (imagenInput.files.length === 0) {
        document.getElementById('imagenError').style.display = "block";
    } else {
        document.getElementById('imagenError').style.display = "none";
    }
});

document.getElementById('regevento_precio').addEventListener('input', function() {
    var precioInput = document.getElementById('regevento_precio');
    var precio = precioInput.value.trim();

    // Validar si el precio es un número entero mayor que 0
    if (!/^\d+$/.test(precio) || parseInt(precio) <= 0) {
        document.getElementById('usernameError').style.display = "block";  // Mostrar error
    } else {
        document.getElementById('usernameError').style.display = "none";   // Ocultar error
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón de cerrar dentro del modal
    const closeButton = document.getElementById('cerrarbtn');
    console.log(closeButton);
    // Verificar que el botón existe antes de agregar el event listener
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            // Redirigir a la URL deseada
            window.location.href = 'http://localhost:3000/Login';  // Cambia la URL por la que necesites
        });
    }
});


// Obtener el botón con el id 'closeButton'
const registerButton = document.getElementById('btnRegistrarEvento');

// Agregar el evento click al botón
registerButton.addEventListener('click', function() {
    
    var valid = true;
    
    // Validación de todos los campos
    if (document.getElementById('regevento_nombre').value.trim() === "") {
        document.getElementById('nombreError').style.display = "block";
        valid = false;
    }
    if (document.getElementById('regevento_fecha').value < new Date().toISOString().slice(0, 16)) {
        document.getElementById('fechaError').style.display = "block";
        valid = false;
    }
    if (document.getElementById('regevento_capacidad').value <= 0) {
        document.getElementById('capacidadError').style.display = "block";
        valid = false;
    }
    if (document.getElementById('regevento_ubicacion').value.trim() === "") {
        document.getElementById('ubicacionError').style.display = "block";
        valid = false;
    }
    if (document.getElementById('regevento_descripcion').value.trim() === "") {
        document.getElementById('descError').style.display = "block";
        valid = false;
    }

    if (document.getElementById('regevento_imagen').files.length === 0) {
        document.getElementById('imagenError').style.display = "block";
        valid = false;
    }

    if (document.getElementById('regevento_precio').value.trim() === "" || !/^\d+$/.test(document.getElementById('regevento_precio').value.trim()) || parseInt(document.getElementById('regevento_precio').value.trim()) <= 0) {
        document.getElementById('usernameError').style.display = "block";  // Mostrar error
        valid = false;  // Marcar como no válido
    }

    if (valid) {
        enviarEvento();
    }

});

function enviarEvento() {
    const form = document.getElementById("formRegistrar");
    const formData = new FormData(form);
    
    // Obtener la imagen del input
    const imagenInput = document.getElementById('regevento_imagen');
    const imagenFile = imagenInput.files[0];
    
    // Validar que haya una imagen
    if (!imagenFile) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes seleccionar una imagen para el evento',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Primero subir la imagen a Cloudinary
    subirImagen(imagenFile)
        .then(uploadResult => {
            // Preparar datos del evento con la URL de la imagen
            const fechaCompleta = formData.get("regevento_fecha");
            const fechaObjeto = fechaCompleta ? new Date(fechaCompleta) : null;
            const fechaFormateada = fechaObjeto.toISOString().split("T")[0];
            const hora = fechaObjeto.toTimeString().slice(0, 5);

            const data = {
                nombre_evento: formData.get("regevento_nombre"),
                descripcion: formData.get("regevento_descripcion"),
                fecha: fechaFormateada,
                hora: hora,
                precio: formData.get("regevento_precio"),
                capacidad: formData.get("regevento_capacidad"),
                ubicacion: formData.get("regevento_ubicacion"),
                estado: formData.get("regevento_estado"),
                categoria: formData.get("regevento_categoria"),
                imagen: uploadResult.url,
                imagenPublicId: uploadResult.public_id
            };

            // Enviar datos del evento al servidor
            return fetch(`http://localhost:3000/api/eventos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Evento Registrado:", data);
            Swal.fire({
                icon: 'success',
                title: '¡Evento registrado correctamente!',
                text: 'Los cambios se guardaron con éxito.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#b99725',
            });
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: error.message,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#b99725',
            });
        });
}

// Función para subir imagen a Cloudinary
function subirImagen(file) {
    const formData = new FormData();
    formData.append("imagen", file);

    return fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Error al subir la imagen');
            });
        }
        return response.json();
    });
}