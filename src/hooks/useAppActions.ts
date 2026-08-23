import { useState, useCallback } from "react";
import { AppState, UserProfile, loadAppState, saveAppState, logActivity, getLocalDateKey, formatDateKey, MemorizationBlock, CompletedReviews } from "../storage";
import { getSurahById, getSurahName, getPageForAyah } from "../quranData";

export const useAppActions = () => {
  const [state, setState] = useState<AppState | null>(null);

  const updateState = useCallback((updated: AppState) => {
    setState(updated);
    saveAppState(updated);
  }, []);

  const incrementStreakIfNeeded = useCallback((currentState: AppState): AppState => {
    if (!currentState.profile) return currentState;
    const todayStr = getLocalDateKey();
    if (currentState.profile.lastActiveDate === todayStr) return currentState;

    const activeDays = currentState.profile.activeDays || [0, 1, 2, 3, 4, 5, 6];

    // Find the last active day before today
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    let prevActiveDayStr = "";

    // Look back up to 7 days to find the previous scheduled active day
    for (let i = 1; i <= 7; i++) {
        const d = new Date(checkDate);
        d.setDate(d.getDate() - i);
        if (activeDays.includes(d.getDay())) {
            prevActiveDayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            break;
        }
    }

    let newStreak = currentState.profile.streakDays;
    if (currentState.profile.lastActiveDate === prevActiveDayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    return {
      ...currentState,
      profile: {
        ...currentState.profile,
        streakDays: newStreak,
        lastActiveDate: todayStr
      }
    };
  }, []);

  const handleDecrementRepetition = useCallback((blockId: string) => {
    if (!state) return;
    const block = state.blocks.find(b => b.id === blockId);
    const currentVal = state.repetitions[blockId] ?? block?.repetitionTarget ?? 0;
    if (currentVal <= 0) return;

    const newVal = currentVal - 1;
    let updatedState = {
      ...state,
      repetitions: {
        ...state.repetitions,
        [blockId]: newVal
      }
    };

    if (newVal === 0) {
      const sName = block ? getSurahName(block.surahId) : "";
      const target = block?.repetitionTarget ?? 0;
      updatedState = incrementStreakIfNeeded(updatedState);
      updatedState = logActivity(updatedState, "إكمال تكرار الحفظ", `تبارك الله! أكملت الـ ${target} تكراراً لمقرر سورة ${sName} بنجاح.`);
    }

    updateState(updatedState);
  }, [state, updateState, incrementStreakIfNeeded]);

  const handleToggleReviewComplete = useCallback((blockId: string) => {
    if (!state) return;
    const todayStr = getLocalDateKey();
    const todayList = state.completedReviews[todayStr] ? [...state.completedReviews[todayStr]] : [];
    const isCompleted = todayList.includes(blockId);

    let updatedList: string[];
    let title: string;
    let desc: string;

    const block = state.blocks.find(b => b.id === blockId);
    const surahName = block ? getSurahName(block.surahId) : "";

    let updatedState = { ...state };

    if (isCompleted) {
      updatedList = todayList.filter(id => id !== blockId);
      title = "إلغاء مراجعة";
      desc = `تم التراجع عن إكمال مراجعة سورة ${surahName}`;
    } else {
      updatedList = [...todayList, blockId];
      title = "إنجاز مراجعة";
      desc = `تم إتمام المراجعة اليومية لسورة ${surahName}`;
      updatedState = incrementStreakIfNeeded(updatedState);
    }

    updatedState = {
      ...updatedState,
      completedReviews: {
        ...updatedState.completedReviews,
        [todayStr]: updatedList
      }
    };

    updateState(logActivity(updatedState, title, desc));
  }, [state, updateState, incrementStreakIfNeeded]);

  const handleUpdateReviewProgress = useCallback((index: number) => {
    if (!state) return;
    const todayStr = getLocalDateKey();
    const updatedState = {
      ...state,
      reviewProgress: {
        ...state.reviewProgress,
        [todayStr]: index
      }
    };
    updateState(updatedState);
  }, [state, updateState]);

  const handleCompleteDay66 = useCallback(() => {
    if (!state) return;
    const todayStr = getLocalDateKey();
    const updatedState = {
      ...state,
      fullReviewDates: [...(state.fullReviewDates || []), todayStr]
    };
    updateState(logActivity(updatedState, "إكمال يوم المراجعة الكبرى", "تم إكمال مراجعة اليوم 66 بنجاح واستئناف خطة الحفظ."));
  }, [state, updateState]);

  const handleAddHifz = useCallback((surahId: number, fromAyah: number, toAyah: number, repetitions: number) => {
    if (!state) return;
    const todayStr = getLocalDateKey();
    const newBlock: MemorizationBlock = {
      id: `block-${Date.now()}`,
      surahId,
      fromAyah,
      toAyah,
      repetitionTarget: repetitions,
      startDate: todayStr,
      status: "active"
    };

    const updatedState: AppState = {
      ...state,
      blocks: [newBlock, ...state.blocks],
      repetitions: {
        ...state.repetitions,
        [newBlock.id]: repetitions
      }
    };
    updateState(logActivity(updatedState, "إضافة مقرر جديد", `تم تسجيل سورة ${getSurahName(surahId)}.`));
  }, [state, updateState]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    if (!state) return;
    const filteredBlocks = state.blocks.filter(b => b.id !== blockId);
    const updatedState = { ...state, blocks: filteredBlocks };
    updateState(logActivity(updatedState, "حذف مقرر", "تم حذف المقرر بنجاح."));
  }, [state, updateState]);

  const handleToggleBlockStatus = useCallback((blockId: string) => {
    if (!state) return;
    const updatedBlocks = state.blocks.map(b => b.id === blockId ? { ...b, status: b.status === "active" ? "completed" : "active" as any } : b);
    updateState({ ...state, blocks: updatedBlocks });
  }, [state, updateState]);

  const handleDetectLocation = useCallback(() => {
    if (!state || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const updated = { ...state, profile: { ...state.profile!, lat: pos.coords.latitude, lng: pos.coords.longitude } };
      updateState(logActivity(updated, "تحديث الموقع", "تم تحديث إحداثيات الموقع."));
    });
  }, [state, updateState]);

  const handleResetApp = useCallback(() => {
    if (!window.confirm("هل أنت متأكد من حذف كافة البيانات وإعادة ضبط التطبيق؟ لا يمكن التراجع عن هذا الإجراء.")) return;

    const newState: AppState = {
      profile: null,
      blocks: [],
      completedReviews: {},
      repetitions: {},
      mushafCache: [],
      activityLog: [],
      onboardingCompleted: false,
      reviewProgress: {},
      fullReviewDates: []
    };

    updateState(newState);
    window.location.reload();
  }, [updateState]);

  const handleExportBackup = useCallback(async () => {
    if (!state) return;
    const dataStr = JSON.stringify(state, null, 2);
    const exportFileDefaultName = `rafiq_backup_${formatDateKey(new Date())}.json`;

    // 1. Try modern File System Access API first to allow user to pick location
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: exportFileDefaultName,
          types: [{
            description: 'Rafiq Backup File',
            accept: { 'application/json': ['.json'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(dataStr);
        await writable.close();
        setState(prev => prev ? logActivity(prev, "تصدير البيانات", "تم حفظ النسخة الاحتياطية في المكان الذي اخترته.") : null);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User cancelled
        console.error("File System API failed, falling back", err);
      }
    }

    // 2. Fallback to standard download method
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    setState(prev => prev ? logActivity(prev, "تصدير البيانات", "تم تصدير نسخة احتياطية من بياناتك بنجاح.") : null);
  }, [state]);

  const handleImportBackup = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedState = JSON.parse(event.target?.result as string) as AppState;
        // Basic validation
        if (importedState.profile && Array.isArray(importedState.blocks)) {
          updateState(importedState);
          alert("تم استيراد البيانات بنجاح! سيتم تحديث التطبيق الآن.");
          window.location.reload();
        } else {
          alert("الملف المختار غير صالح.");
        }
      } catch (err) {
        alert("فشل قراءة الملف. تأكد أنه ملف JSON سليم.");
      }
    };
    reader.readAsText(file);
  }, [updateState]);

  const handleCompleteKhatmahReviewToday = useCallback(() => {
    if (!state) return;
    const userProfile = state.profile!;
    const todayStr = getLocalDateKey();
    const completedDates = userProfile.reviewOnlyCompletedDates || [];
    const isAlreadyDone = completedDates.includes(todayStr);

    let updatedState = incrementStreakIfNeeded(state);
    let updatedProfile = updatedState.profile!;

    if (userProfile.reviewOnlyDailyAmountType === "surah_ayah") {
      const sId = userProfile.reviewOnlySurahId || 2;
      const fA = userProfile.reviewOnlyFromAyah || 1;
      const tA = userProfile.reviewOnlyToAyah || 100;
      const surahObj = getSurahById(sId);
      const maxA = surahObj ? surahObj.ayahs : 286;
      const span = Math.abs(tA - fA) + 1;

      let nextSId = sId;
      let nextFA = tA + 1;
      let nextTA = nextFA + span - 1;

      if (nextFA > maxA) {
        nextSId = (sId % 114) + 1;
        nextFA = 1;
        const nextSurahObj = getSurahById(nextSId);
        const nextMaxA = nextSurahObj ? nextSurahObj.ayahs : 100;
        nextTA = Math.min(span, nextMaxA);
      } else if (nextTA > maxA) {
        nextTA = maxA;
      }

      const nextPage = getPageForAyah(nextSId, nextFA);

      updatedProfile = {
        ...updatedProfile,
        reviewOnlySurahId: nextSId,
        reviewOnlyFromAyah: nextFA,
        reviewOnlyToAyah: nextTA,
        reviewOnlyCurrentPage: nextPage,
        reviewOnlyCompletedDates: isAlreadyDone ? completedDates : [...completedDates, todayStr]
      };
    } else {
      const curPage = userProfile.reviewOnlyCurrentPage || 1;
      const amount = userProfile.reviewOnlyDailyAmountValue || 20;
      const dir = userProfile.reviewOnlyDirection || "forward";

      let nextPage = curPage;
      if (dir === "forward") {
        nextPage = ((curPage - 1 + amount) % 610) + 1;
      } else {
        nextPage = ((curPage - 1 - amount + 610000) % 610) + 1;
      }

      updatedProfile = {
        ...updatedProfile,
        reviewOnlyCurrentPage: nextPage,
        reviewOnlyCompletedDates: isAlreadyDone ? completedDates : [...completedDates, todayStr]
      };
    }

    updateState(logActivity({ ...updatedState, profile: updatedProfile }, "إنجاز ورد المراجعة", `تم إتمام مراجعة اليوم بنجاح.`));
  }, [state, updateState, incrementStreakIfNeeded]);

  return {
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
  };
};
