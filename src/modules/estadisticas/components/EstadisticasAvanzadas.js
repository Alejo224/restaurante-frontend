// src/modules/estadisticas/components/EstadisticasAvanzadas.js
import { estadisticasAvanzadasService } from '../EstadisticasAvanzadasService.js';

export class EstadisticasAvanzadas {
  constructor() {
    this.charts = {};
    this.data = {};
  }

  async initialize() {
    await this.cargarEstadisticas();
    this.inicializarEventListeners();
  }

  async cargarEstadisticas(dias = 30) {
    const loadingElement = document.getElementById('estadisticas-loading');
    const contentElement = document.getElementById('estadisticas-content');
    const errorElement = document.getElementById('estadisticas-error');

    try {
      // Mostrar loading
      loadingElement.style.display = 'block';
      contentElement.style.display = 'none';
      errorElement.style.display = 'none';

      // Calcular fechas
      const fin = new Date();
      const inicio = new Date();
      inicio.setDate(inicio.getDate() - dias);

      // Cargar datos en paralelo
      const [resumen, ventas, platos, distribucion, hoy] = await Promise.all([
        estadisticasAvanzadasService.obtenerResumenGeneral(),
        estadisticasAvanzadasService.obtenerVentasPorFecha(inicio, fin),
        estadisticasAvanzadasService.obtenerPlatosPopulares(10),
        estadisticasAvanzadasService.obtenerDistribucionPedidos(),
        estadisticasAvanzadasService.obtenerEstadisticasHoy()
      ]);

      this.data = { resumen, ventas, platos, distribucion, hoy };
      
      // Actualizar UI
      this.actualizarResumen();
      this.actualizarTablaPlatos();
      this.inicializarCharts();

      // Mostrar contenido
      loadingElement.style.display = 'none';
      contentElement.style.display = 'block';

    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      loadingElement.style.display = 'none';
      errorElement.style.display = 'block';
    }
  }

  actualizarResumen() {
    const { resumen } = this.data;
    
    // Formatear montos en pesos colombianos
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    // Actualizar cards de resumen
    document.getElementById('ingresos-totales').textContent = formatter.format(resumen.totalIngresos || 0);
    document.getElementById('pedidos-completados').textContent = resumen.totalPedidosPagados || 0;
    
    // Calcular tasa de éxito
    const tasaExito = resumen.totalPedidos > 0 ? 
      ((resumen.totalPedidosPagados / resumen.totalPedidos) * 100).toFixed(1) : 0;
    document.getElementById('tasa-exito').textContent = `${tasaExito}%`;
    
    document.getElementById('ticket-promedio').textContent = formatter.format(resumen.ticketPromedio || 0);

    // Ocultar variaciones por ahora (no tenemos datos históricos)
    document.querySelectorAll('[id$="variacion"]').forEach(el => {
      el.textContent = '';
    });
  }

  actualizarTablaPlatos() {
    const tabla = document.getElementById('tablaPlatosPopulares');
    const tbody = tabla.querySelector('tbody');
    const { platos } = this.data;

    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

    // Limpiar tabla
    tbody.innerHTML = '';

    // Llenar tabla con datos reales
    if (platos && platos.length > 0) {
      tbody.innerHTML = platos.map(plato => `
        <tr>
          <td>${plato.nombrePlato || 'Sin nombre'}</td>
          <td class="text-end">${plato.totalVendido || 0}</td>
          <td class="text-end">${plato.ingresosGenerados ? formatter.format(plato.ingresosGenerados) : 'N/A'}</td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-muted py-3">
            No hay datos de platos populares disponibles
          </td>
        </tr>
      `;
    }
  }

  inicializarCharts() {
    this.crearChartVentas();
    this.crearChartPlatosPopulares();
    this.crearChartDistribucionPedidos();
    this.crearChartTendencias();
  }

  crearChartVentas() {
    const ctx = document.getElementById('chartVentas');
    if (!ctx) return;

    // Destruir chart anterior si existe
    if (this.charts.ventas) {
      this.charts.ventas.destroy();
    }

    const { ventas } = this.data;
    
    // Preparar datos para el gráfico
    const labels = ventas && ventas.length > 0 
      ? ventas.map(v => {
          const date = new Date(v.fecha);
          return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        })
      : ['Sin datos'];

    const data = ventas && ventas.length > 0 
      ? ventas.map(v => v.monto || 0)
      : [0];

    this.charts.ventas = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ventas Diarias',
          data: data,
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Ventas: $${context.parsed.y.toLocaleString('es-CO')}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return `$${value.toLocaleString('es-CO')}`;
              }
            }
          }
        }
      }
    });
  }

  crearChartPlatosPopulares() {
    const ctx = document.getElementById('chartPlatosPopulares');
    if (!ctx) return;

    if (this.charts.platosPopulares) {
      this.charts.platosPopulares.destroy();
    }

    const { platos } = this.data;
    
    // Tomar solo los primeros 5 platos para el gráfico
    const topPlatos = platos && platos.length > 0 ? platos.slice(0, 5) : [];

    if (topPlatos.length === 0) {
      // Mostrar gráfico vacío si no hay datos
      this.charts.platosPopulares = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Sin datos'],
          datasets: [{
            data: [1],
            backgroundColor: ['#e9ecef']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
      return;
    }

    this.charts.platosPopulares = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: topPlatos.map(p => p.nombrePlato),
        datasets: [{
          data: topPlatos.map(p => p.totalVendido || 0),
          backgroundColor: [
            '#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  crearChartDistribucionPedidos() {
    const ctx = document.getElementById('chartDistribucionPedidos');
    if (!ctx) return;

    if (this.charts.distribucionPedidos) {
      this.charts.distribucionPedidos.destroy();
    }

    const { distribucion } = this.data;

    if (!distribucion || distribucion.length === 0) {
      // Mostrar gráfico vacío si no hay datos
      this.charts.distribucionPedidos = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Sin datos'],
          datasets: [{
            data: [1],
            backgroundColor: ['#e9ecef']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
      return;
    }

    this.charts.distribucionPedidos = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: distribucion.map(d => this.formatearEstado(d.estado)),
        datasets: [{
          data: distribucion.map(d => d.cantidad),
          backgroundColor: [
            '#198754', // COMPLETADO - verde
            '#ffc107', // PENDIENTE - amarillo
            '#dc3545', // CANCELADO - rojo
            '#6c757d', // BORRADOR - gris
            '#0dcaf0'  // otros - azul claro
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  crearChartTendencias() {
    const ctx = document.getElementById('chartTendencias');
    if (!ctx) return;

    if (this.charts.tendencias) {
      this.charts.tendencias.destroy();
    }

    // Usar datos de ventas para tendencias semanales
    const { ventas } = this.data;
    
    let datosTendencias = [0, 0, 0, 0, 0, 0, 0]; // Valores por defecto
    
    if (ventas && ventas.length > 0) {
      // Agrupar por día de la semana (simplificado)
      const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      datosTendencias = diasSemana.map((_, index) => {
        const ventasDia = ventas.filter(v => {
          const fecha = new Date(v.fecha);
          return fecha.getDay() === index;
        });
        return ventasDia.reduce((sum, venta) => sum + (venta.monto || 0), 0);
      });
    }

    this.charts.tendencias = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        datasets: [{
          label: 'Ventas por Día de la Semana',
          data: datosTendencias,
          backgroundColor: 'rgba(32, 201, 151, 0.2)',
          borderColor: 'rgba(32, 201, 151, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return `$${value.toLocaleString('es-CO')}`;
              }
            }
          }
        }
      }
    });
  }

  formatearEstado(estado) {
    const estados = {
      'COMPLETADO': 'Completado',
      'PENDIENTE': 'Pendiente',
      'CANCELADO': 'Cancelado',
      'BORRADOR': 'Borrador'
    };
    return estados[estado] || estado;
  }

  inicializarEventListeners() {
    const selectRango = document.getElementById('rangoEstadisticas');
    if (selectRango) {
      selectRango.addEventListener('change', (e) => {
        this.cargarEstadisticas(parseInt(e.target.value));
      });
    }
  }

  destroy() {
    // Limpiar todos los charts
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};
  }
}