import { useState } from 'react';
import { motion } from 'framer-motion';

const MONTH_NAMES = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const TIME_SLOTS = ['12:00', '15:00', '18:00'];

export default function Calendar({ selectedDate, setSelectedDate, selectedTime, setSelectedTime }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay() === 0 ? 6 : new Date(year, month, 1).getDay() - 1;
  const today = new Date(); today.setHours(0,0,0,0);

  // Время полностью разблокировано для реальных клиентов
  const isTimeBooked = () => false;

  return (
    <div className="mb-8 bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm dark:shadow-md border border-gray-100 dark:border-[#2d2d2d] transition-colors duration-300">
      <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">4. Дата и время</h3>
      
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-gray-700 dark:text-gray-200">{MONTH_NAMES[month]} {year}</div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#2d2d2d] rounded-lg font-bold">&lt;</button>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#2d2d2d] rounded-lg font-bold">&gt;</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs font-bold text-gray-400">
        <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateObj = new Date(year, month, day);
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          if (dateObj < today) return null;

          return (
            <motion.button whileTap={{ scale: 0.95 }} key={day} onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); }}
              className={`h-10 rounded-xl text-sm font-medium transition-colors
                ${selectedDate === dateStr ? 'bg-rose-400 text-white shadow-md' : 'bg-[#f8f9fa] dark:bg-[#121212] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-[#2d2d2d]'}`}>
              {day}
            </motion.button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-[#2d2d2d]">
          <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Свободное время:</div>
          <div className="flex gap-2">
            {TIME_SLOTS.map(time => (
                <motion.button whileTap={{ scale: 0.95 }} key={time} disabled={isTimeBooked(time)} onClick={() => setSelectedTime(time)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl border-2 transition-colors
                    ${selectedTime === time ? 'bg-gray-800 dark:bg-rose-500 text-white border-gray-800 dark:border-rose-500' : 
                      'bg-[#f8f9fa] dark:bg-[#121212] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-[#2d2d2d]'}`}>
                  {time}
                </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}