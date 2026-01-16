import { useToastStore } from '../../store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`
              pointer-events-auto px-4 py-3 rounded-xl shadow-lg font-bold text-sm min-w-[200px] flex items-center justify-between
              ${toast.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
              ${toast.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : ''}
              ${toast.type === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
            `}
            onClick={() => removeToast(toast.id)}
          >
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
