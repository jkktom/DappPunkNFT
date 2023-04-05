// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const config = require('../src/config.json')
const NFT_ABI = require('../artifacts/contracts/NFT.sol/NFT.json').abi;

async function main() {
  console.log(`Fetching accounts & network...\n`)

  //Connect to network provider
  const provider = new ethers.providers.JsonRpcProvider(config[31337].url)

  const accounts = await ethers.getSigners()
  const owner = accounts[0]
  const minter1 = accounts[1]
  const minter2 = accounts[2]


  //Fetch deployed NFT contract
  const nft = new ethers.Contract(
    config[31337].nft.address, 
    NFT_ABI, 
    provider.getSigner(owner.address)
  );

  //Update whitelist of minter1
  const tx = await nft.connect(owner).updateWhitelist(minter1.address, true);
  await tx.wait().catch((err) => {
    console.error(err);
    process.exit(1);
  });

  console.log(`Whitelisting Completed. ${minter1.addrss}`);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
