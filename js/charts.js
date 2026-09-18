/**
 * WATERPULSE - Real-Time Surveillance Visualizations
 * Chart.js wrappers for water telemetry curves, illness progression, and symptoms breakdown.
 */

export class SurveillanceCharts {
  constructor() {
    this.waterChart = null;
    this.illnessChart = null;
    this.symptomsChart = null;
  }

  /**
   * Render or update 7-day water quality time-series chart
   */
  renderWaterChart(canvasId, historicalWater) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = historicalWater.map(h => h.date);
    const phData = historicalWater.map(h => h.ph);
    const turbidityData = historicalWater.map(h => h.turbidity);
    const tdsData = historicalWater.map(h => h.tds);

    if (this.waterChart) {
      this.waterChart.data.labels = labels;
      this.waterChart.data.datasets[0].data = turbidityData;
      this.waterChart.data.datasets[1].data = phData;
      this.waterChart.data.datasets[2].data = tdsData;
      this.waterChart.update('active');
      return;
    }

    this.waterChart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Turbidity (NTU)',
            data: turbidityData,
            borderColor: '#ff3366',
            backgroundColor: 'rgba(255, 51, 102, 0.12)',
            yAxisID: 'yTurbidity',
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: '#ff3366',
            pointRadius: 4,
            fill: true
          },
          {
            label: 'pH Level',
            data: phData,
            borderColor: '#00d2ff',
            backgroundColor: 'transparent',
            yAxisID: 'yPh',
            tension: 0.35,
            borderWidth: 2,
            borderDash: [4, 4],
            pointBackgroundColor: '#00d2ff',
            pointRadius: 4
          },
          {
            label: 'TDS (ppm)',
            data: tdsData,
            borderColor: '#ffb300',
            backgroundColor: 'transparent',
            yAxisID: 'yTds',
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#ffb300',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#8fa0bd',
              boxWidth: 12,
              font: { size: 11, family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            backgroundColor: '#0c1729',
            borderColor: 'rgba(0, 210, 255, 0.3)',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: '#e1e7f0',
            padding: 10
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#687b99', font: { size: 10 } }
          },
          yTurbidity: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(255, 51, 102, 0.08)' },
            ticks: { color: '#ff3366', font: { size: 10 } },
            title: { display: true, text: 'Turbidity (NTU)', color: '#ff3366', font: { size: 10 } },
            min: 0
          },
          yPh: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#00d2ff', font: { size: 10 } },
            title: { display: true, text: 'pH', color: '#00d2ff', font: { size: 10 } },
            min: 5,
            max: 11
          },
          yTds: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#ffb300', font: { size: 10 } },
            min: 0,
            display: false
          }
        }
      }
    });
  }

  /**
   * Render or update 7-day illness reports vs baseline chart
   */
  renderIllnessChart(canvasId, historicalIllness) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = historicalIllness.map(h => h.date);
    const reportsData = historicalIllness.map(h => h.reports);
    const baselineData = historicalIllness.map(h => h.baseline);

    if (this.illnessChart) {
      this.illnessChart.data.labels = labels;
      this.illnessChart.data.datasets[0].data = reportsData;
      this.illnessChart.data.datasets[1].data = baselineData;
      this.illnessChart.update('active');
      return;
    }

    this.illnessChart = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Reported Cases',
            data: reportsData,
            backgroundColor: 'rgba(255, 51, 102, 0.65)',
            borderColor: '#ff3366',
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            type: 'line',
            label: 'Epidemic Threshold Baseline',
            data: baselineData,
            borderColor: '#00e599',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#8fa0bd',
              boxWidth: 12,
              font: { size: 11, family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            backgroundColor: '#0c1729',
            borderColor: 'rgba(255, 51, 102, 0.4)',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: '#e1e7f0',
            padding: 10
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#687b99', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#8fa0bd', font: { size: 10 } },
            beginAtZero: true
          }
        }
      }
    });
  }

  /**
   * Render or update Symptoms Breakdown Doughnut Chart
   */
  renderSymptomsChart(canvasId, symptomsBreakdown) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = Object.keys(symptomsBreakdown);
    const counts = Object.values(symptomsBreakdown);
    const colors = ['#ff3366', '#ff8c00', '#ffb300', '#00d2ff', '#a855f7'];

    if (this.symptomsChart) {
      this.symptomsChart.data.labels = labels;
      this.symptomsChart.data.datasets[0].data = counts;
      this.symptomsChart.update('active');
      return;
    }

    this.symptomsChart = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: counts,
            backgroundColor: colors,
            borderColor: '#0b1528',
            borderWidth: 2,
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#a0aec0',
              boxWidth: 10,
              font: { size: 10, family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            backgroundColor: '#0c1729',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: '#e1e7f0'
          }
        }
      }
    });
  }

  /**
   * Destroy all instances (for cleanup)
   */
  destroyAll() {
    if (this.waterChart) { this.waterChart.destroy(); this.waterChart = null; }
    if (this.illnessChart) { this.illnessChart.destroy(); this.illnessChart = null; }
    if (this.symptomsChart) { this.symptomsChart.destroy(); this.symptomsChart = null; }
  }
}

export const surveillanceCharts = new SurveillanceCharts();
