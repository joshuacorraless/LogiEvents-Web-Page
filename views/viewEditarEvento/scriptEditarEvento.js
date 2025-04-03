document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEditarEvento');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const idEvento = sessionStorage.getItem('idEventoEditar');

    // Configurar eventos
    uploadArea.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageSelection);
    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', confirmCancel);

    // Cargar datos del evento si existe ID
    if (idEvento) {
        cargarDatosEvento(idEvento);
    }

    async function cargarDatosEvento(id) {
        try {
            const response = await fetch(`/api/eventos/${id}`);
            if (!response.ok) throw new Error('Error al cargar evento');
            
            const evento = await response.json();
            
            // Llenar formulario
            document.getElementById('precio').value = evento.precio || '';
            document.getElementById('ubicacion').value = evento.ubicacion || '';
            document.getElementById('capacidad').value = evento.capacidad || '';
            
            // Mostrar imagen si existe
            if (evento.imagenUrl) {
                showImagePreview(evento.imagenUrl);
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo cargar el evento', 'error');
        }
    }

    function handleImageSelection(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validar imagen
        if (!file.type.match('image.*')) {
            Swal.fire('Error', 'Solo se permiten imágenes', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'La imagen no debe exceder 5MB', 'error');
            return;
        }

        // Mostrar vista previa
        const reader = new FileReader();
        reader.onload = (event) => {
            showImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
    }

    function showImagePreview(imageSrc) {
        uploadArea.innerHTML = `
            <img src="${imageSrc}" class="img-thumbnail mb-2" style="max-height: 200px;">
            <button type="button" class="btn btn-outline-secondary btn-sm">Cambiar imagen</button>
            <p class="small text-muted mt-1">Tamaño máximo: 5MB</p>
        `;
        
        // Reasignar evento al nuevo botón
        uploadArea.querySelector('button').addEventListener('click', () => {
            imageInput.click();
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Guardando...
            `;

            const formData = new FormData(form);
            formData.append('id_evento', idEvento);

            const response = await fetch(`/api/eventos/${idEvento}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al guardar');
            }

            await Swal.fire('Éxito', 'Evento actualizado', 'success');
            setTimeout(() => {
                window.location.href = '/EventosAdmin';
            }, 1500);

        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', error.message || 'Error al guardar cambios', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar Cambios';
        }
    }

    function validateForm() {
        let isValid = true;
        
        // Validar precio
        const precio = document.getElementById('precio');
        if (!precio.value || isNaN(precio.value)) {
            mostrarErrorCampo(precio, 'Precio inválido');
            isValid = false;
        }
        
        // Validar ubicación
        const ubicacion = document.getElementById('ubicacion');
        if (!ubicacion.value.trim()) {
            mostrarErrorCampo(ubicacion, 'Ubicación requerida');
            isValid = false;
        }
        
        // Validar capacidad
        const capacidad = document.getElementById('capacidad');
        if (!capacidad.value || isNaN(capacidad.value)) {
            mostrarErrorCampo(capacidad, 'Capacidad inválida');
            isValid = false;
        }
        
        return isValid;
    }

    function mostrarErrorCampo(input, mensaje) {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = mensaje;
        }
    }

    function confirmCancel() {
        Swal.fire({
            title: '¿Descartar cambios?',
            text: 'Los cambios no guardados se perderán',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, descartar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/EventosAdmin';
            }
        });
    }
});