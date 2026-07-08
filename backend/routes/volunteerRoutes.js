const express = require('express');
const {
  applyAsVolunteer,
  listVolunteers,
  updateVolunteerStatus,
} = require('../controllers/volunteerController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post('/', applyAsVolunteer);
router.get('/', protect, restrictTo('admin'), listVolunteers);
router.patch('/:id/status', protect, restrictTo('admin'), updateVolunteerStatus);

module.exports = router;
