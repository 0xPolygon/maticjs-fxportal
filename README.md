# fx-portal.js

Library for interacting with fx-portal bridge.

> fx-portal is plugin for maticjs. 

# Installation

```
npm i @maticnetwork/fx-portal
```

# DOCS

## Initiate client

```
const { use } = require("@maticnetwork/maticjs");
const { FxPortalPlugin, FxPortalClient } = require("@maticnetwork/fx-portal");

const HDWalletProvider = require("@truffle/hdwallet-provider");

// add FxPortal Plugin into maticjs
use(FxPortalPlugin);

const fxPortalClient = new FxPortalClient({
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

await fxPortalClient.init();

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

### approve

Approve required amount for depositing to polygon chain

```
const approveResult = await erc20.approve(<amount>);
const txHash = await approveResult.getTransactionHash();
const receipt = await approveResult.getReceipt();
```

## approveMax

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

## deposit

Deposit required amount from ethereum to polygon

```
const result = await erc20.deposit(<amount>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

## withdrawStart

Initiate withdraw process by burning the required amount. 

```
const result = await erc20.withdrawStart(<amount>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

## isCheckPointed

Check if transaction has been checkpointed or not.

```
await fxPortalClient.isCheckPointed(<tx hash>);
```

## withdrawExit

Exit withdraw process by providng txHash received in `withdrawStart` process.

**Note:-** `withdrawExit` can be called after checkpoint has been submitted for `withdrawStart`.

```
const result = await erc20.withdrawExit(<burn tx hash>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

## isWithdrawExited

Check if withdraw process has been completed by supplying burn transaction hash.

```
const balance = await erc20.isExited(<burn tx hash>);
```

## withdrawExitFaster

Faster exit withdraw process by providng txHash received in `withdrawStart` process.

> It is faster because it uses api to create the proof.

```
const result = await erc20.withdrawExitFaster(<burn tx hash>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

