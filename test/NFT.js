const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ether = tokens

describe('NFT', () => {
  const NAME = 'Dapp Punks'
  const SYMBOL = 'DP'
  const COST = ether(10)
  const MAX_SUPPLY = 25
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSSNWG3qHzmNDvXa9gg/'
  let nft,
      deployer,
      minter

  beforeEach(async () => {
      let accounts = await ethers.getSigners()
      deployer = accounts[0]
      minter = accounts[1]
  })


  describe('Minting', () => {
    let transaction, result

    describe('Success', async ()=> {
      const ALLOW_MINTING_ON = 
        Date.now().toString().slice(0,10)
      
      beforeEach(async () => {
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

        transaction = await nft.connect(minter).mint(1, { value : COST})
        result = await transaction.wait()
      })

      it('returns the address of the minter', async ()=> {
        expect(await nft.ownerOf(1)).to.equal(minter.address)
      })

      it('Minter\'s token overall', async ()=> {
        expect(await nft.balanceOf(minter.address)).to.equal(1)
      })

      it('updates total supply', async ()=> {
        expect(await nft.totalSupply()).to.equal(1)
      })

      it('updates ETH payment', async ()=> {
        expect(await ethers.provider.getBalance(nft.address)).to.equal(COST)
      })
      it('emit event - Mint', async ()=> {
        await expect(transaction).to.emit(nft, 'Mint')
          .withArgs(1, minter.address)
      })
    })

    describe('Failure', async ()=> {

      beforeEach(async()=> {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0,10)
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
      })

      it('rejects insufficient payment', async ()=> {
        await expect(nft.connect(minter).mint(1, {value: ether(1)})).to.be.reverted
      })

      it('require 1 NFT minimum.', async ()=> {
        await expect(nft.connect(minter).mint(0, {value: COST})).to.be.reverted
      })

      it('rejects minting before the time', async ()=> {
        const ALLOW_MINTING_ON = new Date('May 26, 2030 18:00:00').getTime().toString().slice(0,10)
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

        await expect(nft.connect(minter).mint(1, {value: COST})).to.be.reverted
      })

      it('No more than max amount', async ()=> {
        await expect(nft.connect(minter).mint(100, {value: COST})).to.be.reverted
      })
    })
  })

  describe('Deployment', () => {
    const ALLOW_MINTING_ON = 
    (Date.now() + 120000).toString().slice(0,10)
    
    beforeEach(async () => {
      const NFT = await ethers.getContractFactory('NFT')
      nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
    })

    it('has correct name', async () => {
      expect(await nft.name()).to.equal(NAME)
    })

    it('has correct symbol', async () => {
      expect(await nft.symbol()).to.equal(SYMBOL)
    })

    it('returns the cost to mint', async () => {
      expect(await nft.cost()).to.equal(COST)
    })

    it('returns max supply', async () => {
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY)
    })

    it('mintingtime', async () => {
      expect(await nft.allowMintingOn()).to.equal(ALLOW_MINTING_ON)
    })

    it('baseURI', async () => {
      expect(await nft.baseURI()).to.equal(BASE_URI)
    })

    it('returns the owner', async () => {
      expect(await nft.owner()).to.equal(deployer.address)
    })
  })

})




















