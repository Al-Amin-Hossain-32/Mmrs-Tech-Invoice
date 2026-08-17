const express = require('express');
const router = express.Router();
const { createInvoice, getMyInvoices, getInvoiceById } = require('../controllers/invoiceController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createInvoice)
  .get(protect, getMyInvoices);

router.get('/:id', protect, getInvoiceById);

module.exports = router;