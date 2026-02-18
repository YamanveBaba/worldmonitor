/**
 * PlatformAvrupa – Diaspora haber kategorileri (Telegram’a gönderim için).
 * Grok listesi + ek kelimeler. Öncelik: 3 → 5 → 4 → 1 → 6 → 12 → diğerleri.
 */
export interface DiasporaCategory {
  id: string;
  name: string;
  priority: number; // Düşük = daha öncelikli (mesajda ilk yazılır)
  keywords: string[];
}

export const DIASPORA_CATEGORIES: DiasporaCategory[] = [
  {
    id: 'turkiye-siyaset',
    name: 'Türkiye Siyaseti ve Güncel Olaylar',
    priority: 4,
    keywords: ['Erdoğan', 'İmamoğlu', 'CHP', 'AK Parti', 'seçim Türkiye', 'anayasa', 'muhalefet', 'Hakan Fidan', 'Türkiye seçim'],
  },
  {
    id: 'ab-turkiye',
    name: 'AB-Türkiye İlişkileri',
    priority: 2,
    keywords: ['Vize serbestisi', 'Gümrük Birliği', 'Türkiye AB', 'göç anlaşması', 'mülteci paktı', 'Türkiye-AB zirvesi', 'EU Turkey', 'Schengen'],
  },
  {
    id: 'almanya-turk',
    name: 'Almanya Türk Toplumu',
    priority: 1,
    keywords: ['Almanya Türk', 'Berlin Türk', 'Köln Türk', 'AfD', 'Abschiebung', 'çifte vatandaşlık', 'İslamofobi Almanya', 'Türk dernekleri', 'UİD', 'DİTİB', 'Türken Deutschland', 'Deutsch-Türken'],
  },
  {
    id: 'avrupa-turk',
    name: 'Fransa, Hollanda, Belçika, Avusturya Türk Toplumu',
    priority: 3,
    keywords: ['Fransa Türk', 'Paris Türk', 'Hollanda Türk', 'Amsterdam Türk', 'Belçika Türk', 'Avusturya Türk', 'Wien Türk', 'ırkçılık Fransa', 'İslamofobi Hollanda', 'Vienne Turc'],
  },
  {
    id: 'goc-vatandaslik',
    name: 'Göç, Sınır Dışı ve Vatandaşlık',
    priority: 2,
    keywords: ['sınır dışı', 'Abschiebung Türkiye', 'iltica', 'çifte vatandaşlık Almanya', 'deport', 'geri dönüş Türkiye', 'asylum', 'migration Turkey', 'Vize', 'vatandaşlık'],
  },
  {
    id: 'ayrimcilik',
    name: 'Ayrımcılık, Irkçılık ve İslamofobi',
    priority: 6,
    keywords: ['İslamofobi', 'cami saldırısı', 'Türk düşmanlığı', 'ırkçılık', 'nefret suçu', 'yabancı düşmanlığı', 'PEGIDA', 'AfD', 'Islamophobia', 'hate crime'],
  },
  {
    id: 'ekonomi-gurbetci',
    name: 'Ekonomi ve Gurbetçi Paraları',
    priority: 7,
    keywords: ['gurbetçi parası', 'emekli maaşı Türkiye', 'Türk lirası', 'enflasyon Türkiye', 'Türk girişimci Almanya', 'yatırım Türkiye', 'remittance', 'TL'],
  },
  {
    id: 'emeklilik-saglik',
    name: 'Emeklilik, Sosyal Güvenlik ve Sağlık',
    priority: 8,
    keywords: ['emekli Türkiye', 'SGK Almanya', 'emeklilik anlaşması', 'sağlık sigortası', 'hasta nakli Türkiye', 'pension Turkey', 'social security'],
  },
  {
    id: 'kultur-festival',
    name: 'Kültür, Festival ve Etkinlikler',
    priority: 9,
    keywords: ['Türk festivali', 'iftar Almanya', 'bayram konseri', 'Türk gecesi', 'diaspora kültürü', 'Türk filmi Avrupa', 'Ramazan'],
  },
  {
    id: 'din-camiler',
    name: 'Din ve Camiler',
    priority: 10,
    keywords: ['DİTİB', 'Diyanet', 'cami açılışı', 'ramazan', 'kurban bayramı', 'minare', 'ezan Almanya', 'mosque Germany'],
  },
  {
    id: 'egitim-genclik',
    name: 'Eğitim ve Gençlik',
    priority: 11,
    keywords: ['Türkçe eğitim', 'konsolosluk okulu', 'Türk okulu Almanya', 'üniversite bursu', 'genç Türkler Avrupa', 'Turkish school'],
  },
  {
    id: 'spor',
    name: 'Spor',
    priority: 6,
    keywords: ['Türk futbolcu', 'Bundesliga Türk', 'Galatasaray Avrupa', 'Fenerbahçe Avrupa', 'milli takım', 'Arda Güler', 'Salih Özcan', 'Turkish football'],
  },
  {
    id: 'konsolosluk',
    name: 'Konsolosluk ve Resmi Hizmetler',
    priority: 13,
    keywords: ['konsolosluk', 'pasaport', 'vatandaşlık başvurusu', 'seçim sandığı Avrupa', 'YTB', 'consulate', 'passport Turkey'],
  },
  {
    id: 'basari',
    name: 'Başarı Hikayeleri',
    priority: 14,
    keywords: ['Türk bilim insanı Avrupa', 'Türk iş adamı Almanya', 'başarılı Türk', 'Türk doktor Fransa', 'Türk şef', 'Turkish entrepreneur'],
  },
  {
    id: 'turk-dunyasi',
    name: 'Türk Dünyası ve Dış Politika',
    priority: 15,
    keywords: ['Türk Devletleri Teşkilatı', 'Azerbaycan', 'KKTC', 'Türk dünyası', 'Hakan Fidan', 'Organization of Turkic States'],
  },
];
