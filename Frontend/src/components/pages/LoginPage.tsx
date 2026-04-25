import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

type Errors = {
  email?: string;
  password?: string;
  general?: string;
};

import { login, UserRole } from "@/utils/auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ [K in keyof FormData]?: boolean }>(
    {}
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Autofocus email for quicker login
    emailRef.current?.focus();
    const remembered = localStorage.getItem("rememberMe") === "true";
    if (remembered) {
      const savedEmail = localStorage.getItem("savedEmail") || "";
      setFormData((f) => ({ ...f, email: savedEmail, remember: true }));
    }
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isAuthenticated || loggedIn) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Minimal validator: returns errors object (empty => valid)
  const getValidationErrors = (data: FormData): Errors => {
    const e: Errors = {};
    if (!data.email) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      e.email = "Please enter a valid email address.";
    }

    if (!data.password) {
      e.password = "Password is required.";
    } else if (data.password.length < 4) {
      e.password = "Password must be at least 4 characters.";
    }
    return e;
  };

  const validateAndSet = (fields?: Partial<FormData>): boolean => {
    const merged = { ...formData, ...fields };
    const newErrors = getValidationErrors(merged);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onBlurField = (name: keyof FormData) => {
    setTouched((t) => ({ ...t, [name]: true }));
    validateAndSet();
  };

  const handleInput =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.currentTarget.type === "checkbox"
          ? e.currentTarget.checked
          : e.currentTarget.value;
      setFormData((prev) => ({ ...prev, [field]: value } as FormData));
      // Clear server/general errors when user edits
      setErrors((prev) => ({ ...prev, general: undefined }));
      // Optionally validate live but only show field error if touched
      if (touched[field]) {
        validateAndSet({ [field]: value } as Partial<FormData>);
      }
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // mark all fields touched so validation messages show if invalid
    setTouched({ email: true, password: true, remember: true });
    if (!validateAndSet()) return;

    setLoading(true);
    setErrors({});
    setSuccessMsg(null);

    try {
      const res = await api.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data?.success) {
        setIsAuthenticated(true);
        if (res.data.token && res.data.user?.role) {
          login(res.data.token, res.data.user.role as UserRole);
        }

        // Remember me behavior: save email only (not password)
        if (formData.remember) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedEmail");
        }

        // Friendly success message (screen readers will pick up)
        setSuccessMsg("Signed in successfully. Redirecting to dashboard...");
        // navigate immediately to dashboard (keeps UX snappy)
        navigate("/dashboard");
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            res.data?.message || "Invalid credentials — please try again.",
        }));
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Network error — please check your connection.";
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
      >
        <Card className="w-full max-w-md rounded-2xl shadow-lg border border-gray-200 bg-white">
          <CardContent className="p-6">
            <header className="mb-4">
              <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <LogIn className="w-6 h-6 text-blue-600" /> Sign in to your
                account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email and password to access your dashboard.
              </p>
            </header>

            {/* Accessible live region for general errors & success */}
            <div aria-live="polite" className="min-h-[1.5rem]">
              {errors.general && (
                <div
                  role="alert"
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm mb-3"
                >
                  <AlertCircle size={16} /> {errors.general}
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm mb-3">
                  <CheckCircle2 size={16} /> {successMsg}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInput("email")}
                  onBlur={() => onBlurField("email")}
                  ref={emailRef}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : "email-help"}
                  className={`mt-2 ${errors.email ? "border-red-500" : ""}`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle size={14} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative mt-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInput("password")}
                    onBlur={() => onBlurField("password")}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : "password-help"
                    }
                    className={`pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    {errors.password && (
                      <p
                        id="password-error"
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertCircle size={14} /> {errors.password}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="inline-flex items-center text-sm select-none">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-300"
                    checked={formData.remember}
                    onChange={handleInput("remember")}
                    aria-checked={formData.remember}
                  />
                  Remember me
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: loading ? "#94c6ff" : undefined,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  <motion.span
                    initial={{ scale: 1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      // simple spinner (SVG)
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    {loading ? "Signing in..." : "Sign In"}
                  </motion.span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
