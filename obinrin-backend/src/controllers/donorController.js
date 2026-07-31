import Donor from "../models/Donor.js";

export async function listDonors(req, res, next) {
  try {
    const { tag } = req.query;
    const filter = tag ? { tags: tag } : {};
    const donors = await Donor.find(filter).sort({ totalDonated: -1 });
    res.json(donors);
  } catch (err) {
    next(err);
  }
}

export async function getDonor(req, res, next) {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (err) {
    next(err);
  }
}

// Manual creation for donors who haven't donated online yet (e.g. cash/check)
export async function createDonor(req, res, next) {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json(donor);
  } catch (err) {
    next(err);
  }
}

export async function updateDonor(req, res, next) {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (err) {
    next(err);
  }
}

export async function deleteDonor(req, res, next) {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json({ message: "Donor deleted" });
  } catch (err) {
    next(err);
  }
}

// Called from the Stripe/Paystack webhooks whenever a donation settles as
// successful — upserts a Donor record by email and keeps running totals.
// Not exposed as a route; imported directly by donationController.
export async function syncDonorFromDonation(donation) {
  const donor = await Donor.findOneAndUpdate(
    { email: donation.donorEmail },
    {
      $setOnInsert: { name: donation.donorName || donation.donorEmail },
      $inc: { totalDonated: donation.amount, donationCount: 1 },
      $set: { lastDonationAt: new Date() },
    },
    { upsert: true, new: true }
  );

  const currencyEntry = donor.totalsByCurrency.find(
    (t) => t.currency === donation.currency
  );
  if (currencyEntry) {
    currencyEntry.amount += donation.amount;
  } else {
    donor.totalsByCurrency.push({
      currency: donation.currency,
      amount: donation.amount,
    });
  }
  await donor.save();

  return donor;
}
