// src/fabric/connectors/useFabricIQ.ts
// React hook that runs Fabric IQ against live store state on an interval,
// mirroring the pattern used by useLiveSensors.ts (5s refresh).

import { useEffect, useState } from 'react';
import type { FabricIQResult } from '../types';
import { runFabricIQ } from '../core/fabricIQ';
import { buildSnapshotFromStores, type FarmStoreSlice, type BudgetStoreSlice } from './storeConnector';

export interface UseFabricIQOptions {
  /** Refresh interval in milliseconds. Defaults to 5000 (matches useLiveSensors). */
  refreshMs?: number;
}

/**
 * Hook signature: pass getter functions that return the current
 * farmStore and budgetStore slices (e.g. `useFarmStore.getState`,
 * `useBudgetStore.getState`).
 *
 * Example:
 * ```tsx
 * const result = useFabricIQ(useFarmStore.getState, useBudgetStore.getState);
 * if (!result) return <Loading />;
 * return <FarmScoreCard score={result.farmScore} level={result.farmLevel} />;
 * ```
 */
export const useFabricIQ = (
  getFarmState: () => FarmStoreSlice,
  getBudgetState: () => BudgetStoreSlice,
  options: UseFabricIQOptions = {}
): FabricIQResult | null => {
  const { refreshMs = 5000 } = options;
  const [result, setResult] = useState<FabricIQResult | null>(null);

  useEffect(() => {
    const compute = () => {
      const snapshot = buildSnapshotFromStores(getFarmState(), getBudgetState());
      setResult(runFabricIQ(snapshot));
    };

    compute(); // run immediately on mount
    const interval = setInterval(compute, refreshMs);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshMs]);

  return result;
};
