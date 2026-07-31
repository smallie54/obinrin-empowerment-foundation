import AdminSidebar from "../../admin/AdminSidebar";
import AdminTopbar from "../../admin/AdminTopbar";
import StatCards from "../../admin/StatCards";
import ThankYouCenter from "../../admin/ThankYouCenter";
import UpcomingActivities from "../../admin/UpcomingActivities";
import OutreachPlanner from "../../admin/OutreachPlanner";
import Partnerships from "../../admin/Partnerships";
import RecentDonations from "../../admin/RecentDonations";
import VolunteerOverview from "../../admin/VolunteerOverview";
import ImpactAnalytics from "../../admin/ImpactAnalytics";
import QuickActions from "../../admin/QuickActions";
import SystemStatusBar from "../../admin/SystemStatusBar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-lavender/20">
      <AdminSidebar active="Dashboard" />

      <div className="flex-1 min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6">
          <StatCards />

          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ThankYouCenter />
            </div>
            <UpcomingActivities />
          </div>

          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <OutreachPlanner />
            </div>
            <Partnerships />
          </div>

          <div className="grid xl:grid-cols-4 gap-6 items-start">
            <div className="xl:col-span-2">
              <RecentDonations />
            </div>
            <VolunteerOverview />
            <ImpactAnalytics />
          </div>

          <div className="grid xl:grid-cols-4 gap-6">
            <QuickActions />
          </div>

          <SystemStatusBar />
        </main>
      </div>
    </div>
  );
}
