# Telegram – Vercel Ortam Değişkenleri Kontrolü

Haberlerin Telegram kanalına düşmemesinin sık nedenlerinden biri, build sırasında bot bilgilerinin boş olmasıdır. Aşağıdaki adımları uygulayın.

## 1. Vercel Dashboard

1. [Vercel](https://vercel.com) → Giriş yapın.
2. **worldmonitor** (veya PlatformAvrupa monitor) projesini seçin.
3. **Settings** → **Environment Variables** bölümüne gidin.

## 2. Tanımlanması Gereken Değişkenler

| Değişken | Örnek değer | Açıklama |
|----------|-------------|----------|
| `VITE_TELEGRAM_BOT_TOKEN` | `8206300669:AAE...` | BotFather’dan aldığınız bot token. |
| `VITE_TELEGRAM_CHANNEL_ID` | `-1003743397306` | Kanal ID (negatif, örn. `-100...`). |
| `VITE_VARIANT` | `platformavrupa` | PlatformAvrupa build için zorunlu. |

- **Environment:** Production (ve gerekirse Preview) için ekleyin.
- Değerlerde başta/sonda **boşluk** olmamalı.
- Token veya Channel ID yanlışsa Telegram’a hiç mesaj gitmez.

## 3. Deploy’u Yenileme

- Değişken **ekledikten** veya **değiştirdikten** sonra mutlaka **Redeploy** yapın.
- **Deployments** sekmesi → son deployment’ın sağındaki **⋯** → **Redeploy**.
- “Use existing Build Cache” işaretini kaldırıp tam build almanız önerilir.

## 4. Doğrulama

- Deploy bittikten sonra [monitor.platformavrupa.com](https://monitor.platformavrupa.com) adresini açın.
- **Monitorlarım** panelinde **“Telegram’ı Test Et”** butonuna tıklayın.
- Telegram kanalında test mesajı görünüyorsa entegrasyon ve env ayarları doğrudur.

Bu dosya yalnızca kontrol listesi içindir; gizli bilgileri (token, gerçek channel ID) buraya yazmayın.
