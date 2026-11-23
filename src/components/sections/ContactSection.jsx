import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import ContactTesseractCanvas from '../canvas/ContactTesseractCanvas';
import {
  Mail,
  Github,
  Linkedin,
  Instagram,
  ArrowUpRight,
  Copy,
  Check,
  Clock,
  MapPin,
  Sparkles,
  Send,
  Terminal,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const contactChannels = [
    {
      name: "GitHub",
      handle: "@niranjankumar84",
      url: "https://github.com/niranjankumar84",
      description: "Exploration repositories, code architectures & prototypes",
      icon: Github,
      accent: "#00E5FF",
      tag: "CODE REPOSITORIES"
    },
    {
      name: "LinkedIn",
      handle: "in/niranjan-kumar84",
      url: "https://www.linkedin.com/in/niranjan-kumar84",
      description: "Professional network, engineering dialogue & academic milestones",
      icon: Linkedin,
      accent: "#38BDF8",
      tag: "PROFESSIONAL PROFILE"
    },
    {
      name: "Instagram",
      handle: "@this_is_niranjans",
      url: "https://www.instagram.com/this_is_niranjans/",
      description: "Personal visual documentation & life snapshots",
      icon: Instagram,
      accent: "#E1306C",
      tag: "VISUAL DIARY"
    },
    {
      name: "Direct Email",
      handle: "kumarniranjan84096@gmail.com",
      url: `mailto:${personalData.email}`,
      description: "Primary communication line for software engineering inquiries",
      icon: Mail,
      accent: "#10B981",
      tag: "PRIMARY CHANNEL"
    }
  ];

  return (
    <section
      id="contact"
      className="py-24 border-t border-white/5 relative"
      aria-label="Contact and Communication Channels"
    >
      {/* Background Ambient Glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="space-y-3 pb-14">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span>LAB // 06</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40" />
          <span>INITIATE DIRECT TRANSMISSION</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
              Let's Connect
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light max-w-2xl pt-1">
              Open for software engineering opportunities, applied AI collaboration, and technical discussions.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 self-start md:self-end">
            [TIMEZONE: IST UTC+5:30 • LOCATION: INDIA]
          </span>
        </div>
      </div>

      {/* Spatial Grid: Left 3D Tesseract / Right Interactive Communication Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Left Column: 3D Contact Constellation Hub & Quick Transmit Card */}
        <div className="lg:col-span-5 space-y-6">
          <ContactTesseractCanvas />

          {/* Quick Copy Action Banner */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-glow" />
                <span>QUICK COPY COMMAND</span>
              </span>
              <span className="text-[10px] text-zinc-500">ONE-CLICK</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <span className="text-xs font-mono text-zinc-300 truncate pr-2 select-all">
                {personalData.email}
              </span>

              <button
                type="button"
                onClick={copyEmail}
                className="px-3 py-1.5 rounded-lg border border-cyan-glow/40 bg-cyan-glow/10 hover:bg-cyan-glow/20 text-cyan-glow text-xs font-mono transition-colors flex items-center space-x-1.5 flex-shrink-0 cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1.5 pt-1"
              >
                <Check className="w-3 h-3" />
                <span>EMAIL COPIED TO CLIPBOARD // READY TO COMPOSE</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Channel Cards & Closing Statement */}
        <div className="lg:col-span-7 space-y-6">

          {/* Channel Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactChannels.map((channel, idx) => {
              const Icon = channel.icon;
              const isEmail = channel.name.includes("Email");

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl hover:border-cyan-glow/40 transition-all duration-300 space-y-3 group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-cyan-glow/40 transition-colors">
                        <Icon className="w-4 h-4 text-cyan-glow" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-zinc-400 uppercase">
                        {channel.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-glow transition-colors">
                        {channel.name}
                      </h3>
                      <div className="text-xs font-mono text-cyan-glow/90 pt-0.5 select-all">
                        {channel.handle}
                      </div>
                    </div>

                    <p className="text-[11px] font-mono text-zinc-400 leading-relaxed pt-1">
                      {channel.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={channel.url}
                      target={isEmail ? "_self" : "_blank"}
                      rel={isEmail ? "" : "noreferrer"}
                      className="inline-flex items-center space-x-1.5 text-xs font-mono font-semibold text-zinc-300 hover:text-cyan-glow transition-colors group-hover:translate-x-0.5 duration-200"
                    >
                      <span>{isEmail ? "COMPOSE EMAIL" : "VISIT CHANNEL"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-glow" />
                    </a>

                    {isEmail && (
                      <button
                        onClick={copyEmail}
                        className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors"
                        title="Copy email to clipboard"
                      >
                        [COPY]
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium Human-Centered Closing Statement */}
          <div className="p-7 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
              <Sparkles className="w-4 h-4 text-cyan-glow" />
              <span>CLOSING STATEMENT // NIRANJAN.AI</span>
            </div>

            <blockquote className="font-display font-normal text-lg sm:text-xl text-white leading-relaxed tracking-tight">
              "{personalData.bio.heroStatement}"
            </blockquote>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500 border-t border-white/5">
              <span>NIRANJAN KUMAR • SOFTWARE ENGINEER WITH AI</span>
              <span className="text-cyan-glow font-bold">BIT MESRA (2024–2027)</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
