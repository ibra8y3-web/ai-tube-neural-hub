import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Download, Loader2, Wand2 } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { toast } from 'sonner';

import { saveToInbox } from '../../lib/inbox';

interface VisionLabProps {
  lang: 'ar' | 'en';
}

export const VisionLab: React.FC<VisionLabProps> = ({ lang }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (generatedImage && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGeneratedImage(null);
      setTimeLeft(30);
    }
    return () => clearInterval(timer);
  }, [generatedImage, timeLeft]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const encodedPrompt = encodeURIComponent(`Professional, high-quality, detailed design: ${prompt}. Minimalist, clean background, 4k, vector aesthetic.`);
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`;
      
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      setGeneratedImage(imageUrl);
      saveToInbox({ type: 'vision', content: prompt, metadata: { imageUrl } });
      toast.success(lang === 'ar' ? 'تم توليد الصورة بنجاح!' : 'Image generated successfully!');
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error(lang === 'ar' ? 'فشل توليد الصورة. حاول مرة أخرى.' : 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(lang === 'ar' ? 'تم تحميل الصورة' : 'Image downloaded');
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل التحميل' : 'Download failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
        <h3 className="text-purple-500 font-bold mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {lang === 'ar' ? 'مختبر الرؤية الذكي' : 'Smart Vision Lab'}
        </h3>
        <p className="text-sm text-zinc-400">
          {lang === 'ar' 
            ? 'حول أفكارك إلى صور، شعارات، أو تصاميم واجهات احترافية فوراً.' 
            : 'Transform your ideas into images, logos, or UI designs instantly.'}
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={lang === 'ar' ? 'صف الصورة التي تريدها بالتفصيل...' : 'Describe the image you want in detail...'}
          className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-purple-500 outline-none transition-all resize-none"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
          {lang === 'ar' ? 'توليد التصميم' : 'Generate Design'}
        </button>
      </div>

      {generatedImage && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative group rounded-2xl overflow-hidden border border-zinc-800">
            <img 
              src={generatedImage} 
              alt="Generated" 
              className="w-full aspect-square object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              {timeLeft}s
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
              <button 
                onClick={downloadImage}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
              >
                <Download className="w-5 h-5" />
                {lang === 'ar' ? 'تحميل الصورة' : 'Download Image'}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-zinc-500 italic">
            {lang === 'ar' ? 'ستختفي الصورة تلقائياً بعد 30 ثانية للأمان' : 'Image will disappear automatically after 30s for security'}
          </p>
        </div>
      )}
    </div>
  );
};
