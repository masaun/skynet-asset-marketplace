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
- ③ Register uploaded asset on skynet to Skynet Asset Marketplace. And then, they are listed on Skynet Asset Marketplace.  
 （When it at this process, `"hash" of uploaded file on skynet` and `owner address of asset` and `Selling price by siacoin(SC)` are saved on blockchain）  
  ![Screen Shot 2020-03-15 at 19 47 13](https://user-images.githubusercontent.com/19357502/76708293-02039a80-66f6-11ea-969d-54da49bfc35f.png)  
  ↓  
- ④ Users can buy/sell listed and uploaded asset on Skynet in this marketplace  
  ![Screen Shot 2020-03-15 at 19 47 23](https://user-images.githubusercontent.com/19357502/76708294-029c3100-66f6-11ea-90bc-1b4930c095df.png)  


<br />

## Setup
### Before installation
- Install [npm](https://www.npmjs.com/get-npm)

- Install truffle globally using:

`npm install -g truffle`

- Install the Metamask add-on to your browser and create a wallet.
Note down the mnemonics.
Fund it with [Ropsten ETH](https://faucet.metamask.io/) and [Ropsten LINK](https://ropsten.chain.link/).

- Create an [Infura](https://infura.io/) account, get an endpoint URL for the Ropsten testnet and note it down.

- (Optional) Install [Visual Studio Code](https://code.visualstudio.com/)

<br>

### Installation

- ① Clone this repo using:   

`git@github.com:masaun/skynet-asset-marketplace.git`

- ② Go to the main directory (`/skynet-asset-marketplace`)   

- ③ Install the dependencies for the smart contract:   

`npm install`  

- ④ Create the file that you are going to enter your Infura credentials:  

`cp wallet.json.example wallet.json`  

- ⑤ Open the newly created `wallet.json` file and enter the mnemonics and the endpoint URL you have noted down earlier, similar to `wallet.json.example`.  

- ⑥ Deploy the contract (Ropsten LINK will be transferred from your wallet to the contract automatically during deployment)  

`npm run migrate:ropsten`

- ⑦ Go to the front-end project directory (`/skynet-asset-marketplace/client`)  

- ⑧ Install the dependencies for the front-end project:  

`npm install`  

- ⑨ Start the server  

`npm run start`  


<br>

### Recommendation when setup
- After process of ⑥(Deploy the contract) above, it is better to transfer LINK token from Chainlink fancet on ropsten below to deployed contract address.
（Chainlink fancet on ropsten below are able to transfer 100 LINK）  
https://ropsten.chain.link/  



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
