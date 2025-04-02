//VALIDACION DE SEGURIDAD, EVITA QUE LOS USUARIOS ACCEDAN A SITOS SIN PERMISOS
let idUser = sessionStorage.getItem("userID");
let tipoUsuario = sessionStorage.getItem("tipoUsuario");
console.log(tipoUsuario);
console.log(idUser);

if (!idUser || tipoUsuario !== "usuario") {
    window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app//Login';
}



const mostPopProducts = document.querySelector(".most-popular-products");


fetch('https://requeproyectoweb-production-3d39.up.railway.app//api/eventos')
	.then((respone) => {
		return respone.json();
	})
	.then((data) => {
        //carga las card insertando el codigo en el html
		data.map((product) => {
			const { id_evento, nombre_evento, precio, imagen, estado,fecha } = product;
			mostPopProducts.innerHTML += `
        <div class="product-card" data-product-id="${id_evento}">
					<div class="product-card__container">
						<div class="product-card__img">
							<img src="/uploads/eventos/${imagen}" alt="${nombre_evento}" />
						</div>
					</div>
					<div class="product-card__description">
						<div class="product-card__text fw-bold fs-4">${nombre_evento}</div>
						<div class="product-card__price">${estado}</div>
						<div class="product-card__price">₡${precio}</div>
						<div class="product-card__price">${new Date(fecha).toLocaleDateString()}</div>
						<div class="product-card__price">${new Date(fecha).toLocaleTimeString()}</div>
					</div>
					<div class="product-card__color">
						
						<button class="btn btn-success d-flex align-items-center gap-2 btn-buy botones" data-product-id="${id_evento}">
							<i class="bi bi-cart"></i> Comprar
						</button>
					</div>
				</div>
        `;
		});
		
		const botonesCompra = document.querySelectorAll(".botones");
		botonesCompra.forEach((boton) => {
			boton.addEventListener("click", async (event) => {
				const idEvento = boton.getAttribute("data-product-id"); // Obtener el ID del evento
				const eventos = await obtenerEventos(); // Cargar eventos desde la API
				const eventoSeleccionado = eventos.find(e => e.id_evento == idEvento); // Buscar el evento
	
				if (eventoSeleccionado) {
					console.log("Evento encontrado:", eventoSeleccionado);
					mostrarEvento(eventoSeleccionado);
				} else {
					console.log("Evento no encontrado.");
				}
			});
		});
		
	});

// Función para obtener los eventos desde la API
async function obtenerEventos() {
	try {
		const respuesta = await fetch("https://requeproyectoweb-production-3d39.up.railway.app//api/eventos");
		if (!respuesta.ok) {
			throw new Error("Error al obtener los eventos");
		}
		return await respuesta.json();
	} catch (error) {
		console.error("Error al cargar los eventos:", error);
		return [];
	}
}

// Función para mostrar la información del evento en la página
function mostrarEvento(evento) {
	sessionStorage.setItem("eventoSeleccionado", JSON.stringify(evento));
	window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app//VerEvento';
}