import { publisher } from "../config/redis.js";

const regions = [
  'SJC Hồ Chí Minh', 'SJC Hà Nội', 'SJC Đà Nẵng',
  'DOJI Hà Nội', 'DOJI Hồ Chí Minh',
  'PNJ Hà Nội', 'PNJ Hồ Chí Minh',
  'Vàng nữ trang 24K', 'Vàng nữ trang 18K', 'Vàng nữ trang 14K'
];

let currentPrices = {
  'SJC Hồ Chí Minh': 7400000,
  'SJC Hà Nội': 7410000,
  'SJC Đà Nẵng': 7395000,
  'DOJI Hà Nội': 7380000,
  'DOJI Hồ Chí Minh': 7385000,
  'PNJ Hà Nội': 7360000,
  'PNJ Hồ Chí Minh': 7355000,
  'Vàng nữ trang 24K': 7350000,
  'Vàng nữ trang 18K': 5500000,
  'Vàng nữ trang 14K': 4300000
};

function randomizePrice(base) {
  const delta = Math.floor(Math.random() * 20001) - 10000; // ±10k
  return Math.max(3000000, base + delta);
}

export function publishPrices() {
  // Chọn một vùng ngẫu nhiên từ danh sách
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];

  // Tính giá vàng ngẫu nhiên cho vùng được chọn
  const newPrice = randomizePrice(currentPrices[randomRegion]);
  currentPrices[randomRegion] = newPrice;

  const priceData = { name: randomRegion, price: newPrice };

  // Gửi giá vàng ngẫu nhiên tới Redis
  publisher.publish("gold-price", JSON.stringify(priceData));

  console.log("Published simulated gold price for:", randomRegion);
}




