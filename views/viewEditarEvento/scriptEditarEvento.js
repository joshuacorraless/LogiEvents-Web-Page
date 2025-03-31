// scriptEditarEvento.js
document.addEventListener('DOMContentLoaded', function() {
    // ========== ELEMENTOS DEL DOM ==========
    const form = document.querySelector('.card-body');
    const titleElement = document.querySelector('.title');
    const priceInput = document.getElementById('precio');
    const locationInput = document.getElementById('ubicacion');
    const capacityInput = document.getElementById('capacidad');
    const uploadArea = document.querySelector('.upload-area');
    const submitButton = document.querySelector('.btn-primary');
    const cancelButton = document.querySelector('.btn-secondary');
    
    // Elemento input file oculto
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.style.display = 'none';
    document.body.appendChild(imageInput);
    
    // ========== VARIABLES GLOBALES ==========
    const idEvento = sessionStorage.getItem('idEventoEditar');
    let currentImageUrl = null;

    // ========== INICIALIZACIÓN ==========
    if (!idEvento) {
        mostrarError('No se encontró el ID del evento', 'http://localhost:3000/EventosAdmin');
        return;
    }

    // Mostrar loading
    titleElement.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Cargando evento...';
    
    // Cargar datos del evento
    cargarDatosEvento(idEvento);
    
    // Configurar eventos
    setupEventListeners();

    // ========== FUNCIONES PRINCIPALES ==========
    function setupEventListeners() {
        // Click en el área de subida
        uploadArea.addEventListener('click', handleUploadClick);
        
        // Cambio de imagen seleccionada
        imageInput.addEventListener('change', handleImageSelection);
        
        // Drag and drop
        setupDragAndDrop();
        
        // Envío del formulario
        submitButton.addEventListener('click', handleFormSubmit);
        
        // Botón cancelar
        if (cancelButton) {
            cancelButton.addEventListener('click', confirmCancel);
        }
    }

    async function cargarDatosEvento(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/eventos/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const evento = await response.json();
            
            // Actualizar UI con los datos del evento
            updateUIWithEventData(evento);
            
        } catch (error) {
            console.error('Error al cargar el evento:', error);
            //mostrarError('No se pudo cargar la información del evento', '/EventosAdmin');
        }
    }

    function updateUIWithEventData(evento) {
        // Actualizar título
        titleElement.textContent = evento.nombre || 'Editar Evento';
        
        // Llenar campos del formulario
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
        if (file && file.type.startsWith('image/')) {
            currentImageUrl = null; // Reseteamos la URL si suben nueva imagen
            showImagePreview(URL.createObjectURL(file));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Archivo no válido',
                text: 'Por favor selecciona una imagen válida',
                confirmButtonText: 'Entendido'
            });
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
        
        if (file && file.type.startsWith('image/')) {
            currentImageUrl = null;
            showImagePreview(URL.createObjectURL(file));
            imageInput.files = dt.files; // Asignar el archivo al input
        }
    }

    function showImagePreview(imageSrc) {
        uploadArea.innerHTML = `
            <img src="${imageSrc}" class="img-thumbnail mb-2" style="max-height: 200px;">
            <button class="btn btn-outline-secondary btn-sm">Cambiar imagen</button>
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
            
            // Si hay nueva imagen, agregarla
            if (imageInput.files.length > 0) {
                formData.append('imagen', imageInput.files[0]);
            } else if (currentImageUrl) {
                // Si mantiene la imagen existente
                formData.append('imagenUrl', currentImageUrl);
            }
            
            // Enviar datos al servidor
            const response = await fetch(`http://localhost:3000/api/eventos/${idEvento}`, {
                method: 'PUT',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
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
            window.location.href = 'http://localhost:3000/EventosAdmin';
            
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
            mostrarError('Ocurrió un error al actualizar el evento');
        } finally {
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.textContent = 'Registrar';
        }
    }

    function validateForm() {
        // Validar precio
        if (!priceInput.value || isNaN(priceInput.value)) {
            mostrarError('Por favor ingrese un precio válido');
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
        if (!capacityInput.value || isNaN(capacityInput.value)) {
            mostrarError('Por favor ingrese una capacidad válida');
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
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'http://localhost:3000/EventosAdmin';
            }
        });
    }

    function mostrarError(mensaje, redirectUrl) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonText: 'Aceptar'
        }).then(() => {
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        });
    }
});