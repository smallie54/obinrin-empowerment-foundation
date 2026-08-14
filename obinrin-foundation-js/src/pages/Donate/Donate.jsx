import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ChevronRight,
  Gift,
  Landmark,
  Copy,
  Check,
  Lock,
  Backpack,
  BookOpen,
  Droplet,
  Users,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  Mail,
} from "lucide-react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { webImg } from "../../assets/assets"; // adjust this path to match your project

function getImg(name) {
  return webImg.find((item) => item.name === name)?.Image;
}

const presetAmounts = [5000, 10000, 25000, 50000, 100000];

const impactTiers = [
  { icon: Backpack, amount: "₦5,000", text: "School supplies for one girl", bg: "bg-purple-50" },
  { icon: BookOpen, amount: "₦10,000", text: "Educational materials", bg: "bg-amber-50" },
  { icon: Droplet, amount: "₦25,000", text: "One month of sanitary pads", bg: "bg-purple-50" },
  { icon: Users, amount: "₦50,000", text: "Mentorship & leadership support", bg: "bg-amber-50" },
];

const whyDonate = [
  {
    icon: ShieldCheck,
    title: "100% Transparent",
    text: "We are committed to transparency and accountability.",
  },
  {
    icon: Lock,
    title: "Secure Donations",
    text: "Your donations are safe with industry-standard security.",
  },
  {
    icon: Users,
    title: "Direct Community Impact",
    text: "Every gift goes directly to programs that change lives.",
  },
];

const faqs = [
  {
    q: "Is my donation tax-deductible?",
    a: "Yes, Obinrin Empowerment Foundation is a registered nonprofit, and donations may be tax-deductible depending on your local tax laws. We'll email you a receipt for your records.",
  },
  {
    q: "How will my donation be used?",
    a: "Your donation goes directly toward school supplies, sanitary pads, mentorship programs, and educational resources for girls in the communities we serve.",
  },
  {
    q: "Can I make a recurring donation?",
    a: "Yes — once you select an amount, you'll have the option to make it a monthly recurring gift during checkout.",
  },
  {
    q: "How will I receive updates?",
    a: "Subscribe to our newsletter below, or check your email — donors receive periodic impact reports showing exactly how funds are being used.",
  },
];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const accountNumber = "0125502428";

  function handleCopy() {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePresetClick(amount) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  function handleCustomChange(e) {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  }

  return (
    <div>
      <Nav solid />

      {/* ---- Hero ---- */}
      <section className="grid md:grid-cols-2 items-center pt-24 md:pt-28 px-6 md:px-12 lg:px-24 gap-10 pb-16">
        <div>
          <p className="text-purple-700 text-xs font-semibold tracking-widest mb-3">
            SUPPORT OUR MISSION
          </p>
          <span className="block w-14 h-1 bg-yellow-400 rounded-full mb-4" />
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 leading-tight">
            Your Gift Creates Opportunities That Last{" "}
            <span className="text-purple-700">a Lifetime.</span>
          </h1>
          <p className="text-gray-600 mt-5 max-w-lg">
            Your donation empowers girls with access to education, school
            supplies, mentorship, educational resources, and free sanitary
            pads—helping them learn, grow, and build brighter futures.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#choose-donation"
              className="self-start inline-flex items-center gap-2 bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-sm"
            >
              <Heart size={15} /> Donate Securely
            </a>
            <Link
              to="/about"
              className="self-start inline-flex items-center gap-2 border border-purple-700 text-purple-700 px-6 py-3 rounded-full font-semibold text-sm"
            >
              <ChevronRight size={15} /> Learn More
            </Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <img
            src={getImg("outreachImg1") || getImg("girlsImg1")}
            alt="Girls with donated school and hygiene supplies"
            className="w-full h-72 md:h-96 object-cover"
          />
        </div>
      </section>

 
      <section
        id="choose-donation"
        className="px-6 md:px-12 lg:px-24 pb-16 grid lg:grid-cols-2 gap-6"
      >
  
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Gift size={18} className="text-purple-700" />
            </span>
            <h2 className="font-bold text-lg text-gray-900">Choose Your Donation</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetClick(amount)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition ${
                  selectedAmount === amount
                    ? "bg-purple-700 text-gold border-purple-700"
                    : "border-gray-200 text-gray-700 hover:border-purple-300"
                }`}
              >
                ₦{amount.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={handleCustomChange}
                className="w-full rounded-xl border border-gray-200 pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                NGN
              </span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-purple-700 text-black py-3 rounded-xl font-semibold text-sm">
            Donate Now <ChevronRight size={16} />
          </button>

          <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-4">
            <Lock size={12} /> Secure and encrypted payments
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Landmark size={18} className="text-purple-700" />
            </span>
            <h2 className="font-bold text-lg text-gray-900">Or Donate via Bank Transfer</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Landmark size={16} className="text-purple-700" />
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="font-bold text-gray-900">{accountNumber}</p>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-purple-300"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Users size={16} className="text-purple-700" />
              <div>
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="font-bold text-gray-900">Obinrin Empowerment Foundation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Landmark size={16} className="text-purple-700" />
              <div>
                <p className="text-xs text-gray-500">Bank</p>
                <p className="font-bold text-gray-900">Guaranty Trust Bank</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-500 bg-purple-50 rounded-xl p-4">
            <ShieldAlert size={14} className="mt-0.5 shrink-0 text-purple-700" />
            <p>
              After payment, please send your receipt to{" "}
              <a href="mailto:donations@obinrin.org" className="text-purple-700 font-semibold">
                donations@obinrin.org
              </a>{" "}
              so we can acknowledge your support.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-16">
        <h2 className="font-bold text-xl text-purple-700 mb-6">Your Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {impactTiers.map((tier) => (
            <div key={tier.amount} className={`rounded-2xl p-6 ${tier.bg}`}>
              <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center mb-4">
                <tier.icon size={18} className="text-purple-700" />
              </span>
              <p className="font-bold text-lg text-gray-900">{tier.amount}</p>
              <p className="text-xs text-gray-600 mt-1">{tier.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Why Donate + FAQ ---- */}
      <section className="px-6 md:px-12 lg:px-24 pb-20 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-bold text-xl text-purple-700 mb-6">Why Donate?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {whyDonate.map((item) => (
              <div
                key={item.title}
                className="border border-gray-100 rounded-2xl p-5 text-center"
              >
                <span className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={16} className="text-purple-700" />
                </span>
                <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-xl text-purple-700 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-xs text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Newsletter bar ---- */}
      <section className="bg-purple-50 px-6 md:px-12 lg:px-24 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center shrink-0">
            <Mail size={18} className="text-white" />
          </span>
          <div>
            <h3 className="font-bold text-gray-900">Stay Connected</h3>
            <p className="text-sm text-gray-600">
              Subscribe to our newsletter and get the latest stories and
              impact updates.
            </p>
          </div>
        </div>
        <form className="flex gap-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="rounded-full border border-gray-200 px-4 py-3 text-sm flex-1 md:w-72 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button className="bg-gold-700 text-black border border-black-200 px-6 py-3 rounded-full font-semibold text-sm whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}