// Kết nối Socket.IO với server
const socket = io("http://localhost:4000");

const makeSafeId = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
};

// Hàm để lấy tất cả giá vàng từ server
const fetchGoldPrices = async () => {
  try {
    const response = await fetch('http://localhost:3000/gold');
    const data = await response.json();
    
    // Hiển thị tất cả giá vàng ban đầu
    data.forEach(gold => {
      console.log('Processing gold:', gold);
      displayGoldPrice(gold);
    });    
  } catch (error) {
    console.error('Error fetching gold prices:', error);
  }
};

const displayGoldPrice = (gold) => {
  const safeId = makeSafeId(gold.name);
  let priceElement = document.querySelector(`#price-${safeId}`);

  // Nếu không tìm thấy giá vàng trong UI, tạo mới
  if (!priceElement) {
    priceElement = document.createElement('div');
    priceElement.id = `price-${safeId}`;
    priceElement.classList.add('price-item');
    document.getElementById('priceList').appendChild(priceElement);
  }

   // Highlight phần được cập nhật (nhấp nháy màu vàng)
   priceElement.style.backgroundColor = '#fff176'; // màu vàng nhạt
   priceElement.style.transition = 'background-color 0.8s ease';
 
   setTimeout(() => {
     priceElement.style.backgroundColor = ''; // trở lại màu nền gốc
   }, 1000);

  // Cập nhật giá vàng
  priceElement.innerHTML = `${gold.name}: ${gold.price.toLocaleString()} VND`;
};

// Fetch tất cả giá vàng ban đầu khi load trang
fetchGoldPrices();

// Lắng nghe sự kiện 'gold-price-updated' từ server và cập nhật UI
socket.on('gold-price-changed', (goldData) => {
  console.log('Received gold price changed:', goldData);
  displayGoldPrice(goldData);
});


