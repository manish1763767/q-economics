const autocannon = require('autocannon');
const logger = require('../../utils/logger');

const stressConfig = {
  url: process.env.TEST_URL || 'http://localhost:3000',
  connections: 1000,
  duration: 60,
  pipelining: 10,
  timeout: 20,
  workers: 8,
  amount: 100000,
};

const stressScenarios = {
  concurrentUsers: {
    ...stressConfig,
    title: 'Concurrent Users Test',
    description: 'Test system behavior under high concurrent user load',
    phases: [
      { duration: 60, arrivalRate: 5 },
      { duration: 120, arrivalRate: 10 },
      { duration: 180, arrivalRate: 30 },
      { duration: 240, arrivalRate: 50 },
      { duration: 300, arrivalRate: 100 },
    ],
  },
  spikeTest: {
    ...stressConfig,
    title: 'Spike Test',
    description: 'Test system behavior under sudden spikes in traffic',
    phases: [
      { duration: 60, arrivalRate: 5 },
      { duration: 120, arrivalRate: 50 },
      { duration: 180, arrivalRate: 5 },
      { duration: 240, arrivalRate: 100 },
      { duration: 300, arrivalRate: 5 },
    ],
  },
  enduranceTest: {
    ...stressConfig,
    title: 'Endurance Test',
    description: 'Test system behavior under sustained load over time',
    duration: 3600, // 1 hour
    phases: [
      { duration: 600, arrivalRate: 10 },
      { duration: 1800, arrivalRate: 30 },
      { duration: 600, arrivalRate: 50 },
      { duration: 600, arrivalRate: 10 },
    ],
  },
};

async function runStressTest(scenario) {
  const config = stressScenarios[scenario];
  logger.info(`Starting stress test: ${config.title}`, { scenario, config });

  return new Promise((resolve, reject) => {
    const instance = autocannon(config, (err, result) => {
      if (err) {
        logger.error('Stress test failed', { error: err, scenario });
        return reject(err);
      }

      const summary = {
        scenario: config.title,
        timestamp: new Date().toISOString(),
        duration: config.duration,
        latency: {
          min: result.latency.min,
          avg: result.latency.average,
          max: result.latency.max,
          p99: result.latency.p99,
        },
        requests: {
          total: result.requests.total,
          average: result.requests.average,
          failed: result.errors,
        },
        throughput: {
          avg: result.throughput.average,
          max: result.throughput.max,
        },
        errors: result.errors,
        timeouts: result.timeouts,
      };

      logger.info('Stress test completed', summary);
      resolve(summary);
    });

    // Track progress
    autocannon.track(instance, {
      renderProgressBar: true,
      renderLatencyTable: true,
      renderResultsTable: true,
    });

    // Handle process termination
    process.once('SIGINT', () => {
      instance.stop();
    });
  });
}

async function analyzeResults(results) {
  const analysis = {
    timestamp: new Date().toISOString(),
    summary: {},
    recommendations: [],
  };

  // Analyze latency
  const avgLatency = results.reduce((sum, r) => sum + r.latency.avg, 0) / results.length;
  if (avgLatency > 1000) {
    analysis.recommendations.push('High average latency detected. Consider optimizing database queries and implementing caching.');
  }

  // Analyze error rate
  const totalRequests = results.reduce((sum, r) => sum + r.requests.total, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.requests.failed, 0);
  const errorRate = (totalErrors / totalRequests) * 100;

  if (errorRate > 1) {
    analysis.recommendations.push(`High error rate (${errorRate.toFixed(2)}%). Investigate error patterns and implement better error handling.`);
  }

  // Analyze throughput
  const avgThroughput = results.reduce((sum, r) => sum + r.throughput.avg, 0) / results.length;
  analysis.summary = {
    avgLatency,
    errorRate,
    avgThroughput,
    totalRequests,
    totalErrors,
  };

  return analysis;
}

async function runFullStressTest() {
  const results = [];
  
  for (const scenario of Object.keys(stressScenarios)) {
    try {
      logger.info(`Running stress test scenario: ${scenario}`);
      const result = await runStressTest(scenario);
      results.push(result);
    } catch (error) {
      logger.error(`Failed to run stress test scenario: ${scenario}`, { error });
    }
  }

  const analysis = await analyzeResults(results);
  logger.info('Stress test analysis', analysis);

  return {
    results,
    analysis,
  };
}

if (require.main === module) {
  runFullStressTest()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Stress test suite failed', { error });
      process.exit(1);
    });
}

module.exports = {
  runStressTest,
  runFullStressTest,
  stressScenarios,
  analyzeResults,
};
