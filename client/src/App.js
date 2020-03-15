import React, { Component } from "react";
import { Typography, Grid, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Card, Image, Button } from 'rimble-ui';

import SkynetAssetMarketplace from "./contracts/SkynetAssetMarketplace.json";
import getWeb3 from "./utils/getWeb3";

import { theme } from './utils/theme';
import Header from './components/Header';
import "./App.css";


const GAS = 500000;
const GAS_PRICE = "20000000000";

class App extends Component {
    state = { web3: null, accounts: null, contract: null, betAmount: 0 };

    componentDidMount = async () => {
        try {
            //@dev - Create instance of Sia Skynet 
            const skynet = require('@nebulous/skynet');
            console.log('=== skynet ===', skynet);

            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            if (networkId !== 3) {
                throw new Error("Select the Ropsten network from your MetaMask plugin");
            }
            const deployedNetwork = SkynetAssetMarketplace.networks[networkId];
            const contract = new web3.eth.Contract(
                SkynetAssetMarketplace.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({
                skynet,
                web3, 
                accounts, 
                contract 
            });

            window.ethereum.on('accountsChanged', async (accounts) => {
                const newAccounts = await web3.eth.getAccounts();
                this.setState({ accounts: newAccounts });
            });

            // Refresh on-chain data every 1 second
            const component = this;
            async function loopRefresh() {
                await component.refreshState();
                setTimeout(loopRefresh, 1000);
            }
            loopRefresh();

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };


    //////////////////////////////////////////////////////////////////
    /// @dev - Upload files by using skynet
    //////////////////////////////////////////////////////////////////
    uploadOnSkynet = async () => {
        // Reading instance of skynet
        const { skynet } = this.state;

        // Upload
        const skylink = await skynet.UploadFile(
            "./images/sample_image.jpg",
            skynet.DefaultUploadOptions
        );
        console.log(`Upload successful, skylink: ${skylink}`);
              
        // download
        // await skynet.DownloadFile(
        //     "./images/sample_image.jpg",
        //     skylink,
        //     skynet.DefaultDownloadOptions
        // );
        // console.log('Download successful');
    }
    

    //////////////////////////////////////////////////////////////////
    /// @dev - Save listing assets which are uploaded on Skynet in blockchain and that is listed SkynetAssetMarketplace
    //////////////////////////////////////////////////////////////////
    createListingAsset = async () => {
        const { web3, accounts, contract } = this.state;

        const _assetOwnerAddr = accounts[0];
        const _hashOfAssetOnSkynet = 'https://siasky.net/fAFCQmh7T_dXgm9FTv1COEGTNiC8IUVfmYLgZ3tecW8iSA';
        const _sellingPriceBySiacoin = 100;  // 100 SC

        const response = await this.state.contract.methods.createListingAsset(_assetOwnerAddr,
                                                                              _hashOfAssetOnSkynet,
                                                                              _sellingPriceBySiacoin).send({ from: accounts[0] });
        console.log('=== response of createListingAsset() ===', response);
    }


    //////////////////////////////////////////////////////////////////
    /// @dev - Price Feed of SC (SiaCoin) by using ChainLink's oracle
    //////////////////////////////////////////////////////////////////
    refreshState = async () => {
        const resultReceived = await this.state.contract.methods.resultReceived().call();
        const result = await this.state.contract.methods.result().call();

        //@dev - Assign responsed value from CoinMarketCap
        const _currentPrice = await this.state.contract.methods.currentPrice().call();
        console.log('=== _currentPrice ===', _currentPrice);
        const currentPrice = await _currentPrice / 1000000;  //@dev - Calculate price which is divided by 1000000 equal to "times" (which is specified in SkynetAssetMarketplace.sol of solidity file)
        console.log('=== currentPrice ===', currentPrice);
        this.setState({ messageOfResult: `1 SC = ${this.state.currentPrice} USD` });

        var resultMessage;
        if (resultReceived) {
            if (result) {
                resultMessage = `1 SC = ${currentPrice} USD`;
            }
            else {
                resultMessage = "Result has not been received yet";
            }
        }
        else {
            resultMessage = "Result has not been received yet";
        }

        this.setState({
          resultReceived, 
          result, 
          currentPrice,   //@dev - For skynet
          resultMessage 
        });
    }

    priceCulculation = async () => {
        const { web3, accounts, contract, currentPrice } = this.state;

        //@dev - Call saved price by SC from Struct of ListingAsset
        const _assetId = 0;
        const _sellingPriceBySiacoin = await this.state.contract.methods.getSellingPriceBySiacoin(_assetId).call();
        const sellingPriceBySiacoin = parseFloat(_sellingPriceBySiacoin);
        console.log('=== sellingPriceBySiacoin ===', sellingPriceBySiacoin);
        console.log('=== currentPrice ===', currentPrice);

        const ConvertedPriceFromSiacoinToUSD = currentPrice ** sellingPriceBySiacoin;
        console.log('=== ConvertedPriceFromSiacoinToUSD ===', ConvertedPriceFromSiacoinToUSD);

        this.setState({ ConvertedPriceFromSiacoinToUSD });
    }

    handleUpdateForm = (name, value) => {
        this.setState({ [name]: value });
    }

    handleRequestResults = async () => {
        //@dev - Define variable for request to CoinMarketCap
        const _coin = "SC"      //@dev - Siacoin - Specify a symbol of currency before it is converted
        //const _coin = "ETH"   //@dev - ETH - Specify a symbol of currency before it is converted
        const _market = "USD"   //@dev - USD - Specify a symbol of currency after it is converted

        //@dev - Original codes
        const lastBlock = await this.state.web3.eth.getBlock("latest");
        this.setState({ message: "Requesting the result from the oracle..." });
        try {
            await this.state.contract.methods.requestResult(_coin, _market).send({ from: this.state.accounts[0], gas: GAS, gasPrice: GAS_PRICE });
            while (true) {
                const responseEvents = await this.state.contract.getPastEvents('ChainlinkFulfilled', { fromBlock: lastBlock.number, toBlock: 'latest' });
                if (responseEvents.length !== 0) {
                    break;
                }
            }
            this.refreshState();
            this.setState({ message: "The result is delivered" });
        } catch (error) {
            console.error(error);
            this.setState({ message: "Failed getting the result" });
        }
    }

    render() {
        if (!this.state.web3) {
            return (
                <ThemeProvider theme={theme}>
                    <div className="App">
                        <Header />
                        <Typography>
                            Loading Web3, accounts, and contract...
          </Typography>
                    </div>
                </ThemeProvider>
            );
        }
        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <Header />

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={1}>
                        </Grid>
                        <Grid item xs={10}>
                            <Card width={"auto"} 
                                  maxWidth={"840px"} 
                                  mx={"auto"} 
                                  my={5} 
                                  p={20} 
                                  borderColor={"#E8E8E8"}
                            >
                              <h3>Request result to CoinMarketCap via chainlink's oracle</h3>

                              <h10>
                                  Oracle is going to return token price of Siacoin (display converted price from SC to USD) 
                              </h10>

                              <Grid container style={{ marginTop: 32 }}>
                                  <Grid item xs={3}>
                                  </Grid>
                                  <Grid item xs={6}>
                                      <Button variant="contained" color="primary" onClick={() => this.handleRequestResults()}>
                                          Request result
                                      </Button>
                                  </Grid>
                                  <Grid item xs={3}>
                                  </Grid>
                              </Grid>

                              <p>{this.state.message}</p>

                              <h3>↓</h3>

                              <h3>Result of price</h3>
                              <Typography variant="h5" style={{ marginTop: 32 }}>
                                 {this.state.messageOfResult}
                              </Typography>
                            </Card>

                            <h3>↓</h3>
                        </Grid>
                        <Grid item xs={1}>
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={2}>
                        </Grid>
                        <Grid item xs={8}>
                            <Card width={"auto"} 
                                  maxWidth={"840px"} 
                                  mx={"auto"} 
                                  my={5} 
                                  p={20} 
                                  borderColor={"#E8E8E8"}
                            >
                              <h3>Form of uploading asset on Skynet</h3>

                              <Button variant="contained" color="primary" onClick={() => this.uploadOnSkynet()}>
                                  Upload on skynet
                              </Button>

                              <h3>↓</h3>

                              <h3>Hash of being uploaded file</h3>
                              <p>https://siasky.net/fAFCQmh7T_dXgm9FTv1COEGTNiC8IUVfmYLgZ3tecW8iSA</p>
                            </Card>

                            <h3>↓</h3>
                        </Grid>
                        <Grid item xs={2}>
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={1}>
                        </Grid>
                        <Grid item xs={10}>
                            <Card width={"auto"} 
                                  maxWidth={"840px"} 
                                  mx={"auto"} 
                                  my={5} 
                                  p={20} 
                                  borderColor={"#E8E8E8"}
                            > 
                              <h3>Register uploaded asset on skynet into Skynet Asset Marketplace</h3>

                              <Grid container style={{ marginTop: 32 }}>
                                  <Grid item xs={3}>
                                      <Typography variant="h6">
                                          {"Asset owner address: "}
                                      </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                      <TextField
                                          id=""
                                          className="input"
                                      />
                                  </Grid>
                              </Grid>

                              <Grid container style={{ marginTop: 32 }}>
                                  <Grid item xs={3}>
                                      <Typography variant="h6">
                                          {"Hash of asset on skynet: "}
                                      </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                      <TextField
                                          id=""
                                          className="input"
                                      />
                                  </Grid>
                              </Grid>

                              <Grid container style={{ marginTop: 32 }}>
                                  <Grid item xs={3}>
                                      <Typography variant="h6">
                                          {"Selling price by Siacoin (SC): "}
                                      </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                      <TextField
                                          id=""
                                          className="input"
                                      />
                                  </Grid>
                              </Grid>                            

                              <br />

                              <Button variant="contained" color="primary" onClick={() => this.createListingAsset()}>
                                  Create Listing Asset
                              </Button>
                            </Card>

                            <h3>↓</h3>
                        </Grid>
                        <Grid item xs={1}>
                        </Grid>
                    </Grid>                        

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4}>
                            <Card width={"auto"} 
                                  maxWidth={"420px"} 
                                  mx={"auto"} 
                                  my={5} 
                                  p={20} 
                                  borderColor={"#E8E8E8"}
                            >
                              <h3>Listed Asset from Skynet</h3>

                              <Image
                                alt="random unsplash image"
                                borderRadius={8}
                                height="100%"
                                maxWidth='100%'
                                src="https://siasky.net/fAFCQmh7T_dXgm9FTv1COEGTNiC8IUVfmYLgZ3tecW8iSA"
                              />

                              <p>{`Price(SC):  100 SC`}</p>
                              <p>{`Price(USD): 100 SC × ${this.state.currentPrice} USD`}</p>

                              <Button variant="contained" color="primary">
                                  Buy this asset
                              </Button>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                        </Grid>                     
                    </Grid>
                </div>
            </ThemeProvider>
        );
    }
}

export default App;
