import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  Folder,
  ChevronRight,
  Lock,
  Mail,
  User,
  Bell,
  ArrowRight,
  GraduationCap,
  FileText,
  Users,
  Filter,
  X,
  Download,
  ClipboardList,
  Star,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock veri
// ---------------------------------------------------------------------------

// Yarıyıl → Dönem / Sınıf yardımcıları
// Tek sayılı yarıyıl = Güz, çift sayılı yarıyıl = Bahar
const donemOf = (yariyil) => (yariyil % 2 === 1 ? "Güz" : "Bahar");
const sinifOf = (yariyil) => Math.ceil(yariyil / 2);

// Ders planındaki "Üniversite Ortak Seçmeli / Bölüm Seçmeli / Formasyon Seçmeli"
// slot satırlarının sayısı — yani o yarıyılda öğrencinin almak ZORUNDA olduğu seçmeli ders adedi
const gerekliSecmeliSayisi = {
  1: 0,
  2: 0,
  3: 3, // Üniversite Ortak Seçmeli + Formasyon Seçmeli + Yapay Zeka ve Üretkenlik
  4: 5, // Üniversite Ortak Seçmeli + Isl-Bölüm Seçmeli + Formasyon Seçmeli x2 + Girişimcilik
  5: 4, // Üniversite Ortak Seçmeli + Formasyon Seçmeli x2 + Proje Yönetimi
  6: 4, // Isl-Bölüm Seçmeli x2 + Formasyon Seçmeli x2
  7: 8, // Isl-Bölüm Seçmeli x6 + Formasyon Seçmeli x2
  8: 0,
};

// Zorunlu dersler — her ders gerçek yarıyılıyla birlikte tutuluyor
const zorunluDersler = [
  // 1. Yarıyıl (Güz)
  { kod: "TUR 101", ad: "Türk Dili", akts: 4, yariyil: 1 },
  { kod: "UNI 101", ad: "Üniversite Yaşamına Giriş", akts: 0, yariyil: 1 },
  { kod: "YBS 107", ad: "Genel Matematik", akts: 5, yariyil: 1 },
  { kod: "IKT 101", ad: "İktisada Giriş", akts: 5, yariyil: 1 },
  { kod: "YBS 103", ad: "Bilişim Sistemlerine Giriş", akts: 5, yariyil: 1 },
  { kod: "ISL 101", ad: "İşletme Bilimine Giriş", akts: 6, yariyil: 1 },
  { kod: "YBS 105", ad: "Yazılı ve Sözlü İletişim Becerileri", akts: 5, yariyil: 1 },
  // 2. Yarıyıl (Bahar)
  { kod: "ING 190", ad: "İngilizce", akts: 4, yariyil: 2 },
  { kod: "ISL 122", ad: "Hukuka Giriş", akts: 5, yariyil: 2 },
  { kod: "ISL 102", ad: "Genel Muhasebe", akts: 6, yariyil: 2 },
  { kod: "YBS 102", ad: "Algoritma ve Programlamaya Giriş", akts: 5, yariyil: 2 },
  { kod: "YBS 106", ad: "İşletme Matematiği", akts: 5, yariyil: 2 },
  { kod: "ISL 104", ad: "Yönetim ve Organizasyon", akts: 5, yariyil: 2 },
  // 3. Yarıyıl (Güz)
  { kod: "ATA 201", ad: "Atatürk İlkeleri ve İnkılâp Tarihi", akts: 4, yariyil: 3 },
  { kod: "YBS 205", ad: "Yöneylem Araştırması", akts: 6, yariyil: 3 },
  { kod: "YBS 207", ad: "Yönetim Bilişim Sistemleri", akts: 6, yariyil: 3 },
  { kod: "YBS 251", ad: "Araştırma Yöntemleri", akts: 4, yariyil: 3 },
  { kod: "YBS 201", ad: "Veri Yapıları", akts: 5, yariyil: 3 },
  // 4. Yarıyıl (Bahar)
  { kod: "YBS 202", ad: "İstatistik ve Uygulamaları", akts: 6, yariyil: 4 },
  { kod: "ISL 202", ad: "Pazarlama Yönetimi", akts: 4, yariyil: 4 },
  { kod: "YBS 206", ad: "Nesneye Dayalı Modelleme ve Programlama", akts: 5, yariyil: 4 },
  { kod: "YBS 210", ad: "Gereksinim Yönetimine Giriş", akts: 6, yariyil: 4 },
  // 5. Yarıyıl (Güz)
  { kod: "YBS 301", ad: "Veri Tabanı ve Veri Tabanı Yönetim Sistemleri", akts: 7, yariyil: 5 },
  { kod: "YBS 305", ad: "Bilgisayar Donanım ve İşletim Sistemleri", akts: 6, yariyil: 5 },
  { kod: "ISL 301", ad: "Üretim Yönetimi", akts: 6, yariyil: 5 },
  { kod: "YBS 303", ad: "Bilişim Hukuku ve Etiği", akts: 6, yariyil: 5 },
  // 6. Yarıyıl (Bahar)
  { kod: "ISL 304", ad: "Maliyet Muhasebesi", akts: 6, yariyil: 6 },
  { kod: "YBS 309", ad: "Sistem Analizi ve Tasarımı", akts: 7, yariyil: 6 },
  { kod: "YBS 302", ad: "Kurumsal Kaynak Planlama", akts: 7, yariyil: 6 },
  // 7. Yarıyıl (Güz) — bu dönemde zorunlu ders yok, tamamı seçmeli
  // 8. Yarıyıl (Bahar)
  { kod: "YBS 498", ad: "Bitirme Çalışması", akts: 10, yariyil: 8 },
  { kod: "YBS 402", ad: "İşletmede Mesleki Eğitim", akts: 20, yariyil: 8 },
];

const secmeliKategorileri = ["Tümü", "Yazılım/Teknoloji", "Pazarlama/İşletme", "Hukuk", "Kişisel Gelişim"];

// Seçmeli dersler — yarıyıl bilgisiyle birlikte (Güz/Bahar filtrelemesi için)
const secmeliDersler = [
  // 4. Yarıyıl (Bahar)
  { kod: "YBS 212", ad: "Tüketici Hukuku", akts: 5, kategori: "Hukuk", yariyil: 4 },
  { kod: "YBS 264", ad: "Grafik ve Animasyon", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 4 },
  { kod: "YBS 258", ad: "Endüstri 4.0 ve Değişim Yönetimi", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 4 },
  { kod: "YBS 260", ad: "Bilgi Yönetimi", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 4 },
  { kod: "YBS 262", ad: "Web Madenciliği", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 4 },
  { kod: "IKY 282", ad: "İnsan Kaynakları Yönetimi", akts: 5, kategori: "Pazarlama/İşletme", yariyil: 4 },
  { kod: "YBS 254", ad: "Lojistik ve Tedarik Zinciri Yönetimi", akts: 5, kategori: "Pazarlama/İşletme", yariyil: 4 },
  { kod: "YBS 256", ad: "Python", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 4 },
  // 6. Yarıyıl (Bahar)
  { kod: "MTH 302", ad: "C# İle Nesne Yönelimli Programlamanın Temelleri", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "ISL 374", ad: "Yapay Zeka Destekli Güncel Uygulamalar", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "ISL 376", ad: "Semantik Veritabanları", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 368", ad: "Bt Denetimi", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 352", ad: "Elektronik Ticaret Hukuku", akts: 5, kategori: "Hukuk", yariyil: 6 },
  { kod: "YBS 370", ad: "Yapay Zeka: Teori ve Uygulamalar", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 372", ad: "Siber Güvenlik", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 356", ad: "Görsel Programlama", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 358", ad: "İnternet Programlama Dilleri", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 362", ad: "E-Ticaret", akts: 5, kategori: "Pazarlama/İşletme", yariyil: 6 },
  { kod: "YBS 350", ad: "İnsan Bilgisayar Etkileşimi", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 360", ad: "İnsan Kaynakları Bilgi Sistemleri", akts: 5, kategori: "Pazarlama/İşletme", yariyil: 6 },
  { kod: "YBS 364", ad: "Nicel Veri Analizi", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 366", ad: "Mobil Programlama", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  { kod: "YBS 354", ad: "Veri Madenciliği ve İş Zekası", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 6 },
  // 7. Yarıyıl (Güz)
  { kod: "ISL 495", ad: "Kurumsal Yönetimde Dijital Dönüşüm", akts: 5, kategori: "Pazarlama/İşletme", yariyil: 7 },
  { kod: "YBS 441", ad: "Python İle Web Veri Analizleri", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "ISL 481", ad: "Satınalma Yönetimi", akts: 5, kategori: "Pazarlama/İşletme", yariyil: 7 },
  { kod: "YBS 253", ad: "Excel Vba Programlama", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "YBS 213", ad: "Sağlık Bilgi Sistemleri", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "YBS 427", ad: "Sosyal Medya", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "YBS 217", ad: "E-Devlet ve Dijital Dönüşüm", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "ISL 443", ad: "Finansal Yönetim", akts: 5, kategori: "Pazarlama/İşletme", yariyil: 7 },
  { kod: "YBS 425", ad: "İş Analitiği Uygulamaları", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "YBS 431", ad: "Teknoloji ve İnovasyon Yönetimi", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "ISF 423", ad: "İleri Ofis Uygulamaları", akts: 5, kategori: "Kişisel Gelişim", yariyil: 7 },
  { kod: "YBS 421", ad: "Makine Öğrenmesi", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "YBS 435", ad: "Dijital Pazarlama, Dijital Dönüşüm ve Metaverse", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "YBS 401", ad: "Bilişim Projeleri Yönetimi", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "YBS 411", ad: "Bilişimde Güncel Gelişmeler", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "YBS 413", ad: "Yapay Zeka", akts: 5, kategori: "Yazılım/Teknoloji", yariyil: 7 },
  { kod: "EBB 403", ad: "Öğretmenlik Uygulaması", akts: 10, kategori: "Kişisel Gelişim", yariyil: 7 },
];

const mockNotlar = [
  { id: "n1", ad: "Vize Soruları (2024-2025)", tur: "PDF", boyut: "1.2 MB" },
  { id: "n2", ad: "Final Soruları ve Cevap Anahtarı", tur: "PDF", boyut: "980 KB" },
  { id: "n3", ad: "Haftalık Ders Slaytları", tur: "PPTX", boyut: "4.6 MB" },
  { id: "n4", ad: "Öğrenci Özet Notları", tur: "PDF", boyut: "650 KB" },
];

// ---------------------------------------------------------------------------
// Küçük yardımcı bileşenler
// ---------------------------------------------------------------------------

function GridBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/[0.07] blur-[140px]" />
      <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/[0.06] blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}

function YildizDegerlendirme({ puan, onPuanla }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onPuanla(i);
          }}
          className="p-0.5"
        >
          <Star
            size={13}
            className={i <= puan ? "fill-yellow-400 text-yellow-400" : "text-neutral-700"}
          />
        </button>
      ))}
    </div>
  );
}

function DersDetayModal({ ders, onKapat }) {
  const [favoriler, setFavoriler] = useState({});
  const [puanlar, setPuanlar] = useState({});

  if (!ders) return null;

  const favoriToggle = (id) => {
    setFavoriler((f) => ({ ...f, [id]: !f[id] }));
  };

  const puanla = (id, puan) => {
    setPuanlar((p) => ({ ...p, [id]: puan }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="w-full max-w-lg rounded-t-3xl border border-white/10 bg-neutral-950/95 p-6 shadow-2xl backdrop-blur-xl sm:rounded-3xl"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[11px] tracking-wide text-blue-400">
              {ders.kod}
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-snug text-neutral-50">{ders.ad}</h2>
            <p className="mt-1 text-xs text-neutral-500">
              {ders.akts} AKTS {ders.kategori ? `· ${ders.kategori}` : ""}
            </p>
          </div>
          <button
            onClick={onKapat}
            className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-neutral-500 transition-colors hover:text-neutral-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-600">
          <ClipboardList size={13} />
          Ders Notları ve Çıkmış Sorular
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {mockNotlar.map((n) => (
            <div
              key={n.id}
              className="flex flex-col gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-blue-500/30 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-3">
                <button className="flex flex-1 items-center gap-3 text-left">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30">
                    <FileText size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-200">{n.ad}</p>
                    <p className="font-mono text-[10px] text-neutral-600">
                      {n.tur} · {n.boyut}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => favoriToggle(n.id)}
                    className="shrink-0 rounded-md p-1 transition-colors hover:bg-white/[0.06]"
                  >
                    <Star
                      size={16}
                      className={
                        favoriler[n.id] ? "fill-purple-400 text-purple-400" : "text-neutral-600"
                      }
                    />
                  </button>
                  <Download size={15} className="shrink-0 text-neutral-600" />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                <span className="text-[11px] text-neutral-600">Bu notu değerlendir</span>
                <YildizDegerlendirme puan={puanlar[n.id] || 0} onPuanla={(p) => puanla(n.id, p)} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] text-neutral-600">
          Bu bir prototip görünümdür · gerçek dosyalar backend bağlandığında listelenecek
        </p>
      </div>
    </div>
  );
}

function DersKarti({ ders, onAc }) {
  return (
    <button
      onClick={() => onAc(ders)}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-sm transition-all duration-200 active:scale-[0.98] hover:border-blue-500/40 hover:bg-white/[0.06] hover:shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_8px_24px_-8px_rgba(59,130,246,0.25)]"
    >
      <div className="flex items-start justify-between">
        <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[11px] tracking-wide text-blue-400">
          {ders.kod}
        </span>
        <ChevronRight
          size={16}
          className="mt-1 text-neutral-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-400"
        />
      </div>

      <h3 className="mt-4 text-[15px] font-medium leading-snug text-neutral-100">{ders.ad}</h3>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="rounded-md border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[11px] text-neutral-400">
          {ders.akts} AKTS
        </span>
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <FileText size={12} />
          Notlara git
        </span>
      </div>
    </button>
  );
}

function SecmeliKarti({ ders, onAc }) {
  return (
    <button
      onClick={() => onAc(ders)}
      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-sm transition-all duration-200 active:scale-[0.98] hover:border-purple-500/40 hover:bg-white/[0.06] hover:shadow-[0_0_0_1px_rgba(168,85,247,0.15),0_8px_24px_-8px_rgba(168,85,247,0.25)]"
    >
      <div className="flex items-start justify-between">
        <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[11px] tracking-wide text-purple-400">
          {ders.akts} AKTS
        </span>
        <span className="font-mono text-[10px] text-neutral-600">{ders.kod}</span>
      </div>

      <h3 className="mt-4 text-[15px] font-medium leading-snug text-neutral-100">{ders.ad}</h3>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[11px] text-purple-300">
          {ders.kategori}
        </span>
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <FileText size={12} />
          Notlara git
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Ekran 1: Login
// ---------------------------------------------------------------------------

function LoginScreen({ onGiris }) {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <GridBackdrop />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative w-full max-w-[380px] rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <BookOpen size={20} className="text-blue-400" />
          </div>
          <h1 className="mt-4 text-lg font-semibold tracking-tight text-neutral-50">YBS Vault</h1>
          <p className="mt-1.5 text-center text-[13px] leading-relaxed text-neutral-500">
            Sadece <span className="font-mono text-neutral-400">@sakarya.edu.tr</span> uzantılı mail
            adresleriyle giriş yapılabilir.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">E-posta</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 transition-colors focus-within:border-blue-500/60 focus-within:bg-black/40">
              <Mail size={15} className="text-neutral-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ogrenci@sakarya.edu.tr"
                className="w-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Şifre</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 transition-colors focus-within:border-blue-500/60 focus-within:bg-black/40">
              <Lock size={15} className="text-neutral-600" />
              <input
                type="password"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={onGiris}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] transition-all duration-200 hover:bg-blue-400 hover:shadow-[0_0_28px_-2px_rgba(59,130,246,0.75)] active:scale-[0.99]"
          >
            Giriş Yap
            <ArrowRight size={15} />
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] text-neutral-600">
          Erişim SAÜ YBS öğrencileriyle sınırlıdır · kapalı devre platform
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ortak layout: Navbar + Sidebar
// ---------------------------------------------------------------------------

function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-neutral-950/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <BookOpen size={15} className="text-blue-400" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-neutral-100">YBS Vault</span>
      </div>

      <div className="hidden flex-1 justify-center px-8 md:flex">
        <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 transition-colors focus-within:border-blue-500/50">
          <Search size={15} className="text-neutral-600" />
          <input
            placeholder="Ders, hoca veya soru ara..."
            className="w-full bg-transparent text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none"
          />
          <span className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-neutral-500 transition-colors hover:text-neutral-300">
          <Bell size={17} />
        </button>
        <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-[11px] font-medium text-white">
            MK
          </div>
          <span className="text-xs text-neutral-400">Miraç K.</span>
        </div>
      </div>
    </header>
  );
}

function MobileTabs({ view, grade, setGrade, goDashboard, goPool }) {
  const siniflar = [1, 2, 3, 4];

  return (
    <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-neutral-950/60 px-4 py-3 md:hidden">
      {siniflar.map((s) => {
        const aktif = view === "dashboard" && grade === s;
        return (
          <button
            key={s}
            onClick={() => {
              setGrade(s);
              goDashboard();
            }}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              aktif
                ? "border-blue-500/40 bg-blue-500/15 text-blue-300"
                : "border-white/10 bg-white/[0.03] text-neutral-400"
            }`}
          >
            {s}. Sınıf
          </button>
        );
      })}
      <button
        onClick={goPool}
        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
          view === "pool"
            ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
            : "border-white/10 bg-white/[0.03] text-neutral-400"
        }`}
      >
        <Sparkles size={12} />
        Seçmeli Havuz
      </button>
    </div>
  );
}

function Sidebar({ view, grade, setGrade, goDashboard, goPool }) {
  const siniflar = [1, 2, 3, 4];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-neutral-950/40 px-4 py-6 md:flex">
      <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-neutral-600">
        Zorunlu Dersler
      </p>
      <nav className="mt-3 flex flex-col gap-1">
        {siniflar.map((s) => {
          const aktif = view === "dashboard" && grade === s;
          return (
            <button
              key={s}
              onClick={() => {
                setGrade(s);
                goDashboard();
              }}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                aktif
                  ? "bg-blue-500/10 text-blue-300"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
              }`}
            >
              <Folder size={15} className={aktif ? "text-blue-400" : "text-neutral-600"} />
              {s}. Sınıf
            </button>
          );
        })}
      </nav>

      <div className="my-5 h-px bg-white/[0.07]" />

      <button
        onClick={goPool}
        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all ${
          view === "pool"
            ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
            : "border-white/10 bg-white/[0.02] text-neutral-300 hover:border-purple-500/30 hover:bg-purple-500/[0.06] hover:text-purple-300"
        }`}
      >
        <Sparkles size={15} className="text-purple-400" />
        Seçmeli Dersler Havuzu
      </button>

      <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="flex items-center gap-2 text-neutral-400">
          <Users size={13} />
          <span className="text-[11px]">1.240 aktif öğrenci</span>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Ekran 2: Dashboard
// ---------------------------------------------------------------------------

function DashboardScreen({ grade, goPool, onAc }) {
  const [donem, setDonem] = useState("Güz");

  const yariyil = donem === "Güz" ? grade * 2 - 1 : grade * 2;
  const dersler = zorunluDersler.filter((d) => d.yariyil === yariyil);
  const kota = gerekliSecmeliSayisi[yariyil] ?? 0;

  return (
    <div className="flex-1 px-6 py-8 md:px-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <GraduationCap size={13} />
            Zorunlu Dersler · {yariyil}. Yarıyıl
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-50">
            {grade}. Sınıf Zorunlu Dersleri
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
          {["Güz", "Bahar"].map((d) => (
            <button
              key={d}
              onClick={() => setDonem(d)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                donem === d
                  ? "bg-blue-500 text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/[0.08] to-blue-500/[0.05] p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/20">
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <p className="text-sm leading-relaxed text-neutral-300">
            {kota > 0 ? (
              <>
                Bu yarıyılda almanız gereken{" "}
                <span className="font-medium text-neutral-100">{kota} adet seçmeli ders</span> var.
                Havuza giderek notlarına ulaşabilirsin.
              </>
            ) : (
              <>Bu yarıyılda seçmeli zorunluluğu yok. İstersen yine de havuza göz atabilirsin.</>
            )}
          </p>
        </div>
        <button
          onClick={goPool}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
        >
          Havuza Git
          <ArrowRight size={14} />
        </button>
      </div>

      {dersler.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dersler.map((ders) => (
            <DersKarti key={ders.kod} ders={ders} onAc={onAc} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-14 text-center">
          <GraduationCap size={22} className="text-neutral-700" />
          <p className="mt-3 text-sm text-neutral-500">
            {yariyil}. yarıyılda zorunlu ders bulunmuyor — bu dönem tamamen seçmeli derslerden oluşuyor.
          </p>
          <button
            onClick={goPool}
            className="mt-4 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-neutral-300 transition-colors hover:border-purple-500/30 hover:text-purple-300"
          >
            <Sparkles size={13} className="text-purple-400" />
            Seçmeli Havuzuna Git
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ekran 3: Seçmeli Havuzu
// ---------------------------------------------------------------------------

function PoolScreen({ onAc }) {
  const [kategori, setKategori] = useState("Tümü");
  const [donem, setDonem] = useState("Tümü");

  const donemFiltreli =
    donem === "Tümü" ? secmeliDersler : secmeliDersler.filter((d) => donemOf(d.yariyil) === donem);
  const filtreli =
    kategori === "Tümü" ? donemFiltreli : donemFiltreli.filter((d) => d.kategori === kategori);

  return (
    <div className="flex-1 px-6 py-8 md:px-10">
      <div className="flex items-center gap-2 text-xs text-neutral-600">
        <Sparkles size={13} />
        Yetenek Havuzu
      </div>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-50">
        Seçmeli Dersler Havuzu
      </h1>
      <p className="mt-1.5 text-sm text-neutral-500">
        {secmeliDersler.length} ders · tüm dönemlerden geçmiş notlar tek çatı altında
      </p>

      <div className="mt-6 flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 w-fit">
        {["Tümü", "Güz", "Bahar"].map((d) => (
          <button
            key={d}
            onClick={() => setDonem(d)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              donem === d ? "bg-purple-500 text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="mr-1 flex items-center gap-1.5 text-neutral-600">
          <Filter size={13} />
        </div>
        {secmeliKategorileri.map((k) => (
          <button
            key={k}
            onClick={() => setKategori(k)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              kategori === k
                ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
                : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/20 hover:text-neutral-200"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-neutral-600">{filtreli.length} ders listeleniyor</p>

      {filtreli.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtreli.map((ders) => (
            <SecmeliKarti key={ders.kod} ders={ders} onAc={onAc} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-14 text-center">
          <Filter size={20} className="text-neutral-700" />
          <p className="mt-3 text-sm text-neutral-500">Bu filtrelerde ders bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ana bileşen
// ---------------------------------------------------------------------------

export default function App() {
  const [view, setView] = useState("login"); // login | dashboard | pool
  const [grade, setGrade] = useState(3);
  const [secilenDers, setSecilenDers] = useState(null);

  if (view === "login") {
    return (
      <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 antialiased">
        <LoginScreen onGiris={() => setView("dashboard")} />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-neutral-950 font-sans text-neutral-100 antialiased">
      <GridBackdrop />
      <Sidebar
        view={view}
        grade={grade}
        setGrade={setGrade}
        goDashboard={() => setView("dashboard")}
        goPool={() => setView("pool")}
      />
      <div className="relative flex min-h-screen flex-1 flex-col">
        <Navbar />
        <MobileTabs view={view} grade={grade} setGrade={setGrade} goDashboard={() => setView("dashboard")} goPool={() => setView("pool")} />
        {view === "dashboard" ? (
          <DashboardScreen grade={grade} goPool={() => setView("pool")} onAc={setSecilenDers} />
        ) : (
          <PoolScreen onAc={setSecilenDers} />
        )}
      </div>
      <DersDetayModal ders={secilenDers} onKapat={() => setSecilenDers(null)} />
    </div>
  );
}