pragma solidity 0.4.24;


contract SyObjects {

    struct ListingAsset {
        uint256 assetId;
        address assetOwnerAddr;
        string hashOfAssetOnSkynet;
        uint256 sellingPriceBySiacoin;
    }
    
    struct ExampleObject {
        address addr;
        uint amount;
    }
    
}
