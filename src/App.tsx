import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Clock,
  Compass, 
  Plus,
  RotateCcw, 
  Settings as SettingsIcon,
  Calendar as CalendarIcon,
  Info,
  Flame
} from "lucide-react";
import { AnimatePresence } from "motion/react";

import { getLocalDateKey, loadAppState, logActivity, DEFAULT_PROFILE } from "./storage";
import { getTasksForDate, getCumulativeGroups, hasDay66TriggerToday } from "./scheduler";
import { getPageForAyah } from "./quranData";
import { calculateTodayPrayers, distributeReviewsToPrayers, distributeKhatmahReviewToPrayers } from "./prayerEngine";
import { useAppActions } from "./hooks/useAppActions";
import { TabType } from "./types";

// Page Components
import Home from "./pages/Home";
import Hifz from "./pages/Hifz";
import Review from "./pages/Review";
import Prayers from "./pages/Prayers";
import Mushaf from "./pages/Mushaf";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Onboarding from "./components/Onboarding";

// For PWA installation
let deferredPrompt: any = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

export default function App() {
  const {
    state,
    setState,
    updateState,
    handleDecrementRepetition,
    handleToggleReviewComplete,
    handleUpdateReviewProgress,
    handleCompleteDay66,
    handleAddHifz,
    handleDeleteBlock,
    handleToggleBlockStatus,
    handleDetectLocation,
    handleCompleteKhatmahReviewToday,
    handleResetApp,
    handleExportBackup,
    handleImportBackup
  } = useAppActions();

  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [todayStr, setTodayStr] = useState<string>(getLocalDateKey());
  const [gpsLoading, setGpsLoading] = useState(false);
  const [mushafPage, setMushafPage] = useState<number>(1);
  const [mushafViewMode, setMushafViewMode] = useState<"image" | "offline">("image");
  const [newHifz, setNewHifz] = useState({ surahId: 1, fromAyah: 1, toAyah: 7, repetitions: 100 });
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    setState(loadAppState());
    const interval = setInterval(() => setTodayStr(getLocalDateKey()), 60000);

    // Install prompt reminder logic: Check every 5 minutes
    const installReminder = setInterval(() => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (!isStandalone && deferredPrompt) {
        setShowInstallPrompt(true);
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(installReminder);
    };
  }, [setState]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
      setShowInstallPrompt(false);
    }
  };

  if (!state) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-emerald-950 font-serif">جاري التحميل...</div>;

  // If onboarding is not completed, we show the onboarding screen and skip the dashboard logic to prevent crashes
  if (!state.onboardingCompleted) {
    const handleOnboardingSubmit = (data: any) => {
      const updated = { ...state, profile: { ...DEFAULT_PROFILE, ...data }, onboardingCompleted: true };
      updateState(logActivity(updated, "التهيئة", "تم إعداد التطبيق بنجاح."));
    };
    return <Onboarding onSubmit={handleOnboardingSubmit} />;
  }

  const userProfile = state.profile!;
  const todayTasks = getTasksForDate(state, todayStr);
  const prayerTimesList = calculateTodayPrayers(userProfile);
  const distributionSlots = userProfile.appTrack === "review_only"
    ? distributeKhatmahReviewToPrayers(userProfile)
    : distributeReviewsToPrayers(todayTasks, userProfile);

  const onNavigateToMushaf = (sId: number, aNum: number) => {
    const page = getPageForAyah(sId, aNum);
    setMushafPage(page);
    setActiveTab("mushaf");
  };

  const commonProps = { state, todayStr, onUpdateState: updateState, onNavigateToMushaf, onToggleTab: setActiveTab, onSetMushafPage: setMushafPage };

  const updateProfile = (changes: any) => {
    updateState({ ...state, profile: { ...userProfile, ...changes } });
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-gray-800 font-sans flex flex-col antialiased select-none" dir="rtl">

      <header className="bg-emerald-900 text-white shadow-md p-4 shrink-0 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500 rounded-xl flex items-center justify-center text-xl">📖</div>
            <div>
              <h1 className="text-xl font-bold font-serif flex items-center gap-2">
                رفيق الحافظ <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-sans">v2.1.5</span>
                <button onClick={() => setActiveTab("about")} className="mr-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">عن التطبيق</button>
              </h1>
              <p className="text-[10px] text-emerald-200">الجدولة التفاعلية والمراجعة المدمجة بالصلوات</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-emerald-950/40 p-2 rounded-2xl border border-emerald-800/40">
            <div className="px-3 text-center border-l border-emerald-800">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span className="font-bold">{userProfile.streakDays}</span>
              </div>
              <p className="text-[8px] text-emerald-200 uppercase">أيام</p>
            </div>
            <div className="px-3 text-center">
              <div className="font-bold text-amber-100">{state.blocks.length}</div>
              <p className="text-[8px] text-emerald-200 uppercase">مقررات</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "home" && <Home {...commonProps} onDetectLocation={handleDetectLocation} gpsLoading={gpsLoading} prayerTimesList={prayerTimesList} todayTasks={todayTasks} repetitions={state.repetitions} onDecrementRepetition={handleDecrementRepetition} onToggleReviewComplete={handleToggleReviewComplete} onCompleteDay66={handleCompleteDay66} hasDay66={hasDay66TriggerToday(state, todayStr)} distributionSlots={distributionSlots} onCompleteKhatmahReview={handleCompleteKhatmahReviewToday} onUpdateProfile={updateProfile} />}
          {activeTab === "hifz" && <Hifz {...commonProps} newHifz={newHifz} setNewHifz={setNewHifz} onAddHifz={(e) => { e.preventDefault(); handleAddHifz(newHifz.surahId, newHifz.fromAyah, newHifz.toAyah, newHifz.repetitions); }} onDeleteBlock={handleDeleteBlock} onToggleBlockStatus={handleToggleBlockStatus} deletingBlockId={deletingBlockId} setDeletingBlockId={setDeletingBlockId} />}
          {activeTab === "review" && <Review {...commonProps} todayTasks={todayTasks} onToggleReviewComplete={handleToggleReviewComplete} cumulativeGroups={getCumulativeGroups(state.blocks)} distributionSlots={distributionSlots} onUpdateReviewProgress={handleUpdateReviewProgress} />}
          {activeTab === "calendar" && <Calendar {...commonProps} />}
          {activeTab === "mushaf" && <Mushaf {...commonProps} mushafPage={mushafPage} setMushafPage={setMushafPage} mushafViewMode={mushafViewMode} setMushafViewMode={setMushafViewMode} />}
          {activeTab === "settings" && <Settings {...commonProps} onExportBackup={handleExportBackup} onImportBackup={handleImportBackup} onResetApp={handleResetApp} />}
          {activeTab === "about" && <About onClose={() => setActiveTab("home")} />}
        </AnimatePresence>
      </main>

      {/* PWA Installation Prompt Reminder */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 inset-x-4 z-50 bg-emerald-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-emerald-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl shadow-inner">📖</div>
              <div>
                <h4 className="text-sm font-bold">ثبت رفيق الحافظ على جوالك</h4>
                <p className="text-[10px] text-emerald-200">للوصول السريع وتجربة أفضل</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowInstallPrompt(false)} className="px-3 py-2 text-xs font-bold text-emerald-300">لاحقاً</button>
              <button onClick={handleInstallClick} className="px-4 py-2 bg-amber-500 text-emerald-950 rounded-xl text-xs font-bold shadow-md">تثبيت الآن</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg py-2 z-40">
        <div className="max-w-md mx-auto flex justify-around">
          {[
            { id: "home", icon: Clock, label: "الرئيسية" },
            ...(userProfile?.appTrack !== "review_only" ? [{ id: "hifz", icon: Plus, label: "الحفظ" }] : []),
            { id: "review", icon: RotateCcw, label: "المراجعة" },
            { id: "calendar", icon: CalendarIcon, label: "التقويم" },
            { id: "mushaf", icon: BookOpen, label: "المصحف" },
            { id: "settings", icon: SettingsIcon, label: "الإعدادات" }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex flex-col items-center gap-1 transition ${activeTab === tab.id ? "text-emerald-700" : "text-gray-400"}`}>
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
