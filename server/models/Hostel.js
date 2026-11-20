const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hostel name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Hostel name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Hostel type is required (Boys or Girls)'],
      enum: ['Boys', 'Girls', 'Co-ed'],
      default: 'Boys',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    totalFloors: {
      type: Number,
      required: [true, 'Total floors count is required'],
      min: [1, 'Must have at least 1 floor'],
      max: [20, 'Max floors supported is 20'],
      default: 3,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    wardenName: {
      type: String,
      trim: true,
      default: '',
    },
    wardenContact: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hostel', hostelSchema);
