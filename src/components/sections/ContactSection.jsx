import React from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import { Mail, Github, Linkedin, Instagram, ArrowUpRight, Clock, MapPin, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    mail: Mail
  };

  return (
    <section id="contact" className="py-24 border-t border-white/5 relative">
      
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="space-y-2 pb-12">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 06</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40"></span>
          <span>INITIATE CONTACT</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-6xl text-white tracking-tight uppercase">
          Let's Build Together
        </h2>
      </div>

      {/* Massive Kinetic Email Display */}
      <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-surface-card/70 backdrop-blur-xl relative overflow-hidden space-y-8">
        
        {/* Telemetry Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400 pb-6 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse"></span>
            <span className="text-zinc-300">OPEN TO DISCUSSIONS & COLLABORATIONS</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px] text-zinc-500">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>REPLIES WITHIN 24-48 HOURS</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>TIMEZONE: IST (UTC+5:30)</span>
            </span>
          </div>
        </div>

        {/* Giant Clickable Email */}
        <div className="py-4">
          <span className="text-xs font-mono text-zinc-500 block mb-2">DIRECT INQUIRY CHANNEL:</span>
          <a
            href={`mailto:${personalData.email}`}
            className="group block font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white hover:text-cyan-glow transition-all duration-300 break-all"
          >
            {personalData.email.split('@')[0]}
            <span className="text-cyan-glow">@</span>
            {personalData.email.split('@')[1]}
          </a>
        </div>

        {/* Social Pill Buttons */}
        <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
          {personalData.socialLinks.map((social, idx) => {
            const Icon = socialIcons[social.icon] || Mail;
            return (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-3 px-5 py-3 rounded-full border border-white/10 bg-black/50 text-zinc-300 hover:border-cyan-glow/50 hover:text-cyan-glow hover:bg-surface-hover font-mono text-xs transition-all duration-300"
              >
                <Icon className="w-4 h-4 text-cyan-glow" />
                <span>{social.name.toUpperCase()}</span>
                <span className="text-zinc-600 font-light text-[11px]">{social.handle}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
              </a>
            );
          })}
        </div>

      </div>

    </section>
  );
}
