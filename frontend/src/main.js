// Replace this URL with your deployed Render backend URL
// when testing the deployed frontend (e.g. "https://your-app.onrender.com")
const API_URL = "http://localhost:3000";

async function checkHealth() {
  const resultDiv = document.getElementById('result');
  resultDiv.style.display = 'block';
  resultDiv.className = 'status';
  resultDiv.textContent = 'Checking...';

  try {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    resultDiv.textContent = `Backend status: ${data.status}`;
    resultDiv.className = 'status success';
  } catch (err) {
    resultDiv.textContent = `Error: ${err.message}`;
    resultDiv.className = 'status error';
  }
}
