// Get elements by ID
const dayInput = document.querySelector('#day');
const getGoldValuesButton = document.querySelector('#get-gold-values-button');
const goldTableBody = document.querySelector('#gold-table-body');

// Set up WebSocket connection
const socket = io("http://localhost:8080");

// Fetch and display gold values based on the day
async function showGoldValues() {
    const day = dayInput.value;

    if (!day) {
        alert('Please enter a day!');
        return;
    }

    try {
        console.log('Fetching for day:', day);

        const response = await fetch(`/gold-values?day=${day}`);

        if (!response.ok) {
            throw new Error('Failed to fetch gold values');
        }

        const data = await response.json();
        goldTableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.updated_at}</td>
                <td>${item.gold_type_name}</td>
                <td>${item.buy_value}</td>
                <td>${item.sell_value}</td>
            `;
            goldTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching gold values', error);
    }
}

// Listen for gold value updates from the server
socket.on("gold_value_updated", (data) => {
    console.log('Gold value updated:', data);
    alert('Gold value has been updated!');
    showGoldValues(); // Refresh the data when updated via WebSocket
});

// Event listeners
getGoldValuesButton.addEventListener('click', () => {
  console.log('Button clicked!'); // Thêm dòng này để test
  showGoldValues();
});
