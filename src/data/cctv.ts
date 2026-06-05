// ─── CCTV feed configuration & alert data ────────────────────────────────────
// SWAP POINT: replace with real RTSP/WebSocket URLs per camera

import type { CCTVFeed } from '../types/vision'

export interface CCTVDataSource {
  getFeeds: () => CCTVFeed[]
}

export const syntheticCCTVSource: CCTVDataSource = {
  getFeeds: (): CCTVFeed[] => [
    { id: 1, name: 'Main Gate',          status: 'active', alert: false, detections: [],           streamUrl: undefined },
    { id: 2, name: 'Crop Field A',       status: 'active', alert: false, detections: ['worker'],   streamUrl: undefined },
    { id: 3, name: 'Eastern Perimeter',  status: 'alert',  alert: true,  detections: ['intruder'], confidence: 94, streamUrl: undefined },
    { id: 4, name: 'Livestock Barn',     status: 'active', alert: false, detections: ['animal'],   streamUrl: undefined },
    { id: 5, name: 'Storage Facility',   status: 'active', alert: false, detections: [],           streamUrl: undefined },
    { id: 6, name: 'Northern Fence',     status: 'offline',alert: false, detections: [],           streamUrl: undefined },
  ],
}

// Real CCTV source example (WebSocket-based RTSP proxy):
//
// export const rtspCCTVSource: CCTVDataSource = {
//   getFeeds: (): CCTVFeed[] => [
//     { id: 1, name: 'Main Gate',         status: 'active', alert: false, detections: [], streamUrl: 'ws://your-proxy/cam1' },
//     { id: 2, name: 'Crop Field A',      status: 'active', alert: false, detections: [], streamUrl: 'ws://your-proxy/cam2' },
//     // ...
//   ]
// }

export const activeCCTVSource: CCTVDataSource =
  import.meta.env.VITE_USE_REAL_CCTV === 'true'
    ? syntheticCCTVSource  // swap: rtspCCTVSource
    : syntheticCCTVSource

export const CCTV_INCIDENT_LOG = [
  { time: '22:14:33', cam: 'Eastern Perimeter', event: 'PERSON DETECTED',  conf: 94, action: 'Alert sent to farm manager', txid: '0.0.487410' },
  { time: '18:02:11', cam: 'Main Gate',          event: 'VEHICLE ENTRY',    conf: 98, action: 'Plate logged, access granted', txid: '0.0.487305' },
  { time: '14:45:07', cam: 'Crop Field A',       event: 'WORKER ACTIVITY',  conf: 91, action: 'Normal – no action',         txid: '0.0.487201' },
  { time: '06:30:45', cam: 'Livestock Barn',     event: 'CATTLE MOVEMENT',  conf: 99, action: 'Normal behaviour logged',    txid: '0.0.487100' },
]
