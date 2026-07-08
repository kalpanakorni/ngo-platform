const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String, required: true },
    skills: [{ type: String }],
    availability: { type: String, enum: ['weekdays', 'weekends', 'flexible'], default: 'flexible' },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
    message: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
