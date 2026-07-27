import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/about";
import StoriesPage from "./pages/stories/stories";
import Gallery from "./pages/gallery/gallery";
import Programs from "./pages/programs/programs";
import Blog from "./pages/blog/blog";
import Impact from "./pages/impact/impact";
import Donate from "./pages/donate/donate";

export default function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
   
  );
}