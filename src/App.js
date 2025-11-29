import React, { useState, useMemo } from "react";
import {
  MapPin,
  CloudSun,
  Utensils,
  BedDouble,
  Phone,
  Plane,
  Wallet,
  ShoppingBag,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Moon,
  Sun,
  CheckSquare,
  Info,
  Camera,
  Train,
  Sparkles,
  Footprints,
  Bus,
  Banknote,
  Navigation,
} from "lucide-react";

// --- 設定與模擬資料 ---

const THEME = {
  primary: "bg-red-900", // 名古屋味噌紅
  primaryText: "text-red-900",
  secondary: "bg-amber-500", // 金鯱金
  bg: "bg-stone-50", // 和紙米色
  lineColor: "border-red-900",
  dashedLine: "border-stone-400",
};

// 輔助函數：取得今日日期 (YYYY-MM-DD)
const getTodayDate = () => new Date().toISOString().split("T")[0];

/**
 * 處理導航動作，程式化開啟 Google Maps 連結。
 * 使用 window.open 避免在 iframe 環境中被瀏覽器視為無效點擊或阻擋。
 * @param {string} query 搜尋地點的關鍵字。
 */
const navigateTo = (query) => {
  if (!query) return;
  // 使用 q 參數進行搜尋，更通用
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
  // 程式化開啟新視窗/分頁
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (e) {
    // 處理如果 window.open 被環境限制的情況，並在 console 顯示錯誤
    console.error("無法開啟新視窗，可能被瀏覽器阻擋:", e);
    // 可以提供一個備用方案，例如顯示提示訊息
    // alert("瀏覽器限制無法開啟導航，請檢查彈出視窗設定。連結: " + url);
  }
};

// 使用 confirm 替代 window.confirm，但建議在產品環境中使用 Custom Modal
const customConfirm = (message) => {
  console.warn("使用瀏覽器內建 confirm，建議改用 custom modal。");
  return window.confirm(message);
};

const INITIAL_TRIP_DATA = [
  // Day 1
  {
    id: 1,
    date: "12/18 (四)",
    title: "Day 1｜犬山城半日遊 & 榮夜景",
    weather: {
      temp: "4°C - 12°C",
      icon: "sun",
      desc: "晴時多雲",
      wear: "建議洋蔥式穿搭，犬山城風大需圍巾。",
    },
    hotel: {
      name: "名古屋站前大和 Roynet 飯店",
      address: "名駅南 1-23-20",
      checkIn: "14:00",
    },
    events: [
      {
        id: "1-1",
        time: "02:55",
        title: "樂桃 MM722 飛行中",
        type: "transport",
        note: "補眠時間 / 預計 06:25 抵達中部國際機場",
      },
      {
        id: "1-2",
        time: "07:30",
        title: "名鐵特急 → 名古屋站",
        type: "transport",
        note: "入境領行李後，搭乘名鐵前往市區",
      },
      {
        id: "1-3",
        time: "09:00",
        title: "Tsubame Bread & Milk",
        type: "food",
        highlight: "必吃：北海道紅豆奶油吐司",
        guide:
          "名古屋特有的「早餐文化」代表。吐司非常厚實柔軟，鮮奶油不膩口。建議先去抽號碼牌再寄放行李。",
      },
      {
        id: "1-4",
        time: "10:00",
        title: "名鐵犬山線移動",
        type: "transport",
        note: "前往犬山遊園站，約 30 分鐘車程",
      },
      {
        id: "1-5",
        time: "11:00",
        title: "犬山城 & 城下町",
        type: "sight",
        highlight: "必看：國寶天守閣、愛心繪馬",
        guide:
          "1. 犬山城是日本僅存五座「國寶」之一，木造樓梯非常陡(約50度)，女生請避免穿短裙。\n2. 頂樓景色無敵，可俯瞰木佐川。\n3. 下山必去「三光稻荷神社」洗錢(加倍奉還)並在粉紅愛心繪馬牆拍照。",
      },
      {
        id: "1-6",
        time: "12:00",
        title: "Seimen Misaku",
        type: "food",
        highlight: "必吃：雞醬油拉麵",
        guide:
          "米其林推薦名店。湯頭清澈但雞味濃郁，麵條有嚼勁。記得一定要先抽號碼牌。",
      },
      {
        id: "1-7",
        time: "15:00",
        title: "返回名古屋站",
        type: "transport",
        note: "名鐵線回程，稍作休息 Check-in",
      },
      {
        id: "1-8",
        time: "16:30",
        title: "榮商圈 (Oasis 21 / 電視塔)",
        type: "sight",
        highlight: "必拍：水的宇宙船夜景",
        guide:
          "傍晚去 Oasis 21 頂樓「水的宇宙船」散步，地板是透明玻璃與水池。推薦在日落時分拍攝中部電力塔（電視塔）點燈，是名古屋最經典的都會夜景。",
      },
      {
        id: "1-9",
        time: "19:00",
        title: "月島文字燒 & HARBS",
        type: "food",
        highlight: "必吃：明太子麻糬文字燒、水果千層",
        guide:
          "文字燒要自己動手煎才好玩（雖然店員也會幫忙）。吃完正餐一定要去 HARBS 榮本店，這裡是發源地，水果千層蛋糕是絕對王者。",
      },
    ],
  },
  // Day 2
  {
    id: 2,
    date: "12/19 (五)",
    title: "Day 2｜吉卜力公園全攻略",
    weather: {
      temp: "3°C - 11°C",
      icon: "cloud",
      desc: "多雲陰天",
      wear: "園區很大都在走路，請穿最好走的鞋。",
    },
    hotel: {
      name: "名古屋站前大和 Roynet 飯店",
      address: "續住",
      checkIn: "-",
    },
    events: [
      {
        id: "2-1",
        time: "07:00",
        title: "地鐵東山線 → 磁浮丘陵線",
        type: "transport",
        note: "於藤丘站轉乘 Linimo 至愛地球博公園",
      },
      {
        id: "2-2",
        time: "08:00",
        title: "吉卜力公園 (Ghibli Park)",
        type: "sight",
        highlight: "必看：吉卜力大倉庫、無臉男合照",
        guide:
          "1. 沒有大型遊樂設施，重點是「沉浸式場景」。\n2. 「吉卜力大倉庫」內容最豐富，進場先衝去排「名場面展」跟無臉男拍照（通常要排1小時）。\n3. 仔細看角落，處處都有小煤炭球或借物少女的細節。",
      },
      {
        id: "2-3",
        time: "17:00",
        title: "返回名古屋市區",
        type: "transport",
        note: "帶著戰利品回程",
      },
      {
        id: "2-4",
        time: "19:00",
        title: "矢場味噌豬排 (Yabaton)",
        type: "food",
        highlight: "必吃：鐵板味噌豬排",
        guide:
          "名古屋名物之首！上桌時店員會在你面前淋上滾燙的味噌醬，「滋滋」作響超誘人。醬汁偏甜濃郁，非常下飯，建議加點蔥花解膩。",
      },
    ],
  },
  // Day 3
  {
    id: 3,
    date: "12/20 (六)",
    title: "Day 3｜歷史散策 & 港口花火",
    weather: {
      temp: "5°C - 13°C",
      icon: "sun",
      desc: "晴朗乾燥",
      wear: "海邊晚上看煙火極冷，帽子手套暖暖包必備。",
    },
    hotel: { name: "金星 Neo 飯店", address: "新榮 2-45-8", checkIn: "20:30" },
    events: [
      {
        id: "3-1",
        time: "09:00",
        title: "客美多咖啡 (Komeda)",
        type: "food",
        highlight: "體驗：點飲料送早餐",
        guide:
          "名古屋發源的早餐文化。只要點一杯咖啡，就免費送厚片吐司（可選紅豆泥、水煮蛋或蛋沙拉）。",
      },
      {
        id: "3-2",
        time: "10:15",
        title: "名古屋城",
        type: "sight",
        highlight: "必看：金鯱、本丸御殿",
        guide:
          "天守閣屋頂的「金鯱」是名古屋的象徵。雖然天守閣目前整修無法進入，但修復完工的「本丸御殿」極致奢華，金箔壁畫與格狀天花板令人嘆為觀止，一定要進去參觀。",
      },
      {
        id: "3-3",
        time: "12:00",
        title: "熱田蓬萊軒 & 熱田神宮",
        type: "sight",
        highlight: "必吃：鰻魚飯三吃、必看：信長塀",
        guide:
          "1. 鰻魚飯三吃（Hitsumabushi）：一吃原味、二加佐料（海苔/蔥/芥末）、三加高湯變茶泡飯。\n2. 熱田神宮是日本三大神宮之一，供奉草薙劍。別錯過「信長塀」，是織田信長出征桶狹間前祈願成功後捐贈的圍牆。",
      },
      {
        id: "3-4",
        time: "15:30",
        title: "地鐵名城線 → 名港線",
        type: "transport",
        note: "前往名古屋港水族館周邊",
      },
      {
        id: "3-5",
        time: "16:00",
        title: "名古屋港水族館",
        type: "sight",
        highlight: "必看：虎鯨表演、沙丁魚龍捲風",
        guide:
          "日本少數擁有虎鯨（殺人鯨）的水族館。黑潮大水槽的沙丁魚群舞也非常震撼。傍晚可在港邊散步看南極觀測船富士號。",
      },
      {
        id: "3-6",
        time: "18:30",
        title: "ISOGAI 花火劇場",
        type: "sight",
        highlight: "重點：冬季煙火配音樂",
        guide:
          "冬天的空氣比夏天乾淨，煙火看起來會更清晰銳利。這是一場結合聖誕故事與音樂的煙火劇，非常浪漫。",
      },
      {
        id: "3-7",
        time: "20:00",
        title: "移動至新飯店",
        type: "transport",
        note: "取行李前往金星Neo飯店 (千種區)",
      },
    ],
  },
  // Day 4
  {
    id: 4,
    date: "12/21 (日)",
    title: "Day 4｜飛驒高山・合掌村",
    weather: {
      temp: "-2°C - 5°C",
      icon: "snow",
      desc: "山區降雪",
      wear: "山區極冷！發熱衣、防滑鞋、毛帽、手套。",
    },
    hotel: {
      name: "Dormy Inn PREMIUM 榮",
      address: "錦 2-20-1",
      checkIn: "20:00",
    },
    events: [
      {
        id: "4-1",
        time: "08:00",
        title: "巴士一日團出發",
        type: "transport",
        note: "名古屋站太閣通口集合，路程約 2.5 小時",
      },
      {
        id: "4-2",
        time: "10:00",
        title: "高山老街 (三町筋)",
        type: "sight",
        highlight: "必吃：飛驒牛握壽司",
        guide:
          "有「小京都」之稱。必去宮川朝市逛逛。不可錯過放在仙貝上的「飛驒牛握壽司」，入口即化。老街的味噌店和清酒釀造廠也很值得一逛。",
      },
      {
        id: "4-3",
        time: "14:00",
        title: "白川鄉合掌村",
        type: "sight",
        highlight: "必看：和田家、城山展望台",
        guide:
          "世界文化遺產。如果有時間，一定要搭接駁車或走到「城山展望台」，那裡才能拍出像明信片一樣、三間小屋並排的經典全景。",
      },
      {
        id: "4-4",
        time: "20:00",
        title: "Dormy Inn 溫泉 & 宵夜",
        type: "relax",
        highlight: "福利：夜鳴拉麵",
        guide:
          "回到市區累了一天，Dormy Inn 最棒的就是它的天然溫泉大浴場。泡完湯記得去餐廳享用免費提供的醬油拉麵（夜鳴そば），簡單卻超撫慰人心。",
      },
    ],
  },
  // Day 5
  {
    id: 5,
    date: "12/22 (一)",
    title: "Day 5｜大須文化 & 招財貓",
    weather: {
      temp: "6°C - 14°C",
      icon: "sun",
      desc: "晴時多雲",
      wear: "輕鬆便裝，方便在商場試穿衣服。",
    },
    hotel: { name: "溫暖的家", address: "Taiwan", checkIn: "-" },
    events: [
      {
        id: "5-1",
        time: "09:30",
        title: "地鐵鶴舞線",
        type: "transport",
        note: "前往大須觀音站，寄放行李",
      },
      {
        id: "5-2",
        time: "10:00",
        title: "大須觀音 & 商店街",
        type: "shopping",
        highlight: "必逛：Alice on Wednesday、二手衣",
        guide:
          "名古屋最混搭的商店街。有莊嚴的大須觀音寺，旁邊卻是動漫店、女僕咖啡和復古二手衣店。「星期三的愛麗絲」入口是個小門，要彎腰才能進去，非常有愛麗絲夢遊仙境的感覺。",
      },
      {
        id: "5-3",
        time: "15:30",
        title: "名鐵線 → 常滑",
        type: "transport",
        note: "前往 Aeon Mall 常滑",
      },
      {
        id: "5-4",
        time: "16:00",
        title: "常滑 Aeon & 招財貓",
        type: "shopping",
        highlight: "必看：巨大招財貓 Tokonyan",
        guide:
          "常滑是招財貓的故鄉。Aeon Mall 旁邊有一個巨大的招財貓頭部地標，非常可愛。商場內很大，是上飛機前最後衝刺掃貨的好地方。",
      },
      {
        id: "5-5",
        time: "19:30",
        title: "前往中部國際機場",
        type: "transport",
        note: "搭乘名鐵一站即達",
      },
      {
        id: "5-6",
        time: "22:45",
        title: "樂桃 MM723 返台",
        type: "transport",
        note: "滿載而歸，預計 01:25 抵達台北",
      },
    ],
  },
];

const EMERGENCY_CONTACTS = [
  { name: "日本報案", phone: "110" },
  { name: "日本火警/救護", phone: "119" },
  { name: "台北駐大阪辦事處", phone: "+81-6-6227-8623" },
  { name: "旅外國人急難救助", phone: "+886-800-085-095" },
];

const SOUVENIR_LIST = [
  { name: "蝦餅 (Yukari)", desc: "坂角総本舗，名古屋必買，機場有售" },
  { name: "小倉紅豆吐司抹醬", desc: "在家也能還原名古屋早餐" },
  { name: "青柳外郎糕 (Uiro)", desc: "口感像麻糬又像羊羹，推薦一口包裝" },
  {
    name: "伊勢名物 赤福",
    desc: "雖然是伊勢特產，但名古屋車站買得到，保存期限短必吃",
  },
  { name: "手羽先風味餅乾", desc: "Calbee 推出的地區限定口味" },
];

// --- 元件 ---

const Tag = ({ text, color }) => (
  <span
    className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md mr-1 border ${color}`}
  >
    {text}
  </span>
);

export default function NagoyaWinterTripApp() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [currentDayId, setCurrentDayId] = useState(1);
  const [tripData, setTripData] = useState(INITIAL_TRIP_DATA);
  const [isEditMode, setIsEditMode] = useState(false);

  // 記帳狀態：增加 date 和 rateAtTimeOfEntry
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    id: Date.now(),
    item: "",
    cost: "",
    currency: "JPY",
    date: getTodayDate(), // 預設為今日
  });

  // 全域匯率狀態 (用於換算工具和記帳當下的鎖定)
  const [exchangeRate, setExchangeRate] = useState(0.225);
  const [converterAmount, setConverterAmount] = useState("");

  // 匯率換算：使用當前全域匯率
  const calculatedCost = useMemo(() => {
    const rate = parseFloat(exchangeRate) || 0;
    return converterAmount
      ? (parseFloat(converterAmount) * rate).toFixed(0)
      : "0";
  }, [converterAmount, exchangeRate]);

  // 總花費計算：使用每筆紀錄鎖定的匯率
  const totalSpentTWD = useMemo(() => {
    return expenses
      .reduce((acc, curr) => {
        // 如果是日幣，使用當時鎖定的匯率 (curr.rateAtTimeOfEntry) 進行換算
        if (curr.currency === "JPY") {
          return acc + curr.cost * curr.rateAtTimeOfEntry;
        }
        // 如果是台幣，直接加總 cost
        return acc + curr.cost;
      }, 0)
      .toFixed(0);
  }, [expenses]);

  // --- 行程編輯功能 ---
  const moveEvent = (dayId, eventIndex, direction) => {
    const newTripData = [...tripData];
    const dayIndex = newTripData.findIndex((d) => d.id === dayId);
    if (dayIndex === -1) return;

    const events = [...newTripData[dayIndex].events];
    if (direction === "up" && eventIndex > 0) {
      [events[eventIndex], events[eventIndex - 1]] = [
        events[eventIndex - 1],
        events[eventIndex],
      ];
    } else if (direction === "down" && eventIndex < events.length - 1) {
      [events[eventIndex], events[eventIndex + 1]] = [
        events[eventIndex + 1],
        events[eventIndex],
      ];
    }
    newTripData[dayIndex].events = events;
    setTripData(newTripData);
  };

  const deleteEvent = (dayId, eventId) => {
    // 使用 customConfirm 替代 window.confirm
    if (!customConfirm("確定刪除此行程？")) return;
    const newTripData = [...tripData];
    const dayIndex = newTripData.findIndex((d) => d.id === dayId);
    if (dayIndex === -1) return;

    newTripData[dayIndex].events = newTripData[dayIndex].events.filter(
      (e) => e.id !== eventId
    );
    setTripData(newTripData);
  };

  // --- 記帳功能 ---
  const addExpense = () => {
    if (!newExpense.item || !newExpense.cost || !newExpense.date) return;

    const rate = parseFloat(exchangeRate) || 0;
    const costValue = parseFloat(newExpense.cost);

    setExpenses([
      ...expenses,
      {
        ...newExpense,
        id: Date.now(),
        cost: costValue, // 儲存為數字
        // 鎖定當前匯率
        rateAtTimeOfEntry: rate,
      },
    ]);

    // 重設表單，日期維持今日
    setNewExpense({
      id: Date.now() + 1,
      item: "",
      cost: "",
      currency: "JPY",
      date: getTodayDate(),
    });
  };

  const deleteExpense = (id) => {
    // 使用 customConfirm 替代 window.confirm
    if (customConfirm("確定刪除此筆帳目？")) {
      setExpenses(expenses.filter((ex) => ex.id !== id));
    }
  };

  const getEventStyle = (type) => {
    switch (type) {
      case "food":
        return {
          icon: <Utensils size={18} />,
          color: "text-orange-600",
          bg: "bg-orange-50",
          border: "border-orange-200",
        };
      case "sight":
        return {
          icon: <Camera size={18} />,
          color: "text-red-700",
          bg: "bg-white",
          border: "border-red-100",
        };
      case "shopping":
        return {
          icon: <ShoppingBag size={18} />,
          color: "text-pink-600",
          bg: "bg-pink-50",
          border: "border-pink-200",
        };
      case "relax":
        return {
          icon: <Moon size={18} />,
          color: "text-indigo-600",
          bg: "bg-indigo-50",
          border: "border-indigo-200",
        };
      default:
        return {
          icon: <MapPin size={18} />,
          color: "text-stone-600",
          bg: "bg-white",
          border: "border-stone-200",
        };
    }
  };

  return (
    <div
      className={`flex flex-col h-screen w-full max-w-md mx-auto ${THEME.bg} overflow-hidden font-sans text-stone-800`}
    >
      {/* 頂部 Header */}
      <header
        className={`${THEME.primary} text-white px-5 py-4 shadow-xl shrink-0 relative z-20`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
              <span className="text-amber-400">Winter</span> 名古屋冬季之旅
            </h1>
            <p className="text-xs text-red-200 mt-1">12/18 - 12/22 五天四夜</p>
          </div>
          <div className="flex gap-2">
            {activeTab === "schedule" && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`p-2 rounded-full transition-colors ${
                  isEditMode
                    ? "bg-amber-500 text-white"
                    : "bg-red-800 text-red-200"
                }`}
                aria-label={isEditMode ? "退出編輯模式" : "進入編輯模式"}
              >
                <Edit3 size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide bg-stone-50">
        {/* --- 行程 Tab --- */}
        {activeTab === "schedule" && (
          <div className="pb-10">
            {/* 日期選擇器 */}
            <div className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-sm pt-2 pb-2 px-2 shadow-sm border-b border-stone-200">
              <div className="flex space-x-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
                {tripData.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setCurrentDayId(day.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                      ${
                        currentDayId === day.id
                          ? "bg-red-900 text-white shadow-md transform scale-105"
                          : "bg-white text-stone-500 border border-stone-200"
                      }`}
                  >
                    {day.date.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 當日詳情 */}
            {tripData
              .filter((d) => d.id === currentDayId)
              .map((day) => (
                <div key={day.id} className="animate-fadeIn px-4 pt-4">
                  {/* 每日資訊卡 - 住宿導航使用 <button> 觸發 navigateTo */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                          {day.weather.icon === "sun" ? (
                            <Sun size={20} />
                          ) : (
                            <CloudSun size={20} />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-stone-800">
                            {day.weather.temp}
                          </div>
                          <div className="text-xs text-stone-500">
                            {day.weather.desc}
                          </div>
                        </div>
                      </div>
                      <div className="text-right max-w-[50%]">
                        <div className="flex items-center justify-end gap-1 text-xs text-amber-600 font-bold uppercase mb-0.5">
                          <BedDouble size={12} /> Hotel
                        </div>
                        <div className="flex items-center justify-end gap-1">
                          <div className="font-bold text-stone-800 text-xs truncate">
                            {day.hotel.name}
                          </div>
                          {/* 只有非續住/溫暖的家才顯示導航按鈕 */}
                          {day.hotel.name !== "續住" &&
                            day.hotel.name !== "溫暖的家" && (
                              <button
                                onClick={() =>
                                  navigateTo(
                                    day.hotel.name + " " + day.hotel.address
                                  )
                                }
                                className="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors shrink-0"
                                aria-label={`導航至 ${day.hotel.name}`}
                              >
                                <Navigation size={12} />
                              </button>
                            )}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Check-in: {day.hotel.checkIn}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs bg-stone-100 p-2 rounded text-stone-600 flex items-start gap-1">
                      <span className="shrink-0">👔</span> {day.weather.wear}
                    </div>
                  </div>

                  {/* 行程時間軸 */}
                  <div className="relative pb-4">
                    {day.events.map((event, idx) => {
                      const isLast = idx === day.events.length - 1;
                      const style = getEventStyle(event.type);
                      const canNavigate = event.type !== "transport"; // 只有非交通的項目才需要導航

                      // 交通事件的獨立樣式
                      if (event.type === "transport") {
                        return (
                          <div
                            key={event.id}
                            className="relative flex pl-2 pb-8"
                          >
                            {!isLast && (
                              <div className="absolute left-[19px] top-6 w-0.5 h-full border-l-2 border-dashed border-stone-300"></div>
                            )}

                            <div className="relative z-10 w-8 flex flex-col items-center pt-1">
                              <div className="bg-stone-200 text-stone-500 p-1.5 rounded-full ring-4 ring-stone-50">
                                {event.title.includes("飛機") ? (
                                  <Plane size={14} />
                                ) : event.title.includes("巴士") ? (
                                  <Bus size={14} />
                                ) : event.title.includes("走") ? (
                                  <Footprints size={14} />
                                ) : (
                                  <Train size={14} />
                                )}
                              </div>
                            </div>

                            <div className="flex-1 ml-4 pt-1">
                              <div className="text-xs font-bold text-stone-400 flex items-center gap-2">
                                {event.time}{" "}
                                <span className="h-px bg-stone-200 flex-1"></span>
                              </div>
                              <div className="text-sm font-bold text-stone-600 mt-1">
                                {event.title}
                              </div>
                              {event.note && (
                                <div className="text-xs text-stone-400 mt-0.5">
                                  {event.note}
                                </div>
                              )}

                              {isEditMode && (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => moveEvent(day.id, idx, "up")}
                                    className="p-1 bg-stone-200 rounded text-stone-600"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      moveEvent(day.id, idx, "down")
                                    }
                                    className="p-1 bg-stone-200 rounded text-stone-600"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteEvent(day.id, event.id)
                                    }
                                    className="p-1 bg-red-100 rounded text-red-600"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }

                      // 景點/美食/購物/休閒事件的獨立樣式
                      return (
                        <div
                          key={event.id}
                          className="relative flex pl-2 pb-10"
                        >
                          <div className="relative z-10 w-8 flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 border-stone-50 shadow-sm mt-1.5
                            ${
                              event.type === "food"
                                ? "bg-orange-400"
                                : event.type === "shopping"
                                ? "bg-pink-400"
                                : event.type === "relax"
                                ? "bg-indigo-400"
                                : "bg-red-600"
                            }`}
                            ></div>
                          </div>

                          <div
                            className={`flex-1 ml-4 ${style.bg} border ${style.border} rounded-xl p-4 shadow-sm relative overflow-hidden transition-transform active:scale-[0.99]`}
                          >
                            <div className="absolute top-0 right-0 bg-stone-100 text-[10px] font-bold text-stone-500 px-2 py-1 rounded-bl-lg">
                              {event.time}
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              {style.icon}
                              <h3
                                className={`font-bold text-lg ${style.color}`}
                              >
                                {event.title}
                              </h3>
                            </div>

                            {/* 景點/美食/購物/休閒的導航按鈕使用 <button> 觸發 navigateTo */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {event.highlight && (
                                <Tag
                                  text={event.highlight
                                    .replace("必吃：", "")
                                    .replace("必買：", "")
                                    .replace("必看：", "")}
                                  color="bg-amber-100 text-amber-800 border-amber-200"
                                />
                              )}
                              {canNavigate && (
                                <button
                                  onClick={() => navigateTo(event.title)}
                                  className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full border border-red-200 hover:bg-red-200 transition-colors"
                                  aria-label={`導航至 ${event.title}`}
                                >
                                  <Navigation size={10} /> 導航
                                </button>
                              )}
                            </div>

                            {event.guide && (
                              <div className="mt-3 bg-stone-50/80 rounded-lg p-3 border border-stone-100">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 mb-1">
                                  <Sparkles size={12} /> 筆記{" "}
                                  {/* 變更旅人筆記為 筆記 */}
                                </div>
                                <p className="text-xs text-stone-600 leading-5 whitespace-pre-line">
                                  {event.guide}
                                </p>
                              </div>
                            )}

                            {isEditMode && (
                              <div className="flex gap-2 mt-3 pt-2 border-t border-stone-100">
                                <button
                                  onClick={() => moveEvent(day.id, idx, "up")}
                                  className="p-1 bg-stone-100 rounded text-stone-600"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  onClick={() => moveEvent(day.id, idx, "down")}
                                  className="p-1 bg-stone-100 rounded text-stone-600"
                                >
                                  <ArrowDown size={14} />
                                </button>
                                <button
                                  onClick={() => deleteEvent(day.id, event.id)}
                                  className="p-1 bg-red-50 rounded text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                          {/* Time line connector */}
                          {!isLast && (
                            <div className="absolute left-[19px] top-8 w-0.5 h-full bg-stone-300"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* --- 記帳與工具 Tab (合併) --- */}
        {activeTab === "wallet" && (
          <div className="p-4 space-y-6">
            {/* 總覽卡片 */}
            <div className="bg-gradient-to-br from-red-900 to-red-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-lg font-bold opacity-90 mb-2 flex items-center gap-2">
                  <Wallet className="text-amber-400" /> 旅費總覽 (已換算台幣)
                </h2>
                <div className="text-5xl font-extrabold tracking-tight">
                  <span className="text-xl mr-1">NT$</span>
                  {Number(totalSpentTWD).toLocaleString()}
                </div>
                <p className="text-xs text-red-200 mt-2">
                  * 總額依每筆紀錄鎖定之匯率計算
                </p>
              </div>
            </div>

            {/* 匯率設定與換算 (整合區塊) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-4">
                <Banknote size={16} /> 匯率設定與換算
              </h3>

              {/* Manual Exchange Rate Input */}
              <div className="bg-red-50 rounded-lg p-3 flex items-center justify-between gap-2 text-sm border border-red-100 mb-3">
                <span className="text-red-700 font-bold shrink-0">
                  1 JPY (日幣) =
                </span>
                <input
                  type="number"
                  step="0.0001" // 提高精度
                  className="flex-1 bg-transparent text-center font-bold text-red-900 border-b border-red-300 focus:outline-none focus:border-amber-500"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  aria-label="手動輸入日幣對台幣匯率"
                />
                <span className="text-red-700 font-bold shrink-0">
                  TWD (台幣)
                </span>
              </div>

              {/* Query Button (使用 <a> 標籤導航至外部網站) */}
              <a
                href="https://rate.bot.com.tw/xrt?Lang=zh-TW"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center gap-1 text-xs text-stone-500 bg-stone-100 hover:bg-stone-200 p-2 rounded-lg mb-4 transition-colors"
              >
                查詢今日匯率 (台灣銀行) <ExternalLink size={12} />
              </a>

              {/* Quick Conversion */}
              <h4 className="text-xs font-bold text-stone-500 mb-2 mt-4 pt-4 border-t border-stone-100">
                快速換算
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-stone-50 rounded-xl p-3 border border-stone-200 focus-within:ring-2 ring-amber-400 transition-all">
                  <div className="text-[10px] text-stone-400 mb-1">
                    日幣 JPY
                  </div>
                  <input
                    type="number"
                    value={converterAmount}
                    onChange={(e) => setConverterAmount(e.target.value)}
                    className="w-full bg-transparent text-xl font-mono font-bold text-stone-800 outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="text-stone-300">=</div>
                <div className="flex-1 bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <div className="text-[10px] text-amber-600 mb-1">
                    台幣 TWD
                  </div>
                  <div className="text-xl font-mono font-bold text-amber-800">
                    {calculatedCost}
                  </div>
                </div>
              </div>
            </div>

            {/* 新增記帳區 */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="text-sm font-bold text-stone-700 mb-3">
                記上一筆
              </h3>
              <div className="space-y-3">
                {/* 日期與品項 */}
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-1/2 p-3 border border-stone-200 rounded-xl bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="品項 (如: 鰻魚飯三吃)"
                    className="w-1/2 p-3 border border-stone-200 rounded-xl bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={newExpense.item}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, item: e.target.value })
                    }
                  />
                </div>

                {/* 幣別與金額 */}
                <div className="flex gap-2">
                  <div className="relative w-24 shrink-0">
                    <select
                      className="w-full p-3 border border-stone-200 rounded-xl bg-stone-50 text-sm appearance-none font-bold text-center"
                      value={newExpense.currency}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          currency: e.target.value,
                        })
                      }
                    >
                      <option value="JPY">JPY (日幣)</option>
                      <option value="TWD">TWD (台幣)</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    placeholder="金額"
                    className="flex-1 p-3 border border-stone-200 rounded-xl bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={newExpense.cost}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, cost: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={addExpense}
                  className="w-full bg-stone-800 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  加入明細
                </button>
              </div>
            </div>

            {/* 紀錄列表 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-500 pl-1">
                消費紀錄
              </h3>
              {expenses.length === 0 && (
                <div className="text-center py-8 text-stone-300">
                  <div className="text-4xl mb-2">💴</div>
                  還沒有記帳喔
                </div>
              )}
              {expenses
                .slice()
                .reverse()
                .map((ex) => {
                  const isJPY = ex.currency === "JPY";
                  // 使用儲存的匯率進行計算
                  const rateToUse = ex.rateAtTimeOfEntry || 0; // 確保有值
                  const twdEquivalent = isJPY
                    ? (ex.cost * rateToUse).toFixed(0)
                    : ex.cost.toFixed(0);

                  return (
                    <div
                      key={ex.id}
                      className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-1">
                        {/* 品項 */}
                        <span className="text-stone-700 font-medium max-w-[60%] truncate">
                          {ex.item}
                        </span>

                        {/* 刪除按鈕 */}
                        <button
                          onClick={() => deleteExpense(ex.id)}
                          className="p-1 bg-red-50 rounded-full text-red-500 hover:bg-red-100 transition-colors shrink-0"
                          aria-label="刪除帳目"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* 日期與匯率 */}
                      <div className="flex justify-between items-end text-xs text-stone-400 border-t border-stone-50 pt-1">
                        <span className="font-mono">{ex.date}</span>
                        {isJPY && (
                          <span className="text-[10px] text-stone-400">
                            鎖定匯率: {rateToUse.toFixed(4)}
                          </span>
                        )}
                      </div>

                      {/* 金額與換算 */}
                      <div className="flex justify-end mt-1">
                        <div className="text-right">
                          <span className="font-mono text-stone-800 font-bold text-lg flex items-center justify-end">
                            {isJPY ? "¥" : "NT$"}
                            {ex.cost.toFixed(0)}
                          </span>
                          {isJPY && (
                            <span className="text-xs text-stone-500">
                              ≈ NT${twdEquivalent}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* --- 資訊 Tab (加入伴手禮清單) --- */}
        {activeTab === "info" && (
          <div className="p-4 space-y-6">
            {/* 航班資訊卡 */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="bg-indigo-900 p-4 text-white flex justify-between items-center">
                <div className="font-bold flex items-center gap-2">
                  <Plane size={18} /> 航班資訊
                </div>
                <div className="text-xs bg-indigo-800 px-2 py-1 rounded text-indigo-200">
                  Peach 樂桃
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* 去程 */}
                <div className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-black text-stone-800">
                      TPE
                    </span>
                    <span className="text-xs font-mono text-stone-400 mb-1 flex-1 text-center">
                      MM722 • 2h 30m
                    </span>
                    <span className="text-3xl font-black text-stone-800">
                      NGO
                    </span>
                  </div>
                  <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden flex">
                    <div className="w-1/2 bg-indigo-500 h-full"></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-stone-600 mt-2">
                    <span>12/18 02:55</span>
                    <span>06:25</span>
                  </div>
                </div>

                {/* 回程 */}
                <div className="relative pt-4 border-t border-stone-100">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-black text-stone-800">
                      NGO
                    </span>
                    <span className="text-xs font-mono text-stone-400 mb-1 flex-1 text-center">
                      MM723 • 3h 40m
                    </span>
                    <span className="text-3xl font-black text-stone-800">
                      TPE
                    </span>
                  </div>
                  <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden flex">
                    <div className="w-1/2 bg-indigo-500 h-full"></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-stone-600 mt-2">
                    <span>12/22 22:45</span>
                    <span>01:25 (+1)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 伴手禮 (從工具區移動過來) */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-200">
              <div className="bg-amber-400 p-3 text-white flex items-center gap-2">
                <ShoppingBag size={18} />
                <span className="font-bold">名古屋必買清單</span>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {SOUVENIR_LIST.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-0.5 bg-amber-100 text-amber-600 rounded p-0.5">
                        <CheckSquare size={14} />
                      </div>
                      <div>
                        <div className="font-bold text-stone-800 text-sm">
                          {item.name}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 緊急聯絡資訊 */}
            <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
              <h3 className="text-sm font-bold text-red-800 mb-4 flex items-center gap-2">
                <Phone size={16} /> 緊急求助電話
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {EMERGENCY_CONTACTS.map((c, i) => (
                  <a
                    key={i}
                    href={`tel:${c.phone}`}
                    className="bg-white p-3 rounded-xl shadow-sm border border-red-100 active:bg-red-50 transition-colors"
                  >
                    <div className="text-xs text-stone-400 mb-1">{c.name}</div>
                    <div className="text-base font-bold text-red-700 font-mono">
                      {c.phone}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部導航 */}
      <nav className="bg-white border-t border-stone-200 h-[80px] flex justify-around items-start pt-3 absolute bottom-0 w-full max-w-md z-30 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex flex-col items-center w-16 group ${
            activeTab === "schedule" ? "text-red-900" : "text-stone-400"
          }`}
        >
          <div
            className={`p-1.5 rounded-full transition-all ${
              activeTab === "schedule"
                ? "bg-red-50"
                : "group-active:bg-stone-50"
            }`}
          >
            <MapPin
              size={24}
              className={activeTab === "schedule" ? "fill-current" : ""}
            />
          </div>
          <span className="text-[10px] font-bold mt-1">行程</span>
        </button>
        <button
          onClick={() => setActiveTab("wallet")}
          className={`flex flex-col items-center w-16 group ${
            activeTab === "wallet" ? "text-red-900" : "text-stone-400"
          }`}
        >
          <div
            className={`p-1.5 rounded-full transition-all ${
              activeTab === "wallet" ? "bg-red-50" : "group-active:bg-stone-50"
            }`}
          >
            <Wallet
              size={24}
              className={activeTab === "wallet" ? "fill-current" : ""}
            />
          </div>
          <span className="text-[10px] font-bold mt-1">記帳</span>
        </button>
        <button
          onClick={() => setActiveTab("info")}
          className={`flex flex-col items-center w-16 group ${
            activeTab === "info" ? "text-red-900" : "text-stone-400"
          }`}
        >
          <div
            className={`p-1.5 rounded-full transition-all ${
              activeTab === "info" ? "bg-red-50" : "group-active:bg-stone-50"
            }`}
          >
            <Info
              size={24}
              className={activeTab === "info" ? "fill-current" : ""}
            />
          </div>
          <span className="text-[10px] font-bold mt-1">資訊</span>
        </button>
      </nav>
    </div>
  );
}
