/**
 * WATERPULSE - India Baseline Geospatial & Water Surveillance Data
 * Real coordinates, river basins, IoT sensor telemetry, and historical epidemiologic baselines.
 */

// Helper to generate past dates
function getPastDate(daysAgo, hourOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hourOffset);
  return d.toISOString().replace('T', ' ').substring(0, 16);
}

export const INITIAL_AREAS_DATA = {
  "Maharashtra": {
    id: "Maharashtra",
    name: "Maharashtra - Pune Urban Basin",
    shortName: "Maharashtra",
    state: "Maharashtra",
    basin: "Bhima & Mula-Mutha River Catchment",
    center: [19.7515, 75.7139],
    zoom: 7,
    population: "124 Million",
    monitoringNodes: 42,
    telemetry: {
      ph: 8.4,
      turbidity: 12.8,
      tds: 640,
      temperature: 28.5,
      status: "UNSAFE"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.2, turbidity: 2.1, tds: 280, temperature: 26.0 },
      { date: "Day -5", ph: 7.3, turbidity: 2.4, tds: 295, temperature: 26.4 },
      { date: "Day -4", ph: 7.5, turbidity: 3.8, tds: 340, temperature: 27.0 },
      { date: "Day -3", ph: 7.8, turbidity: 6.2, tds: 420, temperature: 27.8 },
      { date: "Day -2", ph: 8.1, turbidity: 9.5, tds: 530, temperature: 28.1 },
      { date: "Day -1", ph: 8.3, turbidity: 11.2, tds: 590, temperature: 28.3 },
      { date: "Today",  ph: 8.4, turbidity: 12.8, tds: 640, temperature: 28.5 }
    ],
    illnessMetrics: {
      totalReports: 64,
      last24h: 31,
      baseline7d: 8,
      percentChange: 287
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 28,
      "Vomiting": 19,
      "Abdominal Cramps": 12,
      "Fever / Chills": 8,
      "Skin Irritation": 4
    },
    historicalIllness: [
      { date: "Day -6", reports: 7, baseline: 8 },
      { date: "Day -5", reports: 8, baseline: 8 },
      { date: "Day -4", reports: 11, baseline: 8 },
      { date: "Day -3", reports: 15, baseline: 8 },
      { date: "Day -2", reports: 22, baseline: 8 },
      { date: "Day -1", reports: 26, baseline: 8 },
      { date: "Today",  reports: 31, baseline: 8 }
    ],
    recentReports: [
      { id: "REP-MH-109", date: getPastDate(0, 1), symptoms: "Acute Diarrhea, Vomiting", peopleAffected: 4, waterSource: "Municipal Tap Line #4", status: "VERIFIED" },
      { id: "REP-MH-108", date: getPastDate(0, 3), symptoms: "Severe Cramps, Nausea", peopleAffected: 2, waterSource: "Borewell Pump East", status: "VERIFIED" },
      { id: "REP-MH-107", date: getPastDate(0, 6), symptoms: "Vomiting, Fever", peopleAffected: 5, waterSource: "Municipal Tap Line #4", status: "INVESTIGATING" },
      { id: "REP-MH-106", date: getPastDate(0, 9), symptoms: "Diarrhea, Dehydration", peopleAffected: 3, waterSource: "Water Tanker Delivery", status: "VERIFIED" },
      { id: "REP-MH-105", date: getPastDate(1, 2), symptoms: "Abdominal Pain, Fever", peopleAffected: 2, waterSource: "Municipal Tap Line #4", status: "VERIFIED" }
    ],
    sensors: [
      { id: "IOT-PUN-01", name: "Mutha River Intake Station #1", lat: 18.5204, lng: 73.8567, ph: 8.5, turbidity: 14.1, tds: 680, temp: 28.8, battery: "94%" },
      { id: "IOT-PUN-02", name: "Hadapsar Water Treatment Outflow", lat: 18.5089, lng: 73.9260, ph: 8.2, turbidity: 10.4, tds: 590, temp: 28.1, battery: "88%" },
      { id: "IOT-MUM-01", name: "Mithi River Confluence Sensor", lat: 19.0600, lng: 72.8600, ph: 8.6, turbidity: 15.2, tds: 710, temp: 29.2, battery: "91%" }
    ]
  },

  "Uttar Pradesh": {
    id: "Uttar Pradesh",
    name: "Uttar Pradesh - Varanasi East Catchment",
    shortName: "Uttar Pradesh",
    state: "Uttar Pradesh",
    basin: "Middle Ganga River Basin",
    center: [26.8467, 80.9462],
    zoom: 7,
    population: "235 Million",
    monitoringNodes: 58,
    telemetry: {
      ph: 8.7,
      turbidity: 16.4,
      tds: 820,
      temperature: 29.8,
      status: "CONTAMINATED"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.4, turbidity: 3.5, tds: 380, temperature: 27.2 },
      { date: "Day -5", ph: 7.6, turbidity: 4.8, tds: 430, temperature: 27.8 },
      { date: "Day -4", ph: 8.0, turbidity: 7.9, tds: 560, temperature: 28.4 },
      { date: "Day -3", ph: 8.3, turbidity: 11.4, tds: 670, temperature: 29.0 },
      { date: "Day -2", ph: 8.5, turbidity: 13.9, tds: 740, temperature: 29.3 },
      { date: "Day -1", ph: 8.6, turbidity: 15.2, tds: 790, temperature: 29.6 },
      { date: "Today",  ph: 8.7, turbidity: 16.4, tds: 820, temperature: 29.8 }
    ],
    illnessMetrics: {
      totalReports: 94,
      last24h: 48,
      baseline7d: 11,
      percentChange: 336
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 44,
      "Vomiting": 26,
      "Abdominal Cramps": 18,
      "Fever / Chills": 14,
      "Skin Irritation": 6
    },
    historicalIllness: [
      { date: "Day -6", reports: 9, baseline: 11 },
      { date: "Day -5", reports: 12, baseline: 11 },
      { date: "Day -4", reports: 18, baseline: 11 },
      { date: "Day -3", reports: 27, baseline: 11 },
      { date: "Day -2", reports: 36, baseline: 11 },
      { date: "Day -1", reports: 42, baseline: 11 },
      { date: "Today",  reports: 48, baseline: 11 }
    ],
    recentReports: [
      { id: "REP-UP-341", date: getPastDate(0, 1), symptoms: "Acute Diarrhea, High Fever", peopleAffected: 6, waterSource: "Assi Ghat Shallow Handpump", status: "VERIFIED" },
      { id: "REP-UP-340", date: getPastDate(0, 2), symptoms: "Severe Gastroenteritis", peopleAffected: 8, waterSource: "Municipal Feeder Pipe Ward 12", status: "VERIFIED" },
      { id: "REP-UP-339", date: getPastDate(0, 5), symptoms: "Vomiting, Dehydration", peopleAffected: 3, waterSource: "Assi Ghat Shallow Handpump", status: "VERIFIED" },
      { id: "REP-UP-338", date: getPastDate(0, 7), symptoms: "Diarrhea, Cramps", peopleAffected: 4, waterSource: "Borewell Tank Sector 3", status: "INVESTIGATING" }
    ],
    sensors: [
      { id: "IOT-VAR-01", name: "Assi Ghat Real-time Buoy", lat: 25.2985, lng: 83.0039, ph: 8.8, turbidity: 18.2, tds: 860, temp: 30.1, battery: "96%" },
      { id: "IOT-KAN-01", name: "Jajmau Industrial Effluent Monitor", lat: 26.4385, lng: 80.3956, ph: 8.6, turbidity: 15.5, tds: 810, temp: 29.5, battery: "84%" }
    ]
  },

  "Karnataka": {
    id: "Karnataka",
    name: "Karnataka - Bellandur & Varthur Catchment",
    shortName: "Karnataka",
    state: "Karnataka",
    basin: "Dakshina Pinakini & Cauvery Sub-basin",
    center: [15.3173, 75.7139],
    zoom: 7,
    population: "68 Million",
    monitoringNodes: 36,
    telemetry: {
      ph: 7.9,
      turbidity: 8.2,
      tds: 510,
      temperature: 27.2,
      status: "UNSAFE"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.2, turbidity: 2.2, tds: 290, temperature: 25.8 },
      { date: "Day -5", ph: 7.3, turbidity: 2.8, tds: 320, temperature: 26.1 },
      { date: "Day -4", ph: 7.4, turbidity: 3.9, tds: 370, temperature: 26.5 },
      { date: "Day -3", ph: 7.6, turbidity: 5.5, tds: 430, temperature: 26.8 },
      { date: "Day -2", ph: 7.7, turbidity: 6.8, tds: 470, temperature: 27.0 },
      { date: "Day -1", ph: 7.8, turbidity: 7.6, tds: 495, temperature: 27.1 },
      { date: "Today",  ph: 7.9, turbidity: 8.2, tds: 510, temperature: 27.2 }
    ],
    illnessMetrics: {
      totalReports: 42,
      last24h: 18,
      baseline7d: 6,
      percentChange: 200
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 17,
      "Vomiting": 11,
      "Abdominal Cramps": 8,
      "Skin Irritation": 6,
      "Fever / Chills": 5
    },
    historicalIllness: [
      { date: "Day -6", reports: 5, baseline: 6 },
      { date: "Day -5", reports: 6, baseline: 6 },
      { date: "Day -4", reports: 8, baseline: 6 },
      { date: "Day -3", reports: 11, baseline: 6 },
      { date: "Day -2", reports: 14, baseline: 6 },
      { date: "Day -1", reports: 16, baseline: 6 },
      { date: "Today",  reports: 18, baseline: 6 }
    ],
    recentReports: [
      { id: "REP-KA-078", date: getPastDate(0, 2), symptoms: "Acute Diarrhea, Stomach Cramps", peopleAffected: 3, waterSource: "Apartment Tanker Supply", status: "VERIFIED" },
      { id: "REP-KA-077", date: getPastDate(0, 4), symptoms: "Vomiting, Skin Rashes", peopleAffected: 2, waterSource: "Community Borewell Bellandur", status: "VERIFIED" },
      { id: "REP-KA-076", date: getPastDate(0, 8), symptoms: "Severe Gastroenteritis", peopleAffected: 4, waterSource: "Apartment Tanker Supply", status: "INVESTIGATING" }
    ],
    sensors: [
      { id: "IOT-BLR-01", name: "Bellandur Outflow Sensor #3", lat: 12.9360, lng: 77.6740, ph: 8.0, turbidity: 9.1, tds: 540, temp: 27.5, battery: "92%" },
      { id: "IOT-BLR-02", name: "Varthur Lake Wetland Node", lat: 12.9430, lng: 77.7290, ph: 7.8, turbidity: 7.6, tds: 490, temp: 26.9, battery: "95%" }
    ]
  },

  "Delhi": {
    id: "Delhi",
    name: "Delhi - Yamuna Floodplain Okhla Cluster",
    shortName: "Delhi",
    state: "Delhi",
    basin: "Yamuna River System",
    center: [28.7041, 77.1025],
    zoom: 9,
    population: "32 Million",
    monitoringNodes: 28,
    telemetry: {
      ph: 8.3,
      turbidity: 14.1,
      tds: 780,
      temperature: 29.1,
      status: "UNSAFE"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.3, turbidity: 4.1, tds: 410, temperature: 27.0 },
      { date: "Day -5", ph: 7.5, turbidity: 5.6, tds: 490, temperature: 27.5 },
      { date: "Day -4", ph: 7.7, turbidity: 8.0, tds: 590, temperature: 28.0 },
      { date: "Day -3", ph: 7.9, turbidity: 10.3, tds: 670, temperature: 28.4 },
      { date: "Day -2", ph: 8.1, turbidity: 12.1, tds: 720, temperature: 28.8 },
      { date: "Day -1", ph: 8.2, turbidity: 13.5, tds: 760, temperature: 29.0 },
      { date: "Today",  ph: 8.3, turbidity: 14.1, tds: 780, temperature: 29.1 }
    ],
    illnessMetrics: {
      totalReports: 51,
      last24h: 24,
      baseline7d: 7,
      percentChange: 242
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 22,
      "Vomiting": 15,
      "Abdominal Cramps": 9,
      "Fever / Chills": 7,
      "Skin Irritation": 5
    },
    historicalIllness: [
      { date: "Day -6", reports: 6, baseline: 7 },
      { date: "Day -5", reports: 8, baseline: 7 },
      { date: "Day -4", reports: 12, baseline: 7 },
      { date: "Day -3", reports: 16, baseline: 7 },
      { date: "Day -2", reports: 19, baseline: 7 },
      { date: "Day -1", reports: 21, baseline: 7 },
      { date: "Today",  reports: 24, baseline: 7 }
    ],
    recentReports: [
      { id: "REP-DL-201", date: getPastDate(0, 1), symptoms: "Acute Diarrhea, Nausea", peopleAffected: 5, waterSource: "DJB Supply Line Ward 8", status: "VERIFIED" },
      { id: "REP-DL-200", date: getPastDate(0, 3), symptoms: "Vomiting, Cramps", peopleAffected: 3, waterSource: "Groundwater Extraction Bore", status: "VERIFIED" },
      { id: "REP-DL-199", date: getPastDate(0, 5), symptoms: "Gastroenteritis", peopleAffected: 4, waterSource: "DJB Supply Line Ward 8", status: "INVESTIGATING" }
    ],
    sensors: [
      { id: "IOT-DEL-01", name: "Okhla Barrage Downstream Node", lat: 28.5448, lng: 77.3075, ph: 8.4, turbidity: 15.0, tds: 810, temp: 29.4, battery: "89%" },
      { id: "IOT-DEL-02", name: "Wazirabad Intake Water Gauge", lat: 28.7118, lng: 77.2346, ph: 7.9, turbidity: 8.2, tds: 520, temp: 27.9, battery: "97%" }
    ]
  },

  "West Bengal": {
    id: "West Bengal",
    name: "West Bengal - Kolkata Hooghly Estuary",
    shortName: "West Bengal",
    state: "West Bengal",
    basin: "Lower Ganges Delta",
    center: [22.9868, 87.8550],
    zoom: 7,
    population: "99 Million",
    monitoringNodes: 38,
    telemetry: {
      ph: 7.6,
      turbidity: 7.1,
      tds: 460,
      temperature: 28.2,
      status: "CAUTION"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.1, turbidity: 2.8, tds: 280, temperature: 26.5 },
      { date: "Day -5", ph: 7.2, turbidity: 3.4, tds: 310, temperature: 26.9 },
      { date: "Day -4", ph: 7.3, turbidity: 4.5, tds: 360, temperature: 27.3 },
      { date: "Day -3", ph: 7.4, turbidity: 5.4, tds: 400, temperature: 27.7 },
      { date: "Day -2", ph: 7.5, turbidity: 6.2, tds: 430, temperature: 28.0 },
      { date: "Day -1", ph: 7.5, turbidity: 6.8, tds: 445, temperature: 28.1 },
      { date: "Today",  ph: 7.6, turbidity: 7.1, tds: 460, temperature: 28.2 }
    ],
    illnessMetrics: {
      totalReports: 34,
      last24h: 14,
      baseline7d: 5,
      percentChange: 180
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 14,
      "Vomiting": 8,
      "Abdominal Cramps": 6,
      "Fever / Chills": 4,
      "Skin Irritation": 2
    },
    historicalIllness: [
      { date: "Day -6", reports: 4, baseline: 5 },
      { date: "Day -5", reports: 5, baseline: 5 },
      { date: "Day -4", reports: 7, baseline: 5 },
      { date: "Day -3", reports: 9, baseline: 5 },
      { date: "Day -2", reports: 11, baseline: 5 },
      { date: "Day -1", reports: 13, baseline: 5 },
      { date: "Today",  reports: 14, baseline: 5 }
    ],
    recentReports: [
      { id: "REP-WB-112", date: getPastDate(0, 3), symptoms: "Acute Diarrhea, Nausea", peopleAffected: 3, waterSource: "Municipal River Supply", status: "VERIFIED" },
      { id: "REP-WB-111", date: getPastDate(0, 7), symptoms: "Abdominal Cramps", peopleAffected: 2, waterSource: "Tubewell Zone 4", status: "INVESTIGATING" }
    ],
    sensors: [
      { id: "IOT-KOL-01", name: "Hooghly Ghat Station 2", lat: 22.5850, lng: 88.3470, ph: 7.6, turbidity: 7.3, tds: 470, temp: 28.4, battery: "93%" }
    ]
  },

  "Tamil Nadu": {
    id: "Tamil Nadu",
    name: "Tamil Nadu - Chennai Cooum Basin",
    shortName: "Tamil Nadu",
    state: "Tamil Nadu",
    basin: "Cooum, Adyar & Palar Coastal Basins",
    center: [11.1271, 78.6569],
    zoom: 7,
    population: "76 Million",
    monitoringNodes: 34,
    telemetry: {
      ph: 7.4,
      turbidity: 3.8,
      tds: 380,
      temperature: 28.0,
      status: "CAUTION"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.1, turbidity: 2.1, tds: 290, temperature: 26.8 },
      { date: "Day -5", ph: 7.2, turbidity: 2.4, tds: 310, temperature: 27.0 },
      { date: "Day -4", ph: 7.2, turbidity: 2.7, tds: 330, temperature: 27.2 },
      { date: "Day -3", ph: 7.3, turbidity: 3.1, tds: 350, temperature: 27.5 },
      { date: "Day -2", ph: 7.3, turbidity: 3.4, tds: 365, temperature: 27.7 },
      { date: "Day -1", ph: 7.4, turbidity: 3.6, tds: 375, temperature: 27.9 },
      { date: "Today",  ph: 7.4, turbidity: 3.8, tds: 380, temperature: 28.0 }
    ],
    illnessMetrics: {
      totalReports: 22,
      last24h: 8,
      baseline7d: 5,
      percentChange: 60
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 9,
      "Vomiting": 5,
      "Abdominal Cramps": 4,
      "Fever / Chills": 3,
      "Skin Irritation": 1
    },
    historicalIllness: [
      { date: "Day -6", reports: 4, baseline: 5 },
      { date: "Day -5", reports: 5, baseline: 5 },
      { date: "Day -4", reports: 5, baseline: 5 },
      { date: "Day -3", reports: 6, baseline: 5 },
      { date: "Day -2", reports: 7, baseline: 5 },
      { date: "Day -1", reports: 8, baseline: 5 },
      { date: "Today",  reports: 8, baseline: 5 }
    ],
    recentReports: [
      { id: "REP-TN-044", date: getPastDate(0, 4), symptoms: "Mild Diarrhea, Nausea", peopleAffected: 2, waterSource: "Metrowater Tap", status: "VERIFIED" }
    ],
    sensors: [
      { id: "IOT-CHE-01", name: "Adyar Estuary Sensor 1", lat: 13.0067, lng: 80.2570, ph: 7.5, turbidity: 4.1, tds: 410, temp: 28.3, battery: "98%" }
    ]
  },

  "Gujarat": {
    id: "Gujarat",
    name: "Gujarat - Ahmedabad Sabarmati Corridor",
    shortName: "Gujarat",
    state: "Gujarat",
    basin: "Sabarmati & Narmada River Basins",
    center: [22.2587, 71.1924],
    zoom: 7,
    population: "70 Million",
    monitoringNodes: 32,
    telemetry: {
      ph: 7.5,
      turbidity: 4.2,
      tds: 410,
      temperature: 28.6,
      status: "CAUTION"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.2, turbidity: 2.0, tds: 300, temperature: 27.0 },
      { date: "Day -5", ph: 7.2, turbidity: 2.4, tds: 320, temperature: 27.2 },
      { date: "Day -4", ph: 7.3, turbidity: 3.0, tds: 350, temperature: 27.7 },
      { date: "Day -3", ph: 7.4, turbidity: 3.5, tds: 370, temperature: 28.1 },
      { date: "Day -2", ph: 7.4, turbidity: 3.8, tds: 390, temperature: 28.3 },
      { date: "Day -1", ph: 7.5, turbidity: 4.0, tds: 400, temperature: 28.5 },
      { date: "Today",  ph: 7.5, turbidity: 4.2, tds: 410, temperature: 28.6 }
    ],
    illnessMetrics: {
      totalReports: 25,
      last24h: 9,
      baseline7d: 5,
      percentChange: 80
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 11,
      "Vomiting": 6,
      "Abdominal Cramps": 4,
      "Fever / Chills": 3,
      "Skin Irritation": 1
    },
    historicalIllness: [
      { date: "Day -6", reports: 4, baseline: 5 },
      { date: "Day -5", reports: 5, baseline: 5 },
      { date: "Day -4", reports: 6, baseline: 5 },
      { date: "Day -3", reports: 7, baseline: 5 },
      { date: "Day -2", reports: 7, baseline: 5 },
      { date: "Day -1", reports: 8, baseline: 5 },
      { date: "Today",  reports: 9, baseline: 5 }
    ],
    recentReports: [
      { id: "REP-GJ-061", date: getPastDate(0, 3), symptoms: "Diarrhea, Cramps", peopleAffected: 3, waterSource: "Municipal Line East", status: "VERIFIED" }
    ],
    sensors: [
      { id: "IOT-AHM-01", name: "Sabarmati Riverfront Node", lat: 23.0300, lng: 72.5800, ph: 7.5, turbidity: 4.4, tds: 420, temp: 28.9, battery: "92%" }
    ]
  },

  "Kerala": {
    id: "Kerala",
    name: "Kerala - Vembanad Backwaters Sector",
    shortName: "Kerala",
    state: "Kerala",
    basin: "Periyar & Pamba River Basins",
    center: [10.8505, 76.2711],
    zoom: 7,
    population: "35 Million",
    monitoringNodes: 26,
    telemetry: {
      ph: 7.1,
      turbidity: 1.4,
      tds: 180,
      temperature: 26.8,
      status: "POTABLE"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.0, turbidity: 1.2, tds: 170, temperature: 26.2 },
      { date: "Day -5", ph: 7.0, turbidity: 1.3, tds: 172, temperature: 26.4 },
      { date: "Day -4", ph: 7.1, turbidity: 1.3, tds: 175, temperature: 26.5 },
      { date: "Day -3", ph: 7.1, turbidity: 1.4, tds: 178, temperature: 26.6 },
      { date: "Day -2", ph: 7.1, turbidity: 1.4, tds: 179, temperature: 26.7 },
      { date: "Day -1", ph: 7.1, turbidity: 1.4, tds: 180, temperature: 26.7 },
      { date: "Today",  ph: 7.1, turbidity: 1.4, tds: 180, temperature: 26.8 }
    ],
    illnessMetrics: {
      totalReports: 11,
      last24h: 3,
      baseline7d: 3,
      percentChange: 0
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 4,
      "Vomiting": 3,
      "Abdominal Cramps": 2,
      "Fever / Chills": 1,
      "Skin Irritation": 1
    },
    historicalIllness: [
      { date: "Day -6", reports: 3, baseline: 3 },
      { date: "Day -5", reports: 3, baseline: 3 },
      { date: "Day -4", reports: 3, baseline: 3 },
      { date: "Day -3", reports: 4, baseline: 3 },
      { date: "Day -2", reports: 3, baseline: 3 },
      { date: "Day -1", reports: 3, baseline: 3 },
      { date: "Today",  reports: 3, baseline: 3 }
    ],
    recentReports: [
      { id: "REP-KL-019", date: getPastDate(0, 6), symptoms: "Mild Vomiting", peopleAffected: 1, waterSource: "Rainwater Harvest Tank", status: "VERIFIED" }
    ],
    sensors: [
      { id: "IOT-KOC-01", name: "Periyar River Intake Node", lat: 10.0261, lng: 76.3125, ph: 7.1, turbidity: 1.3, tds: 175, temp: 26.8, battery: "99%" }
    ]
  },

  "Telangana": {
    id: "Telangana",
    name: "Telangana - Hyderabad Musi Basin",
    shortName: "Telangana",
    state: "Telangana",
    basin: "Krishna & Musi Sub-catchment",
    center: [18.1124, 79.0193],
    zoom: 7,
    population: "39 Million",
    monitoringNodes: 30,
    telemetry: {
      ph: 7.8,
      turbidity: 6.9,
      tds: 580,
      temperature: 28.4,
      status: "UNSAFE"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.3, turbidity: 2.5, tds: 340, temperature: 27.1 },
      { date: "Day -5", ph: 7.4, turbidity: 3.2, tds: 390, temperature: 27.5 },
      { date: "Day -4", ph: 7.5, turbidity: 4.5, tds: 450, temperature: 27.8 },
      { date: "Day -3", ph: 7.6, turbidity: 5.3, tds: 500, temperature: 28.0 },
      { date: "Day -2", ph: 7.7, turbidity: 6.1, tds: 540, temperature: 28.2 },
      { date: "Day -1", ph: 7.7, turbidity: 6.5, tds: 560, temperature: 28.3 },
      { date: "Today",  ph: 7.8, turbidity: 6.9, tds: 580, temperature: 28.4 }
    ],
    illnessMetrics: {
      totalReports: 36,
      last24h: 15,
      baseline7d: 6,
      percentChange: 150
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 16,
      "Vomiting": 9,
      "Abdominal Cramps": 6,
      "Fever / Chills": 3,
      "Skin Irritation": 2
    },
    historicalIllness: [
      { date: "Day -6", reports: 5, baseline: 6 },
      { date: "Day -5", reports: 6, baseline: 6 },
      { date: "Day -4", reports: 8, baseline: 6 },
      { date: "Day -3", reports: 11, baseline: 6 },
      { date: "Day -2", reports: 13, baseline: 6 },
      { date: "Day -1", reports: 14, baseline: 6 },
      { date: "Today",  reports: 15, baseline: 6 }
    ],
    recentReports: [
      { id: "REP-TS-089", date: getPastDate(0, 2), symptoms: "Acute Diarrhea, Fever", peopleAffected: 4, waterSource: "Commercial Tanker Supply", status: "VERIFIED" },
      { id: "REP-TS-088", date: getPastDate(0, 5), symptoms: "Vomiting, Stomach Ache", peopleAffected: 2, waterSource: "Groundwater Borewell", status: "VERIFIED" }
    ],
    sensors: [
      { id: "IOT-HYD-01", name: "Musi River Amberpet Gauge", lat: 17.3850, lng: 78.5200, ph: 7.9, turbidity: 7.4, tds: 610, temp: 28.7, battery: "91%" }
    ]
  },

  "Rajasthan": {
    id: "Rajasthan",
    name: "Rajasthan - Jaipur Amanishah Basin",
    shortName: "Rajasthan",
    state: "Rajasthan",
    basin: "Banas & Chambal River System",
    center: [27.0238, 74.2179],
    zoom: 7,
    population: "81 Million",
    monitoringNodes: 29,
    telemetry: {
      ph: 8.2,
      turbidity: 5.6,
      tds: 890,
      temperature: 30.2,
      status: "UNSAFE"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.8, turbidity: 3.1, tds: 650, temperature: 28.5 },
      { date: "Day -5", ph: 7.9, turbidity: 3.8, tds: 710, temperature: 28.9 },
      { date: "Day -4", ph: 8.0, turbidity: 4.4, tds: 760, temperature: 29.3 },
      { date: "Day -3", ph: 8.1, turbidity: 4.9, tds: 810, temperature: 29.7 },
      { date: "Day -2", ph: 8.1, turbidity: 5.2, tds: 850, temperature: 29.9 },
      { date: "Day -1", ph: 8.2, turbidity: 5.4, tds: 870, temperature: 30.0 },
      { date: "Today",  ph: 8.2, turbidity: 5.6, tds: 890, temperature: 30.2 }
    ],
    illnessMetrics: {
      totalReports: 29,
      last24h: 11,
      baseline7d: 5,
      percentChange: 120
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 13,
      "Abdominal Cramps": 7,
      "Vomiting": 5,
      "Fever / Chills": 3,
      "Skin Irritation": 1
    },
    historicalIllness: [
      { date: "Day -6", reports: 4, baseline: 5 },
      { date: "Day -5", reports: 5, baseline: 5 },
      { date: "Day -4", reports: 7, baseline: 5 },
      { date: "Day -3", reports: 8, baseline: 5 },
      { date: "Day -2", reports: 9, baseline: 5 },
      { date: "Day -1", reports: 10, baseline: 5 },
      { date: "Today",  reports: 11, baseline: 5 }
    ],
    recentReports: [
      { id: "REP-RJ-052", date: getPastDate(0, 3), symptoms: "Diarrhea, Dehydration", peopleAffected: 3, waterSource: "Deep Borewell Saline Zone", status: "VERIFIED" }
    ],
    sensors: [
      { id: "IOT-JAI-01", name: "Amanishah Nullah Monitor", lat: 26.9124, lng: 75.7873, ph: 8.3, turbidity: 6.0, tds: 920, temp: 30.5, battery: "94%" }
    ]
  },

  "Bihar": {
    id: "Bihar",
    name: "Bihar - Patna Ganga Ghats Basin",
    shortName: "Bihar",
    state: "Bihar",
    basin: "Ganga, Gandak & Kosi Basins",
    center: [25.0961, 85.3131],
    zoom: 7,
    population: "128 Million",
    monitoringNodes: 35,
    telemetry: {
      ph: 8.1,
      turbidity: 9.8,
      tds: 530,
      temperature: 28.9,
      status: "UNSAFE"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.3, turbidity: 3.4, tds: 320, temperature: 27.0 },
      { date: "Day -5", ph: 7.5, turbidity: 4.6, tds: 370, temperature: 27.5 },
      { date: "Day -4", ph: 7.7, turbidity: 6.1, tds: 430, temperature: 28.0 },
      { date: "Day -3", ph: 7.9, turbidity: 7.5, tds: 470, temperature: 28.3 },
      { date: "Day -2", ph: 8.0, turbidity: 8.6, tds: 500, temperature: 28.6 },
      { date: "Day -1", ph: 8.0, turbidity: 9.2, tds: 515, temperature: 28.8 },
      { date: "Today",  ph: 8.1, turbidity: 9.8, tds: 530, temperature: 28.9 }
    ],
    illnessMetrics: {
      totalReports: 45,
      last24h: 21,
      baseline7d: 8,
      percentChange: 162
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 21,
      "Vomiting": 12,
      "Abdominal Cramps": 7,
      "Fever / Chills": 4,
      "Skin Irritation": 1
    },
    historicalIllness: [
      { date: "Day -6", reports: 7, baseline: 8 },
      { date: "Day -5", reports: 8, baseline: 8 },
      { date: "Day -4", reports: 11, baseline: 8 },
      { date: "Day -3", reports: 14, baseline: 8 },
      { date: "Day -2", reports: 17, baseline: 8 },
      { date: "Day -1", reports: 19, baseline: 8 },
      { date: "Today",  reports: 21, baseline: 8 }
    ],
    recentReports: [
      { id: "REP-BR-140", date: getPastDate(0, 2), symptoms: "Severe Gastroenteritis", peopleAffected: 5, waterSource: "River Bank Handpump", status: "VERIFIED" }
    ],
    sensors: [
      { id: "IOT-PAT-01", name: "Patna NIT Ghat Sensor", lat: 25.6200, lng: 85.1700, ph: 8.2, turbidity: 10.5, tds: 550, temp: 29.1, battery: "90%" }
    ]
  },

  "Punjab": {
    id: "Punjab",
    name: "Punjab - Ludhiana Buddha Nullah",
    shortName: "Punjab",
    state: "Punjab",
    basin: "Sutlej & Beas River System",
    center: [31.1471, 75.3412],
    zoom: 7,
    population: "30 Million",
    monitoringNodes: 25,
    telemetry: {
      ph: 8.0,
      turbidity: 8.4,
      tds: 710,
      temperature: 26.5,
      status: "UNSAFE"
    },
    historicalWater: [
      { date: "Day -6", ph: 7.4, turbidity: 3.2, tds: 420, temperature: 24.8 },
      { date: "Day -5", ph: 7.5, turbidity: 4.1, tds: 490, temperature: 25.2 },
      { date: "Day -4", ph: 7.7, turbidity: 5.5, tds: 560, temperature: 25.7 },
      { date: "Day -3", ph: 7.8, turbidity: 6.8, tds: 620, temperature: 26.0 },
      { date: "Day -2", ph: 7.9, turbidity: 7.6, tds: 670, temperature: 26.2 },
      { date: "Day -1", ph: 8.0, turbidity: 8.0, tds: 690, temperature: 26.4 },
      { date: "Today",  ph: 8.0, turbidity: 8.4, tds: 710, temperature: 26.5 }
    ],
    illnessMetrics: {
      totalReports: 31,
      last24h: 13,
      baseline7d: 5,
      percentChange: 160
    },
    symptomsBreakdown: {
      "Acute Diarrhea": 13,
      "Abdominal Cramps": 8,
      "Vomiting": 6,
      "Skin Irritation": 3,
      "Fever / Chills": 1
    },
    historicalIllness: [
      { date: "Day -6", reports: 4, baseline: 5 },
      { date: "Day -5", reports: 5, baseline: 5 },
      { date: "Day -4", reports: 7, baseline: 5 },
      { date: "Day -3", reports: 9, baseline: 5 },
      { date: "Day -2", reports: 11, baseline: 5 },
      { date: "Day -1", reports: 12, baseline: 5 },
      { date: "Today",  reports: 13, baseline: 5 }
    ],
    recentReports: [
      { id: "REP-PB-073", date: getPastDate(0, 4), symptoms: "Diarrhea, Cramps", peopleAffected: 3, waterSource: "Submersible Pump Line", status: "VERIFIED" }
    ],
    sensors: [
      { id: "IOT-LUD-01", name: "Buddha Nullah Inflow Sensor", lat: 30.9010, lng: 75.8573, ph: 8.1, turbidity: 9.0, tds: 740, temp: 26.8, battery: "87%" }
    ]
  }
};

// Auto-populate remaining Indian states/UTs with baseline safe monitoring profiles
export const ALL_INDIAN_STATES_NAMES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

// Approximate state centers
export const STATE_COORDINATES = {
  "Andaman and Nicobar Islands": [11.7401, 92.6586],
  "Andhra Pradesh": [15.9129, 79.7400],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.0961, 85.3131],
  "Chandigarh": [30.7333, 76.7794],
  "Chhattisgarh": [21.2787, 81.8661],
  "Dadra and Nagar Haveli": [20.1809, 73.0169],
  "Daman and Diu": [20.4283, 72.8397],
  "Delhi": [28.7041, 77.1025],
  "Goa": [15.2993, 74.1240],
  "Gujarat": [22.2587, 71.1924],
  "Haryana": [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Jammu and Kashmir": [33.7782, 76.5762],
  "Jharkhand": [23.6102, 85.2799],
  "Karnataka": [15.3173, 75.7139],
  "Kerala": [10.8505, 76.2711],
  "Ladakh": [34.1526, 77.5771],
  "Lakshadweep": [10.5667, 72.6417],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Maharashtra": [19.7515, 75.7139],
  "Manipur": [24.6637, 93.9063],
  "Meghalaya": [25.4670, 91.3662],
  "Mizoram": [23.1645, 92.9376],
  "Nagaland": [26.1584, 94.5624],
  "Odisha": [20.9517, 85.0985],
  "Puducherry": [11.9416, 79.8083],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [27.0238, 74.2179],
  "Sikkim": [27.5330, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  "Telangana": [18.1124, 79.0193],
  "Tripura": [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.8550]
};

// Generate default area data for states not explicitly configured
export function buildCompleteAreasDatabase() {
  const db = { ...INITIAL_AREAS_DATA };

  ALL_INDIAN_STATES_NAMES.forEach(stateName => {
    if (!db[stateName]) {
      const coords = STATE_COORDINATES[stateName] || [22.5, 80.0];
      db[stateName] = {
        id: stateName,
        name: `${stateName} - Regional River Basin`,
        shortName: stateName,
        state: stateName,
        basin: `${stateName} River & Aquifer System`,
        center: coords,
        zoom: 7,
        population: "State Population",
        monitoringNodes: 18,
        telemetry: {
          ph: +(7.1 + Math.random() * 0.4).toFixed(1),
          turbidity: +(1.2 + Math.random() * 1.2).toFixed(1),
          tds: Math.round(210 + Math.random() * 80),
          temperature: +(25.5 + Math.random() * 2.0).toFixed(1),
          status: "POTABLE"
        },
        historicalWater: [
          { date: "Day -6", ph: 7.1, turbidity: 1.3, tds: 220, temperature: 25.4 },
          { date: "Day -5", ph: 7.2, turbidity: 1.4, tds: 225, temperature: 25.6 },
          { date: "Day -4", ph: 7.2, turbidity: 1.5, tds: 230, temperature: 25.8 },
          { date: "Day -3", ph: 7.3, turbidity: 1.5, tds: 235, temperature: 26.0 },
          { date: "Day -2", ph: 7.2, turbidity: 1.6, tds: 240, temperature: 26.1 },
          { date: "Day -1", ph: 7.2, turbidity: 1.6, tds: 242, temperature: 26.2 },
          { date: "Today",  ph: 7.2, turbidity: 1.7, tds: 245, temperature: 26.3 }
        ],
        illnessMetrics: {
          totalReports: Math.round(5 + Math.random() * 8),
          last24h: Math.round(1 + Math.random() * 3),
          baseline7d: 3,
          percentChange: 0
        },
        symptomsBreakdown: {
          "Acute Diarrhea": 4,
          "Vomiting": 2,
          "Abdominal Cramps": 2,
          "Fever / Chills": 1,
          "Skin Irritation": 0
        },
        historicalIllness: [
          { date: "Day -6", reports: 2, baseline: 3 },
          { date: "Day -5", reports: 3, baseline: 3 },
          { date: "Day -4", reports: 2, baseline: 3 },
          { date: "Day -3", reports: 3, baseline: 3 },
          { date: "Day -2", reports: 3, baseline: 3 },
          { date: "Day -1", reports: 2, baseline: 3 },
          { date: "Today",  reports: 2, baseline: 3 }
        ],
        recentReports: [
          { id: `REP-${stateName.substring(0,2).toUpperCase()}-001`, date: getPastDate(0, 12), symptoms: "Mild Diarrhea", peopleAffected: 1, waterSource: "Municipal Supply Tap", status: "VERIFIED" }
        ],
        sensors: [
          { id: `IOT-${stateName.substring(0,3).toUpperCase()}-01`, name: `${stateName} Regional Intake Node`, lat: coords[0] + 0.1, lng: coords[1] + 0.1, ph: 7.2, turbidity: 1.5, tds: 230, temp: 26.0, battery: "95%" }
        ]
      };
    }
  });

  return db;
}
