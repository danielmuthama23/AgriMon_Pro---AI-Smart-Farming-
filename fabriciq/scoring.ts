// src/fabric/core/scoring.ts
// Fabric IQ scoring engine — converts raw farm snapshots into normalized
// intelligence scores (0-100) with severity levels and human-readable drivers.

import type {
  FabricInputSnapshot,
  FabricBudgetSnapshot,
  FabricSecuritySnapshot,
  FabricZoneScore,
  FabricFinanceScore,
  FabricSecurityScore,
  FabricScoreLevel,
} from '../types';

/** Clamp a number between 0 and 100. */
export const clampScore = (value: number): number =>
  Math.max(0, Math.min(100, Math.round(value)));

/** Convert a 0-100 score into a qualitative level. */
export const scoreToLevel = (score: number): FabricScoreLevel => {
  if (score < 25) return 'critical';
  if (score < 45) return 'low';
  if (score < 65) return 'moderate';
  if (score < 85) return 'good';
  return 'excellent';
};

/**
 * Score soil health based on moisture, pH, and NPK balance.
 * Ideal ranges (general row-crop guidance):
 *  - moisture: 40-70%
 *  - pH: 6.0-7.0
 *  - N: 20-40 ppm, P: 15-30 ppm, K: 100-200 ppm
 */
export const scoreSoil = (input: FabricInputSnapshot): { score: number; drivers: string[] } => {
  const drivers: string[] = [];
  let score = 100;

  // Moisture
  if (input.soil_moisture < 30) {
    score -= 25;
    drivers.push(`Low soil moisture (${input.soil_moisture}%) — irrigation recommended`);
  } else if (input.soil_moisture > 80) {
    score -= 15;
    drivers.push(`Excess soil moisture (${input.soil_moisture}%) — risk of root rot`);
  } else if (input.soil_moisture < 40 || input.soil_moisture > 70) {
    score -= 8;
    drivers.push(`Soil moisture slightly outside optimal range (${input.soil_moisture}%)`);
  }

  // pH
  const phDeviation = Math.abs(input.ph - 6.5);
  if (phDeviation > 1.0) {
    score -= 20;
    drivers.push(`Soil pH (${input.ph.toFixed(1)}) is significantly off target (6.0-7.0)`);
  } else if (phDeviation > 0.5) {
    score -= 8;
    drivers.push(`Soil pH (${input.ph.toFixed(1)}) is slightly off target`);
  }

  // NPK
  if (input.n < 15) {
    score -= 10;
    drivers.push(`Nitrogen low (${input.n} ppm) — consider nitrogen fertilizer`);
  }
  if (input.p < 10) {
    score -= 8;
    drivers.push(`Phosphorus low (${input.p} ppm)`);
  }
  if (input.k < 80) {
    score -= 8;
    drivers.push(`Potassium low (${input.k} ppm)`);
  }

  // CO2 (greenhouse / enclosed zones)
  if (input.co2 > 1200) {
    score -= 6;
    drivers.push(`Elevated CO₂ levels (${input.co2} ppm) — check ventilation`);
  }

  return { score: clampScore(score), drivers };
};

/**
 * Score disease risk — input disease_risk is 0-100 (higher = riskier),
 * so the health score is the inverse.
 */
export const scoreDisease = (input: FabricInputSnapshot): { score: number; drivers: string[] } => {
  const drivers: string[] = [];
  const score = clampScore(100 - input.disease_risk);

  if (input.disease_risk >= 60) {
    drivers.push(`High disease risk detected (${input.disease_risk}%) — schedule field inspection`);
  } else if (input.disease_risk >= 30) {
    drivers.push(`Moderate disease risk (${input.disease_risk}%) — monitor closely`);
  }

  return { score, drivers };
};

/** Combine soil and disease scores into a single per-zone score. */
export const scoreZone = (input: FabricInputSnapshot): FabricZoneScore => {
  const soil = scoreSoil(input);
  const disease = scoreDisease(input);

  // Weighted composite: soil health 60%, disease health 40%
  const overall = clampScore(soil.score * 0.6 + disease.score * 0.4);

  return {
    zone: input.zone,
    soilScore: soil.score,
    diseaseScore: disease.score,
    overallScore: overall,
    level: scoreToLevel(overall),
    drivers: [...soil.drivers, ...disease.drivers],
  };
};

/**
 * Score farm finances based on ROI and profit position.
 *  - ROI >= 40%   -> excellent
 *  - ROI 20-40%   -> good
 *  - ROI 5-20%    -> moderate
 *  - ROI 0-5%     -> low
 *  - ROI < 0%     -> critical
 */
export const scoreFinance = (budget: FabricBudgetSnapshot): FabricFinanceScore => {
  const drivers: string[] = [];
  let score: number;

  if (budget.roi_percent >= 40) {
    score = 90 + Math.min(10, (budget.roi_percent - 40) / 4);
    drivers.push(`Excellent ROI of ${budget.roi_percent.toFixed(1)}%`);
  } else if (budget.roi_percent >= 20) {
    score = 70 + ((budget.roi_percent - 20) / 20) * 20;
    drivers.push(`Healthy ROI of ${budget.roi_percent.toFixed(1)}%`);
  } else if (budget.roi_percent >= 5) {
    score = 50 + ((budget.roi_percent - 5) / 15) * 20;
    drivers.push(`Moderate ROI of ${budget.roi_percent.toFixed(1)}% — room to optimize input costs`);
  } else if (budget.roi_percent >= 0) {
    score = 30 + (budget.roi_percent / 5) * 20;
    drivers.push(`Thin margins — ROI only ${budget.roi_percent.toFixed(1)}%`);
  } else {
    score = Math.max(0, 30 + budget.roi_percent); // negative ROI drags score below 30
    drivers.push(`Farm is operating at a loss (ROI ${budget.roi_percent.toFixed(1)}%)`);
  }

  if (budget.net_profit < 0) {
    drivers.push(`Net loss of KSh ${Math.abs(budget.net_profit).toLocaleString()}`);
  }

  return { score: clampScore(score), level: scoreToLevel(clampScore(score)), drivers };
};

/**
 * Score farm security based on open and recent high-severity alerts.
 */
export const scoreSecurity = (security: FabricSecuritySnapshot): FabricSecurityScore => {
  const drivers: string[] = [];
  let score = 100;

  if (security.high_severity_alerts_24h > 0) {
    score -= security.high_severity_alerts_24h * 25;
    drivers.push(
      `${security.high_severity_alerts_24h} high-severity security alert(s) in the last 24 hours`
    );
  }

  if (security.open_alerts > 0) {
    score -= security.open_alerts * 5;
    drivers.push(`${security.open_alerts} open alert(s) require review`);
  }

  if (drivers.length === 0) {
    drivers.push('No active security alerts — perimeter and zones secure');
  }

  return { score: clampScore(score), level: scoreToLevel(clampScore(score)), drivers };
};
