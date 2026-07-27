import Nav from "../../components/Nav";
import Hero from "../../components/Hero";
import ImpactStats from "../../components/ImpactStats";
import Mission from "../../components/Mission";
import Challenge from "../../components/Challenge";
import VideoStory from "../../components/VideoStory";
import Solutions from "../../components/Solutions";
import ImpactMap from "../../components/ImpactMap";
import Stories from "../../components/Stories";
import Gallery from "../../components/Gallery";
import Sponsors from "../../components/Sponsors";
import GetInvolved from "../../components/GetInvolved";
import DonationWidget from "../../components/DonationWidget";
import News from "../../components/News";
import Newsletter from "../../components/Newsletter";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <div className="font-body">
      <Nav />
      <Hero />
      <ImpactStats />
      <Mission />
      <Challenge />
      <VideoStory />
      <Solutions />
      <ImpactMap />
      <Stories />
      <Gallery />
      <Sponsors />
      <GetInvolved />
      <DonationWidget />
      <News />
      <Newsletter />
      <Footer />
    </div>
  );
}