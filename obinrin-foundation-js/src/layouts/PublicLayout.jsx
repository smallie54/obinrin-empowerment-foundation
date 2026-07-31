import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <div className="font-body">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}
