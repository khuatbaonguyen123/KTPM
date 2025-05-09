import GoldPrice from '../../models/GoldPrice.js';

// GET all gold prices
export const getAllGoldPrices = async (req, res) => {
  try {
    const goldPrices = await GoldPrice.findAll();
    res.json(goldPrices);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu giá vàng', error });
  }
};

// POST (upsert) gold price
export const upsertGoldPrice = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Thiếu name hoặc price' });
  }

  try {
    const [record, created] = await GoldPrice.upsert({
      name,
      price
    });

    res.status(created ? 201 : 200).json({
      message: created ? 'Đã tạo mới giá vàng' : 'Đã cập nhật giá vàng',
      data: record
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi upsert giá vàng', error });
  }
};

// GET gold price by ID
export const getGoldPriceById = async (req, res) => {
  const { id } = req.params;

  try {
    const goldPrice = await GoldPrice.findByPk(id);

    if (!goldPrice) {
      return res.status(404).json({ message: 'Không tìm thấy giá vàng với ID đã cho' });
    }

    res.json(goldPrice);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy giá vàng theo ID', error });
  }
};

