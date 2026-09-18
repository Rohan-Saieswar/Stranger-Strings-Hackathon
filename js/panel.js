/**
 * WATERPULSE - Area Intelligence Panel Manager
 * Renders telemetry cards, surveillance metrics, reports table, explainable signals, and charts.
 */

import { store, EVENTS } from './store.js';
import { RISK_LEVELS } from './riskEngine.js';
import { surveillanceCharts } from './charts.js';

export class AreaPanelManager {
  constructor(panelContainerId = 'area-intelligence-panel') {
    this.container = document.getElementById(panelContainerId);
  }

  init() {
    // Initial render
    this.render(store.getSelectedArea());

    // Subscribe to store events
    store.subscribe(EVENTS.AREA_SELECTED, (area) => this.render(area));
    store.subscribe(EVENTS.REPORT_SUBMITTED, ({ area }) => this.render(area));
    store.subscribe(EVENTS.WATER_UPDATED, ({ area }) => this.render(area));
  }

  /**
   * Render complete Area Intelligence Panel
   */
  render(area) {
    if (!area) return;

    const { telemetry, illnessMetrics, recentReports, historicalWater, historicalIllness, symptomsBreakdown, risk } = area;
    const levelInfo = RISK_LEVELS[risk.status] || RISK_LEVELS.LOW;

    // Build the complete panel HTML
    const html = `
      <div class="panel-header-card">
        <div class="panel-header-top">
          <div class="area-title-wrap">
            <span class="area-region-tag"><i class="fas fa-map-marker-alt"></i> ${area.state || area.shortName} &bull; ${area.basin || 'River Basin'}</span>
            <h2 class="area-name">${area.name}</h2>
            <div class="area-submeta">
              <span><i class="fas fa-satellite-dish"></i> ${area.monitoringNodes || 12} Telemetry Nodes</span>
              <span><i class="fas fa-users"></i> ${area.population || 'Regional Catchment'}</span>
            </div>
          </div>
          <div class="risk-gauge-container">
            <div class="risk-gauge-ring" style="--gauge-color: ${levelInfo.color}; --gauge-pct: ${risk.score}%;">
              <div class="risk-gauge-inner">
                <span class="risk-number">${risk.score}</span>
                <span class="risk-denom">/100</span>
              </div>
            </div>
            <div class="risk-status-badge" style="background: ${levelInfo.bg}; color: ${levelInfo.color}; border: 1px solid ${levelInfo.border};">
              <span class="pulse-indicator-dot" style="background: ${levelInfo.color};"></span>
              ${levelInfo.label}
            </div>
          </div>
        </div>

        <!-- Action Quick-Bar -->
        <div class="panel-quick-actions">
          <button class="btn btn-primary" id="btn-open-report-modal" data-area-id="${area.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Report Illness
          </button>
          <button class="btn btn-secondary" id="btn-open-water-modal" data-area-id="${area.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            Adjust Water Data
          </button>
          <button class="btn btn-outline" id="btn-export-dossier" data-area-id="${area.id}" title="Export Official Health Dossier">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export Dossier
          </button>
        </div>
      </div>

      <!-- SECTION: WATER QUALITY -->
      <div class="panel-section">
        <div class="section-header">
          <div class="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            <h3>WATER QUALITY TELEMETRY</h3>
          </div>
          <span class="status-chip ${telemetry.status.toLowerCase()}">
            ${telemetry.status}
          </span>
        </div>

        <div class="telemetry-grid">
          <!-- pH Card -->
          <div class="telemetry-card ${telemetry.ph < 6.5 || telemetry.ph > 8.5 ? 'warning' : 'optimal'}">
            <div class="card-label">pH LEVEL</div>
            <div class="card-value">${telemetry.ph} <span class="unit">pH</span></div>
            <div class="card-sub">Standard: 6.5 - 8.5</div>
          </div>

          <!-- Turbidity Card -->
          <div class="telemetry-card ${telemetry.turbidity > 5.0 ? 'critical' : (telemetry.turbidity > 2.0 ? 'warning' : 'optimal')}">
            <div class="card-label">TURBIDITY</div>
            <div class="card-value">${telemetry.turbidity} <span class="unit">NTU</span></div>
            <div class="card-sub">BIS Limit: &lt; 5.0 NTU</div>
          </div>

          <!-- TDS Card -->
          <div class="telemetry-card ${telemetry.tds > 700 ? 'critical' : (telemetry.tds > 500 ? 'warning' : 'optimal')}">
            <div class="card-label">TOTAL DISSOLVED SOLIDS</div>
            <div class="card-value">${telemetry.tds} <span class="unit">ppm</span></div>
            <div class="card-sub">Permissible: &lt; 500 ppm</div>
          </div>

          <!-- Temperature Card -->
          <div class="telemetry-card optimal">
            <div class="card-label">TEMPERATURE</div>
            <div class="card-value">${telemetry.temperature} <span class="unit">°C</span></div>
            <div class="card-sub">Ambient Sensor Node</div>
          </div>
        </div>

        <!-- Historical Water Graph -->
        <div class="chart-container-wrap">
          <div class="chart-header">
            <h4>Historical Water-Quality (7-Day Telemetry Trend)</h4>
            <span class="chart-legend-hint">Multi-sensor continuum</span>
          </div>
          <div class="canvas-wrapper">
            <canvas id="water-quality-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- SECTION: ILLNESS REPORTS -->
      <div class="panel-section">
        <div class="section-header">
          <div class="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff3366" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <h3>COMMUNITY ILLNESS SURVEILLANCE</h3>
          </div>
          <span class="report-delta-chip ${illnessMetrics.percentChange > 50 ? 'surge' : 'normal'}">
            ${illnessMetrics.percentChange >= 0 ? '+' : ''}${illnessMetrics.percentChange}% vs 7-day
          </span>
        </div>

        <div class="illness-metrics-grid">
          <div class="metric-card">
            <span class="metric-num">${illnessMetrics.totalReports}</span>
            <span class="metric-label">Total Reports</span>
          </div>
          <div class="metric-card alert-bg">
            <span class="metric-num">${illnessMetrics.last24h}</span>
            <span class="metric-label">Last 24 Hours</span>
          </div>
          <div class="metric-card">
            <span class="metric-num">${illnessMetrics.baseline7d}</span>
            <span class="metric-label">7-Day Baseline</span>
          </div>
          <div class="metric-card">
            <span class="metric-num ${illnessMetrics.percentChange > 0 ? 'text-danger' : 'text-success'}">
              ${illnessMetrics.percentChange >= 0 ? '+' : ''}${illnessMetrics.percentChange}%
            </span>
            <span class="metric-label">Incidence Shift</span>
          </div>
        </div>

        <!-- Symptoms & Trend Grid -->
        <div class="visuals-dual-grid">
          <div class="chart-box">
            <div class="chart-header">
              <h4>Symptoms Breakdown</h4>
            </div>
            <div class="canvas-doughnut-wrap">
              <canvas id="symptoms-breakdown-chart"></canvas>
            </div>
          </div>
          <div class="chart-box">
            <div class="chart-header">
              <h4>Illness Trend vs Threshold</h4>
            </div>
            <div class="canvas-bar-wrap">
              <canvas id="illness-trend-chart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION: RECENT REPORTS TABLE -->
      <div class="panel-section">
        <div class="section-header">
          <div class="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb300" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <h3>RECENT VERIFIED REPORTS</h3>
          </div>
          <span class="records-badge">${recentReports.length} logged entries</span>
        </div>

        <div class="reports-table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Reported Symptoms</th>
                <th>People Affected</th>
                <th>Suspected Source</th>
              </tr>
            </thead>
            <tbody>
              ${recentReports.length === 0 ? '<tr><td colspan="4" class="empty-table">No recent reports logged for this catchment.</td></tr>' : 
                recentReports.map(r => `
                  <tr>
                    <td class="date-col">${r.date}</td>
                    <td><span class="symptom-tag">${r.symptoms}</span></td>
                    <td class="affected-col"><strong>${r.peopleAffected}</strong> <span class="subtext">persons</span></td>
                    <td class="source-col"><i class="fas fa-tint"></i> ${r.waterSource}</td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION: WHY FLAGGED? EXPLAINABLE SIGNALS -->
      <div class="panel-section why-flagged-section">
        <div class="section-header">
          <div class="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <h3>WHY FLAGGED? (ANALYTIC DIAGNOSTIC SIGNALS)</h3>
          </div>
          <span class="explainable-badge">AI Synthesis Engine</span>
        </div>

        <div class="signals-quad-grid">
          <!-- Signal 1 -->
          <div class="signal-card ${risk.signals.illnessIncrease.severity.toLowerCase()}">
            <div class="signal-top">
              <div class="signal-info">
                <span class="signal-title">Illness Increase</span>
                <span class="signal-score">${risk.signals.illnessIncrease.score}/${risk.signals.illnessIncrease.maxScore} pts</span>
              </div>
              <span class="signal-status-tag ${risk.signals.illnessIncrease.severity.toLowerCase()}">${risk.signals.illnessIncrease.severity}</span>
            </div>
            <p class="signal-explanation">${risk.signals.illnessIncrease.rationale}</p>
          </div>

          <!-- Signal 2 -->
          <div class="signal-card ${risk.signals.geographicClustering.severity.toLowerCase()}">
            <div class="signal-top">
              <div class="signal-info">
                <span class="signal-title">Geographic Clustering</span>
                <span class="signal-score">${risk.signals.geographicClustering.score}/${risk.signals.geographicClustering.maxScore} pts</span>
              </div>
              <span class="signal-status-tag ${risk.signals.geographicClustering.severity.toLowerCase()}">${risk.signals.geographicClustering.severity}</span>
            </div>
            <p class="signal-explanation">${risk.signals.geographicClustering.rationale}</p>
          </div>

          <!-- Signal 3 -->
          <div class="signal-card ${risk.signals.historicalDeviation.severity.toLowerCase()}">
            <div class="signal-top">
              <div class="signal-info">
                <span class="signal-title">Historical Deviation</span>
                <span class="signal-score">${risk.signals.historicalDeviation.score}/${risk.signals.historicalDeviation.maxScore} pts</span>
              </div>
              <span class="signal-status-tag ${risk.signals.historicalDeviation.severity.toLowerCase()}">${risk.signals.historicalDeviation.severity}</span>
            </div>
            <p class="signal-explanation">${risk.signals.historicalDeviation.rationale}</p>
          </div>

          <!-- Signal 4 -->
          <div class="signal-card ${risk.signals.waterQualityAnomaly.severity.toLowerCase()}">
            <div class="signal-top">
              <div class="signal-info">
                <span class="signal-title">Water-Quality Anomaly</span>
                <span class="signal-score">${risk.signals.waterQualityAnomaly.score}/${risk.signals.waterQualityAnomaly.maxScore} pts</span>
              </div>
              <span class="signal-status-tag ${risk.signals.waterQualityAnomaly.severity.toLowerCase()}">${risk.signals.waterQualityAnomaly.severity}</span>
            </div>
            <p class="signal-explanation">${risk.signals.waterQualityAnomaly.rationale}</p>
          </div>
        </div>
      </div>

      <!-- SECTION: EMERGENCY ACTION PROTOCOLS -->
      <div class="panel-section">
        <div class="section-header">
          <div class="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e599" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <h3>EMERGENCY ACTION PROTOCOLS (JAL SURAKSHA)</h3>
          </div>
          <span class="protocol-status-badge">${risk.status} PROTOCOL ACTIVE</span>
        </div>

        <div class="protocol-list">
          ${risk.actionProtocols.map(p => `
            <div class="protocol-item ${p.level.toLowerCase()}">
              <div class="protocol-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <div class="protocol-content">
                <strong>${p.title}</strong>
                <p>${p.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (this.container) {
      this.container.innerHTML = html;
    }

    // Render / Update Charts
    setTimeout(() => {
      surveillanceCharts.renderWaterChart('water-quality-chart', historicalWater);
      surveillanceCharts.renderIllnessChart('illness-trend-chart', historicalIllness);
      surveillanceCharts.renderSymptomsChart('symptoms-breakdown-chart', symptomsBreakdown);
    }, 50);

    // Bind Quick Action Buttons
    this._bindButtons(area.id);
  }

  _bindButtons(areaId) {
    const reportBtn = document.getElementById('btn-open-report-modal');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-report-modal', { detail: { areaId } }));
      });
    }

    const waterBtn = document.getElementById('btn-open-water-modal');
    if (waterBtn) {
      waterBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-water-modal', { detail: { areaId } }));
      });
    }

    const exportBtn = document.getElementById('btn-export-dossier');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-export-dossier', { detail: { areaId } }));
      });
    }
  }
}

export const areaPanelManager = new AreaPanelManager();
