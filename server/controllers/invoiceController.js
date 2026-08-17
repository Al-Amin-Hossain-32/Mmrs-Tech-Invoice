const asyncHandler = require('express-async-handler');
const Invoice = require('../models/Invoice');

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = asyncHandler(async (req, res) => {
  const {
    invoiceType,
    barcodeNumber,
    jobsheetOrder,
    jobsheetDate,
    paymentDate,
    customerDetails,
    items,
    subtotal,
    signatureDate,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No invoice items provided');
  }

  const invoice = new Invoice({
    dealerId: req.user._id, // Automatic binding with current logged in dealer
    invoiceType,
    barcodeNumber,
    jobsheetOrder,
    jobsheetDate,
    paymentDate,
    customerDetails,
    items,
    subtotal,
    signatureDate,
  });

  const createdInvoice = await invoice.save();
  res.status(201).json({ success: true, data: createdInvoice });
});

// @desc    Get all invoices for logged-in dealer (with Date Filter support)
// @route   GET /api/invoices
// @access  Private
const getMyInvoices = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let query = { dealerId: req.user._id };

  // Date Filtering option
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const invoices = await Invoice.find(query).sort({ createdAt: -1 }).lean();

  res.json({
    success: true,
    count: invoices.length,
    data: invoices,
  });
});

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  // Data Isolation Check: Check if this invoice belongs to the requesting dealer
  if (invoice.dealerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access this invoice');
  }

  res.json({ success: true, data: invoice });
});

module.exports = { createInvoice, getMyInvoices, getInvoiceById };