import React, { useState, useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import { motion, AnimatePresence } from 'framer-motion';
import SelectionPopup from './SelectionPopup';
import { Loader2 } from 'lucide-react';

// Use CDN for worker to avoid build complexity in this environment
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface DocumentViewerProps {
  doc: {
    filename: string;
    doc_id: string;
    file_url?: string;
    raw_file?: File;
  };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ doc }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<{ text: string, x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      try {
        const url = doc.file_url || URL.createObjectURL(doc.raw_file!);
        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        
        // Use a small delay to allow React to render the canvases
        setTimeout(async () => {
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });
            
            const canvas = canvasRefs.current[i-1];
            if (canvas) {
              const context = canvas.getContext('2d');
              if (context) {
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                await page.render(renderContext).promise;
              }
            }
          }
          setLoading(false);
        }, 100);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setLoading(false);
      }
    };

    if (doc.raw_file || doc.file_url) {
      loadPdf();
    }
  }, [doc]);

  const handleMouseUp = () => {
    const activeSelection = window.getSelection();
    if (activeSelection && activeSelection.toString().trim().length > 0) {
      const range = activeSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelection({
        text: activeSelection.toString(),
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY - 10
      });
    } else {
      setSelection(null);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-4xl mx-auto py-12 px-4 min-h-screen outline-none"
      onMouseUp={handleMouseUp}
    >
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/80 dark:bg-zinc-950/80 z-20"
          >
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-zinc-500 animate-pulse">Rendering high-quality document view...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8 items-center bg-white dark:bg-zinc-900 shadow-2xl shadow-indigo-500/5 rounded-xl p-8 mb-20">
        {Array.from({ length: numPages }).map((_, i) => (
          <div key={i} className="relative shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden bg-white">
             <canvas 
                ref={el => canvasRefs.current[i] = el}
                className="max-w-full h-auto"
             />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selection && (
          <SelectionPopup 
            selection={selection} 
            onClose={() => setSelection(null)} 
            docId={doc.doc_id}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentViewer;