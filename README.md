🧠 AI Notes — Akıllı Not Düzenleme & PDF / TXT Çıktı Uygulaması

Yazdığın notları yapay zeka ile düzenler, sadeleştirir, özetler — kaydeder — indirmeni sağlar.

✔ Öğrenciler için
✔ Ders notu düzenleme
✔ Günlük — proje — özet çıkarma

Flask + SQLite + OpenRouter (LLM) tabanlıdır.

🚀 İçindekiler

⭐ Özellikler

⚙ Kurulum

🔑 API Anahtarı Ayarlama

▶️ Uygulamayı Çalıştırma

✨ Kullanım

📄 PDF / TXT İndirme

🗂 Veritabanı Yapısı

🛠 Sorun Giderme

🔮 Geliştirme Fikirleri

⭐ Özellikler

✔ Kullanıcı kayıt & giriş
✔ Not ekleme
✔ AI ile düzenleme / sadeleştirme / özet
✔ Özet türü seçimi (kısa / normal / detaylı)
✔ Geçmiş notları listeleme
✔ Arama
✔ Tek tek silme
✔ Toplu silme
✔ TXT indir
✔ PDF indir (Türkçe karakter desteği)

⚙ Kurulum
1️⃣ Projeyi klonla veya indir
git clone <repo-link>
cd AI-Notes

2️⃣ Gerekli paketleri yükle
pip install -r requirements.txt


Eğer yoksa:

pip install flask requests reportlab

🔑 API Anahtarı — OpenRouter
1️⃣ OpenRouter’dan anahtar oluştur

👉 https://openrouter.ai

Dashboard → API Keys → Create Key

2️⃣ Bilgisayara tanıt
🔹 Windows (PowerShell)
$env:OPENROUTER_API_KEY="BURAYA_ANAHTARI_YAZ"

🔹 Linux / Mac
export OPENROUTER_API_KEY="BURAYA_ANAHTARI_YAZ"


Kalıcı yapmak için ortam değişkenlerine ekleyebilirsin.

▶️ Uygulamayı Çalıştır
python app.py


Tarayıcıdan aç:

http://127.0.0.1:5000

✨ Kullanım

1️⃣ Giriş yap veya kayıt oluştur
2️⃣ Notunu yaz
3️⃣ Özet türünü seç:

kısa

normal

detaylı

4️⃣ “Düzenle / Özetle” → Yapay zeka yeniden yazar
5️⃣ Kaydedilir & geçmiş listene eklenir

📄 PDF / TXT İndirme

Her özet sayfasında:

⬇ TXT indir
📄 PDF indir

Türkçe karakterler için proje şu fontu kullanır:

static/fonts/dejavu-sans/DejaVuSans.ttf


PDF:

✔ başlıklar
✔ tarih
✔ metin
✔ bozulmayan Türkçe karakterler

ile oluşturulur.

🗂 Veritabanı Yapısı

Dosya:

notes.db


Tablolar:

users
alan	açıklama
id	kullanıcı id
username	kullanıcı adı
password	şifre
summaries
alan	açıklama
id	özet id
user_id	kullanıcı
note	orijinal metin
summary	düzenlenmiş metin
created_at	tarih
🛠 Sorun Giderme (ÖNEMLİ)
❌ “Sunucu hatası: API anahtarı bulunamadı”

→ terminalde anahtar yok

echo $env:OPENROUTER_API_KEY


boşsa tekrar ekle.

❌ PDF’de kare/kutu karakter

Font doğru yerde olmalı:

static/fonts/dejavu-sans/DejaVuSans.ttf


ve app.py içinde kayıtlı olmalı.

❌ 404 / Not Found

Route (URL) ve buton eşleşmiyor olabilir.

Kontrol et:

/download

/download_pdf

❌ Bağlantı koptu / API cevap vermiyor

Muhtemel nedenler:

internet

VPN

rate limit

API geçici hata

Biraz bekle → tekrar dene.

🔮 Geliştirme Fikirleri

🔹 Tema & dark mode
🔹 CSV / JSON dışa aktar
🔹 Etiket sistemi (ders / günlük / proje)
🔹 Kategorilere göre filtreleme
🔹 AI — “öğretmen gibi anlat” modu
🔹 Mobil uyumlu arayüz

👤 Not

Bu proje öğrenme amaçlıdır.
Geliştirmek, değiştirmek, yayınlamak serbest değildir 👍