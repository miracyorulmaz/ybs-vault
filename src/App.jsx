import React, { useState, useMemo } from "react";
import { Search, User, Lock, Mail, Sparkles, ChevronRight, GraduationCap, Layers, FileText, X, UploadCloud } from "lucide-react";

const ZORUNLU = {
  "1-1": {
    label: "1. Sınıf · 1. Yarıyıl",
    dersler: [
      { ad: "Genel Matematik", hocalar: ["Dr.Öğr.Üyesi Mustafa Koç"], notlar: [] },
      { ad: "İktisada Giriş", hocalar: ["Dr.Öğr.Üyesi Gökhan Güven"], notlar: [] },
      { ad: "Bilişim Sistemlerine Giriş", hocalar: ["Prof.Dr. Aykut Hamit Turan", "Doç.Dr. Naciye Güliz Uğur", "Doç.Dr. Salabat Khan"], notlar: [] },
      { ad: "İşletme Bilimine Giriş", hocalar: ["Dr.Öğr.Üyesi Merve Türkmen Barutçu", "Arş. Gör.Dr. Volkan Göktaş"], notlar: [] },
      { ad: "Yazılı ve Sözlü İletişim Becerileri", hocalar: ["Doç.Dr. Naciye Güliz Uğur", "Öğr.Gör.Dr. Faruk Dursun"], notlar: [] },
    ],
  },
  "1-2": {
    label: "1. Sınıf · 2. Yarıyıl",
    dersler: [
      { ad: "Hukuka Giriş", hocalar: ["Doç.Dr. Gökçen Turan"], notlar: [] },
      { ad: "Genel Muhasebe", hocalar: ["Doç.Dr. Zülküf Çevik", "Doç.Dr. Metin Sarıaslan"], notlar: [] },
      { ad: "Algoritma ve Programlamaya Giriş", hocalar: ["Dr.Öğr.Üyesi Alpaslan Kibar", "Doç.Dr. Çağla Ediz"], notlar: [] },
      { ad: "İşletme Matematiği", hocalar: ["Doç.Dr. Tuğba Koç", "Dr.Öğr.Üyesi Mustafa Koç"], notlar: [] },
      { ad: "Yönetim ve Organizasyon", hocalar: ["Öğr.Gör.Dr. Faruk Dursun"], notlar: [] },
    ],
  },
  "2-3": {
    label: "2. Sınıf · 3. Yarıyıl",
    dersler: [
      { ad: "Yöneylem Araştırması", hocalar: ["Prof.Dr. Adem Akbıyık", "Doç.Dr. Tuğba Koç"], notlar: [] },
      { ad: "Yönetim Bilişim Sistemleri", hocalar: ["Doç.Dr. Büşra Alma Çallı", "Öğr.Gör.Dr. Faruk Dursun"], notlar: [] },
      { ad: "Araştırma Yöntemleri", hocalar: ["Prof.Dr. Nihal Sütütemiz", "Prof.Dr. Aykut Hamit Turan"], notlar: [] },
      { ad: "Veri Yapıları", hocalar: ["Dr.Öğr.Üyesi Alpaslan Kibar"], notlar: [] },
    ],
  },
  "2-4": {
    label: "2. Sınıf · 4. Yarıyıl",
    dersler: [
      { ad: "İstatistik ve Uygulamaları", hocalar: ["Dr.Öğr.Üyesi Ömer Faruk Seymen", "Prof.Dr. Nihal Sütütemiz"], notlar: [] },
      { ad: "Pazarlama Yönetimi", hocalar: ["Prof.Dr. Hayrettin Zengin", "Dr.Öğr.Üyesi Kazım Mert"], notlar: [] },
      { ad: "Nesneye Dayalı Modelleme ve Programlama", hocalar: ["Doç.Dr. Emrah Aydemir", "Öğr.Gör.Dr. Faruk Dursun"], notlar: [] },
      { ad: "Gereksinim Yönetimine Giriş", hocalar: ["Prof.Dr. Adem Akbıyık"], notlar: [] },
    ],
  },
  "3-5": {
    label: "3. Sınıf · 5. Yarıyıl",
    dersler: [
      { ad: "Veri Tabanı ve Veri Tabanı Yönetimi", hocalar: ["Doç.Dr. Emrah Aydemir", "Öğr.Gör.Dr. Faruk Dursun"], notlar: [] },
      { ad: "Bilgisayar Donanım ve İşletim Sistemleri", hocalar: ["Öğr.Gör. Sinan İlyas"], notlar: [] },
      { ad: "Üretim Yönetimi", hocalar: ["Doç.Dr. Metin Bayram", "Arş. Gör. Dr. Asuman Üstündağ"], notlar: [] },
      { ad: "Bilişim Hukuku ve Etiği", hocalar: ["Doç.Dr. Gökçen Turan"], notlar: [] },
    ],
  },
  "3-6": {
    label: "3. Sınıf · 6. Yarıyıl",
    dersler: [
      { ad: "Maliyet Muhasebesi", hocalar: ["Dr.Öğr.Üyesi Abdüssamed Koç", "Arş. Gör. Hüseyin Can Ayar"], notlar: [] },
      { ad: "Sistem Analizi ve Tasarımı", hocalar: ["Doç.Dr. Büşra Alma Çallı", "Öğr.Gör.Dr. Faruk Dursun"], notlar: [] },
      { ad: "Kurumsal Kaynak Planlama", hocalar: ["Doç.Dr. Naciye Güliz Uğur"], notlar: [] },
    ],
  },
  "4-7": { label: "4. Sınıf · 7. Yarıyıl", secmeliUyari: true, dersler: [] },
  "4-8": {
    label: "4. Sınıf · 8. Yarıyıl",
    dersler: [
      { ad: "Bitirme Çalışması", hocalar: ["Hoca belirtilmemiş"], notlar: [] },
      { ad: "İşletmede Mesleki Eğitim", hocalar: ["Hoca belirtilmemiş"], notlar: [] },
    ],
  },
};

const SINIFLAR = [
  { sinif: "1. Sınıf", yariyillar: ["1-1", "1-2"] },
  { sinif: "2. Sınıf", yariyillar: ["2-3", "2-4"] },
  { sinif: "3. Sınıf", yariyillar: ["3-5", "3-6"] },
  { sinif: "4. Sınıf", yariyillar: ["4-7", "4-8"] },
];

const SECMELI = [
  { kod: "ISL 495", ad: "Kurumsal Yönetimde Dijital Dönüşüm", notlar: [] },
  { kod: "YBS 441", ad: "Python İle Web Veri Analizleri", notlar: [] },
  { kod: "ISL 481", ad: "Satınalma Yönetimi (Sektör Dersi)", notlar: [] },
  { kod: "YBS 253", ad: "Excel Vba Programlama", notlar: [] },
  { kod: "YBS 213", ad: "Sağlık Bilgi Sistemleri", notlar: [] },
  { kod: "YBS 427", ad: "Sosyal Medya", notlar: [] },
  { kod: "YBS 217", ad: "E-Devlet ve Dijital Dönüşüm (Sektör Dersi)", notlar: [] },
  { kod: "ISL 443", ad: "Finansal Yönetim", notlar: [] },
  { kod: "YBS 425", ad: "İş Analitiği Uygulamaları", notlar: [] },
  { kod: "YBS 431", ad: "Teknoloji ve İnovasyon Yönetimi", notlar: [] },
  { kod: "ISF 423", ad: "İleri Ofis Uygulamaları", notlar: [] },
  { kod: "YBS 421", ad: "Makine Öğrenmesi", notlar: [] },
  { kod: "YBS 435", ad: "Dijital Pazarlama, Dijital Dönüşüm ve Metaverse (Sektör Dersi)", notlar: [] },
  { kod: "YBS 401", ad: "Bilişim Projeleri Yönetimi", notlar: [] },
  { kod: "YBS 411", ad: "Bilişimde Güncel Gelişmeler", notlar: [] },
  { kod: "YBS 413", ad: "Yapay Zeka", notlar: [] },
  { kod: "EBB 403", ad: "Öğretmenlik Uygulaması", notlar: [] },
  { kod: "YBS 212", ad: "Tüketici Hukuku", notlar: [] },
  { kod: "YBS 264", ad: "Grafik ve Animasyon", notlar: [] },
  { kod: "YBS 258", ad: "Endüstri 4.0 ve Değişim Yönetimi", notlar: [] },
  { kod: "YBS 260", ad: "Bilgi Yönetimi", notlar: [] },
  { kod: "YBS 262", ad: "Web Madenciliği", notlar: [] },
  { kod: "IKY 282", ad: "İnsan Kaynakları Yönetimi", notlar: [] },
  { kod: "YBS 254", ad: "Lojistik ve Tedarik Zinciri Yönetimi", notlar: [] },
  { kod: "YBS 256", ad: "Python", notlar: [] },
  { kod: "MTH 302", ad: "C# İle Nesne Yönelimli Programlamanın Temelleri (Sektör Dersi)", notlar: [] },
  { kod: "ISL 374", ad: "Yapay Zeka Destekli Güncel Uygulamalar", notlar: [] },
  { kod: "ISL 376", ad: "Semantik Veritabanları", notlar: [] },
  { kod: "YBS 368", ad: "Bt Denetimi", notlar: [] },
  { kod: "YBS 352", ad: "Elektronik Ticaret Hukuku", notlar: [] },
  { kod: "YBS 370", ad: "Yapay Zeka: Teori ve Uygulamalar", notlar: [] },
  { kod: "YBS 372", ad: "Siber Güvenlik", notlar: [] },
  { kod: "YBS 356", ad: "Görsel Programlama", notlar: [] },
  { kod: "YBS 358", ad: "İnternet Programlama Dilleri", notlar: [] },
  { kod: "YBS 362", ad: "E-Ticaret", notlar: [] },
  { kod: "YBS 350", ad: "İnsan Bilgisayar Etkileşimi", notlar: [] },
  { kod: "YBS 360", ad: "İnsan Kaynakları Bilgi Sistemleri", notlar: [] },
  { kod: "YBS 364", ad: "Nicel Veri Analizi", notlar: [] },
  { kod: "YBS 366", ad: "Mobil Programlama", notlar: [] },
  { kod: "YBS 354", ad: "Veri Madenciliği ve İş Zekası", notlar: [] },
];

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl" />
      <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/40 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-white text-xl font-semibold tracking-tight">YBS Vault</h1>
          <p className="text-zinc-500 text-xs mt-2 text-center leading-relaxed">
            Sadece <span className="font-mono text-zinc-400">@sakarya.edu.tr</span> uzantılı mail adresleriyle giriş yapılabilir.
          </p>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={1.5} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="ogrenci@sakarya.edu.tr"
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500/30 focus:bg-white/[0.05] transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={1.5} />
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="password"
              placeholder="Şifre"
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500/30 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </div>
        <button
          onClick={onLogin}
          className="mt-6 w-full bg-blue-500/90 hover:bg-blue-500 text-white text-sm font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, activeYariyil, setActiveYariyil }) {
  return (
    <aside className="w-64 shrink-0 border-r border-white/5 bg-zinc-950/60 p-5 flex flex-col gap-6 min-h-screen">
      <div className="flex items-center gap-2 px-1 mb-2">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">YBS Vault</span>
      </div>

      <div>
        <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-wider px-2 mb-2">Zorunlu Dersler</p>
        <div className="flex flex-col gap-1">
          {SINIFLAR.map((s) => (
            <div key={s.sinif}>
              <p className="text-zinc-400 text-xs font-medium px-2 pt-2 pb-1">{s.sinif}</p>
              {s.yariyillar.map((yid) => (
                <button
                  key={yid}
                  onClick={() => {
                    setView("dashboard");
                    setActiveYariyil(yid);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    view === "dashboard" && activeYariyil === yid
                      ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  {ZORUNLU[yid].label.split("· ")[1]}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <button
          onClick={() => setView("secmeli")}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            view === "secmeli"
              ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent"
          }`}
        >
          <Sparkles className="w-4 h-4" strokeWidth={1.5} />
          Seçmeli Dersler Havuzu
        </button>
      </div>
    </aside>
  );
}

function TopBar({ query, setQuery }) {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
      <div className="relative w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ders veya hoca ara..."
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-blue-500/30 transition-all"
        />
      </div>
      <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/5 flex items-center justify-center">
        <User className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function ZorunluCard({ ders, onOpen }) {
  return (
    <button
      onClick={() => onOpen(ders)}
      className="group text-left w-full rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
    >
      <h3 className="text-zinc-100 font-medium text-[15px] mb-3 leading-snug">{ders.ad}</h3>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ders.hocalar.map((h) => (
          <span
            key={h}
            className="text-[11px] font-mono text-blue-300/90 bg-blue-500/[0.08] border border-blue-500/10 rounded-full px-2.5 py-1"
          >
            {h}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
        <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
        {ders.notlar.length > 0 ? `${ders.notlar.length} not` : "Henüz not eklenmedi"}
        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
      </div>
    </button>
  );
}

function SecmeliCard({ ders, onOpen }) {
  return (
    <button
      onClick={() => onOpen(ders)}
      className="group text-left w-full rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 flex items-center gap-3"
    >
      <span className="text-[11px] font-mono text-purple-300 bg-purple-500/[0.08] border border-purple-500/10 rounded-lg px-2.5 py-1.5 shrink-0">
        {ders.kod}
      </span>
      <h3 className="text-zinc-200 text-sm leading-snug flex-1">{ders.ad}</h3>
      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0" strokeWidth={1.5} />
    </button>
  );
}

function DersNotPaneli({ ders, onClose }) {
  if (!ders) return null;
  const baslik = ders.ad;
  const altBilgi = ders.kod ? ders.kod : ders.hocalar?.join(" · ");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/5 bg-zinc-950 shadow-2xl shadow-black/50 p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-zinc-100 font-medium text-base leading-snug pr-6">{baslik}</h3>
            <p className="text-zinc-500 text-xs font-mono mt-1">{altBilgi}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-5 border-t border-white/5 pt-5">
          {ders.notlar.length === 0 ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-zinc-600" strokeWidth={1.5} />
              </div>
              <p className="text-zinc-400 text-sm mb-1">Bu derse henüz not eklenmedi.</p>
              <p className="text-zinc-600 text-xs max-w-xs leading-relaxed">
                Ders notu, çıkmış soru veya özet paylaşan ilk kişi sen ol.
              </p>
              <button className="mt-5 flex items-center gap-2 text-xs font-medium text-blue-300 bg-blue-500/[0.08] border border-blue-500/10 hover:bg-blue-500/[0.12] rounded-xl px-4 py-2.5 transition-colors">
                <UploadCloud className="w-3.5 h-3.5" strokeWidth={1.5} />
                Not yükle
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {ders.notlar.map((not, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                >
                  <FileText className="w-4 h-4 text-zinc-500 shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-zinc-200 text-sm truncate">{not.baslik}</p>
                    <p className="text-zinc-600 text-xs">{not.yukleyen} · {not.tarih}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ activeYariyil, query, onOpen }) {
  const data = ZORUNLU[activeYariyil];
  const filtered = useMemo(() => {
    if (!data.dersler) return [];
    return data.dersler.filter(
      (d) =>
        d.ad.toLowerCase().includes(query.toLowerCase()) ||
        d.hocalar.some((h) => h.toLowerCase().includes(query.toLowerCase()))
    );
  }, [data, query]);

  if (data.secmeliUyari) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-8">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
          <Sparkles className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
        </div>
        <p className="text-zinc-300 text-sm text-center max-w-sm leading-relaxed mb-6">
          Bu dönemki tüm dersler seçmelidir, lütfen Seçmeli Dersler Havuzuna gidiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
        <h2 className="text-zinc-200 font-medium text-sm">{data.label}</h2>
        <span className="text-zinc-600 text-xs">· {filtered.length} ders</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <ZorunluCard key={d.ad} ders={d} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function SecmeliHavuzu({ query, onOpen }) {
  const filtered = useMemo(
    () =>
      SECMELI.filter(
        (d) =>
          d.ad.toLowerCase().includes(query.toLowerCase()) ||
          d.kod.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
        <h2 className="text-zinc-200 font-medium text-sm">Seçmeli Dersler Havuzu</h2>
        <span className="text-zinc-600 text-xs">· {filtered.length} ders</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((d) => (
          <SecmeliCard key={d.kod} ders={d} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard");
  const [activeYariyil, setActiveYariyil] = useState("1-1");
  const [query, setQuery] = useState("");
  const [secilenDers, setSecilenDers] = useState(null);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen w-full flex bg-zinc-950">
      <Sidebar view={view} setView={setView} activeYariyil={activeYariyil} setActiveYariyil={setActiveYariyil} />
      <main className="flex-1">
        <TopBar query={query} setQuery={setQuery} />
        {view === "dashboard" ? (
          <Dashboard activeYariyil={activeYariyil} query={query} onOpen={setSecilenDers} />
        ) : (
          <SecmeliHavuzu query={query} onOpen={setSecilenDers} />
        )}
      </main>
      <DersNotPaneli ders={secilenDers} onClose={() => setSecilenDers(null)} />
    </div>
  );
}
