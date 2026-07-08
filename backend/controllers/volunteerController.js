const Volunteer = require('../models/Volunteer');

exports.applyAsVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({ volunteer });
  } catch (err) {
    next(err);
  }
};

exports.listVolunteers = async (req, res, next) => {
  try {
    const { status, skill, location } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (skill) filter.skills = skill;
    if (location) filter.location = new RegExp(location, 'i');

    const volunteers = await Volunteer.find(filter).sort('-createdAt');
    res.json({ count: volunteers.length, volunteers });
  } catch (err) {
    next(err);
  }
};

exports.updateVolunteerStatus = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json({ volunteer });
  } catch (err) {
    next(err);
  }
};
