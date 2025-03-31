const hamBurger = document.querySelector(".toggle-btn");

hamBurger.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});
window.onload = function() {
  console.log(324234)
  const perfilLink = document.getElementById('perfilLink');
  const eventosLink = document.getElementById('eventosLink');
  const AdminLink = document.getElementById('AdminLink');
  const loginLink = document.getElementById('loginLink');
  // Añadir un event listener a los enlaces de los botones
  perfilLink.addEventListener('click', function(event) {
      event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
      
      // Redirigir al usuario a la nueva URL
      window.location.href = 'http://localhost:3000/MiPerfil';
  });

  // Añadir un event listener a los enlaces de los botones
  eventosLink.addEventListener('click', function(event) {
    event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
    
    // Redirigir al usuario a la nueva URL
    window.location.href = 'http://localhost:3000/EventosAdmin';
  });
  AdminLink.addEventListener('click', function(event) {
    event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
    
    // Redirigir al usuario a la nueva URL
    window.location.href = 'http://localhost:3000/VerAdmins';
  });


    // Añadir un event listener a los enlaces de los botones
    loginLink.addEventListener('click', function(event) {
      event.preventDefault();  // Evitar el comportamiento predeterminado (que es navegar a "#")
      
      // Redirigir al usuario a la nueva URL
      window.location.href = 'http://localhost:3000/Login';
    });
};