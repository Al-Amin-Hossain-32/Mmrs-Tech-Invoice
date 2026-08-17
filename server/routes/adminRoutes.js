const express = require('express');
const router = express.Router();
const { getAllDealers } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/dealers', protect, admin, getAllDealers);

module.exports = router;
