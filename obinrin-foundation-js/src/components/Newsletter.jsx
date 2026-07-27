import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="bg-purple py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white">
          Stay Connected
        </h2>
        <p className="mt-4 text-white/80">
          Join thousands supporting girls' education across Africa.
        </p>

        {subscribed ? (
          <p className="mt-8 text-gold font-semibold">
            You're subscribed — thank you!
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubscribed(true);
            }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full sm:w-80 rounded-full px-6 py-3.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button className="bg-gold hover:bg-gold/90 text-charcoal font-semibold px-7 py-3.5 rounded-full transition-colors">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
