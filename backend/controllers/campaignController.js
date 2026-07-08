const Campaign = require('../models/Campaign');

exports.listCampaigns = async (req, res, next) => {
  try {
    const { category, location, search } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, 'i');
    if (search) filter.title = new RegExp(search, 'i');

    const campaigns = await Campaign.find(filter).sort('-createdAt');
    res.json({ count: campaigns.length, campaigns });
  } catch (err) {
    next(err);
  }
};

exports.getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({ slug: req.params.slug });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ campaign });
  } catch (err) {
    next(err);
  }
};

exports.createCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ campaign });
  } catch (err) {
    next(err);
  }
};

exports.updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ campaign });
  } catch (err) {
    next(err);
  }
};

exports.deleteCampaign = async (req, res, next) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
