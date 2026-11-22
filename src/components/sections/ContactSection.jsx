import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import ContactTesseractCanvas from '../canvas/ContactTesseractCanvas';
import { Mail, Github, Linkedin, Instagram, ArrowUpRight, Copy, Check, Clock, MapPin, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    mail: Mail
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const [emailUser, emailDomain] = personalData.email.split('@');

  return (
    <section id="contact" className="py-24 border-t border-white/5 relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[38rem] h-[38rem] bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 pb-14">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 06</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40" />
          <span>INITIATE TRANSMISSION</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
            Let's Connect
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            [SPATIAL TELEMETRY • ACTIVE COMMUNICATION CHANNELS]
          </span>
        </div>
      </div>

      {/* Spatial 3D Composition: Hypercube + Oversized Kinetic Email */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left: Animated 3D Particle Tesseract / Hypercube */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[360px] aspect-square rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl p-4 flex flex-col items-center justify-center shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-glow/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* 3D Tesseract Canvas */}
            <ContactTesseractCanvas />
          </div>
        </div>

        {/* Right: Oversized Kinetic Email Typography & Minimal Floating Socials */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Telemetry Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
              <span className="text-zinc-200">OPEN TO ENGINEERING OPPORTUNITIES</span>
            </div>
            <div className="flex items-center space-x-6 text-[11px] text-zinc-500">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-glow" />
                <span>TIMEZONE: IST (UTC+5:30)</span>
              </span>
            </div>
          </div>

          {/* Oversized Kinetic Email Typography */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase block">
              // DIRECT CHANNEL TRANSMISSION
            </span>

            <a
              href={`mailto:${personalData.email}`}
              className="group block font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white hover:text-cyan-glow transition-all duration-300 break-all leading-tight select-all"
            >
              <span>{emailUser}</span>
              <span className="text-cyan-glow text-glow-cyan">@</span>
              <span>{emailDomain}</span>
            </a>

            {/* Quick Copy Action */}
            <div className="pt-2">
              <button
                onClick={copyEmail}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-cyan-glow/40 hover:text-cyan-glow text-xs font-mono text-zinc-300 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY EMAIL ADDRESS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Floating Minimal Social Buttons */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <span className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase block">
              // VERIFIED SOCIAL TELEMETRY
            </span>

            <div className="flex flex-wrap gap-3">
              {personalData.socialLinks.map((social, idx) => {
                const Icon = socialIcons[social.icon] || Mail;

                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-black/60 text-zinc-300 hover:border-cyan-glow/50 hover:text-cyan-glow hover:bg-cyan-glow/5 hover:shadow-[0_0_15px_rgba(0,229,255,0.25)] font-mono text-xs transition-all duration-300 group"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-glow group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">{social.name.toUpperCase()}</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-cyan-glow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
