import { BadgeCheck, MapPin, Star } from "lucide-react";

export default function PlayerCard({ player }) {
  return (
    <article className="sport-card glass rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sportx-primary to-sportx-secondary text-xl font-black">
          {player.name?.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold">{player.name}</h3>
            {player.isVerified && <BadgeCheck size={18} className="text-sportx-accent" />}
          </div>
          <p className="flex items-center gap-1 text-sm text-white/55"><MapPin size={14} /> {player.city || "Nearby"}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {player.sportsInterests?.map((sport) => <span key={sport} className="rounded-full bg-white/10 px-3 py-1 text-xs">{sport}</span>)}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="rounded-full bg-sportx-accent/15 px-3 py-1 text-sportx-accent">{player.skillLevel}</span>
        <span className="flex items-center gap-1 text-white/75"><Star size={15} className="fill-sportx-accent text-sportx-accent" /> {player.rating?.average || 5}</span>
      </div>
      <button className="mt-5 w-full rounded-xl border border-white/10 bg-white/10 py-3 font-semibold hover:bg-white/15">Invite to play</button>
    </article>
  );
}
