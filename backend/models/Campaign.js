const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['medical', 'education', 'disaster-relief', 'hunger', 'water', 'shelter', 'other'],
      default: 'other',
    },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    coverImageUrl: { type: String },
    goalAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    location: { type: String },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

campaignSchema.virtual('progressPercent').get(function () {
  if (!this.goalAmount) return 0;
  return Math.min(100, Math.round((this.raisedAmount / this.goalAmount) * 100));
});
campaignSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
