import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import publicApi from "../lib/public";
import fallbackIllustration from "../assets/illustrations/video-fallback.jpg"; 

function getEmbedUrl(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url; 
}

export default function VideoStory() {
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    publicApi
      .get("/videos/public/featured")
      .then((res) => setVideo(res.data))
      .catch(() => setVideo(null))
      .finally(() => setLoaded(true));
  }, []);

  const hasVideo = !!video;
  const backgroundImage = video?.thumbnail?.url || fallbackIllustration;

  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
      {hasVideo ? (
        <img
          src={backgroundImage}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-lavender flex items-center justify-center">
          <img src={fallbackIllustration} alt="" className="h-56 w-auto opacity-90" />
        </div>
      )}
      <div className={`absolute inset-0 ${hasVideo ? "bg-charcoal/60" : "bg-charcoal/10"}`} />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <span className={`text-sm font-semibold uppercase tracking-widest ${hasVideo ? "text-white/70" : "text-charcoal/60"}`}>
          Watch Their Story
        </span>
        <h2 className={`font-heading font-bold text-3xl md:text-5xl mt-4 max-w-2xl ${hasVideo ? "text-white" : "text-charcoal"}`}>
          {loaded && !hasVideo
            ? "Stories From The Field Coming Soon"
            : video?.title || "How One School Bag Changed A Future"}
        </h2>

        {hasVideo && (
          <button
            onClick={() => setOpen(true)}
            className="mt-10 w-16 h-16 rounded-full bg-gold flex items-center justify-center text-charcoal text-2xl hover:scale-110 transition-transform"
            aria-label="Play documentary"
          >
            ▶
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && hasVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video bg-charcoal rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {video.sourceType === "url" ? (
                <iframe
                  src={getEmbedUrl(video.videoUrl)}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={video.uploadedVideo?.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}