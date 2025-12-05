<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let chartCanvas; // Aquí "engancharemos" la gráfica

  onMount(async () => {
    // 1. Pedimos los datos a TU servidor Backend
    const respuesta = await fetch('http://localhost:3000/api/ranking-ccaa');
    const datos = await respuesta.json();

    // 2. Preparamos los datos para Chart.js
    // El JSON tiene campos: "ccaa" y "centil_hijo_loess"
    const nombres = datos.map(d => d.ccaa);
    const valores = datos.map(d => parseFloat(d.centil_hijo_loess)); // Convertimos texto a número

    // 3. Creamos la gráfica
    new Chart(chartCanvas, {
      type: 'bar', // Tipo de gráfica: Barras
      data: {
        labels: nombres, // Eje X: Las Comunidades
        datasets: [{
          label: 'Movilidad Social (Centil Hijos)',
          data: valores, // Eje Y: Los valores
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Ranking de Ascensor Social por CC.AA.'
          }
        },
        scales: {
            y: {
                beginAtZero: false // Para que se aprecien mejor las diferencias
            }
        }
      }
    });
  });
</script>

<main>
  <h1>Dashboard del Ascensor Social</h1>
  <div class="chart-container">
    <canvas bind:this={chartCanvas}></canvas>
  </div>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: sans-serif;
    text-align: center;
  }
  
  .chart-container {
    margin-top: 2rem;
    position: relative; 
    height: 400px; /* Altura de la gráfica */
  }
</style>