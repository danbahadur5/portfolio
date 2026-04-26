import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowUpRight,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Phone,
  MapPin,
} from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";

const iconMap: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects", enabled: settings?.features?.projects !== false },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog", enabled: settings?.features?.blog !== false },
    { label: "Contact", path: "/contact" },
  ].filter(link => link.enabled !== false);

  const socialLinks = settings?.socialLinks
    ?.filter(link => link.enabled)
    .map(link => ({
      icon: iconMap[link.platform.toLowerCase()] || Globe,
      href: link.url,
      label: link.platform,
    })) || [];

  return (
    <footer className="relative bg-background border-t border-border/50 pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 bg-primary rounded-2xl rotate-0 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-primary/20"
                />
                <span className="relative text-primary-foreground font-black text-2xl">
                  {settings?.siteName?.charAt(0) || "P"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tighter leading-none mb-1">
                  {settings?.siteName || "Portfolio"}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
                  {settings?.siteTagline || "Digital Artisan"}
                </span>
              </div>
            </Link>
            
            <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">
              {settings?.siteDescription || "Crafting exceptional digital experiences with a focus on innovation, performance, and user-centric design."}
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-500 border border-border/50 hover:border-primary/50 shadow-sm"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-10 text-primary">
              Navigation
            </h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center group font-semibold text-base"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-primary mr-0 group-hover:mr-3 transition-all duration-300" />
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-10 text-primary">
              Get in Touch
            </h4>
            <div className="space-y-8">
              {settings?.contact.email && (
                <div className="group">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-3">Drop a line</span>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="text-lg font-bold hover:text-primary transition-all duration-300 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Mail className="w-4 h-4" />
                    </div>
                    {settings.contact.email}
                  </a>
                </div>
              )}
              
              {settings?.contact.phone && (
                <div className="group">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-3">Let's talk</span>
                  <div className="text-lg font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    {settings.contact.phone}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-muted-foreground text-sm font-semibold">
              © {currentYear} {settings?.siteName || "Portfolio"}. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors">
              Privacy
            </Link>
            <div className="w-1 h-1 rounded-full bg-border" />
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors">
              Terms
            </Link>
            <div className="w-1 h-1 rounded-full bg-border" />
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-muted-foreground hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
