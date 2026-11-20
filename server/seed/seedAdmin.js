require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    console.log('🌱 Starting Admin Seed Process...');
    await connectDB();

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass@2025';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
      admin.role = 'ADMIN';
      admin.password = adminPassword; // Triggers pre-save hash
      admin.isActive = true;
      await admin.save();
      console.log('✅ Admin account credentials updated and verified successfully.');
    } else {
      admin = await User.create({
        name: 'Chief Hostel Warden',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        phoneNumber: '+91 9876543210',
        gender: 'Male',
        isActive: true,
      });
      console.log(`🎉 New Admin account created successfully!`);
    }

    console.log('----------------------------------------------------');
    console.log(`🔐 Admin Login Email   : ${adminEmail}`);
    console.log(`🔑 Admin Login Password: ${adminPassword}`);
    console.log('----------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
