import { Panel } from './Panel';
import type { Monitor, NewsItem } from '@/types';
import { MONITOR_COLORS, SITE_VARIANT } from '@/config';
import { generateId, formatTime, getCSSColor } from '@/utils';
import { escapeHtml, sanitizeUrl } from '@/utils/sanitize';
import { testTelegramConnection } from '@/services/telegramService';

export class MonitorPanel extends Panel {
  private monitors: Monitor[] = [];
  private onMonitorsChange?: (monitors: Monitor[]) => void;

  constructor(initialMonitors: Monitor[] = []) {
    super({ id: 'monitors', title: 'My Monitors' });
    this.monitors = initialMonitors;
    this.renderInput();
  }

  private renderInput(): void {
    this.content.innerHTML = '';
    
    // PlatformAvrupa variant: Show preset monitors
    const isPlatformAvrupa = SITE_VARIANT === 'platformavrupa';
    
    if (isPlatformAvrupa && this.monitors.length === 0) {
      const presetsContainer = document.createElement('div');
      presetsContainer.className = 'monitor-presets';
      presetsContainer.style.cssText = 'margin-bottom: 16px; padding: 12px; background: var(--bg-secondary, #1a1a1a); border-radius: 8px;';
      presetsContainer.innerHTML = `
        <div style="font-size: 11px; color: var(--text-dim, #888); margin-bottom: 8px; font-weight: 600;">
          Avrupa Türkleri İçin Önerilen Monitorlar:
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button class="preset-btn" data-preset="turkiye-ab-nato">🇹🇷 Türkiye OR AB OR NATO OR Ukrayna OR Gaz OR Boru</button>
          <button class="preset-btn" data-preset="goc-vize">🚶 Göç OR Mülteci OR Vize</button>
          <button class="preset-btn" data-preset="enerji">⚡ Enerji OR Doğalgaz OR Elektrik</button>
        </div>
      `;
      this.content.appendChild(presetsContainer);
      
      // Preset button handlers
      presetsContainer.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const preset = (e.target as HTMLElement).dataset.preset;
          if (preset === 'turkiye-ab-nato') {
            const input = document.getElementById('monitorKeywords') as HTMLInputElement;
            if (input) input.value = 'Türkiye, AB, NATO, Ukrayna, Gaz, Boru';
          } else if (preset === 'goc-vize') {
            const input = document.getElementById('monitorKeywords') as HTMLInputElement;
            if (input) input.value = 'göç, mülteci, vize';
          } else if (preset === 'enerji') {
            const input = document.getElementById('monitorKeywords') as HTMLInputElement;
            if (input) input.value = 'enerji, doğalgaz, elektrik';
          }
        });
      });
    }
    
    const inputContainer = document.createElement('div');
    inputContainer.className = 'monitor-input-container';
    inputContainer.innerHTML = `
      <input type="text" class="monitor-input" id="monitorKeywords" placeholder="Keywords (comma separated)">
      <button class="monitor-add-btn" id="addMonitorBtn">+ Add Monitor</button>
    `;

    this.content.appendChild(inputContainer);

    if (isPlatformAvrupa) {
      const telegramTestRow = document.createElement('div');
      telegramTestRow.style.cssText = 'margin-top: 8px; margin-bottom: 8px;';
      telegramTestRow.innerHTML = `
        <button type="button" class="monitor-add-btn" id="telegramTestBtn" style="font-size: 11px; padding: 6px 10px;">
          Telegram'ı Test Et
        </button>
        <span id="telegramTestStatus" style="margin-left: 8px; font-size: 11px; color: var(--text-dim, #888);"></span>
      `;
      this.content.appendChild(telegramTestRow);
      const telegramTestBtn = telegramTestRow.querySelector('#telegramTestBtn') as HTMLButtonElement;
      const telegramTestStatus = telegramTestRow.querySelector('#telegramTestStatus') as HTMLElement;
      if (telegramTestBtn) {
        telegramTestBtn.onclick = async (e) => {
          e.preventDefault();
          e.stopPropagation();
          telegramTestStatus.textContent = 'Kontrol ediliyor...';
          telegramTestBtn.disabled = true;
          try {
            const ok = await testTelegramConnection();
            telegramTestStatus.textContent = ok ? 'Bağlantı başarılı.' : 'Bağlantı başarısız.';
            if (!ok) telegramTestStatus.style.color = 'var(--status-critical, #ef4444)';
          } catch (err) {
            telegramTestStatus.textContent = 'Hata: ' + (err instanceof Error ? err.message : 'Bilinmeyen');
            telegramTestStatus.style.color = 'var(--status-critical, #ef4444)';
          }
          telegramTestBtn.disabled = false;
        };
      }
    }

    const monitorsList = document.createElement('div');
    monitorsList.id = 'monitorsList';
    this.content.appendChild(monitorsList);

    const monitorsResults = document.createElement('div');
    monitorsResults.id = 'monitorsResults';
    this.content.appendChild(monitorsResults);

    // Use event delegation for more reliable event handling
    const addBtn = inputContainer.querySelector('#addMonitorBtn') as HTMLButtonElement;
    if (addBtn) {
      addBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.addMonitor();
      };
    }

    const input = inputContainer.querySelector('#monitorKeywords') as HTMLInputElement;
    if (input) {
      input.onkeypress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.addMonitor();
        }
      };
    }

    this.renderMonitorsList();
  }

  private addMonitor(): void {
    const input = document.getElementById('monitorKeywords') as HTMLInputElement;
    const keywords = input.value.trim();

    if (!keywords) return;

    const monitor: Monitor = {
      id: generateId(),
      keywords: keywords.split(',').map((k) => k.trim().toLowerCase()),
      color: MONITOR_COLORS[this.monitors.length % MONITOR_COLORS.length] ?? getCSSColor('--status-live'),
    };

    this.monitors.push(monitor);
    input.value = '';
    this.renderMonitorsList();
    this.onMonitorsChange?.(this.monitors);
  }

  public removeMonitor(id: string): void {
    this.monitors = this.monitors.filter((m) => m.id !== id);
    this.renderMonitorsList();
    this.onMonitorsChange?.(this.monitors);
  }

  private renderMonitorsList(): void {
    const list = document.getElementById('monitorsList');
    if (!list) return;

    list.innerHTML = this.monitors
      .map(
        (m) => `
      <span class="monitor-tag">
        <span class="monitor-tag-color" style="background: ${escapeHtml(m.color)}"></span>
        ${m.keywords.map(k => escapeHtml(k)).join(', ')}
        <span class="monitor-tag-remove" data-id="${escapeHtml(m.id)}">×</span>
      </span>
    `
      )
      .join('');

    list.querySelectorAll('.monitor-tag-remove').forEach((el) => {
      el.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).dataset.id;
        if (id) this.removeMonitor(id);
      });
    });
  }

  public renderResults(news: NewsItem[]): void {
    const results = document.getElementById('monitorsResults');
    if (!results) return;

    if (this.monitors.length === 0) {
      results.innerHTML =
        '<div style="color: var(--text-dim); font-size: 10px; margin-top: 12px;">Add keywords to monitor news</div>';
      return;
    }

    const matchedItems: NewsItem[] = [];

    news.forEach((item) => {
      this.monitors.forEach((monitor) => {
        // Search both title and description for better coverage
        const searchText = `${item.title} ${(item as unknown as {description?: string}).description || ''}`.toLowerCase();
        const matched = monitor.keywords.some((kw) => {
          // Use word boundary matching to avoid false positives like "ai" in "train"
          const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'i');
          return regex.test(searchText);
        });
        if (matched) {
          matchedItems.push({ ...item, monitorColor: monitor.color });
        }
      });
    });

    // Dedupe by link
    const seen = new Set<string>();
    const unique = matchedItems.filter(item => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    });

    if (unique.length === 0) {
      results.innerHTML =
        `<div style="color: var(--text-dim); font-size: 10px; margin-top: 12px;">No matches in ${news.length} articles</div>`;
      return;
    }

    const countText = unique.length > 10
      ? `Showing 10 of ${unique.length} matches`
      : `${unique.length} match${unique.length === 1 ? '' : 'es'}`;

    results.innerHTML = `
      <div style="color: var(--text-dim); font-size: 10px; margin: 12px 0 8px;">${countText}</div>
      ${unique
        .slice(0, 10)
        .map(
          (item) => `
        <div class="item" style="border-left: 2px solid ${escapeHtml(item.monitorColor || '')}; padding-left: 8px; margin-left: -8px;">
          <div class="item-source">${escapeHtml(item.source)}</div>
          <a class="item-title" href="${sanitizeUrl(item.link)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>
          <div class="item-time">${formatTime(item.pubDate)}</div>
        </div>
      `
        )
        .join('')}`;
  }

  public onChanged(callback: (monitors: Monitor[]) => void): void {
    this.onMonitorsChange = callback;
  }

  public getMonitors(): Monitor[] {
    return [...this.monitors];
  }

  public setMonitors(monitors: Monitor[]): void {
    this.monitors = monitors;
    this.renderMonitorsList();
  }
}
