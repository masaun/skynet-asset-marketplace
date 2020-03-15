# Skynet Asset Marketplace
## Introduction
- Skynet Asset Marketplace is a marketplace that users can buy/sell uploaded files on skynet by using Siacoin (SC).
- If users who want to sell their assets use this marketplace, they can list their assets which are uploaded on skynet can start sell them instantly.
- Users who want to sell their assets on this marketplace put a price by Siacoin (SC) on their selling assets.
  - Token price of Siacoin (SC) is got via CoinMarketCap by using chainlink's oracle. 
    https://coinmarketcap.com/currencies/siacoin/

<br />

## Use Case
### [Use Case ①]：
- Graphic Designer (especially, freelance) can sell their creative for company who want to buy their creative for creating good advertisements.
  - Graphic Designer create creatives by using many kind of type files(text, video, audio, etc...). Skynet can upload assets which are not only text files, but also video files and audio files. That's why skynet is eligible for this case.
  - In this case, Graphic Designer can track ownership of their assets.
  - In this case, Graphic Designer who is seller get Siacoin (SC) as compensation from companies who is buyer. And then, they can exchange from Siacoin (SC) to another cryptocurrancies via ShapeShift, Binance, etc... ( https://sia.tech/get-siacoin ）


<br />

## Process which is from upload asset on skynet to listing and buying/seling on Skynet Asset Martketplace
- ① Request result to CoinMarketCap via chainlink's oracle
  ![Screen Shot 2020-03-15 at 19 46 12](https://user-images.githubusercontent.com/19357502/76708288-0039d700-66f6-11ea-828a-f2152aeb9fa7.png)
   ↓
- ② Form of uploading asset on Skynet
  ![Screen Shot 2020-03-15 at 19 46 27](https://user-images.githubusercontent.com/19357502/76708292-016b0400-66f6-11ea-85bf-acdf52da0bda.png)
  ↓
- ③ Register uploaded asset on skynet to Skynet Asset Marketplace
  ![Screen Shot 2020-03-15 at 19 47 13](https://user-images.githubusercontent.com/19357502/76708293-02039a80-66f6-11ea-969d-54da49bfc35f.png)
  ↓
- ④ Listed Asset from Skynet
  ![Screen Shot 2020-03-15 at 19 47 23](https://user-images.githubusercontent.com/19357502/76708294-029c3100-66f6-11ea-90bc-1b4930c095df.png)


<br />

## Reference and resources
- Gitcoin Skynet Hackathon Challenge   
https://gitcoin.co/issue/NebulousLabs/Skynet-Hive/1/4058

- Skynet（Browser）  
https://siasky.net/

- Document of Skynet  
https://sia.tech/docs/#skynet

- WebSite  
https://sia.tech/

- Existing Sample  
https://awesome.ipfs.io/
https://github.com/NebulousLabs/skynet-blogger

- Discord  
https://discordapp.com/channels/341359001797132308/682336097983791105

- Token price of Siacoin (SC) on CoinMarketCap  
https://coinmarketcap.com/currencies/siacoin/

- CoinMarketCap Chainlink (Testnet)  
https://docs.chain.link/docs/coinmarketcap#section-create-your-chainlinked-contract   
   - `getV1CryptocurrencyQuotesLatest` which is supported by chainlink  
     https://pro.coinmarketcap.com/api/v1#operation/getV1CryptocurrencyQuotesLatest

<br>

- Tools related to chainlink（on Ropsten Testnet）
   - Chainlink fancet  
     https://ropsten.chain.link/
   - Chainlink Explore  
     https://ropsten.explorer.chain.link/
