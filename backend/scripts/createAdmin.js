/* eslint-disable no-undef */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'yuan@scribble.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists. Updating...');
      
      existingAdmin.password = 'Yuan12345';
      existingAdmin.name = 'Yuan Melissa Romano';
      existingAdmin.firstname = 'Yuan Melissa';
      existingAdmin.lastname = 'Romano';
      existingAdmin.phone = '+63 946-827-0317';
      existingAdmin.address = 'Sitio Estrella, Urduja Street, San Rafael';
      existingAdmin.city = 'Tarlac City, Tarlac';
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      existingAdmin.profilePicture = null;
      
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully');
    } else {
      const adminUser = new User({
        email: 'yuan@scribble.com',
        password: 'Yuan12345',
        name: 'Yuan Melissa Romano',
        firstname: 'Yuan Melissa',
        lastname: 'Romano',
        phone: '+63 946-827-0317',
        address: 'Sitio Estrella, Urduja Street, San Rafael',
        city: 'Tarlac City, Tarlac',
        role: 'admin',
        isActive: true,
        profilePicture: null
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    console.log('📧 Email: yuan@scribble.com');
    console.log('🔑 Password: Yuan12345');
    console.log('👤 Role: admin');
    console.log('📱 Phone: +63 946-827-0317');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

createAdmin();