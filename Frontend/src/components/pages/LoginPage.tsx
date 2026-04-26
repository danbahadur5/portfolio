import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, AlertCircle, Loader2, ShieldCheck, Key, ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

export function LoginPage() {
  const { login, verifyMFA, mfaRequired, tempToken, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef<HTMLInputElement>(null);
  const mfaRef = useRef<HTMLInputElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => {
    if (!mfaRequired) {
      emailRef.current?.focus();
    } else {
      mfaRef.current?.focus();
    }
  }, [mfaRequired]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempToken) return;

    setIsLoading(true);
    setError(null);

    try {
      await verifyMFA({
        tempToken,
        code: useBackupCode ? undefined : mfaCode,
        backupCode: useBackupCode ? backupCode : undefined,
      });
      toast.success("MFA Verified Successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "MFA Verification failed");
      toast.error(err.response?.data?.message || "MFA Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Back to Site Link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to website
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-sm overflow-hidden p-6">
            <CardHeader className="space-y-1 pb-4 pt-2 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 border border-primary/20 shadow-inner">
                {mfaRequired ? (
                  <Key className="w-6 h-6 text-primary animate-bounce" />
                ) : (
                  <Shield className="w-6 h-6 text-primary" />
                )}
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-white">
                {mfaRequired ? "Security Check" : "Admin Portal"}
              </CardTitle>
              <CardDescription className="text-slate-300 text-sm">
                {mfaRequired 
                  ? "Verification required to proceed" 
                  : "Secure access for authorized personnel only"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
              <AnimatePresence mode="wait">
                {!mfaRequired ? (
                  <motion.form
                    key="login-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-300 ml-1">
                        Identity
                      </label>
                      <Input
                        ref={emailRef}
                        type="email"
                        placeholder="admin@portal.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-9 bg-slate-950/50 border-slate-800 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary transition-all rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-300">
                          Passkey
                        </label>
                      </div>
                      <div className="relative group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-9 bg-slate-950/50 border-slate-800 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary transition-all rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-800"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="remember"
                          className="w-3.5 h-3.5 rounded border-slate-800 bg-slate-950 text-primary focus:ring-1 focus:ring-primary focus:ring-offset-slate-900"
                        />
                        <label htmlFor="remember" className="text-xs font-medium text-slate-300 cursor-pointer hover:text-slate-200 transition-colors">
                          Remember session
                        </label>
                      </div>
                      <button type="button" className="text-xs font-medium text-primary hover:underline transition-all">
                        Recovery?
                      </button>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p className="font-medium">{error}</p>
                      </motion.div>
                    )}

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full max-w-[240px] mx-auto block h-9 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Authenticating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <LogIn className="h-4 w-4" />
                            <span>Initialize Access</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="mfa-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleMFAVerify}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          {useBackupCode ? "Recovery Token" : "Authenticator Code"}
                        </label>
                        <button 
                          type="button" 
                          className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-tight"
                          onClick={() => setUseBackupCode(!useBackupCode)}
                        >
                          {useBackupCode ? "Use Code" : "Use Backup"}
                        </button>
                      </div>
                      
                      <div className="relative">
                        {useBackupCode ? (
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                              type="text"
                              placeholder="8-CHARACTER TOKEN"
                              value={backupCode}
                              onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                              className="h-9 pl-10 bg-slate-950/50 border-slate-800 text-sm text-white placeholder:text-slate-600 font-mono tracking-widest rounded-lg"
                              maxLength={8}
                              required
                            />
                          </div>
                        ) : (
                          <Input
                            ref={mfaRef}
                            type="text"
                            placeholder="000000"
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                            className="text-center text-xl tracking-[0.4em] font-mono h-10 bg-slate-950/50 border-slate-800 text-primary placeholder:text-slate-800 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                            maxLength={6}
                            required
                          />
                        )}
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p className="font-medium">{error}</p>
                      </motion.div>
                    )}

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full max-w-[240px] mx-auto block h-9 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                          "Verify Identity"
                        )}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-slate-600"
        >
          &copy; {new Date().getFullYear()} System Control. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
