// ─── YOLOv8 ONNX Web Worker ──────────────────────────────────────────────────
// This file runs in a Web Worker thread to keep inference off the main thread.
// In production: import onnxruntime-web and run real inference here.
// In demo mode: the simulatedFeed.ts is used instead of this worker.

// Worker message types
export type WorkerRequest = { type: 'infer'; imageData: ImageData; feedId: number }
export type WorkerResponse = { type: 'result'; feedId: number; detections: unknown[]; frameTs: number }
                           | { type: 'error'; feedId: number; message: string }

// Uncomment for real ONNX inference:
//
// import * as ort from 'onnxruntime-web'
// let session: ort.InferenceSession | null = null
//
// async function loadModel() {
//   session = await ort.InferenceSession.create('/yolov8n.onnx', { executionProviders: ['wasm'] })
// }
//
// self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
//   if (!session) await loadModel()
//   const { imageData, feedId } = e.data
//   // preprocess → run → postprocess → NMS
//   const detections = await runInference(session, imageData)
//   self.postMessage({ type: 'result', feedId, detections, frameTs: Date.now() })
// }

self.onmessage = (_e: MessageEvent) => {
  // Demo: worker not used — simulatedFeed.ts handles canvas drawing directly
  self.postMessage({ type: 'result', feedId: 0, detections: [], frameTs: Date.now() })
}
