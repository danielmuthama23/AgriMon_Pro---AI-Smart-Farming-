// src/fabric/core/recommendations.ts
// Generates prioritized, actionable recommendations from Fabric IQ scores.

import type {
  FabricSnapshot,
  FabricZoneScore,
  FabricFinanceScore,
  FabricSecurityScore,
  FabricRecommendation,
} from '../types';

let idCounter = 0;
const nextId = (): string => `rec-${Date.now()}-${idCounter++}`;

/** Generate irrigation / soil / disease recommendations per zone. */
export const zoneRecommendations = (
  zoneScore: FabricZoneScore,
  snapshot: FabricSnapshot
): FabricRecommendation[] => {
  const recs: FabricRecommendation[] = [];
  const zoneInput = snapshot.zones.find((z) => z.zone === zoneScore.zone);
  if (!zoneInput) return recs;

  if (zoneInput.soil_moisture < 30) {
    recs.push({
      id: nextId(),
      priority: 'high',
      category: 'irrigation',
      zone: zoneScore.zone,
      message: `Zone ${zoneScore.zone}: Soil moisture critically low (${zoneInput.soil_moisture}%). Irrigate within 24 hours.`,
    });
  } else if (zoneInput.soil_moisture > 80 && snapshot.weather.forecast_rain_3d > 50) {
    recs.push({
      id: nextId(),
      priority: 'medium',
      category: 'irrigation',
      zone: zoneScore.zone,
      message: `Zone ${zoneScore.zone}: Soil already saturated and rain forecast (${snapshot.weather.forecast_rain_3d}% chance) — hold off irrigation.`,
    });
  }

  if (zoneInput.disease_risk >= 60) {
    recs.push({
      id: nextId(),
      priority: 'high',
      category: 'disease',
      zone: zoneScore.zone,
      message: `Zone ${zoneScore.zone}: Disease risk at ${zoneInput.disease_risk}% — dispatch field inspection and consider targeted treatment.`,
    });
  }

  if (Math.abs(zoneInput.ph - 6.5) > 1.0) {
    recs.push({
      id: nextId(),
      priority: 'medium',
      category: 'soil',
      zone: zoneScore.zone,
      message: `Zone ${zoneScore.zone}: pH (${zoneInput.ph.toFixed(1)}) is out of range. Apply lime or sulfur to correct toward 6.0-7.0.`,
    });
  }

  if (zoneInput.n < 15) {
    recs.push({
      id: nextId(),
      priority: 'medium',
      category: 'soil',
      zone: zoneScore.zone,
      message: `Zone ${zoneScore.zone}: Nitrogen deficient (${zoneInput.n} ppm). Apply nitrogen-rich fertilizer before next growth stage.`,
    });
  }

  return recs;
};

/** Generate finance-related recommendations. */
export const financeRecommendations = (financeScore: FabricFinanceScore): FabricRecommendation[] => {
  const recs: FabricRecommendation[] = [];

  if (financeScore.level === 'critical' || financeScore.level === 'low') {
    recs.push({
      id: nextId(),
      priority: financeScore.level === 'critical' ? 'high' : 'medium',
      category: 'finance',
      message:
        financeScore.level === 'critical'
          ? 'Farm is operating at a loss. Review highest input cost categories and explore alternative suppliers or bulk purchasing.'
          : 'Profit margins are thin. Compare current input costs against recent market prices to identify savings.',
    });
  }

  return recs;
};

/** Generate security-related recommendations. */
export const securityRecommendations = (securityScore: FabricSecurityScore): FabricRecommendation[] => {
  const recs: FabricRecommendation[] = [];

  if (securityScore.level === 'critical' || securityScore.level === 'low') {
    recs.push({
      id: nextId(),
      priority: 'high',
      category: 'security',
      message: 'Multiple security alerts detected. Review CCTV incident log and verify perimeter fence integrity.',
    });
  }

  return recs;
};

/** Generate livestock recommendations based on feed cost trends. */
export const livestockRecommendations = (snapshot: FabricSnapshot): FabricRecommendation[] => {
  const recs: FabricRecommendation[] = [];
  const totalFeedCost = snapshot.livestock.reduce((sum, l) => sum + l.daily_feed_cost, 0);

  if (snapshot.budget.total_inputs > 0 && totalFeedCost / snapshot.budget.total_inputs > 0.4) {
    recs.push({
      id: nextId(),
      priority: 'low',
      category: 'livestock',
      message: `Feed costs represent over 40% of total input spend (KSh ${totalFeedCost.toLocaleString()}/day). Consider reviewing feed formulations for cost efficiency.`,
    });
  }

  return recs;
};

/** Generate weather-driven recommendations. */
export const weatherRecommendations = (snapshot: FabricSnapshot): FabricRecommendation[] => {
  const recs: FabricRecommendation[] = [];

  if (snapshot.weather.forecast_rain_3d > 70 && snapshot.weather.rainfall_mm_7d > 50) {
    recs.push({
      id: nextId(),
      priority: 'medium',
      category: 'weather',
      message: `Heavy rain expected (${snapshot.weather.forecast_rain_3d}% chance) following ${snapshot.weather.rainfall_mm_7d}mm in the last 7 days. Check drainage and low-lying zones for flood risk.`,
    });
  }

  if (snapshot.weather.forecast_rain_3d < 10 && snapshot.weather.rainfall_mm_7d < 5) {
    recs.push({
      id: nextId(),
      priority: 'medium',
      category: 'weather',
      message: 'Dry spell continuing with no rain forecast. Prioritize irrigation scheduling across all zones.',
    });
  }

  return recs;
};

/** Sort recommendations by priority (high -> medium -> low). */
export const sortRecommendations = (recs: FabricRecommendation[]): FabricRecommendation[] => {
  const order: Record<FabricRecommendation['priority'], number> = { high: 0, medium: 1, low: 2 };
  return [...recs].sort((a, b) => order[a.priority] - order[b.priority]);
};
