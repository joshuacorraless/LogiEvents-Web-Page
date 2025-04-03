document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEditarEvento');
    const titleElement = document.querySelector('.title');
    const priceInput = document.getElementById('precio');
    const locationInput = document.getElementById('ubicacion');
    const capacityInput = document.getElementById('capacidad');
    const uploadArea = document.querySelector('.upload-area');
    const submitButton = document.querySelector('.btn-primary');
    const cancelButton = document.querySelector('.btn-secondary');
    const imageInput = document.createElement('image');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.style.display = 'none';
    imageInput.name = 'imagen'; // Importante para el FormData
    document.body.appendChild(imageInput);
    const idEvento = sessionStorage.getItem('idEventoEditar');
    let currentImageUrl = null;
    let cloudinaryPublicId = null; // Para almacenar el public_id de la imagen en Cloudinary
    

    if (!idEvento) {
        mostrarError('No se encontró el ID del evento', 'https://requeproyectoweb-production-3d39.up.railway.app/EventosAdmin');
        return;
    }

    // Mostrar loading
    titleElement.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Cargando evento...';

    cargarDatosEvento(idEvento);
    setupEventListeners();

    function setupEventListeners() {
        uploadArea.addEventListener('click', handleUploadClick);
        imageInput.addEventListener('change', handleImageSelection);
        setupDragAndDrop();
        submitButton.addEventListener('click', handleFormSubmit);
        if (cancelButton) {
            cancelButton.addEventListener('click', confirmCancel);
        }
    }

    async function cargarDatosEvento(id) {
        try {
            const eventos = await obtenerEventos(); // Cargar eventos desde la API correctamente
            const eventoSeleccionado = eventos.find(e => e.id_evento == id);
    
            if (eventoSeleccionado) {
                console.log("Evento encontrado:", eventoSeleccionado);
                updateUIWithEventData(eventoSeleccionado);
            } else {
                console.log("Evento no encontrado.");
            }
        } catch (error) {
            console.error("Error al cargar el evento:", error);
        }
    }

    function updateUIWithEventData(evento) {
        // Llenar campos del formulario
        titleElement.textContent = evento.nombre || 'Editar Evento';
        priceInput.value = evento.precio || '';
        locationInput.value = evento.ubicacion || '';
        capacityInput.value = evento.capacidad || '';
        
        // Mostrar imagen si existe
        if (evento.imagenUrl) {
            currentImageUrl = evento.imagenUrl;
            
            // Extraer el public_id de la URL de Cloudinary
            // Si el evento ya tiene un public_id guardado, usarlo
            if (evento.imagenPublicId) {
                cloudinaryPublicId = evento.imagenPublicId;
            } else {
                // Intentar extraer el public_id de la URL
                try {
                    // Las URLs de Cloudinary suelen seguir este patrón:
                    // https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
                    const urlRegex = /\/v\d+\/(.+)\.\w+$/;
                    const match = evento.imagenUrl.match(urlRegex);
                    
                    if (match && match[1]) {
                        cloudinaryPublicId = match[1]; // folder/filename
                    }
                } catch (error) {
                    console.warn('No se pudo extraer el public_id de la URL:', error);
                    // Continuamos sin el public_id, lo que significa que no podremos eliminar
                    // la imagen antigua si el usuario sube una nueva
                }
            }
            
            showImagePreview(evento.imagenUrl);
        }
    }

    function handleUploadClick(e) {
        if (e.target.tagName === 'BUTTON' || e.target === uploadArea) {
            imageInput.click();
        }
    }

    function handleImageSelection(e) {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo no válido',
                    text: 'Por favor selecciona una imagen válida (JPEG, PNG, etc.)',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            
            // Validar tamaño de archivo (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo demasiado grande',
                    text: 'La imagen no puede superar los 5MB',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            
            // Mostrar vista previa localmente
            showImagePreview(URL.createObjectURL(file));
            
            // Cambiar estado para indicar que hay una nueva imagen
            currentImageUrl = null;
            cloudinaryPublicId = null;
        }
    }

    function setupDragAndDrop() {
        // Prevenir comportamientos por defecto
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        // Resaltar el área
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlightArea, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlightArea, false);
        });

        // Manejar archivos soltados
        uploadArea.addEventListener('drop', handleDrop, false);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlightArea() {
        uploadArea.classList.add('border-primary', 'bg-light');
    }

    function unhighlightArea() {
        uploadArea.classList.remove('border-primary', 'bg-light');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file) {
            // Validaciones igual que en handleImageSelection
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo no válido',
                    text: 'Por favor selecciona una imagen válida',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo demasiado grande',
                    text: 'La imagen no puede superar los 5MB',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            
            currentImageUrl = null;
            cloudinaryPublicId = null;
            showImagePreview(URL.createObjectURL(file));
            imageInput.files = dt.files; // Asignar el archivo al input
        }
    }

    function showImagePreview(imageSrc) {
        uploadArea.innerHTML = `
            <img src="${imageSrc}" class="img-thumbnail mb-2 preview-image">
            <button type="button" class="btn btn-outline-secondary btn-sm change-image">
                Cambiar imagen
            </button>
        `;
        
        // Agrega event listener al nuevo botón
        document.querySelector('.change-image').addEventListener('click', () => {
            imageInput.click();
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validación del formulario
        if (!validateForm()) {
            return;
        }
    
        try {
            // Estado de carga
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Guardando cambios...
            `;
    
            // Preparar FormData usando el formulario real y agregando campos adicionales
            const formData = new FormData(document.getElementById('formEditarEvento'));
            
            // Agregar campos adicionales que no están en el formulario
            formData.append('id_evento', idEvento);
            
            // Manejo especial de la imagen
            if (imageInput.files.length > 0) {
                formData.append('imagen', imageInput.files[0]);
            } else if (currentImageUrl) {
                formData.append('imagenUrl', currentImageUrl);
                if (cloudinaryPublicId) {
                    formData.append('imagenPublicId', cloudinaryPublicId);
                }
            }
    
            // Configuración de la petición
            const response = await fetch(
                `https://requeproyectoweb-production.up.railway.app/api/eventos/${idEvento}`,
                {
                    method: 'PUT',
                    body: formData
                    // No incluir headers 'Content-Type' para FormData
                }
            );
    
            // Manejo de respuestas
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || 
                    `Error ${response.status}: ${response.statusText}`
                );
            }
    
            // Feedback al usuario
            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Los cambios se guardaron correctamente',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
                timer: 3000
            });
    
            // Redirección con retraso para mejor UX
            setTimeout(() => {
                window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/EventosAdmin';
            }, 500);
    
        } catch (error) {
            console.error('Error en handleFormSubmit:', error);
            
            // Mensajes de error específicos
            let mensajeError;
            if (error.message.includes('No se proporcionaron datos')) {
                mensajeError = 'Debe modificar al menos un campo';
            } else if (error.message.includes('Failed to fetch')) {
                mensajeError = 'Error de conexión con el servidor';
            } else {
                mensajeError = error.message || 'Error al guardar los cambios';
            }
            
            mostrarError(mensajeError);
            
        } finally {
            // Restaurar estado normal del botón
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar Cambios';
        }
    }
    
    function validateForm() {
        // Validar precio
        if (!priceInput.value || isNaN(priceInput.value) || parseFloat(priceInput.value) <= 0) {
            mostrarError('Por favor ingrese un precio válido (mayor que 0)');
            priceInput.focus();
            return false;
        }
        
        // Validar ubicación
        if (!locationInput.value.trim()) {
            mostrarError('Por favor ingrese una ubicación');
            locationInput.focus();
            return false;
        }
        
        // Validar capacidad
        if (!capacityInput.value || isNaN(capacityInput.value) || parseInt(capacityInput.value) <= 0) {
            mostrarError('Por favor ingrese una capacidad válida (mayor que 0)');
            capacityInput.focus();
            return false;
        }
        
        return true;
    }

    function confirmCancel() {
        Swal.fire({
            title: '¿Descartar cambios?',
            text: 'Todos los cambios no guardados se perderán',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, descartar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/EventosAdmin';
            }
        });
    }

    function mostrarError(mensaje, redirectUrl) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#b99725'
        }).then(() => {
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        });
    }

    // Función para obtener los eventos desde la API
    async function obtenerEventos() {
        try {
            const respuesta = await fetch("https://requeproyectoweb-production.up.railway.app/api/eventos");
            if (!respuesta.ok) {
                throw new Error("Error al obtener los eventos");
            }
            return await respuesta.json();
        } catch (error) {
            console.error("Error al cargar los eventos:", error);
            return [];
        }
    }
});