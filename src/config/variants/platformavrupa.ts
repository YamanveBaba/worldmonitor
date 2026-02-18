// PlatformAvrupa variant - monitor.platformavrupa.com
// Avrupa'da yaşayan Türk diasporası için özelleştirilmiş durum odası
import type { PanelConfig, MapLayers } from '@/types';
import type { VariantConfig } from './base';

// Re-export base config
export * from './base';

// Geopolitical-specific exports (Avrupa odaklı)
export * from '../feeds';
export * from '../geo';
export * from '../irradiators';
export * from '../pipelines';
export * from '../ports';
export * from '../military';
export * from '../airports';
export * from '../entities';

// Panel configuration for Avrupa Durum Odası
export const DEFAULT_PANELS: Record<string, PanelConfig> = {
  map: { name: 'Avrupa Haritası', enabled: true, priority: 1 },
  'live-news': { name: 'Canlı Haberler', enabled: true, priority: 1 },
  intel: { name: 'İstihbarat Akışı', enabled: true, priority: 1 },
  'gdelt-intel': { name: 'Canlı İstihbarat', enabled: true, priority: 1 },
  cii: { name: 'Ülke İstikrarsızlığı', enabled: true, priority: 1 },
  cascade: { name: 'Altyapı Kaskadı', enabled: true, priority: 1 },
  'strategic-risk': { name: 'Stratejik Risk Özeti', enabled: true, priority: 1 },
  politics: { name: 'Dünya Haberleri', enabled: true, priority: 1 },
  middleeast: { name: 'Orta Doğu', enabled: true, priority: 1 },
  africa: { name: 'Afrika', enabled: true, priority: 1 },
  latam: { name: 'Latin Amerika', enabled: true, priority: 1 },
  asia: { name: 'Asya-Pasifik', enabled: true, priority: 1 },
  energy: { name: 'Enerji & Kaynaklar', enabled: true, priority: 1 },
  gov: { name: 'Hükümet', enabled: true, priority: 1 },
  thinktanks: { name: 'Düşünce Kuruluşları', enabled: true, priority: 1 },
  polymarket: { name: 'Tahminler', enabled: true, priority: 1 },
  commodities: { name: 'Emtialar', enabled: true, priority: 1 },
  markets: { name: 'Piyasalar', enabled: true, priority: 1 },
  economic: { name: 'Ekonomik Göstergeler', enabled: true, priority: 1 },
  finance: { name: 'Finansal', enabled: true, priority: 1 },
  tech: { name: 'Teknoloji', enabled: true, priority: 2 },
  crypto: { name: 'Kripto', enabled: true, priority: 2 },
  heatmap: { name: 'Sektör Isı Haritası', enabled: true, priority: 2 },
  ai: { name: 'AI/ML', enabled: true, priority: 2 },
  layoffs: { name: 'İşten Çıkarma Takibi', enabled: false, priority: 2 },
  'macro-signals': { name: 'Piyasa Radarı', enabled: true, priority: 2 },
  'etf-flows': { name: 'BTC ETF Takibi', enabled: true, priority: 2 },
  stablecoins: { name: 'Stablecoinler', enabled: true, priority: 2 },
  monitors: { name: 'Monitorlarım', enabled: true, priority: 2 },
};

// Map layers for Avrupa Durum Odası - Avrupa odaklı default layers
export const DEFAULT_MAP_LAYERS: MapLayers = {
  conflicts: true,
  bases: true,
  cables: true,
  pipelines: true,
  hotspots: true,
  ais: false,
  nuclear: true,
  irradiators: false,
  sanctions: true,
  weather: true,
  economic: true,
  waterways: true,
  outages: true,
  cyberThreats: false,
  datacenters: false,
  protests: true,
  flights: false,
  military: true,
  natural: true,
  spaceports: false,
  minerals: false,
  fires: false,
  ucdpEvents: false,
  displacement: true,
  climate: false,
  // Tech layers (disabled in platformavrupa variant)
  startupHubs: false,
  cloudRegions: false,
  accelerators: false,
  techHQs: false,
  techEvents: false,
  // Finance layers (disabled in platformavrupa variant)
  stockExchanges: false,
  financialCenters: false,
  centralBanks: false,
  commodityHubs: false,
  gulfInvestments: false,
};

// Mobile-specific defaults for Avrupa Durum Odası
export const MOBILE_DEFAULT_MAP_LAYERS: MapLayers = {
  conflicts: true,
  bases: false,
  cables: false,
  pipelines: false,
  hotspots: true,
  ais: false,
  nuclear: false,
  irradiators: false,
  sanctions: true,
  weather: true,
  economic: false,
  waterways: false,
  outages: true,
  cyberThreats: false,
  datacenters: false,
  protests: true,
  flights: false,
  military: false,
  natural: true,
  spaceports: false,
  minerals: false,
  fires: false,
  ucdpEvents: false,
  displacement: true,
  climate: false,
  // Tech layers
  startupHubs: false,
  cloudRegions: false,
  accelerators: false,
  techHQs: false,
  techEvents: false,
  // Finance layers
  stockExchanges: false,
  financialCenters: false,
  centralBanks: false,
  commodityHubs: false,
  gulfInvestments: false,
};
