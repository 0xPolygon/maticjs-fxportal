const { use, BaseToken } = require("@maticnetwork/maticjs");

// return console.log("BaseToken", BaseToken)

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { user1, rpc, fx_portal } = require("./config");
const { FxPortalPlugin, FxPortalClient } = require("fx-portal");

const dotenv = require('dotenv');
dotenv.config();

use(FxPortalPlugin);
const from = process.env.FROM || user1.address;

const execute = async () => {
    const privateKey = process.env.PRIVATE_KEY || user1.privateKey;
    const mumbaiERC20 = fx_portal.child.erc20;
    const goerliERC20 = fx_portal.parent.erc20;
    const rootRPC = process.env.ROOT_RPC || rpc.parent;
    const matic = new FxPortalClient({
        network: 'testnet',
        version: 'mumbai',
        parent: {
            provider: new HDWalletProvider(privateKey, rootRPC),
            defaultConfig: {
                from
            }
        },
        child: {
            provider: new HDWalletProvider(privateKey, rpc.child),
            defaultConfig: {
                from
            }
        }
    });

    await matic.init();

    const rootTokenErc20 = matic.erc20(goerliERC20, true);
    const mumbaiTokenErc20 = matic.erc20(mumbaiERC20);

    // const result = await rootTokenErc20.mapChild();
    const nonce = await mumbaiTokenErc20.client.child.getTransactionCount(from);
    console.log("nonce", nonce);
    const result = await mumbaiTokenErc20.withdrawStart(10, {
        nonce: nonce,
        gasPrice: '900000000000',
        // returnTransaction: true
    });
    console.log("result", result, typeof result);
    // const Web3 = require('web3');
    // const web3 = new Web3(
    //     new HDWalletProvider(privateKey, rpc.child)
    // )
    // const tx = web3.eth.sendTransaction(result);
    // tx.on("error", (err) => {
    //     console.error("err", err);
    // }).on('transactionHash', (hash) => {
    //     console.log("hash", hash);
    // })
    // const result =  mumbaiTokenErc20.client.child.write(result);
    const txHash = await result.getTransactionHash();
    console.log("txHash", txHash);
    console.log("receipt", await result.getReceipt());

    // const isCheckpointed = await matic.isCheckPointed('0xedfbd285bfae7637960a149fb00fbc54545edc9b85cef9ba6d05311369bbc2dd');
    // console.log("isCheckpointed", isCheckpointed);

    // const balanceRoot = await mumbaiTokenErc20.getBalance(from)
    // console.log('balanceRoot', balanceRoot);
}

execute().then(_ => {
    process.exit(0)
}).catch(err => {
    console.error("error", err);
    process.exit(0);
})
