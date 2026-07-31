import StatCards from "../../admin/components/StatCards";
import ThankYouCenter from "../../admin/components/ThankYouCenter";
import OutreachPlanner from "../../admin/components/OutreachPlanner";
import Partnerships from "../../admin/components/Partnerships";
import RecentDonations from "../../admin/components/RecentDonations";
import VolunteerOverview from "../../admin/components/VolunteerOverview";
import ImpactAnalytics from "../../admin/components/ImpactAnalytics";
import QuickActions from "../../admin/components/QuickActions";
import StatusFooter from "../../admin/components/StatusFooter";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <StatCards />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ThankYouCenter />
        </div>
        <Partnerships />
      </div>

      <OutreachPlanner />

      <div className="grid lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-2">
          <RecentDonations />
        </div>
        <VolunteerOverview />
        <ImpactAnalytics />
      </div>

      <QuickActions />

      <StatusFooter />
    </div>
  );
}
