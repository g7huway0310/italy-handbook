import React, { useEffect, useState, useRef } from 'react';
import { 
  Plane, Train, MapPin, Camera, Sunrise, Copy, Printer, Check, 
  Navigation, Shield, Ban, Globe, CreditCard, Banknote, 
  Bed, Utensils, Clock, Ticket, Info, ShoppingCart, Users, Wallet, DollarSign, Calculator, 
  CheckCircle, ShieldAlert, Umbrella, Store, AlertOctagon, Car, BookOpen, Anchor, Bus,
  AlertTriangle, PhoneCall, FileText, CheckCircle2, ShoppingBag, QrCode,
  Maximize2, Minimize2, ChevronUp, ChevronDown, Hotel, Compass, Eye, Coffee,
  MapPinned, Smartphone, Download, Wine, Tag, MessageCircle, Smile, Volume2, ThumbsUp, Heart
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [copied, setCopied] = useState(false);
  const [isPerPerson, setIsPerPerson] = useState(false); // 完美回歸：單人花費切換狀態
  const [exchangeRate] = useState(35.5);
  const [actionMessage, setActionMessage] = useState(""); 
  const controlBarRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setAppVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--app-vh", `${vh}px`);
    };

    // Lock the viewport height to reduce iOS address bar jumpiness.
    setAppVh();
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", setAppVh);
    window.addEventListener("resize", setAppVh);
    window.addEventListener("orientationchange", setAppVh);

    return () => {
      viewport?.removeEventListener("resize", setAppVh);
      window.removeEventListener("resize", setAppVh);
      window.removeEventListener("orientationchange", setAppVh);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !controlBarRef.current) return;

    const updateControlBarHeight = () => {
      const height = controlBarRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--control-bar-height", `${height}px`);
    };

    updateControlBarHeight();
    let observer;
    if ("ResizeObserver" in window) {
      observer = new ResizeObserver(updateControlBarHeight);
      observer.observe(controlBarRef.current);
    }
    window.addEventListener("resize", updateControlBarHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateControlBarHeight);
    };
  }, []);



  // ==========================================
  // 1. 財務底層資料 (精細拆分城市稅)
  // ==========================================
  const budgetItems = {
    prepaid: [
        { id: 'f1', category: '機票', name: '阿聯酋航空 (3人來回)', twd: 94803, note: 'A380 旗艦機', status: 'paid' },
        { id: 'a1', category: '住宿', name: '米蘭: Hotel Midway (1晚)', twd: 7997, note: '車站旁無痛入住', status: 'paid' },
        { id: 'a2', category: '住宿', name: '威尼斯: Hotel Principe (3晚)', twd: 44128, note: '露台套房免過橋', status: 'paid' },
        { id: 'a3', category: '住宿', name: '佛羅倫斯: Plus Florence (4晚)', twd: 25287, note: '含早餐', status: 'paid' },
        { id: 'a4', category: '住宿', name: '羅馬: Hotel Milani (4晚)', twd: 30627, note: '三人房', status: 'paid' },
        { id: 't1', category: '交通', name: '國鐵 FR 9733 (米➔威)', twd: 3610, note: '€101.70', status: 'paid' },
        { id: 't2', category: '交通', name: '國鐵 FR 9425 (威➔佛)', twd: 3610, note: '€101.70', status: 'paid' },
        { id: 't3', category: '交通', name: 'Italo 8905 (佛➔羅)', twd: 3078, note: '€86.70', status: 'paid' },
        { id: 'm1', category: '門票', name: '米蘭大教堂 Fast Track', twd: 3408, note: '€96.00', status: 'paid' },
        { id: 'm2', category: '門票', name: '梵蒂岡博物館', twd: 2663, note: '€75.00', status: 'paid' },
        { id: 'o1', category: '行程', name: 'Trip.com 天空之城包車', twd: 11151, note: '7人座中文司機', status: 'pending' },
        { id: 'o2', category: '行程', name: 'Klook 比薩＆五漁村', twd: 13638, note: '中文導覽大巴一日遊', status: 'pending' }
    ],
    payLater: [
        { id: 'c1_mi', category: '住宿', name: '城市稅: 米蘭 (1晚)', eur: 15, note: 'Hotel Midway (估 €5/人/晚)' },
        { id: 'c1_ve', category: '住宿', name: '城市稅: 威尼斯 (3晚)', eur: 45, note: 'Hotel Principe (估 €5/人/晚)' },
        { id: 'c1_fl', category: '住宿', name: '城市稅: 佛羅倫斯 (4晚)', eur: 84, note: 'Plus Florence (估 €7/人/晚)' },
        { id: 'c1_ro', category: '住宿', name: '城市稅: 羅馬 (4晚)', eur: 72, note: 'Hotel Milani (估 €6/人/晚)' },
        { id: 'c2', category: '行程', name: '威尼斯貢多拉包船', eur: 90, note: '傍晚包船公定價' },
        { id: 'c3', category: '餐飲', name: '15天日常餐飲與超市', eur: 600, note: '預估額度 (多數可刷卡)' },
        { id: 'c4', category: '交通', name: '羅馬 FreeNow 計程車', eur: 100, note: '強烈建議羅馬全程計程車' },
        { id: 'c5', category: '其他', name: '備用現金與小費', eur: 115, note: '廁所零錢、床頭小費' }
    ]
  };

  const triggerToast = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 5000);
  };

  const handlePrint = () => {
    try {
        window.print();
        triggerToast("列印視窗準備中！若遭瀏覽器阻擋，請直接按下鍵盤 Ctrl+P (或 Cmd+P)。");
    } catch (err) {
        triggerToast("請直接按下鍵盤 Ctrl+P (或 Cmd+P) 進行列印！");
    }
  };

  const handleCopy = () => {
    const textToCopy = "https://g7huway0310.github.io/italy-handbook/";
    const fallbackCopy = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        triggerToast("複製失敗，請手動複製網址：\n" + text);
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(() => {
          setCopied(true); setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  };

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen min-h-[100svh] min-h-[calc(var(--app-vh)*100)] overflow-x-hidden bg-slate-50 px-2 md:px-6 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:pb-6 pt-0 font-sans text-slate-800 print:bg-white print:px-0 print:pb-0 print:pt-0 print:min-h-0">
      
      {/* 完美的跨頁列印核心 CSS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body, html, #root, .min-h-screen { 
            background-color: white !important; 
            height: auto !important; 
            min-height: 0 !important;
            overflow: visible !important;
            display: block !important;
          }
          #printable-content { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important; 
            padding: 0 !important;
            overflow: visible !important;
            display: block !important;
          }
          .print-tab-content { display: block !important; }
          .print-expand { display: block !important; }
          .print-hide-icon { display: none !important; }
          .page-break-before { page-break-before: always !important; break-before: page !important; }
          .print-break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* 全域吐司提示框 */}
      {actionMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 no-print border border-slate-700">
           <Info size={20} className="text-blue-400" />
           <span className="text-sm font-bold whitespace-pre-line">{actionMessage}</span>
        </div>
      )}

      {/* Control Bar (列印時隱藏) */}
      <div ref={controlBarRef} className="sticky top-0 left-0 right-0 z-40 no-print md:static">
        <div className="px-2 md:px-6 pt-[env(safe-area-inset-top)] pb-3">
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-md md:shadow-sm border border-slate-300 md:border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 leading-snug">
                  🇮🇹 義大利 2026 國瑋導遊手冊
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] md:text-[10px] uppercase rounded font-semibold md:font-black border border-emerald-200 tracking-wide md:tracking-wider w-[calc(50%-0.25rem)] sm:w-auto text-center">完美排版列印</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] md:text-[10px] uppercase rounded font-semibold md:font-black border border-blue-200 tracking-wide md:tracking-wider w-[calc(50%-0.25rem)] sm:w-auto text-center">體力調節優化</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[11px] md:text-[10px] uppercase rounded font-semibold md:font-black border border-purple-200 tracking-wide md:tracking-wider w-[calc(50%-0.25rem)] sm:w-auto text-center">長輩防護升級</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button onClick={handleCopy} className="px-3 md:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs md:text-sm font-bold transition flex items-center justify-center gap-2 w-full sm:w-auto">
                  {copied ? <CheckCircle2 size={16} className="text-emerald-600"/> : <Copy size={16}/>}
                  {copied ? "已複製" : "分享連結"}
                </button>
                <button onClick={handlePrint} className="px-4 md:px-5 py-2 bg-[#1E293B] hover:bg-slate-800 text-white rounded-xl text-xs md:text-sm font-bold shadow transition flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Printer size={16} /> 列印成手冊
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 flex items-center gap-2 min-w-0">
              <button
                onClick={scrollToTop}
                className="px-2.5 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 bg-white shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center gap-1"
                aria-label="跳至上方"
              >
                <ChevronUp size={16} />
                <span className="hidden md:inline text-xs font-bold">跳至上方</span>
              </button>
              <div className="relative flex-1 min-w-0">
                <div className="flex border-b border-slate-200 overflow-x-auto pb-2 gap-2">
                  <TabButton id="itinerary" label="🗓️ 每日行程" active={activeTab} set={setActiveTab} color="blue" />
                  <TabButton id="ticketsqr" label="🎫 票券＆QR" active={activeTab} set={setActiveTab} color="indigo" />
                  <TabButton id="budget" label="💰 雙軌財務" active={activeTab} set={setActiveTab} color="emerald" />
                  <TabButton id="emergency" label="🚨 緊急卡片" active={activeTab} set={setActiveTab} color="red" />
                  <TabButton id="taxrefund" label="💶 退稅攻略" active={activeTab} set={setActiveTab} color="yellow" />
                  <TabButton id="packing" label="🧳 行李＆待辦" active={activeTab} set={setActiveTab} color="cyan" />
                  <TabButton id="shopping" label="🛒 必買伴手禮" active={activeTab} set={setActiveTab} color="amber" />
                  <TabButton id="wine" label="🍷 喝紅酒" active={activeTab} set={setActiveTab} color="rose" />
                  <TabButton id="food" label="🍰 必吃小吃" active={activeTab} set={setActiveTab} color="orange" />
                  <TabButton id="language" label="🗣️ 實用空耳" active={activeTab} set={setActiveTab} color="purple" />
                </div>
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white/95 to-transparent md:hidden" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white/95 to-transparent md:hidden" />
              </div>
              <button
                onClick={scrollToTop}
                className="hidden md:flex px-2.5 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 bg-white shadow-sm min-h-[44px] min-w-[44px] items-center justify-center gap-1"
                aria-label="跳至上方"
              >
                <ChevronUp size={16} />
                <span className="hidden md:inline text-xs font-bold">跳至上方</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="printable-content" className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-visible min-h-[800px] print:shadow-none print:border-none print:bg-transparent">
        
        <div className={activeTab === 'itinerary' ? 'block' : 'hidden print-tab-content'}>
            <ItineraryView />
        </div>

        <div className={`page-break-before ${activeTab === 'emergency' ? 'block' : 'hidden print-tab-content'}`}>
          <EmergencyCardView />
        </div>

        <div className={`page-break-before ${activeTab === 'packing' ? 'block' : 'hidden print-tab-content'}`}>
          <PackingTodoView />
        </div>

        <div className={`page-break-before ${activeTab === 'budget' ? 'block' : 'hidden print-tab-content'}`}>
            <BudgetView rate={exchangeRate} items={budgetItems} isPer={isPerPerson} setIsPer={setIsPerPerson} />
        </div>

        <div className={`page-break-before ${activeTab === 'ticketsqr' ? 'block' : 'hidden print-tab-content'}`}>
          <TicketsQrView />
        </div>

        <div className={`page-break-before ${activeTab === 'taxrefund' ? 'block' : 'hidden print-tab-content'}`}>
          <TaxRefundView />
        </div>

        <div className={`page-break-before ${activeTab === 'shopping' ? 'block' : 'hidden print-tab-content'}`}>
            <ShoppingGuideView />
        </div>

        <div className={`page-break-before ${activeTab === 'wine' ? 'block' : 'hidden print-tab-content'}`}>
            <WineGuideView />
        </div>

        <div className={`page-break-before ${activeTab === 'food' ? 'block' : 'hidden print-tab-content'}`}>
            <FoodGuideView />
        </div>

        <div className={`page-break-before ${activeTab === 'language' ? 'block' : 'hidden print-tab-content'}`}>
            <LanguageGuideView />
        </div>

      </div>
    </div>
  );
}

  // ==========================================
  // Tab: 緊急卡片 View
  // ==========================================
  const EmergencyCardView = () => {
    const buildMapUrl = (item) => {
      if (typeof item === "string") {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item)}`;
      }
      if (item?.url) return item.url;
      if (item?.query) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.query)}`;
      }
      return "https://www.google.com/maps";
    };

    const emergencyContacts = [
      { label: "歐盟緊急電話", value: "112", note: "警察 / 救護 / 消防" },
      { label: "駐義大利台北代表處", value: "+39-06-9826-2800", note: "上班時間" },
      { label: "代表處緊急專線", value: "+39-366-8066-434", note: "護照遺失 / 急難" },
    ];

    const essentialInfo = [
      { label: "護照號碼", value: "請填寫護照號碼" },
      { label: "保險公司 / 保單號", value: "請填寫保險資訊" },
      { label: "台灣緊急聯絡人", value: "請填寫姓名與電話" },
      { label: "旅伴聯絡方式", value: "請填寫旅伴手機" },
    ];

    const hotels = [
      {
        id: "milano",
        city: "米蘭",
        name: "Hotel Midway",
        address: "Via Giovanni Battista Sammartini, 15, 20125 Milano MI",
        mapUrl: "https://maps.app.goo.gl/9zUrVo2tfAjxo2YJ6",
      },
      {
        id: "venezia",
        city: "威尼斯",
        name: "Hotel Principe",
        address: "Rio Tera Lista di Spagna, 146, 30121 Venezia VE",
        mapUrl: "https://maps.app.goo.gl/PQDfG27ing4NyJDGA",
      },
      {
        id: "firenze",
        city: "佛羅倫斯",
        name: "Plus Florence Hostel",
        address: "Via Santa Caterina D'Alessandria, 15, 50129 Firenze FI",
        mapUrl: "https://maps.app.goo.gl/GRsmBV3hFY8RPcvD9",
      },
      {
        id: "roma",
        city: "羅馬",
        name: "Hotel Milani | BZAR hotels",
        address: "Via Magenta, 12, 00185 Roma RM",
        mapUrl: "https://maps.app.goo.gl/mKKmKnZvDEn8N7NLA",
      },
    ];

    const [selectedHotelId, setSelectedHotelId] = useState("roma");
    const selectedHotel = hotels.find((hotel) => hotel.id === selectedHotelId) || hotels[0];
    const formatTel = (value) => value.replace(/[^\d+]/g, "");

    return (
      <div className="p-4 md:p-8 space-y-8 bg-red-50 print-break-inside-avoid">
        <div className="flex justify-center md:justify-start">
          <SectionTag label="🚨 緊急" tone="red" />
        </div>
        <div className="text-center pb-2 border-b border-red-200">
          <h1 className="text-2xl md:text-3xl font-black text-red-900 mb-2 leading-tight">🚨 緊急卡片與離線備援</h1>
          <p className="text-red-700 text-xs uppercase tracking-[0.2em] font-black">Emergency Ready</p>
          <SectionHeaderNote />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-t-8 border-red-500 overflow-hidden print-break-inside-avoid">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-black text-red-900 mb-2 flex items-center gap-2">
              <MapPinned className="text-red-500"/> 防走失「帶我回飯店」卡
            </h2>
            <p className="text-red-700 text-sm md:text-base font-bold mb-6 leading-[1.6] tracking-wide md:tracking-normal">
              迷路或與家人走散時，點選所在城市，直接把手機畫面給計程車司機或警察看。
            </p>

            <div className="flex flex-wrap gap-2 mb-6 no-print">
              {hotels.map((hotel) => (
                <button
                  key={hotel.id}
                  onClick={() => setSelectedHotelId(hotel.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                    selectedHotelId === hotel.id
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {hotel.city}
                </button>
              ))}
            </div>

            <div className="bg-yellow-50 border-4 border-yellow-400 p-6 md:p-10 rounded-2xl text-center shadow-inner">
              <div className="text-sm md:text-base font-black text-slate-500 mb-4 uppercase tracking-widest">Show this to a taxi driver / Mostra questo al tassista</div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
                Per favore, portami a questo hotel:
                <span className="block text-lg font-bold text-slate-600 mt-2">(請帶我回這個飯店：)</span>
              </h3>
              <div className="bg-white py-6 px-4 rounded-xl border border-yellow-200 shadow-sm inline-block w-full">
                <div className="text-lg md:text-2xl font-black text-red-600">{selectedHotel.name}</div>
                <div className="h-px bg-slate-200 my-3 md:hidden" />
                <div className="text-base md:text-xl font-bold text-slate-800 leading-snug">{selectedHotel.address}</div>
                <div className="mt-4 flex justify-center">
                  <a
                    href={buildMapUrl({ url: selectedHotel.mapUrl, query: selectedHotel.address })}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-black border border-emerald-200"
                  >
                    開啟地圖
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 shadow-lg print-break-inside-avoid">
          <div className="flex items-center gap-2 text-sm font-black text-blue-200">
            <Download size={16} /> 離線模式與加入主畫面
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-bold">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-emerald-300 mb-2">
                <Smartphone size={14} /> Android / Chrome
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-200">
                <li>開啟右上角選單</li>
                <li>點選「安裝應用程式」</li>
                <li>加入主畫面後可離線瀏覽</li>
              </ol>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-amber-300 mb-2">
                <Smartphone size={14} /> iPhone / Safari
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-200">
                <li>點分享按鈕</li>
                <li>選「加入主畫面」</li>
                <li>首次開啟後即可離線</li>
              </ol>
            </div>
          </div>
          <div className="text-[11px] text-slate-300 mt-3">
            提醒：第一次開啟要有網路，之後可離線查看行程、QR 與緊急資訊。
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.label}
              href={`tel:${formatTel(contact.value)}`}
              title="長按可複製號碼"
              aria-label={`${contact.label} ${contact.value} 長按可複製號碼`}
              className="bg-white border border-red-100 p-4 rounded-xl shadow-sm hover:border-red-200 hover:shadow-md transition flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{contact.label}</div>
                <span className="text-[10px] font-black text-red-400">一鍵撥號</span>
              </div>
              <div className="text-xl font-black text-red-600 flex items-center gap-2">
                <PhoneCall size={16} className="text-red-500" /> {contact.value}
              </div>
              <div className="text-xs font-bold text-slate-500">{contact.note}</div>
            </a>
          ))}
        </div>
        <div className="text-[11px] font-semibold text-slate-500 text-center">長按可複製號碼</div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print-break-inside-avoid">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <ShieldAlert className="text-red-500" /> 護照 / 保險 / 聯絡資料
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {essentialInfo.map((info) => (
              <div key={info.label} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.label}</div>
                <div className="text-sm font-black text-slate-800 mt-2">{info.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print-break-inside-avoid">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="text-emerald-500" /> 飯店地址
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hotel.city}</div>
                    <div className="text-base font-black text-slate-800 mt-1">{hotel.name}</div>
                  </div>
                  <a
                    href={buildMapUrl({ url: hotel.mapUrl, query: hotel.address })}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200"
                  >
                    地圖
                  </a>
                </div>
                <div className="text-xs font-bold text-slate-600 leading-relaxed">{hotel.address}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  // ==========================================
  // Tab: 行李與藥品清單 View
  // ==========================================
  const PackingChecklistView = () => {
    const storageKey = "italy-handbook-packing-v1";
    const packingItems = {
      preTrip: [
        { id: "passport", label: "護照 / 影本" },
        { id: "insurance", label: "保險資料 / 緊急聯絡" },
        { id: "cards", label: "信用卡 / 現金 / 交通卡" },
        { id: "adapter", label: "歐規轉接頭 / 充電線" },
        { id: "charger", label: "充電頭備用 / 多孔延長線" },
        { id: "sim_pin", label: "備用 SIM 退卡針" },
        { id: "fold_bag", label: "折疊購物袋" },
        { id: "zip_bag", label: "夾鏈袋" },
        { id: "eye_mask", label: "眼罩 / 耳塞" },
        { id: "scarf", label: "薄圍巾 / 披肩" },
        { id: "waterproof_pouch", label: "防水手機袋" },
        { id: "scissors", label: "小剪刀 / 指甲剪 (託運)" },
        { id: "wipes", label: "生理食鹽水 / 濕紙巾" },
        { id: "pain_meds", label: "止痛退燒 / 暈車藥" },
        { id: "lock", label: "鋼絲鎖 / 行李吊牌" },
        { id: "meds", label: "常備藥 / 處方箋" },
        { id: "clothes", label: "換洗衣物 / 雨具" },
        { id: "copies", label: "重要文件雲端備份" },
      ],
      daily: [
        { id: "water", label: "水壺 / 補水" },
        { id: "coins", label: "零錢 (廁所/小費)" },
        { id: "tickets", label: "門票 / 車票 / QR" },
        { id: "power", label: "行動電源 / 手機電量" },
        { id: "meds_daily", label: "每日藥品 / OK 繃" },
        { id: "sunscreen", label: "防曬 / 帽子" },
      ],
    };

    const buildInitialState = () => ({
      preTrip: packingItems.preTrip.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
      daily: packingItems.daily.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
    });

    const [packingState, setPackingState] = useState(() => {
      if (typeof window === "undefined") return buildInitialState();
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved) return saved;
      } catch (err) {
        return buildInitialState();
      }
      return buildInitialState();
    });

    useEffect(() => {
      if (typeof window === "undefined") return;
      localStorage.setItem(storageKey, JSON.stringify(packingState));
    }, [packingState]);

    const togglePackingItem = (section, id) => {
      setPackingState((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [id]: !prev[section]?.[id],
        },
      }));
    };

    const renderChecklist = (items, section) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((item) => {
          const checked = !!packingState?.[section]?.[item.id];
          return (
            <label
              key={item.id}
              className={`flex items-center gap-2 text-sm font-bold rounded-lg border px-3 py-2 transition ${
                checked
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 line-through"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => togglePackingItem(section, item.id)}
                className="accent-emerald-600"
              />
              {item.label}
            </label>
          );
        })}
      </div>
    );

    return (
      <div className="p-4 md:p-8 space-y-8 bg-cyan-50 print-break-inside-avoid">
        <div className="flex justify-center md:justify-start">
          <SectionTag label="🧳 行李" tone="cyan" />
        </div>
        <div className="text-center pb-2 border-b border-cyan-200">
          <h1 className="text-2xl md:text-3xl font-black text-cyan-900 mb-2 leading-tight">🧳 行李與藥品清單</h1>
          <p className="text-cyan-700 text-xs uppercase tracking-[0.2em] font-black">Packing & Daily Refill</p>
          <SectionHeaderNote />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-cyan-200 shadow-sm print-break-inside-avoid">
          <h3 className="text-lg font-black text-cyan-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="text-cyan-600" /> 出發前必備
          </h3>
          {renderChecklist(packingItems.preTrip, "preTrip")}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm print-break-inside-avoid">
          <h3 className="text-lg font-black text-emerald-900 mb-4 flex items-center gap-2">
            <Umbrella className="text-emerald-600" /> 每日補充提醒
          </h3>
          {renderChecklist(packingItems.daily, "daily")}
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl text-xs font-bold flex items-center gap-3 print-break-inside-avoid leading-[1.6] tracking-wide md:tracking-normal">
          <Info size={16} className="text-blue-300" />
          勾選狀態會自動保存在本機瀏覽器，離線時也能使用。
        </div>
      </div>
    );
  };

// ==========================================
// Tab: Budget View
// ==========================================
const BudgetView = ({ rate, items, isPer, setIsPer }) => {
    const totalPaidTwd = items.prepaid.filter(i => i.status === 'paid').reduce((sum, item) => sum + item.twd, 0);
    const totalPendingTwd = items.prepaid.filter(i => i.status === 'pending').reduce((sum, item) => sum + item.twd, 0);
    const totalPrepaidTwd = totalPaidTwd + totalPendingTwd; 
    const totalPayLaterEur = items.payLater.reduce((sum, item) => sum + item.eur, 0);
    const totalPayLaterTwd = Math.round(totalPayLaterEur * rate);
    const grandTotalTwd = totalPrepaidTwd + totalPayLaterTwd;

    const divisor = isPer ? 3 : 1;
    
    const dispPaid = Math.round(totalPaidTwd / divisor);
    const dispPending = Math.round(totalPendingTwd / divisor);
    const dispGrandTotal = Math.round(grandTotalTwd / divisor);
    const dispPayLaterEur = Math.round(totalPayLaterEur / divisor);
    const dispPayLaterTwd = Math.round(totalPayLaterTwd / divisor);

    const recommendedCashPerPersonEur = 350;
    const recommendedCashFamilyEur = recommendedCashPerPersonEur * 3;
    const recommendedCashDisplayEur = isPer ? recommendedCashPerPersonEur : recommendedCashFamilyEur;
    const recommendedCashDisplayTwd = Math.round(recommendedCashDisplayEur * rate);

    const mustCashEur = items.payLater
      .filter((item) => item.id.startsWith('c1_') || item.id === 'c2' || item.id === 'c5')
      .reduce((sum, item) => sum + item.eur, 0);
    const cardFriendlyEur = totalPayLaterEur - mustCashEur;
    const dispMustCashEur = Math.round(mustCashEur / divisor);
    const dispCardFriendlyEur = Math.round(cardFriendlyEur / divisor);

    const denominationPlan = isPer
      ? [
          { value: 50, count: 3 },
          { value: 20, count: 5 },
          { value: 10, count: 8 },
          { value: 5, count: 4 },
        ]
      : [
          { value: 50, count: 10 },
          { value: 20, count: 15 },
          { value: 10, count: 20 },
          { value: 5, count: 10 },
        ];

    const denominationTotalEur = denominationPlan.reduce((sum, note) => sum + (note.value * note.count), 0);
    const denominationDiffEur = denominationTotalEur - recommendedCashDisplayEur;
    const denominationTotalTwd = Math.round(denominationTotalEur * rate);

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50 print-break-inside-avoid">
          <div className="flex justify-center md:justify-start">
            <SectionTag label="💰 財務" tone="emerald" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4 no-print">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Calculator className="text-emerald-600"/> 雙軌財務總管
                    </h2>
              <p className="text-slate-500 text-sm md:text-base font-bold mt-1 leading-[1.6] tracking-wide md:tracking-normal">
                        核心花費已鎖定，精確區分「已付款」與「待預訂」。
                    </p>
                  <SectionHeaderNote align="left" />
                </div>
                <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 w-full md:w-auto">
                    <button onClick={() => setIsPer(false)} className={`px-6 py-2 text-xs rounded-lg font-black transition-all ${!isPer ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>👪 家族總計 (3人)</button>
                    <button onClick={() => setIsPer(true)} className={`px-6 py-2 text-xs rounded-lg font-black transition-all ${isPer ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>👤 單人均分</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#10B981] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden print-break-inside-avoid">
                    <div className="relative z-10">
                        <div className="text-emerald-200 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                          <CreditCard size={12}/> PAID (已刷卡結清) {isPer && "(單人)"}
                        </div>
                        <div className="text-2xl md:text-3xl font-black mb-1">NT$ {dispPaid.toLocaleString()}</div>
                        <div className="text-xs font-bold text-emerald-100 flex items-center gap-1">
                          <AlertOctagon size={12} className="text-amber-300"/> 另有 NT$ {dispPending.toLocaleString()} 行前待訂
                        </div>
                    </div>
                    <CheckCircle2 size={80} className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4" />
                </div>

                <div className="bg-[#F97316] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden print-break-inside-avoid">
                    <div className="relative z-10">
                        <div className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Banknote size={12}/> CASH NEEDED (當地準備) {isPer && "(單人)"}
                        </div>
                        <div className="text-2xl md:text-3xl font-black mb-1">€ {dispPayLaterEur.toLocaleString()}</div>
                        <div className="text-xs font-bold text-orange-100">約 NT$ {dispPayLaterTwd.toLocaleString()} (含日常餐飲)</div>
                    </div>
                    <Wallet size={80} className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4" />
                </div>

                <div className="bg-[#1E293B] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden print-break-inside-avoid">
                    <div className="relative z-10">
                        <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Calculator size={12}/> {isPer ? "GRAND TOTAL (單人總預估)" : "GRAND TOTAL (家族總預估)"}
                        </div>
                        <div className="text-3xl md:text-4xl font-black mb-1">NT$ {dispGrandTotal.toLocaleString()}</div>
                        <div className="text-xs font-bold text-slate-400">已付 + 待訂 + 當地預估花費</div>
                    </div>
                    <DollarSign size={100} className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4" />
                </div>
            </div>

                <div className="bg-[#312E81] text-white rounded-2xl shadow-xl border border-indigo-700/80 overflow-hidden print-break-inside-avoid">
                  <div className="p-6 md:p-7 border-b border-indigo-400/30">
                    <h3 className="font-black text-lg md:text-2xl text-amber-300 flex items-center gap-2">
                      <Wallet size={18} /> 出國前換匯策略：到底該帶多少歐元現金？
                    </h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`rounded-xl border p-4 ${isPer ? 'bg-indigo-500/30 border-indigo-200/50' : 'bg-indigo-900/40 border-indigo-400/40'}`}>
                        <div className="text-[10px] uppercase tracking-widest font-black text-indigo-100">建議每人最低額度</div>
                        <div className="mt-2 text-4xl font-black text-white">€ {recommendedCashPerPersonEur.toLocaleString()} <span className="text-lg font-bold text-indigo-200">/人</span></div>
                        <div className="text-xs font-bold text-indigo-200 mt-2">約台幣 NT$ {Math.round((recommendedCashPerPersonEur * rate)).toLocaleString()}</div>
                      </div>
                      <div className={`rounded-xl border p-4 ${!isPer ? 'bg-indigo-500/30 border-indigo-200/50' : 'bg-indigo-900/40 border-indigo-400/40'}`}>
                        <div className="text-[10px] uppercase tracking-widest font-black text-indigo-100">家庭總準備額度</div>
                        <div className="mt-2 text-4xl font-black text-white">€ {recommendedCashFamilyEur.toLocaleString()} <span className="text-lg font-bold text-indigo-200">(3人)</span></div>
                        <div className="text-xs font-bold text-indigo-200 mt-2">約台幣 NT$ {Math.round((recommendedCashFamilyEur * rate)).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm font-bold text-indigo-100 leading-[1.7]">
                      目前顯示：<span className="text-amber-300 font-black">€ {recommendedCashDisplayEur.toLocaleString()}</span>（約 NT$ {recommendedCashDisplayTwd.toLocaleString()}）。
                      其中 <span className="text-emerald-300">€ {dispMustCashEur.toLocaleString()}</span> 屬於「較常需現金」(城市稅/貢多拉/零錢小費)，
                      <span className="text-sky-300"> € {dispCardFriendlyEur.toLocaleString()}</span> 多為可刷卡項目。
                    </div>
                  </div>

                  <div className="p-6 md:p-7 bg-indigo-900/35">
                    <div className="rounded-2xl border border-indigo-300/35 bg-indigo-500/20 p-4 md:p-5">
                      <div className="text-amber-300 font-black text-sm md:text-base flex items-center gap-2">
                        <Store size={16} /> 台灣銀行換鈔面額指南（直接給櫃台看）
                      </div>
                      <div className="text-[11px] text-indigo-200 font-bold mt-1">
                        建議小面額優先（€100 以上少拿）。
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest font-black text-indigo-200">換鈔模式</span>
                        <button
                          onClick={() => setIsPer(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black border transition ${!isPer ? 'bg-white text-indigo-700 border-indigo-100 shadow-sm' : 'bg-indigo-900/40 text-indigo-100 border-indigo-300/30 hover:bg-indigo-900/60'}`}
                        >
                          👪 家族 €1,050
                        </button>
                        <button
                          onClick={() => setIsPer(true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black border transition ${isPer ? 'bg-white text-indigo-700 border-indigo-100 shadow-sm' : 'bg-indigo-900/40 text-indigo-100 border-indigo-300/30 hover:bg-indigo-900/60'}`}
                        >
                          👤 單人 €350
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        {denominationPlan.map((note) => (
                          <div key={note.value} className="bg-white/95 rounded-xl text-center p-3 border border-indigo-100">
                            <div className={`text-2xl font-black ${note.value === 10 ? 'text-rose-500' : note.value === 5 ? 'text-emerald-600' : 'text-blue-600'}`}>€ {note.value}</div>
                            <div className="text-[11px] font-black text-slate-500 mt-1">x {note.count} 張 = € {(note.value * note.count).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 bg-white/95 border border-indigo-100 rounded-xl p-3 text-xs text-slate-700 font-black leading-[1.7]">
                        <div className="text-[10px] uppercase tracking-widest text-indigo-700 mb-1">面額驗算（給銀行）</div>
                        <div>
                          驗算一：€ {denominationPlan.map((note) => `${note.value}x${note.count}`).join(' + ')} =
                          <span className="text-indigo-700"> € {denominationTotalEur.toLocaleString()}</span>
                        </div>
                        <div>
                          驗算二：目標 € {recommendedCashDisplayEur.toLocaleString()}，差額
                          <span className={`${denominationDiffEur === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {' '}{denominationDiffEur > 0 ? '+' : ''}€ {denominationDiffEur.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          驗算三：€ {denominationTotalEur.toLocaleString()} x 匯率 {rate} = 約
                          <span className="text-indigo-700"> NT$ {denominationTotalTwd.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print-break-inside-avoid">
                    <div className="bg-emerald-50 p-5 border-b border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-600" size={18}/>
                        <h3 className="font-black text-emerald-900 text-sm">行前花費明細 (機票/住宿/交通/一日遊)</h3>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-black border-b">
                            <tr>
                                <th className="p-4">項目</th>
                                <th className="p-4 text-right">金額 (TWD)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.prepaid.map((item, idx) => (
                                <tr key={idx} className={`transition-colors ${item.status === 'pending' ? 'bg-amber-50/30 hover:bg-amber-50' : 'hover:bg-slate-50'}`}>
                                    <td className="p-4">
                                        <div className="font-black text-slate-800 flex items-center gap-2">
                                            {item.name}
                                        </div>
                                        <div className="text-[11px] font-bold text-slate-500 mt-0.5">{item.category} • {item.note}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className={`font-black font-mono ${item.status === 'pending' ? 'text-amber-600' : 'text-slate-700'}`}>
                                            ${Math.round(item.twd / divisor).toLocaleString()}
                                            {isPer && <span className="text-[9px] text-slate-400 ml-1 font-sans">/人</span>}
                                        </div>
                                        <div className="mt-1">
                                            {item.status === 'paid' 
                                                ? <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">已刷卡</span>
                                                : <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">待預訂</span>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit print-break-inside-avoid">
                    <div className="bg-orange-50 p-5 border-b border-orange-100 flex items-center gap-2">
                        <Banknote className="text-orange-600" size={18}/>
                        <h3 className="font-black text-orange-900 text-sm">預計當地花費 (歐元)</h3>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-black border-b">
                            <tr>
                                <th className="p-4">項目</th>
                                <th className="p-4 text-right">預估 (EUR)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.payLater.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-black text-slate-800">{item.name}</div>
                                        <div className="text-[11px] font-bold text-slate-500 mt-0.5">{item.note}</div>
                                    </td>
                                    <td className="p-4 text-right font-black text-slate-700 font-mono">
                                        €{Math.round(item.eur / divisor).toLocaleString()}
                                        {isPer && <span className="text-[9px] text-slate-400 ml-1 font-sans">/人</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 bg-slate-50 text-xs font-bold text-slate-500 text-center border-t border-slate-100">
                        <Info size={14} className="inline mr-1 -mt-0.5"/>
                        多數餐廳皆可刷卡，現金無須準備太多。當地城市稅需於退房時付現。
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Tab: Reservation List View 
// ==========================================
const ReservationListView = () => (
    <div className="p-6 md:p-10 space-y-8 bg-indigo-50 print-break-inside-avoid">
    <div className="flex justify-center md:justify-start">
      <SectionTag label="🎫 票券" tone="indigo" />
    </div>
        
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border-2 border-indigo-200 shadow-sm print-break-inside-avoid">
            <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="text-amber-500" /> 🚨 義大利高鐵搭乘 3 大鐵則
            </h3>
      <ul className="text-sm text-slate-700 space-y-3 font-bold leading-[1.6] tracking-wide md:tracking-normal">
                <li className="flex gap-2 items-start"><span className="text-indigo-600">1.</span> <div><strong>免紙本打票：</strong>我們買的都是對號座高鐵(Frecciarossa/Italo)，不需要找黃色打票機。查票時手機出示電子票 QR Code 即可。</div></li>
                <li className="flex gap-2 items-start"><span className="text-indigo-600">2.</span> <div><strong>看懂電子看板：</strong>義大利火車只會在「發車前 10-15 分鐘」才會在電子大看板顯示月台號碼 (<span className="bg-indigo-100 text-indigo-800 px-1 rounded">Binario</span>)。請提早抵達大廳盯著螢幕。</div></li>
                <li className="flex gap-2 items-start"><span className="text-indigo-600">3.</span> <div><strong>行李上鎖戰略：</strong>長輩坐位子上看不到車廂前後的公共行李架。上車後請務必用大創買的「自行車鋼絲鎖」把三個行李跟鐵桿鎖在一起！</div></li>
            </ul>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center pb-4">
                <h1 className="text-2xl md:text-3xl font-black text-indigo-900 mb-2 leading-tight">🎫 正式車票與憑證清單</h1>
                <p className="text-indigo-600/80 text-xs uppercase tracking-[0.2em] font-black">Official Tickets & Reservations</p>
              <SectionHeaderNote />
            </div>

            <div className="flex bg-white border-2 border-indigo-200 rounded-2xl overflow-hidden shadow-sm print-break-inside-avoid">
                <div className="bg-indigo-50 p-4 flex flex-col justify-center items-center w-20 md:w-28 border-r border-indigo-100">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Day 3</div>
                    <div className="text-xl md:text-2xl font-black text-indigo-800">6/14</div>
                    <div className="text-[9px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded mt-1 uppercase">Trenitalia</div>
                </div>
                <div className="p-4 md:p-5 flex-1 relative">
                    <div className="absolute right-5 top-5 opacity-10"><Train size={48}/></div>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-black text-lg md:text-xl text-indigo-950">Frecciarossa 9733</h3>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-[10px] font-black uppercase">1º Business</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Departure</div>
                            <div className="font-black text-slate-800 text-xs md:text-sm">Milano Centrale <span className="text-indigo-600 ml-1">14:15</span></div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Arrival</div>
                            <div className="font-black text-slate-800 text-xs md:text-sm">Venezia S. Lucia <span className="text-indigo-600 ml-1">16:42</span></div>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Coach: <strong className="text-slate-800 text-sm ml-1">2</strong></span>
                        <span className="font-bold text-slate-500">Seats: <strong className="text-indigo-600 text-sm ml-1">8B, 9A, 9B</strong></span>
                    </div>
                </div>
            </div>

            <div className="flex bg-white border-2 border-indigo-200 rounded-2xl overflow-hidden shadow-sm print-break-inside-avoid">
                <div className="bg-indigo-50 p-4 flex flex-col justify-center items-center w-20 md:w-28 border-r border-indigo-100">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Day 6</div>
                    <div className="text-xl md:text-2xl font-black text-indigo-800">6/17</div>
                    <div className="text-[9px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded mt-1 uppercase">Trenitalia</div>
                </div>
                <div className="p-4 md:p-5 flex-1 relative">
                    <div className="absolute right-5 top-5 opacity-10"><Train size={48}/></div>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-black text-lg md:text-xl text-indigo-950">Frecciarossa 9425</h3>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-[10px] font-black uppercase">1º Business</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Departure</div>
                            <div className="font-black text-slate-800 text-xs md:text-sm">Venezia S. Lucia <span className="text-indigo-600 ml-1">14:26</span></div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Arrival</div>
                            <div className="font-black text-slate-800 text-xs md:text-sm">Firenze S.M.N <span className="text-indigo-600 ml-1">16:39</span></div>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Coach: <strong className="text-slate-800 text-sm ml-1">2</strong></span>
                        <span className="font-bold text-slate-500">Seats: <strong className="text-indigo-600 text-sm ml-1">9A, 10A, 10B</strong></span>
                    </div>
                </div>
            </div>

            <div className="flex bg-white border-2 border-red-200 rounded-2xl overflow-hidden shadow-sm print-break-inside-avoid">
                <div className="bg-red-50 p-4 flex flex-col justify-center items-center w-20 md:w-28 border-r border-red-100">
                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">Day 10</div>
                    <div className="text-xl md:text-2xl font-black text-red-800">6/21</div>
                    <div className="text-[9px] font-black bg-red-600 text-white px-2 py-0.5 rounded mt-1 uppercase">Italo</div>
                </div>
                <div className="p-4 md:p-5 flex-1 relative">
                    <div className="absolute right-5 top-5 opacity-10"><Train size={48} className="text-red-500"/></div>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-black text-lg md:text-xl text-red-950">Italo 8905</h3>
                        <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-[10px] font-black uppercase">Prima Business</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Departure</div>
                            <div className="font-black text-slate-800 text-xs md:text-sm">Firenze S.M.N <span className="text-red-600 ml-1">10:28</span></div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Arrival</div>
                            <div className="font-black text-slate-800 text-xs md:text-sm">Roma Termini <span className="text-red-600 ml-1">12:10</span></div>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Coach: <strong className="text-slate-800 text-sm ml-1">3</strong></span>
                        <span className="font-bold text-slate-500">Seats: <strong className="text-red-600 text-sm ml-1">18, 19, 20</strong></span>
                    </div>
                </div>
            </div>

        </div>
    </div>
);

// ==========================================
// Tab: Detailed Itinerary View 
// ==========================================
const ItineraryView = () => {
    const [expandedDays, setExpandedDays] = useState([1, 2, 3]); 
    const toggleDay = (day) => {
        setExpandedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };
    
    const expandAll = () => setExpandedDays(ItineraryData.map(d => d.day));
    const collapseAll = () => setExpandedDays([]);

    const ItineraryData = [
      {
        day: 1, date: "06/12 (五)", city: "台北 ➔ 杜拜", title: "壯遊啟動：旗艦機體驗", hotel: "機上 (阿聯酋航空 A380)",
        events: [
          { time: "20:30", icon: <MapPin size={16}/>, desc: "全家抵達桃園機場 T2 阿聯酋櫃檯報到、托運行李", type: "info" },
          { time: "21:30", icon: <Coffee size={16}/>, desc: "過安檢，免稅店閒逛或使用貴賓室吃點熱食", type: "leisure" },
          { time: "23:50", icon: <Plane size={16}/>, desc: "EK367 準時起飛 (A380)，開啟兩段式睡眠模式", type: "highlight" }
        ]
      },
      {
        day: 2, date: "06/13 (六)", city: "米蘭", title: "降落與無痛安頓", hotel: "米蘭: Hotel Midway (中央車站旁)",
        events: [
          { time: "14:10", icon: <Plane size={16}/>, desc: "抵達米蘭 MXP 機場 (T1)，下機伸展筋骨", type: "info" },
          { time: "15:30", icon: <Train size={16}/>, desc: "搭乘 Malpensa Express 機場快線直達市區", type: "transit" },
          { time: "16:40", icon: <Bed size={16}/>, desc: "【無痛入住】步行抵達 Hotel Midway，長輩進房躺平", type: "highlight" },
          { time: "18:00", icon: <Camera size={16}/>, desc: "搭地鐵至艾曼紐二世迴廊 (Galleria) 拍攝夜間點燈", type: "leisure" },
          { time: "19:00", icon: <Coffee size={16}/>, desc: "全球最美星巴克臻選工坊 (看青銅烘豆機運作)", type: "leisure" },
          { time: "20:00", icon: <Utensils size={16}/>, desc: "米蘭首夜：找間道地餐館享用米蘭燉飯", type: "leisure" }
        ]
      },
      {
        day: 3, date: "06/14 (日)", city: "米蘭 ➔ 威尼斯", title: "大教堂登頂與水都", hotel: "威尼斯: Hotel Principe (露台套房)",
        events: [
          { time: "07:30", icon: <Coffee size={16}/>, desc: "飯店享用早餐，退房，行李寄放櫃台", type: "info" },
          { time: "08:30", icon: <Train size={16}/>, desc: "搭乘 M3 (黃線) 地鐵直達 Duomo 站", type: "transit" },
          { time: "09:30", icon: <Ticket size={16}/>, desc: "【高光】搭電梯登頂大教堂，穿梭於尖塔間", type: "highlight" },
          { time: "11:30", icon: <Utensils size={16}/>, desc: "大教堂周邊享用午餐與義式濃縮咖啡", type: "leisure" },
          { time: "13:15", icon: <Bed size={16}/>, desc: "回 Hotel Midway 取行李，步行進入中央車站", type: "info" },
          { time: "14:15", icon: <Train size={16}/>, desc: "搭乘高鐵 FR 9733 前往威尼斯 (Coach 2)", type: "highlight" },
          { time: "16:42", icon: <MapPin size={16}/>, desc: "抵達 Venezia S. Lucia 車站，出站即是絕美運河", type: "info" },
          { time: "17:10", icon: <Bed size={16}/>, desc: "【無痛入住】步行直達 Hotel Principe 露台套房", type: "highlight" },
          { time: "18:30", icon: <Utensils size={16}/>, desc: "運河畔景觀餐廳享用威尼斯墨魚麵與白酒", type: "leisure" }
        ]
      },
      {
        day: 4, date: "06/15 (一)", city: "威尼斯", title: "水都慢活與黃金日落", hotel: "威尼斯: Hotel Principe (露台套房)",
        events: [
          { time: "08:30", icon: <Coffee size={16}/>, desc: "在露台套房悠閒享用早餐", type: "leisure" },
          { time: "09:30", icon: <Camera size={16}/>, desc: "步行前往聖馬可廣場，沿途穿越水巷與小橋", type: "info" },
          { time: "11:30", icon: <Compass size={16}/>, desc: "【深度】探訪沉水書店 (Libreria Acqua Alta)", type: "leisure" },
          { time: "15:00", icon: <Ticket size={16}/>, desc: "【預約制】德國商館 (T Fondaco) 頂樓俯瞰大運河", type: "highlight" },
          { time: "17:30", icon: <Anchor size={16}/>, desc: "【極致浪漫】於聖馬可後方小巷包下貢多拉，享受日落", type: "highlight" },
          { time: "19:00", icon: <Utensils size={16}/>, desc: "晚餐：威尼斯小點 (Cicchetti) 配 Spritz", type: "leisure" }
        ]
      },
      {
        day: 5, date: "06/16 (二)", city: "威尼斯", title: "彩色島童話攝影", hotel: "威尼斯: Hotel Principe (露台套房)",
        events: [
          { time: "09:00", icon: <Navigation size={16}/>, desc: "前往 F.te Nove 碼頭搭乘 12 號水上巴士", type: "transit" },
          { time: "10:30", icon: <Camera size={16}/>, desc: "抵達布拉諾島 (Burano)，拍攝彩色房屋", type: "highlight" },
          { time: "13:00", icon: <Utensils size={16}/>, desc: "島上享用著名炸海鮮拼盤當午餐", type: "leisure" },
          { time: "16:30", icon: <ShoppingBag size={16}/>, desc: "里亞托橋 (Rialto) 周邊自由採買紀念品", type: "leisure" }
        ]
      },
      {
        day: 6, date: "06/17 (三)", city: "威尼斯 ➔ 佛羅倫斯", title: "睡飽再出發的文藝復興", hotel: "佛羅倫斯: Plus Florence",
        events: [
          { time: "09:30", icon: <Coffee size={16}/>, desc: "【戰略休整】睡到自然醒，享用最後的水都早餐", type: "highlight" },
          { time: "11:30", icon: <Bed size={16}/>, desc: "優雅退房，散步至火車站月台", type: "info" },
          { time: "14:26", icon: <Train size={16}/>, desc: "搭乘高鐵 FR 9425 前往佛羅倫斯", type: "transit" },
          { time: "16:39", icon: <MapPin size={16}/>, desc: "抵達 Firenze S. M. Novella 車站", type: "info" },
          { time: "17:00", icon: <Bed size={16}/>, desc: "入住 Plus Florence，長輩午休充電", type: "highlight" },
          { time: "18:00", icon: <Camera size={16}/>, desc: "市區初探：散步至老橋與百花大教堂", type: "leisure" },
          { time: "19:30", icon: <Utensils size={16}/>, desc: "巷弄托斯卡尼餐館品酒吃肉", type: "leisure" }
        ]
      },
      {
        day: 7, date: "06/18 (四)", city: "佛羅倫斯 (市區)", title: "大師傑作與慢活", hotel: "佛羅倫斯: Plus Florence",
        events: [
          { time: "09:00", icon: <Ticket size={16}/>, desc: "進入烏菲茲美術館，看《維納斯的誕生》", type: "highlight" },
          { time: "12:00", icon: <Utensils size={16}/>, desc: "午餐：中央市場 2F 牛肚包與松露麵", type: "leisure" },
          { time: "14:00", icon: <Bed size={16}/>, desc: "【體力調節】走回飯店吹冷氣午休，避開午後烈日", type: "info" },
          { time: "16:30", icon: <MapPin size={16}/>, desc: "市區慢漫步，若有體力可追加學院美術館看大衛像", type: "leisure" },
          { time: "19:00", icon: <Utensils size={16}/>, desc: "領主廣場周邊晚餐", type: "leisure" }
        ]
      },
      {
        day: 8, date: "06/19 (五)", city: "佛羅倫斯郊區", title: "奇蹟與海岸：大巴遊", hotel: "佛羅倫斯: Plus Florence",
        events: [
          { time: "07:30", icon: <Bus size={16}/>, desc: "【大巴接送】集合出發前往比薩，車上睡覺回血", type: "transit" },
          { time: "09:30", icon: <Camera size={16}/>, desc: "抵達奇蹟廣場，拍攝推比薩斜塔借位照", type: "leisure" },
          { time: "12:30", icon: <MapPin size={16}/>, desc: "【海岸絕景】抵達五漁村 (Cinque Terre)，跟著中文導遊探索", type: "highlight" },
          { time: "13:30", icon: <Train size={16}/>, desc: "搭乘村際火車或遊船，穿梭於彩色懸崖村落間", type: "leisure" },
          { time: "18:00", icon: <MapPin size={16}/>, desc: "結束五漁村行程，搭乘大巴返回佛羅倫斯市區", type: "info" },
          { time: "20:00", icon: <Bed size={16}/>, desc: "抵達市區，自由晚餐後回飯店休息", type: "info" }
        ]
      },
      {
        day: 9, date: "06/20 (六)", city: "佛羅倫斯", title: "品味、夕陽與終極牛排", hotel: "佛羅倫斯: Plus Florence",
        events: [
          { time: "09:30", icon: <ShoppingBag size={16}/>, desc: "百年修道院藥妝店，採買頂級香氛 / 中央市場買油醋", type: "leisure" },
          { time: "15:00", icon: <BookOpen size={16}/>, desc: "【絕美私房】Giunti Odeon 劇院書店喝咖啡", type: "highlight" },
          { time: "18:00", icon: <Car size={16}/>, desc: "搭乘計程車直上米開朗基羅廣場", type: "transit" },
          { time: "18:45", icon: <Camera size={16}/>, desc: "俯瞰阿諾河、老橋與百花大教堂的魔幻夕陽", type: "highlight" },
          { time: "20:00", icon: <Utensils size={16}/>, desc: "【終極饗宴】Trattoria Dall'Oste 1kg 丁骨大牛排", type: "highlight" }
        ]
      },
      {
        day: 10, date: "06/21 (日)", city: "佛羅倫斯 ➔ 羅馬", title: "法拉利高鐵與羅馬初夜", hotel: "羅馬: Hotel Milani",
        events: [
          { time: "10:28", icon: <Train size={16}/>, desc: "搭乘法拉利高鐵 Italo 8905 (Prima 商務艙)", type: "highlight" },
          { time: "12:10", icon: <MapPin size={16}/>, desc: "抵達 Roma Termini 羅馬中央車站", type: "info" },
          { time: "14:30", icon: <Bed size={16}/>, desc: "入住 Hotel Milani，長輩進房午休躲烈日", type: "highlight" },
          { time: "16:30", icon: <MapPin size={16}/>, desc: "西班牙階梯 ➔ 許願池投幣", type: "leisure" },
          { time: "18:30", icon: <Coffee size={16}/>, desc: "百年冰淇淋 Giolitti 與 金杯咖啡", type: "leisure" }
        ]
      },
      {
        day: 11, date: "06/22 (一)", city: "羅馬郊區", title: "天空之城尊榮包車", hotel: "羅馬: Hotel Milani",
        events: [
          { time: "08:30", icon: <Car size={16}/>, desc: "【尊榮包車】中文司機開 7 人座至飯店接送 (避開羅馬週一人潮)", type: "highlight" },
          { time: "10:30", icon: <MapPin size={16}/>, desc: "直達天空之城 (Civita) 橋頭，挑戰高架橋入城", type: "highlight" },
          { time: "13:30", icon: <MapPin size={16}/>, desc: "驅車前往懸崖中世紀小鎮 Orvieto", type: "transit" },
          { time: "14:30", icon: <Utensils size={16}/>, desc: "當地享用翁布里亞鄉村野味午餐", type: "leisure" },
          { time: "18:30", icon: <Car size={16}/>, desc: "【無痛送回】司機專車送回羅馬飯店門口", type: "highlight" }
        ]
      },
      {
        day: 12, date: "06/23 (二)", city: "羅馬", title: "帝國榮耀與老城煙火氣", hotel: "羅馬: Hotel Milani",
        events: [
          { time: "09:00", icon: <Ticket size={16}/>, desc: "進入羅馬競技場 (Colosseum)，感受古羅馬震撼", type: "highlight" },
          { time: "11:30", icon: <MapPin size={16}/>, desc: "順路步行至古羅馬廣場與威尼斯廣場", type: "info" },
          { time: "15:00", icon: <Bed size={16}/>, desc: "回飯店沖澡、午休 2 小時", type: "info" },
          { time: "17:00", icon: <Compass size={16}/>, desc: "【深度】搭車跨越台伯河，抵達 Trastevere 老城", type: "leisure" },
          { time: "18:30", icon: <Utensils size={16}/>, desc: "藤蔓纏繞的戶外餐桌，享用道地培根蛋麵", type: "highlight" }
        ]
      },
      {
        day: 13, date: "06/24 (三)", city: "羅馬 (梵蒂岡)", title: "聖地巡禮與創世紀", hotel: "羅馬: Hotel Milani",
        events: [
          { time: "07:30", icon: <MapPin size={16}/>, desc: "【神級通關】抵達大教堂，安檢 0 分鐘直接進入！", type: "highlight" },
          { time: "10:30", icon: <Camera size={16}/>, desc: "沿著協和大道走到聖天使城堡橋上拍照", type: "leisure" },
          { time: "14:00", icon: <Bed size={16}/>, desc: "強迫長輩回飯店睡午覺，儲備下午電力", type: "info" },
          { time: "17:00", icon: <Ticket size={16}/>, desc: "【官網進場】梵蒂岡博物館，精華動線直搗黃龍", type: "highlight" },
          { time: "18:45", icon: <Eye size={16}/>, desc: "抵達西斯汀禮拜堂，屏息仰望《創世紀》", type: "highlight" }
        ]
      },
      {
        day: 14, date: "06/25 (四)", city: "羅馬 ➔ 機場", title: "超市掃貨與賦歸", hotel: "機上 (阿聯酋航空 A380)",
        events: [
          { time: "10:30", icon: <Bed size={16}/>, desc: "辦理退房，行李寄放櫃台", type: "info" },
          { time: "11:00", icon: <ShoppingBag size={16}/>, desc: "【最後衝刺】Termini 車站地下超市大採買", type: "highlight" },
          { time: "14:00", icon: <Utensils size={16}/>, desc: "在羅馬享用最後一頓義式大餐", type: "leisure" },
          { time: "18:30", icon: <Train size={16}/>, desc: "從車站搭乘 Leonardo Express 機場快線", type: "transit" },
          { time: "19:15", icon: <MapPin size={16}/>, desc: "抵達 FCO 羅馬機場，辦理退稅與登機手續", type: "info" },
          { time: "22:10", icon: <Plane size={16}/>, desc: "阿聯酋起飛 (EK232)，帶著滿滿回憶離開", type: "highlight" }
        ]
      },
      {
        day: 15, date: "06/26 (五)", city: "台北", title: "平安抵家", hotel: "溫暖的家",
        events: [
          { time: "21:20", icon: <CheckCircle2 size={16}/>, desc: "航班順利降落桃園機場 T2，完美落幕！", type: "highlight" }
        ]
      }
    ];

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC]">
            <div className="mb-3 flex justify-center md:justify-start">
              <SectionTag label="🗓 行程" tone="blue" />
            </div>
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-lg mb-8 relative print-break-inside-avoid">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="text-slate-300 text-xs font-black tracking-widest mb-2 uppercase">Time-Blocked Itinerary</div>
                  <h1 className="text-2xl md:text-3xl font-black mb-2 leading-tight">義大利 15 天家族壯遊</h1>
                  <p className="text-slate-200 text-sm md:text-base font-bold leading-[1.6] tracking-wide md:tracking-normal">2026.06.12 (Fri) - 06.26 (Fri) · 五漁村破解版 · 尊榮長輩版</p>
                  <SectionHeaderNote align="left" tone="light" />
                </div>
                <div className="flex flex-wrap gap-2 no-print md:self-start w-full sm:w-auto">
                  <button onClick={expandAll} className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 w-full sm:w-auto"><Maximize2 size={14}/> 展開全部</button>
                  <button onClick={collapseAll} className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 w-full sm:w-auto"><Minimize2 size={14}/> 摺疊全部</button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {ItineraryData.map((d) => {
                const isExpanded = expandedDays.includes(d.day);
                return (
                <div key={d.day} className={`bg-white rounded-2xl transition-all duration-300 overflow-hidden border print-break-inside-avoid ${isExpanded ? 'border-blue-400 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                  
                  <button onClick={() => toggleDay(d.day)} className="w-full px-6 py-5 flex items-center justify-between text-left print:pointer-events-none">
                    <div className="flex items-center gap-4 md:gap-5 w-full">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex flex-col items-center justify-center font-black transition-colors shrink-0 ${isExpanded ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                        <span className="text-[9px] md:text-[10px] uppercase leading-none mb-1">Day</span>
                        <span className="text-xl md:text-2xl leading-none">{d.day}</span>
                      </div>
                      <div className="flex-1 pr-4 min-w-0">
                        <h3 className="font-black text-slate-800 text-sm md:text-base leading-snug">{d.city}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 min-w-0">
                          <p className="text-[11px] text-slate-500/80 font-black uppercase tracking-wider leading-relaxed truncate max-w-[140px] sm:max-w-none">{d.date}</p>
                          {d.hotel && (
                            <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold border truncate max-w-[180px] sm:max-w-none ${isExpanded ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                              <Hotel size={10}/> {d.hotel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={24} className="text-blue-500 shrink-0 print-hide-icon"/> : <ChevronDown size={24} className="text-slate-300 shrink-0 print-hide-icon"/>}
                  </button>
                  
                  <div className={`${isExpanded ? 'block' : 'hidden print-expand'} px-6 pb-8 pt-2 bg-slate-50/50 border-t border-slate-100`}>
                    <div className="mb-6 px-2">
                      <p className="text-sm text-blue-600 font-black flex items-center gap-2 mb-3">
                        <Compass size={18}/> {d.title}
                      </p>
                      
                      {d.hotel && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm mb-4 print-break-inside-avoid">
                          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                             <Bed size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">今日住宿 / Accommodation</p>
                            <p className="text-sm font-black text-slate-700">{d.hotel}</p>
                          </div>
                        </div>
                      )}

                    </div>
                    
                    <div className="space-y-6 px-2 relative">
                      <div className="absolute left-[19px] md:left-[23px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                      
                      {d.events.map((e, i) => {
                        let iconBg = "bg-white border-slate-200 text-slate-400";
                        let textColor = "text-slate-600 font-medium";
                        let barColor = "bg-slate-200";
                        if (e.type === 'highlight') {
                          iconBg = "bg-amber-100 border-amber-300 text-amber-600 shadow-sm z-10";
                          textColor = "text-slate-900 font-black";
                          barColor = "bg-amber-400";
                        } else if (e.type === 'transit') {
                          iconBg = "bg-blue-50 border-blue-200 text-blue-500 z-10";
                          textColor = "text-slate-700 font-bold";
                          barColor = "bg-blue-400";
                        } else if (e.type === 'leisure') {
                          iconBg = "bg-emerald-50 border-emerald-200 text-emerald-500 z-10";
                          textColor = "text-slate-700 font-bold";
                          barColor = "bg-emerald-400";
                        } else {
                          iconBg = "bg-white border-slate-200 text-slate-400 z-10";
                        }

                        return (
                          <div key={i} className="flex gap-4 md:gap-5 relative print-break-inside-avoid">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center bg-white ${iconBg}`}>
                              {React.cloneElement(e.icon, { size: 20 })}
                            </div>
                            <div className="flex-1 pt-2 pb-2 relative pl-3">
                              <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${barColor}`} />
                              <p className="text-[15px] font-black text-slate-800 font-mono tracking-tight mb-1">{e.time}</p>
                              <p className={`text-sm leading-relaxed ${textColor}`}>{e.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )})}
            </div>
        </div>
    );
};

// ==========================================
// Tab: 待辦與戰略 View 
// ==========================================
const TodoGuideView = () => (
  <div className="p-4 md:p-8 space-y-8 bg-white print-break-inside-avoid">
    
    <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 print-break-inside-avoid">
      <h2 className="text-xl md:text-2xl font-extrabold text-rose-900 mb-4 flex items-center gap-2">
        <ShieldAlert className="text-rose-600"/> 終極待辦與防護戰略
      </h2>
      <p className="text-rose-800 text-sm font-bold">
        機票住宿已完封！跟著以下戰略，確保長輩在義大利舒適安全。
      </p>
    </div>

    <section className="print-break-inside-avoid">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Clock className="text-amber-500"/> 搶票與預訂任務
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-sm font-black text-slate-900 mb-2">🛒 隨時可加入購物車</div>
                <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 font-bold">
                    <li><strong className="text-blue-600">Klook 五漁村大巴遊 (6/19)：</strong> 搜尋佛羅倫斯出發，含中文導覽。</li>
                    <li><strong className="text-blue-600">Trip.com 天空之城包車 (6/22)：</strong> 7人座舒適車型。</li>
                    <li><strong className="text-blue-600">The Fork App (6/20)：</strong> 預訂 Trattoria Dall'Oste 丁骨牛排晚餐。</li>
                </ul>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                <div className="text-sm font-black text-rose-900 mb-2">⏰ 設鬧鐘地獄級搶票</div>
                <ul className="text-xs text-rose-800 space-y-2 list-disc pl-4 font-bold">
                    <li><strong className="text-rose-600">羅馬競技場 (約 5/24)：</strong> 出發前 30 天開賣，極難搶。</li>
                    <li><strong className="text-rose-600">威尼斯商館觀景台 (約 5/25)：</strong> 出發前 21 天開放免費預約。</li>
                    <li><strong className="text-rose-600">烏菲茲美術館 (約 4 月中)：</strong> 官網 B-ticket 留意放票。</li>
                </ul>
            </div>
        </div>
    </section>

    <section className="print-break-inside-avoid">
      <div className="bg-emerald-50 p-5 rounded-lg border-l-4 border-emerald-500 mt-4">
        <h4 className="font-black text-emerald-900 flex items-center gap-2">
          <Navigation size={18}/> 長輩生存 3 大護體戰略
        </h4>
        <ul className="list-decimal pl-5 mt-2 text-sm text-emerald-800 space-y-2 font-bold">
            <li><strong>全面棄用地鐵：</strong> 羅馬地鐵扒手極多且無電梯。下載 <strong className="text-emerald-900">FreeNow APP</strong>，市區移動搭計程車，三人分攤極划算。</li>
            <li><strong>高鐵防盜密碼鎖：</strong> 準備 1公尺自行車鋼絲鎖，將大行李鎖在高鐵行李架上，位子上安心睡覺。</li>
            <li><strong>結伴行動：</strong> 在車站、觀光景點人潮擁擠處，請長輩務必走在您的視線範圍內前方，不要殿後。</li>
        </ul>
      </div>
    </section>
  </div>
);

// ==========================================
// Tab: 行李＆待辦（合併）
// ==========================================
const PackingTodoView = () => (
  <div className="space-y-8">
    <PackingChecklistView />
    <TodoGuideView />
  </div>
);

// ==========================================
// Tab: Venice Access Fee QR Code
// ==========================================
const VeniceQrView = () => {
  const buildImageUrl = (filename) => `./${filename}`;
  const qrItems = [
    {
      id: 'kl',
      fullName: 'KUOWIE LEE',
      code: 'YERNEAAI',
      people: 1,
      validFrom: '14/06/2026',
      validTo: '17/06/2026',
      image: 'KUOWIE_LEE.png',
    },
    {
      id: 'hl',
      fullName: 'HSINGLUNG LI',
      code: 'HEQWCKRB',
      people: 1,
      validFrom: '14/06/2026',
      validTo: '17/06/2026',
      image: 'HSINGLUNG_LI.png',
    },
    {
      id: 'hy',
      fullName: 'HSIUHUA YEH',
      code: 'MHQIDHMK',
      people: 1,
      validFrom: '14/06/2026',
      validTo: '17/06/2026',
      image: 'HSIUHUA_YEH.png',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 print-break-inside-avoid">
      <div className="text-center pb-2 border-b border-amber-200">
        <h1 className="text-2xl md:text-3xl font-black text-amber-900 mb-2 leading-tight">🔳 威尼斯入城費豁免 QR Code</h1>
        <p className="text-amber-700 text-xs uppercase tracking-[0.2em] font-black">Access Fee Exemption</p>
        <SectionHeaderNote />
      </div>

      <div className="max-w-4xl mx-auto bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-amber-900 text-sm font-bold flex items-start gap-3 print-break-inside-avoid">
        <QrCode className="text-amber-600 shrink-0" size={20} />
        <div>
          入城費已豁免，但遇到抽查時需出示 QR Code。請保留手機截圖，或列印一份放隨身包。
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {qrItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 print-break-inside-avoid"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Code</div>
                <div className="mt-2 inline-flex px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-lg font-black">
                  {item.fullName}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Fee</div>
                <div className="text-xs font-bold text-slate-600">cda.ve.it</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
              <div className="space-y-2">
                <div className="text-xs font-black text-slate-400 uppercase">Code</div>
                <div className="text-lg font-black text-slate-900 tracking-wider">{item.code}</div>

                <div className="flex gap-4 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-emerald-600" /> {item.people} 人
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-amber-600" /> {item.validFrom} - {item.validTo}
                  </div>
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                <img
                  src={buildImageUrl(item.image)}
                  alt={`Venice access QR ${item.fullName}`}
                  className="w-36 h-36 sm:w-40 sm:h-40 object-contain border border-slate-100 rounded-xl p-2 bg-white"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900 text-white p-5 rounded-2xl text-xs font-bold flex items-center gap-3 print-break-inside-avoid">
        <Info size={16} className="text-blue-300" />
        若網站或入口詢問，直接出示對應 QR Code 即可。
      </div>
    </div>
  );
};

// ==========================================
// Tab: 票券＆QR（合併）
// ==========================================
const TicketsQrView = () => (
  <div className="space-y-8">
    <ReservationListView />
    <VeniceQrView />
  </div>
);

// ==========================================
// Tab: Tax Refund Guide
// ==========================================
const TaxRefundView = () => (
  <div className="p-4 md:p-8 space-y-8 bg-amber-50 print-break-inside-avoid">
    <div className="flex justify-center md:justify-start">
      <SectionTag label="💶 退稅" tone="amber" />
    </div>
    <div className="text-center pb-2 border-b border-amber-200">
      <h1 className="text-2xl md:text-3xl font-black text-amber-900 mb-2 leading-tight">💶 義大利退稅攻略</h1>
      <p className="text-amber-700 text-xs uppercase tracking-[0.2em] font-black">Tax Free Playbook</p>
      <SectionHeaderNote />
    </div>

    <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm print-break-inside-avoid">
      <h3 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-2">
        <CreditCard className="text-amber-600" /> 2026 最新門檻與資格
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Threshold</div>
          <div className="text-sm font-bold text-amber-900">同日、同店滿 €70 即可退稅</div>
          <div className="text-xs text-amber-800 mt-2 font-bold">非歐盟旅客適用，實際退稅約 12%–15%（依稅率與手續費）。</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Eligibility</div>
          <ul className="text-sm text-slate-700 space-y-2 font-bold">
            <li>非歐盟居住者（台灣護照）</li>
            <li>年齡需滿 16–18 歲以上（依店家規定）</li>
            <li>商品需於購買後 3 個月內攜帶出境歐盟</li>
          </ul>
        </div>
      </div>
      <div className="text-xs text-amber-700 font-bold mt-3 leading-[1.6] tracking-wide md:tracking-normal">提醒：門檻與規定請以店家/退稅公司最新公告為準。</div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print-break-inside-avoid">
      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="text-blue-500" /> 實戰流程 (購物 ➜ 機場)
      </h3>
      <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-2 font-bold">
        <li>結帳前先說明要辦理 Tax Free，請店家開立「電子退稅單」</li>
        <li>店家填護照資料，確認國籍寫 Taiwan</li>
        <li>離境機場先到海關查驗或自助機完成退稅確認</li>
        <li>再到退稅櫃檯/機台領現金或刷回卡</li>
        <li>托運行李內商品：一定要在托運前完成退稅</li>
      </ol>
      <div className="mt-3 text-xs text-slate-500 font-bold leading-[1.6] tracking-wide md:tracking-normal">建議提早 3–5 小時到機場，退稅常需排隊。</div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm print-break-inside-avoid">
      <h3 className="text-lg font-black text-emerald-900 mb-4 flex items-center gap-2">
        <MapPin className="text-emerald-600" /> FCO 現場必備與動線提醒
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">必備文件</div>
          <ul className="text-sm text-emerald-900 space-y-2 font-bold">
            <li>護照</li>
            <li>登機證 / 電子機票</li>
            <li>退稅單 (電子或紙本)</li>
            <li>商品與發票 (備查)</li>
            <li>國籍請寫 Taiwan，避免寫成 China</li>
          </ul>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">現場動線</div>
          <ul className="text-sm text-slate-700 space-y-2 font-bold">
            <li>FCO 退稅多集中在 T3 出境大廳</li>
            <li>找藍色「VAT Refund」指示牌</li>
            <li>建議至少提前 3–4 小時到機場</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print-break-inside-avoid">
      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
        <CheckCircle2 className="text-emerald-600" /> 手提 vs 托運 (FCO 實務流程)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <div className="text-sm font-black text-amber-900 mb-2">商品在托運行李</div>
          <ol className="list-decimal pl-5 text-xs text-amber-900 space-y-2 font-bold">
            <li>到航空櫃檯拿登機證 / 行李條</li>
            <li>不要讓行李上輸送帶 (保持可查驗)</li>
            <li>先到退稅櫃檯 / 海關辦理</li>
            <li>完成後再托運</li>
          </ol>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-sm font-black text-slate-900 mb-2">商品在手提行李</div>
          <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-2 font-bold">
            <li>先完成安檢與出境查驗</li>
            <li>在管制區內的 VAT Refund 櫃檯辦理</li>
            <li>若外場先辦被要求查驗，依指示再到海關</li>
          </ol>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm print-break-inside-avoid">
      <h3 className="text-lg font-black text-blue-900 mb-4 flex items-center gap-2">
        <ShieldAlert className="text-blue-500" /> Otello 系統：綠燈 / 紅燈
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="text-sm font-black text-emerald-900 mb-2">綠燈 (一般情況)</div>
          <div className="text-xs text-emerald-800 font-bold">系統顯示通過時，通常免海關查驗，可直接退稅。</div>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
          <div className="text-sm font-black text-rose-900 mb-2">紅燈 / 特殊情況</div>
          <div className="text-xs text-rose-800 font-bold">若被抽檢或持有非義大利開立的退稅單，需至海關查驗與蓋章。</div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm print-break-inside-avoid">
      <h3 className="text-lg font-black text-emerald-900 mb-4 flex items-center gap-2">
        <MapPin className="text-emerald-600" /> 羅馬 FCO 退稅動線 (官方 ADR)
      </h3>
      <ul className="text-sm text-emerald-900 space-y-2 font-bold">
        <li>海關退稅點：T1、T3 出境區，以及 Boarding Area E / A</li>
        <li>托運行李內商品：務必在 check-in 前完成退稅</li>
        <li>Global Blue / Planet / Tax Refund：
          <span className="block text-emerald-800 mt-1">T3 出境區靠近 check-in 196–225、T1 出境區靠近 check-in 111–140、Boarding Area E (ADR Info Point 附近)</span>
        </li>
        <li>其他情況：找 Customs Office 或使用自助機 + 專用郵箱</li>
      </ul>
      <div className="text-xs text-emerald-700 font-bold mt-3 leading-[1.6] tracking-wide md:tracking-normal">資料來源：ADR「Immigration and customs」頁面。</div>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print-break-inside-avoid">
      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
        <Banknote className="text-amber-600" /> 現金 vs 信用卡
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <div className="text-sm font-black text-amber-900 mb-2">現金退稅</div>
          <ul className="text-xs text-amber-800 space-y-2 font-bold">
            <li>立即拿到現金，最直覺</li>
            <li>通常手續費較高、金額會較少</li>
          </ul>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-sm font-black text-slate-900 mb-2">刷回信用卡</div>
          <ul className="text-xs text-slate-700 space-y-2 font-bold">
            <li>金額通常較多、較划算</li>
            <li>入帳需等待幾天到數週</li>
          </ul>
        </div>
      </div>
      <div className="text-xs text-slate-500 font-bold mt-3 leading-[1.6] tracking-wide md:tracking-normal">現場常見自助機 (Kiosk) 與人工櫃檯，可依排隊狀況選擇。</div>
    </div>

    <div className="bg-slate-900 text-white p-5 rounded-2xl text-xs font-bold flex items-center gap-3 print-break-inside-avoid">
      <Info size={16} className="text-blue-300" />
      結帳時先說「Tax Free」，並確認國籍寫 Taiwan。商品與單據務必帶在身上以備海關抽查。
    </div>
  </div>
);

// ==========================================
// Tab: Shopping Guide 
// ==========================================
const ShoppingGuideView = () => (
  <div className="p-4 md:p-8 space-y-8 bg-[#FFFBF0] print-break-inside-avoid">
    <div className="flex justify-center md:justify-start">
      <SectionTag label="🛒 伴手" tone="amber" />
    </div>
    <div className="text-center pb-2 border-b border-amber-200">
      <h1 className="text-2xl md:text-3xl font-black text-amber-900 mb-2 leading-tight">🛒 義大利必買伴手禮圖鑑</h1>
      <p className="text-amber-700 text-xs uppercase tracking-[0.2em] font-black">Supermarket & Specialty Shopping</p>
      <SectionHeaderNote />
    </div>

    <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-amber-900 mb-4 flex items-center gap-2 border-b pb-2">
            <ShoppingCart className="text-amber-600"/> 超市必掃神級零食 (Conad/Coop)
        </h3>
        <ul className="space-y-4">
            <CheckItem item="Mulino Bianco 開心果夾心餅乾" desc="白磨坊綠色包裝 (Baiocchi)，極度熱賣，濃郁不甜膩，長輩也會喜歡。" />
            <CheckItem item="San Carlo 1936 洋芋片" desc="義大利市佔第一，白色包裝原味最推，口感偏脆硬帶有純粹馬鈴薯香氣。" />
            <CheckItem item="MATILDE VICENZI 長條千層酥" desc="百年品牌，192層摺疊，配濃縮咖啡極品。" />
            <CheckItem item="MATILDE VICENZI 巧克力泡芙酥" desc="千層外皮爆漿巧克力內餡，非常適合買回台灣分送同事。" />
        </ul>
    </div>

    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Globe className="text-blue-600"/> 媽媽的廚房寶物：巴薩米克油醋戰略
        </h3>
        <p className="text-sm md:text-base text-slate-700 font-bold mb-4 leading-[1.6] tracking-wide md:tracking-normal">依據「預算與用途」，我們分為兩個戰場：</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <div className="font-black text-sm text-blue-900 mb-2">戰場 A：追求 CP 值與日常料理</div>
                <ul className="text-xs text-blue-800 space-y-2 list-disc pl-4 font-bold">
                    <li><strong>去哪買：</strong> Termini 車站的 Conad 超市最大最好買。</li>
                    <li><strong>怎麼挑：</strong> 認明瓶標有 <span className="text-amber-600 bg-amber-100 px-1 rounded">IGP</span> 或 <span className="text-amber-600 bg-amber-100 px-1 rounded">DOP</span> (產地保護認證)，代表絕對純正。</li>
                    <li><strong>價格帶：</strong> 約 €3-15。媽媽平常炒菜、拌沙拉，大量使用不心痛。</li>
                </ul>
            </div>
            <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
                <div className="font-black text-sm text-amber-900 mb-2">戰場 B：追求頂級年份與送禮面子</div>
                <ul className="text-xs text-amber-800 space-y-2 list-disc pl-4 font-bold">
                    <li><strong>去哪買：</strong> 佛羅倫斯 <strong className="text-amber-900">中央市場一樓</strong> 傳統油醋專賣店。</li>
                    <li><strong>怎麼挑：</strong> 老闆會倒不同年份（10/12/25 年）滴在湯匙試吃。年份越久越濃稠甘甜。</li>
                    <li><strong>價格帶：</strong> 約 €20-60。珍藏等級！滴在香草冰淇淋、牛排上極致美味。</li>
                </ul>
            </div>
        </div>
    </div>
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print-break-inside-avoid">
      <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
        <MapPin className="text-slate-600"/> 米蘭中央市場 Mercato Centrale Milano
      </h3>
      <div className="space-y-4 text-sm text-slate-700 font-bold">
        <p>米蘭中央市場位於米蘭中央車站側翼，從車站側邊入口進去即可抵達。入口不像佛羅倫斯中央市場那麼顯眼，第一次來很容易錯過。</p>
        <p>這裡 2021 年正式開幕，原本是車站內閒置超過 20 年的辦公區域，改建時保留許多原有建築元素，結合百年車站老建築與現代美食空間，氛圍非常特別。</p>
        <p>市場約有 30 家特色餐飲店，從北義到南義代表美食都幾乎可以找到。市場以餐飲店鋪為主，沒有傳統菜市場的攤販感，而是兩層樓長型的美食空間。</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">必訪店家</div>
            <ul className="space-y-2 text-xs text-slate-700 font-bold leading-relaxed">
              <li>🍞 Il Pane & Dolci | Davide Longoni (4號)：天然酵母麵包、可頌、義式甜點，早餐首選。</li>
              <li>🍄 Luciano Savini (7號)：Savini 松露品牌，松露義大利麵、松露燉飯、松露伴手禮。</li>
              <li>🐟 La Pescheria Con Cucina | Bistrot Pedol (21號)：海鮮控必吃，現場冰櫃展示新鮮海鮮，現點現做。</li>
              <li>🍔 Lo Smash Burger | Joe Bastianich (17號)：MasterChef Italia 評審打造的美式 Smash Burger。</li>
              <li>🥟 Ravioli Cinesi | Agie Zhou (5號)：華人主廚經營，現包水餃與餛飩，非常特別。</li>
              <li>🥐 La Sfogliatella Napoletana (6號)：拿坡里經典千層酥甜點，搭濃縮咖啡超完美。</li>
              <li>🍚 IL Riso (14號)：米蘭最經典的米蘭燉飯，不少當地人推薦。</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">市場特色</div>
            <ul className="space-y-2 text-xs text-slate-700 font-bold leading-relaxed">
              <li>✔ 全部以餐飲店鋪為主，規劃成兩層樓長型空間。</li>
              <li>✔ 位置就在中央車站旁，下火車就能吃、搭車前可再來一餐。</li>
              <li>✔ 公共座位很多，不限店家自由使用。一樓客滿時可以直接上二樓。</li>
              <li>✔ 和佛羅倫斯中央市場不同，米蘭更像現代美食空間，而非傳統市場的攤販氛圍。</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold leading-relaxed">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">營業時間</div>
          <p>週日～週三：06:30 ～ 23:00</p>
          <p>週四～週六：06:30 ～ 24:00</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-sm font-bold leading-relaxed">
          <p className="font-black">總結</p>
          <p>若你住在米蘭中央車站附近，或坐火車進出米蘭，米蘭中央市場真的非常值得安排。不用特地跑景點，雨天也能逛，對自由行旅客來說是最方便、最容易被忽略的美食寶藏之一。</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Components ---

const SectionTag = ({ label, tone = "slate" }) => {
  const tones = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black tracking-widest ${tones[tone] || tones.slate}`}>
      {label}
    </div>
  );
};

const SectionHeaderNote = ({ note = "向下滑動查看更多", align = "center", tone = "slate" }) => {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";
  const tones = {
    slate: { line: "bg-slate-200/80", text: "text-slate-500" },
    light: { line: "bg-white/10", text: "text-slate-300" },
  };
  const current = tones[tone] || tones.slate;

  return (
    <div className={`mt-3 flex flex-col gap-2 ${alignClass}`}>
      <div className={`h-px w-16 ${current.line}`} />
      <div className={`text-[11px] font-semibold ${current.text}`}>{note}</div>
    </div>
  );
};

// ==========================================
// Tab: 喝紅酒 (Wine Guide) View
// ==========================================
const WineGuideView = () => (
  <div className="p-4 md:p-8 space-y-8 bg-rose-50 print-break-inside-avoid">
    <div className="flex justify-center md:justify-start">
      <SectionTag label="🍷 喝紅酒" tone="rose" />
    </div>
    <div className="text-center pb-2 border-b border-rose-200">
      <h1 className="text-2xl md:text-3xl font-black text-rose-900 mb-2 leading-tight">🍷 義大利風乾紅酒終極指南</h1>
      <p className="text-rose-700 text-xs uppercase tracking-[0.2em] font-black">Appassimento & Amarone</p>
      <SectionHeaderNote />
    </div>

    <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm print-break-inside-avoid">
        <p className="text-sm md:text-base text-slate-700 font-bold mb-4 leading-[1.6] tracking-wide md:tracking-normal">
            這是一份專為偏好 <strong>Napa 飽滿、重橡木桶、濃郁果香風格</strong>所設計的義大利「100% 全風乾葡萄（Appassimento/Amarone）」終極採購與品飲總整理。在義大利停留期間（以單一飯店停留 3 天為黃金品飲週期），你可以直接依據預算與通路，鎖定以下這份清單：
        </p>

        <h3 className="text-xl font-black text-rose-900 mt-6 mb-4 flex items-center gap-2 border-b pb-2">
            <Wine className="text-rose-600"/> 📊 一表看懂：依預算直攻的名單
        </h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="bg-rose-100 text-rose-900">
                        <th className="p-3 border border-rose-200 font-black">預算級別</th>
                        <th className="p-3 border border-rose-200 font-black">通路</th>
                        <th className="p-3 border border-rose-200 font-black">推薦酒款/大廠名稱</th>
                        <th className="p-3 border border-rose-200 font-black hidden md:table-cell">風味調性特徵</th>
                        <th className="p-3 border border-rose-200 font-black">盲飲對接風格</th>
                    </tr>
                </thead>
                <tbody className="text-slate-800">
                    <tr className="bg-white hover:bg-rose-50/50">
                        <td className="p-3 border border-rose-100 font-bold text-rose-700 whitespace-nowrap">€6 – €12</td>
                        <td className="p-3 border border-rose-100">各大超市 (Coop, Conad, Esselunga)</td>
                        <td className="p-3 border border-rose-100 font-bold">Grande Alberone "Quintus" 或 Puglia Appassimento IGT</td>
                        <td className="p-3 border border-rose-100 hidden md:table-cell text-xs">爆炸性的藍莓果醬、無花果、甜美香料，單寧極低。</td>
                        <td className="p-3 border border-rose-100 font-bold text-slate-600">加州金芬黛 (Zinfandel)</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-rose-50/50">
                        <td className="p-3 border border-rose-100 font-bold text-rose-700 whitespace-nowrap">€10 – €15</td>
                        <td className="p-3 border border-rose-100">各大超市</td>
                        <td className="p-3 border border-rose-100 font-bold">Gran Passione Rosso Veneto</td>
                        <td className="p-3 border border-rose-100 hidden md:table-cell text-xs">混釀梅洛，帶有明顯香草、可可、圓潤甜美的紅莓味。</td>
                        <td className="p-3 border border-rose-100 font-bold text-slate-600">Napa 現代派梅洛 (Merlot)</td>
                    </tr>
                    <tr className="bg-white hover:bg-rose-50/50">
                        <td className="p-3 border border-rose-100 font-bold text-rose-700 whitespace-nowrap">€18 – €25</td>
                        <td className="p-3 border border-rose-100">超市/酒專</td>
                        <td className="p-3 border border-rose-100 font-bold">Sartori Amarone 或 Pasqua Amarone</td>
                        <td className="p-3 border border-rose-100 hidden md:table-cell text-xs">入門級 Amarone，具備標配的風乾果醬感與厚實度。</td>
                        <td className="p-3 border border-rose-100 font-bold text-slate-600">高 CP 值日常款</td>
                    </tr>
                    <tr className="bg-slate-50 hover:bg-rose-50/50">
                        <td className="p-3 border border-rose-100 font-bold text-rose-700 whitespace-nowrap">€30 – €40</td>
                        <td className="p-3 border border-rose-100">超市/酒專頂層</td>
                        <td className="p-3 border border-rose-100 font-bold">Masi "Costasera" Amarone Classico 或 Tommasi Amarone Classico</td>
                        <td className="p-3 border border-rose-100 hidden md:table-cell text-xs">Masi 帶有烤李子與中藥材複雜度；Tommasi 偏向深沉皮革與黑棗氣息。</td>
                        <td className="p-3 border border-rose-100 font-bold text-slate-600">教科書級別經典</td>
                    </tr>
                    <tr className="bg-white hover:bg-rose-50/50">
                        <td className="p-3 border border-rose-100 font-bold text-rose-700 whitespace-nowrap">€35 – €75</td>
                        <td className="p-3 border border-rose-100">專業酒專 (Enoteca)</td>
                        <td className="p-3 border border-rose-100 font-bold">Zenato Amarone Classico (€35-45) 或 Allegrini Amarone Classico (€60-75)</td>
                        <td className="p-3 border border-rose-100 hidden md:table-cell text-xs">現代重桶派天花板。Zenato 充滿特濃黑巧克力、雪茄盒香氣；Allegrini 果味純淨、單寧如絲綢。</td>
                        <td className="p-3 border border-rose-100 font-bold text-slate-600">頂級高階 Napa Cab</td>
                    </tr>
                </tbody>
            </table>
            <div className="md:hidden text-[10px] text-slate-400 mt-2 text-right">向左滑動查看完整表格 👈</div>
        </div>
    </div>

    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Tag className="text-blue-600"/> 🏷️ 無腦抓酒關鍵字：不澀、果香爆發、超好入口
        </h3>
        <p className="text-sm md:text-base text-slate-700 font-bold mb-4">
            如果想要尋找「不酸、不澀、微甜且風味極度豐富」的紅酒，去超市直接找酒標上有以下 3 個關鍵字的酒，閉著眼睛拿都不會錯：
        </p>
        <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="font-black text-blue-900 text-lg mb-1">Appassimento <span className="text-sm text-blue-700">(全風乾工法)</span></div>
                <div className="text-sm text-slate-700 font-bold">看到這個字就穩了！代表葡萄被風乾成葡萄乾再釀造。保證沒有討厭的苦澀味，滿滿的黑莓果醬與巧克力香，極度順口！</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="font-black text-amber-900 text-lg mb-1">Primitivo 或 Puglia <span className="text-sm text-amber-700">(南義陽光炸彈)</span></div>
                <div className="text-sm text-slate-700 font-bold">Puglia 是南義大區，Primitivo 則是當地代表葡萄（即美國的金芬黛）。這裡的紅酒就是「甜美多汁」的代名詞，便宜又超級好喝！</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <div className="font-black text-emerald-900 text-lg mb-1">Ripasso <span className="text-sm text-emerald-700">(小阿瑪羅尼)</span></div>
                <div className="text-sm text-slate-700 font-bold">如果覺得 Amarone 預算太高，找標示 "Valpolicella <strong>Ripasso</strong>" 的酒。它用 Amarone 剩下的果皮再發酵一次，帶有櫻桃果香與微香料感，CP值極高！</div>
            </div>
        </div>
    </div>

    <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-rose-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Wine className="text-rose-600"/> 🏆 超市無腦拿：3 款必買好找的神級紅酒
        </h3>
        <p className="text-sm md:text-base text-slate-700 font-bold mb-4">
            如果連關鍵字都不想記，直接把這三款的名字截圖下來！它們在各大超市出現率極高，而且完美符合「不澀、微甜、果香爆炸」的標準：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex flex-col h-full">
                <div className="text-[10px] uppercase tracking-widest text-rose-500 font-black mb-1">平價果醬炸彈 (約 €7-9)</div>
                <div className="font-black text-rose-900 text-lg mb-2">Grande Alberone<br/>"Quintus"</div>
                <div className="text-xs text-slate-700 font-bold leading-relaxed mt-auto pt-2 border-t border-rose-200">
                    <span className="text-rose-600">在哪買：</span>Coop、Conad 等大型超市<br/>
                    <span className="text-rose-600">特色：</span>混釀了多種義大利風乾葡萄，喝起來像濃郁的藍莓果醬，幾乎感受不到單寧的澀味，是最具代表性的平價神酒。
                </div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex flex-col h-full">
                <div className="text-[10px] uppercase tracking-widest text-rose-500 font-black mb-1">絲滑巧克力 (約 €10-14)</div>
                <div className="font-black text-rose-900 text-lg mb-2">Gran Passione<br/>Rosso Veneto</div>
                <div className="text-xs text-slate-700 font-bold leading-relaxed mt-auto pt-2 border-t border-rose-200">
                    <span className="text-rose-600">在哪買：</span>威尼斯周邊超市、一般酒專<br/>
                    <span className="text-rose-600">特色：</span>被稱為「平民版 Amarone」，口感像絲綢一樣滑順，帶有明顯的香草與烘焙可可香氣，配上微甜的櫻桃果感，非常討喜。
                </div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex flex-col h-full">
                <div className="text-[10px] uppercase tracking-widest text-rose-500 font-black mb-1">名門經典必喝 (約 €14-16)</div>
                <div className="font-black text-rose-900 text-lg mb-2">Masi<br/>"Campofiorin"</div>
                <div className="text-xs text-slate-700 font-bold leading-relaxed mt-auto pt-2 border-t border-rose-200">
                    <span className="text-rose-600">在哪買：</span>全義大利幾乎所有中大型超市<br/>
                    <span className="text-rose-600">特色：</span>義大利最知名 Amarone 酒莊 Masi 的傳奇酒款。使用雙重發酵工法，結構稍微扎實，但依然果香滿滿、尾韻回甘，配起司無敵！
                </div>
            </div>
        </div>
    </div>

    <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-lg print-break-inside-avoid">
        <h3 className="text-xl font-black text-amber-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
            <Hotel className="text-amber-500"/> 🏨 飯店 3 天停留：黃金品飲動態測試
        </h3>
        <p className="text-sm text-slate-300 font-bold mb-5 leading-relaxed">
            重度風乾紅酒（酒精度高達 14.5% - 16%）擁有極強的抗氧化力，待在同一個飯店的三天，剛好可以完整測試演變：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                <div className="font-black text-emerald-400 text-lg mb-2">第一晚 <span className="text-xs text-emerald-200/70">(剛開瓶)</span></div>
                <div className="text-xs text-slate-300 font-bold leading-relaxed">
                    拔出軟木塞後，先倒出一小口讓瓶頸騰出空間，室溫靜置 <strong>1.5 到 2 小時</strong>。此時結構最強、骨架扎實，果香與酒精感交互帶出強烈衝擊。
                </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                <div className="font-black text-amber-400 text-lg mb-2">第二晚 <span className="text-xs text-amber-200/70">(黃金甜蜜點)</span></div>
                <div className="text-xs text-slate-300 font-bold leading-relaxed">
                    塞回軟木塞放室溫（冷氣房維持約 18-22°C，<strong>切勿放小冰箱</strong>）。經過一整天的微氧化，單寧徹底馴化，黑巧克力、濃縮咖啡與可可層次大面積爆發。
                </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                <div className="font-black text-rose-400 text-lg mb-2">第三晚 <span className="text-xs text-rose-200/70">(完美收尾)</span></div>
                <div className="text-xs text-slate-300 font-bold leading-relaxed">
                    來到最後一杯，這類重度酒款的風味結構依然不會塌陷，反而會收斂出極具質感的煙草、雪松與木質調尾韻。
                </div>
            </div>
        </div>
        <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/30 flex items-start gap-3">
            <Info className="text-indigo-400 shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-indigo-100 font-bold leading-relaxed">
                <strong className="text-indigo-300">裝備小建議：</strong> 如果飯店房間提供的玻璃杯太小或杯壁太厚，建議在當地超市順手花 2、3 歐元買一個肚大口收的紅酒杯（Calice da vino），能大幅提升香氣的凝聚與釋放效果。
            </div>
        </div>
    </div>

    <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-rose-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Store className="text-rose-600"/> 🛒 威、佛、羅：三大城市超市獵酒指南
        </h3>
        <p className="text-sm md:text-base text-slate-700 font-bold mb-4">
            由於行程跨越威尼斯、佛羅倫斯、羅馬，若打算在超市買酒，可參考以下戰略：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="font-black text-slate-800 text-lg mb-1">威尼斯 <span className="text-sm text-slate-500">(Venezia)</span></div>
                <div className="text-xs text-slate-700 font-bold leading-relaxed">
                    <span className="text-rose-600 font-black">超市目標：</span>Despar / Coop<br/>
                    <span className="text-rose-600 font-black">在地優勢：</span>威尼斯所在的威尼托 (Veneto) 大區正是 Amarone 的故鄉！在這裡的超市，風乾紅酒的選擇最齊全，有時還能挖到當地特價的高 CP 值小農酒莊。
                </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="font-black text-slate-800 text-lg mb-1">佛羅倫斯 <span className="text-sm text-slate-500">(Firenze)</span></div>
                <div className="text-xs text-slate-700 font-bold leading-relaxed">
                    <span className="text-rose-600 font-black">超市目標：</span>Esselunga / Conad<br/>
                    <span className="text-rose-600 font-black">在地優勢：</span>雖然這裡是 Chianti (奇揚地) 的地盤，但在大型 Esselunga 依然能買到頂級 Amarone。強烈建議在此買酒回飯店，搭配外帶的牛肚包或佛羅倫斯大牛排！
                </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="font-black text-slate-800 text-lg mb-1">羅馬 <span className="text-sm text-slate-500">(Roma)</span></div>
                <div className="text-xs text-slate-700 font-bold leading-relaxed">
                    <span className="text-rose-600 font-black">超市目標：</span>Termini 車站下的 Conad<br/>
                    <span className="text-rose-600 font-black">在地優勢：</span>羅馬的 Conad 酒類專區非常大。若行程已接近尾聲，可在此作最後掃貨。注意 Amarone 瓶身通常特別重（常超過 1.5kg），請預留行李重量。
                </div>
            </div>
        </div>
    </div>

    <div className="bg-rose-900 text-white p-6 rounded-xl border border-rose-800 shadow-lg print-break-inside-avoid">
        <h3 className="text-xl font-black text-rose-200 mb-4 flex items-center gap-2 border-b border-rose-800 pb-2">
            <Utensils className="text-rose-400"/> 🍕 在地潛規則與超神搭餐術
        </h3>
        <div className="space-y-4">
            <div className="flex items-start gap-3">
                <div className="bg-rose-800 p-2 rounded-full shrink-0"><CheckCircle className="text-rose-300" size={18}/></div>
                <div>
                    <div className="font-black text-rose-100 text-base mb-1">神級搭餐：Amarone × 佛羅倫斯大牛排</div>
                    <div className="text-xs text-rose-200/80 font-bold leading-relaxed">
                        在佛羅倫斯若外帶或去餐廳吃大牛排 (Bistecca)，Amarone 飽滿的酒體、濃郁的黑莓果香與高酒精的微甜感，能完美中和炭烤牛肉的油脂。若吃拿坡里披薩，平價的 Appassimento 就能搭得極好！
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="bg-rose-800 p-2 rounded-full shrink-0"><CheckCircle className="text-rose-300" size={18}/></div>
                <div>
                    <div className="font-black text-rose-100 text-base mb-1">開瓶器 (Cavatappi) 是必備品</div>
                    <div className="text-xs text-rose-200/80 font-bold leading-relaxed">
                        超市買的風乾紅酒 99% 是軟木塞。記得在超市順手買一把簡單的「海馬刀」(Cavatappi)，約 €2-3。或是向飯店櫃台借用，有禮貌地說：「Scusa, hai un cavatappi? (不好意思，有開瓶器嗎？)」
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="bg-rose-800 p-2 rounded-full shrink-0"><CheckCircle className="text-rose-300" size={18}/></div>
                <div>
                    <div className="font-black text-rose-100 text-base mb-1">極致享受：無視重量，攻頂熟食櫃！</div>
                    <div className="text-xs text-rose-200/80 font-bold leading-relaxed">
                        既然「只在當地喝掉」，完全不用管 Amarone 瓶身動輒 1.8 公斤的重量，直接挑最頂級、最重的酒買就對了！強烈建議到超市的<strong>生鮮熟食櫃 (Gastronomia)</strong> 買 100 克的生火腿 (Prosciutto) 與帕馬森起司。帶回威尼斯的飯店露台吹著微風喝酒，這就是義大利最 Chill 的道地玩法。
                    </div>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="bg-rose-800 p-2 rounded-full shrink-0"><CheckCircle className="text-rose-300" size={18}/></div>
                <div>
                    <div className="font-black text-rose-100 text-base mb-1">站吧台喝一杯 (Al Banco) 更融入當地</div>
                    <div className="text-xs text-rose-200/80 font-bold leading-relaxed">
                        走在佛羅倫斯或羅馬的街頭看到小酒館 (Enoteca)，如果只想喝一杯，可以學義大利人直接「站著在吧台喝」(Al Banco)。不僅價格更便宜（免座位費 Coperto），還能跟酒保用義大利文瞎聊兩句，這絕對是最接地氣的爽快體驗。
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2 border-b pb-2">
            <BookOpen className="text-blue-600"/> 📖 餐廳酒單掃描雷達：自己找「香甜、不澀、順口」
        </h3>
        <p className="text-sm md:text-base text-slate-700 font-bold mb-4">
            如果你不想問侍酒師，想自己從密密麻麻的義大利文酒單（Carta dei Vini）中精準命中「香甜、順口、不澀、果香爆棚」的紅酒，請直接掃描以下三組關鍵字：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex flex-col h-full">
                <div className="font-black text-rose-900 text-lg mb-1 flex items-center gap-1">🍇 看葡萄與產區</div>
                <div className="text-[10px] text-rose-700 font-black mb-2 uppercase tracking-wider">看到這些直接點，保證不澀！</div>
                <ul className="text-sm text-slate-700 font-bold space-y-3 mt-auto border-t border-rose-200 pt-3">
                    <li><span className="text-rose-800 text-base font-black bg-rose-200/50 px-1 rounded">Primitivo</span><br/>南義金芬黛，果醬甜味極高。</li>
                    <li><span className="text-rose-800 text-base font-black bg-rose-200/50 px-1 rounded">Puglia</span><br/>南義大區，盛產無單寧果醬紅酒。</li>
                    <li><span className="text-rose-800 text-base font-black bg-rose-200/50 px-1 rounded">Ripasso</span><br/>帶有櫻桃果乾微甜感的北義酒。</li>
                </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex flex-col h-full">
                <div className="font-black text-amber-900 text-lg mb-1 flex items-center gap-1">📝 看工法與甜度</div>
                <div className="text-[10px] text-amber-700 font-black mb-2 uppercase tracking-wider">印在酒名旁邊的保證書</div>
                <ul className="text-sm text-slate-700 font-bold space-y-3 mt-auto border-t border-amber-200 pt-3">
                    <li><span className="text-amber-800 text-base font-black bg-amber-200/50 px-1 rounded">Appassimento</span><br/>全風乾工法，極度濃郁微甜。</li>
                    <li><span className="text-amber-800 text-base font-black bg-amber-200/50 px-1 rounded">Passito</span><br/>風乾葡萄酒的另一種寫法。</li>
                    <li><span className="text-amber-800 text-base font-black bg-amber-200/50 px-1 rounded">Amabile</span><br/>半甜型，比一般紅酒明顯更甜。</li>
                </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col h-full">
                <div className="font-black text-blue-900 text-lg mb-1 flex items-center gap-1">📖 看小字風味介紹</div>
                <div className="text-[10px] text-blue-700 font-black mb-2 uppercase tracking-wider">若酒單有寫描述，尋找這三個字</div>
                <ul className="text-sm text-slate-700 font-bold space-y-3 mt-auto border-t border-blue-200 pt-3">
                    <li><span className="text-blue-800 text-base font-black bg-blue-200/50 px-1 rounded">Morbido</span><br/>口感柔軟順口，暗示單寧極低。</li>
                    <li><span className="text-blue-800 text-base font-black bg-blue-200/50 px-1 rounded">Fruttato</span><br/>果香豐富，代表加州奔放果味。</li>
                    <li><span className="text-blue-800 text-base font-black bg-blue-200/50 px-1 rounded">Vellutato</span><br/>如天鵝絨般滑順，不苦不澀。</li>
                </ul>
            </div>
        </div>
        <div className="mt-4 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="font-black text-emerald-900 text-base mb-2 flex items-center gap-2"><Wine size={16}/> 點杯數的實戰念法</div>
            <div className="text-sm text-slate-700 font-bold flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <span className="text-emerald-800 font-black">單杯 (Al Calice)：</span><br/>"Un calice di vino rosso, per favore."
                </div>
                <div className="flex-1">
                    <span className="text-emerald-800 font-black">整瓶 (In Bottiglia)：</span><br/>"Una bottiglia, per favore."
                </div>
                <div className="flex-1 text-rose-700">
                    <span className="font-black">⚠️ 避開 House Wine：</span><br/>"Vino della Casa" 通常偏酸且酒體單薄。
                </div>
            </div>
        </div>
    </div>

    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Utensils className="text-blue-600"/> 🍽️ 餐廳實戰：五大情境點酒指南
        </h3>
        <p className="text-sm md:text-base text-slate-700 font-bold mb-4">
            走進餐廳時，直接套用以下的「風味對接系統」，確保每一餐的餐酒搭配都能達到完美平衡：
        </p>
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="font-black text-blue-900 text-lg mb-1 flex items-center gap-2"><Anchor size={18} className="text-blue-600"/> 威尼斯：吃海鮮或墨魚麵</div>
                <div className="text-xs text-rose-600 font-black mb-2">⚠️ 系統警報：重口味紅酒的絕對禁區（會產生生鏽金屬味！）</div>
                <div className="text-sm text-slate-700 font-bold">
                    <span className="text-blue-800 font-black">🍷 怎麼點：</span>尋找白酒 **"Chardonnay (Alto Adige)"** 或 **"Soave Classico Superiore"**，詢問是否有 **"Affinato in Barrique"（橡木桶陳年）**。若非喝紅酒不可，點基礎的 **"Valpolicella Classico"** 並請餐廳 **"leggermente fresco"（稍微冰鎮）**。
                </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="font-black text-amber-900 text-lg mb-1 flex items-center gap-2"><Utensils size={18} className="text-amber-600"/> 佛羅倫斯：一公斤戰斧大牛排</div>
                <div className="text-xs text-amber-700 font-black mb-2">🔥 完美匹配：單寧與油脂的正面對決，直攻超級托斯卡尼</div>
                <div className="text-sm text-slate-700 font-bold">
                    <span className="text-amber-800 font-black">🍷 怎麼點：</span>尋找酒單上的 **"Bolgheri DOC"** 或 **"Toscana IGT"**。滿滿的黑醋栗與香草橡木桶味，完全就是頂級 Napa Cabernet 的靈魂，配牛排爽度極高！
                </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <div className="font-black text-emerald-900 text-lg mb-1 flex items-center gap-2"><MapPin size={18} className="text-emerald-600"/> 羅馬：培根蛋麵或茄汁燉肉麵</div>
                <div className="text-xs text-emerald-700 font-black mb-2">🍝 風味適配：用果香包覆濃郁油脂（羊起司與豬頰肉）</div>
                <div className="text-sm text-slate-700 font-bold">
                    <span className="text-emerald-800 font-black">🍷 怎麼點：</span>尋找南義的 **"Primitivo di Manduria"**。這支酒幾乎沒有澀感，爆棚的藍莓果醬甜味剛好能中和羊起司的鹹味與豬頰肉的油脂，是極度討喜的暴力搭配。
                </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="font-black text-purple-900 text-lg mb-1 flex items-center gap-2"><MapPin size={18} className="text-purple-600"/> 米蘭：番紅花燉飯或燉牛膝</div>
                <div className="text-xs text-purple-700 font-black mb-2">🥩 深度融合：骨髓膠質與陳年醇香的共鳴</div>
                <div className="text-sm text-slate-700 font-bold">
                    <span className="text-purple-800 font-black">🍷 怎麼點：</span>尋找 **"Sforzato di Valtellina DOCG"**。這支 100% 風乾紅酒帶有焦油與濃縮黑棗氣息，宏大結構能完美承載燉牛膝的濃厚膠質，多了一層中藥材複雜香氣。
                </div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <div className="font-black text-rose-900 text-lg mb-1 flex items-center gap-2"><Store size={18} className="text-rose-600"/> 隨性小酒館：披薩與冷肉拼盤</div>
                <div className="text-xs text-rose-700 font-black mb-2">🍕 百搭神兵：高 CP 值的降維打擊</div>
                <div className="text-sm text-slate-700 font-bold">
                    <span className="text-rose-800 font-black">🍷 怎麼點：</span>毫不猶豫點一瓶 **"Valpolicella Ripasso"**。吸收阿瑪羅尼精華，自帶黑巧克力與微甜果香，不搶戲又豐厚，是鎮住整桌家常菜的萬用解答。
                </div>
            </div>
        </div>
    </div>

    <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-700 shadow-lg print-break-inside-avoid">
        <h3 className="text-xl font-black text-amber-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
            <Coffee className="text-amber-500"/> ☕️ 完美收尾：飯後咖啡與消化酒
        </h3>
        <p className="text-sm text-slate-300 font-bold mb-5 leading-relaxed">
            在義大利吃完重口味大餐後，真正的收尾絕對不是甜點，而是透過高濃度咖啡因與高酒精度，瞬間截斷口腔油膩感並加速消化！
        </p>
        
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-black text-emerald-400 mb-2 flex items-center gap-2"><Coffee size={16}/> 第一階段：濃縮咖啡 (Il Caffè)</h4>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-200 font-bold leading-relaxed mb-2">
                        <span className="text-rose-400 font-black">絕對禁忌：</span>飯後不喝卡布奇諾或拿鐵（對他們來說，加牛奶是早餐喝的）。
                    </div>
                    <div className="text-sm text-slate-200 font-bold leading-relaxed mb-2">
                        <span className="text-amber-300 font-black">怎麼點：</span>服務生問「Un caffè?」時，回答 **"Un caffè, per favore."**。端上來的會是標準 Espresso，極度濃稠的 Crema 與黑巧克力厚實感，能瞬間清空滿嘴的牛排與紅酒味。
                    </div>
                    <div className="text-sm text-slate-200 font-bold leading-relaxed">
                        <span className="text-blue-300 font-black">進階點法：</span>點一杯 **Caffè Corretto (校正咖啡)**。加入一小杯 Grappa 烈酒，強烈酒感與深焙咖啡會在食道產生極具張力的燃燒感。
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-black text-emerald-400 mb-2 flex items-center gap-2"><Wine size={16}/> 第二階段：消化酒 (Digestivo)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                        <div className="font-black text-amber-200 text-base mb-1">桶陳白蘭地 (Grappa)</div>
                        <div className="text-xs text-slate-300 font-bold leading-relaxed">
                            <span className="text-amber-400">怎麼點：</span>指定 **"Grappa Invecchiata"** (桶陳版) 或更極致的 **"Grappa di Amarone"**。<br/>
                            <span className="text-amber-400">體驗：</span>像頂級雪莉桶威士忌，帶有深邃的無花果乾、焦糖與香草味，搭配一小塊黑巧克力，是非常具備大將之風的收尾。
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                        <div className="font-black text-emerald-200 text-base mb-1">草本苦酒 (Amaro)</div>
                        <div className="text-xs text-slate-300 font-bold leading-relaxed">
                            <span className="text-emerald-400">怎麼點：</span>北義或羅馬點 **Amaro Nonino**，喜歡濃郁西西里風味點 **Amaro Averna**。<br/>
                            <span className="text-emerald-400">體驗：</span>口感黏稠甜潤，像濃縮中藥香料糖漿。喝下肚後胃部會產生一股溫暖熱流，舒緩吃太飽的腹脹感。
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                        <div className="font-black text-rose-200 text-base mb-1">聖酒與杏仁餅 (Vin Santo)</div>
                        <div className="text-xs text-slate-300 font-bold leading-relaxed">
                            <span className="text-rose-400">怎麼點：</span>跟服務生說 **"Vin Santo con Cantucci"**。<br/>
                            <span className="text-rose-400">體驗：</span>充滿氧化風味、核桃與蜂蜜香的高階甜酒。拿硬邦邦的義大利杏仁餅浸泡吸飽琥珀色酒液後吃，是最完美的傳統甜點。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
);

const LanguageGuideView = () => (
  <div className="p-4 md:p-8 space-y-8 bg-indigo-50 print-break-inside-avoid">
    {/* Header */}
    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg border border-indigo-800">
      <h2 className="text-2xl md:text-3xl font-black mb-2 flex items-center gap-3">
        <MessageCircle className="text-indigo-400" size={32}/>
        實用義大利語空耳大全
      </h2>
      <p className="text-indigo-100 font-medium leading-relaxed">
        在義大利，只要你願意試著說兩句義大利文（就算發音不標準），當地人都會對你展現極大的熱情！這份空耳小抄專為「拉近距離、順利點餐、討人喜歡」設計。
      </p>
    </div>

    {/* Section 1: 打招呼與禮貌 */}
    <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-indigo-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Smile className="text-indigo-600"/> 👋 拉近距離必備：打招呼與禮貌
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="text-xs text-indigo-500 font-black mb-1 uppercase tracking-wider">早安 / 您好 (白天用)</div>
                <div className="font-black text-indigo-900 text-xl mb-1">Buongiorno</div>
                <div className="text-indigo-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 崩酒諾</div>
                <div className="text-sm text-slate-700 font-bold border-t border-indigo-200 pt-2">走進餐廳、商店、進飯店大廳時必說！</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="text-xs text-indigo-500 font-black mb-1 uppercase tracking-wider">晚安 (傍晚/晚上用)</div>
                <div className="font-black text-indigo-900 text-xl mb-1">Buonasera</div>
                <div className="text-indigo-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 波納歇拉</div>
                <div className="text-sm text-slate-700 font-bold border-t border-indigo-200 pt-2">晚餐走進餐廳時說這句，氣質滿分。</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="text-xs text-indigo-500 font-black mb-1 uppercase tracking-wider">謝謝</div>
                <div className="font-black text-indigo-900 text-xl mb-1">Grazie</div>
                <div className="text-indigo-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 葛拉濟耶</div>
                <div className="text-sm text-slate-700 font-bold border-t border-indigo-200 pt-2">隨時掛在嘴邊，店員會對你更好。</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="text-xs text-indigo-500 font-black mb-1 uppercase tracking-wider">不客氣 / 請進 / 給你</div>
                <div className="font-black text-indigo-900 text-xl mb-1">Prego</div>
                <div className="text-indigo-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 普雷狗</div>
                <div className="text-sm text-slate-700 font-bold border-t border-indigo-200 pt-2">萬用字！服務生遞菜給你時也會說。</div>
            </div>
        </div>
    </div>

    {/* Section 2: 點餐與結帳 */}
    <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-amber-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Utensils className="text-amber-600"/> 🍝 吃貨必備：點餐與結帳
        </h3>
        <div className="space-y-4">
            <div className="flex items-start gap-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="bg-amber-200 p-2 rounded-full mt-1"><Coffee className="text-amber-700" size={20}/></div>
                <div className="flex-1">
                    <div className="text-xs text-amber-700 font-black mb-1 uppercase tracking-wider">我想要... (萬用開頭)</div>
                    <div className="font-black text-amber-900 text-xl mb-1">Vorrei...</div>
                    <div className="text-amber-800 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 波蕾伊...</div>
                    <div className="text-sm text-slate-700 font-bold">點餐神句。指著菜單說 <span className="text-amber-900 bg-amber-200/50 px-1 rounded">Vorrei questo (波蕾伊 潰斯偷)</span> 就是「我想要這個」。</div>
                </div>
            </div>
            <div className="flex items-start gap-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="bg-amber-200 p-2 rounded-full mt-1"><Banknote className="text-amber-700" size={20}/></div>
                <div className="flex-1">
                    <div className="text-xs text-amber-700 font-black mb-1 uppercase tracking-wider">請買單 / 結帳</div>
                    <div className="font-black text-amber-900 text-xl mb-1">Il conto, per favore</div>
                    <div className="text-amber-800 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 伊爾 控偷，配爾 法波雷</div>
                    <div className="text-sm text-slate-700 font-bold">在義大利要在座位上結帳，招手說這句即可。</div>
                </div>
            </div>
            <div className="flex items-start gap-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="bg-amber-200 p-2 rounded-full mt-1"><Info className="text-amber-700" size={20}/></div>
                <div className="flex-1">
                    <div className="text-xs text-amber-700 font-black mb-1 uppercase tracking-wider">要點水嗎？</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-white p-3 rounded border border-amber-200">
                            <span className="font-black text-blue-800">Acqua Naturale</span> (阿瓜 拿土拉雷)<br/>
                            <span className="text-sm text-slate-600 font-bold">沒有氣的礦泉水</span>
                        </div>
                        <div className="bg-white p-3 rounded border border-amber-200">
                            <span className="font-black text-emerald-800">Acqua Frizzante</span> (阿瓜 芙莉讚鐵)<br/>
                            <span className="text-sm text-slate-600 font-bold">氣泡水 (解膩神器)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Section 3: 讚美與聊天 */}
    <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-rose-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Heart className="text-rose-600"/> 💖 讓店員超愛你：讚美與驚嘆
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex flex-col h-full">
                <div className="text-[10px] text-rose-500 font-black mb-1 uppercase tracking-wider">太好吃了！</div>
                <div className="font-black text-rose-900 text-xl mb-1">Buonissimo!</div>
                <div className="text-rose-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 波你西摸！</div>
                <div className="text-sm text-slate-700 font-bold mt-auto border-t border-rose-200 pt-2">當主廚或服務生問餐點好不好吃時，用誇張的表情說這句！</div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex flex-col h-full">
                <div className="text-[10px] text-rose-500 font-black mb-1 uppercase tracking-wider">完美！</div>
                <div className="font-black text-rose-900 text-xl mb-1">Perfetto!</div>
                <div className="text-rose-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 佩爾費偷！</div>
                <div className="text-sm text-slate-700 font-bold mt-auto border-t border-rose-200 pt-2">結帳、確認餐點、或表達滿意時的超好用字。</div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex flex-col h-full">
                <div className="text-[10px] text-rose-500 font-black mb-1 uppercase tracking-wider">乾杯！</div>
                <div className="font-black text-rose-900 text-xl mb-1">Cin Cin!</div>
                <div className="text-rose-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 親 親！</div>
                <div className="text-sm text-slate-700 font-bold mt-auto border-t border-rose-200 pt-2">拿著超棒的 Amarone 敲杯時，絕對要說這句。</div>
            </div>
        </div>
    </div>

    {/* Section 4: 實用求生 */}
    <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-emerald-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Compass className="text-emerald-600"/> 🧭 實用求生句
        </h3>
        <div className="space-y-3">
            <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <div>
                    <div className="font-black text-emerald-900 text-lg">Dov'è il bagno?</div>
                    <div className="text-sm text-slate-600 font-bold">洗手間在哪裡？</div>
                </div>
                <div className="text-emerald-700 font-bold text-base flex items-center gap-1"><Volume2 size={14}/> 兜杯 伊爾 巴紐？</div>
            </div>
            <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <div>
                    <div className="font-black text-emerald-900 text-lg">Quanto costa?</div>
                    <div className="text-sm text-slate-600 font-bold">這個多少錢？</div>
                </div>
                <div className="text-emerald-700 font-bold text-base flex items-center gap-1"><Volume2 size={14}/> 寬偷 扣斯塔？</div>
            </div>
            <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <div>
                    <div className="font-black text-emerald-900 text-lg">Scusa</div>
                    <div className="text-sm text-slate-600 font-bold">不好意思 / 借過</div>
                </div>
                <div className="text-emerald-700 font-bold text-base flex items-center gap-1"><Volume2 size={14}/> 斯估渣</div>
            </div>
        </div>
    </div>
  </div>
);

const FoodGuideView = () => (
  <div className="p-4 md:p-8 space-y-8 bg-orange-50 print-break-inside-avoid">
    <div className="bg-orange-900 text-white p-6 rounded-xl shadow-lg border border-orange-800">
      <h2 className="text-2xl md:text-3xl font-black mb-2 flex items-center gap-3">
        <Utensils className="text-orange-400" size={32}/>
        三大名城：必吃傳統美食與甜點
      </h2>
      <p className="text-orange-100 font-medium leading-relaxed">
        不想每餐都上館子？這份地圖收錄了羅馬、佛羅倫斯、威尼斯最具代表性的「邊走邊吃」平民美食、傳統糕點與咖啡甜點。照著空耳點，讓你像個真正的在地人。
      </p>
    </div>

    {/* Venice */}
    <div className="bg-white p-6 rounded-xl border border-cyan-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-cyan-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Anchor className="text-cyan-600"/> 🎭 威尼斯 (Venezia) 必吃：水都的隨性小點
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
                <div className="text-xs text-cyan-600 font-black mb-1 uppercase tracking-wider">威尼斯靈魂小菜</div>
                <div className="font-black text-cyan-900 text-xl mb-1">Cicchetti</div>
                <div className="text-cyan-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 齊給滴</div>
                <div className="text-sm text-slate-700 font-bold border-t border-cyan-200 pt-2">
                    威尼斯版 Tapas，通常放在小塊麵包上。走進 Bacaro (小酒館) 必點：<br/>
                    <span className="text-cyan-800 font-black bg-cyan-200/50 px-1 rounded mt-1 inline-block">"Baccalà Mantecato" (巴卡拉 曼鐵卡偷)</span>：超綿密鱈魚泥！
                </div>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
                <div className="text-xs text-cyan-600 font-black mb-1 uppercase tracking-wider">威尼斯發明 / 國民甜點</div>
                <div className="font-black text-cyan-900 text-xl mb-1">Tiramisù</div>
                <div className="text-cyan-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 提拉米蘇</div>
                <div className="text-sm text-slate-700 font-bold border-t border-cyan-200 pt-2">
                    威尼托大區是提拉米蘇的發源地！這裡的作法非常傳統，咖啡與馬斯卡彭起司的比例極度完美，酒香濃郁。
                </div>
            </div>
        </div>
    </div>

    {/* Florence */}
    <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-rose-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Store className="text-rose-600"/> ⚜️ 佛羅倫斯 (Firenze) 必吃：粗獷與優雅的結合
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <div className="text-xs text-rose-600 font-black mb-1 uppercase tracking-wider">托斯卡尼國民神餅</div>
                <div className="font-black text-rose-900 text-xl mb-1">Schiacciata</div>
                <div className="text-rose-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 斯恰洽踏</div>
                <div className="text-sm text-slate-700 font-bold border-t border-rose-200 pt-2">
                    超酥脆的烤薄餅！佛羅倫斯排隊名店 All'Antico Vinaio 就是用它夾滿開心果火腿 <span className="text-rose-800 font-black bg-rose-200/50 px-1 rounded">"Mortadella" (摸塔爹拉)</span>。
                </div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <div className="text-xs text-rose-600 font-black mb-1 uppercase tracking-wider">必吃硬漢甜點</div>
                <div className="font-black text-rose-900 text-xl mb-1">Cantucci</div>
                <div className="text-rose-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 坎兔奇 (杏仁脆餅)</div>
                <div className="text-sm text-slate-700 font-bold border-t border-rose-200 pt-2">
                    硬邦邦的杏仁餅。正確吃法是點一杯甜酒 <span className="text-rose-800 font-black bg-rose-200/50 px-1 rounded">"Vin Santo" (賓 桑偷)</span>，把餅乾泡軟後再吃！
                </div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 md:col-span-2">
                <div className="text-xs text-rose-600 font-black mb-1 uppercase tracking-wider">朝聖現代義式冰淇淋發源地</div>
                <div className="font-black text-rose-900 text-xl mb-1">Gelato Artigianale</div>
                <div className="text-rose-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 傑拉頭 阿提加納雷</div>
                <div className="text-sm text-slate-700 font-bold border-t border-rose-200 pt-2">
                    走進冰店請直接點這兩個無敵口味：<br/>
                    1. <span className="text-rose-800 font-black bg-rose-200/50 px-1 rounded">"Pistacchio" (匹斯踏秋)</span>：開心果口味，要挑土黃偏綠的才是真材實料。<br/>
                    2. <span className="text-rose-800 font-black bg-rose-200/50 px-1 rounded">"Nocciola" (諾丘拉)</span>：榛果口味，比巧克力還要濃郁香甜！
                </div>
            </div>
        </div>
    </div>

    {/* Rome */}
    <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm print-break-inside-avoid">
        <h3 className="text-xl font-black text-amber-900 mb-4 flex items-center gap-2 border-b pb-2">
            <MapPin className="text-amber-600"/> 🏛️ 羅馬 (Roma) 必吃：最罪惡的高熱量享受
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="text-xs text-amber-600 font-black mb-1 uppercase tracking-wider">羅馬人最愛的邪惡早餐</div>
                <div className="font-black text-amber-900 text-xl mb-1">Maritozzo</div>
                <div className="text-amber-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 馬里偷佐</div>
                <div className="text-sm text-slate-700 font-bold border-t border-amber-200 pt-2">
                    剖半的布里歐軟麵包，裡面塞入爆量的鮮奶油 (Panna)。配上一杯拿鐵或是卡布奇諾，是羅馬最道地的甜蜜早晨。
                </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="text-xs text-amber-600 font-black mb-1 uppercase tracking-wider">羅馬街頭炸物之王</div>
                <div className="font-black text-amber-900 text-xl mb-1">Supplì</div>
                <div className="text-amber-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 蘇普里</div>
                <div className="text-sm text-slate-700 font-bold border-t border-amber-200 pt-2">
                    羅馬版炸飯糰！番茄肉醬燉飯包住起司炸到酥脆。趁熱拔開會有長長牽絲（全名叫「電話線炸飯糰」）。
                </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 md:col-span-2">
                <div className="text-xs text-amber-600 font-black mb-1 uppercase tracking-wider">猶太區千年名菜</div>
                <div className="font-black text-amber-900 text-xl mb-1">Carciofi alla Giudia</div>
                <div className="text-amber-700 font-bold text-lg mb-2 flex items-center gap-2"><Volume2 size={16}/> 卡爾丘菲 阿拉 糾迪亞</div>
                <div className="text-sm text-slate-700 font-bold border-t border-amber-200 pt-2">
                    羅馬猶太區特產「油炸朝鮮薊」。整朵洋薊下鍋高溫油炸，像一朵盛開的金黃色向日葵，葉片吃起來像洋芋片般酥脆！
                </div>
            </div>
        </div>
    </div>
  </div>
);

const TabButton = ({ id, label, active, set, color }) => {
  const colors = {
    emerald: active === id ? 'text-emerald-700 border-emerald-300 bg-emerald-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/40',
    blue: active === id ? 'text-blue-700 border-blue-300 bg-blue-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50/40',
    amber: active === id ? 'text-amber-700 border-amber-300 bg-amber-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-amber-700 hover:border-amber-200 hover:bg-amber-50/40',
    rose: active === id ? 'text-rose-700 border-rose-300 bg-rose-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50/40',
    indigo: active === id ? 'text-indigo-700 border-indigo-300 bg-indigo-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50/40',
    yellow: active === id ? 'text-yellow-700 border-yellow-300 bg-yellow-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-yellow-700 hover:border-yellow-200 hover:bg-yellow-50/40',
    purple: active === id ? 'text-purple-700 border-purple-300 bg-purple-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-purple-700 hover:border-purple-200 hover:bg-purple-50/40',
    red: active === id ? 'text-red-700 border-red-300 bg-red-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-red-700 hover:border-red-200 hover:bg-red-50/40',
    cyan: active === id ? 'text-cyan-700 border-cyan-300 bg-cyan-50 shadow-sm' : 'text-slate-600 border-slate-200 bg-white hover:text-cyan-700 hover:border-cyan-200 hover:bg-cyan-50/40',
  };

  return (
    <button 
      onClick={() => set(id)}
      className={`relative px-4 py-3 font-semibold md:font-black text-[14px] md:text-sm leading-normal transition-all whitespace-nowrap rounded-xl border min-h-[48px] ${colors[color]}`}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={`absolute left-3 right-3 bottom-1 h-0.5 rounded-full transition-all duration-300 ${
          active === id ? 'opacity-100 scale-x-100 bg-current' : 'opacity-0 scale-x-0 bg-current'
        }`}
      />
    </button>
  );
};

const CheckItem = ({ item, desc }) => (
  <li className="flex gap-3 items-start">
    <div className="mt-1 text-emerald-500 shrink-0"><CheckCircle size={18}/></div>
    <div>
      <div className="text-sm font-black text-slate-800">{item}</div>
      <div className="text-xs font-bold text-slate-600 mt-1 leading-[1.6] tracking-wide md:tracking-normal">{desc}</div>
    </div>
  </li>
);