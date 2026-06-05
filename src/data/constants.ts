// ─── Application-wide constants ──────────────────────────────────────────────

export const ZONES = [
  'Zone A – Maize',
  'Zone B – Tomato',
  'Zone C – Beans',
  'Zone D – Wheat',
  'Zone E – Pasture',
]

export const DISEASES = [
  'Leaf Blight',
  'Powdery Mildew',
  'Root Rot',
  'Rust Fungus',
  'None Detected',
]

export const NUTRIENT_STATUS = [
  'Optimal',
  'Nitrogen Deficient',
  'Phosphorus Low',
  'Potassium Deficient',
  'Iron Deficient',
]

export const SOIL_TYPES = [
  'Clay Loam',
  'Sandy Loam',
  'Silty Clay',
  'Black Cotton Soil',
  'Volcanic Loam',
]

export const BEST_PLANTS: Record<string, string[]> = {
  'Clay Loam':        ['Maize', 'Sugarcane', 'Cotton'],
  'Sandy Loam':       ['Groundnuts', 'Watermelon', 'Sweet Potato'],
  'Silty Clay':       ['Rice', 'Tomato', 'Cabbage'],
  'Black Cotton Soil':['Sorghum', 'Chickpeas', 'Sunflower'],
  'Volcanic Loam':    ['Coffee', 'Tea', 'Avocado'],
}

export const ANIMALS = [
  'Dairy Cows',
  'Beef Cattle',
  'Broiler Chickens',
  'Layer Hens',
  'Pigs',
  'Goats',
  'Sheep',
]

export interface FeedRec {
  feed: string
  daily_kg: number
  cost_ksh: number
}

export const FEED_RECS: Record<string, FeedRec> = {
  'Dairy Cows':       { feed: '60% maize silage + 30% hay + 10% concentrates', daily_kg: 28, cost_ksh: 420 },
  'Beef Cattle':      { feed: '50% pasture + 35% maize stover + 15% mineral supplement', daily_kg: 22, cost_ksh: 280 },
  'Broiler Chickens': { feed: 'Starter mash 0-3wk → Grower pellets 3-6wk → Finisher 6-8wk', daily_kg: 0.14, cost_ksh: 8 },
  'Layer Hens':       { feed: 'Layer mash + 10g oyster shell + clean water ad libitum', daily_kg: 0.12, cost_ksh: 7 },
  'Pigs':             { feed: 'Maize 60% + soybean meal 25% + fish meal 10% + vitamins 5%', daily_kg: 2.4, cost_ksh: 52 },
  'Goats':            { feed: 'Browse + hay + mineral lick + 200g concentrates (lactating)', daily_kg: 1.8, cost_ksh: 35 },
  'Sheep':            { feed: 'Pasture + hay + salt blocks + 150g grain mix', daily_kg: 1.5, cost_ksh: 28 },
}

export const FARM_STRUCTURES = [
  { name: 'Dairy Barn',       status: 'Good',         cameras: 2, capacity: '40 cows',    icon: '🏚️' },
  { name: 'Poultry House',    status: 'Needs Repair',  cameras: 1, capacity: '2,000 birds', icon: '🐔' },
  { name: 'Grain Store',      status: 'Good',         cameras: 1, capacity: '80 tonnes',   icon: '🌾' },
  { name: 'Feed Store',       status: 'Good',         cameras: 0, capacity: '20 tonnes',   icon: '🛖' },
  { name: 'Irrigation Pump',  status: 'Operational',  cameras: 0, capacity: '5,000L/hr',   icon: '💧' },
  { name: 'Perimeter Fence',  status: 'Alert – Gap',  cameras: 3, capacity: '2 km',        icon: '🔒' },
]

export const BEST_PRACTICES = [
  { cat: 'Soil Health',      icon: '🌱', tip: 'Rotate crops every season to restore nitrogen and break pest cycles. Use cover crops during fallow periods.' },
  { cat: 'Water Management', icon: '💧', tip: 'Use drip irrigation to reduce water use by up to 60%. Schedule watering at dawn or dusk to minimise evaporation.' },
  { cat: 'Pest Management',  icon: '🐛', tip: 'IPM: scout weekly, set pheromone traps, release predatory insects before chemical intervention.' },
  { cat: 'Fertiliser Use',   icon: '🧪', tip: 'Soil-test before applying. Split nitrogen applications to reduce leaching losses. Apply at planting + 6 weeks.' },
  { cat: 'Harvest Timing',   icon: '🌾', tip: 'Harvest maize at 25-30% moisture; dry to 13.5% before storage to prevent aflatoxin contamination.' },
  { cat: 'Record Keeping',   icon: '📋', tip: 'Log all inputs, yields, and sales on Hedera for immutable audit trail and certified supply chain premiums.' },
  { cat: 'Climate Adaptation',icon: '🌡️', tip: 'Plant drought-tolerant varieties (WEMA, DK 8031) in areas with less than 600mm annual rainfall.' },
  { cat: 'Post-Harvest',     icon: '🏚️', tip: 'Use metal silos or hermetic bags (GrainPro). Test for moisture and aflatoxin before sale.' },
]

export const PLANTING_CALENDAR = [
  { crop: 'Maize (Long rains)',  months: [2,3,4,5,6,7],   color: '#16a34a' },
  { crop: 'Maize (Short rains)', months: [9,10,11],        color: '#4ade80' },
  { crop: 'Beans',               months: [3,4,5,9,10],     color: '#d97706' },
  { crop: 'Tomatoes',            months: [1,2,3,7,8,9],    color: '#ef4444' },
  { crop: 'Wheat',               months: [5,6,7,8],        color: '#f59e0b' },
]
