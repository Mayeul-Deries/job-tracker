import jobApplicationModel from '../models/jobApplicationModel';

export const getJobApplications = async (req, res) => {
  try {
    const jobApplications = await jobApplicationModel.find({});
    res.status(200).json({ message: 'jobApplications successfully recovered', jobApplications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJobApplication = async (req, res) => {
  const { title, company, link, date, status, notes, categoryId } = req.body;
  try {
    if (!title || !company || !date || !status || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const jobApplication = await jobApplicationModel.create(req.body);
    res.status(201).json({ message: 'jobApplication successfully created', jobApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplication = async (req, res) => {
  try {
    const jobApplication = await jobApplicationModel.findById(req.params.id);
    res.status(200).json({ message: 'jobApplication successfully recovered', jobApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobApplication = async (req, res) => {
  try {
    const jobApplication = await jobApplicationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'jobApplication successfully updated', jobApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJobApplication = async (req, res) => {
  try {
    await jobApplicationModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'jobApplication successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
