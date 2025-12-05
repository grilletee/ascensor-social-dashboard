<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let canvasBarras;
  let canvasLineas;

  onMount(async () => {
    // 1. Cargar y configurar Gráfica de Barras (Ranking)
    try {
      const respRanking = await fetch('http://localhost:3000/api/ranking-ccaa');
      const datosRanking = await respRanking.json();

      new Chart(canvasBarras, {
        type: 'bar',
        data: {
          // Usamos la columna 'ccaa' para el nombre
          labels: datosRanking.map(d => d.ccaa),
          datasets: [{
            label: 'Probabilidad de ascenso (Centil)',
            // Usamos 'centil_hijo_loess' que es el valor numérico
            data: datosRanking.map(d => parseFloat(d.centil_hijo_loess)),
            backgroundColor: '#3b82f6',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: false } // Para ver mejor las diferencias
          }
        }
      });
    } catch (error) {
      console.error("Error cargando el ranking:", error);
    }

    // 2. Cargar y configurar Gráfica de Líneas (Curva)
    try {
      const respCurva = await fetch('http://localhost:3000/api/curva-nacional');
      const datosCompletos = await respCurva.json();

      // IMPORTANTE: El CSV tiene datos de 'media' y 'mediana'.
      // Filtramos solo por 'media' para tener una línea limpia.
      const datosFiltrados = datosCompletos.filter(d => d.promedio === 'media');

      new Chart(canvasLineas, {
        type: 'line',
        data: {
          // Eje X: Renta de los padres (0 a 100)
          labels: datosFiltrados.map(d => d.centil_padres),
          datasets: [{
            label: 'Renta esperada de los hijos',
            // Eje Y: Renta de los hijos
            data: datosFiltrados.map(d => parseFloat(d.centil_hijo_loess)),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.3, // Suaviza la línea
            pointRadius: 0 // Quita los puntos para que se vea más limpio
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { 
              title: { display: true, text: 'Renta de los padres (Centil)' } 
            },
            y: { 
              title: { display: true, text: 'Renta de los hijos (Centil)' },
              min: 0,
              max: 100
            }
          }
        }
      });
    } catch (error) {
      console.error("Error cargando la curva:", error);
    }
  });
</script>

<main>
  <h1>Dashboard de Movilidad Social</h1>
  
  <div class="contenedor">
    
    <div class="tarjeta">
      <h2>Ranking por Comunidades Autónomas</h2>
      <canvas bind:this={canvasBarras}></canvas>
    </div>

    <div class="tarjeta">
      <h2>Curva de Movilidad Nacional</h2>
      <canvas bind:this={canvasLineas}></canvas>
    </div>

  </div>

  <div class="texto-analisis">
    <h3>Análisis de los datos</h3>
    <p>
      La primera gráfica muestra las diferencias territoriales en España. Las comunidades con barras más altas ofrecen mayores oportunidades de ascenso social.
      La segunda gráfica representa la correlación entre padres e hijos: a mayor pendiente, mayor es la influencia del origen familiar en el destino económico.
    </p>
  </div>
</main>

<style>
  main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
  }

  .contenedor {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  /* Diseño responsive: 2 columnas en pantallas grandes */
  @media (min-width: 768px) {
    .contenedor {
      grid-template-columns: 1fr 1fr;
    }
  }

  .tarjeta {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #4b5563;
    text-align: center;
  }

  .texto-analisis {
    margin-top: 3rem;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-left: 4px solid #3b82f6;
    border-radius: 4px;
  }

  .texto-analisis h3 {
    margin-top: 0;
    color: #1f2937;
  }

  .texto-analisis p {
    color: #4b5563;
    line-height: 1.5;
  }
</style>