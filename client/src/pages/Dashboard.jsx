import { Activity, CalendarDays, Crown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, demo } from "../api/client";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useDemoQuery } from "../hooks/useDemoQuery";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: recs = {} } = useDemoQuery(["recommendations"], async () => (await api.get("/ai/recommendations")).data, { matches: demo.matches, partners: demo.players, fitnessTips: [] });

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sportx-secondary">Good evening, {user?.name}</p>
            <h1 className="mt-2 text-4xl font-black">Your sports command center</h1>
            <p className="mt-3 max-w-2xl text-white/60">Upcoming matches, player suggestions, reputation, fitness nudges, and community activity in one place.</p>
          </div>
          <button onClick={() => navigate("/matches")} className="accent-button rounded-2xl px-5 py-3 font-bold">Create a match</button>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming matches" value={recs.matches?.length || 2} note="Next 7 days" />
        <StatCard label="Trust score" value="96" note="Top 4% nearby" />
        <StatCard label="Most played" value={user?.sportsInterests?.[0] || "Football"} note="This month" />
        <StatCard label="Premium value" value="4.8x" note="More partner reach" />
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass rounded-2xl p-5">
          <h2 className="text-2xl font-black">Recommended matches</h2>
          <div className="mt-4 space-y-3">
            {recs.matches?.map((match) => (
              <div key={match._id} className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-bold">{match.title}</p>
                  <p className="text-sm text-white/55">{match.sport} - {match.venue?.name} - {new Date(match.startsAt).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-sportx-primary px-3 py-1 text-sm">{match.players?.length || 1}/{match.maxPlayers}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="text-2xl font-black">AI assistant</h2>
          <div className="mt-5 space-y-4 text-sm text-white/68">
            <p className="flex gap-3"><TrendingUp className="text-sportx-accent" /> Your best match window is Saturday evening.</p>
            <p className="flex gap-3"><Activity className="text-sportx-secondary" /> Add agility drills before your next game.</p>
            <p className="flex gap-3"><CalendarDays className="text-sportx-primary" /> A 12-player knockout fits your community.</p>
            <p className="flex gap-3"><Crown className="text-sportx-accent" /> Priority listing can increase invites.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
