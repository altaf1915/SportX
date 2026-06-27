import { useMutation } from "@tanstack/react-query";
import { Check, Crown } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Premium() {
  const { updateStoredUser } = useAuth();
  const upgrade = useMutation({
    mutationFn: async () => (await api.post("/users/me/premium")).data,
    onSuccess: ({ user }) => updateStoredUser(user)
  });

  return (
    <section className="mx-auto max-w-4xl glass rounded-[2rem] p-8">
      <Crown className="text-sportx-accent" size={40} />
      <h1 className="mt-4 text-5xl font-black">SportX Premium</h1>
      <p className="mt-4 text-white/65">Unlimited partner requests, advanced filters, verified badge, priority matchmaking, premium chat features, and AI sports assistant access.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {["Unlimited requests", "Advanced search", "Verified badge", "Priority listing", "Premium chat", "AI tournament generator"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4"><Check className="text-sportx-accent" /> {item}</div>)}
      </div>
      {upgrade.isSuccess && <p className="mt-5 rounded-2xl bg-emerald-500/10 px-4 py-3 text-emerald-100">Premium enabled on your profile.</p>}
      {upgrade.isError && <p className="mt-5 rounded-2xl bg-red-500/10 px-4 py-3 text-red-100">Could not enable premium right now.</p>}
      <button onClick={() => upgrade.mutate()} disabled={upgrade.isPending} className="premium-button mt-8 rounded-2xl px-8 py-4 text-lg font-black disabled:opacity-60">Upgrade for Rs 499/month</button>
    </section>
  );
}
