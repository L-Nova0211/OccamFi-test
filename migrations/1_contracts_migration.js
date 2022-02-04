const { MerkleTree } = require('merkletreejs')
const keccak256 = require("keccak256");
const fs = require("fs");
const BN = require('bn.js');
const { profile } = require('console');
const { random } = require('lodash');
const { soliditySha3 } = require("web3-utils");

const Test = artifacts.require("Test");
const TestTokenWithNameAndSymbolFlat = artifacts.require("TestTokenWithNameAndSymbolFlat");
const SimpleRewardDistributorFlat = artifacts.require("SimpleRewardDistributorFlat");

const totalSupply   = "100000000000000000000000000";
const rewardSupply  = "10000000000000000000000000"; // 10 % of total supply
let { distribution } = JSON.parse(fs.readFileSync("../contracts/rewardDistribution2.json"));

module.exports = async function(deployer, networks, accounts) {
  const [Owner] = accounts;
  if (networks === "test" || networks === "development") {
    await deployer.deploy(Test);
    const TestInstance = await Test.deployed();
    
    // const userlist = distribution.map(user => `${user.index}${user.address.toLowerCase()}${(new BN(user.amount.hex.slice(2), 16)).toString(10)}`);
    const userlist = []
    for (let i = 0; i < distribution.length; i ++) {
      let res = await TestInstance.test(
        distribution[i].index, 
        distribution[i].address.toLowerCase(), 
        (new BN(distribution[i].amount.hex.slice(2), 16)).toString(10)
      )
      userlist.push(res)
    }
    // calculate merkle root
    const leafNodes = userlist.map(user => keccak256(user))
    console.log(leafNodes)
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const merkleRoot = merkleTree.getRoot()
    console.log("Merkle Root is: ", merkleRoot);

    // deploy
    await deployer.deploy(TestTokenWithNameAndSymbolFlat, totalSupply, "TestDistribution", "TSD", {
      from: Owner
    });
    const tokenInstance = await TestTokenWithNameAndSymbolFlat.deployed();
    console.log("Token Adress: ", tokenInstance.address)
    await deployer.deploy(SimpleRewardDistributorFlat, tokenInstance.address, merkleRoot, {
      from: Owner
    });
    const distributorInstance = await SimpleRewardDistributorFlat.deployed();
    console.log("Distributor Adress: ", distributorInstance.address) 

    // Transfer token to distrubutor contract to deposite balance
    await tokenInstance.transfer(distributorInstance.address, rewardSupply, {
      from: Owner
    });

    // confirming
    console.log("Balance of distributor in token: ", (await tokenInstance.balanceOf(distributorInstance.address)).toString());
    // Try to claim by random user of userList
    const randomIndex = Math.ceil(Math.random() * userlist.length);
    let resRandom = await TestInstance.test(
      distribution[randomIndex].index, 
      distribution[randomIndex].address.toLowerCase(), 
      (new BN(distribution[randomIndex].amount.hex.slice(2), 16)).toString(10)
    )
    const leaf = keccak256(resRandom)
    console.log(leaf)
    
    const proof = merkleTree.getProof(leaf).map(tree => tree.data)
    console.log("Proof of random user is: ", proof);
    console.log(merkleTree.verify(proof, leaf, merkleRoot))
    try {
      let res = await distributorInstance.claim(distribution[randomIndex].index, distribution[randomIndex].address.toLowerCase(), (new BN(distribution[randomIndex].amount.hex.slice(2), 16)).toString(10), proof, {
        from: Owner
      })
      console.log("Result of tx 'claim'", res)
    } catch (e) {
      console.log(e)
    }
    console.log("randomuser's balance", (await tokenInstance.balanceOf(distribution[randomIndex].address)).toString())
  } else if (networks === "rinkeby") {
    console.log("Not yet, as i tried to use the same code of ganache, the await function is not working correctly so i think should change these to then catch function ...")
    // const userlist = distribution.map(user => user.address);

    // // calculate merkle root
    // const leafNodes = userlist.map(addr => keccak256(addr.toLowerCase()))
    // const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    // const merkleRoot = merkleTree.getRoot()

    // // deploy
    // await deployer.deploy(TestTokenWithNameAndSymbolFlat, "100000000000000000000000000", "TestDistribution", "TSD");
    // const tokenInstance = await TestTokenWithNameAndSymbolFlat.deployed();
    // console.log("Token Adress: ", tokenInstance.address)
    // await deployer.deploy(SimpleRewardDistributorFlat, tokenInstance.address, merkleRoot);
    // const distributorInstance = await SimpleRewardDistributorFlat.deployed();
    // console.log("Distributor Adress: ", distributorInstance.address) 

    // confirming
  } else {
    console.log("Not supported network");
  }
};
