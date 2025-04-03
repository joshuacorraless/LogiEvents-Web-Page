var idUser=sessionStorage.getItem("userID");
var tipoUsuario=sessionStorage.getItem("tipoUsuario");

if (!idUser || tipoUsuario !== "administrador") {
    window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/Login'; 
}


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
    // Verificar que el botón existe antes de agregar el event listener
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            // Redirigir a la URL deseada
            window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/EventosAdmin';  // Cambia la URL por la que necesites
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

    const form = document.getElementById('formRegistrar');
    const formData = new FormData(form);
    var fechaFormateada = "";
    var hora = "";
    const fechaInput = document.getElementById("regevento_fecha");
    console.log(fechaInput);

    const fechaCompleta = fechaInput ? fechaInput.value : null;
    
    if (!fechaCompleta) {
        console.error("El campo de fecha está vacío.");
    } else {
        const fechaObjeto = new Date(fechaCompleta);
        fechaFormateada = fechaObjeto.toISOString().split("T")[0];
        hora = fechaObjeto.toTimeString().slice(0, 5);
    
        console.log("Fecha formateada:", fechaFormateada);
        console.log("Hora:", hora);
    }

    console.log(fechaCompleta, hora, fechaFormateada);
    const eventoData = {
        nombre_evento: document.getElementById('regevento_nombre').value,
        descripcion: document.getElementById('regevento_descripcion').value,
        fecha: fechaFormateada,
        hora: hora,
        ubicacion: document.getElementById('regevento_ubicacion').value,
        capacidad: document.getElementById('regevento_capacidad').value,
        categoria: document.getElementById('regevento_categoria').value,
        precio: document.getElementById('regevento_precio').value,
        estado: document.getElementById('regevento_estado').value
    };

    // Verificar si se ha seleccionado una imagen
    const imagenInput = document.getElementById('regevento_imagen');
    if (imagenInput.files.length > 0) {
        formData.append('regevento_imagen', imagenInput.files[0]);
    } else {
        // Manejar el error si la imagen no ha sido seleccionada
        document.getElementById('imagenError').style.display = 'block';
        return;
    }
    fetch("https://requeproyectoweb-production.up.railway.app/api/eventos", {
        method: "POST",
        body: eventoData
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

