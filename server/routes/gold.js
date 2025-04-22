import express from 'express';
import { getAllGoldPrices, upsertGoldPrice, getGoldPriceById } from '../controllers/goldController.js';

const router = express.Router();

/**
 * GET /gold
 * Input: none
 * Mô tả: Lấy toàn bộ dữ liệu giá vàng từ database
 */
router.get('/', getAllGoldPrices);

/**
 * POST /gold
 * Input: JSON body { name: string, price: number }
 * Mô tả: Tạo mới hoặc cập nhật giá vàng theo tên (upsert)
 */
router.post('/', upsertGoldPrice);

router.get('/:id', getGoldPriceById); 

export default router;
