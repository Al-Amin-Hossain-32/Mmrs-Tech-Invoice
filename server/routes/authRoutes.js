const express = require('express');
const router = express.Router();
const { loginUser, createDealer } = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/login', loginUser);
router.post('/create-dealer', protect, admin, createDealer); // Only Admin access

module.exports = router;