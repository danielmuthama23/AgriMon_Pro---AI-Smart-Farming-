// Lightweight hook that exposes FabricIQ functionality in the UI.
// This provides named exports that the index barrel expects.

import { useState, useCallback } from 'react';
import type { Recommendation, Score, FabricIQRecord } from '../types';
import { saveRecord, loadRecords } from './storeConnector';

export function useFabricIQ() {
  const [records, setRecords] = useState<FabricIQRecord[]>(() => loadRecords());

  const addRecord = useCallback((r: FabricIQRecord) => {
    saveRecord(r);
    setRecords(prev => [...prev, r]);
  }, []);

  const getScores = useCallback((): Score[] => {
    // placeholder scoring logic; replace with real computation or call to core/fabricIQ
    return [
      { metric: 'health', value: 75 },
      { metric: 'moisture', value: 42 },
    ];
  }, []);

  const getRecommendations = useCallback((): Recommendation[] => {
    // placeholder recommendations
    return [
      { id: 'rec-1', title: 'Irrigate zone 2', details: 'Moisture below threshold', priority: 'high', score: 0.9 },
    ];
  }, []);

  return { records, addRecord, getScores, getRecommendations };
}
