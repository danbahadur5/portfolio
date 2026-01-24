import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${backend}/api/getcontact`);
        if (response.data.contacts && response.data.contacts.length > 0) {
          setContactInfo(response.data.contacts[0]);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }
    };
    fetchContact();
  }, []);

  let menu = ["/", "/projects", "/about", "/blog", "/contact"];
  return (
    <div>
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-muted/30 border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="font-bold text-xl mb-4">Dan Bahadur Bist</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Full-stack developer passionate about creating beautiful,
                functional web applications that solve real-world problems and
                deliver exceptional user experiences.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Projects", "About", "Blog", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <Link to={`/${item.toLowerCase()}`}>{item}</Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href={contactInfo?.github_profile || "https://github.com/danbahadur2060"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={contactInfo?.linkedin_profile || "https://linkedin.com/danbahadur2060"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={contactInfo?.twitter_profile || "https://twitter.com/danbahadur2060"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contactInfo?.email || "danbahadur2060@gmail.com"}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} DBB. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm mt-2 md:mt-0">
              Dan Bahadur Bist
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
