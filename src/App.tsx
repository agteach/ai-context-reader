import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  MessageSquare, 
  Settings, 
  ChevronRight, 
  Sparkles,
  Search,
  BookOpen,
  LayoutDashboard,
  BrainCircuit,
  PanelRightClose,
  PanelRightOpen,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentViewer from './components/DocumentViewer';
import ChatPanel from './components/ChatPanel';
import UploadZone from './components/UploadZone';
import { Toaster, toast } from 'sonner';

const App: React.FC = () => {
  const [currentDoc, setCurrentDoc] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  const handleUploadSuccess = (doc: any) => {
    setCurrentDoc(doc);
    setHistory(prev => [doc, ...prev]);
    toast.success("Document processed and ready for analysis!");
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-center" richColors />
      
      {/* Left Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 72 }}
        className="border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col z-20 shadow-sm"
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/8c1f4b51-4111-4f63-91ce-fd1159794f92/applogo-a1ea8a8a-1771770159664.webp" 
                alt="Logo" 
                className="w-8 h-8 rounded-lg object-cover shadow-sm"
              />
              <span className="font-bold text-lg tracking-tight">DocuMind AI</span>
            </div>
          ) : (
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/8c1f4b51-4111-4f63-91ce-fd1159794f92/applogo-a1ea8a8a-1771770159664.webp" 
              alt="Logo" 
              className="w-8 h-8 mx-auto rounded-lg object-cover shadow-sm"
            />
          )}
          {isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Menu size={16} />
            </button>
          )}
        </div>

        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mx-auto mt-4 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={!currentDoc} isOpen={isSidebarOpen} onClick={() => setCurrentDoc(null)} />
            <NavItem icon={<BookOpen size={20}/>} label="Library" isOpen={isSidebarOpen} />
            <NavItem icon={<Settings size={20}/>} label="Settings" isOpen={isSidebarOpen} />
          </nav>

          {isSidebarOpen && history.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-3">Recent</p>
              {history.map((doc, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentDoc(doc)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    currentDoc?.doc_id === doc.doc_id 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 font-medium' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <FileText size={16} className="shrink-0" />
                  <span className="truncate">{doc.filename}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {isSidebarOpen && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">PRO ACCESS</p>
              <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">Unlock advanced vector search & large document analysis.</p>
              <button className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-medium text-zinc-500">
              {currentDoc ? `Documents / ${currentDoc.filename}` : "Documents / Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">AI Live</span>
             </div>
            <button className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Search size={18} />
            </button>
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isChatOpen 
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600' 
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isChatOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {currentDoc ? (
            <div className="flex-1 overflow-y-auto bg-zinc-100 dark:bg-zinc-900/50 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800">
              <DocumentViewer doc={currentDoc} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
              {/* Decorative background image */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ 
                  backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/8c1f4b51-4111-4f63-91ce-fd1159794f92/herobackground-0c29e9da-1771770159795.webp')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <UploadZone onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {/* Chat Panel */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-full flex flex-col shrink-0 shadow-2xl z-10"
              >
                <ChatPanel docId={currentDoc?.doc_id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, isOpen, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
      active 
        ? 'bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-medium' 
        : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
    }`}
  >
    <div className={`shrink-0 ${active ? 'text-indigo-600' : 'group-hover:text-zinc-900 dark:group-hover:text-zinc-100'}`}>
      {icon}
    </div>
    {isOpen && <span className="truncate">{label}</span>}
  </button>
);

export default App;