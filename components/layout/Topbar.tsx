import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 p-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <Search className="text-zinc-400" />
        <Bell className="text-zinc-400" />
        <UserCircle2 size={32} />
      </div>
    </header>
  );
}