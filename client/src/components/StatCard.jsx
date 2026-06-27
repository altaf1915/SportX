export default function StatCard({ label, value, note }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      <p className="mt-2 text-sm text-sportx-secondary">{note}</p>
    </div>
  );
}
