import React, { Component } from "react";
import { Button, Typography, Grid, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

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

            this.setState({ web3, accounts, contract });

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

    refreshState = async () => {
        const totalBetTrue = await this.state.web3.utils.fromWei(await this.state.contract.methods.totalBetTrue().call());
        const totalBetFalse = await this.state.web3.utils.fromWei(await this.state.contract.methods.totalBetFalse().call());

        const myBetTrue = await this.state.web3.utils.fromWei(await this.state.contract.methods.getBetAmount(true).call({ from: this.state.accounts[0] }));
        const myBetFalse = await this.state.web3.utils.fromWei(await this.state.contract.methods.getBetAmount(false).call({ from: this.state.accounts[0] }));

        const resultReceived = await this.state.contract.methods.resultReceived().call();
        const result = await this.state.contract.methods.result().call();

        //@dev - Assign responsed value from CoinMarketCap
        const currentPrice = await this.state.contract.methods.currentPrice().call();
        console.log('=== currentPrice ===', currentPrice);

        var resultMessage;
        if (resultReceived) {
            if (result) {
                resultMessage = "Result is 6";
            }
            else {
                resultMessage = "Result is not 6";
            }
        }
        else {
            resultMessage = "Result has not been received yet";
        }

        this.setState({ 
          totalBetTrue, 
          totalBetFalse, 
          myBetTrue, 
          myBetFalse, 
          resultReceived, 
          result, 
          currentPrice,   //@dev - For skynet
          resultMessage 
        });
    }

    handleUpdateForm = (name, value) => {
        this.setState({ [name]: value });
    }

    handleRequestResults = async () => {
        //@dev - Define variable for request to CoinMarketCap
        const _coin = "SC"      //@dev - Siacoin - Specify a symbol of currency before it is converted
        //const _coin = "ETH"   //@dev - ETH - Specify a symbol of currency before it is converted
        const _market = "USD"   //@dev - - Specify a symbol of currency after it is converted

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

    handleWithdraw = async () => {
        try {
            const balanceBefore = await this.state.web3.utils.fromWei(await this.state.web3.eth.getBalance(this.state.accounts[0]));
            await this.state.contract.methods.withdraw().send({ from: this.state.accounts[0], gas: GAS, gasPrice: GAS_PRICE });
            const balanceAfter = await this.state.web3.utils.fromWei(await this.state.web3.eth.getBalance(this.state.accounts[0]))
            this.refreshState();
            this.setState({ message: `You received ${balanceAfter - balanceBefore} ETH` });
        }
        catch (error) {
            console.error(error);
            this.setState({ message: "Failed withdrawing" });
        }
    }

    handleBet = async (betResultString) => {
        this.setState({ message: 'Placing bet...' });

        var betResult;
        if (betResultString === "true") {
            betResult = true;
        }
        else if (betResultString === "false") {
            betResult = false;
        }

        try {
            await this.state.contract.methods.bet(betResult).send({ from: this.state.accounts[0], value: this.state.web3.utils.toWei(this.state.betAmount), gas: GAS, gasPrice: GAS_PRICE });
            this.refreshState();
            this.setState({ message: 'Bet placed' });
        } catch (error) {
            console.error(error);
            this.setState({ message: 'Failed placing the bet' });
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
                    <Typography variant="h5" style={{ marginTop: 32 }}>
                        Oracle is going to return a number between 1 and 6
                    </Typography>
                    <Typography variant="h5" style={{ marginTop: 32 }}>
                        {this.state.resultMessage}
                    </Typography>

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={3}>
                        <Typography variant="h5">
                                Betting on
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                6
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                Not 6
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                {"Total bets"}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                {`${this.state.totalBetTrue}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                {`${this.state.totalBetFalse}`}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                {"Your bets"}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                {`${this.state.myBetTrue}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                {`${this.state.myBetFalse}`}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                {"Bet amount"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="bet-amount"
                                className="input"
                                value={this.state.betAmount}
                                onChange={e => this.handleUpdateForm('betAmount', e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={3}>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" onClick={() => this.handleBet("true")}>
                                Bet on 6
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" onClick={() => this.handleBet("false")}>
                                Bet on not 6
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 32 }}>
                        <Grid item xs={3}>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" onClick={() => this.handleRequestResults()}>
                                Request result
                </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" onClick={() => this.handleWithdraw()}>
                                Withdraw winnings
              </Button>
                        </Grid>
                    </Grid>

                    <Typography variant="h5" style={{ marginTop: 32 }}>
                        {this.state.message}
                    </Typography>

                </div>
            </ThemeProvider>
        );
    }
}

export default App;
