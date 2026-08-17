const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: 'admin@smarttech.com' });

    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@mmrs.com',
        password: 'adminpassword123', // Pre-save hook autometically hash korbe
        role: 'admin',
        companyName: 'Mmrs Tech Limited',
      });
      console.log('Default Admin Created Successfully!');
    } else {
      console.log('Admin already exists.');
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();