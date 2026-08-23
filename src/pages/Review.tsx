import React from "react";
import { motion } from "motion/react";
import { RotateCcw, CheckCircle, Compass, Check, BookOpen } from "lucide-react";
import { PageProps } from "../types";
import { getSurahName, SURAHS } from "../quranData";

interface ReviewProps extends PageProps {
  todayTasks: any[];
  onToggleReviewComplete: (id: string) => void;
  cumulativeGroups: any[];
  distributionSlots: any[];
  onUpdateReviewProgress: (idx: number) => void;
  onSetMushafPage?: (p: number) => void;
  onToggleTab: (tab: any) => void;
}

const Review: React.FC<ReviewProps> = ({
  state,
  todayStr,
  onNavigateToMushaf,
  todayTasks,
  onToggleReviewComplete,
  cumulativeGroups,
  distributionSlots,
  onUpdateReviewProgress,
  onSetMushafPage,
  onToggleTab
}) => {
  const isReviewOnly = state.profile?.appTrack === "review_only";
  const currentProgress = state.reviewProgress[todayStr] || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-right" dir="rtl"
    >
      <div className="bg-emerald-800 text-white rounded-3xl p-6 shadow-md space-y-2">
        <h3 className="text-xl font-serif font-bold flex items-center gap-2">
          <RotateCcw className="w-6 h-6" />
          <span>{isReviewOnly ? "توزيع ورد الختمة على الصلوات" : "هيكل المراجعة والركعات"}</span>
        </h3>
        <p className="text-xs text-emerald-100 leading-relaxed">
          {isReviewOnly ? "توزيع صفحات الختمة بشكل متساوٍ على ركعات اليوم." : "نظام المراجعة المتباعدة الموزع آلياً على ركعات صلواتك."}
        </p>
      </div>

      {/* RAKAH DISTRIBUTION MAP (Moved from Prayers Page) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
        <h3 className="text-lg font-serif font-bold text-emerald-900 border-b pb-3 flex justify-between items-center">
          <span>📿 خريطة توزيع الركعات اليومية</span>
          <Compass className="w-5 h-5 text-emerald-600" />
        </h3>

        {distributionSlots.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">لا يوجد ورد مراجعة موزع على الصلوات حالياً.</p>
        ) : (
          <div className="space-y-6">
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-800">إنجاز ركعات المراجعة: {currentProgress} / {distributionSlots.length}</span>
              <div className="w-32 h-1.5 bg-white rounded-full overflow-hidden border border-emerald-100">
                <div className="h-full bg-emerald-600 transition-all" style={{ width: `${(currentProgress / distributionSlots.length) * 100}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {distributionSlots.map((slot, idx) => {
                const isCompleted = currentProgress > idx;
                const isCurrent = currentProgress === idx;
                return (
                  <div key={slot.id} className={`p-3 rounded-2xl border transition-all flex justify-between gap-3 ${isCompleted ? "bg-emerald-50/30 opacity-60" : isCurrent ? "bg-white border-amber-500 shadow-sm ring-1 ring-amber-500/10 scale-[1.01]" : "bg-gray-50 border-gray-100"}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-700">{slot.prayerName}</span>
                        <span className="text-[9px] text-gray-400">ركعة {slot.rakahNumber}</span>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-900 bg-white/50 px-2 py-1 rounded-lg border border-emerald-50 mt-1">{slot.assignedContent}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => {
                        // Track 1 pattern: سورة البقرة (1-5)
                        const surahMatch = slot.assignedContent.match(/سورة ([\u0600-\u06FF]+)(?:\s+\((\d+))?/);
                        // Track 2 pattern: ص (\d+)
                        const pageMatch = slot.assignedContent.match(/ص (\d+)/);

                        if (pageMatch && onSetMushafPage) {
                          onSetMushafPage(Number(pageMatch[1]));
                          onToggleTab("mushaf");
                        } else if (surahMatch) {
                          const found = SURAHS.find(s => s.name === surahMatch[1]);
                          const ayah = surahMatch[2] ? Number(surahMatch[2]) : 1;
                          if (found) onNavigateToMushaf(found.id, ayah);
                        }
                      }} className="p-1.5 bg-white border border-gray-200 rounded-lg text-emerald-700 shadow-sm hover:bg-emerald-50 transition"><BookOpen className="w-3.5 h-3.5" /></button>
                      <button onClick={() => onUpdateReviewProgress(isCompleted ? idx : idx + 1)} className={`p-1.5 rounded-lg border transition-all ${isCompleted ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white text-gray-400 border-gray-300"}`}><Check className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!isReviewOnly && (
        /* ORIGINAL TRACK 1 REVIEW LISTS (Only for Hifz Track) */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
              <h4 className="text-lg font-serif font-bold text-emerald-900 border-b pb-2">🔥 مراجعة مكثفة (2-10)</h4>
              {todayTasks.filter(t => t.type === "review" && t.offset <= 10).length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">لا يوجد مراجعات مكثفة اليوم.</p>
              ) : (
                <div className="space-y-2">
                  {todayTasks.filter(t => t.type === "review" && t.offset <= 10).map(t => (
                    <div key={t.block.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs font-bold">سورة {getSurahName(t.block.surahId)}</span>
                      <button onClick={() => onToggleReviewComplete(t.block.id)} className={`px-3 py-1 rounded-lg text-xs font-bold ${t.isCompleted ? "bg-emerald-600 text-white" : "bg-white border text-gray-700"}`}>{t.isCompleted ? "✓" : "إتمام"}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
              <h4 className="text-lg font-serif font-bold text-emerald-900 border-b pb-2">🌌 مراجعة متباعدة (12-66)</h4>
              {todayTasks.filter(t => t.type === "review" && t.offset > 10).length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">لا توجد مراجعات متباعدة اليوم.</p>
              ) : (
                <div className="space-y-2">
                  {todayTasks.filter(t => t.type === "review" && t.offset > 10).map(t => (
                    <div key={t.block.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs font-bold">سورة {getSurahName(t.block.surahId)}</span>
                      <button onClick={() => onToggleReviewComplete(t.block.id)} className={`px-3 py-1 rounded-lg text-xs font-bold ${t.isCompleted ? "bg-emerald-600 text-white" : "bg-white border text-gray-700"}`}>{t.isCompleted ? "✓" : "إتمام"}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
            <h3 className="text-lg font-serif font-bold text-emerald-900 border-b pb-3">🧠 المجموعات التراكمية الكبرى</h3>
            {cumulativeGroups.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">سيتم تعيين المجموعات تلقائياً عند إضافة المزيد من المقررات.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cumulativeGroups.map(g => (
                  <div key={g.id} className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl space-y-3">
                    <div className="justify-between font-bold text-sm text-emerald-950 flex items-center">
                      <span>{g.name}</span>
                      <span className="bg-emerald-100 px-2 rounded">{g.blocks.length}</span>
                    </div>
                    <button onClick={() => onNavigateToMushaf(g.blocks[0].surahId, g.blocks[0].fromAyah)} className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold">مراجعة المجموعة بالمصحف 📖</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Review;


