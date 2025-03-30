var precio = 0;

document.addEventListener("DOMContentLoaded", () => {
    const evento = JSON.parse(sessionStorage.getItem("eventoSeleccionado"));

    if (evento) {
        

        // Actualizar los elementos del DOM con los datos del evento
        document.getElementById("nameEventos").textContent = evento.nombre_evento;
        document.getElementById("imagenEvento").src = `/uploads/eventos/${evento.imagen}`;
        document.getElementById("descriptionEvent").textContent = evento.descripcion;
        document.getElementById("viewestado").textContent = evento.estado;
        document.getElementById("viewconcierto").textContent = evento.categoria;
        document.getElementById("viewfecha").textContent = new Date(evento.fecha).toLocaleDateString();
        document.getElementById("viewubicacion").textContent = evento.ubicacion;
        document.getElementById("viewprecio").textContent = `₡${evento.precio}`;
        precio= evento.precio;
        document.getElementById("btnReservar").setAttribute("data-evento-id", evento.id_evento);
    } else {
        console.log("No se encontró el evento.");
    }
});


btnAtrasVerEvento.addEventListener('click', function(event) {
    event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
    
    // Redirigir al usuario a la nueva URL
    window.location.href = 'http://localhost:3000/VerEventos';
});

btnReservar.addEventListener('click', function(event) {
    event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
    const idEvento = event.target.getAttribute("data-evento-id");
    const nombre = document.getElementById("nameEventos").textContent;
    console.log("Evento ID:", idEvento);

    // Guardar los valores en sessionStorage
    sessionStorage.setItem("idEvento", idEvento);
    sessionStorage.setItem("nombreEvento", nombre);
    sessionStorage.setItem("precio", precio);
    // Redirigir al usuario a la nueva URL
    window.location.href = `http://localhost:3000/ReservarEvento`;


});
