const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in query results by default
    },
    role: {
      type: String,
      enum: ['ADMIN', 'STUDENT'],
      default: 'STUDENT',
      required: true,
    },
    rollNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    course: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: String,
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: 'Male',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index on rollNumber for students only
userSchema.index(
  { rollNumber: 1 },
  { unique: true, partialFilterExpression: { rollNumber: { $type: 'string' } } }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return user profile JSON without sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
