/**
 * Telegram Service for PlatformAvrupa Monitor
 * Sends automated alerts to Telegram channel for high/critical severity events
 * Implements 30-minute cooldown to prevent duplicate notifications
 */

import { SITE_VARIANT } from '@/config';

// Telegram Bot API configuration
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHANNEL_ID = import.meta.env.VITE_TELEGRAM_CHANNEL_ID || '';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

if (SITE_VARIANT === 'platformavrupa') {
  console.log('[Telegram] config:', TELEGRAM_BOT_TOKEN ? 'token var' : 'token YOK', TELEGRAM_CHANNEL_ID ? 'channel var' : 'channel YOK');
}

// Cooldown configuration (30 minutes)
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes
const COOLDOWN_STORAGE_KEY = 'platformavrupa-telegram-cooldown';

interface CooldownEntry {
  eventId: string;
  timestamp: number;
}

interface TelegramMessage {
  text: string;
  parse_mode?: 'MarkdownV2' | 'HTML';
  reply_markup?: {
    inline_keyboard: Array<Array<{ text: string; url?: string; callback_data?: string }>>;
  };
  disable_web_page_preview?: boolean;
}

/**
 * Check if event is in cooldown period
 */
function isInCooldown(eventId: string): boolean {
  if (SITE_VARIANT !== 'platformavrupa') return false;
  
  try {
    const stored = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!stored) return false;
    
    const cooldowns: CooldownEntry[] = JSON.parse(stored);
    const now = Date.now();
    
    // Clean old entries
    const validCooldowns = cooldowns.filter(entry => now - entry.timestamp < COOLDOWN_MS);
    
    // Check if this event is in cooldown
    const entry = validCooldowns.find(e => e.eventId === eventId);
    if (entry) {
      const remaining = COOLDOWN_MS - (now - entry.timestamp);
      console.log(`[Telegram] Event ${eventId} in cooldown, ${Math.round(remaining / 1000 / 60)} minutes remaining`);
      return true;
    }
    
    // Save cleaned cooldowns
    if (validCooldowns.length !== cooldowns.length) {
      localStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(validCooldowns));
    }
    
    return false;
  } catch (error) {
    console.warn('[Telegram] Cooldown check failed:', error);
    return false;
  }
}

/**
 * Add event to cooldown
 */
function addToCooldown(eventId: string): void {
  if (SITE_VARIANT !== 'platformavrupa') return;
  
  try {
    const stored = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    const cooldowns: CooldownEntry[] = stored ? JSON.parse(stored) : [];
    
    // Remove existing entry for this event
    const filtered = cooldowns.filter(e => e.eventId !== eventId);
    
    // Add new entry
    filtered.push({ eventId, timestamp: Date.now() });
    
    // Keep only last 100 entries
    const trimmed = filtered.slice(-100);
    
    localStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('[Telegram] Failed to add cooldown:', error);
  }
}

/**
 * Escape MarkdownV2 special characters
 */
function escapeMarkdownV2(text: string): string {
  return text
    .replace(/\_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\~/g, '\\~')
    .replace(/\`/g, '\\`')
    .replace(/\>/g, '\\>')
    .replace(/\#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/\-/g, '\\-')
    .replace(/\=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/\!/g, '\\!');
}

/**
 * Generate event ID for cooldown tracking
 */
function generateEventId(
  type: string,
  data: Record<string, any>
): string {
  // Create unique ID based on event type and key data
  const key = `${type}:${JSON.stringify(data)}`;
  // Simple hash
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `${type}-${Math.abs(hash)}`;
}

/**
 * Send message to Telegram channel
 */
async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
  if (SITE_VARIANT !== 'platformavrupa') {
    console.log('[Telegram] Not platformavrupa variant, skipping');
    return false;
  }
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    console.warn('[Telegram] Bot token or channel ID not configured');
    return false;
  }
  
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        ...message,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ description: 'Unknown error' }));
      console.error('[Telegram] Send failed:', error);
      return false;
    }
    
    const result = await response.json();
    if (result.ok) {
      console.log('[Telegram] Message sent successfully');
      return true;
    } else {
      console.error('[Telegram] API error:', result);
      return false;
    }
  } catch (error) {
    console.error('[Telegram] Network error:', error);
    return false;
  }
}

/**
 * Send alert to Telegram channel
 * @param alertType - Type of alert (keyword_spike, convergence_alert, anomaly, etc.)
 * @param severity - Alert severity (high, critical)
 * @param title - Alert title (Turkish)
 * @param description - Alert description (Turkish, max 300 chars)
 * @param data - Additional alert data
 */
export async function sendTelegramAlert(
  alertType: 'keyword_spike' | 'convergence_alert' | 'anomaly' | 'custom_monitor' | 'high_severity',
  severity: 'high' | 'critical',
  title: string,
  description: string,
  data?: {
    location?: { lat: number; lon: number };
    url?: string;
    imageUrl?: string;
    keywords?: string[];
    term?: string;
    countries?: string[];
  }
): Promise<boolean> {
  if (SITE_VARIANT !== 'platformavrupa') return false;

  console.log('[Telegram] alert gönderiliyor', { alertType, severity, title });

  // Only send high or critical severity alerts
  if (severity !== 'high' && severity !== 'critical') {
    return false;
  }

  // Generate event ID for cooldown
  const eventId = generateEventId(alertType, {
    title,
    location: data?.location,
    term: data?.term,
  });
  
  // Check cooldown
  if (isInCooldown(eventId)) {
    return false;
  }
  
  // Truncate description to 300 chars
  const truncatedDesc = description.length > 300 
    ? description.substring(0, 297) + '...' 
    : description;
  
  // Emoji based on severity
  const severityEmoji = severity === 'critical' ? '🔴' : '🟠';
  const severityBadge = severity === 'critical' ? 'KRİTİK' : 'YÜKSEK';
  
  // Build message text
  const messageText = `${severityEmoji} *${severityBadge} UYARI*

*${escapeMarkdownV2(title)}*

${escapeMarkdownV2(truncatedDesc)}`;

  // Build inline keyboard buttons
  const buttons: Array<Array<{ text: string; url?: string }>> = [];
  
  // Button 1: Haritada Gör (if location available)
  if (data?.location) {
    const mapUrl = `https://monitor.platformavrupa.com/?lat=${data.location.lat}&lon=${data.location.lon}&zoom=6&view=eu`;
    buttons.push([{ text: '🗺️ Haritada Gör', url: mapUrl }]);
  }
  
  // Button 2: PlatformAvrupa'ya Git
  buttons.push([{ text: '🌐 PlatformAvrupa\'ya Git', url: 'https://monitor.platformavrupa.com/' }]);
  
  // Button 3: Detaylı Rapor (if URL available)
  if (data?.url) {
    buttons.push([{ text: '📊 Detaylı Rapor', url: data.url }]);
  }
  
  const message: TelegramMessage = {
    text: messageText,
    parse_mode: 'MarkdownV2',
    reply_markup: buttons.length > 0 ? { inline_keyboard: buttons } : undefined,
    disable_web_page_preview: false,
  };
  
  const success = await sendTelegramMessage(message);
  
  if (success) {
    addToCooldown(eventId);
  }
  
  return success;
}

/**
 * Test Telegram connection (bot + send test message to channel)
 */
export async function testTelegramConnection(): Promise<boolean> {
  if (SITE_VARIANT !== 'platformavrupa') return false;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    console.warn('[Telegram] Bot token or channel ID not configured');
    return false;
  }

  try {
    const meRes = await fetch(`${TELEGRAM_API_URL}/getMe`);
    const meResult = await meRes.json();
    if (!meResult.ok) {
      console.error('[Telegram] Bot connection failed:', meResult);
      return false;
    }
    console.log('[Telegram] Bot connection OK:', meResult.result?.username);

    const testText = 'PlatformAvrupa Monitor – Telegram bağlantı testi. Entegrasyon çalışıyor.';
    const sendRes = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        text: testText,
        disable_web_page_preview: true,
      }),
    });
    if (!sendRes.ok) {
      const err = await sendRes.json().catch(() => ({}));
      console.error('[Telegram] Test message send failed:', err);
      return false;
    }
    console.log('[Telegram] Test message sent to channel');
    return true;
  } catch (error) {
    console.error('[Telegram] Connection test failed:', error);
    return false;
  }
}
