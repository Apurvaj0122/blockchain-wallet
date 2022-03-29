const Migrations = artifacts.require("Migrations");
const DaiTokenMock = artifacts.require("DaiTokenMock");
const BusdTokenMock = artifacts.require("BusdTokenMock");


module.exports = async function(deployer) {
  await deployer.deploy(Migrations);

  await deployer.deploy(DaiTokenMock);
  const tokenMock = await DaiTokenMock.deployed()
  // Mint 1,000 Dai Tokens for the deployer
  await tokenMock.mint(
    '0xFC3Eab0AA7bda0e63c970F02c1AB10aEFA2f5Faf',
    '1000000000000000000000'
  )

  await deployer.deploy(BusdTokenMock);
  const tokenMockBusd = await BusdTokenMock.deployed()
  // Mint 1,000 Binance Tokens for the deployer
  await tokenMockBusd.mint(
    '0xFC3Eab0AA7bda0e63c970F02c1AB10aEFA2f5Faf',
    '1000000000000000000000'
  )
};

//Account used here is 1st from ganache, make sure to change it if ganache is restarted.