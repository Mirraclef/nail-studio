import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SERVICES, LENGTHS, SHAPES, DESIGNS } from './data';
import NailPreview from './components/NailPreview';
import Calendar from './components/Calendar';
import BookingForm from './components/BookingForm';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  
  const [service, setService] = useState(() => localStorage.getItem('service') || 'manicure');
  const [length, setLength] = useState('short');
  const [shape, setShape] = useState('square');
  const [design, setDesign] = useState('classic');
  const [strengthening, setStrengthening] = useState(false);
  
  const [promoInput, setPromoInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => { localStorage.setItem('service', service); }, [service]);
  useEffect(() => { localStorage.setItem('design', design); }, [design]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const basePrice = SERVICES.find(s => s.id === service).basePrice;
  const lengthPrice = service === 'extension' ? LENGTHS.find(l => l.id === length).price : 0;
  const strengthenPrice = (service === 'manicure' && strengthening) ? 400 : 0;
  const designPrice = DESIGNS.find(d => d.id === design).price;
  
  const extrasPrice = lengthPrice + strengthenPrice + designPrice;
  const rawTotal = basePrice + extrasPrice;
  const totalPrice = discount > 0 ? Math.round(rawTotal * (1 - discount / 100)) : rawTotal;

  const orderDetails = `
Услуга: ${SERVICES.find(s => s.id === service).name}
${service === 'extension' ? `Длина: ${LENGTHS.find(l => l.id === length).name}` : ''}
Форма: ${SHAPES.find(s => s.id === shape).name}
Дизайн: ${DESIGNS.find(d => d.id === design).name}
${strengthening ? 'Укрепление: Да' : ''}
  `.trim();

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'SALE20' || code === 'KRASOTA') { setDiscount(20); setPromoError(''); } 
    else { setDiscount(0); setPromoError('Промокод не найден'); }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] font-sans transition-colors duration-300 pb-32">
      
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 flex flex-col md:flex-row gap-8 relative">
        
        {/* ЛЕВАЯ КОЛОНКА (Sticky) */}
        <div className="w-full md:w-5/12 lg:w-1/3 md:sticky md:top-8 h-fit flex flex-col gap-6">
          
          <div className="relative rounded-3xl overflow-hidden h-48 w-full bg-gradient-to-r from-pink-200 via-rose-100 to-pink-100 dark:from-rose-900 dark:via-purple-900 dark:to-indigo-900 flex flex-col justify-end p-5 shadow-sm">
            <button onClick={() => setIsDark(!isDark)} className="absolute top-4 right-4 bg-white/70 dark:bg-black/50 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-xl z-50">
              {isDark ? '☀️' : '🌙'}
            </button>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">Комната красоты</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">ул. Жуковского, 106 • 10:00 - 21:00</span>
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">⭐ 4.9 (124)</span>
            </div>
          </div>

          <NailPreview design={design} />
        </div>

        {/* ПРАВАЯ КОЛОНКА (Шаги) */}
        <div className="w-full md:w-7/12 lg:w-2/3">
          
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">1. Услуга</h3>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map(s => (
                <motion.button whileTap={{ scale: 0.97 }} key={s.id} onClick={() => setService(s.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${service === s.id ? 'border-rose-300 bg-white dark:bg-[#1e1e1e] shadow-md' : 'border-transparent bg-white dark:bg-[#1e1e1e]'}`}>
                  <div className="font-bold text-sm text-gray-800 dark:text-white">{s.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {service === 'extension' ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">Длина</h3>
              <div className="flex gap-2">
                {LENGTHS.map(l => (
                  <motion.button whileTap={{ scale: 0.95 }} key={l.id} onClick={() => setLength(l.id)}
                    className={`flex-1 py-3 text-sm font-medium rounded-xl border-2 transition-all ${length === l.id 
                      ? 'bg-gray-800 dark:bg-rose-500 text-white border-gray-800 dark:border-rose-500 shadow-md' 
                      : 'bg-white dark:bg-[#1e1e1e] border-transparent dark:border-[#2d2d2d] text-gray-600 dark:text-gray-300 shadow-sm'}`}>
                    <div>{l.name}</div>
                    <div className="text-xs opacity-75">{l.price > 0 ? `+${l.price}₽` : 'Бесплатно'}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center justify-between bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2d2d2d]">
              <div>
                <div className="font-bold text-sm text-gray-800 dark:text-white">Укрепление гелем</div>
                <div className="text-xs text-gray-500 mt-0.5">Продлит жизнь маникюра</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-gray-800 dark:text-gray-300">+400 ₽</span>
                <input type="checkbox" checked={strengthening} onChange={(e) => setStrengthening(e.target.checked)} className="w-6 h-6 accent-rose-400 rounded" />
              </div>
            </motion.div>
          )}

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">2. Форма</h3>
            <div className="flex gap-2">
              {SHAPES.map(s => (
                <motion.button whileTap={{ scale: 0.95 }} key={s.id} onClick={() => setShape(s.id)}
                  className={`flex-1 py-3 text-sm font-medium rounded-xl border-2 transition-all ${shape === s.id 
                    ? 'bg-gray-800 dark:bg-rose-500 text-white border-gray-800 dark:border-rose-500 shadow-md' 
                    : 'bg-white dark:bg-[#1e1e1e] border-transparent dark:border-[#2d2d2d] text-gray-600 dark:text-gray-300 shadow-sm'}`}>
                  {s.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">3. Дизайн</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {DESIGNS.map(d => (
                <motion.button whileTap={{ scale: 0.97 }} key={d.id} onClick={() => setDesign(d.id)}
                  className={`p-3 text-sm text-left rounded-xl border-2 transition-all ${design === d.id 
                    ? 'border-rose-300 dark:border-rose-500 bg-white dark:bg-[#1e1e1e] shadow-md' 
                    : 'border-transparent bg-white dark:bg-[#1e1e1e] shadow-sm'}`}>
                  <div className="font-bold text-gray-800 dark:text-white">{d.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{d.price > 0 ? `+${d.price} ₽` : 'Бесплатно'}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />

          <div className="mb-8">
            <div className="flex gap-2">
              <input type="text" placeholder="Введите промокод" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} className="flex-1 p-3 rounded-xl border bg-[#f8f9fa] dark:bg-[#121212] text-sm uppercase dark:text-white" />
              <button onClick={applyPromo} className="bg-gray-800 dark:bg-rose-500 text-white px-5 rounded-xl font-bold">ОК</button>
            </div>
            {promoError && <div className="text-red-500 text-xs font-bold mt-2">{promoError}</div>}
          </div>

          <BookingForm totalPrice={totalPrice} discount={discount} basePrice={basePrice} extrasPrice={extrasPrice} orderDetails={orderDetails} selectedDate={selectedDate} selectedTime={selectedTime} />

          <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-[#2d2d2d] bg-white dark:bg-[#1e1e1e]">
            <div className="p-5">
              <h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-white">Как добраться</h3>
            </div>
            <div className="w-full h-48 relative">
              <iframe src="https://yandex.ru/map-widget/v1/?text=Жуковского%20106&z=16" width="100%" height="100%" frameBorder="0" title="Карта"></iframe>
            </div>
          </div>

        </div>
      </div>

      {/* Плавающая панель (Идеально по центру) */}
      <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50">
        <div className="bg-white/90 dark:bg-[#1e1e1e]/95 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-[#2d2d2d] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex justify-between items-center p-4 transition-colors duration-300">
          
          <div className="flex flex-col justify-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ИТОГО:</div>
            {/* leading-none убирает лишний межстрочный интервал у крупного шрифта */}
            <div className="text-2xl font-black text-gray-800 dark:text-white leading-none">{totalPrice} ₽</div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => document.querySelector('input[placeholder="Ваше имя"]')?.focus()}
            className="bg-gray-800 dark:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg text-base"
          >
            Записаться
          </motion.button>

        </div>
      </div>

    </div>
  );
}