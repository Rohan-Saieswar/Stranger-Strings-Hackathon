/**
 * WATERPULSE - Interactive Leaflet India Geospatial Engine
 * Real GeoJSON state boundaries, dynamic risk choropleth, IoT sensors, illness clusters, and controls.
 */

import { store, EVENTS } from './store.js';
import { RISK_LEVELS } from './riskEngine.js';

export class IndiaMapManager {
  constructor(containerId = 'india-map') {
    this.containerId = containerId;
    this.map = null;
    this.geojsonLayer = null;
    this.sensorLayerGroup = null;
    this.clusterLayerGroup = null;
    this.districtLayerGroup = null;
    this.districtPicker = null;
    this.selectedLayer = null;
    this.geoData = null;

    // National center & bounds for India
    this.nationalCenter = [22.5937, 80.9629];
    this.nationalZoom = 5;
    this.minZoom = 4;
    this.maxZoom = 13;

    // Layer visibility states
    this.showChoropleth = true;
    this.showSensors = true;
    this.showClusters = true;
    this.activeDistrictState = null;
  }

  /**
   * Initialize Leaflet map instance
   */
  async init() {
    if (this.map) return;

    this.districtPicker = document.getElementById('district-picker');

    // Create Leaflet Map with smooth gestures
    this.map = window.L.map(this.containerId, {
      center: this.nationalCenter,
      zoom: this.nationalZoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      zoomControl: false, // We use custom styled controls
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      worldCopyJump: false,
      maxBounds: [
        [4.0, 60.0],
        [39.0, 100.0]
      ]
    });

    // CARTO Basemaps API Key
    this.cartoApiKey = 'cb1_3q09_1_ca7361cbcdd68727f3a81f3e';

    // Dark Matter tile layer for high-tech command center aesthetic (watermark-free authenticated)
    const tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${this.cartoApiKey}`;
    this.baseTileLayer = window.L.tileLayer(
      tileUrl,
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> | DataMeet India | WaterPulse',
        subdomains: 'abcd',
        maxZoom: 19
      }
    );
    this.baseTileLayer.addTo(this.map);

    // Layer groups for markers
    this.sensorLayerGroup = window.L.layerGroup().addTo(this.map);
    this.clusterLayerGroup = window.L.layerGroup().addTo(this.map);
    this.districtLayerGroup = window.L.layerGroup();

    // Load GeoJSON and render state choropleth
    await this._loadIndiaGeoJSON();

    // Render markers
    this.renderAllMarkers();

    // Listen to store events
    store.subscribe(EVENTS.AREA_SELECTED, (area) => this._onAreaSelected(area));
    store.subscribe(EVENTS.STATE_MUTATED, () => this.refreshChoroplethStyles());
  }

  /**
   * Fetch and parse India States GeoJSON
   */
  async _loadIndiaGeoJSON() {
    try {
      const response = await fetch('data/india_states.json');
      this.geoData = await response.json();

      this.geojsonLayer = window.L.geoJSON(this.geoData, {
        style: (feature) => this._getStateFeatureStyle(feature),
        onEachFeature: (feature, layer) => this._bindFeatureEvents(feature, layer)
      }).addTo(this.map);

      // Select initial area
      const current = store.getSelectedArea();
      if (current) {
        this.highlightStateByName(current.state || current.shortName);
      }
    } catch (err) {
      console.error('Failed to load India GeoJSON boundaries:', err);
    }
  }

  /**
   * Generate dynamic choropleth polygon styling
   */
  _getStateFeatureStyle(feature) {
    const stateName = feature.properties.st_nm || feature.properties.name;
    const areaData = store.getArea(stateName);
    const riskStatus = areaData?.risk?.status || 'LOW';
    const riskColor = RISK_LEVELS[riskStatus]?.color || '#00e599';

    const isSelected = (stateName === store.getSelectedArea()?.state || stateName === store.getSelectedArea()?.shortName);

    return {
      fillColor: riskColor,
      weight: isSelected ? 3 : 1.5,
      opacity: 1,
      color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
      dashArray: isSelected ? '' : '2',
      fillOpacity: this.showChoropleth ? (isSelected ? 0.65 : 0.35) : 0.05
    };
  }

  /**
   * Bind hover and click events for state polygons
   */
  _bindFeatureEvents(feature, layer) {
    const stateName = feature.properties.st_nm || feature.properties.name;

    // Hover tooltip
    layer.on({
      mouseover: (e) => {
        const areaData = store.getArea(stateName);
        const risk = areaData?.risk;
        const score = risk ? risk.score : 20;
        const status = risk ? risk.status : 'LOW';
        const color = RISK_LEVELS[status]?.color || '#00e599';
        const cases24h = areaData?.illnessMetrics?.last24h || 0;
        const turbidity = areaData?.telemetry?.turbidity || 1.2;

        layer.setStyle({
          weight: 2.5,
          color: '#00d2ff',
          fillOpacity: 0.65
        });

        if (!window.L.Browser.ie && !window.L.Browser.opera && !window.L.Browser.edge) {
          layer.bringToFront();
        }

        const tooltipContent = `
          <div class="custom-map-tooltip">
            <div class="tooltip-header">
              <span class="tooltip-title">${stateName}</span>
              <span class="tooltip-badge" style="background: ${color}25; color: ${color}; border: 1px solid ${color};">${status}</span>
            </div>
            <div class="tooltip-body">
              <div class="tooltip-row">
                <span>Risk Score:</span>
                <strong>${score}/100</strong>
              </div>
              <div class="tooltip-row">
                <span>24h Cases:</span>
                <strong>${cases24h} reports</strong>
              </div>
              <div class="tooltip-row">
                <span>Turbidity:</span>
                <strong>${turbidity} NTU</strong>
              </div>
            </div>
            <div class="tooltip-hint">Click to inspect area intelligence</div>
          </div>
        `;

        layer.bindTooltip(tooltipContent, {
          sticky: true,
          direction: 'top',
          className: 'leaflet-custom-tooltip'
        }).openTooltip();
      },

      mouseout: (e) => {
        this.geojsonLayer.resetStyle(layer);
        // Re-highlight if currently selected
        const current = store.getSelectedArea();
        if (stateName === current?.state || stateName === current?.shortName) {
          layer.setStyle({
            weight: 3,
            color: '#ffffff',
            fillOpacity: 0.65
          });
        }
      },

      click: (e) => {
        store.selectArea(stateName);
        this.showDistrictsForState(stateName);
        this.zoomToLayerBounds(layer);
      }
    });
  }

  /**
   * Zoom smoothly to state bounds
   */
  zoomToLayerBounds(layer) {
    if (!layer || !this.map) return;
    try {
      const bounds = layer.getBounds();
      this.map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 9,
        animate: true,
        duration: 0.8
      });
    } catch (e) {
      console.warn('Could not fit bounds:', e);
    }
  }

  /**
   * Highlight state polygon by state name
   */
  highlightStateByName(stateName) {
    if (!this.geojsonLayer) return;

    this.geojsonLayer.eachLayer((layer) => {
      const name = layer.feature.properties.st_nm || layer.feature.properties.name;
      if (name === stateName) {
        this.geojsonLayer.resetStyle();
        layer.setStyle({
          weight: 3,
          color: '#ffffff',
          fillOpacity: 0.68
        });
        if (!window.L.Browser.ie) layer.bringToFront();
      }
    });
  }

  /**
   * Render IoT Sensor and Community Cluster Markers across India
   */
  renderAllMarkers() {
    if (!this.sensorLayerGroup || !this.clusterLayerGroup) return;

    this.sensorLayerGroup.clearLayers();
    this.clusterLayerGroup.clearLayers();
    this.districtLayerGroup.clearLayers();

    const allAreas = Object.values(store.areas);

    allAreas.forEach(area => {
      // 1. IoT Sensor Markers
      if (area.sensors && area.sensors.length > 0 && this.showSensors) {
        area.sensors.forEach(sensor => {
          const statusColor = sensor.turbidity > 10 ? '#ff3366' : (sensor.turbidity > 5 ? '#ffb300' : '#00d2ff');
          
          const sensorIcon = window.L.divIcon({
            className: 'custom-iot-marker-wrap',
            html: `
              <div class="sensor-pulse-marker" style="--marker-color: ${statusColor}">
                <div class="sensor-pulse-ring"></div>
                <div class="sensor-dot">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const marker = window.L.marker([sensor.lat, sensor.lng], { icon: sensorIcon });
          marker.bindPopup(`
            <div class="marker-popup-content">
              <h4>${sensor.name}</h4>
              <div class="popup-metrics">
                <div><span>pH:</span> <strong>${sensor.ph}</strong></div>
                <div><span>Turbidity:</span> <strong>${sensor.turbidity} NTU</strong></div>
                <div><span>TDS:</span> <strong>${sensor.tds} ppm</strong></div>
                <div><span>Temp:</span> <strong>${sensor.temp}°C</strong></div>
              </div>
              <button class="popup-action-btn" data-area-id="${area.id}">Inspect Area</button>
            </div>
          `);

          marker.on('popupopen', () => {
            const btn = document.querySelector(`.popup-action-btn[data-area-id="${area.id}"]`);
            if (btn) {
              btn.addEventListener('click', () => {
                store.selectArea(area.id);
                this.map.closePopup();
              });
            }
          });

          this.sensorLayerGroup.addLayer(marker);
        });
      }

      // 2. Community Illness Cluster Hotspots
      if (area.illnessMetrics && area.illnessMetrics.last24h > 10 && this.showClusters) {
        const center = area.center;
        const count = area.illnessMetrics.last24h;
        const radiusSize = Math.min(36, Math.max(18, count * 0.9));

        const clusterIcon = window.L.divIcon({
          className: 'custom-cluster-marker-wrap',
          html: `
            <div class="cluster-pulse-marker" style="width: ${radiusSize}px; height: ${radiusSize}px;">
              <div class="cluster-pulse-wave"></div>
              <span class="cluster-count">${count}</span>
            </div>
          `,
          iconSize: [radiusSize, radiusSize],
          iconAnchor: [radiusSize / 2, radiusSize / 2]
        });

        const clusterMarker = window.L.marker(center, { icon: clusterIcon });
        clusterMarker.bindTooltip(`
          <strong>${area.name}</strong><br/>
          <span>${count} cases in last 24 hours</span><br/>
          <em>Epidemic surge threshold exceeded</em>
        `);
        clusterMarker.on('click', () => {
          store.selectArea(area.id);
        });

        this.clusterLayerGroup.addLayer(clusterMarker);
      }
    });

    if (this.activeDistrictState) this.showDistrictsForState(this.activeDistrictState);
  }

  showDistrictsForState(stateName) {
    if (!this.districtLayerGroup || !this.map) return;
    this.activeDistrictState = stateName;
    this.districtLayerGroup.clearLayers();

    const districts = Object.values(store.areas)
      .filter(area => area.id !== area.state && area.state === stateName && area.center)
      ;

    if (this.districtPicker) {
      this.districtPicker.hidden = districts.length === 0;
      this.districtPicker.innerHTML = `
        <div class="district-picker-header">
          <div><span class="district-picker-kicker">STATE SELECTED</span><strong>${stateName}</strong></div>
          <button type="button" class="district-picker-close" aria-label="Hide districts">×</button>
        </div>
        <div class="district-picker-list">
          ${districts.map(area => `
            <button type="button" class="district-picker-item" data-area-id="${area.id}">
              <span>${area.name}</span><small>${area.risk.status} · ${area.risk.score}/100</small>
            </button>
          `).join('')}
        </div>
      `;
      this.districtPicker.querySelector('.district-picker-close')?.addEventListener('click', () => {
        this.activeDistrictState = null;
        this.districtPicker.hidden = true;
        this.districtLayerGroup.clearLayers();
      });
      this.districtPicker.querySelectorAll('.district-picker-item').forEach(button => {
        button.addEventListener('click', () => {
          store.selectArea(button.dataset.areaId);
          document.querySelector('.menu-item[data-target="intelligence"]')?.click();
        });
      });
    }

    districts.forEach(area => {
        const districtIcon = window.L.divIcon({
          className: 'district-marker-wrap',
          html: '<span class="district-marker-dot"></span>',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        const districtMarker = window.L.marker(area.center, { icon: districtIcon });
        districtMarker.bindPopup(`
          <div class="marker-popup-content district-popup-content">
            <span class="district-popup-kicker">DISTRICT INTELLIGENCE</span>
            <h4>${area.name}</h4>
            <div class="popup-metrics">
              <div><span>State:</span> <strong>${area.state}</strong></div>
              <div><span>Risk:</span> <strong>${area.risk.score}/100</strong></div>
              <div><span>Water:</span> <strong>${area.telemetry.status}</strong></div>
            </div>
            <button class="popup-action-btn district-inspect-btn" data-area-id="${area.id}">Inspect District</button>
          </div>
        `);
        districtMarker.on('popupopen', () => {
          const button = document.querySelector(`.district-inspect-btn[data-area-id="${area.id}"]`);
          button?.addEventListener('click', () => {
            store.selectArea(area.id);
            document.querySelector('.menu-item[data-target="intelligence"]')?.click();
            this.map.closePopup();
          });
        });
        districtMarker.on('click', () => store.selectArea(area.id));
        this.districtLayerGroup.addLayer(districtMarker);
      });

    this.districtLayerGroup.addTo(this.map);
  }

  hideDistricts() {
    this.activeDistrictState = null;
    if (this.districtPicker) this.districtPicker.hidden = true;
    this.districtLayerGroup?.clearLayers();
    if (this.districtLayerGroup && this.map?.hasLayer(this.districtLayerGroup)) {
      this.map.removeLayer(this.districtLayerGroup);
    }
  }

  /**
   * Handler when area is selected in store
   */
  _onAreaSelected(area) {
    if (!area) return;
    this.highlightStateByName(area.state || area.shortName);

    // If center coordinates available, pan smoothly
    if (area.center && this.map) {
      this.map.flyTo(area.center, area.zoom || 7, {
        animate: true,
        duration: 1.0
      });
    }
  }

  /**
   * Re-evaluate and repaint choropleth colors across India
   */
  refreshChoroplethStyles() {
    if (!this.geojsonLayer) return;
    this.geojsonLayer.setStyle((feature) => this._getStateFeatureStyle(feature));
    this.renderAllMarkers();
  }

  /**
   * Reset map camera to entire India overview
   */
  resetToIndiaView() {
    if (!this.map) return;
    this.map.flyTo(this.nationalCenter, this.nationalZoom, {
      animate: true,
      duration: 1.0
    });
    this.highlightStateByName(store.getSelectedArea()?.state);
    this.hideDistricts();
  }

  /**
   * Zoom In
   */
  zoomIn() {
    if (this.map) this.map.zoomIn();
  }

  /**
   * Zoom Out
   */
  zoomOut() {
    if (this.map) this.map.zoomOut();
  }

  /**
   * Toggle Fullscreen
   */
  toggleFullscreen(containerElement) {
    if (!document.fullscreenElement) {
      containerElement.requestFullscreen().catch(err => {
        console.warn('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * Toggle choropleth layer
   */
  toggleChoropleth(show) {
    this.showChoropleth = show;
    this.refreshChoroplethStyles();
  }

  /**
   * Toggle sensors layer
   */
  toggleSensors(show) {
    this.showSensors = show;
    if (show) {
      this.sensorLayerGroup.addTo(this.map);
    } else {
      this.map.removeLayer(this.sensorLayerGroup);
    }
  }

  /**
   * Toggle clusters layer
   */
  toggleClusters(show) {
    this.showClusters = show;
    if (show) {
      this.clusterLayerGroup.addTo(this.map);
    } else {
      this.map.removeLayer(this.clusterLayerGroup);
    }
  }

  /**
   * Invalidate size (called on window resize or panel toggle)
   */
  invalidateSize() {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }
}

export const indiaMapManager = new IndiaMapManager();
