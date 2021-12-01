[![TEST](https://github.com/fx-portal/maticjs-fxportal/actions/workflows/test.yml/badge.svg)](https://github.com/fx-portal/maticjs-fxportal/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/@fxportal%2Fmaticjs-fxportal.svg)](https://badge.fury.io/js/@fxportal%2Fmaticjs-fxportal)
# maticjs-fxportal

FxPortal bridge plugin for maticjs. It provides FxPortalClient to interact with fxportal bridge.

# Installation

```
npm i @fxportal/maticjs-fxportal
```

## Install ethers library

Currently `matic.js` support two ethers library - 

### 1. web3.js

```
npm i @maticnetwork/maticjs-web3
```

### 2. Ethers

```
npm i @maticnetwork/maticjs-ethers
```

# DOCS

## Initiate client

```
const { use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-web3");
const { FxPortalClient } = require("@fxportal/maticjs-fxportal");

const HDWalletProvider = require("@truffle/hdwallet-provider");

// add Web3Plugin

use(Web3ClientPlugin);

const fxPortalClient = new FxPortalClient();

await fxPortalClient.init({
    network: 'testnet',
    version: 'mumbai',
    parent: {
        provider: new HDWalletProvider(privateKey, rootRPC),
        defaultConfig: {
            from
        }
    },
    child: {
        provider: new HDWalletProvider(privateKey, childRPC),
        defaultConfig: {
            from
        }
    }
});

```

## ERC20

Method `erc20` allows you to interact with erc20 token.

```
const erc20 = fxPortalClient.erc20(<tokenAddress>, <isRoot>);
```

### getBalance

Get balance of a user by supplying user address

```
const balance = await erc20.getBalance(<user address>);
```
### getName

Get name of token

```
const name = await erc20.getName();
```
### getDecimals

Get decimals of token

```
const decimals = await erc20.getDecimals();
```
### getSymbol

Get symbol of token

```
const decimals = await erc20.getSymbol();
```

### approve

Approve required amount for depositing to polygon chain

```
const approveResult = await erc20.approve(<amount>);
const txHash = await approveResult.getTransactionHash();
const receipt = await approveResult.getReceipt();
```

### approveMax

Approve max amount for depositing to polygon chain

```
const approveResult = await erc20.approveMax();
const txHash = await approveResult.getTransactionHash();
const receipt = await approveResult.getReceipt();
```

### getAllowance

Get approve amount of a user by supplying user address

```
const balance = await erc20.getAllowance(<user address>);
```

### deposit

Deposit required amount from ethereum to polygon

```
const result = await erc20.deposit(<amount>, <user address>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

### withdrawStart

Initiate withdraw process by burning the required amount. 

```
const result = await erc20.withdrawStart(<amount>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```
### withdrawExit

Exit withdraw process by providng txHash received in `withdrawStart` process.

**Note:-** `withdrawExit` can be called after checkpoint has been submitted for `withdrawStart`.

```
const result = await erc20.withdrawExit(<burn tx hash>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```
### withdrawExitFaster

Faster exit withdraw process by providng txHash received in `withdrawStart` process.

> It is faster because it uses api to create the proof.

```
const result = await erc20.withdrawExitFaster(<burn tx hash>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

## isCheckPointed

Check if transaction has been checkpointed or not.

```
await fxPortalClient.isCheckPointed(<tx hash>);
```


## isWithdrawExited

Check if withdraw process has been completed by supplying burn transaction hash.

```
const balance = await erc20.isExited(<burn tx hash>);
```


## isDeposited

Check if deposit is completed.

```
const balance = await erc20.isDeposited(<tx hash>);
```
