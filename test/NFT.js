const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ether = tokens

describe('NFT', () => {
  const NAME = 'Dapp Punks'
  const SYMBOL = 'DP'
  const COST = ether(0.0001)
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

    // describe('Success', async ()=> {
    //   const ALLOW_MINTING_ON = 
    //     Date.now().toString().slice(0,10)
      
    //   beforeEach(async () => {
    //     const NFT = await ethers.getContractFactory('NFT')
    //     nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

    //     transaction = await nft.connect(minter).mint(1, { value : COST})
    //     result = await transaction.wait()
    //   })
      
    //   it('9 more mint', async ()=> {
    //     transaction = await nft.connect(minter)
    //       .mint(9, {value : 9*COST})
    //     result = await transaction.wait()

    //     expect(await nft.balanceOf(minter.address)).to.equal(10)
    //   })
      
    // })

    describe('Update Whitelist', async () => {
      const ALLOW_MINTING_ON = 
        Date.now().toString().slice(0,10)
      it('Should update whitelist', async () => {
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

        //Initially, Minter is now Whitelisted
        expect(await nft.whitelist(minter.address)).to.be.false

        //Update minter's whitelist status to true
        await nft.updateWhitelist(minter.address, true)

        //Check that minter is now whitelisted
        expect(await nft.whitelist(minter.address)).to.be.true

        //Attempt to mint with minter account - should succeed
        transaction = await nft.connect(minter).mint(1, {value: COST})
        result = await transaction.wait()

        expect(await nft.balanceOf(minter.address)).to.eq(1)
        // Update minter's whitelist status to false
        await nft.updateWhitelist(minter.address, false)

        // Check that minter is no longer whitelisted
        expect(await nft.whitelist(minter.address)).to.be.false

        // Attempt to mint with minter account - should fail
        await expect(nft.connect(minter).mint(1, { value: COST })).to.be.reverted
 
      })
    })

    /*
    it('returns the address of the minter', async ()=> {
        expect(await nft.ownerOf(1)).to.equal(minter.address)
      })

      it('Minter\'s token overall', async ()=> {
        expect(await nft.balanceOf(minter.address)).to.equal(1)
      })

      it('IPFS URI ', async ()=> {
        // console.log(await nft.tokenURI(1))
        expect(await nft.tokenURI(1)).to.equal(`${BASE_URI}1.json`)
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
    */
    
    /*describe('Failure', async ()=> {

      beforeEach(async()=> {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0,10)
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
      })
      //hum?
        it('rejects insufficient payment', async ()=> {
          await expect(nft.connect(minter).mint(1, {value: ether(0.00001)})).to.be.reverted
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

        it('Puchase limit exceeded', async ()=> {
          await expect(nft.connect(minter).mint(11, {value: 11*COST})).to.be.reverted
        })

        it('No more than max amount', async ()=> {
          await expect(nft.connect(minter).mint(100, {value: COST})).to.be.reverted
        })
        it('invalid token - No URI', async ()=> {
          nft.connect(minter).mint(1, {value: COST})
          await expect(nft.tokenURI('99')).to.be.reverted
        })
    })*/
  })
/*
  describe('Withdraw', () => {
    let transaction, result, balanceBefore

    describe('Success', async ()=> {
      const ALLOW_MINTING_ON = 
        Date.now().toString().slice(0,10)
      
      beforeEach(async () => {
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

        transaction = await nft.connect(minter).mint(1, { value : COST})
        result = await transaction.wait()

        balanceBefore = await ethers.provider.getBalance(deployer.address)

        transaction = await nft.connect(deployer).withdraw()
        result = await transaction.wait()
      })

      it('deducts contract balance', async ()=> {
        expect(await ethers.provider.getBalance(nft.address)).to.eq(0)
      })
      it('sends fund to the owner', async ()=> {
        expect(await ethers.provider.getBalance(deployer.address)).to.be
        .greaterThan(balanceBefore)
      })
      it('emits a withdraw event', async ()=> {
        expect(transaction).to.emit(nft, 'Withdraw')
          .withArgs(COST, deployer.address)
      })
    })

    describe('Failure', async ()=> {

      beforeEach(async()=> {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0,10)
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
        nft.connect(minter).mint(1, {value: COST})
      })

      it('prevents non-owner from withdrawing', async ()=> {
        await expect(nft.connect(minter).withdraw()).to.be.reverted
      })

      
    })
  })

  describe('Displaying NFTs', () => {
    let transaction, result
    const ALLOW_MINTING_ON = 
      Date.now().toString().slice(0,10)
    
    beforeEach(async () => {
      const NFT = await ethers.getContractFactory('NFT')
      nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)

      transaction = await nft.connect(minter).mint(3, { value : ether(30)})
      result = await transaction.wait()
    })

    it('returns all the NFTs for a given owner', async ()=> {
      let tokenIds =  await nft.walletOfOwner(minter.address)
      // console.log("owner wallet", tokenIds)
      expect(tokenIds.length).to.equal(3)
      expect(tokenIds[0].toString()).to.eq('1')
      expect(tokenIds[1].toString()).to.eq('2')
      expect(tokenIds[2].toString()).to.eq('3')
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
*/
})




















