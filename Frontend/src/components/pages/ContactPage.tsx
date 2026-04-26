import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  Star,
  Sparkles,
  ChevronDown,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { LoadingSpinner } from "../LoadingSpinner";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import { Layout } from "../Layout";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
}

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [aboutInfo, setAboutInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [contactRes, aboutRes] = await Promise.all([
          api.get("/api/getcontact"),
          api.get("/api/getabout"),
        ]);

        if (contactRes.data.contacts && contactRes.data.contacts.length > 0) {
          setContactInfo(contactRes.data.contacts[0]);
        }
        if (aboutRes.data.about) {
          // Handle both object and array response
          const aboutData = Array.isArray(aboutRes.data.about) 
            ? aboutRes.data.about[0] 
            : aboutRes.data.about;
          setAboutInfo(aboutData);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await api.post("/api/sendmessage", data);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: contactInfo?.email || "danbahadur2060@gmail.com",
      description: "Send me an email anytime",
      color: "text-blue-500",
      href: `mailto:${contactInfo?.email || "danbahadur2060@gmail.com"}`,
    },
    {
      icon: Phone,
      title: "Phone",
      value: contactInfo?.phone || "9712345678",
      description: "Call me during business hours",
      color: "text-green-500",
      href: `tel:${contactInfo?.phone || "9712345678"}`,
    },
    {
      icon: MapPin,
      title: "Location",
      value: aboutInfo?.location || "Ramkot, Kathmandu",
      description: "Available for local meetings",
      color: "text-purple-500",
      href: "#",
    },
  ];

  const projectTypes = [
    { label: "Web Development", popular: true },
    { label: "Mobile App", popular: false },
    { label: "E-commerce", popular: true },
    { label: "SaaS Platform", popular: true },
    { label: "Landing Page", popular: false },
    { label: "API Development", popular: false },
  ];

  const budgetRanges = [
    "Under $5k",
    "$5k - $15k",
    "$15k - $50k",
    "$50k+",
    "Let's discuss",
  ];

  const timelines = [
    "ASAP",
    "1-2 weeks",
    "1-2 months",
    "3-6 months",
    "Flexible",
  ];

  return (
    <Layout>
      <div className="relative min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="max-w-5xl mx-auto text-center mb-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              Available for new projects
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tightest mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
            >
              LET'S <span className="text-primary">CONNECT</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto"
            >
              Have a groundbreaking idea or a complex problem to solve? I'm here
              to help you build something extraordinary.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
              <Card className="border-none bg-background/40 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-6 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">Send a Message</h2>
                    <p className="text-muted-foreground text-sm font-medium">
                      Fill out the form below and I'll get back to you within 24
                      hours.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitStatus === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-20"
                      >
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
                        <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto leading-relaxed">
                          Thank you for reaching out. I've received your message and will get back to you shortly.
                        </p>
                        <Button 
                          onClick={() => setSubmitStatus("idle")}
                          className="h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-widest"
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label 
                              htmlFor="name"
                              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1"
                            >
                              Full Name *
                            </label>
                            <Input
                              id="name"
                              {...register("name", {
                                required: "Name is required",
                              })}
                              placeholder="e.g. John Doe"
                              aria-invalid={errors.name ? "true" : "false"}
                              aria-describedby={errors.name ? "name-error" : undefined}
                              className={`h-10 rounded-xl border-none bg-muted/50 px-4 font-sans text-sm transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 ${errors.name ? "ring-2 ring-destructive/20" : ""}`}
                            />
                            {errors.name && (
                              <p 
                                id="name-error"
                                className="text-destructive text-[10px] font-bold uppercase tracking-widest mt-1 ml-1"
                              >
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <label 
                              htmlFor="email"
                              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1"
                            >
                              Email Address *
                            </label>
                            <Input
                              id="email"
                              type="email"
                              {...register("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^\S+@\S+$/i,
                                  message: "Invalid email address",
                                },
                              })}
                              placeholder="e.g. john@example.com"
                              aria-invalid={errors.email ? "true" : "false"}
                              aria-describedby={errors.email ? "email-error" : undefined}
                              className={`h-10 rounded-xl border-none bg-muted/50 px-4 font-sans text-sm transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 ${errors.email ? "ring-2 ring-destructive/20" : ""}`}
                            />
                            {errors.email && (
                              <p 
                                id="email-error"
                                className="text-destructive text-[10px] font-bold uppercase tracking-widest mt-1 ml-1"
                              >
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label 
                            htmlFor="subject"
                            className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1"
                          >
                            Subject *
                          </label>
                          <Input
                            id="subject"
                            {...register("subject", {
                              required: "Subject is required",
                            })}
                            placeholder="What can I help you with?"
                            aria-invalid={errors.subject ? "true" : "false"}
                            aria-describedby={errors.subject ? "subject-error" : undefined}
                            className={`h-10 rounded-xl border-none bg-muted/50 px-4 font-sans text-sm transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 ${errors.subject ? "ring-2 ring-destructive/20" : ""}`}
                          />
                          {errors.subject && (
                            <p 
                              id="subject-error"
                              className="text-destructive text-[10px] font-bold uppercase tracking-widest mt-1 ml-1"
                            >
                              {errors.subject.message}
                            </p>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label 
                              htmlFor="budget"
                              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1"
                            >
                              Budget Range
                            </label>
                            <div className="relative">
                              <select
                                id="budget"
                                {...register("budget")}
                                aria-label="Select budget range"
                                className="w-full h-10 rounded-xl border-none bg-muted/50 px-4 font-sans text-sm appearance-none cursor-pointer transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                              >
                                <option value="">Select budget range</option>
                                {budgetRanges.map((range) => (
                                  <option key={range} value={range}>
                                    {range}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label 
                              htmlFor="timeline"
                              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1"
                            >
                              Project Timeline
                            </label>
                            <div className="relative">
                              <select
                                id="timeline"
                                {...register("timeline")}
                                aria-label="Select timeline"
                                className="w-full h-10 rounded-xl border-none bg-muted/50 px-4 font-sans text-sm appearance-none cursor-pointer transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                              >
                                <option value="">Select timeline</option>
                                {timelines.map((timeline) => (
                                  <option key={timeline} value={timeline}>
                                    {timeline}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label 
                            htmlFor="message"
                            className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1"
                          >
                            Project Details *
                          </label>
                          <Textarea
                            id="message"
                            {...register("message", {
                              required: "Message is required",
                            })}
                            placeholder="Describe your vision, goals, and any specific requirements..."
                            aria-invalid={errors.message ? "true" : "false"}
                            aria-describedby={errors.message ? "message-error" : undefined}
                            className={`min-h-[120px] rounded-xl border-none bg-muted/50 p-4 font-sans text-sm leading-relaxed transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 ${
                              errors.message ? "ring-2 ring-destructive/20" : ""
                            }`}
                          />
                          {errors.message && (
                            <p 
                              id="message-error"
                              className="text-destructive text-[10px] font-bold uppercase tracking-widest mt-1 ml-1"
                            >
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-10 rounded-xl font-black text-xs uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all group"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" />
                                <span>Dispatching...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span>Launch Inquiry</span>
                              </div>
                            )}
                          </Button>
                        </div>

                        {submitStatus === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-bold"
                          >
                            <AlertCircle className="w-5 h-5" />
                            <span>Something went wrong. Please check your connection and try again.</span>
                          </motion.div>
                        )}

                        <div className="flex flex-col items-center gap-4 pt-4">
                          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Average response time: &lt; 24 hours
                          </p>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Sidebar Contact Info */}
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.title}
                    href={method.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="block p-6 rounded-[2rem] bg-background/40 backdrop-blur-xl border border-primary/5 hover:border-primary/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-primary/5 ${method.color} group-hover:scale-110 transition-transform`}>
                        <method.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg">{method.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">{method.description}</p>
                    <p className="text-base font-bold text-foreground break-all">{method.value}</p>
                  </motion.a>
                ))}


              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
