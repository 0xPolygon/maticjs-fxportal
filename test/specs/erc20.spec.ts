import { erc20, from, fxPortalClient, fxPortalClientTo, to } from "./client";
import { expect } from 'chai'
import { ABIManager, setProofApi } from '@maticnetwork/maticjs'
import BN from "bn.js";


describe('ERC20', () => {

    let erc20Child = fxPortalClient.erc20(erc20.child);
    let erc20Parent = fxPortalClient.erc20(erc20.parent, true);

    const abiManager = new ABIManager("testnet", "mumbai");
    before(() => {
        return Promise.all([
            fxPortalClient.init(),
            abiManager.init()
        ]);
    });


    it('get balance child', async () => {
        console.log('from.env.NODE_ENV', from);
        const balance = await erc20Child.getBalance(from);
        console.log('balance', balance);
        expect(balance).to.be.an('string');
        expect(Number(balance)).gte(0);
    })

    it('get balance parent', async () => {
        const balance = await erc20Parent.getBalance(from);
        console.log('balance', balance);
        expect(balance).to.be.an('string');
        expect(Number(balance)).gte(0);
    })

    it('get allowance', async () => {
        const allowance = await erc20Parent.getAllowance(from);
        expect(allowance).to.be.an('string');
        expect(Number(allowance)).gte(0);
    })

    it('is check pointed', async () => {
        const isCheckPointed = await fxPortalClient.isCheckPointed('0xd6f7f4c6052611761946519076de28fbd091693af974e7d4abc1b17fd7926fd7');
        expect(isCheckPointed).to.be.an('boolean').equal(true);
    })

    // it('isWithdrawExited', async () => {
    //     const exitTxHash = '0x95844235073da694e311dc90476c861e187c36f86a863a950534c9ac2b7c1a48';
    //     const isExited = await erc20Parent.isWithdrawExited('0xbb9051c6a55ad82122835dd6b656f62f2bf905452e844172f9d8ba6a98137f8c');
    //     expect(isExited).to.be.an('boolean').equal(true);
    // })

    it('child transfer returnTransaction with erp1159', async () => {
        const amount = 10;
        try {
            const result = await erc20Child.transfer(amount, to, {
                maxFeePerGas: 10,
                maxPriorityFeePerGas: 10,
                returnTransaction: true
            });
            console.log('result', result);
        } catch (error) {
            console.log('error', error);
            expect(error).deep.equal({
                message: `Child chain doesn't support eip-1559`,
                type: 'eip-1559_not_supported'
            })
        }
    });

    it('child transfer returnTransaction', async () => {
        const amount = 10;
        const result = await erc20Child.transfer(amount, to, {
            returnTransaction: true
        });
        expect(result).to.have.not.property('maxFeePerGas')
        expect(result).to.have.not.property('maxPriorityFeePerGas')
        expect(result).to.have.property('gasPrice')
        expect(result['gasPrice']).to.be.an('number').gt(0);
        expect(result).to.have.property('chainId', '0x13881');
    });

    it('parent transfer returnTransaction with erp1159', async () => {
        const amount = 10;
        const result = await erc20Parent.transfer(amount, to, {
            maxFeePerGas: 20,
            maxPriorityFeePerGas: 20,
            returnTransaction: true
        });

        expect(result).to.have.property('maxFeePerGas', 20)
        expect(result).to.have.property('maxPriorityFeePerGas', 20)
        expect(result).to.have.not.property('gasPrice')
        expect(result).to.have.property('chainId', '0x5');

    });

    // it('isDeposited', async () => {
    //     const txHash = '0xc67599f5c967f2040786d5924ec55d37bf943c009bdd23f3b50e5ae66efde258';
    //     const isExited = await posClient.isDeposited(txHash);
    //     expect(isExited).to.be.an('boolean').equal(true);
    // })

    it('withdrawstart return tx', async () => {
        const result = await erc20Child.withdrawStart('10', {
            returnTransaction: true
        });

        const value = await abiManager.getConfig("Matic.FxPortalContracts.FxERC20ChildTunnel")

        expect(result['to'].toLowerCase()).equal(value.toLowerCase());
        expect(result).to.have.property('data')

    });

    it('approve return tx', async () => {
        const result = await erc20Parent.approve('10', {
            returnTransaction: true
        });

        expect(result['to'].toLowerCase()).equal(erc20.parent.toLowerCase());
        expect(result).to.have.property('data')

    });

    it('deposit return tx', async () => {
        const result = await erc20Parent.deposit(10, from, {
            returnTransaction: true
        });

        const value = await abiManager.getConfig("Main.FxPortalContracts.FxERC20RootTunnel")

        expect(result['to'].toLowerCase()).equal(value.toLowerCase());
    });

    // it('withdrawExit return tx', async () => {
    //     const result = await erc20Parent.withdrawExit('0xbb9051c6a55ad82122835dd6b656f62f2bf905452e844172f9d8ba6a98137f8c', {
    //         returnTransaction: true
    //     });

    //     const rootChainManager = await abiManager.getConfig("Main.POSContracts.RootChainManagerProxy")
    //     expect(result['to'].toLowerCase()).equal(rootChainManager.toLowerCase());
    // });

    // it('withdrawExitFaster return tx', async () => {
    //     setProofApi("https://apis.matic.network");
    //     const result = await erc20Parent.withdrawExitFaster('0xbb9051c6a55ad82122835dd6b656f62f2bf905452e844172f9d8ba6a98137f8c', {
    //         returnTransaction: true
    //     });

    //     const rootChainManager = await abiManager.getConfig("Main.POSContracts.RootChainManagerProxy")
    //     expect(result['to'].toLowerCase()).equal(rootChainManager.toLowerCase());
    // });

    it('child transfer', async () => {
        const oldBalance = await erc20Child.getBalance(to);
        console.log('oldBalance', oldBalance);
        const amount = 10000000;
        let result = await erc20Child.transfer(amount, to);
        let txHash = await result.getTransactionHash();
        expect(txHash).to.be.an('string');
        // console.log('txHash', txHash);
        let txReceipt = await result.getReceipt();
        // console.log("txReceipt", txReceipt);

        const newBalance = await erc20Child.getBalance(to);
        console.log('newBalance', newBalance);

        const oldBalanceBig = new BN(oldBalance);
        const newBalanceBig = new BN(newBalance);

        expect(newBalanceBig.toString()).equal(
            oldBalanceBig.add(new BN(amount)).toString()
        )

        //transfer money back to user
        await fxPortalClientTo.init();
        const erc20ChildToken = fxPortalClientTo.erc20(erc20.child);

        result = await erc20ChildToken.transfer(amount, to);
        txHash = await result.getTransactionHash();
        txReceipt = await result.getReceipt();
    });

    if (process.env.NODE_ENV !== 'test_all') return;

    it('approve', async () => {
        const result = await erc20Parent.approve('10');

        const txHash = await result.getTransactionHash();
        expect(txHash).to.be.an('string');

        const txReceipt = await result.getReceipt();
        console.log("txReceipt", txReceipt);
        expect(txReceipt.type).equal('0x0');
    });

    it('deposit', async () => {
        const result = await erc20Parent.deposit('10', from);

        const txHash = await result.getTransactionHash();
        expect(txHash).to.be.an('string');

        const txReceipt = await result.getReceipt();
        expect(txReceipt).to.be.an('object');
    });

});