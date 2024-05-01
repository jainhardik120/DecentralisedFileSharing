const hre = require("hardhat");

async function main() {
  const drive = await hre.ethers.deployContract("Drive");
  console.log("Contract Address : ", await drive.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
