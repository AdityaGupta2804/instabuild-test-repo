const http = require('http');
const assert = require('assert');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  try {
    // Test 1: GET /
    const root = await request('/');
    assert.strictEqual(root.status, 200);
    assert.strictEqual(root.body.message, 'InstaBuild test backend is running');
    console.log('PASS: GET / returns correct message');
    passed++;
  } catch (err) {
    console.log('FAIL: GET /', err.message);
    failed++;
  }

  try {
    // Test 2: GET /health
    const health = await request('/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'ok');
    console.log('PASS: GET /health returns ok');
    passed++;
  } catch (err) {
    console.log('FAIL: GET /health', err.message);
    failed++;
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
