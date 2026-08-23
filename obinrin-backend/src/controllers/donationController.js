import Stripe from "stripe";
import axios from "axios";
import crypto from "crypto";
import Donation from "../models/Donation.js";
import { createNotification } from "./notificationController.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export async function createStripePaymentIntent(req, res, next) {
  try {
    const { amount, currency = "usd", donorEmail, donorName, dedicatedTo } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency,
      receipt_email: donorEmail,
      metadata: { donorName: donorName || "", dedicatedTo: dedicatedTo || "" },
    });

    await Donation.create({
      donorName,
      donorEmail,
      amount,
      currency: currency.toUpperCase(),
      provider: "stripe",
      providerReference: paymentIntent.id,
      status: "pending",
      dedicatedTo,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
}
export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    const status = event.type === "payment_intent.succeeded" ? "successful" : "failed";
    const donation = await Donation.findOneAndUpdate(
      { providerReference: intent.id },
      { status },
      { new: true }
    );

    if (status === "successful" && donation) {
      await createNotification({
        message: `New donation of ${donation.currency} ${(donation.amount / 100).toLocaleString()} from ${donation.donorName || donation.donorEmail}`,
        type: "donation",
        link: "/admin/donations",
      });
    }
  }

  res.json({ received: true });
}



export async function initializePaystackTransaction(req, res, next) {
  try {
    const { amount, currency = "NGN", donorEmail, donorName, dedicatedTo } = req.body;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: donorEmail,
        amount, 
        currency,
        metadata: { donorName: donorName || "", dedicatedTo: dedicatedTo || "" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { reference, authorization_url } = response.data.data;

    await Donation.create({
      donorName,
      donorEmail,
      amount,
      currency,
      provider: "paystack",
      providerReference: reference,
      status: "pending",
      dedicatedTo,
    });

    res.json({ authorizationUrl: authorization_url, reference });
  } catch (err) {
    next(err);
  }
}

export async function paystackWebhook(req, res) {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const donation = await Donation.findOneAndUpdate(
      { providerReference: event.data.reference },
      { status: "successful" },
      { new: true }
    );

    if (donation) {
      await createNotification({
        message: `New donation of ${donation.currency} ${(donation.amount / 100).toLocaleString()} from ${donation.donorName || donation.donorEmail}`,
        type: "donation",
        link: "/admin/donations",
      });
    }
  } else if (event.event === "charge.failed") {
    await Donation.findOneAndUpdate(
      { providerReference: event.data.reference },
      { status: "failed" }
    );
  }

  res.sendStatus(200);
}


export async function listDonations(req, res, next) {
  try {
    const { status, provider } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (provider) filter.provider = provider;

    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    next(err);
  }
}

export async function createManualDonation(req, res, next) {
  try {
    const { amount, currency, donorName, donorEmail, provider, dedicatedTo } = req.body;

    if (!["bank_transfer", "opay", "cash", "manual"].includes(provider)) {
      return res.status(400).json({ message: "Invalid manual provider type" });
    }

    const donation = await Donation.create({
      amount,
      currency: currency || "NGN",
      donorName,
      donorEmail,
      provider,
      dedicatedTo,
      status: "successful", 
    });

    res.status(201).json(donation);
  } catch (err) {
    next(err);
  }
}

export async function updateDonationFlags(req, res, next) {
  try {
    const { receiptSent, thankYouSent } = req.body;
    const update = {};
    if (typeof receiptSent === "boolean") update.receiptSent = receiptSent;
    if (typeof thankYouSent === "boolean") update.thankYouSent = thankYouSent;

    const donation = await Donation.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (err) {
    next(err);
  }
}


export async function donationAnalytics(req, res, next) {
  try {
    const [totals] = await Donation.aggregate([
      { $match: { status: "successful" } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalDonations: { $sum: 1 },
        },
      },
    ]);

    const byProvider = await Donation.aggregate([
      { $match: { status: "successful" } },
      {
        $group: {
          _id: "$provider",
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const activeDonors = await Donation.distinct("donorEmail", { status: "successful" });

    res.json({
      totals: totals || { totalAmount: 0, totalDonations: 0 },
      byProvider,
      activeDonors: activeDonors.length,
    });
  } catch (err) {
    next(err);
  }
}

