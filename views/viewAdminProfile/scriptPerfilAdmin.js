//Variable globla que almacena el id del usuario

//VALIDACION DE SEGURIDAD, EVITA QUE LOS USUARIOS ACCEDAN A SITOS SIN PERMISOS
var idUser=sessionStorage.getItem("userID");
var tipoUsuario=sessionStorage.getItem("tipoUsuario");

if (!idUser || !tipoUsuario || (tipoUsuario !== "usuario" && tipoUsuario !== "administrador")) {
    window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/Login'; 
}


window.onload = function() {
    traerUsuario();
    btnModificar();

    modalload();
    const btnRegresarUser = document.getElementById('btnRegresarUser');

    // Añade un event listener al botón
    btnRegresarUser.addEventListener('click', function() {
        window.history.back();  // Regresar a la página anterior en el historial
    });

};


function modalload(){

    
    const form = document.getElementById("formModificarUsuario");
        const btnGuardar = document.getElementById("btnGuardarUsuarioM");
    
        if (!form) {
            console.error("Formulario no encontrado");
            return;
        }
    
        btnGuardar.addEventListener("click", function (event) {
            
    
            console.log("entro");
            const formData = new FormData(form);
    
            const data = {
                correo: formData.get("correo"),
                telefono: formData.get("telefono"),
            };
    
            console.log(data);
            fetch(`https://requeproyectoweb-production.up.railway.app/api/usuarios/${idUser}`, {
                method: "PUT", // Enviar como PUT
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
                console.log("Usuario actualizado:", data);
            
                // Muestra una alerta de éxito
                Swal.fire({
                    icon: 'success',  // Icono de éxito
                    title: '¡Usuario actualizado correctamente!',
                    text: 'Los cambios se guardaron con éxito.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#b99725',  // Color del botón
                });
                generarNotificacion();
                // Cierra el modal después de actualizar
                $('#modificarUsuarioModal').modal('hide'); 
            
                // Refresca la información del usuario
                traerUsuario();
            
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
        });

}



function btnModificar(){

    
    document.getElementById('btnModificarPerfilUser').addEventListener('click', function() {
        // Obtiene los valores de los elementos que contienen el correo y el teléfono
        var correo = document.getElementById('perfil_email').textContent;
        var telefono = document.getElementById('perfil_number').textContent;

        
        // Asigna esos valores a los campos dentro del modal
        document.getElementById('correo').value = correo;
        document.getElementById('telefono').value = telefono;
        const modal = document.getElementById('modificarUsuarioModal');

        modal.addEventListener('shown.bs.modal', function () {
            modal.removeAttribute('inert');  // El modal ahora es interactivo
        });
        
        modal.addEventListener('hidden.bs.modal', function () {
            modal.setAttribute('inert', 'true');  // El modal se vuelve inactivo cuando se cierra
        });

    });
}

function traerUsuario() {
    

    // Realiza la solicitud HTTP GET al api
    fetch('https://requeproyectoweb-production.up.railway.app/api/usuarios')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => {
        console.log(data);
        // Verificar` que los datos estén presentes
        if (data && data.length > 0) {
            console.log(idUser);

            const usuario = data.find(user => user.id_usuario === Number(idUser));

            document.getElementById('perfil_name').textContent = usuario.nombre_completo;
            document.getElementById('perfil_identificacion').textContent = usuario.identificacion;
            document.getElementById('perfil_email').textContent = usuario.correo;
            document.getElementById('perfil_number').textContent = usuario.telefono;
            document.getElementById('perfil_username').textContent = usuario.username;

        } else {
            console.log('No se encontraron usuarios en los datos.');
        }
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
}

function generarNotificacion() {
    // Usar template literals para interpolar el valor de nombreEvento
    const notification = [
      { title: 'Acabas de realizar una modificacion en tus datos!', description: `Si no fuiste tu, contactanos!` }
    ];
    console.log(222);
    // Guardar la notificación en sessionStorage
    sessionStorage.setItem('notifications', JSON.stringify(notification));
  }