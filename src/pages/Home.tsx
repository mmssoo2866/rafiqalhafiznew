import React from "react";
import { motion } from "motion/react";
import {
  Book,
  BookOpen,
  Check,
  CheckCircle,
  Clock,
  Compass,
  Flame,
  MapPin,
  Bell,
  Activity
} from "lucide-react";
import { PageProps } from "../types";
import { getSurahName, getSurahById, SURAHS } from "../quranData";

interface HomeProps extends PageProps {
  onDetectLocation: () => void;
  gpsLoading: boolean;
  prayerTimesList: any[];
  todayTasks: any[];
  repetitions: Record<string, number>;
  onDecrementRepetition: (id: string) => void;
  onToggleReviewComplete: (id: string) => void;
  onCompleteDay66: () => void;
  hasDay66: boolean;
  distributionSlots: any[];
  onCompleteKhatmahReview: () => void;
  onUpdateProfile: (changes: any) => void;
}

const Home: React.FC<HomeProps> = ({
  state,
  todayStr,
  onNavigateToMushaf,
  onToggleTab,
  onDetectLocation,
  gpsLoading,
  prayerTimesList,
  todayTasks,
  repetitions,
  onDecrementRepetition,
  onToggleReviewComplete,
  onCompleteDay66,
  hasDay66,
  distributionSlots,
  onCompleteKhatmahReview,
  onUpdateProfile
}) => {
  const userProfile = state.profile!;
  const memorizedVersesCount = state.blocks.reduce((sum, b) => sum + (b.toAyah - b.fromAyah + 1), 0) + (userProfile.previousHifzAyahsCount || 0);
  const quranCompletionPercent = ((Math.min(memorizedVersesCount, 6236) / 6236) * 100).toFixed(1);
  const totalCompletedReviewsCount = Object.values(state.completedReviews).reduce((sum: number, arr) => sum + (arr as string[]).length, 0);

  // Time-based Focus logic
  const now = new Date();
  const getActivePrayer = () => {
    const upcoming = prayerTimesList.find(p => p.time > now);
    if (!upcoming) return "العشاء";
    const fajr = prayerTimesList.find(p => p.name === "Fajr");
    if (fajr && now < fajr.time) return "الفجر";
    const mapping: Record<string, string> = { "Fajr": "الفجر", "Dhuhr": "الظهر", "Asr": "العصر", "Maghrib": "المغرب", "Isha": "العشاء" };
    return mapping[upcoming.name] || "الظهر";
  };

  const activePrayerName = getActivePrayer();
  const activeSlots = distributionSlots.filter(s => s.parentPrayer === activePrayerName);

  const nextPrayerFocusCard = distributionSlots.length > 0 && (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">الورد التالي</h3>
            <p className="text-xl font-bold font-serif text-emerald-950">{activePrayerName}</p>
          </div>
        </div>
        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100 font-bold uppercase">الآن</span>
      </div>

      <div className="space-y-2">
        {activeSlots.length === 0 ? (
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-[11px] text-gray-400 italic">لا توجد مراجعة مخصصة لهذا الوقت.</p>
          </div>
        ) : (
          activeSlots.map((slot) => (
            <div key={slot.id} className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 flex items-center justify-between border-r-4 border-r-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
                  {slot.rakahNumber}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold">{slot.prayerName}</p>
                  <h4 className="text-[13px] font-bold text-emerald-900">{slot.assignedContent}</h4>
                </div>
              </div>
              <button
                onClick={() => {
                  const match = slot.assignedContent.match(/سورة ([\u0600-\u06FF]+)(?:\s+\((\d+))?/);
                  const pageMatch = slot.assignedContent.match(/ص (\d+)/);
                  if (pageMatch) onToggleTab("mushaf");
                  else if (match) {
                    const found = SURAHS.find(s => s.name === match[1]);
                    if (found) onNavigateToMushaf(found.id, match[2] ? Number(match[2]) : 1);
                  }
                }}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      <button onClick={() => onToggleTab("review")} className="w-full py-2 bg-emerald-50 text-emerald-800 rounded-2xl text-[10px] font-bold border border-emerald-100">عرض الجدول الكامل ➔</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {hasDay66 && (
        <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-xl flex items-start space-x-3 space-x-reverse shadow-sm">
          <div className="p-1 bg-amber-500/10 rounded-lg text-amber-600"><Bell className="w-5 h-5 animate-bounce" /></div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-900 text-sm">مراجعة تراكمية كبرى (اليوم 66) 🌟</h4>
            <p className="text-xs text-amber-700 mt-1">اليوم هو يوم مراجعة كامل لجميع محفوظاتك. تم إيقاف مقرر الحفظ الجديد مؤقتاً.</p>
            <button onClick={onCompleteDay66} disabled={state.fullReviewDates.includes(todayStr)} className={`mt-3 px-4 py-2 rounded-xl text-xs font-bold transition ${state.fullReviewDates.includes(todayStr) ? "bg-emerald-100 text-emerald-800" : "bg-amber-600 text-white hover:bg-amber-700"}`}>
              {state.fullReviewDates.includes(todayStr) ? "✓ تم إكمال المراجعة" : "إتمام المراجعة واستئناف الحفظ ➔"}
            </button>
          </div>
        </div>
      )}

      {userProfile.appTrack === "review_only" ? (
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30"><Activity className="w-6 h-6 text-amber-300" /></div>
                <div><h3 className="text-xl font-bold font-serif">لوحة التحكم (المراجعة)</h3><p className="text-xs text-emerald-200">إدارة الورد اليومي</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-300 uppercase">نقطة البداية</label>
                  <div className="flex gap-2">
                    <input type="number" value={userProfile.reviewOnlyCurrentPage} onChange={(e) => onUpdateProfile({ reviewOnlyCurrentPage: Number(e.target.value) })} className="bg-emerald-800/50 border border-emerald-700 rounded-xl px-4 py-2 w-full font-bold outline-none" />
                    <button onClick={() => onToggleTab("mushaf")} className="bg-amber-500 text-emerald-950 p-2 rounded-xl"><BookOpen className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-300 uppercase">الورد اليومي (صفحات)</label>
                  <select value={userProfile.reviewOnlyDailyAmountValue} onChange={(e) => onUpdateProfile({ reviewOnlyDailyAmountValue: Number(e.target.value) })} className="bg-emerald-800/50 border border-emerald-700 rounded-xl px-4 py-2 w-full font-bold outline-none">
                    {[1, 2, 5, 10, 20, 30, 40, 60].map(v => <option key={v} value={v} className="bg-emerald-900">{v} صفحات</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* NEXT PRAYER FOCUS - LOCATION 1 (Review Only) */}
          {nextPrayerFocusCard}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-600" /><span>الإنجاز اليومي</span></h3>
            <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
              <div><p className="text-sm text-emerald-800 font-medium">مقرر مراجعة اليوم</p><h4 className="text-xl font-bold text-emerald-950 mt-1">الصفحة {userProfile.reviewOnlyCurrentPage}</h4></div>
              <button onClick={onCompleteKhatmahReview} disabled={state.profile?.reviewOnlyCompletedDates?.includes(todayStr)} className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${state.profile?.reviewOnlyCompletedDates?.includes(todayStr) ? "bg-emerald-100 text-emerald-700" : "bg-emerald-700 text-white hover:bg-emerald-800"}`}>
                {state.profile?.reviewOnlyCompletedDates?.includes(todayStr) ? "تم إتمام الورد اليوم ✨" : "إتمام ورد المراجعة اليوم ✅"}
              </button>
            </div>
          </div>

          {/* ADDED FOR REVIEW ONLY: Prayer Times and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
              <h3 className="text-lg font-serif font-bold text-emerald-900 border-b pb-3">🕌 مواقيت الصلاة</h3>
              <div className="space-y-2">
                {prayerTimesList.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50">
                    <span className="font-semibold">{p.arabicName}</span>
                    <span className="font-mono font-bold">{p.time.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))}
              </div>
              <button onClick={onDetectLocation} disabled={gpsLoading} className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition">
                <Compass className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} /> تحديث GPS
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4 text-right">
              <h3 className="text-lg font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3 flex items-center justify-between"><span>📊 الإحصائيات والتقدم العام</span><Activity className="w-5 h-5 text-emerald-600" /></h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-[10px] text-gray-500">إجمالي الحفظ</p><p className="text-lg font-bold text-emerald-900">{memorizedVersesCount} آية</p></div>
                <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-[10px] text-gray-500">أيام الاستمرار</p><p className="text-lg font-bold text-amber-600">{userProfile.streakDays} يوم</p></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4 text-right">
              <h3 className="text-lg font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3">🔁 عداد التكرار لحفظ اليوم الجديد</h3>
              {todayTasks.filter(t => t.type === "memorization").length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center text-gray-500"><Book className="w-10 h-10 text-emerald-600/30" /><p className="text-sm">لا يوجد مقرر حفظ مضاف اليوم.</p></div>
              ) : (
                todayTasks.filter(t => t.type === "memorization").map((task: any) => {
                  const remCount = repetitions[task.block.id] ?? task.block.repetitionTarget;
                  const isTargetMet = remCount === 0;
                  const pct = ((task.block.repetitionTarget - remCount) / task.block.repetitionTarget) * 100;
                  return (
                    <div key={task.block.id} className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
                      <div className="text-center md:text-right"><h4 className="text-xl font-bold text-gray-800">سورة {getSurahName(task.block.surahId)}</h4><p className="text-sm text-gray-500">الآيات من {task.block.fromAyah} إلى {task.block.toAyah}</p></div>
                      <div className="relative flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="#e1e8e4" strokeWidth="5" fill="transparent" />
                          <circle cx="64" cy="64" r="58" stroke="#10b981" strokeWidth="5" fill="transparent" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - pct / 100)} className="transition-all" />
                        </svg>
                        <button onClick={() => onDecrementRepetition(task.block.id)} disabled={isTargetMet} className={`absolute w-24 h-28 rounded-full flex flex-col items-center justify-center ${isTargetMet ? "text-emerald-800" : "text-emerald-700"}`}>
                          {isTargetMet ? <Check className="w-8 h-8" /> : <span className="text-3xl font-bold">{remCount}</span>}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
              <h3 className="text-lg font-serif font-bold text-emerald-900 border-b pb-3">🕌 مواقيت الصلاة</h3>
              <div className="space-y-2">
                {prayerTimesList.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50">
                    <span className="font-semibold">{p.arabicName}</span>
                    <span className="font-mono font-bold">{p.time.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))}
              </div>
              <button onClick={onDetectLocation} disabled={gpsLoading} className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition">
                <Compass className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} /> تحديث GPS
              </button>
            </div>
          </div>

          {/* NEXT PRAYER FOCUS - LOCATION 2 (Hifz Track) */}
          {nextPrayerFocusCard}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4 text-right">
            <h3 className="text-lg font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3 flex items-center justify-between"><span>📊 الإحصائيات والتقدم العام</span><Activity className="w-5 h-5 text-emerald-600" /></h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-[10px] text-gray-500">إجمالي الحفظ</p><p className="text-lg font-bold text-emerald-900">{memorizedVersesCount} آية</p></div>
              <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-[10px] text-gray-500">نسبة الختمة</p><p className="text-lg font-bold text-emerald-900">{quranCompletionPercent}%</p></div>
              <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-[10px] text-gray-500">المراجعات المكتملة</p><p className="text-lg font-bold text-emerald-900">{totalCompletedReviewsCount}</p></div>
              <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-[10px] text-gray-500">أيام الاستمرار</p><p className="text-lg font-bold text-amber-600">{userProfile.streakDays} يوم</p></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4 text-right">
            <h3 className="text-xl font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3">📅 جدول مراجعات اليوم</h3>
            {todayTasks.filter(t => t.type === "review").length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-gray-500"><CheckCircle className="w-8 h-8 text-emerald-600/35" /><p className="text-sm font-semibold">لا توجد مراجعات مستحقة اليوم.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayTasks.filter(t => t.type === "review").map((task: any) => (
                  <div key={task.block.id} className={`p-4 rounded-2xl border flex items-center justify-between ${task.isCompleted ? "bg-emerald-50/40 opacity-75" : "bg-white border-gray-200"}`}>
                    <div className="text-right"><h4 className="text-sm font-bold">سورة {getSurahName(task.block.surahId)}</h4><p className="text-xs text-gray-500">آية {task.block.fromAyah}-{task.block.toAyah} (يوم {task.offset})</p></div>
                    <button onClick={() => onToggleReviewComplete(task.block.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${task.isCompleted ? "bg-emerald-600 text-white" : "bg-white border text-gray-700"}`}>{task.isCompleted ? "تمت" : "إتمام"}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Home;

