import { useState } from 'react';
import { motion } from 'framer-motion';
import { DESIGNS } from '../data';

export default function NailPreview({ design }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const currentDesign = DESIGNS.find(d => d.id === design) || DESIGNS[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center bg-white dark:bg-[#1e1e1e] rounded-3xl p-5 shadow-sm dark:shadow-lg mb-6 border border-gray-100 dark:border-[#2d2d2d] relative overflow-hidden transition-colors duration-300"
    >
      <div className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Пример вашего дизайна</div>
      
      <div className="w-full h-64 relative rounded-2xl overflow-hidden shadow-inner bg-gray-200 dark:bg-[#121212]">
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-[#2d2d2d] flex items-center justify-center">
             <span className="text-gray-400 text-sm">Загрузка...</span>
          </div>
        )}
        <img 
          src={currentDesign.photo} 
          alt={currentDesign.name} 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
          {currentDesign.name}
        </div>
      </div>
    </motion.div>
  );
}