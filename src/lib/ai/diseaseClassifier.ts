// ─── Disease classification via Claude Vision ─────────────────────────────────
// In production: pass a base64 drone image captured over the crop canopy.
// In demo mode: returns a synthetic classification.

export interface DiseaseResult {
  disease: string
  confidence: number
  recommendation: string
  zone?: string
}

export async function classifyDroneImage(
  base64Image: string,
  zone: string
): Promise<DiseaseResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey || !base64Image) {
    // Synthetic demo result
    const demos: DiseaseResult[] = [
      { disease: 'Leaf Blight',     confidence: 87, recommendation: 'Apply mancozeb 2g/L. Remove affected leaves. Re-scout in 7 days.' },
      { disease: 'Powdery Mildew',  confidence: 92, recommendation: 'Apply sulphur-based fungicide at 3g/L. Improve air circulation.' },
      { disease: 'None Detected',   confidence: 97, recommendation: 'Crop appears healthy. Continue regular scouting.' },
    ]
    return { ...demos[Math.floor(Math.random() * demos.length)], zone }
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey,
      'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Image } },
          { type: 'text', text: 'Identify any visible crop disease in this drone image. Return JSON: { disease, confidence (0-100), recommendation }' }
        ]
      }]
    }),
  })
  const data = await res.json()
  const text = data.content?.[0]?.text || '{}'
  try {
    return { ...JSON.parse(text.replace(/```json|```/g, '').trim()), zone }
  } catch {
    return { disease: 'Unknown', confidence: 0, recommendation: 'Manual inspection required.', zone }
  }
}
