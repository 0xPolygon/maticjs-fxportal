# fx-portal.js

Library for interacting with fx-portal bridge.

> fx-portal is plugin for maticjs. 

# Installation

```
npm i @maticnetwork/fx-portal.js
```

# DOCS

## Initiate client

```
const { use } = require("@maticnetwork/maticjs");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { FxPortalPlugin, FxPortalClient } = require("fx-portal");
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

method `erc20` allows you to interact with erc20 token.

```
const erc20 = fxPortalClient.erc20(<tokenAddress>, <isRoot>);
```

### getBalance

```
const balance = await erc20.getBalance(<user address>);
```

### approve

```
const approveResult = await erc20.approve(<amount>);
const txHash = await approveResult.getTransactionHash();
const receipt = await approveResult.getReceipt();
```

## approveMax

```
const approveResult = await erc20.approveMax();
const txHash = await approveResult.getTransactionHash();
const receipt = await approveResult.getReceipt();
```

### getAllowance

```
const balance = await erc20.getAllowance(<user address>);
```

## deposit

```
const result = await erc20.deposit(<amount>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

## withdrawStart

initiate withdraw process by burning the required amount. 

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

exit withdraw process by providng txHash received in `withdrawStart` process.

**Note:-** `withdrawExit` can be called after checkpoint has been submitted for `withdrawStart`.

```
const result = await erc20.withdrawExit(<burn tx hash>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

## isExited

check if withdrawExit has been completed or not

```
const balance = await erc20.isExited(<tx hash>);
```

## withdrawExitFaster

faster exit withdraw process by providng txHash received in `withdrawStart` process.

It uses the api to create the proof, that is why its faster.

```
const result = await erc20.withdrawExitFaster(<burn tx hash>);
const txHash = await result.getTransactionHash();
const receipt = await result.getReceipt();
```

