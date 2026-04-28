import React, { useState } from 'react';
import { 
  Plane, Train, Bike, MapPin, Camera, Sunrise, Copy, Printer, Check, 
  Navigation, Package, Battery, Thermometer, Shield, Ban, Scissors, Globe, 
  CreditCard, Smartphone, FileText, PenTool, CloudSun, Wind, Hotel, Bath, 
  Utensils, AlertTriangle, Clock, Ticket, Info, ShoppingCart, Truck, 
  Backpack, MessageCircle, PieChart, Users, Wallet, DollarSign, Calculator, 
  ArrowRight, Gauge, Coffee, Bird, Box, Mic, CheckCircle, XCircle, HelpCircle,
  Anchor, Bus, Car, Lock, Umbrella, Store, ShoppingBag
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [copied, setCopied] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(35.5);

  // 1. 財務底層資料 (義大利版)
  const [budgetItems, setBudgetItems] = useState({
    prepaid: [
        { id: 'f1', category: '機票', name: '阿聯酋航空 (3人來回)', twd: 94803, note: 'A380 旗艦機' },
        { id: 'a1', category: '住宿', name: '米蘭: Hotel Midway (1晚)', twd: 7997, note: '車站旁無痛入住' },
        { id: 'a2', category: '住宿', name: '威尼斯: Hotel Principe (3晚)', twd: 44128, note: '露台套房免過橋' },
        { id: 'a3', category: '住宿', name: '佛羅倫斯: Plus Florence (4晚)', twd: 25287, note: '含早餐' },
        { id: 'a4', category: '住宿', name: '羅馬: Hotel Milani (4晚)', twd: 30627, note: '三人房' },
        { id: 't1', category: '交通', name: '國鐵 FR 9733 (米➔威)', twd: 3610, note: '€101.70' },
        { id: 't2', category: '交通', name: '國鐵 FR 9425 (威➔佛)', twd: 3610, note: '€101.70' },
        { id: 't3', category: '交通', name: 'Italo 8905 (佛➔羅)', twd: 3078, note: '€86.70' },
        { id: 'm1', category: '門票', name: '米蘭大教堂 Fast Track', twd: 3408, note: '€96.00' },
        { id: 'm2', category: '門票', name: '梵蒂岡博物館', twd: 2663, note: '€75.00' },
        { id: 'o1', category: '行程', name: 'Trip.com 天空之城包車', twd: 11151, note: '7人座中文司機 (待訂)' },
        { id: 'o2', category: '行程', name: 'Klook 比薩＆五漁村', twd: 13638, note: '中文導覽大巴一日遊 (待訂)' }
    ],
    payLater: [
        { id: 'c1', category: '住宿', name: '當地城市稅 (City Tax)', eur: 95, note: '4間飯店入住時付現' },
        { id: 'c2', category: '行程', name: '威尼斯貢多拉包船', eur: 90, note: '傍晚包船公定價' },
        { id: 'c3', category: '餐飲', name: '日常餐飲與超市', eur: 600, note: '預估額度 (多數可刷卡)' },
        { id: 'c4', category: '交通', name: '羅馬 FreeNow 計程車', eur: 100, note: '強烈建議羅馬全程計程車' },
        { id: 'c5', category: '其他', name: '備用現金與小費', eur: 115, note: '廁所零錢、床頭小費' }
    ]
  });

  // 完美回歸島波海道版本的列印與複製邏輯
  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = "義大利 2026 手冊連結已複製！請前往 GitHub Pages 查看。";
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) {}
        document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6 font-sans text-gray-800">
      
      {/* Print Styles (完全套用原版穩定 CSS) */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-content, #printable-content * { visibility: visible; }
          #printable-content { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          .print-break { break-before: page; }
        }
      `}</style>

      {/* Control Bar */}
      <div className="max-w-5xl mx-auto mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🇮🇹 義大利 2026 家族壯遊手冊
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded font-bold border border-yellow-200">精準預算</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded font-bold border border-indigo-200">車票對接</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded font-bold border border-red-200">五漁村外掛</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCopy} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition flex items-center gap-2">
              {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16}/>}
              {copied ? "已複製" : "分享連結"}
            </button>
            <button onClick={handlePrint} className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-bold shadow transition flex items-center gap-2">
              <Printer size={16} />
              列印手冊
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex mt-6 border-b border-gray-200 overflow-x-auto pb-1 gap-1">
          <TabButton id="itinerary" label="🗓️ 每日行程" active={activeTab} set={setActiveTab} color="emerald" />
          <TabButton id="budget" label="💰 財務總管" active={activeTab} set={setActiveTab} color="yellow" />
          <TabButton id="reservation" label="🎫 劃位車票" active={activeTab} set={setActiveTab} color="indigo" />
          <TabButton id="shopping" label="🛒 伴手禮圖鑑" active={activeTab} set={setActiveTab} color="blue" />
          <TabButton id="todo" label="🛡️ 待辦戰略" active={activeTab} set={setActiveTab} color="rose" />
        </div>
      </div>

      {/* Main Content Area */}
      <div id="printable-content" className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden min-h-[800px] print:shadow-none print:border-none print:w-full">
        {activeTab === 'budget' && <BudgetView rate={exchangeRate} items={budgetItems} />}
        {activeTab === 'reservation' && <ReservationListView />}
        {activeTab === 'itinerary' && <ItineraryView />}
        {activeTab === 'todo' && <TodoGuideView />}
        {activeTab === 'shopping' && <ShoppingGuideView />}
      </div>
    </div>
  );
};

// --- Budget View ---
const BudgetView = ({ rate, items }) => {
    const totalPrepaidTwd = items.prepaid.reduce((sum, item) => sum + item.twd, 0);
    const totalPayLaterEur = items.payLater.reduce((sum, item) => sum + item.eur, 0);
    const totalPayLaterTwd = Math.round(totalPayLaterEur * rate);
    const grandTotalTwd = totalPrepaidTwd + totalPayLaterTwd;

    return (
        <div className="p-4 md:p-8 space-y-8 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                        <Users className="text-blue-600"/> 家族財務總管 (Total for 3)
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">機票、住宿、車票已鎖定。現金需求已優化。</p>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                    <span className="text-xs font-bold text-gray-500 uppercase">Rate</span>
                    <span className="font-mono font-bold text-yellow-700">{rate}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Grand Total (3 Pax)</div>
                        <div className="text-4xl font-extrabold mb-1">NT$ {grandTotalTwd.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">人均約: NT$ {Math.round(grandTotalTwd/3).toLocaleString()}</div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <DollarSign size={100} />
                    </div>
                </div>

                <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">✅ Booked (行前款項)</div>
                        <div className="text-3xl font-extrabold mb-1">NT$ {totalPrepaidTwd.toLocaleString()}</div>
                        <div className="text-xs text-emerald-100">已付 + 待訂 (包車/大巴)</div>
                    </div>
                    <div className="absolute right-4 top-4 opacity-20">
                        <CreditCard size={48} />
                    </div>
                </div>

                <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">💴 Cash Needed (需換匯)</div>
                        <div className="text-3xl font-extrabold mb-1">€ {totalPayLaterEur.toLocaleString()}</div>
                        <div className="text-xs text-orange-100">約 NT$ {totalPayLaterTwd.toLocaleString()} (含日常餐飲)</div>
                    </div>
                    <div className="absolute right-4 top-4 opacity-20">
                        <Wallet size={48} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-emerald-50 p-4 border-b border-emerald-100">
                        <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                            <CheckCircle size={18}/> 行前花費明細
                        </h3>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                            <tr>
                                <th className="p-3">項目</th>
                                <th className="p-3 text-right">金額 (TWD)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.prepaid.map((item, idx) => (
                                <tr key={idx} className="hover:bg-emerald-50/20">
                                    <td className="p-3">
                                        <div className="font-bold text-gray-800">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.category} • {item.note}</div>
                                    </td>
                                    <td className="p-3 text-right font-bold text-gray-700">
                                        ${item.twd.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-orange-50 p-4 border-b border-orange-100">
                        <h3 className="font-bold text-orange-900 flex items-center gap-2">
                            <Wallet size={18}/> 需準備歐元
                        </h3>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                            <tr>
                                <th className="p-3">項目</th>
                                <th className="p-3 text-right">預估 (EUR)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.payLater.map((item, idx) => (
                                <tr key={idx} className="hover:bg-orange-50/20">
                                    <td className="p-3">
                                        <div className="font-bold text-gray-800">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.note}</div>
                                    </td>
                                    <td className="p-3 text-right font-mono text-gray-700">
                                        €{item.eur.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-3 bg-gray-50 text-xs text-gray-500 text-center">
                        <Info size={12} className="inline mr-1"/>
                        多數餐廳皆可刷卡，現金無須準備太多。
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Reservation List View ---
const ReservationListView = () => (
    <div className="p-4 md:p-8 space-y-8 bg-indigo-50">
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg border-t-8 border-indigo-600 max-w-3xl mx-auto">
            <div className="text-center border-b border-gray-200 pb-6 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">車票與憑證清單</h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Official Tickets</p>
            </div>

            <div className="space-y-6">
                
                {/* Train 1 */}
                <div className="flex border-2 border-indigo-300 rounded-lg overflow-hidden shadow-sm bg-white">
                    <div className="bg-indigo-50 p-4 flex flex-col justify-center items-center w-20 md:w-24 border-r border-indigo-200">
                        <div className="text-xs font-bold text-indigo-500">Day 3</div>
                        <div className="text-xl md:text-2xl font-bold text-indigo-800">6/14</div>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg md:text-xl text-indigo-900">Frecciarossa 9733</h3>
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-[10px] md:text-xs font-bold whitespace-nowrap">1º Business</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                                <div className="text-xs text-gray-500">From</div>
                                <div className="font-bold text-xs md:text-sm">Milano Centrale (14:15)</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">To</div>
                                <div className="font-bold text-xs md:text-sm">Venezia S. Lucia (16:42)</div>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs md:text-sm text-gray-700 font-bold">
                            Coach: 2 | Seats: 8B, 9A, 9B
                        </div>
                    </div>
                </div>

                {/* Train 2 */}
                <div className="flex border-2 border-indigo-300 rounded-lg overflow-hidden shadow-sm bg-white">
                    <div className="bg-indigo-50 p-4 flex flex-col justify-center items-center w-20 md:w-24 border-r border-indigo-200">
                        <div className="text-xs font-bold text-indigo-500">Day 6</div>
                        <div className="text-xl md:text-2xl font-bold text-indigo-800">6/17</div>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg md:text-xl text-indigo-900">Frecciarossa 9425</h3>
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-[10px] md:text-xs font-bold whitespace-nowrap">1º Business</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                                <div className="text-xs text-gray-500">From</div>
                                <div className="font-bold text-xs md:text-sm">Venezia S. Lucia (14:26)</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">To</div>
                                <div className="font-bold text-xs md:text-sm">Firenze S.M.N (16:39)</div>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs md:text-sm text-gray-700 font-bold">
                            Coach: 2 | Seats: 9A, 10A, 10B
                        </div>
                    </div>
                </div>

                {/* Train 3 */}
                <div className="flex border-2 border-red-300 rounded-lg overflow-hidden shadow-sm bg-white">
                    <div className="bg-red-50 p-4 flex flex-col justify-center items-center w-20 md:w-24 border-r border-red-200">
                        <div className="text-xs font-bold text-red-500">Day 10</div>
                        <div className="text-xl md:text-2xl font-bold text-red-800">6/21</div>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg md:text-xl text-red-900">Italo 8905</h3>
                            <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-[10px] md:text-xs font-bold whitespace-nowrap">Prima</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                                <div className="text-xs text-gray-500">From</div>
                                <div className="font-bold text-xs md:text-sm">Firenze S.M.N (10:28)</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">To</div>
                                <div className="font-bold text-xs md:text-sm">Roma Termini (12:10)</div>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs md:text-sm text-gray-700 font-bold">
                            Coach: 3 | Seats: 18, 19, 20
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
);

// --- Detailed Itinerary View ---
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
    
    <div className="p-4 md:p-8 space-y-8">
      
      <DaySection day="Day 1" date="6/12 (五)" title="壯遊啟動" icon={<Plane />} color="gray">
        <TimelineItem time="20:30" title="抵達桃園機場 T2" desc="阿聯酋櫃檯報到、托運行李" />
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

      <DaySection day="Day 15" date="6/26 (五)" title="平安抵家" icon={<CheckCircle />} color="gray">
        <TimelineItem time="21:20" title="抵達台灣" desc="順利降落桃園機場 T2" />
      </DaySection>

    </div>
  </>
);

// --- 待辦與戰略 View ---
const TodoGuideView = () => (
  <div className="p-4 md:p-8 space-y-8">
    <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
      <h2 className="text-xl md:text-2xl font-extrabold text-rose-900 mb-4 flex items-center gap-2">
        <Shield className="text-rose-600"/> 終極待辦與防護戰略
      </h2>
      <p className="text-rose-800 text-sm">
        機票住宿已完封！跟著以下戰略，確保長輩在義大利舒適安全。
      </p>
    </div>

    <section>
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Clock className="text-amber-600"/> 搶票與預訂任務
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-bold text-gray-900 mb-2">🛒 隨時可加入購物車</div>
                <ul className="text-xs text-gray-700 space-y-2 list-disc pl-4">
                    <li><strong className="text-blue-600">Klook 五漁村大巴遊 (6/19)：</strong> 搜尋佛羅倫斯出發，含中文導覽。</li>
                    <li><strong className="text-blue-600">Trip.com 天空之城包車 (6/22)：</strong> 7人座舒適車型。</li>
                </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-sm font-bold text-red-900 mb-2">⏰ 設鬧鐘地獄級搶票</div>
                <ul className="text-xs text-red-800 space-y-2 list-disc pl-4">
                    <li><strong className="text-red-600">羅馬競技場 (約 5/24)：</strong> 出發前 30 天開賣。</li>
                    <li><strong className="text-red-600">威尼斯商館觀景台 (約 5/25)：</strong> 出發前 21 天開放免費預約。</li>
                    <li><strong className="text-red-600">烏菲茲美術館 (約 4 月中)：</strong> 官網 B-ticket 留意放票。</li>
                </ul>
            </div>
        </div>
    </section>

    <section>
      <div className="bg-emerald-50 p-5 rounded-lg border-l-4 border-emerald-500 mt-4">
        <h4 className="font-bold text-emerald-900 flex items-center gap-2">
          <Navigation size={18}/> 長輩生存 3 大護體戰略
        </h4>
        <ul className="list-decimal pl-5 mt-2 text-sm text-emerald-800 space-y-2">
            <li><strong>全面棄用地鐵：</strong> 羅馬地鐵扒手極多且無電梯。下載 <strong className="text-emerald-900">FreeNow APP</strong>，市區移動搭計程車，三人分攤極划算。</li>
            <li><strong>Espresso 廁所法：</strong> 義大利公廁少且收費。找街邊咖啡吧花 €1.5 買濃縮咖啡，全家免費上廁所兼吹冷氣。</li>
            <li><strong>高鐵防盜密碼鎖：</strong> 準備 1公尺自行車鋼絲鎖，將大行李鎖在高鐵行李架上，位子上安心睡覺。</li>
        </ul>
      </div>
    </section>
  </div>
);

// --- 伴手禮 View ---
const ShoppingGuideView = () => (
  <div className="p-4 md:p-8 space-y-8 bg-[#FFFBF0]">
    <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm">
        <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2 border-b pb-2">
            <ShoppingCart className="text-amber-600"/> 超市必掃神級零食 (Conad/Coop)
        </h3>
        <ul className="space-y-4">
            <CheckItem item="Mulino Bianco 開心果夾心餅乾" desc="白磨坊綠色包裝，極度熱賣，濃郁不甜膩。" />
            <CheckItem item="San Carlo 1936 洋芋片" desc="義大利市佔第一，白色包裝原味最推。" />
            <CheckItem item="MATILDE VICENZI 長條千層酥" desc="192層摺疊，配濃縮咖啡極品。" />
            <CheckItem item="MATILDE VICENZI 巧克力泡芙酥" desc="千層外皮爆漿巧克力內餡，適合分送同事。" />
        </ul>
    </div>

    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2 border-b pb-2">
            <Globe className="text-blue-600"/> 媽媽的油醋戰略
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-bold text-sm text-blue-900">日常料理 (CP值)</div>
                <div className="text-xs text-blue-800 mt-1">去 Termini 車站的 Conad 超市，挑選瓶身有 <strong>IGP 或 DOP</strong> 認證的，約 €3-15。</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
                <div className="font-bold text-sm text-amber-900">珍藏送禮 (年份級)</div>
                <div className="text-xs text-amber-800 mt-1">去佛羅倫斯 <strong>中央市場一樓</strong>，可試吃 10/25 年巴薩米克醋，約 €20-60。</div>
            </div>
        </div>
    </div>
  </div>
);

// --- Components (完全沿用原版) ---

const TabButton = ({ id, label, active, set, color }) => {
  const colors = {
    emerald: active === id ? 'text-emerald-700 border-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-emerald-600',
    blue: active === id ? 'text-blue-700 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600',
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
    gray: 'bg-gray-500', indigo: 'bg-indigo-600', amber: 'bg-amber-500', 
    blue: 'bg-blue-600', rose: 'bg-rose-600', emerald: 'bg-emerald-600', orange: 'bg-orange-600'
  };
  const textColors = {
    gray: 'text-gray-700', indigo: 'text-indigo-800', amber: 'text-amber-800', 
    blue: 'text-blue-800', rose: 'text-rose-800', emerald: 'text-emerald-800', orange: 'text-orange-800'
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md text-white shrink-0 ${bgColors[color]}`}>
          {React.cloneElement(icon, { size: 16 })}
        </div>
        <div className="flex-1 w-0.5 bg-gray-200 my-2 print:hidden"></div>
      </div>
      <div className="flex-1 pb-4">
        <h2 className="text-base font-bold text-gray-900 flex items-baseline gap-2">
          {day} <span className="text-xs font-normal text-gray-500">{date}</span>
        </h2>
        <h3 className={`text-lg font-bold mb-3 ${textColors[color]}`}>{title}</h3>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, title, desc }) => (
  <div className="flex gap-3 items-start">
    <div className="w-10 text-xs font-bold text-gray-400 pt-1 shrink-0 text-right font-mono">{time}</div>
    <div>
      <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
      {desc && <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{desc}</p>}
    </div>
  </div>
);

const AlertBox = ({ type, children }) => (
  <div className={`border-l-4 p-2 text-xs rounded-r mb-2 ${type === 'red' ? 'border-red-400 bg-red-50 text-red-800' : 'border-blue-400 bg-blue-50 text-blue-800'}`}>
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
      <div className="flex items-center gap-2 font-bold text-sm mb-1">{icon} {title}</div>
      <div className="text-xs opacity-90">{children}</div>
    </div>
  );
};

const CheckItem = ({ item, desc }) => (
  <li className="flex gap-3 items-start">
    <div className="mt-1 text-emerald-500 shrink-0"><CheckCircle size={16}/></div>
    <div>
      <div className="text-sm font-bold text-gray-800">{item}</div>
      <div className="text-xs text-gray-500">{desc}</div>
    </div>
  </li>
);

export default App;