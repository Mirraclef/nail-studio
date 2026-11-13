import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BookingForm({ totalPrice, discount, basePrice, extrasPrice, orderDetails, selectedDate, selectedTime }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [refPhoto, setRefPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.slice(0, 11);
    let formatted = '';
    if (input.length > 0) {
      formatted = '+7';
      if (input.length > 1) formatted += ` (${input.slice(1, 4)}`;
      if (input.length > 4) formatted += `) ${input.slice(4, 7)}`;
      if (input.length > 7) formatted += `-${input.slice(7, 9)}`;
      if (input.length > 9) formatted += `-${input.slice(9, 11)}`;
    }
    setForm({ ...form, phone: formatted });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          setRefPhoto(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.7);
      };
    };
  };

  const sendOrder = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !selectedDate || !selectedTime) return alert('Заполните все поля!');
    
    if (navigator.vibrate) navigator.vibrate(50);
    setIsSending(true);
    setHasError(false);

    const token = import.meta.env.VITE_TG_TOKEN; 
    const chatId = import.meta.env.VITE_TG_CHAT_ID;
    const text = `💅 НОВАЯ ЗАЯВКА\n-----------------------------\nИмя: ${form.name}\nТелефон: ${form.phone}\nДата: ${selectedDate} в ${selectedTime}\n-----------------------------\n${orderDetails}\n-----------------------------\nИТОГО: ${totalPrice} ₽ ${discount > 0 ? `(Скидка ${discount}%)` : ''}`;

    try {
      let url = refPhoto ? `https://api.telegram.org/bot${token}/sendPhoto` : `https://api.telegram.org/bot${token}/sendMessage`;
      let body = refPhoto ? new FormData() : JSON.stringify({ chat_id: chatId, text: text });
      
      if (refPhoto) {
        body.append('chat_id', chatId);
        body.append('photo', refPhoto);
        body.append('caption', text);
      }

      const res = await fetch(url, { method: 'POST', headers: refPhoto ? {} : { 'Content-Type': 'application/json' }, body: body });
      
      if (res.ok) {
        setIsSuccess(true);
        setForm({ name: '', phone: '' });
        setRefPhoto(null); setPreviewUrl(null);
      } else { setHasError(true); }
    } catch (err) { setHasError(true); }
    setIsSending(false);
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-[#2d2d2d] mb-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Вы записаны!</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Мастер свяжется с вами в течение 15 минут.</p>
        <button onClick={() => setIsSuccess(false)} className="bg-rose-400 text-white px-6 py-3 rounded-xl font-bold">Отлично</button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2d2d2d] mb-6">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Записаться</h3>
      
      <div className="mb-5 bg-[#f8f9fa] dark:bg-[#121212] p-3 rounded-xl text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-1"><span>Базовая стоимость:</span> <span>{basePrice} ₽</span></div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-1"><span>Доп. услуги и дизайн:</span> <span>+{extrasPrice} ₽</span></div>
        {discount > 0 && <div className="flex justify-between text-green-500 font-bold"><span>Скидка:</span> <span>-{Math.round((basePrice + extrasPrice) * (discount/100))} ₽</span></div>}
        <div className="flex justify-between font-bold text-gray-800 dark:text-white mt-2 pt-2 border-t border-gray-200 dark:border-[#2d2d2d]"><span>К оплате:</span> <span>{totalPrice} ₽</span></div>
      </div>

      <form onSubmit={sendOrder} className="space-y-3">
        <input type="text" placeholder="Ваше имя" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-[#2d2d2d] bg-[#f8f9fa] dark:bg-[#121212] text-sm text-gray-800 dark:text-white" />
        <input type="tel" placeholder="+7 (999) 999-99-99" required value={form.phone} onChange={handlePhoneChange} className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-[#2d2d2d] bg-[#f8f9fa] dark:bg-[#121212] text-sm text-gray-800 dark:text-white" />
        
        <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-200 dark:border-[#2d2d2d] rounded-xl cursor-pointer hover:border-rose-300 dark:hover:border-rose-500 bg-[#f8f9fa] dark:bg-[#121212]">
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <img src={previewUrl} alt="Референс" className="w-20 h-20 object-cover rounded-lg mb-2" />
                <span className="text-xs text-rose-500 font-bold">Изменить</span>
              </div>
            ) : (
              <div className="text-center text-xs font-bold text-gray-500">📸 Прикрепить референс</div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </label>

        <button type="submit" disabled={isSending} className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all mt-4 text-lg">
          {isSending ? 'Отправка...' : `Записаться • ${totalPrice} ₽`}
        </button>

        {hasError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center rounded-xl">
            Ой, бот приуныл. <a href="https://wa.me/79939967018" className="font-bold underline">Напишите нам в WhatsApp</a>!
          </div>
        )}
      </form>
    </div>
  );
}