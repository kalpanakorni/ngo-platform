const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donorName: { type: String },
    donorEmail: { type: String },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'USD' },
    frequency: { type: String, enum: ['one-time', 'monthly'], default: 'one-time' },
    isAnonymous: { type: Boolean, default: false },
    paymentProvider: { type: String, enum: ['stripe', 'razorpay'], default: 'stripe' },
    paymentIntentId: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
