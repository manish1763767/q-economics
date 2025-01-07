const autocannon = require('autocannon');
const logger = require('../../utils/logger');

const defaultConfig = {
  url: process.env.TEST_URL || 'http://localhost:3000',
  connections: 100,
  duration: 30,
  pipelining: 1,
  timeout: 10,
};

const scenarios = {
  login: {
    method: 'POST',
    path: '/api/auth/login',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123',
    }),
  },
  getTests: {
    method: 'GET',
    path: '/api/tests',
    headers: {
      'authorization': 'Bearer ${token}',
    },
  },
  submitTest: {
    method: 'POST',
    path: '/api/tests/${testId}/submit',
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer ${token}',
    },
    body: JSON.stringify({
      answers: [
        { questionId: 1, answer: 'A' },
        { questionId: 2, answer: 'B' },
      ],
    }),
  },
};

async function runLoadTest(scenario, config = {}) {
  const testConfig = {
    ...defaultConfig,
    ...config,
    ...scenarios[scenario],
  };

  logger.info(`Starting load test for scenario: ${scenario}`, testConfig);

  return new Promise((resolve, reject) => {
    const instance = autocannon(testConfig, (err, result) => {
      if (err) {
        logger.error('Load test failed', { error: err, scenario });
        return reject(err);
      }

      const summary = {
        scenario,
        timestamp: new Date().toISOString(),
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
      };

      logger.info('Load test completed', summary);
      resolve(summary);
    });

    autocannon.track(instance);
  });
}

async function runFullLoadTest() {
  const results = [];
  
  for (const scenario of Object.keys(scenarios)) {
    try {
      const result = await runLoadTest(scenario);
      results.push(result);
    } catch (error) {
      logger.error(`Failed to run scenario: ${scenario}`, { error });
    }
  }

  return results;
}

if (require.main === module) {
  runFullLoadTest()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Load test suite failed', { error });
      process.exit(1);
    });
}

module.exports = {
  runLoadTest,
  runFullLoadTest,
  scenarios,
};
