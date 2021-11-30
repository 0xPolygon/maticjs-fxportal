import { from, fxPortalClient, fxPortalClientTo, privateKey, RPC, to, toPrivateKey } from "./client";
import { ABIManager } from '@maticnetwork/maticjs'
import HDWalletProvider from "@truffle/hdwallet-provider";

describe('FxPortal Client', () => {

    const abiManager = new ABIManager("testnet", "mumbai");
    before(() => {
        return Promise.all([
            abiManager.init()
        ]);
    });

    it('init fxPortal client from', async () => {
        await fxPortalClient.init({
            // log: true,
            network: 'testnet',
            version: 'mumbai',
            parent: {
                provider: new HDWalletProvider(privateKey, RPC.parent),
                defaultConfig: {
                    from
                }
            },
            child: {
                provider: new HDWalletProvider(privateKey, RPC.child),
                defaultConfig: {
                    from
                }
            }
        })
    })

    it('init fxPortal client from', async () => {
        await fxPortalClientTo.init({
            // log: true,
            network: 'testnet',
            version: 'mumbai',
            parent: {
                provider: new HDWalletProvider(toPrivateKey, RPC.parent),
                defaultConfig: {
                    from: to
                }
            },
            child: {
                provider: new HDWalletProvider(toPrivateKey, RPC.child),
                defaultConfig: {
                    from: to
                }
            }
        })
    })
});
