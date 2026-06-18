// Minimal public types used by the FabricIQ module.
// Extend these types to match your real data model.

export type FabricIQRecord = {
  id: string;
  zone?: number;
  timestamp?: string;
  data?: Record<string, any>;
};

export type Score = {
  metric: string;
  value: number;
};

export type Recommendation = {
  id: string;
  title: string;
  details?: string;
  priority?: 'low' | 'medium' | 'high';
  score?: number;
};
