import { BarChart3, Flag, Map, ShieldAlert, Users } from "lucide-react";
import { api } from "../api/client";
import StatCard from "../components/StatCard";
import { useDemoQuery } from "../hooks/useDemoQuery";

const fallback = {
  users: 18400,
  activeUsers: 17120,
  matches: 6219,
  revenue: 920000,
  reports: [],
  sports: [{ _id: "Football", count: 1840 }, { _id: "Cricket", count: 1512 }, { _id: "Badminton", count: 740 }],
  locations: [{ _id: "Bengaluru", count: 920 }, { _id: "Mumbai", count: 760 }, { _id: "Delhi", count: 610 }]
};

export default function Admin() {
  const { data = fallback } = useDemoQuery(["admin-analytics"], async () => (await api.get("/admin/analytics")).data, fallback);

  return (
    <div className="space-y-5">
      <section className="glass rounded-[2rem] p-6">
        <p className="text-sportx-secondary">Admin dashboard</p>
        <h1 className="mt-2 text-4xl font-black">Operations, safety, and growth</h1>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active users" value={data.activeUsers?.toLocaleString()} note={`${data.users?.toLocaleString()} total accounts`} />
        <StatCard label="Matches" value={data.matches?.toLocaleString()} note="Open and completed" />
        <StatCard label="Revenue" value={`Rs ${Number(data.revenue || 0).toLocaleString()}`} note="Premium estimate" />
        <StatCard label="Reports" value={data.reports?.length || 0} note="Needs review" />
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <BarChart3 className="text-sportx-secondary" />
          <h2 className="mt-4 text-xl font-black">Sport demand</h2>
          <div className="mt-4 space-y-3">
            {data.sports?.map((sport) => <p key={sport._id || "unknown"} className="flex justify-between rounded-xl bg-white/8 px-4 py-3"><span>{sport._id || "Unspecified"}</span><strong>{sport.count}</strong></p>)}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <Flag className="text-sportx-secondary" />
          <h2 className="mt-4 text-xl font-black">Popular locations</h2>
          <div className="mt-4 space-y-3">
            {data.locations?.map((city) => <p key={city._id || "unknown"} className="flex justify-between rounded-xl bg-white/8 px-4 py-3"><span>{city._id || "Unspecified"}</span><strong>{city.count}</strong></p>)}
          </div>
        </div>
        {[["User management", Users], ["Reports", ShieldAlert], ["Ground management", Map]].map(([title, Icon]) => (
          <div key={title} className="glass rounded-2xl p-5">
            <Icon className="text-sportx-secondary" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-sm text-white/58">Protected by role-based admin APIs.</p>
          </div>
        ))}
      </section>
    </div>
  );
}
