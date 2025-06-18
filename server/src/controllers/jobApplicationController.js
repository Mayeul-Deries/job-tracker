import mongoose from 'mongoose';
import jobApplicationModel from '../models/jobApplicationModel.js';

export const getJobApplications = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);

  const { userId } = req;
  try {
    const jobApplications = await jobApplicationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(size * page)
      .limit(size);

    const count = await jobApplicationModel.countDocuments({ userId });

    res.status(200).json({ message: 'Job applications successfully recovered', jobApplications, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createJobApplication = async (req, res) => {
  const { userId } = req;

  const { title, company, link, date, status, notes, category, city, favorite } = req.body;
  try {
    if (!title || !company || !date || !status || !category || !city) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const jobApplication = await jobApplicationModel.create({ ...req.body, userId });

    res.status(201).json({ message: 'Job application successfully created', jobApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobApplication = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const jobApplication = await jobApplicationModel.findOne({ _id: req.params.id });
    if (!jobApplication) {
      return res.status(404).json({ error: 'Job application not found' });
    }
    res.status(200).json({ message: 'Job application successfully recovered', jobApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateJobApplication = async (req, res) => {
  const { title, company, link, date, status, notes, category, city, favorite } = req.body;
  try {
    if (!title || !company || !date || !status || !category || !city) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const jobApplication = await jobApplicationModel.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );

    if (!jobApplication) {
      return res.status(404).json({ error: 'Job application not found' });
    }

    res.status(200).json({ message: 'Job application successfully updated', jobApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const patchJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const jobApplication = await jobApplicationModel.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (!jobApplication) {
      return res.status(404).json({ error: 'Job application not found' });
    }

    res.status(200).json({
      message: 'Job application field updated successfully',
      jobApplication,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJobApplication = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const jobApplication = await jobApplicationModel.findOneAndDelete({ _id: req.params.id });
    if (!jobApplication) {
      return res.status(404).json({ error: 'Job application not found' });
    }
    res.status(200).json({ message: 'Job application successfully deleted', jobApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJobApplicationBatch = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0 || !ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: 'Invalid IDs provided' });
    }

    const result = await jobApplicationModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No job applications found' });
    }

    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} job applications`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
