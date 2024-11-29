import AWS from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, GOOGLE_API_KEY } from './config.js';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

// AWS: Fetch CloudWatch Metrics
export async function fetchAWSMetrics() {
  const cloudwatch = new AWS.CloudWatch();

  try {
    // Fetch CPUUtilization, DiskReadOps, and NetworkIn metrics
    const metrics = await Promise.all([
      cloudwatch.getMetricStatistics({
        Namespace: 'AWS/EC2',
        MetricName: 'CPUUtilization',
        Dimensions: [{ Name: 'InstanceId', Value: 'i-0c8c555026eb606bf' }],
        StartTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Last 1 hour
        EndTime: new Date().toISOString(),
        Period: 300, // 5 minutes
        Statistics: ['Average'],
      }).promise(),
      cloudwatch.getMetricStatistics({
        Namespace: 'AWS/EC2',
        MetricName: 'DiskReadOps',
        Dimensions: [{ Name: 'InstanceId', Value: 'Yi-0c8c555026eb606bf' }],
        StartTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        EndTime: new Date().toISOString(),
        Period: 300,
        Statistics: ['Sum'],
      }).promise(),
      cloudwatch.getMetricStatistics({
        Namespace: 'AWS/EC2',
        MetricName: 'NetworkIn',
        Dimensions: [{ Name: 'InstanceId', Value: 'i-0c8c555026eb606bf' }],
        StartTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        EndTime: new Date().toISOString(),
        Period: 300,
        Statistics: ['Sum'],
      }).promise(),
    ]);

    // Return formatted data
    return {
      CPUUtilization: metrics[0].Datapoints[0]?.Average || 'No Data',
      DiskReadOps: metrics[1].Datapoints[0]?.Sum || 'No Data',
      NetworkIn: metrics[2].Datapoints[0]?.Sum || 'No Data',
    };
  } catch (error) {
    console.error('Error fetching AWS metrics:', error);
    throw error;
  }
}

// Google Cloud: Fetch Metrics
export async function fetchGoogleMetrics() {
  try {
    const response = await fetch(
      `https://monitoring.googleapis.com/v3/projects/knnakegblpkimmadpihghokmocpnemoa/timeSeries?filter=metric.type="compute.googleapis.com/instance/cpu/utilization"&interval.endTime=${new Date().toISOString()}&interval.startTime=${new Date(Date.now() - 60 * 60 * 1000).toISOString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${GOOGLE_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    // Extract the desired metrics
    const metrics = {
      CPUUtilization: data.timeSeries?.[0]?.points?.[0]?.value?.doubleValue || 'No Data',
      DiskReadOps: 'Placeholder: Add DiskReadOps metric fetching here',
      NetworkIn: 'Placeholder: Add NetworkIn metric fetching here',
    };

    return metrics;
  } catch (error) {
    console.error('Error fetching Google Cloud metrics:', error);
    throw error;
  }
}
