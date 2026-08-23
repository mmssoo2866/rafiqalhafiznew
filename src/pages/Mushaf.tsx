import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { PageProps } from "../types";
import { SURAHS, getSurahById, getPageForAyah, PAGE_START_AYAH } from "../quranData";

interface MushafProps extends PageProps {
  mushafPage: number;
  setMushafPage: (p: number) => void;
  mushafViewMode: "image" | "offline";
  setMushafViewMode: (m: "image" | "offline") => void;
}

const Mushaf: React.FC<MushafProps> = ({ state, todayStr, mushafPage, setMushafPage, mushafViewMode, setMushafViewMode, onUpdateState, onNavigateToMushaf, onToggleTab }) => {
  const currentSurahId = SURAHS.slice().reverse().find(s => mushafPage >= s.startPage)?.id || 1;
  const currentSurah = getSurahById(currentSurahId);
  const [tempAyah, setTempAyah] = React.useState<string>("1");

  // Sync tempAyah when page changes (e.g. via buttons)
  // We find the first ayah on this page to display
  React.useEffect(() => {
    if (mushafPage >= 1 && mushafPage <= 604) {
      const [sId, aNum] = PAGE_START_AYAH[mushafPage - 1];
      if (sId === currentSurahId) {
        setTempAyah(String(aNum));
      } else {
        setTempAyah("1");
      }
    }
  }, [mushafPage, currentSurahId]);

  const handleAyahInput = (val: string) => {
    setTempAyah(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      const safeAyah = Math.min(currentSurah?.ayahs || 1, num);
      const page = getPageForAyah(currentSurahId, safeAyah);
      if (page !== mushafPage) {
        setMushafPage(page);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-right" dir="rtl"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-serif font-bold text-emerald-900">📘 المصحف الشريف</h3>
          <div className="flex gap-2">
            <button onClick={() => setMushafViewMode("image")} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${mushafViewMode === "image" ? "bg-emerald-800 text-white" : "bg-gray-100 text-gray-600"}`}>مصور</button>
            <button onClick={() => setMushafViewMode("offline")} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${mushafViewMode === "offline" ? "bg-emerald-800 text-white" : "bg-gray-100 text-gray-600"}`}>فهرس</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400">السورة</label>
            <select
              value={currentSurahId}
              onChange={(e) => {
                const sId = Number(e.target.value);
                const s = getSurahById(sId);
                if (s) {
                  setMushafPage(s.startPage);
                  setTempAyah("1");
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
            >
              {SURAHS.map(s => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400">الآية (1-{currentSurah?.ayahs})</label>
            <input
              type="number"
              value={tempAyah}
              onChange={(e) => handleAyahInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-center font-mono font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400">رقم الصفحة</label>
            <input
              type="number"
              value={mushafPage}
              onChange={(e) => {
                const p = Number(e.target.value);
                if (!isNaN(p)) setMushafPage(Math.max(1, Math.min(604, p)));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-center font-mono font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                const isCached = state.mushafCache.includes(mushafPage);
                const updated = { ...state, mushafCache: isCached ? state.mushafCache.filter(p => p !== mushafPage) : [...state.mushafCache, mushafPage] };
                onUpdateState(updated);
              }}
              className={`w-full py-2 px-3 border rounded-xl text-xs font-bold transition ${state.mushafCache.includes(mushafPage) ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-gray-300 text-gray-500"}`}
            >
              {state.mushafCache.includes(mushafPage) ? "محفوظة ✓" : "حفظ الصفحة"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#f0ede6] min-h-[600px] border-4 border-[#3a352c]/20 shadow-lg rounded-3xl p-4 flex justify-between items-center gap-4 relative">
        <button onClick={() => mushafPage > 1 && setMushafPage(mushafPage - 1)} className="p-3 bg-[#e2dec9] hover:bg-[#d5d0b6] rounded-full shadow-inner"><ChevronRight className="w-6 h-6" /></button>
        <div className="flex-1 w-full bg-white rounded-2xl shadow-sm p-4 min-h-[500px] flex flex-col justify-center items-center overflow-hidden">
          {mushafViewMode === "image" ? (
            <img
              src={`https://android.quran.com/data/width_1260/page${String(mushafPage).padStart(3, "0")}.png`}
              alt={`Page ${mushafPage}`}
              className="max-h-[75vh] w-auto object-contain select-none"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("files.quran.app")) {
                  target.src = `https://files.quran.app/hafs/madani/width_1260/page${String(mushafPage).padStart(3, "0")}.png`;
                }
              }}
            />
          ) : (
            <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SURAHS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setMushafPage(s.startPage);
                      setMushafViewMode("image");
                    }}
                    className="p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-2xl transition-all text-right group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-400 group-hover:text-emerald-600 font-bold">{s.id}</span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-lg border border-gray-100 group-hover:border-emerald-100 text-gray-500 group-hover:text-emerald-700">ص {s.startPage}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 group-hover:text-emerald-900">سورة {s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button onClick={() => mushafPage < 604 && setMushafPage(mushafPage + 1)} className="p-3 bg-[#e2dec9] hover:bg-[#d5d0b6] rounded-full shadow-inner"><ChevronLeft className="w-6 h-6" /></button>
      </div>
    </motion.div>
  );
};

export default Mushaf;
