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
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { LoadingSpinner } from "../LoadingSpinner";
import { useForm } from "react-hook-form";
import api from "../../utils/api";

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
          setAboutInfo(aboutRes.data.about);
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
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 py-2 px-4 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Available for new projects
            </Badge>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Let's{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Connect
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have a project in mind? I'd love to hear about it. Let's discuss
              how we can bring your ideas to life and create something amazing
              together.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                I'm always excited to work on new projects and collaborate with
                amazing people. Whether you have a specific project in mind or
                just want to say hello, don't hesitate to reach out.
              </p>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div
                      className={`p-3 rounded-lg bg-muted/50 ${method.color}`}
                    >
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{method.title}</h3>
                      <a
                        href={method.href}
                        className="text-foreground mb-1 hover:underline block"
                      >
                        {method.value}
                      </a>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Popular Project Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h3 className="font-bold text-xl mb-4">Popular Project Types</h3>
              <div className="flex flex-wrap gap-3">
                {projectTypes.map((type) => (
                  <Badge
                    key={type.label}
                    variant={type.popular ? "default" : "secondary"}
                    className="text-sm py-2 px-4"
                  >
                    {type.label}
                    {type.popular && <Star className="w-3 h-3 ml-2" />}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">
                    <q>
                      Dan Bahadur delivered exceptional work on our e-commerce
                      platform. His attention to detail and communication
                      throughout the project were outstanding.
                    </q>
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-muted rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Alex</p>
                      <p className="text-sm text-muted-foreground">
                        CEO, TechStart Inc.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">Send me a message</h3>
                  <p className="text-muted-foreground">
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
                      className="text-center py-12"
                    >
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. I'll get back to you soon!
                      </p>
                      <Button onClick={() => setSubmitStatus("idle")}>
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
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Name *
                          </label>
                          <Input
                            {...register("name", {
                              required: "Name is required",
                            })}
                            placeholder="Your full name"
                            className={errors.name ? "border-destructive" : ""}
                          />
                          {errors.name && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email *
                          </label>
                          <Input
                            type="email"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email address",
                              },
                            })}
                            placeholder="your@email.com"
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subject *
                        </label>
                        <Input
                          {...register("subject", {
                            required: "Subject is required",
                          })}
                          placeholder="What's this about?"
                          className={errors.subject ? "border-destructive" : ""}
                        />
                        {errors.subject && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Budget Range
                          </label>
                          <select
                            {...register("budget")}
                            className="w-full p-3 border border-border rounded-md bg-background"
                          >
                            <option value="">Select budget range</option>
                            {budgetRanges.map((range) => (
                              <option key={range} value={range}>
                                {range}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Timeline
                          </label>
                          <select
                            {...register("timeline")}
                            className="w-full p-3 border border-border rounded-md bg-background"
                          >
                            <option value="">Select timeline</option>
                            {timelines.map((timeline) => (
                              <option key={timeline} value={timeline}>
                                {timeline}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Message *
                        </label>
                        <Textarea
                          {...register("message", {
                            required: "Message is required",
                          })}
                          placeholder="Tell me about your project..."
                          className={`min-h-[120px] ${
                            errors.message ? "border-destructive" : ""
                          }`}
                        />
                        {errors.message && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            <span>Send Message</span>
                          </div>
                        )}
                      </Button>

                      {submitStatus === "error" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-destructive text-center"
                        >
                          Something went wrong. Please try again.
                        </motion.p>
                      )}

                      <p className="text-xs text-muted-foreground text-center">
                        I typically respond within 24 hours during business
                        days.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
