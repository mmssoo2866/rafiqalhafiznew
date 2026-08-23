import React from "react";
import { motion } from "motion/react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { PageProps } from "../types";
import { getSurahName, SURAHS, getSurahById } from "../quranData";

interface HifzProps extends PageProps {
  newHifz: any;
  setNewHifz: (val: any) => void;
  onAddHifz: (e: React.FormEvent) => void;
  onDeleteBlock: (id: string) => void;
  onToggleBlockStatus: (id: string) => void;
  deletingBlockId: string | null;
  setDeletingBlockId: (id: string | null) => void;
}

const Hifz: React.FC<HifzProps> = ({
  state,
  onNavigateToMushaf,
  newHifz,
  setNewHifz,
  onAddHifz,
  onDeleteBlock,
  onToggleBlockStatus,
  deletingBlockId,
  setDeletingBlockId
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right" dir="rtl">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
          <h3 className="text-lg font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            <span>تسجيل مقرر حفظ جديد</span>
          </h3>

          <form onSubmit={onAddHifz} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">اختر السورة</label>
              <select
                value={newHifz.surahId}
                onChange={(e) => {
                  const sId = Number(e.target.value);
                  const surah = getSurahById(sId);
                  setNewHifz({ ...newHifz, surahId: sId, fromAyah: 1, toAyah: surah ? Math.min(10, surah.ayahs) : 10 });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold"
              >
                {SURAHS.map((s) => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">من آية</label>
                <input
                  type="number"
                  value={newHifz.fromAyah}
                  onChange={(e) => setNewHifz({ ...newHifz, fromAyah: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-center bg-gray-50 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">إلى آية</label>
                <input
                  type="number"
                  value={newHifz.toAyah}
                  onChange={(e) => setNewHifz({ ...newHifz, toAyah: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-center bg-gray-50 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">التكرارات لليوم الأول</label>
              <input
                type="number"
                value={newHifz.repetitions}
                onChange={(e) => setNewHifz({ ...newHifz, repetitions: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-center bg-gray-50 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">تاريخ بداية المقرر</label>
              <input
                type="date"
                value={newHifz.startDate}
                onChange={(e) => setNewHifz({ ...newHifz, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold text-right"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition shadow-md">حفظ المقرر ➔</button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
          <h3 className="text-xl font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3">🗂️ مقرراتك المتابعـة ({state.blocks.length})</h3>
          {state.blocks.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <BookOpen className="w-12 h-12 opacity-20" />
              <p className="text-sm mt-2">ليس لديك أي مقررات حفظ حالياً.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {state.blocks.map((block) => (
                <div key={block.id} className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${block.status === "completed" ? "bg-gray-50 opacity-60" : "bg-white"}`}>
                  <div className="space-y-1">
                    <h4 className="font-bold">سورة {getSurahName(block.surahId)}</h4>
                    <p className="text-xs text-gray-500">من آية {block.fromAyah} إلى {block.toAyah}</p>
                    <p className="text-[10px] text-gray-400">بدأ في: {block.startDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onNavigateToMushaf(block.surahId, block.fromAyah)} className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">المصحف</button>
                    <button onClick={() => onToggleBlockStatus(block.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${block.status === "completed" ? "bg-amber-50 text-amber-800" : "bg-emerald-100 text-emerald-900"}`}>{block.status === "completed" ? "تنشيط" : "إتمام"}</button>
                    {deletingBlockId === block.id ? (
                      <button onClick={() => onDeleteBlock(block.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold">تأكيد</button>
                    ) : (
                      <button onClick={() => setDeletingBlockId(block.id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Hifz;
