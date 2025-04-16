import express from 'express';
import {
  createGoldType,
  getAllGoldTypes,
  getGoldTypeByName,
  updateGoldTypeName,
  deleteGoldType
} from '../controllers/goldTypeController.js';

const router = express.Router();

/**
 * POST /gold-types
 * Body: {
 *   name: string
 * }
 */
router.post('/', createGoldType);

/**
 * GET /gold-types/all
 * No parameters — returns all gold types
 */
router.get('/all', getAllGoldTypes);

/**
 * GET /gold-types?name=SJC
 * Query Param: name (required) — the name of the gold type to fetch
 */
router.get('/', getGoldTypeByName);

/**
 * PUT /gold-types/:id
 * Params: id (required) — the ID of the gold type to update
 * Body: {
 *   name: string (new name)
 * }
 */
router.put('/:id', updateGoldTypeName);

/**
 * DELETE /gold-types/:id
 * Params: id (required) — the ID of the gold type to delete
 */
router.delete('/:id', deleteGoldType);

export default router;
