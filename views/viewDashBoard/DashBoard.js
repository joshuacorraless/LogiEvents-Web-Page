//grafico de barraas
const ctx = document.getElementById('barrasChart');



fetch('http://localhost:3000/api/DistribucionEvento') 
  .then(response => response.json())
  .then(data => {
    // Extraer etiquetas y valores desde el JSON
    // Definir estados esperados
    const estadosEsperados = ["Activo", "Agotado", "Próximamente"];
    
    // Crear un objeto con valores por defecto en 0
    let datosCompletos = {
      "Activo": 0,
      "Agotado": 0,
      "Próximamente": 0
    };

    // Llenar con los datos reales obtenidos del fetch
    data.forEach(item => {
      if (datosCompletos.hasOwnProperty(item.estado)) {
        datosCompletos[item.estado] = item.cantidad;
      }
    });

    // Convertir los datos a formato de arrays
    const labels = estadosEsperados;
    const valores = labels.map(estado => datosCompletos[estado]);

    const chartData = {
      labels: labels,
      datasets: [{
        label: "Estado",
        data: valores,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1
      }]
    };

    // Crear el gráfico
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Distribución de eventos según su estado', // Título del gráfico
            font: {
              size: 18 // Tamaño de la fuente
            }
          }
        }
      }
    });
  })
  .catch(error => console.error("Error al obtener los datos:", error));






//grafico de top 10

const names = document.querySelectorAll("[data-name]");
const value = document.querySelectorAll("[data-revenue]");
cargarRanking();


function cargarRanking(){

    fetch('http://localhost:3000/api/Top5')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const iterations = data.length > names.length ? names.length : data.length;

      for (let i = 0; i < iterations; i++) {
        names[i].innerHTML = data[i].nombre_evento;
        value[i].innerHTML = data[i].totalReservaciones;

      }
    })
    .catch(error => console.error(error));

}
