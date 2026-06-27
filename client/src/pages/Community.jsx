import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trophy, UsersRound } from "lucide-react";
import { useState } from "react";
import { api, demo, sportsList } from "../api/client";
import { useDemoQuery } from "../hooks/useDemoQuery";

export default function Community() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", sport: "Football", city: "", description: "" });
  const [message, setMessage] = useState("");
  const { data = { communities: demo.communities } } = useDemoQuery(["communities"], async () => (await api.get("/communities")).data, { communities: demo.communities });

  const createCommunity = useMutation({
    mutationFn: async () => (await api.post("/communities", form)).data,
    onSuccess: () => {
      setForm({ name: "", sport: "Football", city: "", description: "" });
      setMessage("Community created.");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
    onError: (err) => setMessage(err.response?.data?.message || "Could not create community.")
  });

  const joinCommunity = useMutation({
    mutationFn: async (id) => (await api.post(`/communities/${id}/join`)).data,
    onSuccess: () => {
      setMessage("You joined the community.");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
    onError: (err) => setMessage(err.response?.data?.message || "Could not join community.")
  });

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-5">
      <section className="glass rounded-[2rem] p-6">
        <h1 className="text-4xl font-black">Communities and tournaments</h1>
        <p className="mt-3 max-w-2xl text-white/60">Create groups, start discussions, organize local events, and generate tournament brackets.</p>
        <form onSubmit={(event) => { event.preventDefault(); createCommunity.mutate(); }} className="mt-6 grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Community name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
          <select className="rounded-2xl border border-white/10 bg-sportx-bg/80 px-4 py-4" value={form.sport} onChange={(e) => setField("sport", e.target.value)}>
            {sportsList.map((sport) => <option key={sport}>{sport}</option>)}
          </select>
          <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="City" value={form.city} onChange={(e) => setField("city", e.target.value)} />
          <button className="accent-button inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 font-bold"><Plus size={18} /> Create</button>
          <textarea className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Description" value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </form>
        {message && <p className="mt-4 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/70">{message}</p>}
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {data.communities.map((community) => (
          <article key={community._id} className="sport-card glass rounded-2xl p-5">
            <span className="rounded-full bg-sportx-secondary/20 px-3 py-1 text-sm">{community.sport}</span>
            <h2 className="mt-4 text-2xl font-black">{community.name}</h2>
            <p className="mt-2 text-white/58">{community.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><UsersRound size={16} /> {community.members?.length || 0} members</span>
              <span className="flex items-center gap-2"><Trophy size={16} /> Events</span>
            </div>
            <button onClick={() => joinCommunity.mutate(community._id)} className="mt-5 w-full rounded-xl bg-white px-5 py-3 font-bold text-sportx-bg">Join community</button>
          </article>
        ))}
      </section>
    </div>
  );
}
