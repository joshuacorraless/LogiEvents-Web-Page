const hamBurger = document.querySelector(".toggle-btn");

hamBurger.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});

// Esperar a que el contenido del DOM esté completamente cargado
window.onload = function() {
  console.log(324234)
  const perfilLink = document.getElementById('perfilLink');
  const eventosLink = document.getElementById('eventosLink');
  const loginLink = document.getElementById('loginLink');
  const notiLink = document.getElementById('notiLink');
  // Añadir un event listener a los enlaces de los botones
  perfilLink.addEventListener('click', function(event) {
      event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
      
      // Redirigir al usuario a la nueva URL
      window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/MiPerfil';
  });

  // Añadir un event listener a los enlaces de los botones
  eventosLink.addEventListener('click', function(event) {
    event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
    
    // Redirigir al usuario a la nueva URL
    window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/VerEventos';
  });

    // Añadir un event listener a los enlaces de los botones
    loginLink.addEventListener('click', function(event) {
      event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
      sessionStorage.clear(); //limpia la session en la que se ha guardado el id del usuario anterior
      // Redirigir al usuario a la nueva URL
      window.location.href = 'https://requeproyectoweb-production-3d39.up.railway.app/Login';
    });

    notiLink.addEventListener('click', function(event) {
      event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
      
      toggleNotification();
    });
};

// Función para alternar la visibilidad de la caja de notificación
function toggleNotification() {
  const notificationBox = document.getElementById('notificationBox');
  
  // Si la notificación está oculta, la muestra; si está visible, la oculta
  if (notificationBox.style.display === 'none' || notificationBox.style.display === '') {
    notificationBox.style.display = 'block'; // Mostrar notificación
    loadNotifications();  // Cargar las notificaciones cuando se despliega la caja
  } else {
    notificationBox.style.display = 'none'; // Ocultar notificación
  }
}

// Función para cargar las notificaciones desde sessionStorage
function loadNotifications() {
  const notificationList = document.getElementById('notificationList');
  
  // Limpiar las notificaciones existentes
  notificationList.innerHTML = '';

  // Obtener las notificaciones desde sessionStorage
  const notifications = JSON.parse(sessionStorage.getItem('notifications')) || [];

  // Iterar sobre las notificaciones y mostrarlas
  notifications.forEach((notification, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="btn close-btn p-3" onclick="eliminarNotificacion(${index})">
        <i class="bi bi-x-lg"></button></i><strong>${notification.title}</strong><br> 
      
      ${notification.description}
      
    `;
    notificationList.appendChild(li);
  });
}
function eliminarNotificacion(index) {
  const notifications = JSON.parse(sessionStorage.getItem('notifications')) || [];
  notifications.splice(index, 1); // Eliminar la notificación en el índice especificado
  sessionStorage.setItem('notifications', JSON.stringify(notifications)); // Actualizar sessionStorage
  loadNotifications(); // Volver a mostrar las notificaciones actualizadas
}

  /*const notification = [
    { title: 'Acabas de realizar una reservacion!', description: 'Recuerda vivir tu experiencia con' }
  ];
  sessionStorage.setItem('notifications', JSON.stringify(notification)); EJEMPLO PARA ANADIR NOTIFICACIONES en todaS PARTES*/ 