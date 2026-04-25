import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";
import { useAbout } from "../hooks/useAbout";

const Footer = () => {
  const { data: personal } = useAbout();

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { icon: Github, href: personal?.social?.github || "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: personal?.social?.linkedin || "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: personal?.social?.twitter || "https://twitter.com", label: "Twitter" },
  ];

  return (
    <footer className="bg-background border-t border-border/50 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-primary-foreground font-black font-heading text-xl">
                  {personal?.name?.charAt(0) || "D"}
                </span>
              </div>
              <span className="font-heading font-black text-2xl tracking-tighter">
                {personal?.name || "Dan Bahadur Bist"}
              </span>
            </Link>
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md mb-8">
              {personal?.summary || "Full-stack engineer specializing in building high-performance, user-centric digital experiences with modern technologies."}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-black text-sm uppercase tracking-[0.2em] mb-8 text-foreground/50">
              Navigation
            </h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center group font-medium"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-black text-sm uppercase tracking-[0.2em] mb-8 text-foreground/50">
              Get in Touch
            </h4>
            <div className="space-y-6">
              <a
                href={`mailto:${personal?.email || "danbahadur2060@gmail.com"}`}
                className="group block"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Email Me</span>
                <span className="text-lg font-bold group-hover:text-primary transition-colors flex items-center">
                  {personal?.email || "danbahadur2060@gmail.com"}
                  <Mail className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                </span>
              </a>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1">Location</span>
                <span className="text-lg font-bold">{personal?.location || "Remote / Global"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm font-medium">
            © {currentYear} {personal?.name || "Dan Bahadur Bist"}. Built with Passion.
          </p>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
