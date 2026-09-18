/**
 * WATERPULSE - Main Application Controller
 * Bootstraps the application, coordinates UI modals, search bar, simulation triggers, and toast notifications.
 */

import { store, EVENTS } from './store.js';
import { indiaMapManager } from './map.js';
import { areaPanelManager } from './panel.js';
import { ALL_INDIAN_STATES_NAMES } from './indiaData.js';

class WaterPulseApp {
  constructor() {
    this.searchDropdown = null;
    this.searchInput = null;
  }

  async init() {
    console.log('Initializing WATERPULSE Network...');

    // 1. Initialize Map
    await indiaMapManager.init();

    // 2. Initialize Area Panel
    areaPanelManager.init();

    // 3. Setup UI Controls & Listeners
    this._setupSearch();
    this._setupMapControls();
    this._setupModals();
    this._setupSimulation();
    this._setupAlertTicker();
    this._setupNetworkStats();

    // Listen to store events for notifications
    store.subscribe(EVENTS.REPORT_SUBMITTED, ({ area, report }) => {
      this.showToast(
        `Report Logged (${area.shortName})`,
        `${report.peopleAffected} person(s) reported ${report.symptoms}. Risk recalculating...`,
        'warning'
      );
      this._updateNetworkStats();
    });

    store.subscribe(EVENTS.WATER_UPDATED, ({ area, telemetry }) => {
      this.showToast(
        `Telemetry Calibrated (${area.shortName})`,
        `Turbidity: ${telemetry.turbidity} NTU | TDS: ${telemetry.tds} ppm | Status: ${telemetry.status}`,
        'info'
      );
      this._updateNetworkStats();
    });

    store.subscribe(EVENTS.ALERT_TRIGGERED, (alert) => {
      this.showToast(
        `OUTBREAK SURVEILLANCE ALERT: ${alert.level}`,
        alert.text,
        alert.level === 'CRITICAL' ? 'danger' : 'warning'
      );
      this._updateAlertTicker();
    });

    console.log('WATERPULSE Network online and operational.');
  }

  /**
   * Search Box with Autocomplete for States, Basins, and Stations
   */
  _setupSearch() {
    this.searchInput = document.getElementById('map-search-input');
    this.searchDropdown = document.getElementById('search-autocomplete-list');
    const searchForm = document.getElementById('map-search-form');

    if (!this.searchInput || !this.searchDropdown) return;

    const renderResults = (query) => {
      const q = query.trim().toLowerCase();
      if (!q) {
        this.searchDropdown.innerHTML = '';
        this.searchDropdown.classList.remove('active');
        return;
      }

      const matches = [];

      // Search all areas in store
      Object.values(store.areas).forEach(area => {
        if (area.name.toLowerCase().includes(q) || 
            area.state.toLowerCase().includes(q) || 
            area.shortName.toLowerCase().includes(q) ||
            (area.basin && area.basin.toLowerCase().includes(q))) {
          matches.push({
            type: 'Area / Basin',
            title: area.name,
            subtitle: `${area.state} &bull; Risk: ${area.risk.score}/100`,
            areaId: area.id,
            coords: area.center
          });
        }

        // Search sensors in this area
        if (area.sensors) {
          area.sensors.forEach(s => {
            if (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) {
              matches.push({
                type: 'IoT Station',
                title: s.name,
                subtitle: `Node in ${area.state} (${s.turbidity} NTU)`,
                areaId: area.id,
                coords: [s.lat, s.lng]
              });
            }
          });
        }
      });

      if (matches.length === 0) {
        this.searchDropdown.innerHTML = `<div class="search-empty-msg">No matching state or sensor found for "${query}"</div>`;
        this.searchDropdown.classList.add('active');
        return;
      }

      this.searchDropdown.innerHTML = matches.slice(0, 7).map(m => `
        <div class="search-result-item" data-area-id="${m.areaId}" data-lat="${m.coords[0]}" data-lng="${m.coords[1]}">
          <div class="search-item-header">
            <span class="search-type-tag">${m.type}</span>
            <span class="search-item-title">${m.title}</span>
          </div>
          <div class="search-item-sub">${m.subtitle}</div>
        </div>
      `).join('');

      this.searchDropdown.classList.add('active');

      // Bind click handlers to items
      this.searchDropdown.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('click', () => {
          const areaId = el.getAttribute('data-area-id');
          store.selectArea(areaId);
          this.searchDropdown.classList.remove('active');
          this.searchInput.value = '';
        });
      });
    };

    this.searchInput.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!searchForm.contains(e.target)) {
        this.searchDropdown.classList.remove('active');
      }
    });

    // Handle form submit
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstItem = this.searchDropdown.querySelector('.search-result-item');
      if (firstItem) {
        firstItem.click();
      }
    });
  }

  /**
   * Map Zoom, Reset, Fullscreen, and Layer controls
   */
  _setupMapControls() {
    const btnZoomIn = document.getElementById('ctrl-zoom-in');
    const btnZoomOut = document.getElementById('ctrl-zoom-out');
    const btnReset = document.getElementById('ctrl-reset-view');
    const btnFullscreen = document.getElementById('ctrl-fullscreen');
    const btnToggleLayers = document.getElementById('ctrl-layers-toggle');
    const layersMenu = document.getElementById('layers-dropdown-menu');

    if (btnZoomIn) btnZoomIn.addEventListener('click', () => indiaMapManager.zoomIn());
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => indiaMapManager.zoomOut());
    if (btnReset) btnReset.addEventListener('click', () => indiaMapManager.resetToIndiaView());

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        const mapCard = document.getElementById('map-section-wrapper');
        indiaMapManager.toggleFullscreen(mapCard || document.documentElement);
      });
    }

    if (btnToggleLayers && layersMenu) {
      btnToggleLayers.addEventListener('click', (e) => {
        e.stopPropagation();
        layersMenu.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!layersMenu.contains(e.target)) {
          layersMenu.classList.remove('active');
        }
      });

      // Layer checkboxes
      const chkChoropleth = document.getElementById('layer-chk-choropleth');
      const chkSensors = document.getElementById('layer-chk-sensors');
      const chkClusters = document.getElementById('layer-chk-clusters');

      if (chkChoropleth) {
        chkChoropleth.addEventListener('change', (e) => indiaMapManager.toggleChoropleth(e.target.checked));
      }
      if (chkSensors) {
        chkSensors.addEventListener('change', (e) => indiaMapManager.toggleSensors(e.target.checked));
      }
      if (chkClusters) {
        chkClusters.addEventListener('change', (e) => indiaMapManager.toggleClusters(e.target.checked));
      }
    }

    // Toggle Mobile Panel Drawer
    const btnTogglePanel = document.getElementById('btn-toggle-panel');
    const panelWrap = document.getElementById('area-panel-wrapper');
    if (btnTogglePanel && panelWrap) {
      btnTogglePanel.addEventListener('click', () => {
        panelWrap.classList.toggle('open');
        btnTogglePanel.classList.toggle('active');
        indiaMapManager.invalidateSize();
      });
    }
  }

  /**
   * Modals: Citizen Illness Reporting, Water Calibrator, and Health Dossier
   */
  _setupModals() {
    // 1. Citizen Illness Report Modal
    const reportModal = document.getElementById('modal-report-illness');
    const reportForm = document.getElementById('form-report-illness');
    const reportAreaSelect = document.getElementById('report-area-select');

    // Populate areas in dropdown
    if (reportAreaSelect) {
      reportAreaSelect.innerHTML = Object.values(store.areas).map(a => `
        <option value="${a.id}">${a.name}</option>
      `).join('');
    }

    window.addEventListener('open-report-modal', (e) => {
      const areaId = e.detail?.areaId || store.selectedAreaId;
      if (reportAreaSelect) reportAreaSelect.value = areaId;
      this._openModal(reportModal);
    });

    if (reportForm) {
      reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const areaId = reportAreaSelect.value;
        const peopleAffected = document.getElementById('report-people-count').value;
        const waterSource = document.getElementById('report-water-source').value;
        const notes = document.getElementById('report-notes').value;

        // Collect checked symptoms
        const checkedSymptoms = Array.from(
          reportForm.querySelectorAll('input[name="symptom"]:checked')
        ).map(cb => cb.value);

        if (checkedSymptoms.length === 0) {
          alert('Please select at least one symptom.');
          return;
        }

        store.submitIllnessReport(areaId, {
          symptoms: checkedSymptoms,
          peopleAffected,
          waterSource,
          notes
        });

        this._closeModal(reportModal);
        reportForm.reset();
      });
    }

    // 2. Water Quality Calibrator / Anomaly Simulator Modal
    const waterModal = document.getElementById('modal-calibrate-water');
    const waterForm = document.getElementById('form-calibrate-water');
    const waterAreaSelect = document.getElementById('water-area-select');

    if (waterAreaSelect) {
      waterAreaSelect.innerHTML = Object.values(store.areas).map(a => `
        <option value="${a.id}">${a.name}</option>
      `).join('');
    }

    const sliderPh = document.getElementById('slider-ph');
    const sliderTurbidity = document.getElementById('slider-turbidity');
    const sliderTds = document.getElementById('slider-tds');
    const sliderTemp = document.getElementById('slider-temp');

    const valPh = document.getElementById('val-ph');
    const valTurbidity = document.getElementById('val-turbidity');
    const valTds = document.getElementById('val-tds');
    const valTemp = document.getElementById('val-temp');

    const syncSlidersWithArea = (areaId) => {
      const area = store.getArea(areaId);
      if (!area) return;
      sliderPh.value = area.telemetry.ph;
      sliderTurbidity.value = area.telemetry.turbidity;
      sliderTds.value = area.telemetry.tds;
      sliderTemp.value = area.telemetry.temperature;

      valPh.textContent = area.telemetry.ph;
      valTurbidity.textContent = area.telemetry.turbidity;
      valTds.textContent = area.telemetry.tds;
      valTemp.textContent = area.telemetry.temperature;
    };

    if (sliderPh) sliderPh.addEventListener('input', () => valPh.textContent = sliderPh.value);
    if (sliderTurbidity) sliderTurbidity.addEventListener('input', () => valTurbidity.textContent = sliderTurbidity.value);
    if (sliderTds) sliderTds.addEventListener('input', () => valTds.textContent = sliderTds.value);
    if (sliderTemp) sliderTemp.addEventListener('input', () => valTemp.textContent = sliderTemp.value);

    if (waterAreaSelect) {
      waterAreaSelect.addEventListener('change', () => syncSlidersWithArea(waterAreaSelect.value));
    }

    window.addEventListener('open-water-modal', (e) => {
      const areaId = e.detail?.areaId || store.selectedAreaId;
      if (waterAreaSelect) waterAreaSelect.value = areaId;
      syncSlidersWithArea(areaId);
      this._openModal(waterModal);
    });

    // Preset buttons
    document.querySelectorAll('.btn-water-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        if (preset === 'monsoon') {
          sliderTurbidity.value = 16.5;
          sliderTds.value = 750;
          sliderPh.value = 8.4;
          sliderTemp.value = 28.5;
        } else if (preset === 'effluent') {
          sliderTurbidity.value = 14.0;
          sliderTds.value = 1250;
          sliderPh.value = 9.4;
          sliderTemp.value = 31.0;
        } else if (preset === 'potable') {
          sliderTurbidity.value = 1.2;
          sliderTds.value = 220;
          sliderPh.value = 7.2;
          sliderTemp.value = 25.0;
        }
        valPh.textContent = sliderPh.value;
        valTurbidity.textContent = sliderTurbidity.value;
        valTds.textContent = sliderTds.value;
        valTemp.textContent = sliderTemp.value;
      });
    });

    if (waterForm) {
      waterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const areaId = waterAreaSelect.value;
        store.updateWaterQuality(areaId, {
          ph: sliderPh.value,
          turbidity: sliderTurbidity.value,
          tds: sliderTds.value,
          temperature: sliderTemp.value
        });
        this._closeModal(waterModal);
      });
    }

    // 3. Export Dossier Modal
    const dossierModal = document.getElementById('modal-export-dossier');
    const dossierContent = document.getElementById('dossier-print-content');

    window.addEventListener('open-export-dossier', (e) => {
      const area = store.getSelectedArea();
      if (!area || !dossierContent) return;

      dossierContent.innerHTML = `
        <div class="dossier-report">
          <div class="dossier-header">
            <div>
              <h2>MINISTRY OF JAL SHAKTI / WATERPULSE NETWORK</h2>
              <h3>AREA HEALTH & WATER QUALITY SURVEILLANCE REPORT</h3>
            </div>
            <div class="dossier-meta">
              <span>Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
              <span>Classification: OFFICIAL SURVEILLANCE DOSSIER</span>
            </div>
          </div>

          <div class="dossier-status-bar" style="background: ${area.risk.levelInfo.bg}; border: 1px solid ${area.risk.levelInfo.border};">
            <h3>TARGET CATCHMENT: ${area.name} (${area.state})</h3>
            <span class="dossier-badge" style="color: ${area.risk.levelInfo.color}; font-weight: 700;">
              RISK SCORE: ${area.risk.score}/100 (${area.risk.status})
            </span>
          </div>

          <div class="dossier-columns">
            <div class="dossier-col">
              <h4>1. WATER PHYSICOCHEMICAL PROFILE</h4>
              <ul>
                <li><strong>pH Level:</strong> ${area.telemetry.ph} (Permissible: 6.5 - 8.5)</li>
                <li><strong>Turbidity:</strong> ${area.telemetry.turbidity} NTU (Standard limit: < 5 NTU)</li>
                <li><strong>Total Dissolved Solids:</strong> ${area.telemetry.tds} ppm</li>
                <li><strong>Water Temperature:</strong> ${area.telemetry.temperature} °C</li>
                <li><strong>Current Potability:</strong> ${area.telemetry.status}</li>
              </ul>
            </div>
            <div class="dossier-col">
              <h4>2. COMMUNITY ILLNESS INCIDENCE</h4>
              <ul>
                <li><strong>Total Recorded Reports:</strong> ${area.illnessMetrics.totalReports}</li>
                <li><strong>24-Hour Incidence:</strong> ${area.illnessMetrics.last24h} cases</li>
                <li><strong>7-Day Median Baseline:</strong> ${area.illnessMetrics.baseline7d} cases</li>
                <li><strong>Spike Acceleration:</strong> +${area.illnessMetrics.percentChange}% vs threshold</li>
              </ul>
            </div>
          </div>

          <h4>3. PRIMARY DIAGNOSTIC SIGNALS</h4>
          <ol>
            <li><strong>${area.risk.signals.illnessIncrease.name}:</strong> ${area.risk.signals.illnessIncrease.rationale}</li>
            <li><strong>${area.risk.signals.geographicClustering.name}:</strong> ${area.risk.signals.geographicClustering.rationale}</li>
            <li><strong>${area.risk.signals.historicalDeviation.name}:</strong> ${area.risk.signals.historicalDeviation.rationale}</li>
            <li><strong>${area.risk.signals.waterQualityAnomaly.name}:</strong> ${area.risk.signals.waterQualityAnomaly.rationale}</li>
          </ol>

          <h4>4. MANDATED PUBLIC HEALTH ACTION PROTOCOLS</h4>
          <ul>
            ${area.risk.actionProtocols.map(p => `<li><strong>[${p.level}] ${p.title}:</strong> ${p.desc}</li>`).join('')}
          </ul>
        </div>
      `;

      this._openModal(dossierModal);
    });

    const btnPrintDossier = document.getElementById('btn-print-dossier');
    if (btnPrintDossier) {
      btnPrintDossier.addEventListener('click', () => {
        window.print();
      });
    }

    // Generic Modal Close listeners
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        const modal = el.closest('.modal-overlay');
        if (modal) this._closeModal(modal);
      });
    });
  }

  _openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  _closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Setup Outbreak Simulation Trigger
   */
  _setupSimulation() {
    const simBtn = document.getElementById('btn-trigger-simulation');
    if (!simBtn) return;

    simBtn.addEventListener('click', () => {
      const selected = store.getSelectedArea();
      const started = store.startOutbreakSimulation(selected.id);

      if (started) {
        simBtn.classList.add('sim-active');
        simBtn.innerHTML = `
          <span class="sim-pulse-dot"></span>
          Simulating Outbreak in ${selected.shortName}...
        `;
        this.showToast('Outbreak Scenario Activated', `Simulating contamination cascade in ${selected.name}`, 'warning');
      }
    });

    store.subscribe(EVENTS.SIMULATION_STEP, ({ step, message }) => {
      this.showToast(`Simulation Step ${step}/5`, message, 'info');
      if (step === 5) {
        simBtn.classList.remove('sim-active');
        simBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Simulate Outbreak
        `;
      }
    });
  }

  /**
   * Alert ticker in header
   */
  _setupAlertTicker() {
    this._updateAlertTicker();
  }

  _updateAlertTicker() {
    const tickerContainer = document.getElementById('alert-ticker-content');
    if (!tickerContainer) return;

    const alerts = store.getAlerts();
    tickerContainer.innerHTML = alerts.map(a => `
      <div class="ticker-item ${a.level.toLowerCase()}" data-area-id="${a.areaId}">
        <span class="ticker-badge">${a.level}</span>
        <span class="ticker-time">${a.time}</span>
        <span class="ticker-text">${a.text}</span>
      </div>
    `).join('');

    tickerContainer.querySelectorAll('.ticker-item').forEach(item => {
      item.addEventListener('click', () => {
        const areaId = item.getAttribute('data-area-id');
        store.selectArea(areaId);
      });
    });
  }

  /**
   * Live Network Telemetry Counter in HUD
   */
  _setupNetworkStats() {
    this._updateNetworkStats();
  }

  _updateNetworkStats() {
    const summary = store.getGlobalSummary();

    const elCritical = document.getElementById('stat-critical-count');
    const elNodes = document.getElementById('stat-nodes-count');
    const elReports = document.getElementById('stat-reports-count');
    const elAvgScore = document.getElementById('stat-avg-score');

    if (elCritical) elCritical.textContent = summary.criticalAreasCount;
    if (elNodes) elNodes.textContent = summary.totalNodes;
    if (elReports) elReports.textContent = summary.totalReports;
    if (elAvgScore) elAvgScore.textContent = `${summary.avgRiskScore}/100`;
  }

  /**
   * Toast notification system
   */
  showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;
    toast.innerHTML = `
      <div class="toast-header">
        <strong class="toast-title">${title}</strong>
        <button class="toast-close">&times;</button>
      </div>
      <div class="toast-body">${message}</div>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new WaterPulseApp();
  app.init().catch(err => console.error('Error starting WaterPulse:', err));
});
