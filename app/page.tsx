'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Share2, Sparkles, Volume2, VolumeX, Play, Pause, ChevronRight, Check, X, ChevronDown } from 'lucide-react';
import { generateImage, generateVideo } from './actions';

type Step = 'UPLOAD' | 'PREVIEW' | 'GENERATING' | 'RESULT';

// --- Colors ---
const COLORS = {
  bg: '#F9F8F4',       
  ink: '#4A403A',      
  red: '#C25E55',      
  gold: '#D4B886',     
  white: '#FFFFFF',
};

// --- Data: 趣聞 ---
const TRIVIA_DATA = [
  { text: "傳說「年」獸怕紅怕嘈。古人貼紅紙、燒爆竹嚇走佢，習俗流傳千年，就變成今日熱鬧嘅「過年」。", imgPlaceholder: "🧨" },
  { text: "初一忌掃地？老一輩話會將剛到步嘅「財氣」掃走。所以醒目嘅通常年三十晚就搞掂大掃除！", imgPlaceholder: "🧹" },
  { text: "全盒點解多數係圓形或八角形？圓代表「團圓」，八角取「發」嘅諧音。每格糖果，都係對新一年嘅甜美寄望。", imgPlaceholder: "🍬" },
  { text: "廣東人最講意頭：魚代表「年年有餘」，湯圓係「團團圓圓」，髮菜蠔豉喻意「發財好市」。食落肚嘅都係祝福。", imgPlaceholder: "🐟" },
  { text: "貼揮春有學問！面向大門計，上聯貼右手邊，下聯貼左手邊。分唔到？睇最後個字，三四聲(仄)係上聯，一二聲(平)係下聯。", imgPlaceholder: "🧧" }
];

// --- Data: 相片指引例子 ---
const PHOTO_GUIDES = [
  { type: 'good', src: '/guide-good.jpg', label: '建議：個人半身照', desc: '五官清晰，光線充足', color: '#4E8B56' }, 
  { type: 'bad', src: '/guide-bad-kids.jpg', label: '不建議：小童照片', desc: 'AI 無法生成／效果未必準確', color: '#C25E55' },
  { type: 'bad', src: '/guide-bad-group.jpg', label: '不建議：多人合照', desc: '無法鎖定主角', color: '#C25E55' },
  { type: 'bad', src: '/guide-bad-body.jpg', label: '不建議：全身遠照', desc: '面部細節模糊', color: '#C25E55' },
];

// --- Component: Background ---
const ArchesBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ backgroundColor: COLORS.bg }}>
    <div className="absolute inset-0 opacity-[0.05]" style={{ 
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='30' viewBox='0 0 60 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 V15 A15 15 0 0 1 30 15 A15 15 0 0 1 60 15 V30' fill='none' stroke='%234A403A' stroke-width='1.5'/%3E%3Cpath d='M0 15 V0 A15 15 0 0 1 30 0 A15 15 0 0 1 60 0 V15' fill='none' stroke='%234A403A' stroke-width='1.5'/%3E%3C/svg%3E")`,
      backgroundSize: '40px 20px'
    }}></div>
    <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] z-0 opacity-20" style={{ background: COLORS.red }}></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[140px] z-0 opacity-20" style={{ background: COLORS.gold }}></div>
  </div>
);

// --- Component: Scroll Indicator ---
const ScrollIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ delay: 1.5, duration: 1 }}
    className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-10"
  >
    <p className="text-[10px] md:text-xs tracking-[0.2em] font-bold text-[#C25E55] uppercase animate-pulse">
      Scroll to view tutorial
    </p>
    <ChevronDown className="w-5 h-5 text-[#C25E55] animate-bounce" />
  </motion.div>
);

// --- Component: Rich Loader ---
const RichLoader = ({ statusText }: { statusText: string }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setIndex((prev) => (prev + 1) % TRIVIA_DATA.length); }, 4000);
    return () => clearInterval(timer);
  }, []);
  const currentTrivia = TRIVIA_DATA[index];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 md:p-12 text-center" style={{ backgroundColor: COLORS.bg }}>
      <ArchesBackground />
      <div className="relative z-10 w-full max-w-md md:max-w-3xl flex flex-col items-center space-y-10">
        <div className="space-y-4">
          <div className="w-16 h-16 border-[1.5px] border-[#D4B886]/30 border-t-[#C25E55] rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-xl md:text-2xl tracking-widest text-[#4A403A] animate-pulse" dangerouslySetInnerHTML={{ __html: statusText }}></p>
        </div>
        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="w-full bg-white p-6 md:p-10 rounded-[1rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#EAE8E0]">
          <div className="w-full aspect-video md:aspect-[21/9] bg-[#F9F8F4] rounded-md mb-6 flex items-center justify-center border border-[#EAE8E0] overflow-hidden">
             <span className="text-4xl md:text-6xl">{currentTrivia.imgPlaceholder}</span>
          </div>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[#C25E55] text-xs md:text-sm font-bold tracking-[0.2em] uppercase"><Sparkles className="w-3 h-3 md:w-4 md:h-4" /> 新春小趣聞</div>
            <p className="text-sm md:text-xl leading-relaxed text-[#4A403A]/80 text-justify md:text-center font-medium">{currentTrivia.text}</p>
          </div>
        </motion.div>
        <p className="text-[10px] md:text-xs text-[#4A403A]/40 tracking-widest uppercase">請勿關閉視窗，AI 正在努力運算中...</p>
      </div>
    </motion.div>
  );
};

// --- Component: Cinematic Player (Result Video) ---
const CinematicPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [visibleLayer, setVisibleLayer] = useState<0 | 1 | 2>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const introRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);
  const outroRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = 0.4; }, []);
  useEffect(() => {
    const refs = [introRef.current, mainRef.current, outroRef.current];
    refs.forEach((v, idx) => {
      if (!v) return;
      v.muted = isMuted;
      if (isPlaying) { if (idx === visibleLayer) v.play().catch(() => {}); } else { v.pause(); }
    });
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (isPlaying) audioRef.current.play().catch(() => {}); else audioRef.current.pause();
    }
  }, [isPlaying, isMuted, visibleLayer]);

  const transitionTo = (targetLayer: 0 | 1 | 2) => {
    const targetRef = [introRef, mainRef, outroRef][targetLayer];
    if (targetRef.current) {
      targetRef.current.currentTime = 0;
      targetRef.current.play().then(() => setVisibleLayer(targetLayer)).catch(() => setVisibleLayer(targetLayer));
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-[inherit]">
      <audio ref={audioRef} src="/bgm.mp3" loop />
      {[
        { ref: introRef, src: "/intro.mp4", id: 0, next: 1 },
        { ref: mainRef, src: videoUrl, id: 1, next: 2 },
        { ref: outroRef, src: "/outro.mp4", id: 2, next: 0 }
      ].map((vid) => (
        <video key={vid.id} ref={vid.ref} src={vid.src} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${visibleLayer === vid.id ? 'opacity-100 z-20' : 'opacity-0 z-0'}`} playsInline muted={isMuted} preload="auto" onEnded={() => transitionTo(vid.next as 0|1|2)} />
      ))}
      <div className="absolute top-4 right-4 flex gap-3 z-50">
        <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 border border-white/20">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
        <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 border border-white/20">{isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</button>
      </div>
    </div>
  );
};

// --- Component: Interactive Demo Player (🟢 Updated Logic) ---
const InteractiveDemoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default unmuted logic

  // Handle Initial Play (Big Button)
  const handleStartPlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = false; // Try to unmute immediately
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false); // Success: Unmuted
      }).catch(() => {
        // Fallback: Browser blocked sound, force mute
        if (videoRef.current) {
           videoRef.current.muted = true;
           videoRef.current.play();
           setIsPlaying(true);
           setIsMuted(true);
        }
      });
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full aspect-[9/16] bg-black rounded-[1rem] overflow-hidden shadow-2xl ring-4 ring-white group cursor-pointer" onClick={!isPlaying ? handleStartPlay : undefined}>
       {/* 🟢 Video Element with 'loop' */}
       <video 
         ref={videoRef}
         src="/demo.mp4" 
         className="w-full h-full object-cover" 
         loop 
         playsInline 
         // Removed autoPlay
       />
       
       {/* 1. Big Play Button (Overlay) - Visible when NOT playing */}
       {!isPlaying && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-black/30">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }}
               className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
               <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
            <p className="absolute bottom-10 text-white/80 text-xs tracking-[0.2em] uppercase">Click to Watch</p>
         </div>
       )}

       {/* 2. Small Controls (Bottom Right) - Visible ONLY when playing */}
       {isPlaying && (
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
             <button 
                onClick={togglePlay}
                className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white/90 hover:bg-black/60 border border-white/10 transition-all"
             >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
             </button>
             <button 
                onClick={toggleMute}
                className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white/90 hover:bg-black/60 border border-white/10 transition-all"
             >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
             </button>
          </div>
       )}
    </div>
  );
};

// --- Component: Tutorial Section (Integrated) ---
const TutorialSection = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto py-20 px-6 md:px-12 flex flex-col md:flex-row gap-12 md:gap-20 items-start">
      
      {/* 1. Demo Video (Interactive) */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="space-y-2">
            <h3 className="text-2xl font-serif text-[#4A403A]">簡單2步</h3>
            <div className="w-12 h-1 bg-[#D4B886]"></div>
        </div>
        
        {/* Interactive Player Here */}
        <InteractiveDemoPlayer />

        <p className="text-sm text-[#4A403A]/60 leading-relaxed text-justify">
           上傳相片，確認造型，即可完成個人賀年短片！
        </p>
      </div>

      {/* 2. Photo Guidelines (Grid with Real Images) */}
      <div className="w-full md:w-2/3 flex flex-col gap-8">
         <div className="space-y-2">
            <h3 className="text-2xl font-serif text-[#4A403A]">相片指引</h3>
            <div className="w-12 h-1 bg-[#D4B886]"></div>
            <p className="text-[#4A403A]/60 pt-2">為獲得最佳效果，請參考以下建議：</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {PHOTO_GUIDES.map((guide, idx) => (
               <div key={idx} className="flex flex-col gap-3 group">
                  <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden shadow-sm border border-[#EAE8E0] group-hover:shadow-md transition-shadow">
                     {/* Real Image Render */}
                     <img src={guide.src} alt={guide.label} className="w-full h-full object-cover" />
                     
                     <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-sm"
                          style={{ backgroundColor: guide.type === 'good' ? '#4E8B56' : '#C25E55' }}>
                        {guide.type === 'good' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                     </div>
                  </div>
                  <div className="text-center md:text-left">
                     <p className="text-xs md:text-sm font-bold tracking-wider mb-1" style={{ color: guide.color }}>{guide.label}</p>
                     <p className="text-[10px] md:text-xs text-[#4A403A]/50">{guide.desc}</p>
                  </div>
               </div>
            ))}
         </div>
         <div className="p-6 bg-[#FFFFFF]/60 rounded-xl border border-[#D4B886]/20 text-sm text-[#4A403A]/80 leading-relaxed">
            <span className="font-bold text-[#C25E55]">💡 小貼士：</span> AI 會根據你上載的照片生成造型。建議選擇沒有太多遮擋（如口罩、墨鏡）的正面照片，效果會最自然、最似本人。
         </div>
      </div>
    </div>
  );
};

// --- Component: Floating Upload Button (Consistent UI) ---
const FloatingUploadBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-6"
    >
       <label className="cursor-pointer group">
          <button onClick={onClick} className="hidden" />
          <div className="py-4 px-8 min-w-[200px] bg-[#C25E55] text-white tracking-[0.2em] rounded-[4px] shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95 relative overflow-hidden animate-[pulse_3s_infinite] hover:animate-none border border-white/20">
             <span className="relative z-10 font-medium text-sm md:text-base">立即製作</span>
             <ChevronRight className="w-4 h-4 relative z-10" />
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
          </div>
       </label>
    </motion.div>
  );
};

// --- 主頁面 ---
export default function Home() {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  
  const uploadCardRef = useRef<HTMLDivElement>(null);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingTexts = ["構圖調整中...", "光線平衡中...", "注入節日氛圍...", "最後潤飾中...", "即將呈現..."];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setShowFloatingBtn(!entry.isIntersecting); },
      { threshold: 0.1 }
    );
    if (uploadCardRef.current && step === 'UPLOAD') { observer.observe(uploadCardRef.current); }
    return () => observer.disconnect();
  }, [step]);

  useEffect(() => {
    if (loading) {
      const i = setInterval(() => { setLoadingTextIndex(p => (p + 1) % loadingTexts.length); }, 2000);
      return () => clearInterval(i);
    }
  }, [loading]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (!file) return;
    setLoading(true); 
    try { 
      const fd = new FormData(); 
      fd.append("image", file); 
      const url = await generateImage(fd);
      setGeneratedImage(url); 
      setStep('PREVIEW'); 
    } catch { 
      alert("Error: Check API Key"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleGenerateVideo = async () => {
    if (!generatedImage) return; 
    setStep('GENERATING');
    try { 
      const url = await generateVideo(generatedImage);
      setVideoUrl(url); 
      setStep('RESULT'); 
    } catch { 
      setStep('PREVIEW'); 
      alert("Failed"); 
    }
  };

  const handleFloatingClick = () => { fileInputRef.current?.click(); };

  const animProps = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.5, ease: "easeOut" } as const 
  };

  return (
    <main className="relative min-h-screen w-full font-sans selection:bg-[#C25E55]/20 pb-20" style={{ color: COLORS.ink }}>
      <ArchesBackground />

      <AnimatePresence>
        {(loading || step === 'GENERATING') && (
          <RichLoader statusText={loading ? loadingTexts[loadingTextIndex] : "為你精心製作中<br>約需時3分鐘,請稍等"} />
        )}
      </AnimatePresence>

      <AnimatePresence>
         {step === 'UPLOAD' && showFloatingBtn && !loading && (
            <FloatingUploadBtn onClick={handleFloatingClick} />
         )}
      </AnimatePresence>

      <div className="relative z-10 w-full flex flex-col items-center max-w-[1280px] mx-auto min-h-[100dvh]">
        
        {/* === SECTION 1: HERO (Upload & Visual) === */}
        <div className="relative w-full min-h-[100dvh] flex flex-col md:flex-row items-center justify-center">
          
          {/* [LEFT] VISUAL AREA */}
          <motion.div layout className={`
            relative w-full order-2 md:order-1 flex items-center justify-center
            ${step === 'UPLOAD' ? 'h-[60vh] md:h-full md:w-1/2 p-6' : 'h-[70%] md:h-full md:flex-1'}
          `}>
            
            {/* STATE 1: UPLOAD CARD */}
            {step === 'UPLOAD' && !loading && (
               <motion.div 
                  ref={uploadCardRef} 
                  key="card" {...animProps} 
                  className="w-full max-w-[340px] md:max-w-[420px] bg-white aspect-[3/4] rounded-[1rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center text-center justify-between border border-[#EAE8E0] relative overflow-hidden group"
               >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-[#D4B886]"></div>
                  
                  <div className="mt-6 space-y-4">
                     <div className="inline-block px-3 py-1 bg-[#C25E55]/10 text-[#C25E55] text-[10px] tracking-[0.2em] font-bold uppercase rounded-sm">
                        CNY 2026
                     </div>
                     <h1 className="text-4xl md:text-5xl font-serif leading-tight text-[#4A403A]">
                        AI <br/><span className="text-[#C25E55] italic">新春造型</span>
                     </h1>
                     <p className="text-sm md:text-base text-[#4A403A]/60 tracking-wider leading-relaxed pt-2">
                        上載一張相<br/>為你訂製專屬賀年短片
                     </p>
                  </div>

                  <div className="w-full space-y-4 mb-2">
                     <label className="relative block w-full group/btn cursor-pointer">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                        <div className="w-full py-5 bg-[#C25E55] text-white tracking-[0.2em] rounded-[4px] shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95 relative overflow-hidden animate-[pulse_3s_infinite] hover:animate-none">
                           <span className="relative z-10 font-medium">上載相片</span>
                           <ChevronRight className="w-4 h-4 relative z-10" />
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                     </label>
                     <p className="text-xs text-[#4A403A]/40">*建議用清晰半身相，效果會更自然更靚</p>
                  </div>
               </motion.div>
            )}

            {/* STATE 2 & 4: 9:16 VISUAL FRAME */}
            {step !== 'UPLOAD' && step !== 'GENERATING' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="relative shadow-2xl overflow-hidden bg-black mx-auto h-full max-h-full aspect-[9/16] md:h-[95vh] md:w-auto"
              >
                 {step === 'PREVIEW' && generatedImage && <img src={generatedImage} className="w-full h-full object-cover" />}
                 {step === 'RESULT' && videoUrl && <CinematicPlayer videoUrl={videoUrl} />}
              </motion.div>
            )}
          </motion.div>

          {/* [RIGHT] CONTROLS AREA */}
          <motion.div layout className={`
            relative flex flex-col justify-center order-3 md:order-2
            ${step === 'UPLOAD' ? 'hidden' : 'w-full h-[30%] md:h-full md:w-[400px] lg:w-[420px] bg-white/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-white/40 md:border-none p-6 md:p-8 md:pl-8 z-20'}
          `}>
            <AnimatePresence mode="wait">
               {step === 'PREVIEW' && (
                  <motion.div key="preview-ctrl" {...animProps} className="space-y-4 md:space-y-8 text-center md:text-left h-full flex flex-col justify-center">
                     <div className="hidden md:block space-y-4">
                        <h2 className="text-5xl font-serif text-[#4A403A]">好靚！<br/>就用呢張？</h2>
                        <div className="w-12 h-1 bg-[#D4B886]"></div>
                     </div>
                     <h2 className="md:hidden text-2xl font-serif text-[#4A403A] mb-1">好靚！就用呢張？</h2>
                     <div className="w-full space-y-3 pt-2">
                        <button onClick={handleGenerateVideo} className="w-full py-4 md:py-5 bg-[#C25E55] text-white tracking-[0.2em] rounded-[4px] shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-[#A94A42]">
                           <Sparkles className="w-4 h-4" /> OK，整片啦
                        </button>
                        <button onClick={() => setStep('UPLOAD')} className="w-full py-3 text-xs text-[#4A403A]/50 hover:text-[#4A403A] border border-[#4A403A]/20 tracking-[0.2em] rounded-[4px] bg-transparent transition-colors">
                           換過張相
                        </button>
                     </div>
                  </motion.div>
               )}
               {step === 'RESULT' && (
                  <motion.div key="res-ctrl" {...animProps} className="space-y-4 md:space-y-8 text-center md:text-left h-full flex flex-col justify-center">
                     <div className="hidden md:block space-y-4">
                        <h2 className="text-5xl font-serif text-[#4A403A]">整好喇!</h2>
                        <p className="opacity-60 text-sm tracking-widest leading-relaxed">立即分享，送上最獨特的新年祝福</p>
                     </div>
                     <h2 className="md:hidden text-2xl font-serif text-[#4A403A] mb-1">整好喇!</h2>
                     <p className="md:hidden opacity-60 text-xs tracking-widest text-[#4A403A]">立即分享，送上最獨特的新年祝福</p>
                     <div className="w-full space-y-3 pt-2">
                        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Check out my CNY 2026 AI Video! " + window.location.href)}`)} className="w-full py-4 md:py-5 bg-[#C25E55] text-white tracking-[0.2em] rounded-[4px] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-[#A94A42]">
                           <Share2 className="w-4 h-4" /> 即刻分享
                        </button>
                        <p className="text-[10px] md:text-xs text-[#4A403A]/40 tracking-widest mt-4">也可於收件匣查看此短片</p>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
          </motion.div>

          {/* Scroll Indicator (Visible ONLY in UPLOAD Step) */}
          {step === 'UPLOAD' && !loading && (
             <ScrollIndicator />
          )}

        </div>

        {/* === SECTION 2: TUTORIAL / INTRO (Only visible in UPLOAD step) === */}
        {step === 'UPLOAD' && !loading && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <TutorialSection />
           </motion.div>
        )}

      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}