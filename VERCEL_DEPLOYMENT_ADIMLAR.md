# Vercel Deployment - Adım Adım Rehber

## 🚀 Hızlı Deployment (5 Dakika)

### 1. Vercel Hesabı Oluştur/Giriş Yap
- https://vercel.com adresine gidin
- GitHub, GitLab veya Email ile giriş yapın (ücretsiz)

### 2. Yeni Proje Oluştur
- Dashboard'da **"Add New Project"** butonuna tıklayın
- **"Import Git Repository"** seçeneğini seçin
  - Eğer GitHub'da repo yoksa: **"Browse"** ile `C:\Users\yaman\Desktop\worldmonitor` klasörünü seçin

### 3. Proje Ayarları
- **Project Name:** `platformavrupa-monitor`
- **Framework Preset:** `Vite` (otomatik algılanabilir)
- **Root Directory:** `.` (boş bırakın veya `./` yazın)
- **Build Command:** `npm run build:platformavrupa`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (varsayılan)

### 4. Environment Variables Ekle
**"Environment Variables"** bölümüne şunları ekleyin:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_VARIANT` | `platformavrupa` | Production, Preview, Development |
| `VITE_TELEGRAM_BOT_TOKEN` | `8206300669:AAE9aWBl13znK3atHcmuRUKEWU416-uUedg` | Production, Preview, Development |
| `VITE_TELEGRAM_CHANNEL_ID` | `-1003743397306` | Production, Preview, Development |

**Not:** Her değişken için **Production**, **Preview** ve **Development** seçeneklerini işaretleyin.

### 5. Deploy Et
- **"Deploy"** butonuna tıklayın
- İlk build 2-5 dakika sürebilir
- Build tamamlandığında URL alacaksınız: `https://platformavrupa-monitor.vercel.app`

### 6. Custom Domain (Opsiyonel)
- Settings → Domains
- `monitor.platformavrupa.com` ekleyin (DNS ayarları gerekir)

## ✅ Kontrol Listesi

- [ ] Vercel hesabı oluşturuldu
- [ ] Proje import edildi
- [ ] Build command: `npm run build:platformavrupa`
- [ ] Output directory: `dist`
- [ ] 3 environment variable eklendi
- [ ] Deploy başarılı
- [ ] Site açılıyor: `https://platformavrupa-monitor.vercel.app`

## 🔔 Telegram Test

Deploy sonrası Telegram kanalında otomatik paylaşımı test etmek için:
1. Siteyi açın: `https://platformavrupa-monitor.vercel.app`
2. "Monitörlerim" panelinde yüksek öncelikli bir monitör oluşturun
3. İlgili haberler geldiğinde Telegram kanalına otomatik gönderilecek

## 📝 Notlar

- Her kod değişikliğinde otomatik yeniden deploy olur (GitHub entegrasyonu ile)
- Environment variables değişikliklerinden sonra manuel redeploy gerekebilir
- İlk build'de tüm bağımlılıklar yüklenecek (2-5 dakika)
- Sonraki build'ler daha hızlı olacak (cache sayesinde)
