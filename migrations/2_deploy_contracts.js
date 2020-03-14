const SkynetAssetMarketplace = artifacts.require("SkynetAssetMarketplace");
const LinkTokenInterface = artifacts.require("LinkTokenInterface");

//@dev - CoinMarketCap Chainlink (Testnet of Ropsten) 
const linkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";   // Chainlink's LINK Token address on Ropsten 
const oracle = "0xc99B3D447826532722E41bc36e644ba3479E4365";             // Chainlink's Oracle address on Ropsten
const jobId = web3.utils.toHex("e6d74030e4a440898965157bc5a08abc");      // Chainlink's JobID on Ropsten

//@dev - Argument value you want to get from CoinMarketCap Chainlink (Testnet of Ropsten) 
//const coin = "ETH"
//const market = "USD" 

//@dev - Payment amount every request
const paymentAmount = web3.utils.toWei("0.1");

module.exports = async function (deployer) {
    await deployer.deploy(
      SkynetAssetMarketplace, 
      linkTokenAddress, 
      oracle, 
      jobId, 
      //coin, 
      //market, 
      paymentAmount
    );
    
    const skynetAssetMarketplace = await SkynetAssetMarketplace.deployed();

    const linkToken = await LinkTokenInterface.at(linkTokenAddress);
    await linkToken.transfer(skynetAssetMarketplace.address, paymentAmount);
};
