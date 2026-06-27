import { CheckCircle2, KeyRound, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, sportsList } from "../api/client";
import { useAuth } from "../context/AuthContext";

const tabs = [
  ["login", "Sign in"],
  ["register", "Register"],
  ["recover", "Recover"],
  ["verify", "Verify"]
];

export default function Login() {
  const { login, register, demoLogin, updateStoredUser } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "", sport: "Football", code: "", resetToken: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        navigate("/dashboard");
      }
      if (mode === "register") {
        await register({ name: form.name, email: form.email, password: form.password, city: form.city, sportsInterests: [form.sport] });
        navigate("/dashboard");
      }
      if (mode === "recover") {
        const { data } = await api.post("/auth/forgot-password", { email: form.email });
        setMessage(data.resetToken ? `Dev reset token: ${data.resetToken}` : data.message);
      }
      if (mode === "reset") {
        await api.post("/auth/reset-password", { token: form.resetToken, password: form.newPassword });
        setMessage("Password reset complete. You are signed in.");
        navigate("/dashboard");
      }
      if (mode === "verify") {
        const { data } = await api.post("/auth/verify-otp", { code: form.code });
        updateStoredUser(data.user);
        setMessage("Email verified.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "SportX could not complete that request.");
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass rounded-[2rem] p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map(([key, label]) => (
            <button key={key} onClick={() => setMode(key)} className={`rounded-full px-4 py-2 text-sm font-bold ${mode === key ? "bg-white text-sportx-bg" : "bg-white/8 text-white/70"}`}>
              {label}
            </button>
          ))}
          <button onClick={() => setMode("reset")} className={`rounded-full px-4 py-2 text-sm font-bold ${mode === "reset" ? "bg-white text-sportx-bg" : "bg-white/8 text-white/70"}`}>
            Reset
          </button>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <p className="text-sportx-secondary">{mode === "register" ? "Create your SportX identity" : "Secure player access"}</p>
            <h1 className="mt-2 text-4xl font-black">{mode === "login" ? "Enter SportX" : mode === "recover" ? "Recover account" : mode === "reset" ? "Set new password" : mode === "verify" ? "Verify email" : "Join the platform"}</h1>
          </div>

          {mode === "register" && (
            <>
              <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none focus:border-sportx-secondary" placeholder="Full name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none focus:border-sportx-secondary" placeholder="City" value={form.city} onChange={(e) => setField("city", e.target.value)} />
                <select className="rounded-2xl border border-white/10 bg-sportx-bg/80 px-4 py-4" value={form.sport} onChange={(e) => setField("sport", e.target.value)}>
                  {sportsList.map((sport) => <option key={sport}>{sport}</option>)}
                </select>
              </div>
            </>
          )}

          {["login", "register", "recover"].includes(mode) && (
            <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none focus:border-sportx-secondary" placeholder="Email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
          )}
          {["login", "register"].includes(mode) && (
            <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none focus:border-sportx-secondary" placeholder="Password" type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} />
          )}
          {mode === "verify" && (
            <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none focus:border-sportx-secondary" placeholder="6-digit verification code" value={form.code} onChange={(e) => setField("code", e.target.value)} />
          )}
          {mode === "reset" && (
            <>
              <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none focus:border-sportx-secondary" placeholder="Reset token" value={form.resetToken} onChange={(e) => setField("resetToken", e.target.value)} />
              <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none focus:border-sportx-secondary" placeholder="New password" type="password" value={form.newPassword} onChange={(e) => setField("newPassword", e.target.value)} />
            </>
          )}

          {error && <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
          {message && <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}

          <button className="premium-button flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold">
            {mode === "register" ? <UserPlus size={18} /> : mode === "recover" ? <Mail size={18} /> : mode === "verify" ? <ShieldCheck size={18} /> : <KeyRound size={18} />}
            Continue
          </button>
        </form>

        <button onClick={() => { demoLogin(); navigate("/dashboard"); }} className="mt-4 w-full rounded-2xl border border-white/10 bg-white/10 py-4 font-bold">
          Launch seeded admin workspace
        </button>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/12 via-sportx-secondary/15 to-sportx-accent/15 p-8">
        <h2 className="text-4xl font-black">Verified players, protected sessions, real match flow.</h2>
        <div className="mt-8 space-y-4">
          {["JWT cookies and bearer tokens", "Email OTP verification", "Password reset and password change", "Google profile handoff", "Role dashboards for admin, coach, player, and moderator"].map((item) => (
            <p key={item} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4 text-white/72"><CheckCircle2 className="text-sportx-accent" /> {item}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
