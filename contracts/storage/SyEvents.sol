pragma solidity 0.4.24;


contract SyEvents {

    event CreateListingAsset(
        uint256 indexed assetId,
        address assetOwnerAddr,
        string hashOfAssetOnSkynet,
        uint256 sellingPriceBySiacoin
    );

    event Example(
        uint256 indexed Id, 
        uint256 exchangeRateCurrent
    );

}
