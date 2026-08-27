const { spawn } = require('child_process');
const path = require('path');

const TEST_PORT = 3847;
const serverPath = path.join(__dirname, '..', 'backend', 'server.js');

const server = spawn('node', [serverPath], {
  env: { ...process.env, PORT: String(TEST_PORT) },
  stdio: 'pipe'
});

let started = false;

server.stdout.on('data', (data) => {
  const msg = data.toString();
  process.stdout.write(msg);
  if (msg.includes('Backend running') && !started) {
    started = true;
    runTests();
  }
});

server.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

function runTests() {
  const test = spawn('node', [path.join(__dirname, 'test.js')], {
    env: { ...process.env, TEST_URL: `http://localhost:${TEST_PORT}` },
    stdio: 'inherit'
  });

  test.on('close', (code) => {
    server.kill();
    process.exit(code);
  });
}

setTimeout(() => {
  if (!started) {
    console.error('ERROR: Server did not start within 10 seconds');
    server.kill();
    process.exit(1);
  }
}, 10000);
