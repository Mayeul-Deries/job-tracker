import categoryModel from '../models/categoryModel.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).json({ message: 'categories successfully recovered', categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await categoryModel.create(req.body);
    res.status(201).json({ message: 'category successfully created', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    res.status(200).json({ message: 'category successfully recovered', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'category successfully updated', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'category successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
