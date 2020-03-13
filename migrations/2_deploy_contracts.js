const SkynetAssetMarketplace = artifacts.require("SkynetAssetMarketplace");
const LinkTokenInterface = artifacts.require("LinkTokenInterface");

const linkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
const oracle = "0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721";
const jobId = web3.utils.toHex("d02b14632b6141ec90bb8b2b9b937848");
const paymentAmount = web3.utils.toWei("0.1");

module.exports = async function (deployer) {
    await deployer.deploy(SkynetAssetMarketplace, linkTokenAddress, oracle, jobId, paymentAmount);
    const skynetAssetMarketplace = await SkynetAssetMarketplace.deployed();

    const linkToken = await LinkTokenInterface.at(linkTokenAddress);
    await linkToken.transfer(skynetAssetMarketplace.address, paymentAmount);
};
