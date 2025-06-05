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

    const count = await jobApplicationModel.countDocuments();

    res.status(200).json({ message: 'Job applications successfully recovered', jobApplications, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createJobApplication = async (req, res) => {
  const { userId } = req;

  const { title, company, link, date, status, notes, category, city } = req.body;
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
  const { title, company, link, date, status, notes, category, city } = req.body;
  try {
    if (!title || !company || !date || !status || !category || !city) {
      return res.status(400).json({ error: 'Missing required fields' });
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

export const deleteJobApplication = async (req, res) => {
  try {
    const jobApplication = await jobApplicationModel.findOneAndDelete({ _id: req.params.id });
    if (!jobApplication) {
      return res.status(404).json({ error: 'Job application not found' });
    }
    res.status(200).json({ message: 'Job application successfully deleted', jobApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
