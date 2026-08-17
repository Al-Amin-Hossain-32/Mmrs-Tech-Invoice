const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all dealers with aggregated invoice stats (count + total subtotal)
// @route   GET /api/admin/dealers
// @access  Private/Admin
const getAllDealers = asyncHandler(async (req, res) => {
  // Single aggregation pipeline (not a per-dealer query loop) — this scales
  // correctly as dealer count grows instead of doing N+1 Invoice queries.
  const dealers = await User.aggregate([
    { $match: { role: 'dealer' } },
    {
      $lookup: {
        from: 'invoices', // MongoDB collection name is the pluralized, lowercased model name
        localField: '_id',
        foreignField: 'dealerId',
        as: 'invoices',
      },
    },
    {
      $addFields: {
        invoiceCount: { $size: '$invoices' },
        totalSubtotal: { $sum: '$invoices.subtotal' },
      },
    },
    {
      $project: {
        password: 0,
        invoices: 0, // drop the joined array itself, we only need the aggregates
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  res.json({
    success: true,
    count: dealers.length,
    data: dealers,
  });
});

module.exports = { getAllDealers };
