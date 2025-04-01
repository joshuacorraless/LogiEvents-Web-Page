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
            window.location.href = 'http://localhost:3000/EventosAdmin';  // Cambia la URL por la que necesites
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

function enviarEvento(){

    const form = document.getElementById("formRegistrar");
    //recoleccion de datos
    const formData = new FormData(form);

    const fechaCompleta = formData.get("regevento_fecha"); // Obtiene el valor en formato YYYY-MM-DDTHH:MM
    const fechaObjeto = fechaCompleta ? new Date(fechaCompleta) : null; // Convierte a objeto Date

    // Formato YYYY-MM-DD
    const fechaFormateada = fechaObjeto.toISOString().split("T")[0];

    // Formato HH:MM
    const hora = fechaObjeto.toTimeString().slice(0, 5);


    const data = {
        nombre_evento: formData.get("regevento_nombre"),
        descripcion: formData.get("regevento_descripcion"),
        fecha: fechaFormateada, // Fecha formateada
        hora: hora, // Hora formateada
        precio: formData.get("regevento_precio"),
        capacidad: formData.get("regevento_capacidad"),
        ubicacion: formData.get("regevento_ubicacion"),
        estado: formData.get("regevento_estado"),
        categoria: formData.get("regevento_categoria"),
        imagen: formData.get("regevento_imagen").name // Esto devuelve el archivo si hay uno
    };

    console.log(data); // Para verificar los datos antes de enviarlos


    fetch(`http://localhost:3000/api/Eventos`, {
        method: "POST", // Enviar como POST
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
        console.log("Evento Registrado:", data);
        subirImagen();
        // Muestra una alerta de éxito
        Swal.fire({
            icon: 'success',  // Icono de éxito
            title: '¡Evento registrado correctamente!',
            text: 'Los cambios se guardaron con éxito.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#b99725',  // Color del botón
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

function subirImagen() {
    const inputFile = document.getElementById("regevento_imagen");
    const formData = new FormData();
    formData.append("imagen", inputFile.files[0]);
    console.log(inputFile.files[0]),
    fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData
    })
    .then(res => console.log(res))
    .catch(error => console.error("Error:", error));
}
