import { ShieldCheck, BadgeCheck, CloudUpload, Code } from "lucide-react";

export default function StatusFooter() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-charcoal/50 py-4 border-t border-charcoal/10 mt-6">
      <div className="flex flex-wrap items-center gap-6">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-success" />
          System Status: <span className="font-semibold text-charcoal">All Systems Operational</span>
        </span>
        <span className="flex items-center gap-1.5">
          <BadgeCheck size={14} className="text-success" />
          Transparency Score: <span className="font-semibold text-charcoal">Excellent 92%</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CloudUpload size={14} />
          Last Backup: May 24, 2025 – 03:15 AM
        </span>
        <span className="flex items-center gap-1.5">
          <Code size={14} />
          Version: v2.4.1
        </span>
      </div>
      <span>© 2026 Obinrin Empowerment Foundation. All rights reserved.</span>
    </div>
  );
}
