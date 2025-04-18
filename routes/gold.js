import express from 'express';
import { getAllGoldPrices, upsertGoldPrice } from '../controllers/goldController.js';

const router = express.Router();

/**
 * GET /gold-prices
 * Input: none
 * Mô tả: Lấy toàn bộ dữ liệu giá vàng từ database
 */
router.get('/', getAllGoldPrices);

/**
 * POST /gold-prices
 * Input: JSON body { name: string, price: number }
 * Mô tả: Tạo mới hoặc cập nhật giá vàng theo tên (upsert)
 */
router.post('/', upsertGoldPrice);

export default router;
