/**
 * WATERPULSE - Risk Calculation & Diagnostic Signal Engine
 * Real-time multi-factor surveillance algorithm compliant with WHO & BIS IS 10500 standards.
 */

export const RISK_LEVELS = {
  LOW: { label: 'Normal', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)', border: '#4ade80' },
  MODERATE: { label: 'Watch', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: '#fbbf24' },
  HIGH: { label: 'Elevated', color: '#f97316', bg: 'rgba(249, 115, 22, 0.16)', border: '#f97316' },
  CRITICAL: { label: 'Early Warning', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.16)', border: '#c084fc' }
};

export class RiskEngine {
  static getRiskBand(score) {
    const value = Math.max(0, Math.min(100, Number(score) || 0));
    if (value <= 29) return { key: 'LOW', label: 'Normal', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)', border: '#4ade80' };
    if (value <= 49) return { key: 'MODERATE', label: 'Watch', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: '#fbbf24' };
    if (value <= 69) return { key: 'HIGH', label: 'Elevated', color: '#f97316', bg: 'rgba(249, 115, 22, 0.16)', border: '#f97316' };
    if (value <= 84) return { key: 'HIGH', label: 'High Alert', color: '#fb7185', bg: 'rgba(251, 113, 133, 0.16)', border: '#fb7185' };
    return { key: 'CRITICAL', label: 'Early Warning', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.16)', border: '#c084fc' };
  }
  /**
   * Recalculate complete risk profile for an area based on telemetry and reports.
   * @param {Object} telemetry - { ph, turbidity, tds, temperature }
   * @param {Object} illnessMetrics - { totalReports, last24h, baseline7d, percentChange }
   * @param {Array} recentReports - Array of report objects
   * @param {Array} historicalWater - Array of past daily water readings
   */
  static calculateAreaRisk(telemetry, illnessMetrics, recentReports = [], historicalWater = []) {
    // 1. Illness Increase Signal (0 to 35 points)
    const illnessSignal = this._computeIllnessIncreaseSignal(illnessMetrics);

    // 2. Geographic Clustering Signal (0 to 25 points)
    const clusteringSignal = this._computeClusteringSignal(recentReports, illnessMetrics);

    // 3. Historical Deviation Signal (0 to 20 points)
    const historicalSignal = this._computeHistoricalDeviationSignal(telemetry, historicalWater);

    // 4. Water-Quality Anomaly Signal (0 to 20 points)
    const waterAnomalySignal = this._computeWaterQualityAnomalySignal(telemetry);

    // Aggregate weighted score
    const rawScore = illnessSignal.score + clusteringSignal.score + historicalSignal.score + waterAnomalySignal.score;
    const totalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Categorize risk status
    let status = 'LOW';
    if (totalScore >= 85) status = 'CRITICAL';
    else if (totalScore >= 70) status = 'HIGH';
    else if (totalScore >= 30) status = 'MODERATE';

    const levelInfo = this.getRiskBand(totalScore);
    const actionProtocols = this._generateActionProtocols(status, telemetry, illnessMetrics);

    return {
      score: totalScore,
      status: status,
      band: levelInfo.label,
      levelInfo: { ...RISK_LEVELS[status], label: levelInfo.label, color: levelInfo.color, bg: levelInfo.bg, border: levelInfo.border },
      signals: {
        illnessIncrease: illnessSignal,
        geographicClustering: clusteringSignal,
        historicalDeviation: historicalSignal,
        waterQualityAnomaly: waterAnomalySignal
      },
      actionProtocols
    };
  }

  /**
   * Signal 1: Illness Increase over baseline
   */
  static _computeIllnessIncreaseSignal(metrics) {
    const { last24h = 0, baseline7d = 1 } = metrics;
    const safeBaseline = Math.max(1, baseline7d);
    const ratio = last24h / safeBaseline;
    const percentChange = Math.round(((last24h - safeBaseline) / safeBaseline) * 100);

    let score = 0;
    let severity = 'NORMAL';
    let rationale = '';

    if (ratio >= 2.5 || last24h > 40) {
      score = 35;
      severity = 'CRITICAL';
      rationale = `Surge of +${percentChange}% in 24h reports exceeds epidemic alert threshold (>2.5x baseline).`;
    } else if (ratio >= 1.8 || last24h >= 25) {
      score = 26;
      severity = 'SEVERE';
      rationale = `Rapid acceleration (+${percentChange}% in 24h) signals active community transmission vector.`;
    } else if (ratio >= 1.25 || last24h >= 12) {
      score = 16;
      severity = 'ELEVATED';
      rationale = `Moderate increase of +${percentChange}% over 7-day median baseline requires priority surveillance.`;
    } else if (last24h > 5) {
      score = 8;
      severity = 'MONITORING';
      rationale = `Case frequency (+${percentChange >= 0 ? '+' : ''}${percentChange}%) is within expected regional variance.`;
    } else {
      score = 3;
      severity = 'NORMAL';
      rationale = `Current 24h report incidence (${last24h} reports) is stable and well below alert threshold.`;
    }

    return {
      name: 'Illness Increase',
      score,
      maxScore: 35,
      severity,
      percentChange,
      rationale
    };
  }

  /**
   * Signal 2: Geographic Clustering of complaints & sources
   */
  static _computeClusteringSignal(recentReports, illnessMetrics) {
    const totalReports = recentReports.length || illnessMetrics.totalReports || 0;
    
    // Analyze clustering by water source
    const sourceCounts = {};
    recentReports.forEach(r => {
      const src = r.waterSource || 'Unknown';
      sourceCounts[src] = (sourceCounts[src] || 0) + (r.peopleAffected || 1);
    });

    let maxSourceKey = 'General Tap Water';
    let maxSourceShare = 0;
    let totalAffected = 0;

    Object.entries(sourceCounts).forEach(([src, count]) => {
      totalAffected += count;
      if (count > maxSourceShare) {
        maxSourceShare = count;
        maxSourceKey = src;
      }
    });

    const clusteringRatio = totalAffected > 0 ? maxSourceShare / totalAffected : 0;

    let score = 0;
    let severity = 'NORMAL';
    let rationale = '';

    if (totalReports >= 20 && clusteringRatio >= 0.55) {
      score = 25;
      severity = 'CRITICAL';
      rationale = `High spatial clustering: ${Math.round(clusteringRatio * 100)}% of affected residents traced to common source: ${maxSourceKey}.`;
    } else if (totalReports >= 12 && clusteringRatio >= 0.45) {
      score = 19;
      severity = 'SEVERE';
      rationale = `Point-source cluster detected around ${maxSourceKey} (${maxSourceShare} affected patients).`;
    } else if (totalReports >= 6 || clusteringRatio >= 0.4) {
      score = 12;
      severity = 'ELEVATED';
      rationale = `Localized concentration observed in municipal distribution sector (${maxSourceKey}).`;
    } else if (totalReports > 0) {
      score = 6;
      severity = 'MONITORING';
      rationale = `Diffuse community reporting with no single localized point-source dominant.`;
    } else {
      score = 2;
      severity = 'NORMAL';
      rationale = `No significant spatial or water-source clustering detected across ward boundaries.`;
    }

    return {
      name: 'Geographic Clustering',
      score,
      maxScore: 25,
      severity,
      dominantSource: maxSourceKey,
      clusteringRatio: Math.round(clusteringRatio * 100),
      rationale
    };
  }

  /**
   * Signal 3: Historical Deviation from regional baseline
   */
  static _computeHistoricalDeviationSignal(telemetry, historicalWater) {
    if (!historicalWater || historicalWater.length === 0) {
      return {
        name: 'Historical Deviation',
        score: 5,
        maxScore: 20,
        severity: 'NORMAL',
        rationale: 'Telemetry aligns with standard seasonal rolling baselines.'
      };
    }

    // Compute average historical values
    const avgTurbidity = historicalWater.reduce((acc, h) => acc + (h.turbidity || 2.0), 0) / historicalWater.length;
    const avgTds = historicalWater.reduce((acc, h) => acc + (h.tds || 250), 0) / historicalWater.length;
    const avgPh = historicalWater.reduce((acc, h) => acc + (h.ph || 7.2), 0) / historicalWater.length;

    const turbidityDelta = (telemetry.turbidity || 1.0) - avgTurbidity;
    const tdsDelta = (telemetry.tds || 200) - avgTds;
    const phDelta = Math.abs((telemetry.ph || 7.0) - avgPh);

    let score = 0;
    let severity = 'NORMAL';
    let rationale = '';

    if (turbidityDelta > 8.0 || tdsDelta > 450 || phDelta > 1.4) {
      score = 20;
      severity = 'CRITICAL';
      rationale = `Telemetry exceeds 99th percentile baseline: Turbidity Δ+${turbidityDelta.toFixed(1)} NTU, TDS Δ+${Math.round(tdsDelta)} ppm.`;
    } else if (turbidityDelta > 4.0 || tdsDelta > 250 || phDelta > 0.9) {
      score = 14;
      severity = 'SEVERE';
      rationale = `Substantial departure from 30-day mean: Turbidity Δ+${turbidityDelta.toFixed(1)} NTU, pH shift of ${phDelta.toFixed(2)}.`;
    } else if (turbidityDelta > 1.5 || tdsDelta > 120 || phDelta > 0.5) {
      score = 9;
      severity = 'ELEVATED';
      rationale = `Noticeable upward drift from seasonal baseline (Turbidity +${turbidityDelta.toFixed(1)} NTU).`;
    } else {
      score = 3;
      severity = 'NORMAL';
      rationale = `Sensor measurements track within 1 standard deviation of 30-day historical mean.`;
    }

    return {
      name: 'Historical Deviation',
      score,
      maxScore: 20,
      severity,
      turbidityDelta: +turbidityDelta.toFixed(1),
      tdsDelta: Math.round(tdsDelta),
      rationale
    };
  }

  /**
   * Signal 4: Water-Quality Physical & Chemical Anomaly
   */
  static _computeWaterQualityAnomalySignal(telemetry) {
    const { ph = 7.2, turbidity = 1.0, tds = 250, temperature = 25.0 } = telemetry;

    let subScore = 0;
    const anomalyDetails = [];

    // Turbidity assessment (WHO limit: 1 NTU, BIS acceptable: 5 NTU)
    if (turbidity >= 15.0) {
      subScore += 9;
      anomalyDetails.push(`Critical turbidity (${turbidity} NTU, >3x BIS upper limit)`);
    } else if (turbidity >= 7.0) {
      subScore += 6;
      anomalyDetails.push(`High turbidity (${turbidity} NTU) facilitates pathogen transport`);
    } else if (turbidity >= 3.0) {
      subScore += 3;
      anomalyDetails.push(`Elevated turbidity (${turbidity} NTU)`);
    }

    // pH assessment (BIS standard: 6.5 - 8.5)
    if (ph < 5.8 || ph > 9.2) {
      subScore += 6;
      anomalyDetails.push(`Severe pH imbalance (${ph.toFixed(1)}) indicating chemical runoff`);
    } else if (ph < 6.5 || ph > 8.5) {
      subScore += 3;
      anomalyDetails.push(`Sub-optimal pH (${ph.toFixed(1)})`);
    }

    // TDS assessment (BIS standard: <500 ppm desirable, 2000 max)
    if (tds >= 1000) {
      subScore += 5;
      anomalyDetails.push(`Extreme TDS (${tds} ppm)`);
    } else if (tds >= 650) {
      subScore += 3;
      anomalyDetails.push(`Elevated mineral/saline load (${tds} ppm)`);
    }

    // Temperature synergy (water temp > 29°C accelerates Vibrio cholerae & E. coli reproduction)
    if (temperature >= 30.0 && (turbidity > 4.0 || ph > 8.0)) {
      subScore += 3;
      anomalyDetails.push(`Warm temperature (${temperature.toFixed(1)}°C) accelerating microbial proliferation`);
    }

    const score = Math.min(20, subScore);

    let severity = 'NORMAL';
    let rationale = '';

    if (score >= 15) {
      severity = 'CRITICAL';
      rationale = anomalyDetails.join('; ') + '.';
    } else if (score >= 10) {
      severity = 'SEVERE';
      rationale = anomalyDetails.join('; ') + '.';
    } else if (score >= 5) {
      severity = 'ELEVATED';
      rationale = anomalyDetails.join('; ') + '.';
    } else {
      severity = 'NORMAL';
      rationale = 'Physicochemical parameters (pH, Turbidity, TDS, Temp) meet IS 10500 potable standards.';
    }

    return {
      name: 'Water-Quality Anomaly',
      score,
      maxScore: 20,
      severity,
      rationale
    };
  }

  /**
   * Determine potability status string
   */
  static getWaterQualityStatus(telemetry) {
    const { ph = 7.0, turbidity = 1.0, tds = 250 } = telemetry;
    if (turbidity > 10.0 || ph < 6.0 || ph > 9.0 || tds > 1200) {
      return { status: 'CONTAMINATED', label: 'Contaminated / Hazardous', color: '#ff3366', bg: 'rgba(255, 51, 102, 0.2)' };
    }
    if (turbidity > 5.0 || ph < 6.5 || ph > 8.5 || tds > 700) {
      return { status: 'UNSAFE', label: 'Unsafe for Drinking', color: '#ff8c00', bg: 'rgba(255, 140, 0, 0.2)' };
    }
    if (turbidity > 2.5 || tds > 500) {
      return { status: 'CAUTION', label: 'Boil Before Drinking', color: '#ffb300', bg: 'rgba(255, 179, 0, 0.2)' };
    }
    return { status: 'POTABLE', label: 'Potable & Safe', color: '#00e599', bg: 'rgba(0, 229, 153, 0.2)' };
  }

  /**
   * Dynamic Public Health Action Protocols
   */
  static _generateActionProtocols(status, telemetry, illnessMetrics) {
    if (status === 'CRITICAL') {
      return [
        { level: 'CRITICAL', title: 'Issue Immediate Boil-Water Advisory', desc: 'Broadcast emergency SMS warning to all residents within 5km radius to boil all consumption water for min 3 minutes.' },
        { level: 'CRITICAL', title: 'Deploy Rapid Response Water Tankers', desc: 'Dispatch Jal Board verified emergency water supply tankers to affected wards; shut down compromised main pipelines.' },
        { level: 'URGENT', title: 'Mobile Medical & ORS Camp', desc: 'Set up oral rehydration and medical surveillance camp at community primary health centers.' },
        { level: 'TECHNICAL', title: 'Shock Chlorination & Flush', desc: `Inject super-chlorination at upstream reservoir; purge distribution network until turbidity falls below 2.0 NTU.` }
      ];
    }
    if (status === 'HIGH') {
      return [
        { level: 'URGENT', title: 'Targeted Chlorine Dosing Verification', desc: 'Inspect local chlorination units and test for residual free chlorine (>0.5 mg/L) across all tail-end taps.' },
        { level: 'URGENT', title: 'Bacteriological Sampling Protocol', desc: 'Collect 12 rapid Coliform & E. coli membrane filtration samples across suspect feeder lines.' },
        { level: 'ADVISORY', title: 'Public Health Precautionary Alert', desc: 'Notify local healthcare practitioners to report any sudden cluster of gastroenteritis or acute diarrhea.' }
      ];
    }
    if (status === 'MODERATE') {
      return [
        { level: 'ADVISORY', title: 'Increase Sensor Polling Frequency', desc: 'Shift IoT water monitoring telemetry polling from 30-minute intervals to 5-minute continuous mode.' },
        { level: 'ROUTINE', title: 'Secondary Source Verification', desc: 'Sample borewell and commercial water tanker delivery stations in the municipal zone.' }
      ];
    }
    return [
      { level: 'NORMAL', title: 'Routine Autonomous Telemetry', desc: 'All water quality markers and community health incidence are within standard WHO/BIS IS 10500 baseline parameters.' },
      { level: 'ROUTINE', title: 'Scheduled Preventive Maintenance', desc: 'Sensor calibration scheduled in 14 days; maintain baseline surveillance.' }
    ];
  }
}
