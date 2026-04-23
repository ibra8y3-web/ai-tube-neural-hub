import React, { useState, useEffect } from 'react';
import { Mail, Clock, Copy, Download, Trash2, Box, Database, GraduationCap, Music, Play, Layout } from 'lucide-react';
import { getInboxItems, clearInbox, deleteInboxItem, copyToClipboard, downloadAsFile, downloadAsZip, getExtensionForType, InboxItem } from '../../lib/inbox';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { FolderArchive } from 'lucide-react';

export const InboxBrowser = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [items, setItems] = useState<InboxItem[]>([]);

  useEffect(() => {
    setItems(getInboxItems());
    const handleUpdate = () => setItems(getInboxItems());
    window.addEventListener('inbox_updated', handleUpdate);
    return () => window.removeEventListener('inbox_updated', handleUpdate);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '3d': return <Box className="w-4 h-4 text-fuchsia-500" />;
      case 'data': return <Database className="w-4 h-4 text-teal-500" />;
      case 'academy': return <GraduationCap className="w-4 h-4 text-yellow-500" />;
      case 'music': return <Music className="w-4 h-4 text-cyan-500" />;
      case 'video': return <Play className="w-4 h-4 text-rose-500" />;
      case 'content': return <Layout className="w-4 h-4 text-orange-500" />;
      default: return <Mail className="w-4 h-4 text-zinc-400" />;
    }
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    toast.success(lang === 'ar' ? 'تم النسخ بنجاح' : 'Copied successfully');
  };

  const handleDownload = (item: InboxItem) => {
    let filename = `export_${item.type}_${Date.now()}`;
    let ext = getExtensionForType(item.type, item.content, item.metadata);
    
    // Override for specific nested metadata content
    let downloadContent = item.content;
    if (item.type === 'devops' && item.metadata) {
       downloadContent = `DOCKERFILE:\n${item.metadata.dockerfile}\n\nNGINX:\n${item.metadata.nginxConfig}\n\nCICD:\n${item.metadata.cicdYaml}`;
       ext = 'sh'; 
    }
    if (item.type === 'architecture' && item.metadata) {
      downloadContent = JSON.stringify(item.metadata, null, 2);
      ext = 'json';
    }

    downloadAsFile(downloadContent, `${filename}.${ext}`);
    toast.success(lang === 'ar' ? 'بدأ التحميل' : 'Download started');
  };

  const handleDelete = (id: string) => {
    if (deleteInboxItem(id)) {
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success(lang === 'ar' ? 'تم الحذف' : 'Deleted');
    }
  };

  const handleDownloadProject = async (item: InboxItem) => {
    if (!item.metadata || typeof item.metadata !== 'object') return;
    
    let projectFiles: { [key: string]: string } = {};
    
    if (item.type === 'devops') {
      projectFiles = {
        'Dockerfile': item.metadata.dockerfile || '',
        'nginx.conf': item.metadata.nginxConfig || '',
        'ci-cd.yml': item.metadata.cicdYaml || '',
        'README.md': item.metadata.deploymentGuide || ''
      };
    } else if (item.type === 'architecture') {
      projectFiles = {
        'spec.json': JSON.stringify(item.metadata, null, 2),
        'diagram.mermaid': item.metadata.mermaid || '',
        'README.md': item.metadata.analysis || ''
      };
    } else if (item.type === 'persona' && Array.isArray(item.metadata)) {
      item.metadata.forEach((p: any, i: number) => {
        projectFiles[`persona_${i+1}_${p.name.replace(/\s+/g, '_')}.json`] = JSON.stringify(p, null, 2);
      });
      projectFiles['summary.md'] = `# Buyer Personas\n\nGenerated for: ${item.content}`;
    } else {
      // Generic bundling with smart extensions
      const smartExt = getExtensionForType(item.type, item.content, item.metadata);
      projectFiles = {
        [`result.${smartExt}`]: item.content,
        'metadata.json': JSON.stringify(item.metadata, null, 2)
      };
    }

    try {
      await downloadAsZip(projectFiles, `${item.type}_project_${item.id}`);
      toast.success(lang === 'ar' ? 'تم توليد وتنزيل المجلد!' : 'Folder generated and downloaded!');
    } catch (e) {
      toast.error(lang === 'ar' ? 'فشل التنزيل كـ ZIP' : 'Failed ZIP download');
    }
  };

  const [clearConfirm, setClearConfirm] = useState(false);

  const handleClearAll = () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
      toast.info(lang === 'ar' ? 'اضغط مرة أخرى للتأكيد' : 'Click again to confirm');
      return;
    }
    clearInbox();
    setItems([]);
    toast.info(lang === 'ar' ? 'تم مسح الصندوق' : 'Inbox cleared');
    setClearConfirm(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-orange-500">{lang === 'ar' ? 'صندوق الوارد (الإنجازات)' : 'Inbox (Your Results)'}</h3>
        </div>
        <button 
          onClick={handleClearAll} 
          className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
          title={lang === 'ar' ? 'مسح الكل' : 'Clear All'}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
             <Mail className="w-12 h-12 mb-3 opacity-20" />
             <p className="text-sm italic">{lang === 'ar' ? 'لا توجد نتائج محفوظة حتى الآن...' : 'No saved results yet...'}</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 group hover:border-orange-500/50 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-[10px] font-mono uppercase bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopy(item.content)} className="p-1.5 bg-zinc-800 hover:bg-orange-500 hover:text-black rounded transition-colors" title={lang === 'ar' ? 'نسخ' : 'Copy'}>
                      <Copy className="w-3 h-3" />
                    </button>
                    {item.metadata && typeof item.metadata === 'object' && (
                      <button onClick={() => handleDownloadProject(item)} className="p-1.5 bg-zinc-800 hover:bg-yellow-500 hover:text-black rounded transition-colors" title={lang === 'ar' ? 'تنزيل المجلد' : 'Download Folder'}>
                        <FolderArchive className="w-3 h-3" />
                      </button>
                    )}
                    <button onClick={() => handleDownload(item)} className="p-1.5 bg-zinc-800 hover:bg-blue-500 rounded transition-colors" title={lang === 'ar' ? 'تنزيل ملف' : 'Download File'}>
                      <Download className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-zinc-800 hover:bg-red-500 rounded transition-colors" title={lang === 'ar' ? 'حذف' : 'Delete'}>
                      <Trash2 className="w-3 h-3 text-red-500/70" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-zinc-300 line-clamp-3 mb-2 font-mono bg-black/30 p-2 rounded border border-zinc-800/50">
                  {item.content}
                </div>

                <div className="flex items-center gap-1.5 text-[8px] text-zinc-500 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
