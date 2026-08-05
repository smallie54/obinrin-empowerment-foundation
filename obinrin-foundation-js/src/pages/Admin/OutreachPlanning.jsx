import OutreachPlanner from "../../admin/components/OutreachPlanner";

export default function OutreachPlanning() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-charcoal">Outreach Planning</h1>
        <p className="text-sm text-charcoal/50 mt-1">
          Plan, schedule, and track outreach events from idea through completion.
        </p>
      </div>

      <OutreachPlanner />
    </div>
  );
}