import { useMutation } from "@tanstack/react-query";
import { BadgeCheck, Camera, Save, Star } from "lucide-react";
import { useState } from "react";
import { api, sportsList } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateStoredUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    city: user?.city || "",
    age: user?.age || "",
    gender: user?.gender || "Prefer not to say",
    skillLevel: user?.skillLevel || "Beginner",
    sport: user?.sportsInterests?.[0] || "Football",
    avatarUrl: user?.avatar?.url || ""
  });
  const [message, setMessage] = useState("");

  const saveProfile = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        bio: form.bio,
        city: form.city,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender,
        skillLevel: form.skillLevel,
        sportsInterests: [form.sport],
        avatar: form.avatarUrl ? { url: form.avatarUrl } : undefined
      };
      return (await api.patch("/users/me/profile", payload)).data;
    },
    onSuccess: ({ user: nextUser }) => {
      updateStoredUser(nextUser);
      setMessage("Profile updated.");
    },
    onError: (err) => setMessage(err.response?.data?.message || "Could not update profile.")
  });

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
      <section className="glass rounded-[2rem] p-6 text-center">
        {form.avatarUrl ? (
          <img src={form.avatarUrl} alt={form.name} className="mx-auto h-28 w-28 rounded-[2rem] object-cover" />
        ) : (
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-[2rem] bg-gradient-to-br from-sportx-primary to-sportx-secondary text-4xl font-black">{form.name?.[0] || "S"}</div>
        )}
        <h1 className="mt-4 text-3xl font-black">{form.name || user?.name}</h1>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-sportx-accent/15 px-3 py-1 text-sportx-accent"><BadgeCheck size={16} /> {user?.isVerified ? "Verified player" : "Verification pending"}</p>
        <div className="mt-6 flex justify-center gap-4 text-sm text-white/60"><span><Star className="mx-auto text-sportx-accent" /> {user?.rating?.average || 5} rating</span><span>{user?.trustScore || 80} trust</span><span>{user?.fairPlayScore || 95} fair play</span></div>
      </section>
      <section className="glass rounded-[2rem] p-6">
        <h2 className="text-2xl font-black">Profile details</h2>
        <form onSubmit={(event) => { event.preventDefault(); saveProfile.mutate(); }} className="mt-5 grid gap-3 sm:grid-cols-2">
          <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="City" value={form.city} onChange={(e) => setField("city", e.target.value)} />
          <input className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Age" type="number" min="13" max="90" value={form.age} onChange={(e) => setField("age", e.target.value)} />
          <select className="rounded-2xl border border-white/10 bg-sportx-bg/80 px-4 py-4" value={form.gender} onChange={(e) => setField("gender", e.target.value)}>
            {["Female", "Male", "Non-binary", "Prefer not to say"].map((value) => <option key={value}>{value}</option>)}
          </select>
          <select className="rounded-2xl border border-white/10 bg-sportx-bg/80 px-4 py-4" value={form.skillLevel} onChange={(e) => setField("skillLevel", e.target.value)}>
            {["Beginner", "Intermediate", "Advanced", "Pro"].map((value) => <option key={value}>{value}</option>)}
          </select>
          <select className="rounded-2xl border border-white/10 bg-sportx-bg/80 px-4 py-4" value={form.sport} onChange={(e) => setField("sport", e.target.value)}>
            {sportsList.map((sport) => <option key={sport}>{sport}</option>)}
          </select>
          <input className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Avatar image URL" value={form.avatarUrl} onChange={(e) => setField("avatarUrl", e.target.value)} />
          <textarea className="sm:col-span-2 min-h-28 rounded-2xl border border-white/10 bg-white/8 px-4 py-4 outline-none" placeholder="Bio" value={form.bio} onChange={(e) => setField("bio", e.target.value)} />
          {message && <p className="sm:col-span-2 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/70">{message}</p>}
          <button disabled={saveProfile.isPending} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-bold disabled:opacity-60"><Camera size={18} /> Set photo</button>
          <button disabled={saveProfile.isPending} className="premium-button flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold disabled:opacity-60"><Save size={18} /> Save profile</button>
        </form>
      </section>
    </div>
  );
}
