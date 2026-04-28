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
import { Logo } from "./ui/Logo";

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
    <footer 
      className="relative bg-background border-t border-border/50 pt-20 md:pt-32 pb-12 overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />

      <div className="responsive-container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20 md:mb-32">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-8 lg:space-y-10">
            <Link 
              to="/" 
              className="inline-block hover-lift transition-transform"
              aria-label="Go to home page"
            >
              <Logo size="lg" />
            </Link>
            
            <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
              {settings?.siteDescription || "Crafting exceptional digital experiences with a focus on innovation, performance, and user-centric design."}
            </p>

            <div className="flex gap-4" aria-label="Social media profiles">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -8, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-xl shadow-primary/5 hover:shadow-primary/20 hover-lift group"
                    aria-label={`Follow me on ${social.label}`}
                  >
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-12 text-primary/60">
              Navigation
            </h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-5">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center group font-bold text-lg"
                    >
                      <span className="w-0 group-hover:w-5 h-0.5 bg-primary mr-0 group-hover:mr-4 transition-all duration-300 rounded-full" />
                      {link.label}
                      <ArrowUpRight className="w-4 h-4 ml-2 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-12 text-primary/60">
              Get in Touch
            </h4>
            <div className="space-y-10">
              {settings?.contact.email && (
                <div className="group">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block mb-4">Drop a line</span>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="text-xl font-black hover:text-primary transition-all duration-300 flex items-center gap-4 hover-lift"
                    aria-label={`Email me at ${settings.contact.email}`}
                  >
                    <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg shadow-primary/5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="tracking-tight">{settings.contact.email}</span>
                  </a>
                </div>
              )}
              
              {settings?.contact.phone && (
                <div className="group">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block mb-4">Let's talk</span>
                  <a 
                    href={`tel:${settings.contact.phone}`}
                    className="text-xl font-black flex items-center gap-4 hover:text-primary transition-all duration-300 hover-lift"
                    aria-label={`Call me at ${settings.contact.phone}`}
                  >
                    <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="tracking-tight">{settings.contact.phone}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <p className="text-muted-foreground text-sm font-bold tracking-tight">
              © {currentYear} {settings?.siteName || "Portfolio"}. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center flex-wrap justify-center gap-x-10 gap-y-6">
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-primary text-xs font-black uppercase tracking-[0.2em] transition-colors"
            >
              Privacy
            </Link>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-primary text-xs font-black uppercase tracking-[0.2em] transition-colors"
            >
              Terms
            </Link>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-muted-foreground hover:text-primary text-xs font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 group cursor-pointer"
              aria-label="Scroll back to top of the page"
            >
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ↑
              </motion.span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
