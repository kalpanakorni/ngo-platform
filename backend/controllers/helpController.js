const HelpRequest = require('../models/HelpRequest');

exports.submitHelpRequest = async (req, res, next) => {
  try {
    const request = await HelpRequest.create(req.body);
    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
};

exports.listHelpRequests = async (req, res, next) => {
  try {
    const { status, category, urgency } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;

    const requests = await HelpRequest.find(filter).sort('-createdAt');
    res.json({ count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

exports.updateHelpRequestStatus = async (req, res, next) => {
  try {
    const request = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ request });
  } catch (err) {
    next(err);
  }
};
