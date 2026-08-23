import React from "react";
import { ChevronLeft } from "lucide-react";

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto pt-4 pb-24">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold font-serif text-emerald-900">عن تطبيق رفيق الحافظ</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-emerald-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-4xl">📖</span>
            </div>
            <div className="text-center md:text-right space-y-2">
              <h3 className="text-2xl font-bold font-serif">رفيق الحافظ v2.2.0</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                المنظومة التقنية المتكاملة لإدارة ورد مراجعة القرآن الكريم وتثبيت الحفظ بالتكرار المتباعد والتوزيع الذكي على الصلوات والركعات.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right" dir="rtl">
          <section className="space-y-4">
            <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
              ما هو رفيق الحافظ؟
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              هو مساعدك التقني الشخصي في رحلة حفظ كتاب الله. لا يكتفي التطبيق بتسجيل تقدمك، بل يديره بذكاء عبر خوارزميات التكرار المتباعد (Spaced Repetition) التي تضمن انتقال المحفوظ من الذاكرة قصيرة المدى إلى الذاكرة بعيدة المدى.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
              نظام اليوم 66
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              يؤمن رفيق الحافظ أن التثبيت أهم من الاستكثار. لذلك، عند وصولك لليوم 66 في أي مقرر، يقوم النظام بإيقاف الحفظ الجديد ليكون يوماً للمراجعة الكبرى الشاملة، مما يضمن رسوخ الأجزاء التي أتممتها قبل الانتقال لما بعدها.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
              المراجعة في الركعات
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              أكبر تحدي يواجه الحافظ هو الوقت. يحل التطبيق هذه المشكلة عبر توزيع ورد المراجعة آلياً على صلواتك الخمس وسننك الرواتب وقيام الليل، لتكون المراجعة عبادة مدمجة في يومك وليست عبئاً إضافياً.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
              تكرار الحفظ الجديد
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              يوفر التطبيق عداداً تفاعلياً للحفظ الجديد، مما يشجع الحافظ على تكرار المقطع الجديد عدداً كافياً من المرات في يومه الأول لضمان جودة الحفظ من اللحظة الأولى.
            </p>
          </section>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 text-center space-y-4 border border-gray-100">
          <h4 className="text-emerald-900 font-bold">للتواصل والدعم</h4>
          <p className="text-xs text-gray-500">مشروع رفيق الحافظ هو وقف خيري تقني، نسأل الله أن ينفع به حفاظ كتابه.</p>
          <div className="flex flex-col gap-2">
            <a href="mailto:rafeqalhafiz@gmail.com" className="text-emerald-700 font-bold hover:underline">rafeqalhafiz@gmail.com</a>
            <a href="https://rafiqalhafiznew-ztg9.vercel.app/" className="text-emerald-600 text-sm hover:underline">الموقع الإلكتروني</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
