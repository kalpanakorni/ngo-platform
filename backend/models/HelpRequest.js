const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    category: {
      type: String,
      enum: ['medical', 'education', 'disaster-relief', 'hunger', 'shelter', 'other'],
      required: true,
    },
    urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    location: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['new', 'in-review', 'in-progress', 'resolved'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
