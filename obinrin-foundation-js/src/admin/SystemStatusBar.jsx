import { ShieldCheck, Gauge, CloudCheck, Code2 } from "lucide-react";

export default function SystemStatusBar() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-charcoal/10 px-6 py-4 text-xs text-charcoal/60">
      <div className="flex flex-wrap items-center gap-6">
        <span className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-success" />
          System Status <span className="text-success font-semibold">All Systems Operational</span>
        </span>
        <span className="flex items-center gap-2">
          <Gauge size={15} className="text-success" />
          Transparency Score <span className="text-success font-semibold">Excellent 92%</span>
        </span>
        <span className="flex items-center gap-2">
          <CloudCheck size={15} className="text-charcoal/40" />
          Last Backup <span className="text-charcoal">May 24, 2025 – 03:15 AM</span>
        </span>
        <span className="flex items-center gap-2">
          <Code2 size={15} className="text-charcoal/40" />
          Version <span className="text-charcoal">v2.4.1</span>
        </span>
      </div>
      <p>© 2025 Empower Her Africa. All rights reserved.</p>
    </footer>
  );
}
