'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Share2, RefreshCw, Sparkles, Volume2, VolumeX, Play, Pause, ChevronRight, Image as ImageIcon, Loader2 } from 'lucide-react';
import { generateImage, generateVideo } from './actions';

type Step = 'UPLOAD' | 'PREVIEW' | 'GENERATING' | 'RESULT';

// --- Muji / High Fashion Color Palette ---
const COLORS = {
  bg: '#F9F8F4',       // 羊皮紙白
  ink: '#4A403A',      // 墨褐
  red: '#C25E55',      // 朱泥
  gold: '#D4B886',     // 啞金
  white: '#FFFFFF',
};

// --- Data: 精簡版新春趣聞 (Shortened for quick reading) ---
const TRIVIA_DATA = [
  {
    text: "傳說「年」獸怕紅怕嘈。古人貼紅紙、燒爆竹嚇走佢，習俗流傳千年，就變成今日熱鬧嘅「過年」。",
    imgPlaceholder: "🧨" 
  },
  {
    text: "初一忌掃地？老一輩話會將剛到步嘅「財氣」掃走。所以醒目嘅通常年三十晚就搞掂大掃除！",
    imgPlaceholder: "🧹"
  },
  {
    text: "全盒點解多數係圓形或八角形？圓代表「團圓」，八角取「發」嘅諧音。每格糖果，都係對新一年嘅甜美寄望。",
    imgPlaceholder: "🍬"
  },
  {
    text: "廣東人最講意頭：魚代表「年年有餘」，湯圓係「團團圓圓」，髮菜蠔豉喻意「發財好市」。食落肚嘅都係祝福。",
    imgPlaceholder: "🐟"
  },
  {
    text: "貼揮春有學問！面向大門計，上聯貼右手邊，下聯貼左手邊。分唔到？睇最後個字，三四聲(仄)係上聯，一二聲(平)係下聯。",
    imgPlaceholder: "🧧"
  }
];

// --- 組件：背景紋理 (Arches) ---
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

// --- 組件：全屏豐富 Loading (Rich Loader - Desktop Size Increased) ---
const RichLoader = ({ statusText }: { statusText: string }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TRIVIA_DATA.length);
    }, 4000); // 4秒轉一次 (配合短文案)
    return () => clearInterval(timer);
  }, []);

  const currentTrivia = TRIVIA_DATA[index];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 md:p-12 text-center"
      style={{ backgroundColor: COLORS.bg }}
    >
      <ArchesBackground />
      
      <div className="relative z-10 w-full max-w-md md:max-w-3xl flex flex-col items-center space-y-10">
        
        {/* Progress Indicator */}
        <div className="space-y-4">
          <div className="w-16 h-16 border-[1.5px] border-[#D4B886]/30 border-t-[#C25E55] rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-xl md:text-2xl tracking-widest text-[#4A403A] animate-pulse">
            {statusText}
          </p>
        </div>

        {/* Trivia Card (Desktop Size Increased) */}
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-white p-6 md:p-10 rounded-[1rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#EAE8E0]"
        >
          {/* Image Placeholder */}
          <div className="w-full aspect-video md:aspect-[21/9] bg-[#F9F8F4] rounded-md mb-6 flex items-center justify-center border border-[#EAE8E0] overflow-hidden">
             {/* 🟢 日後放真實圖片 */}
             <span className="text-4xl md:text-6xl">{currentTrivia.imgPlaceholder}</span>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[#C25E55] text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> 新春小趣聞
            </div>
            <p className="text-sm md:text-xl leading-relaxed text-[#4A403A]/80 text-justify md:text-center font-medium">
              {currentTrivia.text}
            </p>
          </div>
        </motion.div>

        <p className="text-[10px] md:text-xs text-[#4A403A]/40 tracking-widest uppercase">
          請勿關閉視窗，AI 正在努力運算中...
        </p>
      </div>
    </motion.div>
  );
};

// --- 組件：智能播放器 ---
const CinematicPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [visibleLayer, setVisibleLayer] = useState<0 | 1 | 2>(0);
  const [isMuted, setIsMuted] = useState(true); // Default Mute
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
      if (isPlaying) { 
        if (idx === visibleLayer) v.play().catch(() => {}); 
      } else { 
        v.pause(); 
      }
    });
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
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
        <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 border border-white/20">
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 border border-white/20">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

// --- 主頁面 ---
export default function Home() {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingTexts = ["構圖調整中...", "光線平衡中...", "注入節日氛圍...", "最後潤飾中...", "即將呈現..."];

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

  const animProps = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.5, ease: "easeOut" } as const 
  };

  return (
    <main className="fixed inset-0 w-full h-[100dvh] overflow-hidden font-sans selection:bg-[#C25E55]/20" style={{ color: COLORS.ink }}>
      <ArchesBackground />

      {/* Global Rich Loader */}
      <AnimatePresence>
        {(loading || step === 'GENERATING') && (
          <RichLoader statusText={loading ? loadingTexts[loadingTextIndex] : "為你精心製作中<br>約需時3分鐘,請稍等"} />
        )}
      </AnimatePresence>

      {/* 🟢 佈局容器：限制最大寬度，避免左右分太開 */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center max-w-[1280px] mx-auto">
        
        {/* === [LEFT] VISUAL AREA === */}
        <motion.div layout className={`
          relative w-full order-2 md:order-1 flex items-center justify-center
          ${step === 'UPLOAD' ? 'h-full md:w-1/2 p-6' : 'h-[70%] md:h-full md:flex-1'}
        `}>
          
          {/* STATE 1: UPLOAD CARD */}
          {step === 'UPLOAD' && !loading && (
             <motion.div key="card" {...animProps} className="w-full max-w-[340px] md:max-w-[420px] bg-white aspect-[3/4] rounded-[1rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center text-center justify-between border border-[#EAE8E0] relative overflow-hidden group">
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
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
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
              className="relative shadow-2xl overflow-hidden bg-black mx-auto
                         h-full max-h-full aspect-[9/16] 
                         md:h-[95vh] md:w-auto"
            >
               {step === 'PREVIEW' && generatedImage && (
                  <img src={generatedImage} className="w-full h-full object-cover" />
               )}
               {step === 'RESULT' && videoUrl && (
                  <CinematicPlayer videoUrl={videoUrl} />
               )}
            </motion.div>
          )}
        </motion.div>

        {/* === [RIGHT] CONTROLS AREA === */}
        {/* 🟢 Desktop: 減少 padding (pl-8)，讓文字更靠近圖片 */}
        <motion.div layout className={`
          relative flex flex-col justify-center order-3 md:order-2
          ${step === 'UPLOAD' ? 'hidden' : 'w-full h-[30%] md:h-full md:w-[400px] lg:w-[420px] bg-white/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-white/40 md:border-none p-6 md:p-8 md:pl-8 z-20'}
        `}>
          <AnimatePresence mode="wait">
             
             {/* PREVIEW CONTROLS */}
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

             {/* RESULT CONTROLS */}
             {step === 'RESULT' && (
                <motion.div key="res-ctrl" {...animProps} className="space-y-4 md:space-y-8 text-center md:text-left h-full flex flex-col justify-center">
                   <div className="hidden md:block space-y-4">
                      <h2 className="text-5xl font-serif text-[#4A403A]">整好喇!</h2>
                      <p className="opacity-60 text-sm tracking-widest leading-relaxed">
                        立即分享，送上最獨特的新年祝福
                      </p>
                   </div>
                   
                   <h2 className="md:hidden text-2xl font-serif text-[#4A403A] mb-1">整好喇!</h2>
                   <p className="md:hidden opacity-60 text-xs tracking-widest text-[#4A403A]">立即分享，送上最獨特的新年祝福</p>

                   <div className="w-full space-y-3 pt-2">
                      <button 
                         onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Check out my CNY 2026 AI Video! " + window.location.href)}`)} 
                         className="w-full py-4 md:py-5 bg-[#C25E55] text-white tracking-[0.2em] rounded-[4px] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-[#A94A42]"
                      >
                         <Share2 className="w-4 h-4" /> 即刻分享
                      </button>
                      
                      <p className="text-[10px] md:text-xs text-[#4A403A]/40 tracking-widest mt-4">
                         也可於收件匣查看此短片
                      </p>
                   </div>
                </motion.div>
             )}

          </AnimatePresence>
        </motion.div>

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