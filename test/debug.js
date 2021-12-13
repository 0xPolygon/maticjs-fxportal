const { use, setProofApi } = require("@maticnetwork/maticjs");
const maticJs = require("@maticnetwork/maticjs").default
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-web3");


const HDWalletProvider = require("@truffle/hdwallet-provider");
const { user1, rpc, fx_portal, user2 } = require("./config");
const { FxPortalClient } = require("@fxportal/maticjs-fxportal");

// const dotenv = require('dotenv');
// dotenv.config();

use(Web3ClientPlugin);
const from = process.env.FROM || user1.address;
const to = user2.address;

console.log('from', from);

const execute = async () => {
    const privateKey = process.env.PRIVATE_KEY || user1.privateKey;
    const mumbaiERC20 = fx_portal.child.erc20;
    const goerliERC20 = fx_portal.parent.erc20;
    const rootRPC = process.env.ROOT_RPC || rpc.parent;
    const maticRPC = process.env.MATIC_RPC || rpc.child;
    const matic = new FxPortalClient();


    await matic.init({
        log: true,
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

    const rootTokenErc20 = matic.erc20(goerliERC20, true);
    const mumbaiTokenErc20 = matic.erc20(mumbaiERC20);

    // return console.log(await rootTokenErc20.getMappedChildAddress());
    // return console.log(await matic.isDeposited('0xa3febaa3bfdd5e8d9fe32ea0107892c9deae3eadcd0eec0fc5d9263f6d039f7f'));
    // return console.log(await matic.isCheckPointed('0x54f07b3bcea3846edd26e9383e366f20057ff3171ecc8ec418355095f7fdfd08'));

    // setProofApi("https://apis.matic.network");
    // const result = await rootTokenErc20.withdrawExit('0x11412edcf0e24729a97e8e74d3d00745dbe5441078526d115e4f0717ad58e058', {
    //     returnTransaction: true
    // })
    // const writeTx = matic['client'].parent.write({
    //     chainId: result.chainId,
    //     from: result.from,
    //     nonce: result.nonce,
    //     data: result.data,
    //     to: result.to
    // });
    // const txHashpromise = new Promise((res) => {
    //     writeTx.onTransactionHash = (value) => {
    //         res(value);
    //     }
    // })
    // const txReceiptPromise = new Promise(res => {
    //     writeTx.onReceipt = (value) => {
    //         res(value);
    //     }
    // })

    // const txHash = await txHashpromise;
    // const txReceipt = await txReceiptPromise;

    // // console.log(await writeTx.getTransactionHash())
    // // console.log(await writeTx.getReceipt())
    // return console.log(
    //     "exit",
    // )
    // return console.log(
    //     await mumbaiTokenErc20.getBalance(from)
    // )


    const result = await rootTokenErc20.deposit(1000000000, from);
    // const result = await rootTokenErc20.mapChild();
    const result = await mumbaiTokenErc20.withdrawToStart(1000, to);
    // const result = await rootTokenErc20.withdrawExit('0xfe76bfed39c7de19b62dd8f70feaf830846812bd17661bff22c2fb2344c3cba3');
    const txHash = await result.getTransactionHash();
    console.log("txHash", txHash);
    console.log("receipt", await result.getReceipt());

    // const result = await rootTokenErc20.withdrawExit('0xbb9051c6a55ad82122835dd6b656f62f2bf905452e844172f9d8ba6a98137f8c');
    // // console.log("result", result, typeof result);
    // const txHash = await result.getTransactionHash();
    // console.log("txHash", txHash);
    // console.log("receipt", await result.getReceipt());

    // const isCheckpointed = await mumbaiTokenErc20.isWithdrawExited('0xbb9051c6a55ad82122835dd6b656f62f2bf905452e844172f9d8ba6a98137f8c');
    // console.log("isWithdrawExited", isCheckpointed);
    // console.log("from", from, mumbaiERC20);
    // const balanceRoot = await mumbaiTokenErc20.getBalance(from)
    // console.log('balanceRoot', balanceRoot);
}

execute().then(_ => {
    process.exit(0)
}).catch(err => {
    console.error("error", err);
    process.exit(0);
})
