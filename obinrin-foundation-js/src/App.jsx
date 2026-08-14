import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import StoriesPage from "./pages/Stories/Stories";
import Gallery from "./pages/Gallery/Gallery";
import Programs from "./pages/Programs/Programs";
import Blog from "./pages/Blog/Blog";
import Impact from "./pages/Impact/Impact";
import Donate from "./pages/Donate/Donate";

import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Admin/Login";
import Settings from "./pages/Admin/Setttings";
import Reports from "./pages/Admin/Reports";
import AdminGallery from "./pages/Admin/Gallery";
import AdminBlog from "./pages/Admin/Blog";
import Donor from "./pages/Admin/Donor";
import Schools from "./pages/Admin/Schools";
import Donations from "./pages/Admin/Donations";
import Stories from "./pages/Admin/Stories";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./admin/auth/ProtectedRoute"
import AdminLayout from "./layouts/AdminLayout"
import Events from "./pages/Admin/Events";
import ThankYouMessages from "./pages/Admin/ThankYouMessages";
import AdminPrograms from "./pages/Admin/Programs";
import OutreachPlanning from "./pages/Admin/OutreachPlanning";
import Partnerships from "./pages/Admin/Partnerships";
import Volunteers from "./pages/Admin/Volunteers";
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/donate" element={<Donate />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="schools" element={<Schools />} />
          <Route path="donors" element={<Donor />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="donations" element={<Donations />} />
          <Route path="stories" element={<Stories />} />
          <Route path="events" element={<Events />} />
          <Route path="messages" element={<ThankYouMessages />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="outreach" element={<OutreachPlanning />} />
          <Route path="partnerships" element={<Partnerships />} />
          <Route path="volunteers" element={<Volunteers />} />
        </Route>
      </Route>
    </Routes>
  );
}