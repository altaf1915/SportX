import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CircleDot, Newspaper, Search, ShieldCheck, Sparkles, Star, Trophy, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { demo, sportsList } from "../api/client";

const liveScores = [
  ["Mumbai Strikers", "2", "Bengaluru FC", "1", "72'"],
  ["Delhi Hoopers", "88", "Chennai Five", "84", "Q4"],
  ["Royals XI", "156/4", "Titans", "149/8", "Live"]
];

const news = [
  "National futsal league expands to eight new cities",
  "Badminton juniors shine in weekend championship",
  "Esports federation announces college circuit"
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="space-y-10">
      <section className="grid min-h-[78vh] items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
            <Sparkles size={16} className="text-sportx-accent" /> Premium multi-sport operating system
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
            SportX
            <span className="block text-gradient">Play, follow, manage, and win together.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            A production MERN sports platform for matches, live scores, communities, tournaments, teams, players, news, notifications, and role-based dashboards.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate("/login")} className="premium-button inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold">
              Start playing <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate("/matches")} className="rounded-2xl border border-white/10 bg-white/8 px-6 py-4 font-bold">Explore matches</button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="glass rounded-[2rem] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/55">Live center</p>
              <h2 className="text-2xl font-black">Scores changing now</h2>
            </div>
            <CircleDot className="text-red-300" />
          </div>
          <div className="mt-5 space-y-3">
            {liveScores.map(([home, hScore, away, aScore, clock]) => (
              <div key={home} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <div className="flex items-center justify-between text-sm text-sportx-accent"><span>Live</span><span>{clock}</span></div>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 font-bold"><span>{home}</span><span>{hScore}</span><span>{away}</span><span>{aScore}</span></div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[["Global search", Search], ["Tournaments", Trophy], ["Sports news", Newspaper], ["Verified safety", ShieldCheck]].map(([label, Icon]) => (
          <div className="glass rounded-2xl p-5" key={label}>
            <Icon className="text-sportx-secondary" />
            <h3 className="mt-4 text-xl font-bold">{label}</h3>
            <p className="mt-2 text-sm text-white/58">Built for repeat daily sports workflows.</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Trending sports</h2>
            <UsersRound className="text-sportx-secondary" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sportsList.slice(0, 12).map((sport) => <div key={sport} className="sport-card rounded-2xl border border-white/10 bg-white/6 p-4 font-bold">{sport}</div>)}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="text-2xl font-black">Latest news</h2>
          <div className="mt-4 space-y-3">
            {news.map((item) => <p key={item} className="rounded-2xl bg-white/8 p-4 text-white/72">{item}</p>)}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h2 className="text-2xl font-black">Featured players</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {demo.players.map((player) => (
              <div key={player._id} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p className="font-bold">{player.name}</p>
                <p className="mt-1 text-sm text-white/55">{player.city} - {player.sportsInterests.join(", ")}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-sportx-accent"><Star size={15} /> {player.rating.average} rating</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="text-2xl font-black">Upcoming events</h2>
          <div className="mt-4 space-y-3">
            {["City 5v5 Cup", "Open Cricket Trials", "Weekend Badminton Ladder"].map((event) => <p key={event} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4"><CalendarDays className="text-sportx-accent" /> {event}</p>)}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["How do teams register?", "Can admins manage reports?", "Does SportX support live updates?"].map((question) => (
          <div key={question} className="rounded-2xl border border-white/10 bg-white/6 p-5">
            <h3 className="font-black">{question}</h3>
            <p className="mt-2 text-sm text-white/58">Yes. The platform includes protected APIs, dashboards, and Socket.io infrastructure for real-time activity.</p>
          </div>
        ))}
      </section>
    </div>
  );
}
