import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, Crown, Menu, ShieldCheck, Trophy, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const nav = [
  ["Dashboard", "/dashboard"],
  ["Partners", "/partners"],
  ["Matches", "/matches"],
  ["Chat", "/chat"],
  ["Community", "/community"]
];

export default function Layout() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-sportx-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sportx-primary to-sportx-secondary shadow-glow">
              <Trophy size={22} />
            </span>
            <span className="text-xl font-black tracking-tight">SportX</span>
          </NavLink>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 lg:flex">
            {isAuthed && nav.map(([label, href]) => (
              <NavLink key={href} to={href} className={({ isActive }) => `rounded-full px-4 py-2 text-sm ${isActive ? "bg-white text-sportx-bg" : "text-white/70 hover:text-white"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {isAuthed ? (
              <>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5" title="Notifications"><Bell size={18} /></button>
                <button onClick={() => navigate("/premium")} className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-sportx-bg sm:flex"><Crown size={16} /> Premium</button>
                <button onClick={() => navigate("/profile")} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10" title={user?.name || "Profile"}><UserRound size={18} /></button>
                <button onClick={logout} className="rounded-full px-3 py-2 text-sm text-white/60">Logout</button>
              </>
            ) : (
              <button onClick={() => navigate("/login")} className="premium-button rounded-full px-5 py-2 font-semibold">Sign in</button>
            )}
            <button onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 lg:hidden" title="Menu"><Menu size={18} /></button>
          </div>
        </div>
        {isAuthed && menuOpen && (
          <nav className="mx-auto grid max-w-7xl gap-2 px-4 pb-4 lg:hidden">
            {nav.map(([label, href]) => (
              <NavLink key={href} to={href} onClick={() => setMenuOpen(false)} className={({ isActive }) => `rounded-2xl px-4 py-3 text-sm ${isActive ? "bg-white text-sportx-bg" : "bg-white/8 text-white/70"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-8 pt-4 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <span>SportX connects players, matches, venues, and communities.</span>
        <span className="flex items-center gap-2"><ShieldCheck size={16} /> Secure JWT, rate limited, and verification-ready.</span>
      </footer>
    </div>
  );
}
