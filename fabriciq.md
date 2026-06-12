# Fabric IQ

`src/fabric/` is AgriSmart Pro's composite farm-intelligence layer. It fuses
zone sensor data, weather, budget/finance, livestock, and security alerts
into a single set of normalized scores (0-100) and prioritized
recommendations — independent of the Hedera, MCP, and YOLO layers, but
designed to consume their outputs via the existing Zustand stores.

## Structure

```
src/fabric/
├── types/
│   └── index.d.ts          # FabricSnapshot, FabricIQResult, score & rec types
├── core/
│   ├── scoring.ts           # scoreSoil, scoreDisease, scoreZone, scoreFinance, scoreSecurity
│   ├── recommendations.ts   # rule-based recommendation generators
│   └── fabricIQ.ts          # runFabricIQ() — orchestrates scoring + recs
├── connectors/
│   ├── storeConnector.ts    # buildSnapshotFromStores() — Zustand -> FabricSnapshot
│   └── useFabricIQ.ts        # React hook, polls stores and runs Fabric IQ
└── index.ts                  # barrel export
```

## Quick start

```tsx
import { useFabricIQ, topRecommendations } from '@/fabric';
import { useFarmStore } from '@/store/farmStore';
import { useBudgetStore } from '@/store/budgetStore';

function FabricIQPanel() {
  const result = useFabricIQ(useFarmStore.getState, useBudgetStore.getState);
  if (!result) return null;

  return (
    <div>
      <h2>Farm Score: {result.farmScore} ({result.farmLevel})</h2>
      <ul>
        {topRecommendations(result, 5).map((rec) => (
          <li key={rec.id}>[{rec.priority}] {rec.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Scoring model

| Component        | Weight in farm score | Inputs |
|-------------------|----------------------|--------|
| Zone health (avg) | 50%                  | soil moisture, pH, NPK, CO₂, disease risk |
| Finance           | 30%                  | ROI %, net profit |
| Security          | 20%                  | open alerts, high-severity alerts (24h) |

Each zone score is `soilScore * 0.6 + diseaseScore * 0.4`.

Score levels: `critical` (<25), `low` (<45), `moderate` (<65), `good` (<85), `excellent` (>=85).

## Extending

- **New data sources**: add a connector in `connectors/` that produces a
  `FabricSnapshot` (see `storeConnector.ts` for the pattern).
- **New scoring rules**: add a function in `core/scoring.ts` and wire it
  into `scoreZone`, `scoreFinance`, or `scoreSecurity`.
- **New recommendations**: add a generator in `core/recommendations.ts`
  and call it from `runFabricIQ` in `core/fabricIQ.ts`.
