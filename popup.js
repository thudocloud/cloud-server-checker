import { fetchAWSMetrics, fetchGoogleMetrics } from './apiHandlers.js';

async function fetchAndDisplayAWSMetrics() {
  try {
    const data = await fetchAWSMetrics();
    console.log('AWS Metrics:', data);
    updateStatusDisplay('AWS', data);
  } catch (error) {
    console.error('Failed to fetch AWS metrics:', error);
  }
}

async function fetchAndDisplayGoogleMetrics() {
  try {
    const data = await fetchGoogleMetrics();
    console.log('Google Cloud Metrics:', data);
    updateStatusDisplay('Google Cloud', data);
  } catch (error) {
    console.error('Failed to fetch Google Cloud metrics:', error);
  }
}

function updateStatusDisplay(platform, data) {
  const statusDiv = document.getElementById('status');
  const dataList = document.createElement('ul');

  for (let key in data) {
    const listItem = document.createElement('li');
    listItem.textContent = `${key}: ${data[key]}`;
    dataList.appendChild(listItem);
  }

  statusDiv.innerHTML = `<h2>${platform} Metrics</h2>`;
  statusDiv.appendChild(dataList);
}

document.getElementById('fetch-aws').addEventListener('click', fetchAndDisplayAWSMetrics);
document.getElementById('fetch-gcloud').addEventListener('click', fetchAndDisplayGoogleMetrics);
