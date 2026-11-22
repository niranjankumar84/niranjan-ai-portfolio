import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import { Award, ExternalLink, X, FileText, CheckCircle2 } from 'lucide-react';

export default function AchievementsSection() {
  const [selectedItem, setSelectedItem] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="achievements" className="py-20 border-t border-white/5">
      
      {/* Header */}
      <div className="space-y-2 pb-12">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 05</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40"></span>
          <span>RECOGNITION & PARTICIPATION</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
            Achievements & Certifications
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            [CLICK CARDS TO PREVIEW DETAILS]
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personalData.achievements.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            onClick={() => setSelectedItem(item)}
            className="p-6 rounded-xl border border-white/10 bg-surface-card/60 backdrop-blur-md hover:border-cyan-glow/40 hover:bg-surface-hover cursor-pointer transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pb-3 border-b border-white/5">
                <span>ENTRY // {item.number}</span>
                <span className="text-cyan-glow/80 px-2 py-0.5 rounded bg-white/5">{item.type}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-glow transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  {item.subtitle}
                </p>
              </div>

              <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed font-light">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400 group-hover:text-cyan-glow transition-colors duration-200">
              <span className="text-[11px]">{item.status}</span>
              <span className="text-[10px] underline underline-offset-4">VIEW DETAILS ➔</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox / Modal Viewer (ESC to close) */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-surface-card p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
                  <span>{selectedItem.type.toUpperCase()}</span>
                  <span>•</span>
                  <span>{selectedItem.status.toUpperCase()}</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {selectedItem.title}
                </h3>
                <p className="text-base text-zinc-300 font-medium">
                  {selectedItem.subtitle}
                </p>
              </div>

              {/* Document / Credential Preview Box */}
              <div className="w-full h-48 rounded-xl border border-dashed border-white/15 bg-black/50 p-6 flex flex-col items-center justify-center space-y-3 text-center">
                <FileText className="w-8 h-8 text-cyan-glow/80" />
                <div className="font-mono text-xs text-zinc-300">
                  CREDENTIAL DOCUMENTATION PLACEHOLDER
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  Ready to link verified certificate or credential PDF/Image.
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-zinc-400">DESCRIPTION & CONTEXT:</div>
                <p className="text-sm text-zinc-300 leading-relaxed font-light">
                  {selectedItem.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>PRESS [ESC] OR CLICK OUTSIDE TO DISMISS</span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg border border-white/10 hover:border-cyan-glow/40 text-zinc-300 hover:text-cyan-glow transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
