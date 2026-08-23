import { useState, useCallback } from "react";
import { AppState, UserProfile, loadAppState, saveAppState, logActivity, getLocalDateKey, formatDateKey, MemorizationBlock, CompletedReviews, DEFAULT_PROFILE } from "../storage";
import { getSurahById, getSurahName, getPageForAyah, MURTAGAS } from "../quranData";

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
            prevActiveDayStr = formatDateKey(d);
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

  const handleAddHifz = useCallback((surahId: number, fromAyah: number, toAyah: number, repetitions: number, startDate?: string) => {
    if (!state || !state.profile) return;

    if (state.profile.isInMasteryPhase) {
      alert("أنت الآن في مرحلة إتقان ومراجعة المرتقى الحالي. يرجى إتمام المرتقى يدوياً قبل البدء في حفظ جديد.");
      return;
    }

    const todayStr = getLocalDateKey();
    const start = startDate || todayStr;
    const newBlock: MemorizationBlock = {
      id: `block-${Date.now()}`,
      surahId,
      fromAyah,
      toAyah,
      repetitionTarget: repetitions,
      startDate: start,
      status: "active"
    };

    const currentMurtaga = MURTAGAS.find(m => m.id === (state.profile?.currentMurtagaId || 1));
    let updatedProfile = { ...state.profile };
    if (currentMurtaga && surahId === currentMurtaga.endSurahId) {
      updatedProfile.isInMasteryPhase = true;
    }

    const updatedState: AppState = {
      ...state,
      profile: updatedProfile,
      blocks: [newBlock, ...state.blocks],
      repetitions: {
        ...state.repetitions,
        [newBlock.id]: repetitions
      }
    };
    updateState(logActivity(updatedState, "إضافة مقرر جديد", `تم تسجيل سورة ${getSurahName(surahId)}. ${updatedProfile.isInMasteryPhase ? "لقد وصلت لنهاية المرتقى!" : ""}`));
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
    if (!state || !state.profile || !navigator.geolocation) {
      alert("خاصية تحديد الموقع غير مدعومة في هذا المتصفح.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const updated = { ...state, profile: { ...state.profile!, lat: pos.coords.latitude, lng: pos.coords.longitude } };
        updateState(logActivity(updated, "تحديث الموقع", `تم تحديث إحداثيات الموقع: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`));
        alert("تم تحديث الموقع بنجاح ومزامنة مواقيت الصلاة.");
      },
      (err) => {
        alert("فشل تحديد الموقع. يرجى التأكد من تفعيل الصلاحيات.");
      }
    );
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
        setState(prev => prev ? logActivity(prev, "تصدير البيانات", "تم حفظ النسخة الاحتياطية بنجاح.") : null);
        alert("تم تصدير البيانات بنجاح.");
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback logic improved by appending to document
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);

    setState(prev => prev ? logActivity(prev, "تصدير البيانات", "تم تصدير النسخة الاحتياطية بنجاح.") : null);
    alert("تم تصدير ملف النسخة الاحتياطية بنجاح.");
  }, [state]);

  const handleImportBackup = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedState = JSON.parse(event.target?.result as string) as AppState;
        if (importedState.profile && Array.isArray(importedState.blocks)) {
          updateState(importedState);
          alert("تم استيراد البيانات بنجاح!");
          window.location.reload();
        }
      } catch (err) {
        alert("فشل قراءة الملف.");
      }
    };
    reader.readAsText(file);
  }, [updateState]);

  const handlePassMurtaga = useCallback(() => {
    if (!state || !state.profile) return;
    const currentId = state.profile.currentMurtagaId || 1;
    const updatedProfile = {
      ...state.profile,
      masteredMurtagaIds: [...(state.profile.masteredMurtagaIds || []), currentId],
      currentMurtagaId: currentId + 1,
      isInMasteryPhase: false
    };
    updateState(logActivity({ ...state, profile: updatedProfile }, "اجتياز مرتقى", `هنيئاً لك! تم اجتياز ${MURTAGAS.find(m => m.id === currentId)?.name} بنجاح.`));
  }, [state, updateState]);

  const handleCompleteKhatmahReviewToday = useCallback(() => {
    if (!state || !state.profile) return;
    const userProfile = state.profile;
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

      updatedProfile = {
        ...updatedProfile,
        reviewOnlySurahId: nextSId,
        reviewOnlyFromAyah: nextFA,
        reviewOnlyToAyah: nextTA,
        reviewOnlyCurrentPage: getPageForAyah(nextSId, nextFA),
        reviewOnlyCompletedDates: isAlreadyDone ? completedDates : [...completedDates, todayStr]
      };
    } else {
      const curPage = userProfile.reviewOnlyCurrentPage || 1;
      const amount = userProfile.reviewOnlyDailyAmountValue || 20;
      const dir = userProfile.reviewOnlyDirection || "forward";
      let nextPage = dir === "forward" ? ((curPage - 1 + amount) % 604) + 1 : ((curPage - 1 - amount + 604000) % 604) + 1;
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
    handleImportBackup,
    handlePassMurtaga
  };
};
