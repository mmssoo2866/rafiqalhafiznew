import React, { useState } from "react";
import { motion } from "motion/react";
import { Settings as SettingsIcon, Download, Upload, Trash2, Award } from "lucide-react";
import { PageProps } from "../types";
import { SURAHS, MURTAGAS, getSurahName } from "../quranData";
import { logActivity } from "../storage";

interface SettingsProps extends PageProps {
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetApp: () => void;
}

const Settings: React.FC<SettingsProps> = ({ state, onUpdateState, onExportBackup, onImportBackup, onResetApp }) => {
  const userProfile = state.profile!;
  const [prevFrom, setPrevFrom] = useState(114);
  const [prevTo, setPrevTo] = useState(1);

  const updateProfile = (changes: any) => {
    onUpdateState({ ...state, profile: { ...userProfile, ...changes } });
  };

  const applyPreviousHifz = () => {
    const minS = Math.min(prevFrom, prevTo);
    const maxS = Math.max(prevFrom, prevTo);

    const newlyMastered = MURTAGAS.filter(m =>
      m.startSurahId >= minS && m.startSurahId <= maxS &&
      m.endSurahId >= minS && m.endSurahId <= maxS
    ).map(m => m.id);

    const existingMastered = userProfile.masteredMurtagaIds || [];
    const combined = Array.from(new Set([...existingMastered, ...newlyMastered])).sort((a, b) => a - b);

    let nextCurrent = userProfile.currentMurtagaId || 1;
    if (combined.length > 0) {
      const highestMastered = Math.max(...combined);
      if (highestMastered < 8) {
        nextCurrent = highestMastered + 1;
      } else {
        nextCurrent = 8;
      }
    }

    const updated = logActivity({
      ...state,
      profile: {
        ...userProfile,
        masteredMurtagaIds: combined,
        currentMurtagaId: nextCurrent
      }
    }, "تحديث الحفظ السابق", `تم إدراج المرتقيات بناءً على الحفظ من ${getSurahName(prevFrom)} إلى ${getSurahName(prevTo)}`);

    onUpdateState(updated);
    alert("تم تحديث المرتقيات بنجاح! يمكنك مراجعة الإنجازات في صفحة المراجعة.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-right" dir="rtl"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-6">
        <h3 className="text-xl font-serif font-bold text-emerald-900 border-b pb-3 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          <span>إعدادات حساب الحافظ الشخصي</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600">اسم الحافظ الكريم</label>
            <input type="text" value={userProfile.name} onChange={(e) => updateProfile({ name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-sm font-bold focus:ring-2 focus:ring-emerald-600 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600">مسار الاستخدام الحالي</label>
            <select value={userProfile.appTrack} onChange={(e) => updateProfile({ appTrack: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-emerald-50 text-sm font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-600 outline-none">
              <option value="hifz_and_review">حفظ جديد ومراجعة</option>
              <option value="review_only">مراجعة فقط (ختمة)</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-600">الصلوات المتاحة للمراجعة (ضع علامة صح لما تريد استخدامه)</label>
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {[
                { id: 'fajr', name: 'الفجر' },
                { id: 'duha', name: 'الضحى' },
                { id: 'dhuhr', name: 'الظهر' },
                { id: 'asr', name: 'العصر' },
                { id: 'maghrib', name: 'المغرب' },
                { id: 'isha', name: 'العشاء' },
                { id: 'qiyam', name: 'صلاة الليل' }
              ].map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`p-${p.id}`}
                    checked={(userProfile.enabledPrayers || ['fajr', 'duha', 'dhuhr', 'asr', 'maghrib', 'isha', 'qiyam']).includes(p.id)}
                    onChange={() => {
                      const current = userProfile.enabledPrayers || ['fajr', 'duha', 'dhuhr', 'asr', 'maghrib', 'isha', 'qiyam'];
                      const updated = current.includes(p.id) ? current.filter(x => x !== p.id) : [...current, p.id];
                      if (updated.length > 0) updateProfile({ enabledPrayers: updated });
                    }}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor={`p-${p.id}`} className="text-sm font-bold text-gray-700 select-none cursor-pointer">{p.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600">دور القراءة في الصلاة</label>
            <select value={userProfile.prayerRole} onChange={(e) => updateProfile({ prayerRole: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-sm font-bold">
              <option value="imam">منفرد/ إمام</option>
              <option value="maamoom">مأموم</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600">ركعات صلاة الضحى</label>
            <select value={userProfile.duhaRakats} onChange={(e) => updateProfile({ duhaRakats: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-sm font-bold">
              {[0, 2, 4, 6, 8].map(r => <option key={r} value={r}>{r === 0 ? "بدون مراجعة في الضحى" : `${r} ركعات`}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600">ركعات قيام الليل</label>
            <select value={userProfile.nightPrayerRakats} onChange={(e) => updateProfile({ nightPrayerRakats: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-sm font-bold">
              {[2, 4, 6, 8, 10, 12].map(r => <option key={r} value={r}>{r} ركعات</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-emerald-800">أيام العمل الأسبوعية (اختر أيام الحفظ والمراجعة)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 6, name: 'السبت' },
              { id: 0, name: 'الأحد' },
              { id: 1, name: 'الاثنين' },
              { id: 2, name: 'الثلاثاء' },
              { id: 3, name: 'الأربعاء' },
              { id: 4, name: 'الخميس' },
              { id: 5, name: 'الجمعة' }
            ].map(day => (
              <button
                key={day.id}
                onClick={() => {
                  const current = userProfile.activeDays || [0, 1, 2, 3, 4, 5, 6];
                  const updated = current.includes(day.id) ? current.filter(d => d !== day.id) : [...current, day.id];
                  if (updated.length > 0) updateProfile({ activeDays: updated });
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  (userProfile.activeDays || [0, 1, 2, 3, 4, 5, 6]).includes(day.id)
                  ? "bg-emerald-700 text-white border-emerald-800"
                  : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400">ملاحظة: سيقوم التطبيق بتعديل الجدولة لتتخطى الأيام غير المختارة.</p>
        </div>

        {/* الحفظ السابق */}
        <div className="space-y-4 pt-6 border-t border-emerald-50">
          <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>🏆 إدراج إنجازات الحفظ السابق</span>
          </h4>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            إذا كنت تحفظ سوراً معينة سابقاً، يمكنك اختيار نطاقها هنا ليتم اعتبار المرتقيات (المحطات) الخاصة بها "مُجتازة" وتظهر في صفحة الإنجازات والمراجعة.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 mr-1">من سورة</label>
              <select
                value={prevFrom}
                onChange={(e) => setPrevFrom(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {SURAHS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 mr-1">إلى سورة</label>
              <select
                value={prevTo}
                onChange={(e) => setPrevTo(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-xs font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {SURAHS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={applyPreviousHifz}
            className="w-full py-3 bg-amber-500 text-emerald-950 rounded-xl text-xs font-bold shadow-md hover:bg-amber-600 transition-all active:scale-[0.98]"
          >
            تحديث سجل الإنجازات بهذا الحفظ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
          <h4 className="text-lg font-bold text-emerald-950 border-b pb-2">🔄 البيانات والمزامنة</h4>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onExportBackup} className="py-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition"><Download className="w-4 h-4" /> تصدير</button>
            <label className="py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 transition">
              <Upload className="w-4 h-4" /> استيراد
              <input type="file" accept=".json" onChange={onImportBackup} className="hidden" />
            </label>
          </div>
          <button onClick={onResetApp} className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> إعادة ضبط التطبيق</button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4 overflow-hidden">
          <h4 className="text-lg font-bold text-emerald-950 border-b pb-2">📋 سجل النشاط</h4>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {state.activityLog.length === 0 ? <p className="text-xs text-gray-400 text-center py-6">السجل فارغ حالياً.</p> : state.activityLog.map(log => (
              <div key={log.id} className="p-2 border-b last:border-b-0">
                <p className="text-xs font-bold text-emerald-900">{log.title}</p>
                <p className="text-[10px] text-gray-400">{log.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
