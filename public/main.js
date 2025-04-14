const value = document.querySelector('#value');
const socket = io();

// Extract the key from the URL path
const locationPath = window.location.pathname.split("/");
const key = locationPath[locationPath.length - 1];

// Function to fetch the value associated with the key from the server
async function fetchValue() {
    try {
        const response = await fetch(`/get/${key}`);
        if (response.ok) {
            const data = await response.text();
            value.innerText = data;
        } else {
            console.error('Failed to fetch value');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch value initially and then at regular intervals
fetchValue();

// Listen for real-time updates
socket.on('valueUpdated', (data) => {
    if (data.key === key) {
        valueElement.innerText = data.value;  // Update the displayed value if the key matches
    }
});
