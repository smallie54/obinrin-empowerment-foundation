import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "@vnedyalk0v/react19-simple-maps";
import nigeriaStates from "../assets/nigeria-states.json"; // adjust path to match your project

const cities = [
  {
    state: "Lagos",
    coordinates: [3.3792, 6.5244],
    girls: "24,563",
    schools: "52",
    teams: "18",
  },
  {
    state: "Kano",
    coordinates: [8.5167, 12.0],
    girls: "15,204",
    schools: "34",
    teams: "11",
  },
  {
    state: "Rivers",
    coordinates: [7.0134, 4.8156],
    girls: "12,890",
    schools: "29",
    teams: "9",
  },
  {
    state: "Oyo",
    coordinates: [3.9470, 8.1574],
    girls: "9,340",
    schools: "21",
    teams: "7",
  },
];

const activeStateNames = cities.map((c) => c.state);

export default function ImpactMap() {
  const [active, setActive] = useState(null);

  return (
    <section className="bg-charcoal py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center text-white mb-4">
          Our Impact Across Nigeria
        </h2>
        <p className="text-white/60 text-center mb-16">
          Hover a marker to see program reach in that state.
        </p>

        <div className="relative w-full aspect-[16/10] rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 2600, center: [8, 9.5] }}
            className="w-full h-full"
          >
            <Geographies geography={nigeriaStates}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // geoBoundaries files typically name this property
                  // "shapeName" — check your downloaded file if this
                  // doesn't highlight correctly, and adjust the key below.
                  const stateName = geo.properties.shapeName;
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

            {cities.map((c) => (
              <Marker
                key={c.state}
                coordinates={c.coordinates}
                onMouseEnter={() => setActive(c.state)}
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
              cities
                .filter((c) => c.state === active)
                .map((c) => (
                  <motion.div
                    key={c.state}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="pointer-events-none absolute top-4 right-4 w-52 bg-white rounded-xl p-4 shadow-2xl text-left z-10"
                  >
                    <p className="font-heading font-bold text-charcoal mb-2">{c.state}</p>
                    <div className="space-y-1 text-sm text-charcoal/70">
                      <div className="flex justify-between">
                        <span>Girls Supported</span>
                        <span className="font-semibold text-purple">{c.girls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Schools</span>
                        <span className="font-semibold text-purple">{c.schools}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volunteer Teams</span>
                        <span className="font-semibold text-purple">{c.teams}</span>
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