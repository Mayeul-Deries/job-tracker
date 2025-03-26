import express from 'express';
import {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.get('/', getCategories);
categoryRouter.post('/', createCategory);
categoryRouter.get('/:id', getCategory);
categoryRouter.put('/:id', updateCategory);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
