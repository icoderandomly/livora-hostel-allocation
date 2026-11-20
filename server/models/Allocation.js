const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required'],
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Hostel is required'],
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    allocationDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    vacateDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Active', 'Vacated', 'Transferred'],
      default: 'Active',
      required: true,
    },
    monthlyFee: {
      type: Number,
      required: true,
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vacatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    vacateRemarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
allocationSchema.index({ student: 1, status: 1 });
allocationSchema.index({ room: 1, status: 1 });

module.exports = mongoose.model('Allocation', allocationSchema);
