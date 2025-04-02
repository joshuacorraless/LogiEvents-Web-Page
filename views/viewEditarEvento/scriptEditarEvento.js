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
    imageInput.name = 'imagen'; // Importante para el FormData
    document.body.appendChild(imageInput);
    
    const idEvento = sessionStorage.getItem('idEventoEditar');
    let currentImageUrl = null;
    let cloudinaryPublicId = null; // Para almacenar el public_id de la imagen en Cloudinary

    if (!idEvento) {
        mostrarError('No se encontró el ID del evento', 'http://localhost:3000/EventosAdmin');
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
            const response = await fetch(`http://localhost:3000/api/eventos/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const evento = await response.json();
            //actualizar datos
            updateUIWithEventData(evento);
            
        } catch (error) {
            console.error('Error al cargar el evento:', error);
            mostrarError('No se pudo cargar la información del evento', '/EventosAdmin');
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
            <img src="${imageSrc}" class="img-thumbnail mb-2" style="max-height: 200px;">
            <button type="button" class="btn btn-outline-secondary btn-sm">Cambiar imagen</button>
            <p class="small text-muted mt-1">Tamaño máximo: 5MB</p>
        `;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Guardando...
            `;
            
            const formData = new FormData();
            formData.append('precio', priceInput.value);
            formData.append('ubicacion', locationInput.value);
            formData.append('capacidad', capacityInput.value);
            
            // Manejo de imágenes
            let imagenUrl = currentImageUrl;
            let imagenPublicId = cloudinaryPublicId;
            
            if (imageInput.files.length > 0) {
                // Subir nueva imagen
                const uploadFormData = new FormData();
                uploadFormData.append('imagen', imageInput.files[0]);
                
                const uploadResponse = await fetch('http://localhost:3000/upload', {
                    method: "POST",
                    body: uploadFormData
                });
                
                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || 'Error al subir la imagen');
                }
                
                const uploadResult = await uploadResponse.json();
                imagenUrl = uploadResult.url;
                imagenPublicId = uploadResult.public_id;
                
                // Si había una imagen anterior, eliminarla
                if (cloudinaryPublicId) {
                    try {
                        await fetch(`http://localhost:3000/api/images/${encodeURIComponent(cloudinaryPublicId)}`, {
                            method: "DELETE"
                        });
                    } catch (deleteError) {
                        console.warn('No se pudo eliminar la imagen anterior:', deleteError);
                    }
                }
            }
            
            // Asegurarse de que hay una imagen
            if (!imagenUrl) {
                throw new Error('Debes seleccionar una imagen para el evento');
            }
            
            // Agregar datos de imagen al formData
            formData.append('imagenUrl', imagenUrl);
            if (imagenPublicId) {
                formData.append('imagenPublicId', imagenPublicId);
            }
            
            // Enviar datos al servidor
            const response = await fetch(`http://localhost:3000/api/eventos/${idEvento}`, {
                method: "PUT",
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Evento actualizado correctamente',
                confirmButtonText: 'Aceptar'
            });
            
            window.location.href = 'http://localhost:3000/EventosAdmin';
            
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
            mostrarError(error.message || 'Ocurrió un error al actualizar el evento');
        } finally {
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
                window.location.href = 'http://localhost:3000/EventosAdmin';
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
});