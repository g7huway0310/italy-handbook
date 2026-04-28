import React, { useState } from 'react';
import { 
  Plane, Train, MapPin, Camera, Sunrise, Copy, Printer, Check, 
  Navigation, Shield, Ban, Globe, CreditCard, Banknote, 
  Bed, Utensils, Clock, Ticket, Info, ShoppingCart, Users, Wallet, DollarSign, Calculator, 
  CheckCircle, ShieldAlert, Umbrella, Store, AlertOctagon, Car, BookOpen, Anchor, Bus,
  AlertTriangle, PhoneCall, HelpCircle, FileText, CheckCircle2, ShoppingBag
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('budget'); 
  const [copied, setCopied] = useState(false);
  const [isPerPerson, setIsPerPerson] = useState(false); // 完美回歸：單人花費切換狀態
  const [exchangeRate] = useState(35.5);
  const [actionMessage, setActionMessage] = useState(""); 

  // ==========================================
  // 1. 財務底層資料 (嚴格鎖定)
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
        { id: 'c1', category: '住宿', name: '當地城市稅 (City Tax)', eur: 95, note: '4間飯店入住時付現' },
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
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] uppercase rounded font-black border border-rose-200 tracking-wider">細節滿血回歸</span>
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
        
        {/* Navigation Tabs (列印時隱藏) */}
        <div className="flex mt-6 border-b border-slate-200 overflow-x-auto pb-1 gap-1">
          <TabButton id="budget" label="💰 雙軌財務" active={activeTab} set={setActiveTab} color="emerald" />
          <TabButton id="reservation" label="🎫 劃位與車票" active={activeTab} set={setActiveTab} color="indigo" />
          <TabButton id="itinerary" label="🗓️ 每日行程" active={activeTab} set={setActiveTab} color="blue" />
          <TabButton id="shopping" label="🛒 必買伴手禮" active={activeTab} set={setActiveTab} color="amber" />
          <TabButton id="todo" label="🛡️ 待辦與防護" active={activeTab} set={setActiveTab} color="rose" />
        </div>
      </div>

      {/* Main Content Area - 設定所有分頁在 print 模式時全數呈現(display: block) */}
      <div id="printable-content" className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-visible min-h-[800px] print:shadow-none print:border-none print:bg-transparent">
        
        <div className={activeTab === 'budget' ? 'block' : 'hidden print-tab-content'}>
            <BudgetView rate={exchangeRate} items={budgetItems} isPer={isPerPerson} setIsPer={setIsPerPerson} />
        </div>

        <div className={`page-break-before ${activeTab === 'reservation' ? 'block' : 'hidden print-tab-content'}`}>
            <ReservationListView />
        </div>
        
        <div className={`page-break-before ${activeTab === 'itinerary' ? 'block' : 'hidden print-tab-content'}`}>
            <ItineraryView />
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
};

// ==========================================
// Tab 1: Budget View (完美回歸：單人切換與精算)
// ==========================================
const BudgetView = ({ rate, items, isPer, setIsPer }) => {
    const totalPaidTwd = items.prepaid.filter(i => i.status === 'paid').reduce((sum, item) => sum + item.twd, 0);
    const totalPendingTwd = items.prepaid.filter(i => i.status === 'pending').reduce((sum, item) => sum + item.twd, 0);
    const totalPrepaidTwd = totalPaidTwd + totalPendingTwd; 
    const totalPayLaterEur = items.payLater.reduce((sum, item) => sum + item.eur, 0);
    const totalPayLaterTwd = Math.round(totalPayLaterEur * rate);
    const grandTotalTwd = totalPrepaidTwd + totalPayLaterTwd;

    // 依據是否開啟「單人均分」計算除數
    const divisor = isPer ? 3 : 1;
    
    const dispPaid = Math.round(totalPaidTwd / divisor);
    const dispPending = Math.round(totalPendingTwd / divisor);
    const dispGrandTotal = Math.round(grandTotalTwd / divisor);
    const dispPayLaterEur = Math.round(totalPayLaterEur / divisor);
    const dispPayLaterTwd = Math.round(totalPayLaterTwd / divisor);

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50 print-break-inside-avoid">
            {/* 完美回歸的切換按鈕區 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4 no-print">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Calculator className="text-emerald-600"/> 雙軌財務總管
                    </h2>
                    <p className="text-slate-500 text-xs font-bold mt-1">
                        核心花費已鎖定，精確區分「已付款」與「待預訂」。
                    </p>
                </div>
                {/* 這是最關鍵的單人/總計切換鈕 */}
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
                        多數餐廳皆可刷卡，現金無須準備太多。城市稅需付現。
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Tab 2: Reservation List View (完美回歸：高鐵注意事項)
// ==========================================
const ReservationListView = () => (
    <div className="p-6 md:p-10 space-y-8 bg-indigo-50 print-break-inside-avoid">
        
        {/* 全新優化：高鐵搭乘戰略 */}
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
// Tab 3: Detailed Itinerary View (保持最穩定的直列式渲染)
// ==========================================
const ItineraryView = () => (
  <>
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-slate-300 text-xs font-bold tracking-wider mb-1">ITALY GRAND TOUR</div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">義大利 15 天家族壯遊</h1>
          <p className="text-slate-100 text-sm">2026.06.12 - 06.26 · 五漁村破解版 · 尊榮護膝安排</p>
        </div>
      </div>
    </div>
    
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC]">
      
      <DaySection day="Day 1" date="6/12 (五)" title="壯遊啟動" icon={<Plane />} color="gray">
        <TimelineItem time="20:30" title="抵達桃園機場 T2" desc="阿聯酋櫃檯報到、托運行李" />
        <TimelineItem time="21:30" title="過安檢，免稅店閒逛或使用貴賓室吃點熱食" desc="" />
        <TimelineItem time="23:50" title="EK367 起飛" desc="阿聯酋 A380 雙層客機，開啟睡眠模式" />
      </DaySection>

      <DaySection day="Day 2" date="6/13 (六)" title="米蘭：降落與安頓" icon={<MapPin />} color="orange">
        <TimelineItem time="14:10" title="抵達米蘭 MXP 機場" desc="下機伸展筋骨，搭乘快線直達市區" />
        <TimelineItem time="16:40" title="入住 Hotel Midway" desc="中央車站旁，長輩無痛進房躺平" />
        <HighlightBox color="orange" icon={<Camera size={14}/>} title="市區初探">
             <div className="text-xs">搭地鐵至艾曼紐二世迴廊拍攝夜間點燈，並前往全球最美星巴克臻選工坊。</div>
        </HighlightBox>
      </DaySection>

      <DaySection day="Day 3" date="6/14 (日)" title="米蘭 ➔ 威尼斯" icon={<Train />} color="blue">
        <TimelineItem time="09:30" title="米蘭大教堂 Fast Track" desc="搭電梯登頂，穿梭於哥德式尖塔間" />
        <TimelineItem time="14:15" title="高鐵 FR 9733" desc="米蘭出發，前往威尼斯 (16:42 抵達)" />
        <TimelineItem time="17:10" title="入住 Hotel Principe" desc="露台套房，免過橋輕鬆安頓" />
      </DaySection>

      <DaySection day="Day 4" date="6/15 (一)" title="水都慢活與黃金日落" icon={<Anchor />} color="blue">
        <TimelineItem time="09:30" title="聖馬可廣場漫步" desc="穿越水巷與小橋，探訪沉水書店" />
        <TimelineItem time="15:00" title="德國商館 T Fondaco" desc="頂樓觀景台俯瞰大運河 (需提早預約)" />
        <HighlightBox color="blue" icon={<Sunrise size={14}/>} title="17:30 黃金時刻：貢多拉包船">
             <div className="text-xs">避開正午烈日，享受夕陽灑在運河上的極致浪漫。</div>
        </HighlightBox>
      </DaySection>

      <DaySection day="Day 5" date="6/16 (二)" title="彩色島童話攝影" icon={<Camera />} color="blue">
        <TimelineItem time="09:00" title="搭乘 12 號水巴" desc="前往 F.te Nove 碼頭搭船" />
        <TimelineItem time="10:30" title="布拉諾島 (Burano)" desc="拍攝彩色房屋，中午享用炸海鮮拼盤" />
      </DaySection>

      <DaySection day="Day 6" date="6/17 (三)" title="威尼斯 ➔ 佛羅倫斯" icon={<Train />} color="emerald">
        <TimelineItem time="09:30" title="戰略休整" desc="睡到自然醒，享用最後的水都早餐" />
        <TimelineItem time="11:30" title="退房" desc="優雅退房，散步至火車站月台" />
        <TimelineItem time="14:26" title="高鐵 FR 9425" desc="前往佛羅倫斯 (16:39 抵達)" />
        <TimelineItem time="17:00" title="入住 Plus Florence" desc="長輩進房充電休息" />
      </DaySection>

      <DaySection day="Day 7" date="6/18 (四)" title="大師傑作與慢活" icon={<Camera />} color="emerald">
        <TimelineItem time="09:00" title="烏菲茲美術館" desc="看《維納斯的誕生》" />
        <TimelineItem time="12:00" title="中央市場" desc="品嚐牛肚包與松露麵" />
        <AlertBox type="blue">下午強迫長輩回飯店吹冷氣午休，避開午後烈日！</AlertBox>
      </DaySection>

      <DaySection day="Day 8" date="6/19 (五)" title="奇蹟與海岸：大巴遊" icon={<Bus />} color="emerald">
        <HighlightBox color="emerald" icon={<Shield size={14}/>} title="護膝戰略：Klook 一日遊">
             <div className="text-xs">搭大巴前往比薩斜塔與五漁村。車上睡覺回血，完美取代疲憊的轉車行程。</div>
        </HighlightBox>
        <TimelineItem time="07:30" title="集合出發" desc="前往比薩拍攝推塔照" />
        <TimelineItem time="12:30" title="五漁村 (Cinque Terre)" desc="搭村際火車/遊船穿梭彩色懸崖" />
      </DaySection>

      <DaySection day="Day 9" date="6/20 (六)" title="品味與終極牛排" icon={<Utensils />} color="emerald">
        <TimelineItem time="09:30" title="市區採買" desc="百年修道院藥妝、中央市場油醋" />
        <TimelineItem time="18:45" title="米開朗基羅廣場" desc="搭計程車上山看魔幻夕陽" />
        <TimelineItem time="20:00" title="Trattoria Dall'Oste" desc="享用 1kg 丁骨大牛排" />
      </DaySection>

      <div className="print-break"></div>

      <DaySection day="Day 10" date="6/21 (日)" title="佛羅倫斯 ➔ 羅馬" icon={<Train />} color="rose">
        <TimelineItem time="10:28" title="Italo 8905 (法拉利高鐵)" desc="Prima 商務艙前往羅馬 (12:10 抵達)" />
        <TimelineItem time="14:30" title="入住 Hotel Milani" desc="長輩進房睡午覺" />
        <TimelineItem time="16:30" title="市區漫步" desc="西班牙階梯、許願池、金杯咖啡" />
      </DaySection>

      <DaySection day="Day 11" date="6/22 (一)" title="天空之城尊榮包車" icon={<Car />} color="rose">
        <HighlightBox color="red" icon={<Ban size={14}/>} title="逃離黑色星期一">
             <div className="text-xs">週一羅馬市區塞爆，我們包車前往郊區避開人潮。</div>
        </HighlightBox>
        <TimelineItem time="08:30" title="專屬中文包車" desc="飯店門口接送，直達天空之城 (Civita)" />
        <TimelineItem time="14:30" title="Orvieto" desc="懸崖中世紀小鎮享用野味午餐" />
      </DaySection>

      <DaySection day="Day 12" date="6/23 (二)" title="帝國榮耀與老城" icon={<Camera />} color="rose">
        <TimelineItem time="09:00" title="羅馬競技場" desc="感受古羅馬震撼 (門票極難搶)" />
        <TimelineItem time="17:00" title="Trastevere 老城" desc="台伯河畔享用道地培根蛋麵" />
      </DaySection>

      <DaySection day="Day 13" date="6/24 (三)" title="聖地巡禮與創世紀" icon={<MapPin />} color="rose">
        <TimelineItem time="07:30" title="聖彼得大教堂" desc="趁早免排隊安檢進入" />
        <TimelineItem time="17:00" title="梵蒂岡博物館" desc="精華動線直搗黃龍，看西斯汀禮拜堂" />
      </DaySection>

      <DaySection day="Day 14" date="6/25 (四)" title="超市掃貨與賦歸" icon={<ShoppingBag />} color="gray">
        <TimelineItem time="11:00" title="Termini 地下超市" desc="最後衝刺伴手禮" />
        <TimelineItem time="18:30" title="Leonardo Express" desc="前往 FCO 羅馬機場" />
        <TimelineItem time="22:10" title="EK232 起飛" desc="帶著滿滿回憶離開義大利" />
      </DaySection>

      <DaySection day="Day 15" date="6/26 (五)" title="平安抵家" icon={<CheckCircle2 />} color="gray">
        <TimelineItem time="21:20" title="抵達台灣" desc="順利降落桃園機場 T2" />
      </DaySection>

    </div>
  </>
);

// ==========================================
// Tab 4: 待辦與戰略 View (完美回歸：深度優化)
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

    {/* 深度優化：緊急聯絡卡 */}
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-white print-break-inside-avoid">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-3">
            <PhoneCall className="text-rose-400"/> 🆘 義大利緊急求助小卡
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-400 text-xs font-bold mb-1">全歐盟通用緊急報案電話 (警察/救護車)</div>
                <div className="text-2xl font-black text-rose-400 font-mono">112</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-400 text-xs font-bold mb-1">駐義大利台北代表處 (護照遺失/急難急救)</div>
                <div className="font-bold text-blue-300">上班時間：+39-06-9826-2800</div>
                <div className="font-bold text-rose-300">緊急專線：+39-366-8066-434</div>
            </div>
        </div>
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
            <li><strong>Espresso 廁所法：</strong> 義大利公廁少且收費。找街邊咖啡吧花 €1.5 買濃縮咖啡，全家免費上廁所兼吹冷氣休息 15 分鐘。</li>
            <li><strong>高鐵防盜密碼鎖：</strong> 準備 1公尺自行車鋼絲鎖，將大行李鎖在高鐵行李架上，位子上安心睡覺。</li>
        </ul>
      </div>
    </section>
  </div>
);

// ==========================================
// Tab 5: Shopping Guide (完美回歸：深度油醋戰略)
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
    emerald: active === id ? 'text-emerald-700 border-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-emerald-600',
    blue: active === id ? 'text-blue-700 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600',
    amber: active === id ? 'text-amber-700 border-amber-500 bg-amber-50' : 'text-gray-500 hover:text-amber-600',
    rose: active === id ? 'text-rose-700 border-rose-600 bg-rose-50' : 'text-gray-500 hover:text-rose-600',
    indigo: active === id ? 'text-indigo-700 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600',
    yellow: active === id ? 'text-yellow-700 border-yellow-600 bg-yellow-50' : 'text-gray-500 hover:text-yellow-600',
  };

  return (
    <button 
      onClick={() => set(id)}
      className={`px-4 py-3 font-bold text-sm transition-all whitespace-nowrap border-b-2 border-transparent rounded-t-lg ${colors[color]}`}
    >
      {label}
    </button>
  );
};

const DaySection = ({ day, date, title, icon, color, children }) => {
  const bgColors = {
    gray: 'bg-slate-500', indigo: 'bg-indigo-600', amber: 'bg-amber-500', 
    blue: 'bg-blue-600', rose: 'bg-rose-600', emerald: 'bg-emerald-600', orange: 'bg-orange-600'
  };
  const textColors = {
    gray: 'text-slate-700', indigo: 'text-indigo-800', amber: 'text-amber-800', 
    blue: 'text-blue-800', rose: 'text-rose-800', emerald: 'text-emerald-800', orange: 'text-orange-800'
  };

  return (
    <div className="flex gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm print-break-inside-avoid">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md text-white shrink-0 ${bgColors[color]}`}>
          {React.cloneElement(icon, { size: 16 })}
        </div>
        <div className="flex-1 w-0.5 bg-gray-200 my-2 print:hidden"></div>
      </div>
      <div className="flex-1 pb-2">
        <h2 className="text-base font-bold text-gray-900 flex items-baseline gap-2">
          {day} <span className="text-xs font-normal text-gray-500">{date}</span>
        </h2>
        <h3 className={`text-lg font-black mb-3 ${textColors[color]}`}>{title}</h3>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, title, desc }) => (
  <div className="flex gap-3 items-start">
    <div className="w-11 text-xs font-bold text-slate-400 pt-0.5 shrink-0 text-right font-mono bg-slate-50 px-1 rounded">{time}</div>
    <div>
      <h4 className="font-black text-slate-800 text-sm">{title}</h4>
      {desc && <p className="text-xs text-slate-600 mt-1 leading-relaxed font-bold">{desc}</p>}
    </div>
  </div>
);

const AlertBox = ({ type, children }) => (
  <div className={`border-l-4 p-3 text-xs font-bold rounded-r mb-2 ${type === 'red' ? 'border-red-400 bg-red-50 text-red-800' : 'border-blue-400 bg-blue-50 text-blue-800'}`}>
    {children}
  </div>
);

const HighlightBox = ({ color, icon, title, children }) => {
  const styles = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    red: "bg-red-50 border-red-200 text-red-900",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    orange: "bg-orange-50 border-orange-200 text-orange-900",
  };
  const activeStyle = styles[color] || styles.blue;

  return (
    <div className={`border p-3 rounded-lg my-2 ${activeStyle}`}>
      <div className="flex items-center gap-2 font-black text-sm mb-1">{icon} {title}</div>
      <div className="text-xs font-bold opacity-90">{children}</div>
    </div>
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