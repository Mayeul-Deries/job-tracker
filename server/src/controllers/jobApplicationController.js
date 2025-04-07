import jobApplicationModel from '../models/jobApplicationModel.js';

export const getJobApplications = async (req, res) => {
  const { userId } = req;
  try {
    const jobApplications = await jobApplicationModel.find({ userId });
    if (!jobApplications) {
      return res.status(404).json({ message: 'No job applications found' });
    }
    res.status(200).json({ message: 'jobApplications successfully recovered', jobApplications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJobApplication = async (req, res) => {
  const { userId } = req;

  const { title, company, link, date, status, notes, category } = req.body;
  try {
    if (!title || !company || !date || !status || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const jobApplication = await jobApplicationModel.create({ ...req.body, userId });

    res.status(201).json({ message: 'jobApplication successfully created', jobApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplication = async (req, res) => {
  try {
    const jobApplication = await jobApplicationModel.findOne({ _id: req.params.id });
    if (!jobApplication) {
      return res.status(404).json({ message: 'jobApplication not found' });
    }
    res.status(200).json({ message: 'jobApplication successfully recovered', jobApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobApplication = async (req, res) => {
  const { title, company, link, date, status, notes, category } = req.body;
  try {
    if (!title || !company || !date || !status || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const jobApplication = await jobApplicationModel.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );

    if (!jobApplication) {
      return res.status(404).json({ message: 'jobApplication not found' });
    }

    res.status(200).json({ message: 'jobApplication successfully updated', jobApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJobApplication = async (req, res) => {
  try {
    const jobApplication = await jobApplicationModel.findOneAndDelete({ _id: req.params.id });
    if (!jobApplication) {
      return res.status(404).json({ message: 'jobApplication not found' });
    }
    res.status(200).json({ message: 'jobApplication successfully deleted', jobApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
