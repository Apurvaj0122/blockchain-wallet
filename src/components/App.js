import React, { Component } from "react";
import daiLogo from "../dai-logo.png";
import busdLogo from "../busd.png";
import "./App.css";
import Web3 from "web3";
import DaiTokenMock from "../abis/DaiTokenMock.json";
import BusdTokenMock from "../abis/BusdTokenMock.json";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const daiTokenAddress = "0xBf1d14195bc65BD7Fe42951629A215E737e8727b"; // Replace DAI Address Here(run truffle migrate --reset then check json file)
    const busdTokenAddress = "0xA1f59ea94a521FBA3d802AD7f13ff8fD8e204065";

    const daiTokenMock = new web3.eth.Contract(
      DaiTokenMock.abi,
      daiTokenAddress
    );
    this.setState({ daiTokenMock: daiTokenMock });
    const busdTokenMock = new web3.eth.Contract(
      BusdTokenMock.abi,
      busdTokenAddress
    );
    this.setState({ busdTokenMock: busdTokenMock });

    const balance = await daiTokenMock.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ balance: web3.utils.fromWei(balance.toString(), "Ether") });
    //console.log(web3.utils.fromWei(balance.toString(), "Ether"))
    const balance2 = await busdTokenMock.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({
      balance2: web3.utils.fromWei(balance2.toString(), "Ether"),
    });
    //console.log(web3.utils.fromWei(balance2.toString(), "Ether"))


    //Transaction history for DAI
    const transactions = await daiTokenMock.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
      filter: { from: this.state.account },
    });
    this.setState({ transactions: transactions });
    console.log(transactions);

    //Transaction history for BUSD
    const transactions2 = await busdTokenMock.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
      filter: { from: this.state.account },
    });
    this.setState({ transactions2: transactions2 });
    console.log(transactions2);
  }

  transferToken(name, recipient, amount){
    if(name == "daiTokenMock"){
    this.state.daiTokenMock.methods
      .transfer(recipient, amount)
      .send({ from: this.state.account });
    }else if(name == "busdTokenMock"){
      this.state.busdTokenMock.methods
      .transfer(recipient, amount)
      .send({ from: this.state.account });
    }
  }

  
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      daiTokenMock: null,
      busdTokenMock: null,
      balance2: 0,
      balance: 0,
      transactions: [],
      transactions2: [],
    };
    this.transferToken = this.transferToken.bind(this);
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="/"
            rel="noopener noreferrer"
          >
            Blockchain Wallet
          </a>
        </nav>

        <main role="main" className="col-lg-12 d-flex text-center">
          <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
            <div className="container-fluid mt-5 mr-auto ml-auto">
              <h1>Choose Currency </h1>
              <br />
              <br />

              <div className="row">
                <div className="column mr-auto ml-auto">
                  <a href="/" rel="noopener noreferrer">
                    <img src={daiLogo} width="150" alt="DAI" />
                  </a>
                  <h1>{this.state.balance} DAI</h1>
                </div>

                <div className="column mr-auto ml-auto">
                  <a href="/" rel="noopener noreferrer">
                    <img src={busdLogo} width="150" alt="BUSD" />
                  </a>
                  <h1>{this.state.balance2} BUSD </h1>
                </div>

                <div className="column mr-auto ml-auto">
                  <div className="container-fluid mt-5">
                    <div
                      className="content mr-auto ml-auto"
                      style={{ width: "500px" }}
                    >
                      <form>
                        <div className="form-group mr-sm-2">
                          <input
                            id="recipient"
                            type="text"
                            ref={(input) => {
                              this.recipient = input;
                            }}
                            className="form-control"
                            placeholder="Recipient Address"
                            required
                          />
                        </div>
                        <div className="form-group mr-sm-2">
                          <input
                            id="amount"
                            type="text"
                            ref={(input) => {
                              this.amount = input;
                            }}
                            className="form-control"
                            placeholder="Amount"
                            required
                          />
                        </div>
                        <div className="row">
                          <div className="col mr-auto ml-auto">
                            <button
                              type="submit"
                              className="btn btn-primary btn-block"
                              style={{ width: "200px" }}
                              onClick={(event) => {
                                event.preventDefault();
                                const recipient = this.recipient.value;
                                const amount = window.web3.utils.toWei(
                                  this.amount.value,
                                  "Ether"
                                );
                                console.log(recipient, amount);
                                this.transferToken("daiTokenMock", recipient, amount);
                              }}
                            >
                              Send DAI
                            </button>
                          </div>
                          <div className="col mr-auto ml-auto">
                            <button
                              type="submit"
                              className="btn btn-primary btn-block"
                              style={{ width: "200px" }}
                              onClick={(event) => {
                                event.preventDefault();
                                const recipient = this.recipient.value;
                                const amount = window.web3.utils.toWei(
                                  this.amount.value,
                                  "Ether"
                                );
                                console.log(recipient, amount);
                                this.transferToken("busdTokenMock", recipient, amount);
                              }}
                            >
                              Send BUSD
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5" style={{ width: "700px" }}>
          <h1 className="ml-5">Transaction History</h1>
          <div className="col mt-5">
            <table className="table" style={{ width: "300px" }}>
              <thead>
                <tr>
                  <th scope="col">Recipient</th>
                  <th scope="col">DAI value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.transactions.map((tx, key) => {
                  return (
                    <tr key={key}>
                      <td>{tx.returnValues.to}</td>
                      <td>
                        {window.web3.utils.fromWei(
                          tx.returnValues.value.toString(),
                          "Ether"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col mt-5">
            <table className="table" style={{ width: "300px" }}>
              <thead>
                <tr>
                  <th scope="col">Recipient</th>
                  <th scope="col">BUSD value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.transactions2.map((tx, key) => {
                  return (
                    <tr key={key}>
                      <td>{tx.returnValues.to}</td>
                      <td>
                        {window.web3.utils.fromWei(
                          tx.returnValues.value.toString(),
                          "Ether"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        </main>
      </div>
    );
  }
}

export default App;
