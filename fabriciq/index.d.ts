// src/fabric/types/index.d.ts
// Type definitions for the Fabric IQ intelligence layer.

export type ZoneId = string;

export interface FabricInputSnapshot {
  zone: ZoneId;
  soil_moisture: number; // %
  ph: number;
  n: number; // ppm
  p: number; // ppm
  k: number; // ppm
  co2: number; // ppm
  disease_risk: number; // 0-100
}

export interface FabricWeatherSnapshot {
  temp_c: number;
  humidity: number; // %
  rainfall_mm_7d: number;
  forecast_rain_3d: number; // probability 0-100
}

export interface FabricBudgetSnapshot {
  total_inputs: number;
  total_revenue: number;
  net_profit: number;
  roi_percent: number;
}

export interface FabricLivestockSnapshot {
  species: string;
  head_count: number;
  daily_feed_cost: number;
}

export interface FabricSecuritySnapshot {
  open_alerts: number;
  high_severity_alerts_24h: number;
}

export interface FabricSnapshot {
  timestamp: string; // ISO 8601
  zones: FabricInputSnapshot[];
  weather: FabricWeatherSnapshot;
  budget: FabricBudgetSnapshot;
  livestock: FabricLivestockSnapshot[];
  security: FabricSecuritySnapshot;
}

export type FabricScoreLevel = 'critical' | 'low' | 'moderate' | 'good' | 'excellent';

export interface FabricZoneScore {
  zone: ZoneId;
  soilScore: number; // 0-100
  diseaseScore: number; // 0-100 (higher = healthier)
  overallScore: number; // 0-100
  level: FabricScoreLevel;
  drivers: string[]; // human-readable reasons for the score
}

export interface FabricFinanceScore {
  score: number; // 0-100
  level: FabricScoreLevel;
  drivers: string[];
}

export interface FabricSecurityScore {
  score: number; // 0-100 (higher = safer)
  level: FabricScoreLevel;
  drivers: string[];
}

export interface FabricRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'irrigation' | 'soil' | 'disease' | 'finance' | 'security' | 'livestock' | 'weather';
  zone?: ZoneId;
  message: string;
}

export interface FabricIQResult {
  timestamp: string;
  farmScore: number; // 0-100 composite
  farmLevel: FabricScoreLevel;
  zoneScores: FabricZoneScore[];
  financeScore: FabricFinanceScore;
  securityScore: FabricSecurityScore;
  recommendations: FabricRecommendation[];
}

export interface FabricConnector<TInput, TOutput> {
  id: string;
  name: string;
  isActive: boolean;
  fetch: (input: TInput) => Promise<TOutput> | TOutput;
}
