// src/fabric/core/fabricIQ.ts
// Fabric IQ — the composite farm-intelligence engine.
//
// Takes a FabricSnapshot (sensor, weather, budget, livestock, security data)
// and produces a FabricIQResult: per-zone scores, finance/security scores,
// an overall farm score, and prioritized recommendations.

import type { FabricSnapshot, FabricIQResult, FabricZoneScore, FabricRecommendation } from '../types';
import { scoreZone, scoreFinance, scoreSecurity, scoreToLevel, clampScore } from './scoring';
import {
  zoneRecommendations,
  financeRecommendations,
  securityRecommendations,
  livestockRecommendations,
  weatherRecommendations,
  sortRecommendations,
} from './recommendations';

/**
 * Weights used to compute the overall farm score from its components.
 * Sum to 1.0.
 */
export const FARM_SCORE_WEIGHTS = {
  zones: 0.5,
  finance: 0.3,
  security: 0.2,
} as const;

/** Compute the average overall score across all zones. */
const averageZoneScore = (zoneScores: FabricZoneScore[]): number => {
  if (zoneScores.length === 0) return 0;
  const total = zoneScores.reduce((sum, z) => sum + z.overallScore, 0);
  return total / zoneScores.length;
};

/**
 * Run the full Fabric IQ analysis on a farm snapshot.
 */
export const runFabricIQ = (snapshot: FabricSnapshot): FabricIQResult => {
  // Per-zone scoring
  const zoneScores = snapshot.zones.map(scoreZone);

  // Finance and security scoring
  const financeScore = scoreFinance(snapshot.budget);
  const securityScore = scoreSecurity(snapshot.security);

  // Composite farm score
  const zonesAvg = averageZoneScore(zoneScores);
  const farmScore = clampScore(
    zonesAvg * FARM_SCORE_WEIGHTS.zones +
      financeScore.score * FARM_SCORE_WEIGHTS.finance +
      securityScore.score * FARM_SCORE_WEIGHTS.security
  );

  // Recommendations from all subsystems
  let recommendations: FabricRecommendation[] = [];
  for (const zoneScore of zoneScores) {
    recommendations = recommendations.concat(zoneRecommendations(zoneScore, snapshot));
  }
  recommendations = recommendations.concat(
    financeRecommendations(financeScore),
    securityRecommendations(securityScore),
    livestockRecommendations(snapshot),
    weatherRecommendations(snapshot)
  );
  recommendations = sortRecommendations(recommendations);

  return {
    timestamp: snapshot.timestamp,
    farmScore,
    farmLevel: scoreToLevel(farmScore),
    zoneScores,
    financeScore,
    securityScore,
    recommendations,
  };
};

/**
 * Convenience helper: returns only the top N recommendations,
 * useful for compact dashboard widgets.
 */
export const topRecommendations = (
  result: FabricIQResult,
  count = 3
): FabricRecommendation[] => result.recommendations.slice(0, count);

/**
 * Convenience helper: returns zones sorted from worst to best,
 * useful for highlighting zones needing attention first.
 */
export const zonesByPriority = (result: FabricIQResult): FabricZoneScore[] =>
  [...result.zoneScores].sort((a, b) => a.overallScore - b.overallScore);
