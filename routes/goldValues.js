import express from 'express';
import { 
  upsertGoldValue, 
  getGoldValuesByDay, 
  getAllGoldValues, 
  getGoldValueById, 
  deleteGoldValue 
} from '../controllers/goldValueController.js';

const router = express.Router();

// Upsert a gold value
router.post('/', upsertGoldValue);

// Get gold values by day
router.get('/', getGoldValuesByDay);

// Get all gold values
router.get('/all', getAllGoldValues);

// Get a specific gold value by ID
router.get('/:id', getGoldValueById);

// Delete a gold value by ID
router.delete('/:id', deleteGoldValue);

export default router;
