import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { api, demo } from "../api/client";
import PlayerCard from "../components/PlayerCard";
import { useDemoQuery } from "../hooks/useDemoQuery";

export default function Partners() {
  const [sport, setSport] = useState("");
  const [query, setQuery] = useState("");
  const { data = { players: demo.players } } = useDemoQuery(["partners", sport], async () => (await api.get("/users/partners", { params: { sport } })).data, { players: demo.players });
  const players = useMemo(() => data.players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())), [data, query]);

  return (
    <div className="space-y-5">
      <section className="glass rounded-[2rem] p-6">
        <h1 className="text-4xl font-black">Find partners nearby</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_160px]">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4">
            <Search size={18} className="text-white/45" />
            <input className="w-full bg-transparent py-4 outline-none" placeholder="Search players" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <select className="rounded-2xl border border-white/10 bg-sportx-bg/80 px-4 py-4" value={sport} onChange={(e) => setSport(e.target.value)}>
            <option value="">All sports</option>
            {["Cricket", "Football", "Volleyball", "Basketball", "Running", "Chess", "Carrom", "Table Tennis"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => { setSport(""); setQuery(""); }} className="rounded-2xl border border-white/10 bg-white/10 font-bold" title="Reset filters"><SlidersHorizontal className="mx-auto" /></button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {players.map((player) => <PlayerCard key={player._id} player={player} />)}
      </section>
    </div>
  );
}
