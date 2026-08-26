# Otel Rapor

Gölköy Yaşam Resort için yorum takip ve günlük rapor paneli.

## GitHub Codespaces'ta çalıştırma

1. Repoda **Code > Codespaces > Create codespace on main** seçin.
2. İlk açılışta bağımlılıklar otomatik kurulur.
3. Uygulama otomatik olarak `npm run dev` ile 3000 portunda açılır.
4. Ports bölümünde 3000 portu görünür. Tarayıcıda açabilirsiniz.

## Yerel bilgisayarda

```bash
npm install
npm run dev
```

Sonra `http://localhost:3000` adresini açın.

## Veri saklama

Uygulama PostgreSQL istemez. Veriler geliştirme ortamında `data/store.json` içinde tutulur.

> Not: Şu an “Günlük Raporu Çalıştır” düğmesi gerçek Google yorumları yerine demo/test yorumları üretir. Gerçek Google yorumlarını çekmek için Google Business Profile API veya uygun bir yorum sağlayıcısı bağlanmalıdır.
