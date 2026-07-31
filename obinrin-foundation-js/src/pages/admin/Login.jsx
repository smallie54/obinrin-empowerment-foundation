import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "../../admin/auth/AdminAuthContext";
import { webImg } from "../../assets/assets";

const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

export default function Login() {
  const { login, verifyTwoFactor } = useAdminAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("password"); // "password" | "2fa"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingToken, setPendingToken] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.requiresTwoFactor) {
        setPendingToken(result.pendingToken);
        setStep("2fa");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTwoFactorSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await verifyTwoFactor(pendingToken, code);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-lavender/40 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={getImg("logoimg")} alt="Obinrin" className="h-12 w-12 rounded-full object-cover mb-3" />
          <h1 className="font-heading font-bold text-xl text-charcoal">Admin Login</h1>
          <p className="text-xs text-charcoal/50 mt-1">Obinrin Empowerment Foundation</p>
        </div>

        {step === "password" ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-charcoal/60">Email</label>
              <div className="flex items-center gap-2 mt-1 border border-charcoal/15 rounded-xl px-3 py-2.5">
                <Mail size={16} className="text-charcoal/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="admin@obinrin.org"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/60">Password</label>
              <div className="flex items-center gap-2 mt-1 border border-charcoal/15 rounded-xl px-3 py-2.5">
                <Lock size={16} className="text-charcoal/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-charcoal/70 text-sm mb-2">
              <ShieldCheck size={16} className="text-purple" />
              Enter the 6-digit code from your authenticator app
            </div>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center tracking-[0.5em] text-lg border border-charcoal/15 rounded-xl px-3 py-3 outline-none"
              placeholder="000000"
            />

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting || code.length !== 6}
              className="w-full bg-purple hover:bg-purple/90 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {submitting ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("password");
                setCode("");
                setError("");
              }}
              className="w-full text-xs text-charcoal/50"
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
