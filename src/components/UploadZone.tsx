import React, { useState, useCallback } from 'react';
import { Upload, File, Shield, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface UploadZoneProps {
  onUploadSuccess: (doc: any) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    
    // Check file type
    const allowed = ['.pdf', '.docx', '.txt', '.xlsx', '.pptx'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowed.includes(ext)) {
      toast.error(`Unsupported file format: ${ext}`);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      // Pass the actual file for local rendering (PDF.js)
      onUploadSuccess({ ...data, raw_file: file });
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to AI server. Please make sure backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  return (
    <div className="w-full max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 text-xs font-semibold mb-2"
        >
          <Sparkles size={12} />
          <span>Next Generation Document Intelligence</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white"
        >
          Understand your documents <br />
          <span className="text-indigo-600">in seconds.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-500 max-w-2xl mx-auto"
        >
          Upload any PDF, Word, or PowerPoint file. Chat with it, extract insights, 
          and let AI simplify complex information instantly.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-12 text-center
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' 
            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-600'
          }`}
      >
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          disabled={isUploading}
        />
        
        <div className="space-y-6">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 group-hover:scale-110 transition-transform duration-300">
            {isUploading ? (
              <Zap className="animate-pulse" size={40} />
            ) : (
              <Upload size={40} />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              {isUploading ? "Processing Document..." : "Click or drag document to upload"}
            </h3>
            <p className="text-zinc-500 text-sm">
              Supports PDF, DOCX, XLSX, PPTX and TXT (Max 50MB)
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-medium text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-500" />
              Secure processing
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              Instant extraction
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<File className="text-blue-500" />}
          title="Multi-format"
          desc="Full support for complex layouts in PDFs, Word docs and more."
        />
        <FeatureCard 
          icon={<Sparkles className="text-purple-500" />}
          title="AI Selection"
          desc="Just select text to get instant summaries and explanations."
        />
        <FeatureCard 
          icon={<ArrowRight className="text-indigo-500" />}
          title="Context-aware"
          desc="RAG powered chat that understands your whole document."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{title}</h4>
    <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
  </div>
);

export default UploadZone;