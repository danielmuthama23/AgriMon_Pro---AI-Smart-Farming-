// src/fabric/connectors/storeConnector.ts
// Builds a FabricSnapshot from AgriSmart Pro's existing Zustand stores
// (farmStore, budgetStore) so Fabric IQ can run on live app state without
// needing its own data pipeline.
//
// Adjust the store hook paths below if your store file locations differ.

import type { FabricSnapshot, FabricInputSnapshot, FabricLivestockSnapshot } from '../types';

// These types describe the minimal shape Fabric IQ needs from each store.
// They intentionally use a partial/loose shape so this connector keeps
// working even if the stores gain extra fields.

export interface FarmStoreSlice {
  sensors: Array<{
    zone: string;
    soil_moisture: number;
    ph: number;
    n: number;
    p: number;
    k: number;
    co2: number;
    disease_risk?: number;
  }>;
  weather: {
    temp_c: number;
    humidity: number;
    rainfall_mm_7d: number;
    forecast_rain_3d: number;
  };
  alerts: Array<{ severity: 'low' | 'medium' | 'high'; status: 'open' | 'resolved'; timestamp: string }>;
  livestock?: Array<{ species: string; head_count: number; daily_feed_cost: number }>;
}

export interface BudgetStoreSlice {
  total_inputs: number;
  total_revenue: number;
  net_profit: number;
  roi_percent: number;
}

/** Map a raw sensor reading to a FabricInputSnapshot, defaulting disease_risk to 0. */
const mapSensorToFabricInput = (sensor: FarmStoreSlice['sensors'][number]): FabricInputSnapshot => ({
  zone: sensor.zone,
  soil_moisture: sensor.soil_moisture,
  ph: sensor.ph,
  n: sensor.n,
  p: sensor.p,
  k: sensor.k,
  co2: sensor.co2,
  disease_risk: sensor.disease_risk ?? 0,
});

/** Map livestock store entries to FabricLivestockSnapshot, defaulting to []. */
const mapLivestock = (livestock?: FarmStoreSlice['livestock']): FabricLivestockSnapshot[] =>
  (livestock ?? []).map((l) => ({
    species: l.species,
    head_count: l.head_count,
    daily_feed_cost: l.daily_feed_cost,
  }));

/** Count open alerts and high-severity alerts from the last 24 hours. */
const summarizeAlerts = (
  alerts: FarmStoreSlice['alerts']
): { open_alerts: number; high_severity_alerts_24h: number } => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const open_alerts = alerts.filter((a) => a.status === 'open').length;
  const high_severity_alerts_24h = alerts.filter(
    (a) => a.severity === 'high' && now - new Date(a.timestamp).getTime() <= dayMs
  ).length;

  return { open_alerts, high_severity_alerts_24h };
};

/**
 * Build a FabricSnapshot from the current farmStore and budgetStore state.
 *
 * Usage with Zustand:
 * ```ts
 * import { useFarmStore } from '@/store/farmStore';
 * import { useBudgetStore } from '@/store/budgetStore';
 *
 * const farmState = useFarmStore.getState();
 * const budgetState = useBudgetStore.getState();
 * const snapshot = buildSnapshotFromStores(farmState, budgetState);
 * const result = runFabricIQ(snapshot);
 * ```
 */
export const buildSnapshotFromStores = (
  farm: FarmStoreSlice,
  budget: BudgetStoreSlice
): FabricSnapshot => {
  const { open_alerts, high_severity_alerts_24h } = summarizeAlerts(farm.alerts);

  return {
    timestamp: new Date().toISOString(),
    zones: farm.sensors.map(mapSensorToFabricInput),
    weather: {
      temp_c: farm.weather.temp_c,
      humidity: farm.weather.humidity,
      rainfall_mm_7d: farm.weather.rainfall_mm_7d,
      forecast_rain_3d: farm.weather.forecast_rain_3d,
    },
    budget: {
      total_inputs: budget.total_inputs,
      total_revenue: budget.total_revenue,
      net_profit: budget.net_profit,
      roi_percent: budget.roi_percent,
    },
    livestock: mapLivestock(farm.livestock),
    security: {
      open_alerts,
      high_severity_alerts_24h,
    },
  };
};
