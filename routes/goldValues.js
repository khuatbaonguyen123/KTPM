import express from 'express';
import {
  createGoldValue,
  getAllGoldValues,
  getLatestGoldValueByTypeName,
  getLatestGoldValueForAllTypesByDay,
  updateGoldValue,
  deleteGoldValue
} from '../controllers/goldValueController.js';

const router = express.Router();

/**
 * POST: Create a new gold value
 * Path: /gold-values
 * Accepts JSON body:
 * {
 *   sell_value: number (required),
 *   buy_value: number (required),
 *   day: string (YYYY-MM-DD, required),
 *   gold_type_name: string (required)
 * }
 */
router.post('/', createGoldValue);

/**
 * GET: Get all gold values
 * Path: /gold-values
 * Accepts optional query params:
 *   ?day=YYYY-MM-DD (optional) - Filter by specific day
 *   ?gold_type_name=string (optional) - Filter by specific gold type name
 */
router.get('/', getAllGoldValues);

/**
 * GET: Get the latest gold value for a specific gold type
 * Path: /gold-values/latest
 * Accepts query param:
 *   ?gold_type_name=string (required) - Gold type name to fetch the latest value
 */
router.get('/latest', getLatestGoldValueByTypeName);

/**
 * GET: Get the latest gold values for all gold types by a specific day
 * Path: /gold-values/latest-all
 * Accepts query param:
 *   ?day=YYYY-MM-DD (required) - The specific day to fetch the latest values
 */
router.get('/latest-all', getLatestGoldValueForAllTypesByDay);

/**
 * PATCH: Update a gold value by ID (partial update)
 * Path: /gold-values/:id
 * Accepts URL param:
 *   :id (required) - The ID of the gold value to update
 * Accepts JSON body (optional fields to update):
 * {
 *   sell_value: number (optional),
 *   buy_value: number (optional),
 *   day: string (YYYY-MM-DD, optional),
 *   gold_type_name: string (optional)
 * }
 */
router.patch('/:id', updateGoldValue);

/**
 * DELETE: Delete a gold value by ID
 * Path: /gold-values/:id
 * Accepts URL param:
 *   :id (required) - The ID of the gold value to delete
 */
router.delete('/:id', deleteGoldValue);

export default router;
