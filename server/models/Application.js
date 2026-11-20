const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    preferredHostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Preferred hostel is required'],
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple'],
      required: [true, 'Room type is required'],
      default: 'Double',
    },
    preferredFloor: {
      type: Number,
      default: 1,
    },
    personalDetails: {
      emergencyContactName: { type: String, default: '' },
      emergencyContactPhone: { type: String, default: '' },
      bloodGroup: { type: String, default: '' },
      medicalCondition: { type: String, default: '' },
      specialRequests: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Allocated'],
      default: 'Pending',
    },
    adminRemarks: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-friendly application number before save if not present
applicationSchema.pre('save', async function (next) {
  if (!this.applicationNumber) {
    const random = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().getFullYear();
    this.applicationNumber = `APP-${dateStr}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
