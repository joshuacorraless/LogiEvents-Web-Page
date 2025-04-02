document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.card-body');
    const titleElement = document.querySelector('.title');
    const priceInput = document.getElementById('precio');
    const locationInput = document.getElementById('ubicacion');
    const capacityInput = document.getElementById('capacidad');
    const uploadArea = document.querySelector('.upload-area');
    const submitButton = document.querySelector('.btn-primary');
    const cancelButton = document.querySelector('.btn-secondary');
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.style.display = 'none';
    document.body.appendChild(imageInput);
    const idEvento = sessionStorage.getItem('idEventoEditar');
    let currentImageUrl = null;

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
            
            currentImageUrl = null; // Reseteamos la URL si suben nueva imagen
            showImagePreview(URL.createObjectURL(file));
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
            showImagePreview(URL.createObjectURL(file));
            imageInput.files = dt.files; // Asignar el archivo al input
        }
    }

    function showImagePreview(imageSrc) {
        uploadArea.innerHTML = `
            <img src="${imageSrc}" class="img-thumbnail mb-2" style="max-height: 200px;">
            <button class="btn btn-outline-secondary btn-sm">Cambiar imagen</button>
            <p class="small text-muted mt-1">Tamaño máximo: 5MB</p>
        `;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!validateForm()) return;
        
        try {
            // Mostrar loading en el botón
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Guardando...
            `;
            
            // Preparar datos para enviar
            const formData = new FormData();
            formData.append('precio', priceInput.value);
            formData.append('ubicacion', locationInput.value);
            formData.append('capacidad', capacityInput.value);
            
            // Manejo de imágenes
            if (imageInput.files.length > 0) {
                // Subir nueva imagen primero
                const uploadResponse = await fetch('https://requeproyectoweb-production-3d39.up.railway.app/upload', {
                    method: 'POST',
                    body: (() => {
                        const fd = new FormData();
                        fd.append('imagen', imageInput.files[0]);
                        return fd;
                    })()
                });
                
                if (!uploadResponse.ok) {
                    throw new Error('Error al subir la nueva imagen');
                }
                
                const uploadResult = await uploadResponse.json();
                formData.append('imagenUrl', uploadResult.url);
            } else if (currentImageUrl) {
                // Mantener la imagen existente
                formData.append('imagenUrl', currentImageUrl);
            } else {
                // No hay imagen seleccionada ni existente
                throw new Error('Debes seleccionar una imagen para el evento');
            }
            
            // Enviar datos al servidor
            const response = await fetch(`https://requeproyectoweb-production.up.railway.app/api/eventos/${idEvento}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Mostrar mensaje de éxito
            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Evento actualizado correctamente',
                confirmButtonText: 'Aceptar'
            });
            
            // Redirigir a la lista de eventos
            window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/EventosAdmin';
            
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
            mostrarError(error.message || 'Ocurrió un error al actualizar el evento');
        } finally {
            // Restaurar botón
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