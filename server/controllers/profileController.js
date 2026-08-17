const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get current logged-in dealer profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update dealer business profile & password
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (user) {
    user.companyName = req.body.companyName || user.companyName;
    user.dutyParagraph = req.body.dutyParagraph || user.dutyParagraph;
    user.businessRegNo = req.body.businessRegNo || user.businessRegNo;
    user.bankAccount = req.body.bankAccount || user.bankAccount;

    if (req.body.serviceCenter) {
      user.serviceCenter = {
        name: req.body.serviceCenter.name || user.serviceCenter.name,
        address: req.body.serviceCenter.address || user.serviceCenter.address,
        contact: req.body.serviceCenter.contact || user.serviceCenter.contact,
        sealName: req.body.serviceCenter.sealName || user.serviceCenter.sealName,
      };
    }

    // Password Update Logic
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { getProfile, updateProfile };