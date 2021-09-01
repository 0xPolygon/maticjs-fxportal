const { use, BaseToken } = require("@maticnetwork/maticjs");

// return console.log("BaseToken", BaseToken)

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { user1, rpc, fx_portal } = require("./config");
const { FxPortalPlugin, FxPortalClient } = require("fx-portal");

use(FxPortalPlugin);
const from = user1.address;

const execute = async () => {
    const privateKey = user1.privateKey;
    const mumbaiERC20 = fx_portal.child.erc20;
    const goerliERC20 = fx_portal.parent.erc20;

    const matic = new FxPortalClient({
        network: 'testnet',
        version: 'mumbai',
        parent: {
            provider: new HDWalletProvider(privateKey, rpc.parent),
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

    const rootTokenErc20 = matic.erc20(mumbaiERC20);
    const balanceRoot = await rootTokenErc20.getBalance(user1.address)
    console.log('root bal start', balanceRoot, 'root bal end');
}

execute().then(_ => {
    process.exit(0)
}).catch(err => {
    console.error(err);
    process.exit(0);
})
