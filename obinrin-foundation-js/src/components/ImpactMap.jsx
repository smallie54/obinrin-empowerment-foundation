import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "@vnedyalk0v/react19-simple-maps";
import nigeriaStates from "../assets/nigeria-states.json";
import publicApi from "../lib/public";

export default function ImpactMap() {
  const [active, setActive] = useState(null);
  const [outreach, setOutreach] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    publicApi.get("/impact-locations/public")
      .then((res) => setOutreach(res.data))
      .catch(() => setError(true));
  }, []);

  const activeStateNames = outreach.map((o) => o.stateName);

  return (
    <section className="bg-charcoal py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center text-white mb-4">
          Our Impact Across Nigeria
        </h2>
        <p className="text-white/60 text-center mb-16">
          Hover a marker to see program reach in that state.
        </p>

        {error && (
          <p className="text-center text-xs text-white/40 mb-6">
            Live outreach data is temporarily unavailable.
          </p>
        )}
        {!error && outreach.length === 0 && (
          <p className="text-center text-xs text-white/40 mb-6">
            Outreach locations coming soon — check back for updates.
          </p>
        )}

        <div className="relative w-full aspect-[16/10] rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 2600, center: [8, 9.5] }}
            className="w-full h-full"
          >
            <Geographies geography={nigeriaStates}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.shapeName; // confirm this matches your downloaded file
                  const isActive = activeStateNames.includes(stateName);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isActive ? "rgba(244,180,0,0.25)" : "rgba(255,255,255,0.06)"}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "rgba(244,180,0,0.35)" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {outreach.map((o) => (
              <Marker
                key={o._id}
                coordinates={[o.longitude, o.latitude]}
                onMouseEnter={() => setActive(o.stateName)}
                onMouseLeave={() => setActive(null)}
              >
                <g style={{ cursor: "pointer" }}>
                  <circle r={7} fill="#F4B400" fillOpacity={0.3}>
                    <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r={4} fill="#F4B400" />
                </g>
              </Marker>
            ))}
          </ComposableMap>

          <AnimatePresence>
            {active &&
              outreach
                .filter((o) => o.stateName === active)
                .map((o) => (
                  <motion.div
                    key={o._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="pointer-events-none absolute top-4 right-4 w-52 bg-white rounded-xl p-4 shadow-2xl text-left z-10"
                  >
                    <p className="font-heading font-bold text-charcoal mb-2">{o.stateName}</p>
                    <div className="space-y-1 text-sm text-charcoal/70">
                      <div className="flex justify-between">
                        <span>Girls Supported</span>
                        <span className="font-semibold text-purple">
                          {o.girlsSupported.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Schools</span>
                        <span className="font-semibold text-purple">{o.schools}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volunteer Teams</span>
                        <span className="font-semibold text-purple">{o.volunteerTeams}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}