const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token (Login for both Admin & Dealers)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and explicitly select password (since select: false in schema)
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Admin creates a new dealer account
// @route   POST /api/auth/create-dealer
// @access  Private/Admin
const createDealer = asyncHandler(async (req, res) => {
  const { name, email, password, companyName, dutyParagraph, businessRegNo, bankAccount, serviceCenter } = req.body;

  // Check if dealer email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Dealer account with this email already exists');
  }

  // Create new dealer profile
  const dealer = await User.create({
    name,
    email,
    password, // Handled & hashed by User pre-save hook
    companyName: companyName || 'Smart-Tech Service Limited',
    dutyParagraph: dutyParagraph || '',
    businessRegNo: businessRegNo || '',
    bankAccount: bankAccount || '',
    serviceCenter: serviceCenter || {
      name: 'Smart Tech Center',
      address: 'Gulshan Tread Building, T.',
      contact: '+880-1893722002',
      sealName: '',
    },
    role: 'dealer',
  });

  if (dealer) {
    res.status(201).json({
      success: true,
      message: 'Dealer account created successfully',
      data: {
        _id: dealer._id,
        name: dealer.name,
        email: dealer.email,
        role: dealer.role,
        companyName: dealer.companyName,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid dealer input data');
  }
});

module.exports = {
  loginUser,
  createDealer,
};