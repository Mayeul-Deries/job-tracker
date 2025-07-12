import mongoose from 'mongoose';
import jobApplicationModel from '../models/jobApplicationModel.js';
import { StatusOffer } from '../utils/enums/statusOffer.js';

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

    res.status(200).json({
      message: 'Job applications successfully recovered',
      jobApplications,
      count,
      translationKey: 'jobApplication.success.jobApplications_recovered',
    });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const createJobApplication = async (req, res) => {
  const { userId } = req;

  const { title, company, link, date, status, notes, category, city, favorite } = req.body;
  try {
    if (!title || !company || !date || !status || !category || !city) {
      return res.status(400).json({
        error: 'Missing required fields',
        translationKey: 'jobApplication.error.createJobApplication.missing_fields',
      });
    }
    const jobApplication = await jobApplicationModel.create({ ...req.body, userId });

    res.status(201).json({
      message: 'Job application successfully created',
      jobApplication,
      translationKey: 'jobApplication.success.jobApplication_created',
    });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const getJobApplication = async (req, res) => {
  const id = req.params.id.toString();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid ID', translationKey: 'jobApplication.error.getJobApplication.invalid_id' });
    }

    const jobApplication = await jobApplicationModel.findOne({ _id: id });
    if (!jobApplication) {
      return res.status(404).json({
        error: 'Job application not found',
        translationKey: 'jobApplication.error.getJobApplication.not_found',
      });
    }
    res.status(200).json({
      message: 'Job application successfully recovered',
      jobApplication,
      translationKey: 'jobApplication.success.jobApplication_recovered',
    });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const updateJobApplication = async (req, res) => {
  const id = req.params.id.toString();

  const { title, company, link, date, status, notes, category, city, favorite } = req.body;
  try {
    if (!title || !company || !date || !status || !category || !city) {
      return res.status(400).json({
        error: 'Missing required fields',
        translationKey: 'jobApplication.error.updateJobApplication.missing_fields',
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid ID', translationKey: 'jobApplication.error.updateJobApplication.invalid_id' });
    }

    const jobApplication = await jobApplicationModel.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });

    if (!jobApplication) {
      return res.status(404).json({
        error: 'Job application not found',
        translationKey: 'jobApplication.error.updateJobApplication.not_found',
      });
    }

    res.status(200).json({
      message: 'Job application successfully updated',
      jobApplication,
      translationKey: 'jobApplication.success.jobApplication_updated',
    });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const patchJobApplication = async (req, res) => {
  const id = req.params.id.toString();

  try {
    const update = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid ID', translationKey: 'jobApplication.error.patchJobApplication.not_found' });
    }

    const jobApplication = await jobApplicationModel.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (!jobApplication) {
      return res.status(404).json({
        error: 'Job application not found',
        translationKey: 'jobApplication.error.patchJobApplication.not_found',
      });
    }

    res.status(200).json({
      message: 'Job application field updated successfully',
      jobApplication,
      translationKey: 'jobApplication.success.jobApplication_patched',
    });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const deleteJobApplication = async (req, res) => {
  const id = req.params.id.toString();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: 'Invalid ID', translationKey: 'jobApplication.error.deleteJobApplication.invalid_id' });
    }

    const jobApplication = await jobApplicationModel.findOneAndDelete({ _id: id });
    if (!jobApplication) {
      return res.status(404).json({
        error: 'Job application not found',
        translationKey: 'jobApplication.error.deleteJobApplication.not_found',
      });
    }
    res.status(200).json({
      message: 'Job application successfully deleted',
      jobApplication,
      translationKey: 'jobApplication.success.jobApplication_deleted',
    });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const deleteJobApplicationBatch = async (req, res) => {
  let ids = req.body.ids;

  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: 'Invalid IDs provided',
        translationKey: 'jobApplication.error.deleteJobApplicationBatch.invalid_ids',
      });
    }

    ids = ids.map(id => String(id));

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
      return res.status(400).json({
        error: 'Invalid IDs provided',
        translationKey: 'jobApplication.error.deleteJobApplicationBatch.invalid_ids',
      });
    }

    const result = await jobApplicationModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'No job applications found',
        translationKey: 'jobApplication.error.deleteJobApplicationBatch.not_found',
      });
    }

    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} job applications`,
      deletedCount: result.deletedCount,
      translationKey: 'jobApplication.success.jobApplication_delete_batch',
    });
  } catch (error) {
    res.status(500).json({ error: error.message, translationKey: 'internal_server_error' });
  }
};

export const getJobApplicationStats = async (req, res) => {
  const { userId } = req;
  try {
    const total = await jobApplicationModel.countDocuments({ userId });

    const inProgress = await jobApplicationModel.countDocuments({
      userId,
      status: { $nin: [StatusOffer.ACCEPTED, StatusOffer.REJECTED] },
    });

    const sent = await jobApplicationModel.countDocuments({ userId, status: StatusOffer.SENT });
    const followed_up = await jobApplicationModel.countDocuments({ userId, status: StatusOffer.FOLLOWED_UP });
    const interviewScheduled = await jobApplicationModel.countDocuments({
      userId,
      status: StatusOffer.INTERVIEW_SCHEDULED,
    });
    const accepted = await jobApplicationModel.countDocuments({ userId, status: StatusOffer.ACCEPTED });
    const rejected = await jobApplicationModel.countDocuments({ userId, status: StatusOffer.REJECTED });

    res.status(200).json({ total, inProgress, sent, followed_up, interviewScheduled, accepted, rejected });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
