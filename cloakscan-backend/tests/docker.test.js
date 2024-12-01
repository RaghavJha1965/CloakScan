// tests/docker.test.js
const analyzeLink = require('../utils/docker');
const Docker = require('dockerode');
const assert = require('assert');

async function runDockerTests() {
  console.log('Starting Docker tests...\n');
  
  // Test 1: Docker Connection
  try {
    const docker = new Docker({ socketPath: '//./pipe/docker_engine' });
    await docker.ping();
    console.log('✅ Docker connection successful');
  } catch (error) {
    console.error('❌ Docker connection failed:', error.message);
    process.exit(1);
  }

  // Test 2: Image Pull
  try {
    const docker = new Docker({ socketPath: '//./pipe/docker_engine' });
    console.log('Pulling node:16-alpine image...');
    await new Promise((resolve, reject) => {
      docker.pull('node:16-alpine', (err, stream) => {
        if (err) reject(err);
        docker.modem.followProgress(stream, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
    console.log('✅ Image pulled successfully');
  } catch (error) {
    console.error('❌ Image pull failed:', error.message);
    process.exit(1);
  }

  // Test 3: Safe Link Analysis
  try {
    const result = await analyzeLink('https://medium.com/');
    assert.strictEqual(result.status, 'safe');
    console.log('✅ Safe link analysis passed');
  } catch (error) {
    console.error('❌ Safe link analysis failed:', error.message);
  }

  // Test 4: Suspicious Link Analysis
  try {
    const result = await analyzeLink('https://test.tk/page');
    assert.strictEqual(result.status, 'suspicious');
    console.log('✅ Suspicious link analysis passed');
  } catch (error) {
    console.error('❌ Suspicious link analysis failed:', error.message);
  }

  // Test 5: Malicious Link Analysis
  try {
    const result = await analyzeLink('https://example.com/malware.exe');
    assert.strictEqual(result.status, 'malicious');
    console.log('✅ Malicious link analysis passed');
  } catch (error) {
    console.error('❌ Malicious link analysis failed:', error.message);
  }

  // Test 6: Container Cleanup
  try {
    const docker = new Docker({ socketPath: '//./pipe/docker_engine' });
    const containers = await docker.listContainers({ all: true });
    const ourContainers = containers.filter(container => 
      container.Image === 'node:16-alpine'
    );
    
    if (ourContainers.length > 0) {
      console.log(`Found ${ourContainers.length} containers to clean up`);
      for (const container of ourContainers) {
        const cont = docker.getContainer(container.Id);
        if (container.State === 'running') {
          await cont.stop();
        }
        await cont.remove();
      }
    }
    console.log('✅ Container cleanup successful');
  } catch (error) {
    console.error('❌ Container cleanup failed:', error.message);
  }

  console.log('\nTests completed!');
}

// Run the tests
runDockerTests().catch(console.error);