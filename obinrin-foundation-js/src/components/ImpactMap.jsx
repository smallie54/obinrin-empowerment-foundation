import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "@vnedyalk0v/react19-simple-maps";
import worldData from "world-atlas/countries-110m.json";

// ISO 3166-1 numeric codes for African countries — used to filter the
// world map down to just Africa, since world-atlas ships the whole globe.
const AFRICA_NUMERIC_CODES = new Set([
  "012","024","072","108","120","132","140","148","174","178","180","204",
  "226","231","232","260","262","266","270","288","324","384","404","426",
  "430","434","450","454","466","478","480","504","508","516","562","566",
  "578","624","638","646","654","686","690","694","706","710","716","728",
  "729","732","740","748","788","800","818","834","854","894",
]);

const countries = [
  {
    name: "Nigeria",
    coordinates: [8.6753, 9.082],
    girls: "24,563",
    schools: "52",
    teams: "18",
  },
  {
    name: "Kenya",
    coordinates: [37.9062, -0.0236],
    girls: "18,204",
    schools: "37",
    teams: "12",
  },
  {
    name: "Ghana",
    coordinates: [-1.0232, 7.9465],
    girls: "12,890",
    schools: "29",
    teams: "9",
  },
];

const activeCountryNames = countries.map((c) => c.name);

export default function ImpactMap() {
  const [active, setActive] = useState(null);

  return (
    <section className="bg-charcoal py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center text-white mb-4">
          Our Impact Across Africa
        </h2>
        <p className="text-white/60 text-center mb-16">
          Hover a marker to see program reach in that country.
        </p>

        <div className="relative w-full aspect-[16/10] rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 380, center: [17, 3] }}
            className="w-full h-full"
          >
            <Geographies geography={worldData}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => AFRICA_NUMERIC_CODES.has(geo.id))
                  .map((geo) => {
                    const isActive = activeCountryNames.includes(geo.properties.name);
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

            {countries.map((c) => (
              <Marker
                key={c.name}
                coordinates={c.coordinates}
                onMouseEnter={() => setActive(c.name)}
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
              countries
                .filter((c) => c.name === active)
                .map((c) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="pointer-events-none absolute top-4 right-4 w-52 bg-white rounded-xl p-4 shadow-2xl text-left z-10"
                  >
                    <p className="font-heading font-bold text-charcoal mb-2">{c.name}</p>
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