// // utils/docker-test.js
// const Docker = require('dockerode');
// const docker = new Docker({ socketPath: '//./pipe/docker_engine' });

// async function testDocker() {
//     console.log('\n=== Docker Test Suite ===\n');

//     try {
//         // 1. Test Docker connection
//         console.log('1. Testing Docker connection...');
//         await docker.ping();
//         console.log('✓ Docker is connected\n');

//         // 2. List images
//         console.log('2. Checking images...');
//         const images = await docker.listImages();
//         const analyzerImage = images.find(img =>
//             img.RepoTags && img.RepoTags.includes('link-analyzer:latest')
//         );

//         if (!analyzerImage) {
//             console.log('× link-analyzer image not found');
//             console.log('Building image...');
//             await docker.buildImage({
//                 context: __dirname,
//                 src: ['Dockerfile', 'scripts/analyze.js']
//             }, { t: 'link-analyzer' });
//             console.log('✓ Image built successfully\n');
//         } else {
//             console.log('✓ link-analyzer image exists\n');
//         }

//         // 3. Clean existing containers
//         console.log('3. Cleaning existing containers...');
//         const containers = await docker.listContainers({ all: true });
//         for (const containerInfo of containers) {
//             if (containerInfo.Image.includes('link-analyzer')) {
//                 const container = docker.getContainer(containerInfo.Id);
//                 if (containerInfo.State === 'running') {
//                     await container.stop();
//                 }
//                 await container.remove();
//                 console.log(`   Removed container ${containerInfo.Id.substring(0, 12)}`);
//             }
//         }
//         console.log('✓ Containers cleaned\n');

//         // 4. Test container creation
//         console.log('4. Testing container creation...');
//         const container = await docker.createContainer({
//             Image: 'link-analyzer',
//             Env: ['TEST=true'],
//             Cmd: ['node', '-e', 'console.log(JSON.stringify({test: "success"}))'],
//             AttachStdout: true,
//             AttachStderr: true
//         });
//         console.log('✓ Container created');

//         // 5. Test container start
//         console.log('5. Starting container...');
//         await container.start();
//         console.log('✓ Container started');

//         // 6. Get container output
//         console.log('6. Getting container output...');
//         const stream = await container.logs({
//             follow: true,
//             stdout: true,
//             stderr: true
//         });

//         const output = await new Promise((resolve, reject) => {
//             let data = '';
//             stream.on('data', chunk => data += chunk.toString('utf8'));
//             stream.on('end', () => resolve(data));
//             stream.on('error', reject);
//         });
//         console.log('✓ Got container output:', output.trim());

//         // 7. Cleanup test container
//         console.log('\n7. Cleaning up...');
//         await container.remove({ force: true });
//         console.log('✓ Test container removed');

//         console.log('\n✅ All Docker tests passed!\n');
//         return true;
//     } catch (error) {
//         console.error('\n❌ Test failed:', error.message);
//         return false;
//     }
// }

// // Run if called directly
// if (require.main === module) {
//     testDocker().then(success => {
//         process.exit(success ? 0 : 1);
//     });
// }

// module.exports = testDocker;