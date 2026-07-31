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

export default function Home() {
  return (
    <div className="font-body">
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
    </div>
  );
}