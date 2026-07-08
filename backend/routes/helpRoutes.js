const express = require('express');
const {
  submitHelpRequest,
  listHelpRequests,
  updateHelpRequestStatus,
} = require('../controllers/helpController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitHelpRequest);
router.get('/', protect, restrictTo('admin'), listHelpRequests);
router.patch('/:id/status', protect, restrictTo('admin'), updateHelpRequestStatus);

module.exports = router;
