// const Docker = require("dockerode");
// const assert = require("assert");

// const docker = new Docker({ socketPath: "//./pipe/docker_engine" });

// async function testDockerSetup() {
//   console.log("\n=== Docker Test Suite ===\n");

//   try {
//     // 1. Test Docker Connection
//     console.log("1. Testing Docker connection...");
//     await docker.ping();
//     console.log("✓ Docker is connected\n");

//     // 2. List Images
//     console.log("2. Checking images...");
//     const images = await docker.listImages();
//     const analyzerImage = images.find(
//       (img) => img.RepoTags && img.RepoTags.includes("link-analyzer:latest")
//     );

//     if (!analyzerImage) {
//       console.log("× 'link-analyzer' image not found.");
//       console.log("Please build the image using:");
//       console.log("docker build -t link-analyzer .");
//       return;
//     }
//     console.log("✓ 'link-analyzer' image exists\n");

//     // 3. Clean Existing Containers
//     console.log("3. Cleaning up existing containers...");
//     const containers = await docker.listContainers({ all: true });
//     for (const containerInfo of containers) {
//       if (containerInfo.Image === "link-analyzer") {
//         const container = docker.getContainer(containerInfo.Id);
//         if (containerInfo.State === "running") {
//           await container.stop();
//         }
//         await container.remove();
//         console.log(`   Removed container: ${containerInfo.Id.substring(0, 12)}`);
//       }
//     }
//     console.log("✓ Containers cleaned up\n");

//     // 4. Test Container Creation
//     console.log("4. Testing container creation...");
//     const container = await docker.createContainer({
//       Image: "link-analyzer",
//       Env: ["TEST=true", "TARGET_URL=https://example.com"],
//       Cmd: ["node", "scripts/analyze.js"],
//       AttachStdout: true,
//       AttachStderr: true,
//     });
//     console.log("✓ Container created");

//     // 5. Test Container Start
//     console.log("5. Starting container...");
//     await container.start();
//     console.log("✓ Container started");

//     // 6. Get Container Logs
//     console.log("6. Fetching container logs...");
//     const logs = await container.logs({
//       follow: false,
//       stdout: true,
//       stderr: true,
//     });
//     console.log("✓ Logs retrieved:");
//     console.log(logs.toString("utf8").trim());

//     // 7. Cleanup Test Container
//     console.log("\n7. Cleaning up...");
//     await container.remove({ force: true });
//     console.log("✓ Test container removed\n");

//     console.log("\n✅ All Docker tests passed successfully!\n");
//   } catch (error) {
//     console.error("\n❌ Test failed:", error.message);
//   }
// }

// // If the script is executed directly, run the tests
// if (require.main === module) {
//   testDockerSetup().catch((error) => {
//     console.error("Unexpected error during Docker testing:", error.message);
//     process.exit(1);
//   });
// }

// module.exports = testDockerSetup;
