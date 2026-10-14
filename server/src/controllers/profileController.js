const HealthProfile = require('../models/HealthProfile');

// @desc Get current user's health profile
// @route GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    let profile = await HealthProfile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = await HealthProfile.create({
        userId: req.user.id,
        age: 30,
        heightCm: 175,
        weightKg: 70,
        bmi: 22.9,
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update current user's health profile
// @route PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // Prevent overriding the user ownership
    delete updateData.userId;
    delete updateData._id;

    // Recalculate BMI if height or weight is updated
    if (updateData.heightCm && updateData.weightKg) {
      const heightInMeters = updateData.heightCm / 100;
      updateData.bmi = parseFloat((updateData.weightKg / (heightInMeters * heightInMeters)).toFixed(1));
    }

    const profile = await HealthProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Health profile successfully updated.',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
