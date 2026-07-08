const express = require('express');
const {
  listCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = require('../controllers/campaignController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/', listCampaigns);
router.get('/:slug', getCampaign);
router.post('/', protect, restrictTo('admin'), createCampaign);
router.patch('/:id', protect, restrictTo('admin'), updateCampaign);
router.delete('/:id', protect, restrictTo('admin'), deleteCampaign);

module.exports = router;
