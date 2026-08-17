const mongoose = require('mongoose');

// Payment Table Row Items
const paymentItemSchema = new mongoose.Schema({
  paymentDate: {
    type: String, // Matches layout format: 'YYYY/MM/DD HH:mm:ss'
    required: true,
  },
  serviceFee: {
    type: String, // e.g., "Cash", "Repair Fee"
    required: [true, 'Service fee description is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    invoiceType: {
      type: String,
      default: 'Retail Invoice', // Top title
    },
    barcodeNumber: {
      type: String, // e.g., "BDPAY2026080520000"
      required: true,
      trim: true,
    },
    jobsheetOrder: {
      type: String, // e.g., "BDJS2026080520000"
      required: true,
      trim: true,
    },
    jobsheetDate: {
      type: String, // '2026/08/05 19:51:48'
      required: true,
    },
    paymentDate: {
      type: String, // '2026/08/05 19:51:48'
      required: true,
    },

    // Customer Information Section
    customerDetails: {
      name: { type: String, required: [true, 'Customer name is required'], trim: true },
      address: { type: String, default: '', trim: true },
      mobileNo: { type: String, required: [true, 'Customer mobile is required'], trim: true },
      email: { type: String, lowercase: true, trim: true, default: '' },
    },

    // Table Data
    items: [paymentItemSchema],

    // Calculations
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    // Signature Dates
    signatureDate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexing for query speed
invoiceSchema.index({ dealerId: 1, createdAt: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);