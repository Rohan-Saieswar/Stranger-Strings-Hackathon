/**
 * WATERPULSE — District-Level Data Module
 * Hierarchical state → district data for India.
 * Each district has its own water telemetry, illness metrics, risk profile, and sensors.
 */

function r(min, max, dp = 1) {
  return +(min + Math.random() * (max - min)).toFixed(dp);
}
function ri(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

// ─────────────────────────────────────────────────────────────
// DISTRICT DATABASE: Key states with detailed district profiles
// ─────────────────────────────────────────────────────────────
export const DISTRICT_DATA = {

  "Maharashtra": {
    totalDistricts: 36,
    monitoredPopulation: "124.7 Million",
    illnessReports: 64,
    reportedDeaths: 0,
    waterAnomalies: 8,
    highRiskDistricts: 3,
    earlyWarningDistricts: 5,
    avgWaterScore: 54,
    averageRisk: "HIGH",
    districts: {
      "Pune": {
        id: "Pune", name: "Pune", state: "Maharashtra",
        population: "9.4 Million", area: "15,643 km\u00b2",
        center: [18.5204, 73.8567],
        telemetry: { ph: 8.4, turbidity: 12.8, tds: 640, temperature: 28.5, status: "UNSAFE" },
        illnessMetrics: { totalReports: 31, last24h: 18, baseline7d: 8, percentChange: 125 },
        waterSources: ["Mutha River", "Mula River", "Municipal Grid"],
        sensors: [
          { id: "IOT-PUN-01", name: "Mutha River Intake", lat: 18.5204, lng: 73.8567, ph: 8.5, turbidity: 14.1, tds: 680, temp: 28.8, battery: "94%" },
          { id: "IOT-PUN-02", name: "Hadapsar Treatment Plant", lat: 18.5089, lng: 73.9260, ph: 8.2, turbidity: 10.4, tds: 590, temp: 28.1, battery: "88%" }
        ],
        recentReports: [
          { id: "REP-PUN-101", date: "2024-01-15 09:10", symptoms: "Acute Diarrhea, Vomiting", peopleAffected: 4, waterSource: "Municipal Tap Line #4", status: "VERIFIED" },
          { id: "REP-PUN-100", date: "2024-01-15 07:22", symptoms: "Abdominal Cramps, Nausea", peopleAffected: 2, waterSource: "Borewell Pump East", status: "INVESTIGATING" }
        ],
        healthTips: [
          "Boil all tap water for at least 1 minute before drinking",
          "Avoid consuming water from open wells or handpumps in flood-prone areas",
          "Use ORS immediately if a family member develops acute diarrhea",
          "Report illness clusters to the ward-level ASHA worker"
        ],
        riskScore: 78, riskStatus: "HIGH"
      },
      "Mumbai": {
        id: "Mumbai", name: "Mumbai", state: "Maharashtra",
        population: "20.7 Million", area: "603 km\u00b2",
        center: [19.0760, 72.8777],
        telemetry: { ph: 7.1, turbidity: 1.8, tds: 210, temperature: 27.0, status: "POTABLE" },
        illnessMetrics: { totalReports: 12, last24h: 4, baseline7d: 5, percentChange: -20 },
        waterSources: ["Tulsi Lake", "Vihar Lake", "Powai Lake", "BMC Grid"],
        sensors: [
          { id: "IOT-MUM-01", name: "Mithi River Confluence", lat: 19.0600, lng: 72.8600, ph: 8.6, turbidity: 15.2, tds: 710, temp: 29.2, battery: "91%" }
        ],
        recentReports: [
          { id: "REP-MUM-044", date: "2024-01-14 18:30", symptoms: "Mild Nausea", peopleAffected: 1, waterSource: "Municipal Supply", status: "VERIFIED" }
        ],
        healthTips: [
          "Water from BMC supply is treated — ensure household storage tanks are cleaned regularly",
          "Avoid drinking from stagnant water points during monsoon flooding",
          "Alert your housing society if you notice discoloured tap water"
        ],
        riskScore: 28, riskStatus: "LOW"
      },
      "Nashik": {
        id: "Nashik", name: "Nashik", state: "Maharashtra",
        population: "6.1 Million", area: "15,530 km\u00b2",
        center: [20.0059, 73.7898],
        telemetry: { ph: 7.6, turbidity: 4.2, tds: 340, temperature: 26.8, status: "SAFE" },
        illnessMetrics: { totalReports: 8, last24h: 3, baseline7d: 4, percentChange: -25 },
        waterSources: ["Gangapur Dam", "Godavari River"],
        sensors: [
          { id: "IOT-NSK-01", name: "Godavari Gauging Station", lat: 20.0059, lng: 73.7898, ph: 7.7, turbidity: 4.8, tds: 360, temp: 26.9, battery: "97%" }
        ],
        recentReports: [],
        healthTips: [
          "Gangapur reservoir levels are adequate — maintain chlorination practices at household level",
          "Wash vegetables with clean water before cooking"
        ],
        riskScore: 22, riskStatus: "LOW"
      },
      "Aurangabad": {
        id: "Aurangabad", name: "Chhatrapati Sambhajinagar (Aurangabad)", state: "Maharashtra",
        population: "3.7 Million", area: "10,106 km\u00b2",
        center: [19.8762, 75.3433],
        telemetry: { ph: 8.2, turbidity: 9.4, tds: 560, temperature: 28.2, status: "UNSAFE" },
        illnessMetrics: { totalReports: 22, last24h: 11, baseline7d: 5, percentChange: 120 },
        waterSources: ["Jayakwadi Dam", "Nathsagar"],
        sensors: [
          { id: "IOT-AUR-01", name: "Nathsagar Outflow Node", lat: 19.8762, lng: 75.3433, ph: 8.3, turbidity: 10.1, tds: 580, temp: 28.5, battery: "86%" }
        ],
        recentReports: [
          { id: "REP-AUR-012", date: "2024-01-15 06:20", symptoms: "Diarrhea, Vomiting", peopleAffected: 5, waterSource: "Municipal Feeder Line", status: "VERIFIED" }
        ],
        healthTips: [
          "Turbidity levels at the Nathsagar outflow are elevated — use filtration before drinking",
          "Jayakwadi reservoir has seasonal algal blooms — avoid direct recreational contact",
          "Report unusual odour or colour in tap water to the municipal helpline immediately"
        ],
        riskScore: 58, riskStatus: "MODERATE"
      },
      "Amravati": {
        id: "Amravati", name: "Amravati", state: "Maharashtra",
        population: "2.9 Million", area: "12,235 km\u00b2",
        center: [20.9374, 77.7796],
        telemetry: { ph: 7.3, turbidity: 2.1, tds: 265, temperature: 26.2, status: "POTABLE" },
        illnessMetrics: { totalReports: 4, last24h: 1, baseline7d: 3, percentChange: -67 },
        waterSources: ["Wan Reservoir", "Upper Wardha Dam"],
        sensors: [
          { id: "IOT-AMR-01", name: "Upper Wardha Node", lat: 20.9374, lng: 77.7796, ph: 7.3, turbidity: 2.0, tds: 260, temp: 26.0, battery: "99%" }
        ],
        recentReports: [],
        healthTips: ["Water quality stable. Maintain regular household chlorination.", "Inspect overhead storage tanks for algae and sediment monthly."],
        riskScore: 18, riskStatus: "LOW"
      }
    }
  },

  "Uttar Pradesh": {
    totalDistricts: 75,
    monitoredPopulation: "235 Million",
    illnessReports: 94,
    reportedDeaths: 0,
    waterAnomalies: 14,
    highRiskDistricts: 8,
    earlyWarningDistricts: 11,
    avgWaterScore: 74,
    averageRisk: "CRITICAL",
    districts: {
      "Varanasi": {
        id: "Varanasi", name: "Varanasi", state: "Uttar Pradesh",
        population: "3.7 Million", area: "1,535 km\u00b2",
        center: [25.2985, 83.0039],
        telemetry: { ph: 8.8, turbidity: 18.2, tds: 860, temperature: 30.1, status: "CONTAMINATED" },
        illnessMetrics: { totalReports: 48, last24h: 28, baseline7d: 11, percentChange: 155 },
        waterSources: ["Ganga River (Assi Ghat)", "Municipal Deep Tubewells"],
        sensors: [
          { id: "IOT-VAR-01", name: "Assi Ghat Real-time Buoy", lat: 25.2985, lng: 83.0039, ph: 8.8, turbidity: 18.2, tds: 860, temp: 30.1, battery: "96%" }
        ],
        recentReports: [
          { id: "REP-UP-341", date: "2024-01-15 08:00", symptoms: "Acute Diarrhea, High Fever", peopleAffected: 6, waterSource: "Assi Ghat Handpump", status: "VERIFIED" },
          { id: "REP-UP-340", date: "2024-01-15 06:30", symptoms: "Severe Gastroenteritis", peopleAffected: 8, waterSource: "Municipal Feeder Pipe Ward 12", status: "VERIFIED" }
        ],
        healthTips: [
          "CRITICAL: Do NOT drink untreated Ganga water — boil all water for at least 5 minutes",
          "Seek immediate medical care for children with diarrhea and signs of dehydration",
          "Reported illness pattern may warrant investigation of water and sanitation conditions in Ward 12",
          "Use only sealed packaged water for infant formula and oral medication",
          "Alert the local NUHM team if you see 3 or more cases in the same street"
        ],
        riskScore: 92, riskStatus: "CRITICAL"
      },
      "Kanpur": {
        id: "Kanpur", name: "Kanpur", state: "Uttar Pradesh",
        population: "4.6 Million", area: "3,155 km\u00b2",
        center: [26.4385, 80.3956],
        telemetry: { ph: 8.6, turbidity: 15.5, tds: 810, temperature: 29.5, status: "CONTAMINATED" },
        illnessMetrics: { totalReports: 36, last24h: 20, baseline7d: 9, percentChange: 122 },
        waterSources: ["Ganga", "Jajmau Industrial Effluent Zone"],
        sensors: [
          { id: "IOT-KAN-01", name: "Jajmau Industrial Effluent Monitor", lat: 26.4385, lng: 80.3956, ph: 8.6, turbidity: 15.5, tds: 810, temp: 29.5, battery: "84%" }
        ],
        recentReports: [
          { id: "REP-KAN-055", date: "2024-01-15 07:10", symptoms: "Skin Rashes, Itching", peopleAffected: 7, waterSource: "Ganga Canal Feeder", status: "INVESTIGATING" }
        ],
        healthTips: [
          "Industrial effluent in the Jajmau zone has elevated TDS — avoid direct water contact",
          "Children and elderly should use only filtered or packaged water",
          "Reported illness pattern may warrant investigation of tannery discharge corridors",
          "Wash hands with soap after any contact with floodwater or surface water"
        ],
        riskScore: 85, riskStatus: "CRITICAL"
      },
      "Lucknow": {
        id: "Lucknow", name: "Lucknow", state: "Uttar Pradesh",
        population: "4.6 Million", area: "2,528 km\u00b2",
        center: [26.8467, 80.9462],
        telemetry: { ph: 7.8, turbidity: 5.4, tds: 420, temperature: 27.5, status: "UNSAFE" },
        illnessMetrics: { totalReports: 14, last24h: 6, baseline7d: 5, percentChange: 20 },
        waterSources: ["Gomti River", "LMC Supply Grid"],
        sensors: [
          { id: "IOT-LKO-01", name: "Gomti River Station", lat: 26.8467, lng: 80.9462, ph: 7.8, turbidity: 5.4, tds: 420, temp: 27.5, battery: "90%" }
        ],
        recentReports: [
          { id: "REP-LKO-021", date: "2024-01-14 19:00", symptoms: "Nausea, Vomiting", peopleAffected: 2, waterSource: "LMC Tap Water", status: "VERIFIED" }
        ],
        healthTips: [
          "Gomti River turbidity is mildly elevated — run taps for 30 seconds before drinking",
          "Ensure household RO/filters are serviced and membrane replaced as recommended",
          "During waterlogging events, use chlorine tablets in household storage"
        ],
        riskScore: 48, riskStatus: "MODERATE"
      },
      "Agra": {
        id: "Agra", name: "Agra", state: "Uttar Pradesh",
        population: "4.4 Million", area: "4,027 km\u00b2",
        center: [27.1767, 78.0081],
        telemetry: { ph: 8.1, turbidity: 7.2, tds: 510, temperature: 28.0, status: "UNSAFE" },
        illnessMetrics: { totalReports: 18, last24h: 9, baseline7d: 6, percentChange: 50 },
        waterSources: ["Yamuna River", "Groundwater Aquifer Zone"],
        sensors: [
          { id: "IOT-AGR-01", name: "Yamuna Intake Point", lat: 27.1767, lng: 78.0081, ph: 8.2, turbidity: 7.8, tds: 540, temp: 28.3, battery: "88%" }
        ],
        recentReports: [
          { id: "REP-AGR-014", date: "2024-01-14 14:30", symptoms: "Jaundice symptoms", peopleAffected: 3, waterSource: "Borewell near Yamuna bank", status: "INVESTIGATING" }
        ],
        healthTips: [
          "Yamuna TDS is elevated — avoid drinking untreated groundwater near the riverbank",
          "Jaundice symptoms may indicate hepatitis A risk — consult a doctor immediately",
          "Reported illness pattern may warrant investigation of water and sanitation conditions in low-lying wards"
        ],
        riskScore: 62, riskStatus: "HIGH"
      }
    }
  },

  "Delhi": {
    totalDistricts: 11,
    monitoredPopulation: "32 Million",
    illnessReports: 28,
    reportedDeaths: 0,
    waterAnomalies: 5,
    highRiskDistricts: 3,
    earlyWarningDistricts: 4,
    avgWaterScore: 61,
    averageRisk: "HIGH",
    districts: {
      "South Delhi": {
        id: "South Delhi", name: "South Delhi", state: "Delhi",
        population: "2.7 Million", area: "249 km\u00b2",
        center: [28.5355, 77.3910],
        telemetry: { ph: 8.3, turbidity: 9.8, tds: 680, temperature: 28.8, status: "UNSAFE" },
        illnessMetrics: { totalReports: 14, last24h: 8, baseline7d: 4, percentChange: 100 },
        waterSources: ["Yamuna Canal Feeders", "DJB Grid"],
        sensors: [
          { id: "IOT-SDL-01", name: "Okhla Barrage Sensor", lat: 28.5355, lng: 77.3910, ph: 8.4, turbidity: 10.5, tds: 720, temp: 29.1, battery: "92%" }
        ],
        recentReports: [
          { id: "REP-SDL-033", date: "2024-01-15 08:45", symptoms: "Diarrhea, Fever", peopleAffected: 3, waterSource: "DJB Municipal Tap", status: "VERIFIED" }
        ],
        healthTips: [
          "DJB supply near Okhla floodplain has elevated TDS — use RO water for drinking",
          "Reported illness pattern may warrant investigation of Yamuna floodplain water and sanitation conditions",
          "Do not use stormwater or open drains for any household purposes"
        ],
        riskScore: 66, riskStatus: "HIGH"
      },
      "East Delhi": {
        id: "East Delhi", name: "East Delhi", state: "Delhi",
        population: "1.7 Million", area: "64 km\u00b2",
        center: [28.6280, 77.2800],
        telemetry: { ph: 8.5, turbidity: 11.2, tds: 780, temperature: 29.2, status: "UNSAFE" },
        illnessMetrics: { totalReports: 18, last24h: 10, baseline7d: 5, percentChange: 100 },
        waterSources: ["Yamuna (Kondli)", "Groundwater"],
        sensors: [
          { id: "IOT-EDL-01", name: "Kondli STP Monitor", lat: 28.6280, lng: 77.2800, ph: 8.6, turbidity: 12.0, tds: 800, temp: 29.5, battery: "89%" }
        ],
        recentReports: [
          { id: "REP-EDL-027", date: "2024-01-15 07:20", symptoms: "Acute Diarrhea, Cramps", peopleAffected: 5, waterSource: "Colony Borewell", status: "VERIFIED" }
        ],
        healthTips: [
          "Yamuna contamination near Kondli is severe — do not use river water under any circumstances",
          "Reported illness pattern may warrant local investigation of colony borewells",
          "Use packaged or RO-filtered water for drinking and cooking only"
        ],
        riskScore: 74, riskStatus: "HIGH"
      },
      "New Delhi": {
        id: "New Delhi", name: "New Delhi (NDMC Zone)", state: "Delhi",
        population: "0.3 Million", area: "35 km\u00b2",
        center: [28.6139, 77.2090],
        telemetry: { ph: 7.2, turbidity: 1.4, tds: 210, temperature: 26.5, status: "POTABLE" },
        illnessMetrics: { totalReports: 2, last24h: 1, baseline7d: 2, percentChange: -50 },
        waterSources: ["DJB Centralized Grid"],
        sensors: [
          { id: "IOT-NDL-01", name: "NDMC Zone Sensor", lat: 28.6139, lng: 77.2090, ph: 7.2, turbidity: 1.4, tds: 210, temp: 26.5, battery: "99%" }
        ],
        recentReports: [],
        healthTips: ["Water quality in NDMC zone is within acceptable limits. Continue regular household hygiene."],
        riskScore: 20, riskStatus: "LOW"
      }
    }
  },

  "Karnataka": {
    totalDistricts: 31,
    monitoredPopulation: "68 Million",
    illnessReports: 42,
    reportedDeaths: 0,
    waterAnomalies: 6,
    highRiskDistricts: 2,
    earlyWarningDistricts: 4,
    avgWaterScore: 52,
    averageRisk: "MODERATE",
    districts: {
      "Bengaluru Urban": {
        id: "Bengaluru Urban", name: "Bengaluru Urban", state: "Karnataka",
        population: "12.5 Million", area: "2,190 km\u00b2",
        center: [12.9716, 77.5946],
        telemetry: { ph: 7.9, turbidity: 8.2, tds: 510, temperature: 27.2, status: "UNSAFE" },
        illnessMetrics: { totalReports: 25, last24h: 12, baseline7d: 6, percentChange: 100 },
        waterSources: ["Cauvery (BWSSB)", "Varthur and Bellandur Lakes"],
        sensors: [
          { id: "IOT-BLR-01", name: "Bellandur Outflow Sensor #3", lat: 12.9360, lng: 77.6740, ph: 8.0, turbidity: 9.1, tds: 540, temp: 27.5, battery: "92%" },
          { id: "IOT-BLR-02", name: "Varthur Lake Wetland Node", lat: 12.9430, lng: 77.7290, ph: 7.8, turbidity: 7.6, tds: 490, temp: 26.9, battery: "95%" }
        ],
        recentReports: [
          { id: "REP-BLR-078", date: "2024-01-15 09:00", symptoms: "Acute Diarrhea, Stomach Cramps", peopleAffected: 3, waterSource: "Apartment Tanker Supply", status: "VERIFIED" }
        ],
        healthTips: [
          "Bellandur Lake froth contains toxic chemicals — do not allow children to play near it",
          "Verify that water tankers are sourced from BWSSB-approved suppliers",
          "Reported illness pattern near tech corridor may warrant investigation of tanker water quality",
          "Install NSF-certified filters for all drinking water in areas with tanker dependency"
        ],
        riskScore: 62, riskStatus: "HIGH"
      },
      "Mysuru": {
        id: "Mysuru", name: "Mysuru", state: "Karnataka",
        population: "3.4 Million", area: "6,854 km\u00b2",
        center: [12.2958, 76.6394],
        telemetry: { ph: 7.3, turbidity: 2.4, tds: 290, temperature: 26.0, status: "POTABLE" },
        illnessMetrics: { totalReports: 6, last24h: 2, baseline7d: 3, percentChange: -33 },
        waterSources: ["Cauvery River", "Kabini Reservoir"],
        sensors: [
          { id: "IOT-MYS-01", name: "Kabini Intake Node", lat: 12.2958, lng: 76.6394, ph: 7.3, turbidity: 2.4, tds: 290, temp: 26.0, battery: "97%" }
        ],
        recentReports: [],
        healthTips: ["Cauvery water quality at Mysuru is within acceptable limits. Maintain household storage hygiene."],
        riskScore: 24, riskStatus: "LOW"
      },
      "Kalaburagi": {
        id: "Kalaburagi", name: "Kalaburagi (Gulbarga)", state: "Karnataka",
        population: "2.6 Million", area: "16,034 km\u00b2",
        center: [17.3297, 76.8200],
        telemetry: { ph: 8.1, turbidity: 6.1, tds: 620, temperature: 28.5, status: "UNSAFE" },
        illnessMetrics: { totalReports: 14, last24h: 7, baseline7d: 4, percentChange: 75 },
        waterSources: ["Bhima River", "Deep Borewells"],
        sensors: [
          { id: "IOT-KLB-01", name: "Bhima Reach Sensor", lat: 17.3297, lng: 76.8200, ph: 8.2, turbidity: 6.8, tds: 650, temp: 28.8, battery: "84%" }
        ],
        recentReports: [
          { id: "REP-KLB-009", date: "2024-01-14 16:00", symptoms: "Vomiting, Fever", peopleAffected: 4, waterSource: "Deep Borewell Supply", status: "VERIFIED" }
        ],
        healthTips: [
          "Fluoride levels in deep borewells in northern Karnataka may exceed safe limits — prefer surface water supply",
          "Reported illness pattern may warrant investigation of borewell water and sanitation conditions"
        ],
        riskScore: 54, riskStatus: "MODERATE"
      }
    }
  },

  "Tamil Nadu": {
    totalDistricts: 38,
    monitoredPopulation: "77 Million",
    illnessReports: 19,
    reportedDeaths: 0,
    waterAnomalies: 3,
    highRiskDistricts: 1,
    earlyWarningDistricts: 3,
    avgWaterScore: 35,
    averageRisk: "MODERATE",
    districts: {
      "Chennai": {
        id: "Chennai", name: "Chennai", state: "Tamil Nadu",
        population: "11.5 Million", area: "1,189 km\u00b2",
        center: [13.0827, 80.2707],
        telemetry: { ph: 7.6, turbidity: 3.8, tds: 380, temperature: 28.2, status: "SAFE" },
        illnessMetrics: { totalReports: 9, last24h: 4, baseline7d: 4, percentChange: 0 },
        waterSources: ["Chembarambakkam Lake", "Poondi Reservoir", "CMWSSB Grid"],
        sensors: [
          { id: "IOT-CHN-01", name: "Poondi Reservoir Intake", lat: 13.0827, lng: 80.2707, ph: 7.6, turbidity: 3.8, tds: 380, temp: 28.2, battery: "94%" }
        ],
        recentReports: [
          { id: "REP-CHN-017", date: "2024-01-14 12:00", symptoms: "Mild Diarrhea", peopleAffected: 2, waterSource: "CMWSSB Tap", status: "VERIFIED" }
        ],
        healthTips: [
          "CMWSSB supply is generally treated — ensure terrace tanks are cleaned quarterly",
          "During Chennai water scarcity periods, verify tanker quality with a test kit"
        ],
        riskScore: 34, riskStatus: "MODERATE"
      },
      "Coimbatore": {
        id: "Coimbatore", name: "Coimbatore", state: "Tamil Nadu",
        population: "3.6 Million", area: "7,469 km\u00b2",
        center: [11.0168, 76.9558],
        telemetry: { ph: 7.2, turbidity: 1.9, tds: 240, temperature: 26.4, status: "POTABLE" },
        illnessMetrics: { totalReports: 5, last24h: 2, baseline7d: 3, percentChange: -33 },
        waterSources: ["Bhavani River", "Pillur Dam"],
        sensors: [
          { id: "IOT-CBE-01", name: "Pillur Dam Monitor", lat: 11.0168, lng: 76.9558, ph: 7.2, turbidity: 1.9, tds: 240, temp: 26.4, battery: "98%" }
        ],
        recentReports: [],
        healthTips: ["Bhavani River at Coimbatore is within acceptable limits. Maintain household hygiene."],
        riskScore: 20, riskStatus: "LOW"
      }
    }
  },

  "Gujarat": {
    totalDistricts: 33,
    monitoredPopulation: "70 Million",
    illnessReports: 15,
    reportedDeaths: 0,
    waterAnomalies: 2,
    highRiskDistricts: 1,
    earlyWarningDistricts: 2,
    avgWaterScore: 38,
    averageRisk: "MODERATE",
    districts: {
      "Ahmedabad": {
        id: "Ahmedabad", name: "Ahmedabad", state: "Gujarat",
        population: "8.4 Million", area: "8,707 km\u00b2",
        center: [23.0225, 72.5714],
        telemetry: { ph: 7.8, turbidity: 4.9, tds: 450, temperature: 27.5, status: "SAFE" },
        illnessMetrics: { totalReports: 10, last24h: 4, baseline7d: 4, percentChange: 0 },
        waterSources: ["Sabarmati River", "Narmada Canal"],
        sensors: [
          { id: "IOT-AMD-01", name: "Sabarmati Intake Monitor", lat: 23.0225, lng: 72.5714, ph: 7.8, turbidity: 4.9, tds: 450, temp: 27.5, battery: "92%" }
        ],
        recentReports: [
          { id: "REP-AMD-008", date: "2024-01-14 10:00", symptoms: "Abdominal Pain", peopleAffected: 2, waterSource: "Municipal Tap", status: "VERIFIED" }
        ],
        healthTips: [
          "Sabarmati water quality is adequate — maintain household tank hygiene",
          "Narmada canal supply is generally of good quality during non-monsoon months"
        ],
        riskScore: 36, riskStatus: "MODERATE"
      },
      "Surat": {
        id: "Surat", name: "Surat", state: "Gujarat",
        population: "6.1 Million", area: "7,657 km\u00b2",
        center: [21.1702, 72.8311],
        telemetry: { ph: 8.0, turbidity: 6.2, tds: 490, temperature: 28.0, status: "SAFE" },
        illnessMetrics: { totalReports: 7, last24h: 3, baseline7d: 3, percentChange: 0 },
        waterSources: ["Tapi River", "SMC Grid"],
        sensors: [
          { id: "IOT-SUR-01", name: "Tapi River Node", lat: 21.1702, lng: 72.8311, ph: 8.0, turbidity: 6.2, tds: 490, temp: 28.0, battery: "93%" }
        ],
        recentReports: [],
        healthTips: ["Tapi river quality is acceptable — filter tap water during post-monsoon turbidity spikes."],
        riskScore: 30, riskStatus: "LOW"
      }
    }
  },

  "West Bengal": {
    totalDistricts: 23,
    monitoredPopulation: "100 Million",
    illnessReports: 38,
    reportedDeaths: 0,
    waterAnomalies: 7,
    highRiskDistricts: 4,
    earlyWarningDistricts: 6,
    avgWaterScore: 62,
    averageRisk: "HIGH",
    districts: {
      "Kolkata": {
        id: "Kolkata", name: "Kolkata", state: "West Bengal",
        population: "14.8 Million", area: "1,886 km\u00b2",
        center: [22.5726, 88.3639],
        telemetry: { ph: 7.6, turbidity: 4.5, tds: 360, temperature: 27.8, status: "SAFE" },
        illnessMetrics: { totalReports: 11, last24h: 5, baseline7d: 5, percentChange: 0 },
        waterSources: ["Hooghly River", "KMC Grid"],
        sensors: [
          { id: "IOT-KOL-01", name: "Garden Reach Intake", lat: 22.5726, lng: 88.3639, ph: 7.6, turbidity: 4.5, tds: 360, temp: 27.8, battery: "91%" }
        ],
        recentReports: [
          { id: "REP-KOL-014", date: "2024-01-14 09:00", symptoms: "Vomiting, Loose Stools", peopleAffected: 3, waterSource: "Colony Tap", status: "VERIFIED" }
        ],
        healthTips: [
          "Hooghly water during monsoon contains industrial discharge — use filtered or boiled water only",
          "Alert KMC if you notice any change in water colour or odour"
        ],
        riskScore: 42, riskStatus: "MODERATE"
      },
      "Murshidabad": {
        id: "Murshidabad", name: "Murshidabad", state: "West Bengal",
        population: "7.1 Million", area: "5,324 km\u00b2",
        center: [24.1790, 88.2690],
        telemetry: { ph: 7.4, turbidity: 6.8, tds: 520, temperature: 27.5, status: "UNSAFE" },
        illnessMetrics: { totalReports: 24, last24h: 13, baseline7d: 7, percentChange: 86 },
        waterSources: ["Bhagirathi River", "Shallow Tubewells (Arsenic risk zone)"],
        sensors: [
          { id: "IOT-MUR-01", name: "Bhagirathi Station", lat: 24.1790, lng: 88.2690, ph: 7.5, turbidity: 7.2, tds: 540, temp: 27.8, battery: "85%" }
        ],
        recentReports: [
          { id: "REP-MUR-022", date: "2024-01-15 07:00", symptoms: "Diarrhea, Vomiting", peopleAffected: 7, waterSource: "Shallow Tubewell", status: "VERIFIED" }
        ],
        healthTips: [
          "WARNING: Murshidabad district has arsenic-affected shallow groundwater zones — use ONLY deep tubewells or arsenic-removal units",
          "Do NOT use shallow handpumps in Lalgola, Jalangi, and Farakka blocks",
          "Reported illness pattern may warrant investigation of tubewell water and arsenic contamination",
          "Contact district health authorities for free arsenic testing kits"
        ],
        riskScore: 76, riskStatus: "HIGH"
      }
    }
  },

  "Rajasthan": {
    totalDistricts: 50,
    monitoredPopulation: "79 Million",
    illnessReports: 12,
    reportedDeaths: 0,
    waterAnomalies: 2,
    highRiskDistricts: 1,
    earlyWarningDistricts: 2,
    avgWaterScore: 30,
    averageRisk: "MODERATE",
    districts: {
      "Jaipur": {
        id: "Jaipur", name: "Jaipur", state: "Rajasthan",
        population: "6.6 Million", area: "11,143 km\u00b2",
        center: [26.9124, 75.7873],
        telemetry: { ph: 7.5, turbidity: 2.8, tds: 330, temperature: 26.0, status: "POTABLE" },
        illnessMetrics: { totalReports: 6, last24h: 2, baseline7d: 3, percentChange: -33 },
        waterSources: ["Bisalpur Dam", "PHED Grid"],
        sensors: [
          { id: "IOT-JPR-01", name: "Bisalpur Intake", lat: 26.9124, lng: 75.7873, ph: 7.5, turbidity: 2.8, tds: 330, temp: 26.0, battery: "96%" }
        ],
        recentReports: [],
        healthTips: ["Bisalpur Dam supply is adequate. Ensure household storage is covered to prevent mosquito breeding."],
        riskScore: 24, riskStatus: "LOW"
      },
      "Barmer": {
        id: "Barmer", name: "Barmer", state: "Rajasthan",
        population: "2.6 Million", area: "28,387 km\u00b2",
        center: [25.7521, 71.3967],
        telemetry: { ph: 8.3, turbidity: 3.2, tds: 1200, temperature: 30.0, status: "UNSAFE" },
        illnessMetrics: { totalReports: 9, last24h: 5, baseline7d: 3, percentChange: 67 },
        waterSources: ["Indira Gandhi Canal", "Saline Groundwater (unsuitable for drinking)"],
        sensors: [
          { id: "IOT-BAR-01", name: "IGNP Canal Node", lat: 25.7521, lng: 71.3967, ph: 8.3, turbidity: 3.2, tds: 1200, temp: 30.0, battery: "87%" }
        ],
        recentReports: [
          { id: "REP-BAR-005", date: "2024-01-14 08:30", symptoms: "Skin Irritation, Rashes", peopleAffected: 4, waterSource: "Saline Groundwater", status: "VERIFIED" }
        ],
        healthTips: [
          "Groundwater TDS in Barmer exceeds 1000 ppm — only use IGNP canal supply or RO-treated water for drinking",
          "Saline water consumption long-term can cause kidney stress — consult a doctor if kidney issues arise",
          "Reported illness pattern (skin) may indicate mineral toxicity — water testing recommended"
        ],
        riskScore: 58, riskStatus: "MODERATE"
      }
    }
  }

};

/**
 * Get district data for a specific state
 */
export function getDistrictsForState(stateName) {
  return DISTRICT_DATA[stateName] || null;
}

/**
 * Get specific district data
 */
export function getDistrict(stateName, districtName) {
  const stateData = DISTRICT_DATA[stateName];
  if (!stateData) return null;
  return stateData.districts[districtName] || null;
}

/**
 * Generate auto district data for states not in the detailed database
 */
export function generateAutoDistricts(stateName, count = 4) {
  const riskLevels = ['LOW', 'LOW', 'MODERATE', 'MODERATE', 'HIGH'];
  const autoDistricts = {};
  const suffixes = ['Central', 'North', 'South', 'East'];
  for (let i = 0; i < Math.min(count, suffixes.length); i++) {
    const name = `${stateName} ${suffixes[i]}`;
    const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const score = risk === 'HIGH' ? ri(65, 79) : risk === 'MODERATE' ? ri(40, 64) : ri(10, 39);
    autoDistricts[name] = {
      id: name, name: name, state: stateName,
      population: `${ri(5, 30)} Lakh`, area: `${ri(1000, 8000)} km\u00b2`,
      center: [r(20.0, 28.0), r(72.0, 88.0)],
      telemetry: {
        ph: r(7.0, 8.0), turbidity: r(1.0, 5.0), tds: ri(200, 400), temperature: r(25.0, 28.0),
        status: risk === 'HIGH' ? 'UNSAFE' : 'POTABLE'
      },
      illnessMetrics: { totalReports: ri(2, 15), last24h: ri(1, 5), baseline7d: 3, percentChange: ri(-20, 40) },
      waterSources: [`${stateName} River Basin`, 'Municipal Grid'],
      sensors: [],
      recentReports: [],
      healthTips: [
        'Maintain regular cleaning of household water storage containers.',
        'Use filtered or boiled water for drinking.',
        'Report any illness clusters to your nearest ASHA worker.'
      ],
      riskScore: score,
      riskStatus: risk
    };
  }
  return autoDistricts;
}
