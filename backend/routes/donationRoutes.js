const express = require('express');
const {
  createPaymentIntent,
  recordDonation,
  listDonations,
  donationStats,
} = require('../controllers/donationController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
router.post('/', recordDonation);
router.get('/', protect, restrictTo('admin'), listDonations);
router.get('/stats', protect, restrictTo('admin'), donationStats);

module.exports = router;
