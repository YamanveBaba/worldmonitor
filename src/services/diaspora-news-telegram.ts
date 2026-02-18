/**
 * PlatformAvrupa: RSS haberlerini diaspora kategorilerine göre eşleştirip
 * eşleşenleri Telegram kanalına gönderir. Cooldown: aynı link 24 saatte bir kez.
 */
import { SITE_VARIANT } from '@/config';
import { DIASPORA_CATEGORIES } from '@/config/diaspora-categories';
import type { NewsItem } from '@/types';
import { sendTelegramNewsItem } from './telegramService';

const COOLDOWN_KEY = 'platformavrupa-telegram-news-links';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 saat

interface SentEntry {
  link: string;
  ts: number;
}

function getSentLinks(): SentEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COOLDOWN_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SentEntry[];
    const now = Date.now();
    const valid = arr.filter((e) => now - e.ts < COOLDOWN_MS);
    if (valid.length !== arr.length) {
      localStorage.setItem(COOLDOWN_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}

function markSent(link: string): void {
  try {
    const entries = getSentLinks();
    entries.push({ link, ts: Date.now() });
    const trimmed = entries.slice(-500);
    localStorage.setItem(COOLDOWN_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

function isSent(link: string): boolean {
  return getSentLinks().some((e) => e.link === link);
}

/**
 * Haber metninde kelime sınırı ile ara (başlık + varsa açıklama).
 */
function textMatchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  for (const kw of keywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lower)) return true;
  }
  return false;
}

/**
 * Bir haber öğesinin hangi kategorilere uyduğunu döner (öncelik sırasına göre).
 */
export function matchNewsToCategories(item: NewsItem): string[] {
  const text = `${item.title} ${(item as unknown as { description?: string }).description || ''}`.trim();
  const matched: { id: string; priority: number }[] = [];
  for (const cat of DIASPORA_CATEGORIES) {
    if (textMatchesKeywords(text, cat.keywords)) {
      matched.push({ id: cat.id, priority: cat.priority });
    }
  }
  matched.sort((a, b) => a.priority - b.priority);
  const names = matched.map((m) => {
    const c = DIASPORA_CATEGORIES.find((x) => x.id === m.id);
    return c ? c.name : m.id;
  });
  return names;
}

/**
 * Haber listesini tara; eşleşen ve daha önce gönderilmemiş olanları Telegram'a gönderir.
 * Sadece platformavrupa variant'ında çalışır.
 */
export async function sendMatchedNewsToTelegram(news: NewsItem[]): Promise<void> {
  if (SITE_VARIANT !== 'platformavrupa') return;

  for (const item of news) {
    const categoryNames = matchNewsToCategories(item);
    if (categoryNames.length === 0) continue;
    if (isSent(item.link)) continue;

    try {
      const ok = await sendTelegramNewsItem(
        item.title,
        item.source,
        item.link,
        categoryNames
      );
      if (ok) {
        markSent(item.link);
        console.log('[Telegram] Haber gönderildi:', item.title.slice(0, 50));
      }
    } catch (err) {
      console.warn('[Telegram] Haber gönderilemedi:', err);
    }
  }
}
