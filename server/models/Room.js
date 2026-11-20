const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
      uppercase: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: [true, 'Hostel reference is required'],
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      min: [0, 'Ground floor is 0 or above'],
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple'],
      required: [true, 'Room type is required'],
      default: 'Double',
    },
    capacity: {
      type: Number,
      required: [true, 'Total capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [10, 'Capacity cannot exceed 10'],
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: [0, 'Occupancy cannot be negative'],
    },
    monthlyFee: {
      type: Number,
      required: [true, 'Monthly fee is required'],
      min: [0, 'Monthly fee cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Available', 'Full', 'Maintenance'],
      default: 'Available',
    },
    amenities: {
      type: [String],
      default: ['Bed', 'Study Table', 'Cupboard', 'Fan'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique room numbers within the same hostel
roomSchema.index({ hostel: 1, roomNumber: 1 }, { unique: true });

// Pre-save hook to ensure status matches capacity and occupancy
roomSchema.pre('save', function (next) {
  if (this.status !== 'Maintenance') {
    if (this.currentOccupancy >= this.capacity) {
      this.status = 'Full';
    } else {
      this.status = 'Available';
    }
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);
