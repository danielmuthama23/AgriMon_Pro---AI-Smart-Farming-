// Minimal store connector stub for FabricIQ.
// Replace with real persistent connector (localStorage, indexedDB, API, etc.)

import type { FabricIQRecord } from '../types';

const STORE_KEY = 'fabriciq:records';

export function saveRecord(record: FabricIQRecord): void {
  try {
    const existing = JSON.parse(localStorage.getItem(STORE_KEY) || '[]') as FabricIQRecord[];
    existing.push(record);
    localStorage.setItem(STORE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('[FabricIQ] failed to save record', err);
  }
}

export function loadRecords(): FabricIQRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]') as FabricIQRecord[];
  } catch (err) {
    console.warn('[FabricIQ] failed to load records', err);
    return [];
  }
}
