import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  Globe, 
  MessageSquarePlus, 
  X,
  Languages,
  BookOpenCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface SelectionPopupProps {
  selection: { text: string; x: number; y: number };
  onClose: () => void;
  docId: string;
}

const SelectionPopup: React.FC<SelectionPopupProps> = ({ selection, onClose, docId }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (type: string) => {
    setLoading(true);
    toast.promise(
      fetch('http://localhost:8000/analyze-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: type,
          doc_id: docId,
          context_text: selection.text
        })
      }).then(res => res.json()),
      {
        loading: 'AI is thinking...',
        success: (data) => {
          // In a real app, we'd emit an event to open the sidebar and show result
          window.dispatchEvent(new CustomEvent('ai-response', { 
            detail: { type, response: data.response, selection: selection.text } 
          }));
          onClose();
          return `Analysis complete`;
        },
        error: 'Failed to reach AI service'
      }
    ).finally(() => setLoading(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="fixed z-[100] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-full px-2 py-1.5 flex items-center gap-1"
      style={{ 
        left: selection.x, 
        top: selection.y, 
        transform: 'translate(-50%, -100%)' 
      }}
    >
      <ActionButton 
        icon={<Sparkles size={14} />} 
        label="Summarize" 
        onClick={() => handleAction("Summarize this text in a few bullet points.")} 
      />
      <ActionButton 
        icon={<BookOpenCheck size={14} />} 
        label="Explain" 
        onClick={() => handleAction("Explain this concept like I am five.")} 
      />
      <ActionButton 
        icon={<Languages size={14} />} 
        label="Translate" 
        onClick={() => handleAction("Translate this text to Spanish.")} 
      />
      <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />
      <button 
        onClick={onClose}
        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full text-zinc-400"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

const ActionButton = ({ icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default SelectionPopup;