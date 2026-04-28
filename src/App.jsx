import React, { useEffect, useState } from 'react';
import { 
  Plane, Train, MapPin, Camera, Sunrise, Copy, Printer, Check, 
  Navigation, Shield, Ban, Globe, CreditCard, Banknote, 
  Bed, Utensils, Clock, Ticket, Info, ShoppingCart, Users, Wallet, DollarSign, Calculator, 
  CheckCircle, ShieldAlert, Umbrella, Store, AlertOctagon, Car, BookOpen, Anchor, Bus,
  AlertTriangle, PhoneCall, FileText, CheckCircle2, ShoppingBag, QrCode,
  Maximize2, Minimize2, ChevronUp, ChevronDown, Hotel, Compass, Eye, Coffee,
  Languages, Volume2, Droplets, MapPinned, Smartphone, Download, Map
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [copied, setCopied] = useState(false);
  const [isPerPerson, setIsPerPerson] = useState(false); // 完美回歸：單人花費切換狀態
  const [exchangeRate] = useState(35.5);
  const [actionMessage, setActionMessage] = useState(""); 

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

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-6 font-sans text-slate-800 print:bg-white print:p-0">
      
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
      <div className="max-w-5xl mx-auto mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              🇮🇹 義大利 2026 家族壯遊手冊
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase rounded font-black border border-emerald-200 tracking-wider">完美排版列印</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] uppercase rounded font-black border border-blue-200 tracking-wider">體力調節優化</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] uppercase rounded font-black border border-purple-200 tracking-wider">長輩防護升級</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCopy} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition flex items-center gap-2">
              {copied ? <CheckCircle2 size={16} className="text-emerald-600"/> : <Copy size={16}/>}
              {copied ? "已複製" : "分享連結"}
            </button>
            <button onClick={handlePrint} className="px-5 py-2 bg-[#1E293B] hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow transition flex items-center gap-2">
              <Printer size={16} /> 列印成手冊
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex mt-6 border-b border-slate-200 overflow-x-auto pb-1 gap-1">
          <TabButton id="itinerary" label="🗓️ 每日行程" active={activeTab} set={setActiveTab} color="blue" />
          <TabButton id="survival" label="🗣️ 語言與求救" active={activeTab} set={setActiveTab} color="purple" />
          <TabButton id="emergency" label="🚨 緊急卡片" active={activeTab} set={setActiveTab} color="red" />
          <TabButton id="packing" label="🧳 行李與藥品" active={activeTab} set={setActiveTab} color="cyan" />
          <TabButton id="budget" label="💰 雙軌財務" active={activeTab} set={setActiveTab} color="emerald" />
          <TabButton id="reservation" label="🎫 劃位與車票" active={activeTab} set={setActiveTab} color="indigo" />
          <TabButton id="venice" label="🔳 威尼斯入城碼" active={activeTab} set={setActiveTab} color="yellow" />
          <TabButton id="shopping" label="🛒 必買伴手禮" active={activeTab} set={setActiveTab} color="amber" />
          <TabButton id="todo" label="🛡️ 待辦與防護" active={activeTab} set={setActiveTab} color="rose" />
        </div>
      </div>

      {/* Main Content Area */}
      <div id="printable-content" className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-visible min-h-[800px] print:shadow-none print:border-none print:bg-transparent">
        
        <div className={activeTab === 'itinerary' ? 'block' : 'hidden print-tab-content'}>
            <ItineraryView />
        </div>

        <div className={`page-break-before ${activeTab === 'survival' ? 'block' : 'hidden print-tab-content'}`}>
            <SurvivalGuideView />
        </div>

        <div className={`page-break-before ${activeTab === 'emergency' ? 'block' : 'hidden print-tab-content'}`}>
          <EmergencyCardView />
        </div>

        <div className={`page-break-before ${activeTab === 'packing' ? 'block' : 'hidden print-tab-content'}`}>
          <PackingChecklistView />
        </div>

        <div className={`page-break-before ${activeTab === 'budget' ? 'block' : 'hidden print-tab-content'}`}>
            <BudgetView rate={exchangeRate} items={budgetItems} isPer={isPerPerson} setIsPer={setIsPerPerson} />
        </div>

        <div className={`page-break-before ${activeTab === 'reservation' ? 'block' : 'hidden print-tab-content'}`}>
            <ReservationListView />
        </div>

        <div className={`page-break-before ${activeTab === 'venice' ? 'block' : 'hidden print-tab-content'}`}>
          <VeniceQrView />
        </div>

        <div className={`page-break-before ${activeTab === 'shopping' ? 'block' : 'hidden print-tab-content'}`}>
            <ShoppingGuideView />
        </div>

        <div className={`page-break-before ${activeTab === 'todo' ? 'block' : 'hidden print-tab-content'}`}>
            <TodoGuideView />
        </div>

      </div>
    </div>
  );
}

// ==========================================
// Tab: 語言與求救 View (長輩專用)
// ==========================================
const SurvivalGuideView = () => {
    const phrases = [
        { tw: "廁所在哪裡？", it: "Dov'è la toilette?", sound: "多-吠 拉 托雷特", icon: "🚽" },
        { tw: "可以結帳嗎？", it: "Il conto, per favore.", sound: "伊 康偷，沛 罰波雷", icon: "💳" },
        { tw: "無氣泡水", it: "Acqua naturale.", sound: "阿誇 納圖拉雷", icon: "💧" },
        { tw: "請給我熱水", it: "Acqua calda, per favore.", sound: "阿誇 卡達，沛 罰波雷", icon: "🍵" },
        { tw: "謝謝！", it: "Grazie!", sound: "葛拉-記-耶", icon: "🙏" },
        { tw: "救命 / 幫幫我", it: "Aiuto!", sound: "阿-優-偷", icon: "🆘" }
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 bg-purple-50 print-break-inside-avoid">
            {/* 手指義大利語 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 print-break-inside-avoid">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
                    <Languages className="text-blue-500"/> 手指義大利語 (點餐/如廁必備)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phrases.map((p, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="text-3xl shrink-0">{p.icon}</div>
                            <div>
                                <div className="font-black text-slate-800 text-lg">{p.tw}</div>
                                <div className="font-bold text-blue-600 text-lg mt-1">{p.it}</div>
                                <div className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                                    <Volume2 size={12}/> 中文發音：{p.sound}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

              {/* 退稅流程與句子 */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-amber-200 print-break-inside-avoid">
                <h3 className="text-xl font-black text-amber-900 mb-6 flex items-center gap-2 border-b border-amber-100 pb-3">
                  <ShoppingBag className="text-amber-600"/> 退稅流程與一句話
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Tax Free Steps</div>
                    <ol className="list-decimal pl-5 text-sm text-amber-900 space-y-2 font-bold">
                      <li>結帳前先問是否可退稅</li>
                      <li>出示護照，店家開立退稅單</li>
                      <li>離境前到海關蓋章 (Customs)</li>
                      <li>到退稅櫃檯/機台退現金或刷回卡</li>
                    </ol>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">How To Ask</div>
                    <ul className="text-sm text-slate-700 space-y-3 font-bold">
                            <li><strong className="text-slate-900">可以退稅嗎？</strong><br/>Italiano: <span className="text-amber-700">Posso fare il Tax Free?</span><br/>English: <span className="text-amber-700">Can I do tax free?</span></li>
                            <li><strong className="text-slate-900">我是非歐盟旅客，請幫我開退稅單。</strong><br/>Italiano: <span className="text-amber-700">Sono un turista extra-UE, mi fa il modulo Tax Free?</span><br/>English: <span className="text-amber-700">I am a non-EU tourist. Can you issue the tax-free form?</span></li>
                            <li><strong className="text-slate-900">請國籍填「Taiwan」，不要寫「China」。</strong><br/>Italiano: <span className="text-amber-700">Per favore, scriva "Taiwan" come nazionalita, non "China".</span><br/>English: <span className="text-amber-700">Please write "Taiwan" as nationality, not "China".</span></li>
                            <li><strong className="text-slate-900">海關蓋章在哪？</strong><br/>Italiano: <span className="text-amber-700">Dove si fa il timbro doganale?</span><br/>English: <span className="text-amber-700">Where can I get the customs stamp?</span></li>
                    </ul>
                  </div>
                </div>
              </div>

            {/* 文化防雷包 */}
            <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg text-white print-break-inside-avoid">
                <h3 className="text-xl font-black text-amber-400 mb-6 flex items-center gap-2 border-b border-slate-600 pb-3">
                    <AlertTriangle className="text-amber-500"/> 文化衝擊防雷包 (長輩請先看)
                </h3>
                <div className="space-y-4">
                    <div className="bg-slate-700/50 p-4 rounded-xl flex gap-3 items-start">
                        <Droplets className="text-blue-300 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-black text-white text-base">馬桶旁邊的「矮水槽」是洗屁股的！</div>
                            <div className="text-sm text-slate-300 mt-1 leading-relaxed">義大利飯店浴室通常有兩個類似馬桶的東西。沒有蓋子、有水龍頭的叫做 Bidet (洗下身盆)。<strong className="text-rose-300">千萬不要拿來洗臉或洗水果喔！</strong></div>
                        </div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-xl flex gap-3 items-start">
                        <Coffee className="text-amber-300 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-black text-white text-base">餐廳沒有「免費熱水」</div>
                            <div className="text-sm text-slate-300 mt-1 leading-relaxed">義大利人沒有喝熱水的習慣。餐廳的水都是一瓶瓶賣的。如果需要吃藥或習慣喝熱水，<strong className="text-amber-300">請每天早上用飯店的快煮壺裝滿保溫瓶帶出門</strong>。</div>
                        </div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-xl flex gap-3 items-start">
                        <Banknote className="text-emerald-300 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-black text-white text-base">不用給小費，帳單已含「桌費」</div>
                            <div className="text-sm text-slate-300 mt-1 leading-relaxed">坐下來吃飯時，帳單通常會多收一筆「Coperto (桌費/麵包費)」，大約每人 2-4 歐元。這是正常的，因此吃完後<strong className="text-emerald-300">不用另外留小費在桌上</strong>。</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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

    const mapGroups = [
      {
        title: "飯店",
        items: hotels.map((hotel) => ({ label: hotel.name, query: hotel.address, url: hotel.mapUrl })),
      },
    ];

    return (
      <div className="p-4 md:p-8 space-y-8 bg-red-50 print-break-inside-avoid">
        <div className="text-center pb-2 border-b border-red-200">
          <h1 className="text-3xl font-black text-red-900 mb-2">🚨 緊急卡片與離線備援</h1>
          <p className="text-red-700 text-xs uppercase tracking-[0.2em] font-black">Emergency Ready</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-t-8 border-red-500 overflow-hidden print-break-inside-avoid">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-black text-red-900 mb-2 flex items-center gap-2">
              <MapPinned className="text-red-500"/> 防走失「帶我回飯店」卡
            </h2>
            <p className="text-red-700 text-sm font-bold mb-6">
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
                <div className="text-xl md:text-2xl font-black text-red-600 mb-2">{selectedHotel.name}</div>
                <div className="text-lg md:text-xl font-bold text-slate-800 leading-snug">{selectedHotel.address}</div>
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
            <div key={contact.label} className="bg-white border border-red-100 p-4 rounded-xl shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{contact.label}</div>
              <div className="text-xl font-black text-red-600 mt-1">{contact.value}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{contact.note}</div>
            </div>
          ))}
        </div>

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

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print-break-inside-avoid">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <Map className="text-blue-500" /> 地圖捷徑
          </h3>
          <div className="space-y-4">
            {mapGroups.map((group) => (
              <div key={group.title}>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{group.title}</div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <a
                      key={item.label}
                      href={buildMapUrl(item)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-black border border-blue-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
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
        <div className="text-center pb-2 border-b border-cyan-200">
          <h1 className="text-3xl font-black text-cyan-900 mb-2">🧳 行李與藥品清單</h1>
          <p className="text-cyan-700 text-xs uppercase tracking-[0.2em] font-black">Packing & Daily Refill</p>
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

        <div className="bg-slate-900 text-white p-5 rounded-2xl text-xs font-bold flex items-center gap-3 print-break-inside-avoid">
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

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50 print-break-inside-avoid">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4 no-print">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Calculator className="text-emerald-600"/> 雙軌財務總管
                    </h2>
                    <p className="text-slate-500 text-xs font-bold mt-1">
                        核心花費已鎖定，精確區分「已付款」與「待預訂」。
                    </p>
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
                        <div className="text-3xl font-black mb-1">NT$ {dispPaid.toLocaleString()}</div>
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
                        <div className="text-3xl font-black mb-1">€ {dispPayLaterEur.toLocaleString()}</div>
                        <div className="text-xs font-bold text-orange-100">約 NT$ {dispPayLaterTwd.toLocaleString()} (含日常餐飲)</div>
                    </div>
                    <Wallet size={80} className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4" />
                </div>

                <div className="bg-[#1E293B] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden print-break-inside-avoid">
                    <div className="relative z-10">
                        <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Calculator size={12}/> {isPer ? "GRAND TOTAL (單人總預估)" : "GRAND TOTAL (家族總預估)"}
                        </div>
                        <div className="text-4xl font-black mb-1">NT$ {dispGrandTotal.toLocaleString()}</div>
                        <div className="text-xs font-bold text-slate-400">已付 + 待訂 + 當地預估花費</div>
                    </div>
                    <DollarSign size={100} className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4" />
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
        
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border-2 border-indigo-200 shadow-sm print-break-inside-avoid">
            <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="text-amber-500" /> 🚨 義大利高鐵搭乘 3 大鐵則
            </h3>
            <ul className="text-sm text-slate-700 space-y-3 font-bold">
                <li className="flex gap-2 items-start"><span className="text-indigo-600">1.</span> <div><strong>免紙本打票：</strong>我們買的都是對號座高鐵(Frecciarossa/Italo)，不需要找黃色打票機。查票時手機出示電子票 QR Code 即可。</div></li>
                <li className="flex gap-2 items-start"><span className="text-indigo-600">2.</span> <div><strong>看懂電子看板：</strong>義大利火車只會在「發車前 10-15 分鐘」才會在電子大看板顯示月台號碼 (<span className="bg-indigo-100 text-indigo-800 px-1 rounded">Binario</span>)。請提早抵達大廳盯著螢幕。</div></li>
                <li className="flex gap-2 items-start"><span className="text-indigo-600">3.</span> <div><strong>行李上鎖戰略：</strong>長輩坐位子上看不到車廂前後的公共行李架。上車後請務必用大創買的「自行車鋼絲鎖」把三個行李跟鐵桿鎖在一起！</div></li>
            </ul>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center pb-4">
                <h1 className="text-3xl font-black text-indigo-900 mb-2">🎫 正式車票與憑證清單</h1>
                <p className="text-indigo-600/80 text-xs uppercase tracking-[0.2em] font-black">Official Tickets & Reservations</p>
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

    const dailyChecklistItems = [
      { id: "checkin", label: "退房 / 入住確認" },
      { id: "transit", label: "車站 / 交通確認" },
      { id: "tickets", label: "門票 / 預約確認" },
      { id: "gear", label: "備品：插座 / 鋼絲鎖 / 常備藥" },
    ];

    const checklistStorageKey = "italy-handbook-daily-checklist-v1";
    const buildInitialChecklist = () => {
      return ItineraryData.reduce((acc, day) => {
        acc[day.day] = dailyChecklistItems.reduce((items, item) => {
          items[item.id] = false;
          return items;
        }, {});
        return acc;
      }, {});
    };

    const [checklistByDay, setChecklistByDay] = useState(() => {
      if (typeof window === "undefined") return buildInitialChecklist();
      try {
        const saved = JSON.parse(localStorage.getItem(checklistStorageKey));
        if (saved) return saved;
      } catch (err) {
        return buildInitialChecklist();
      }
      return buildInitialChecklist();
    });

    useEffect(() => {
      if (typeof window === "undefined") return;
      localStorage.setItem(checklistStorageKey, JSON.stringify(checklistByDay));
    }, [checklistByDay]);

    const toggleChecklistItem = (day, itemId) => {
      setChecklistByDay((prev) => {
        const currentDay = prev?.[day] || {};
        return {
          ...prev,
          [day]: {
            ...currentDay,
            [itemId]: !currentDay[itemId],
          },
        };
      });
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC]">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-lg mb-8 relative print-break-inside-avoid">
              <div className="text-slate-300 text-xs font-black tracking-widest mb-2 uppercase">Time-Blocked Itinerary</div>
              <h1 className="text-3xl font-black mb-2">義大利 15 天家族壯遊</h1>
              <p className="text-slate-200 text-sm font-bold">2026.06.12 (Fri) - 06.26 (Fri) · 五漁村破解版 · 尊榮長輩版</p>
              
              <div className="absolute top-6 right-6 flex gap-2 no-print">
                 <button onClick={expandAll} className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Maximize2 size={14}/> 展開全部</button>
                 <button onClick={collapseAll} className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Minimize2 size={14}/> 摺疊全部</button>
              </div>
            </div>

            <div className="space-y-4">
              {ItineraryData.map((d) => {
                const isExpanded = expandedDays.includes(d.day);
                return (
                <div key={d.day} className={`bg-white rounded-2xl transition-all duration-300 overflow-hidden border print-break-inside-avoid ${isExpanded ? 'border-blue-400 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                  
                  <button onClick={() => toggleDay(d.day)} className="w-full px-6 py-5 flex items-center justify-between text-left print:pointer-events-none">
                    <div className="flex items-center gap-5 w-full">
                      <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-black transition-colors shrink-0 ${isExpanded ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                        <span className="text-[10px] uppercase leading-none mb-1">Day</span>
                        <span className="text-2xl leading-none">{d.day}</span>
                      </div>
                      <div className="flex-1 pr-4">
                        <h3 className="font-black text-slate-800 text-base">{d.city}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-[11px] text-slate-400 font-black uppercase tracking-wider">{d.date}</p>
                          {d.hotel && (
                            <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold border ${isExpanded ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
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

                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 print-break-inside-avoid">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">今日 Checklist</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {dailyChecklistItems.map((item) => {
                            const checked = !!checklistByDay?.[d.day]?.[item.id];
                            return (
                              <label
                                key={item.id}
                                className={`flex items-center gap-2 text-xs font-bold rounded-lg border px-3 py-2 transition ${
                                  checked
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 line-through"
                                    : "bg-slate-50 border-slate-200 text-slate-700"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleChecklistItem(d.day, item.id)}
                                  className="accent-emerald-600"
                                />
                                {item.label}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6 px-2 relative">
                      <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                      
                      {d.events.map((e, i) => {
                        let iconBg = "bg-white border-slate-200 text-slate-400";
                        let textColor = "text-slate-600 font-medium";
                        if (e.type === 'highlight') {
                          iconBg = "bg-amber-100 border-amber-300 text-amber-600 shadow-sm z-10";
                          textColor = "text-slate-900 font-black";
                        } else if (e.type === 'transit') {
                          iconBg = "bg-blue-50 border-blue-200 text-blue-500 z-10";
                          textColor = "text-slate-700 font-bold";
                        } else if (e.type === 'leisure') {
                          iconBg = "bg-emerald-50 border-emerald-200 text-emerald-500 z-10";
                          textColor = "text-slate-700 font-bold";
                        } else {
                          iconBg = "bg-white border-slate-200 text-slate-400 z-10";
                        }

                        return (
                          <div key={i} className="flex gap-5 relative print-break-inside-avoid">
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white ${iconBg}`}>
                              {React.cloneElement(e.icon, { size: 20 })}
                            </div>
                            <div className="flex-1 pt-2 pb-2">
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
            <FileText className="text-blue-500"/> 出發前必備行政文件
        </h3>
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
            <div className="text-sm font-black text-blue-900 mb-3 flex items-center gap-2">
               <QrCode className="text-blue-500" size={18}/> 威尼斯入城費 (Access Fee) 免繳申請
            </div>
            <ul className="text-xs text-blue-800 space-y-3 list-none font-bold">
                <li className="flex gap-2 items-start"><Info className="text-blue-400 shrink-0 mt-0.5" size={14}/> <span>我們住在威尼斯本島，已含城市稅，因此**完全免繳**入城費，但「必須」事先上網申請豁免 QR Code 備查。</span></li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={14}/> <span>請至官網 (cda.ve.it/en/) 選擇「I am a guest in an accommodation facility located in the Municipality of Venice」。</span></li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={14}/> <span>輸入入住日期與飯店名稱 (Hotel Principe)，取得全家人的免繳 QR Code 截圖存在手機裡。</span></li>
            </ul>
        </div>
    </section>

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
        <h1 className="text-3xl font-black text-amber-900 mb-2">🔳 威尼斯入城費豁免 QR Code</h1>
        <p className="text-amber-700 text-xs uppercase tracking-[0.2em] font-black">Access Fee Exemption</p>
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
                <div className="text-lg font-black text-slate-800 mt-1">{item.fullName}</div>
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
                  className="w-40 h-40 object-contain border border-slate-200 rounded-xl p-2 bg-white"
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
// Tab: Shopping Guide 
// ==========================================
const ShoppingGuideView = () => (
  <div className="p-4 md:p-8 space-y-8 bg-[#FFFBF0] print-break-inside-avoid">
    <div className="text-center pb-2 border-b border-amber-200">
      <h1 className="text-3xl font-black text-amber-900 mb-2">🛒 義大利必買伴手禮圖鑑</h1>
      <p className="text-amber-700 text-xs uppercase tracking-[0.2em] font-black">Supermarket & Specialty Shopping</p>
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
        <p className="text-sm text-slate-700 font-bold mb-4">依據「預算與用途」，我們分為兩個戰場：</p>
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
  </div>
);

// --- Components ---

const TabButton = ({ id, label, active, set, color }) => {
  const colors = {
    emerald: active === id ? 'text-emerald-700 border-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-emerald-600',
    blue: active === id ? 'text-blue-700 border-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600',
    amber: active === id ? 'text-amber-700 border-amber-500 bg-amber-50' : 'text-slate-500 hover:text-amber-600',
    rose: active === id ? 'text-rose-700 border-rose-600 bg-rose-50' : 'text-slate-500 hover:text-rose-600',
    indigo: active === id ? 'text-indigo-700 border-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600',
    yellow: active === id ? 'text-yellow-700 border-yellow-600 bg-yellow-50' : 'text-slate-500 hover:text-yellow-600',
    purple: active === id ? 'text-purple-700 border-purple-600 bg-purple-50' : 'text-slate-500 hover:text-purple-600',
    red: active === id ? 'text-red-700 border-red-600 bg-red-50' : 'text-slate-500 hover:text-red-600',
    cyan: active === id ? 'text-cyan-700 border-cyan-600 bg-cyan-50' : 'text-slate-500 hover:text-cyan-600',
  };

  return (
    <button 
      onClick={() => set(id)}
      className={`px-4 py-3 font-black text-sm transition-all whitespace-nowrap border-b-[3px] border-transparent rounded-t-xl ${colors[color]}`}
    >
      {label}
    </button>
  );
};

const CheckItem = ({ item, desc }) => (
  <li className="flex gap-3 items-start">
    <div className="mt-1 text-emerald-500 shrink-0"><CheckCircle size={18}/></div>
    <div>
      <div className="text-sm font-black text-slate-800">{item}</div>
      <div className="text-xs font-bold text-slate-600 mt-1 leading-relaxed">{desc}</div>
    </div>
  </li>
);