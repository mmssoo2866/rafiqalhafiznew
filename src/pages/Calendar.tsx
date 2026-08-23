import React, { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Book, RotateCcw, AlertCircle } from "lucide-react";
import { PageProps } from "../types";
import { getTasksForDate, hasDay66TriggerToday } from "../scheduler";
import { getSurahName } from "../quranData";
import { formatDateKey } from "../storage";

const Calendar: React.FC<PageProps> = ({ state, todayStr, onToggleTab, onNavigateToMushaf }) => {
  // We'll track the view by a Gregorian date that falls in the target Hijri month
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  const getHijriInfo = (date: Date) => {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).formatToParts(date);

    const info: any = {};
    parts.forEach(p => info[p.type] = p.value);

    const monthName = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      month: 'long'
    }).format(date);

    return {
      day: parseInt(info.day),
      month: parseInt(info.month),
      year: parseInt(info.year),
      monthName
    };
  };

  const hijriView = useMemo(() => getHijriInfo(viewDate), [viewDate]);

  // Calculate the grid for the current Hijri month
  const hijriGrid = useMemo(() => {
    const days = [];
    // 1. Find the Gregorian date for the 1st of the current Hijri month
    let firstOfMonth = new Date(viewDate);
    // Rough alignment: move back by (currentHijriDay - 1) days
    const currentHInfo = getHijriInfo(viewDate);
    firstOfMonth.setDate(firstOfMonth.getDate() - (currentHInfo.day - 1));

    // Ensure we are exactly on hDay 1 (handle potential edge cases)
    let check = getHijriInfo(firstOfMonth);
    while (check.day > 1) {
        firstOfMonth.setDate(firstOfMonth.getDate() - 1);
        check = getHijriInfo(firstOfMonth);
    }
    while (check.month !== currentHInfo.month) {
        firstOfMonth.setDate(firstOfMonth.getDate() + 1);
        check = getHijriInfo(firstOfMonth);
    }

    const firstDayWeekday = firstOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

    // 2. Iterate through the month until the Hijri month changes
    let curr = new Date(firstOfMonth);
    let hInfo = getHijriInfo(curr);
    const targetMonth = hInfo.month;

    while (hInfo.month === targetMonth) {
      days.push({
        date: new Date(curr),
        dateStr: formatDateKey(curr),
        hDay: hInfo.day
      });
      curr.setDate(curr.getDate() + 1);
      hInfo = getHijriInfo(curr);
    }

    return { days, firstDayWeekday };
  }, [viewDate]);

  const handlePrevMonth = () => {
    const d = new Date(hijriGrid.days[0].date);
    d.setDate(d.getDate() - 5); // Jump into the previous hijri month
    setViewDate(d);
  };

  const handleNextMonth = () => {
    const lastDay = hijriGrid.days[hijriGrid.days.length - 1].date;
    const d = new Date(lastDay);
    d.setDate(d.getDate() + 5); // Jump into the next hijri month
    setViewDate(d);
  };

  const selectedDateTasks = useMemo(() => {
    return getTasksForDate(state, selectedDateStr);
  }, [state, selectedDateStr]);

  const isDay66 = useMemo(() => {
    return hasDay66TriggerToday(state, selectedDateStr);
  }, [state, selectedDateStr]);

  const renderDay = (dayInfo: any) => {
    const { date, dateStr, hDay } = dayInfo;
    const isSelected = selectedDateStr === dateStr;
    const isToday = todayStr === dateStr;
    const activeDays = state.profile?.activeDays || [0, 1, 2, 3, 4, 5, 6];
    const isInactive = !activeDays.includes(date.getDay());

    const tasks = getTasksForDate(state, dateStr);
    const hasHifz = tasks.some(t => t.type === "memorization");
    const hasReview = tasks.some(t => t.type === "review");
    const hasIntensive = tasks.some(t => t.type === "review" && t.offset <= 10);
    const hasFullReview = hasDay66TriggerToday(state, dateStr);

    return (
      <button
        key={dateStr}
        onClick={() => setSelectedDateStr(dateStr)}
        className={`relative h-14 w-full flex flex-col items-center justify-center rounded-2xl transition-all border ${
          isSelected
            ? "bg-emerald-700 text-white border-emerald-800 shadow-md scale-105 z-10"
            : isToday
              ? "bg-amber-50 text-emerald-950 border-amber-200"
              : isInactive
                ? "bg-slate-50 text-slate-300 border-slate-100/50 opacity-80"
                : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
        }`}
      >
        <span className={`text-sm font-bold ${isInactive && !isSelected ? "line-through decoration-slate-200" : ""}`}>{hDay}</span>
        <span className="text-[7px] opacity-40 mt-[-2px]">{date.getDate()}</span>
        <div className="flex gap-0.5 mt-0.5">
          {hasHifz && <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />}
          {hasReview && <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/70" : "bg-blue-400"}`} />}
          {hasIntensive && <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/50" : "bg-orange-400"}`} />}
          {hasFullReview && <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/30" : "bg-purple-500"}`} />}
        </div>
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-right"
      dir="rtl"
    >
      {/* HIJRI CALENDAR HEADER & GRID */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-emerald-950">{hijriView.monthName} {hijriView.year}</h3>
              <p className="text-[10px] text-gray-400 font-bold">
                {hijriGrid.days[0].date.toLocaleString("ar-SA", { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-600"><ChevronRight className="w-5 h-5" /></button>
            <button onClick={() => setViewDate(new Date())} className="px-3 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl">اليوم</button>
            <button onClick={handleNextMonth} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 pb-2">{d}</div>
          ))}
          {Array.from({ length: hijriGrid.firstDayWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14" />
          ))}
          {hijriGrid.days.map(dayInfo => renderDay(dayInfo))}
        </div>
      </div>

      {/* SELECTED DAY PLAN */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-6">
        <div className="border-b pb-4">
          <h4 className="text-xl font-serif font-bold text-emerald-950">
            📅 خطة يوم {getHijriInfo(new Date(selectedDateStr)).day} {hijriView.monthName}
          </h4>
          <p className="text-xs text-gray-400 mt-1">
             {new Date(selectedDateStr).toLocaleDateString("ar-SA", { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {isDay66 && (
          <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-900">يوم مراجعة كبرى (اليوم 66) - يتوقف الحفظ الجديد</span>
          </div>
        )}

        <div className="space-y-6">
          {/* MEMORIZATION SECTION */}
          <section className="space-y-3">
            <h5 className="text-xs font-bold text-emerald-800 bg-emerald-50 inline-block px-3 py-1 rounded-full flex items-center gap-2">
              <Book className="w-3.5 h-3.5" />
              <span>الحفظ الجديد (اليوم الأول)</span>
            </h5>
            {selectedDateTasks.filter(t => t.type === "memorization").length === 0 ? (
              <p className="text-xs text-gray-400 pr-4">لا يوجد مقرر حفظ جديد يبدأ في هذا التاريخ.</p>
            ) : (
              selectedDateTasks.filter(t => t.type === "memorization").map(t => (
                <div key={t.block.id} className="pr-4 border-r-4 border-emerald-500 py-1">
                  <p className="text-sm font-bold text-gray-800">سورة {getSurahName(t.block.surahId)}</p>
                  <p className="text-[10px] text-gray-500">الآيات: {t.block.fromAyah} - {t.block.toAyah} | التكرار المطلوب: {t.block.repetitionTarget}</p>
                </div>
              ))
            )}
          </section>

          {/* INTENSIVE REVIEW SECTION */}
          <section className="space-y-3">
            <h5 className="text-xs font-bold text-orange-800 bg-orange-50 inline-block px-3 py-1 rounded-full flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>المراجعة المكثفة (يوم 2 - 10)</span>
            </h5>
            {selectedDateTasks.filter(t => t.type === "review" && t.offset <= 10).length === 0 ? (
              <p className="text-xs text-gray-400 pr-4">لا توجد مراجعات مكثفة.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
                {selectedDateTasks.filter(t => t.type === "review" && t.offset <= 10).map(t => (
                  <div key={t.block.id} className="p-3 bg-white rounded-2xl border border-orange-100 border-r-4 border-r-orange-400">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-gray-800">سورة {getSurahName(t.block.surahId)}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">اليوم {t.offset}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">آية {t.block.fromAyah} - {t.block.toAyah}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SPACED REPETITION SECTION */}
          <section className="space-y-3">
            <h5 className="text-xs font-bold text-blue-800 bg-blue-50 inline-block px-3 py-1 rounded-full flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>المراجعة المتباعدة (يوم 12 - 66)</span>
            </h5>
            {selectedDateTasks.filter(t => t.type === "review" && t.offset > 10).length === 0 ? (
              <p className="text-xs text-gray-400 pr-4">لا توجد مراجعات متباعدة.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
                {selectedDateTasks.filter(t => t.type === "review" && t.offset > 10).map(t => (
                  <div key={t.block.id} className="p-3 bg-white rounded-2xl border border-blue-100 border-r-4 border-r-blue-400">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-gray-800">سورة {getSurahName(t.block.surahId)}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">اليوم {t.offset}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">آية {t.block.fromAyah} - {t.block.toAyah}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;
