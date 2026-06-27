import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, MapPin, RefreshCw, Users } from "lucide-react";
import { useState } from "react";
import { api, demo, sportsList } from "../api/client";
import { useDemoQuery } from "../hooks/useDemoQuery";

const initialForm = {
  title: "",
  sport: "Football",
  venue: "",
  city: "",
  startsAt: "",
  maxPlayers: 10,
  price: 0
};

export default function Matches() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const { data = { matches: demo.matches }, isFetching } = useDemoQuery(["matches"], async () => (await api.get("/matches")).data, { matches: demo.matches });

  const createMatch = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        sport: form.sport,
        startsAt: form.startsAt,
        maxPlayers: Number(form.maxPlayers),
        price: Number(form.price),
        venue: { name: form.venue, city: form.city }
      };
      return (await api.post("/matches", payload)).data;
    },
    onSuccess: () => {
      setForm(initialForm);
      setMessage("Match published.");
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: (err) => setMessage(err.response?.data?.message || "Could not publish match.")
  });

  const joinMatch = useMutation({
    mutationFn: async (id) => (await api.post(`/matches/${id}/join`)).data,
    onSuccess: () => {
      setMessage("You joined the match.");
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: (err) => setMessage(err.response?.data?.message || "Could not join match.")
  });

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="glass rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-black">Create match</h1>
          {isFetching && <RefreshCw className="animate-spin text-sportx-secondary" size={18} />}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); createMatch.mutate(); }} className="mt-5 space-y-3">
          <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Title" value={form.title} onChange={(e) => setField("title", e.target.value)} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Venue" value={form.venue} onChange={(e) => setField("venue", e.target.value)} />
            <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="City" value={form.city} onChange={(e) => setField("city", e.target.value)} />
          </div>
          <select className="w-full rounded-2xl border border-white/10 bg-sportx-bg/80 px-4 py-4" value={form.sport} onChange={(e) => setField("sport", e.target.value)}>
            {sportsList.map((sport) => <option key={sport}>{sport}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" type="datetime-local" value={form.startsAt} onChange={(e) => setField("startsAt", e.target.value)} required />
            <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Max players" type="number" min="2" value={form.maxPlayers} onChange={(e) => setField("maxPlayers", e.target.value)} />
          </div>
          <input className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Entry fee" type="number" min="0" value={form.price} onChange={(e) => setField("price", e.target.value)} />
          {message && <p className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/70">{message}</p>}
          <button disabled={createMatch.isPending} className="accent-button flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold disabled:opacity-60"><CalendarPlus size={18} /> Publish match</button>
        </form>
      </section>
      <section className="space-y-4">
        {data.matches.map((match) => (
          <article key={match._id} className="glass sport-card rounded-2xl p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <span className="rounded-full bg-sportx-primary/25 px-3 py-1 text-sm text-sportx-secondary">{match.sport}</span>
                <h2 className="mt-3 text-2xl font-black">{match.title}</h2>
                <p className="mt-2 flex items-center gap-2 text-white/58"><MapPin size={16} /> {match.venue?.name || "Venue TBA"}, {match.venue?.city || "City TBA"}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-bold">{new Date(match.startsAt).toLocaleString()}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-white/58 sm:justify-end"><Users size={15} /> {match.players?.length || 0}/{match.maxPlayers}</p>
              </div>
            </div>
            <button onClick={() => joinMatch.mutate(match._id)} disabled={joinMatch.isPending || match.status === "full"} className="mt-5 rounded-xl bg-white px-5 py-3 font-bold text-sportx-bg disabled:opacity-50">
              {match.status === "full" ? "Waitlist full" : "Join match"}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
