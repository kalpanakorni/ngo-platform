const Stripe = require('stripe');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Step 1: create a payment intent for the donation amount
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    if (!amount || amount < 1) return res.status(400).json({ message: 'Invalid amount' });
    if (!stripe) return res.status(501).json({ message: 'Stripe is not configured on this server' });

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects the smallest currency unit
      currency,
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    next(err);
  }
};

// Step 2: record the donation once payment succeeds (called by client or Stripe webhook)
exports.recordDonation = async (req, res, next) => {
  try {
    const {
      campaignId, amount, currency, frequency, isAnonymous,
      donorName, donorEmail, paymentIntentId,
    } = req.body;

    const donation = await Donation.create({
      donor: req.user ? req.user._id : undefined,
      donorName: isAnonymous ? 'Anonymous' : donorName,
      donorEmail,
      campaign: campaignId,
      amount,
      currency,
      frequency,
      isAnonymous,
      paymentIntentId,
      status: 'completed',
    });

    if (campaignId) {
      await Campaign.findByIdAndUpdate(campaignId, { $inc: { raisedAmount: amount } });
    }

    res.status(201).json({ donation });
  } catch (err) {
    next(err);
  }
};

exports.listDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate('campaign', 'title')
      .sort('-createdAt')
      .limit(200);
    res.json({ count: donations.length, donations });
  } catch (err) {
    next(err);
  }
};

exports.donationStats = async (req, res, next) => {
  try {
    const [totals] = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' }, totalDonations: { $sum: 1 } } },
    ]);
    res.json({ totals: totals || { totalAmount: 0, totalDonations: 0 } });
  } catch (err) {
    next(err);
  }
};
