import { fetchAWSMetrics } from './apiHandlers.js';
import { fetchGoogleMetrics } from './apiHandlers.js';

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'statusCheck') {
    chrome.storage.sync.get('platform', async ({ platform }) => {
      let metrics;
      try {
        switch (platform) {
          case 'aws':
            metrics = await fetchAWSMetrics();
            break;
          case 'gcloud':
            metrics = await fetchGoogleMetrics();
            break;
          default:
            console.warn('Unknown platform:', platform);
            // Optionally send a message to the popup script indicating an error
            chrome.runtime.sendMessage({ message: 'Unknown platform for metric fetching' });
        }
        console.log('Fetched metrics:', metrics);
        // You can send the fetched metrics to the popup script if needed
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Send a message to the popup script indicating an error fetching metrics
        chrome.runtime.sendMessage({ message: 'Error fetching metrics', error });
      }
    });
  }
});