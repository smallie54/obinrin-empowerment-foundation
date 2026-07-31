// import {
//   LayoutDashboard,
//   Users,
//   HandCoins,
//   MessageSquareHeart,
//   Send,
//   BookOpen,
//   Handshake,
//   UserPlus,
//   Calendar,
//   Newspaper,
//   Image,
//   BarChart3,
//   Settings,
//   Book
// } from "lucide-react";
// import { webImg } from "../assets/assets";

// const getImg = (name) => webImg.find((img) => img.name === name)?.Image;

// const navItems = [
//   { label: "Dashboard", icon: LayoutDashboard },
//   { label: "Donors", icon: Users },
//   { label: "Donations", icon: HandCoins },
//   { label: "Thank You Messages", icon: MessageSquareHeart },
//   { label: "Outreach Planning", icon: Send },
//   { label: "Programs", icon: BookOpen },
//   { label: "Stories", icon: Book },
//   { label: "Partnerships", icon: Handshake },
//   { label: "Volunteers", icon: UserPlus },
//   { label: "Events", icon: Calendar },
//   { label: "Blog", icon: Newspaper },
//   { label: "Gallery", icon: Image },
//   { label: "Reports & Analytics", icon: BarChart3 },
//   { label: "Settings", icon: Settings },
// ];

// export default function AdminSidebar({ active = "Dashboard" }) {
//   return (
//     <aside className="w-64 shrink-0 bg-[#2A0E61] text-white/90 flex flex-col h-screen sticky top-0">
//       <div className="flex items-center gap-3 px-6 py-6">
//         <img
//           src={getImg("logoimg")}
//           alt="Foundation logo"
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div>
//           <p className="font-heading font-bold text-white leading-tight">
//             Empower Her Africa
//           </p>
//           <p className="text-[10px] text-white/50 tracking-wide">
//             Educate. Empower. Elevate.
//           </p>
//         </div>
//       </div>

//       <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
//         {navItems.map((item) => {
//           const isActive = item.label === active;
//           return (
//             <button
//               key={item.label}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
//                 isActive
//                   ? "bg-white/10 text-white font-semibold"
//                   : "text-white/70 hover:bg-white/5 hover:text-white"
//               }`}
//             >
//               <item.icon size={18} />
//               {item.label}
//             </button>
//           );
//         })}
//       </nav>

//       <div className="m-4 rounded-2xl bg-gradient-to-br from-purple/60 to-purple p-5 relative overflow-hidden">
//         <p className="text-sm text-white/90 leading-snug">
//           You are creating brighter futures with every decision.
//         </p>
//         <button className="mt-4 bg-gold text-charcoal text-sm font-semibold px-4 py-2 rounded-full hover:bg-gold/90 transition-colors">
//           View Impact
//         </button>
//       </div>
//     </aside>
//   );
// }
