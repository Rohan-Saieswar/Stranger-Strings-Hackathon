/**
 * WATERPULSE - Central Reactive Store & State Machine
 * Manages shared state, reactive subscriptions, incident alerts, and bi-directional mutations.
 */

import { buildCompleteAreasDatabase, ALL_INDIAN_STATES_NAMES } from './indiaData.js';
import { DISTRICT_DATA, generateAutoDistricts } from './districtData.js';
import { RiskEngine } from './riskEngine.js';

export const EVENTS = {
  AREA_SELECTED: 'AREA_SELECTED',
  REPORT_SUBMITTED: 'REPORT_SUBMITTED',
  WATER_UPDATED: 'WATER_UPDATED',
  STATE_MUTATED: 'STATE_MUTATED',
  LIVE_CONTEXT_UPDATED: 'LIVE_CONTEXT_UPDATED',
  ALERT_TRIGGERED: 'ALERT_TRIGGERED',
  SIMULATION_STEP: 'SIMULATION_STEP'
};

class WaterPulseStore {
  constructor() {
    this.areas = {};
    this.selectedAreaId = 'Maharashtra'; // Default initial area
    this.listeners = new Map();
    this.alerts = [];
    this.isSimulationRunning = false;
    this.simulationInterval = null;

    this._initializeDatabase();
  }

  _initializeDatabase() {
    const rawData = buildCompleteAreasDatabase();

    // Compute risk profile for every area
    Object.keys(rawData).forEach(key => {
      const area = rawData[key];
      const riskProfile = RiskEngine.calculateAreaRisk(
        area.telemetry,
        area.illnessMetrics,
        area.recentReports,
        area.historicalWater
      );

      this.areas[key] = {
        ...area,
        risk: riskProfile
      };
    });

    // Add district records to the same selection model used by state areas.
    Object.entries(rawData).forEach(([stateName, stateArea]) => {
      const stateDistricts = DISTRICT_DATA[stateName]?.districts || generateAutoDistricts(stateName);
      Object.entries(stateDistricts).forEach(([districtName, district]) => {
        if (this.areas[district.id]) return;
        const riskProfile = RiskEngine.calculateAreaRisk(
          district.telemetry,
          district.illnessMetrics,
          district.recentReports,
          district.historicalWater || stateArea.historicalWater
        );

        this.areas[district.id] = {
          ...district,
          basin: stateArea.basin,
          shortName: district.name,
          monitoringNodes: district.sensors?.length || 0,
          historicalWater: district.historicalWater || stateArea.historicalWater,
          historicalIllness: district.historicalIllness || stateArea.historicalIllness,
          symptomsBreakdown: district.symptomsBreakdown || stateArea.symptomsBreakdown,
          risk: riskProfile
        };
      });
    });

    // Seed initial system alerts
    this.alerts = [
      { id: 'ALT-101', areaId: 'Uttar Pradesh', level: 'CRITICAL', time: '12m ago', text: 'Varanasi East: Severe turbidity (16.4 NTU) & gastroenteritis cluster (48 cases in 24h).' },
      { id: 'ALT-102', areaId: 'Maharashtra', level: 'HIGH', time: '28m ago', text: 'Pune Basin: Rapid report surge (+287%) detected along Mutha River pipeline sector.' },
      { id: 'ALT-103', areaId: 'Delhi', level: 'HIGH', time: '45m ago', text: 'Yamuna Floodplain: TDS spike (780 ppm) with localized diarrheal clustering.' }
    ];
  }

  /**
   * Subscribe to state events
   * @param {string} event
   * @param {Function} callback
   */
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  /**
   * Broadcast event to subscribers
   */
  notify(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in subscriber for ${event}:`, err);
        }
      });
    }
  }

  /**
   * Get area by ID or State Name
   */
  getArea(areaId) {
    return this.areas[areaId] || null;
  }

  /**
   * Get currently selected area
   */
  getSelectedArea() {
    return this.areas[this.selectedAreaId] || this.areas['Maharashtra'];
  }

  /**
   * Select an area by ID
   */
  selectArea(areaId) {
    if (!this.areas[areaId]) {
      console.warn(`Area not found: ${areaId}`);
      return;
    }
    this.selectedAreaId = areaId;
    const area = this.getSelectedArea();
    this.notify(EVENTS.AREA_SELECTED, area);
    return area;
  }

  setLiveContext(areaId, liveContext) {
    const area = this.areas[areaId];
    if (!area || !liveContext || this.selectedAreaId !== areaId) return;
    area.liveContext = liveContext;
    this.notify(EVENTS.LIVE_CONTEXT_UPDATED, { areaId, area, liveContext });
  }

  /**
   * Submit citizen illness report
   * Reactively updates metrics, runs riskEngine, updates map and UI.
   */
  submitIllnessReport(areaId, reportData) {
    const area = this.areas[areaId];
    if (!area) return;

    const peopleCount = parseInt(reportData.peopleAffected, 10) || 1;
    const symptomsArr = Array.isArray(reportData.symptoms) ? reportData.symptoms : [reportData.symptoms || 'Gastroenteritis'];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newReport = {
      id: `REP-${area.shortName.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      date: nowStr,
      symptoms: symptomsArr.join(', '),
      peopleAffected: peopleCount,
      waterSource: reportData.waterSource || 'Municipal Tap Water',
      status: 'NEW-VERIFIED',
      notes: reportData.notes || ''
    };

    // 1. Add to recent reports at the top
    area.recentReports.unshift(newReport);
    if (area.recentReports.length > 25) area.recentReports.pop();

    // 2. Increment totals
    area.illnessMetrics.totalReports += 1;
    area.illnessMetrics.last24h += 1;

    // Recalculate percentChange
    const baseline = Math.max(1, area.illnessMetrics.baseline7d);
    area.illnessMetrics.percentChange = Math.round(((area.illnessMetrics.last24h - baseline) / baseline) * 100);

    // 3. Update symptoms breakdown
    symptomsArr.forEach(sym => {
      area.symptomsBreakdown[sym] = (area.symptomsBreakdown[sym] || 0) + peopleCount;
    });

    // 4. Update today's entry in historicalIllness
    if (area.historicalIllness && area.historicalIllness.length > 0) {
      const todayEntry = area.historicalIllness[area.historicalIllness.length - 1];
      todayEntry.reports += 1;
    }

    // 5. Recalculate area risk using RiskEngine
    const prevStatus = area.risk.status;
    area.risk = RiskEngine.calculateAreaRisk(
      area.telemetry,
      area.illnessMetrics,
      area.recentReports,
      area.historicalWater
    );

    // 6. Check for alert generation
    if (area.risk.status === 'CRITICAL' || (prevStatus !== 'CRITICAL' && area.risk.status === 'HIGH')) {
      const alertItem = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        areaId: area.id,
        level: area.risk.status,
        time: 'Just now',
        text: `${area.name}: Incident spike detected (+${area.illnessMetrics.percentChange}%). Risk elevated to ${area.risk.score}/100.`
      };
      this.alerts.unshift(alertItem);
      if (this.alerts.length > 15) this.alerts.pop();
      this.notify(EVENTS.ALERT_TRIGGERED, alertItem);
    }

    // 7. Fire notification events
    this.notify(EVENTS.REPORT_SUBMITTED, { areaId, report: newReport, area });
    this.notify(EVENTS.STATE_MUTATED, { areaId, area });

    return newReport;
  }

  /**
   * Update or simulate water quality telemetry
   * Reactively updates water status, historical curve, recalculates risk, updates map.
   */
  updateWaterQuality(areaId, telemetryData) {
    const area = this.areas[areaId];
    if (!area) return;

    // Update telemetry values
    const newPh = +(parseFloat(telemetryData.ph) || area.telemetry.ph).toFixed(1);
    const newTurbidity = +(parseFloat(telemetryData.turbidity) || area.telemetry.turbidity).toFixed(1);
    const newTds = Math.round(parseFloat(telemetryData.tds) || area.telemetry.tds);
    const newTemp = +(parseFloat(telemetryData.temperature) || area.telemetry.temperature).toFixed(1);

    const qualityStatus = RiskEngine.getWaterQualityStatus({
      ph: newPh,
      turbidity: newTurbidity,
      tds: newTds,
      temperature: newTemp
    });

    area.telemetry = {
      ph: newPh,
      turbidity: newTurbidity,
      tds: newTds,
      temperature: newTemp,
      status: qualityStatus.status
    };

    // Update today's entry in historicalWater
    if (area.historicalWater && area.historicalWater.length > 0) {
      const todayEntry = area.historicalWater[area.historicalWater.length - 1];
      todayEntry.ph = newPh;
      todayEntry.turbidity = newTurbidity;
      todayEntry.tds = newTds;
      todayEntry.temperature = newTemp;
    }

    // Recalculate area risk
    const prevStatus = area.risk.status;
    area.risk = RiskEngine.calculateAreaRisk(
      area.telemetry,
      area.illnessMetrics,
      area.recentReports,
      area.historicalWater
    );

    // Alert if anomaly crossed threshold
    if (qualityStatus.status === 'CONTAMINATED' || qualityStatus.status === 'UNSAFE') {
      const alertItem = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        areaId: area.id,
        level: area.risk.status,
        time: 'Just now',
        text: `WATER TELEMETRY ALERT in ${area.name}: Turbidity ${newTurbidity} NTU, TDS ${newTds} ppm. Water status: ${qualityStatus.label}.`
      };
      this.alerts.unshift(alertItem);
      if (this.alerts.length > 15) this.alerts.pop();
      this.notify(EVENTS.ALERT_TRIGGERED, alertItem);
    }

    // Fire notifications
    this.notify(EVENTS.WATER_UPDATED, { areaId, telemetry: area.telemetry, area });
    this.notify(EVENTS.STATE_MUTATED, { areaId, area });

    return area;
  }

  /**
   * Run dynamic Outbreak Simulation scenario
   */
  startOutbreakSimulation(targetAreaId = null) {
    if (this.isSimulationRunning) {
      this.stopOutbreakSimulation();
      return false;
    }

    const targetId = targetAreaId || this.selectedAreaId;
    this.isSimulationRunning = true;
    let step = 0;

    const simulationSteps = [
      { step: 1, delay: 500,  action: 'water', data: { turbidity: 11.5, tds: 650, ph: 8.2 }, msg: 'Simulated monsoon runoff entering water distribution line...' },
      { step: 2, delay: 2000, action: 'report', data: { symptoms: ['Acute Diarrhea', 'Vomiting'], peopleAffected: 5, waterSource: 'Municipal Tap Line #4' }, msg: 'Citizen incident cluster logged in Ward 8...' },
      { step: 3, delay: 3500, action: 'water', data: { turbidity: 18.2, tds: 840, ph: 8.7 }, msg: 'Upstream sewer breach detected! Critical turbidity surge...' },
      { step: 4, delay: 5000, action: 'report', data: { symptoms: ['Acute Diarrhea', 'Abdominal Cramps', 'Fever / Chills'], peopleAffected: 8, waterSource: 'Municipal Tap Line #4' }, msg: 'Multiple households reporting severe gastroenteritis...' },
      { step: 5, delay: 6500, action: 'report', data: { symptoms: ['Vomiting', 'Dehydration'], peopleAffected: 6, waterSource: 'Municipal Tap Line #4' }, msg: 'Epidemic threshold crossed! Automatic boil-water advisory triggered.' }
    ];

    simulationSteps.forEach(s => {
      setTimeout(() => {
        if (!this.isSimulationRunning) return;

        if (s.action === 'water') {
          this.updateWaterQuality(targetId, s.data);
        } else if (s.action === 'report') {
          this.submitIllnessReport(targetId, s.data);
        }

        this.notify(EVENTS.SIMULATION_STEP, { step: s.step, message: s.msg, areaId: targetId });

        if (s.step === simulationSteps.length) {
          this.isSimulationRunning = false;
        }
      }, s.delay);
    });

    return true;
  }

  stopOutbreakSimulation() {
    this.isSimulationRunning = false;
  }

  /**
   * Calculate network-wide overview statistics
   */
  getGlobalSummary() {
    const areaValues = Object.values(this.areas);
    let criticalCount = 0;
    let highCount = 0;
    let moderateCount = 0;
    let lowCount = 0;
    let totalReports = 0;
    let totalNodes = 0;
    let totalScoreSum = 0;

    areaValues.forEach(a => {
      totalReports += (a.illnessMetrics.totalReports || 0);
      totalNodes += (a.monitoringNodes || 10);
      totalScoreSum += a.risk.score;

      if (a.risk.status === 'CRITICAL') criticalCount++;
      else if (a.risk.status === 'HIGH') highCount++;
      else if (a.risk.status === 'MODERATE') moderateCount++;
      else lowCount++;
    });

    return {
      totalAreas: areaValues.length,
      avgRiskScore: Math.round(totalScoreSum / areaValues.length),
      criticalAreasCount: criticalCount,
      highAreasCount: highCount,
      moderateAreasCount: moderateCount,
      lowAreasCount: lowCount,
      totalReports,
      totalNodes
    };
  }

  getAlerts() {
    return this.alerts;
  }
}

export const store = new WaterPulseStore();
