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
    const maticRPC = process.env.MATIC_RPC || rpc.child;
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
            provider: new HDWalletProvider(privateKey, maticRPC),
            defaultConfig: {
                from
            }
        }
    });

    await matic.init();

    const rootTokenErc20 = matic.erc20(goerliERC20, true);
    const mumbaiTokenErc20 = matic.erc20(mumbaiERC20);

    // const result = await rootTokenErc20.mapChild();
    // const nonce = await mumbaiTokenErc20.client.child.getTransactionCount(from);
    // console.log("nonce", nonce);
    const result = await rootTokenErc20.withdrawExitFaster('0x60774f02753bedb63376550329fb415f1de63c41f9ba0445f53ee544c7b3d9a2', {
        // nonce: nonce,
        // gasPrice: '900000000000',
        // returnTransaction: true
    });
    // console.log("result", result, typeof result);
    const txHash = await result.getTransactionHash();
    console.log("txHash", txHash);
    console.log("receipt", await result.getReceipt());

    // const isCheckpointed = await matic.isCheckPointed('0x60774f02753bedb63376550329fb415f1de63c41f9ba0445f53ee544c7b3d9a2');
    // console.log("isCheckpointed", isCheckpointed);

    const balanceRoot = await mumbaiTokenErc20.getBalance(from)
    console.log('balanceRoot', balanceRoot);
}

execute().then(_ => {
    process.exit(0)
}).catch(err => {
    console.error("error", err);
    process.exit(0);
})
