/**
 * Simple i18n utility for PlatformAvrupa variant
 * Supports Turkish (tr) and English (en)
 */

import { SITE_VARIANT } from '@/config';

export type Language = 'tr' | 'en';

let currentLanguage: Language = SITE_VARIANT === 'platformavrupa' ? 'tr' : 'en';

// Load translations
let translations: Record<string, any> = {};

async function loadTranslations(lang: Language): Promise<void> {
  try {
    if (lang === 'tr') {
      const trModule = await import('@/locales/tr.json');
      translations = trModule.default || trModule;
    } else {
      // English is default, no translation needed
      translations = {};
    }
  } catch (error) {
    console.warn(`[i18n] Failed to load ${lang} translations:`, error);
    translations = {};
  }
}

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  loadTranslations(lang);
  // Trigger language change event
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: string, params?: Record<string, string | number>): string {
  if (currentLanguage === 'en' || SITE_VARIANT !== 'platformavrupa') {
    return key; // Return key as-is for English or non-platformavrupa variants
  }

  // Navigate nested keys (e.g., "panels.map" -> translations.panels.map)
  const keys = key.split('.');
  let value: any = translations;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }

  if (value === undefined || typeof value !== 'string') {
    return key; // Fallback to key if translation not found
  }

  // Replace parameters
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

// Initialize translations on load
if (SITE_VARIANT === 'platformavrupa') {
  loadTranslations('tr');
}
