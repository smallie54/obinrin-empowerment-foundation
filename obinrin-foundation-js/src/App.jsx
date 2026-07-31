import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/about";
import StoriesPage from "./pages/stories/stories";
import Gallery from "./pages/gallery/gallery";
import Programs from "./pages/programs/programs";
import Blog from "./pages/blog/blog";
import Impact from "./pages/impact/impact";
import Donate from "./pages/donate/donate";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./admin/auth/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import Settings from "./pages/admin/Setttings";
import Reports from "./pages/admin/Reports";
import AdminGallery from "./pages/admin/Gallery";
import AdminBlog from "./pages/admin/Blog";
import Donor from "./pages/admin/Donor";
import PublicLayout from "./layouts/PublicLayout";
import Schools from "./pages/admin/Schools";
import Donations from "./pages/admin/Donations";
import Stories from "./pages/admin/Stories";

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
        </Route>
      </Route>
    </Routes>
  );
}