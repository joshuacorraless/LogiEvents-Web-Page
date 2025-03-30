//grafico de barraas
const ctx = document.getElementById('barrasChart');



const labels = ["Activos", "Agotados", "Proximos"];
const data = {
  labels: labels,
  datasets: [{
    label: "Estado",
    data: [65, 59, 80],
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

new Chart(ctx, {
    type: 'bar',
    data: data,
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



//grafico de top 10

const names = document.querySelectorAll("[data-name]");
const value = document.querySelectorAll("[data-revenue]");

function getFormattedRevenue(revenue) {
  const formattedRevenue = ((Math.ceil(revenue / 100) * 100 / 100) / 1000000).toFixed(1);

  return `R$ ${formattedRevenue}${revenue < 1000000 ? " K" : "M"}`;
}


function cargarRanking(){

    fetch('https://cors-everywhere.onrender.com/https://api.kiwify.com.br/v1/open/competition-ranking')
    .then(response => response.json())
    .then(data => {
      data = JSON.parse(data);

      const iterations = data.length > names.length ? names.length : data.length;

      for (let i = 0; i < iterations; i++) {
        names[i].innerHTML = data[i].competition_username;
        value[i].innerHTML = getFormattedRevenue(data[i].revenue);

        if (i < namePodium.length && i < valuePodium.length) {
          namePodium[i].innerHTML = data[i].competition_username;
          valuePodium[i].innerHTML = getFormattedRevenue(data[i].revenue);
        }
      }
    })
    .catch(error => console.error(error));

}

window.addEventListener("load", () => {
  fetchData();
  setInterval(function () {
    fetchData();
  }, 60 * 1000);
})