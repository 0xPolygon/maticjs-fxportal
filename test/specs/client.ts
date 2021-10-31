import { FxPortalClient } from "@maticnetwork/maticjs-fxportal";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { user1, rpc, fx_portal, user2 } from "../config";

export const privateKey = user1.privateKey;
export const from = user1.address;
export const to = user2.address;
export const toPrivateKey = user2.privateKey;

console.log('from', from);

export const RPC = rpc;

export const erc20 = {
    parent: fx_portal.parent.erc20,
    child: fx_portal.child.erc20
}
export const erc721 = {
    parent: fx_portal.parent.erc721,
    child: fx_portal.child.erc721
}

export let fxPortalClient: FxPortalClient;

try {
    fxPortalClient = new FxPortalClient({
        // log: true,
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
} catch (error) {
    console.error('error unable to init fxPortalClientFrom', error);
}

export let fxPortalClientTo: FxPortalClient;

try {
    fxPortalClientTo = new FxPortalClient({
        // log: true,
        network: 'testnet',
        version: 'mumbai',
        parent: {
            provider: new HDWalletProvider(toPrivateKey, rpc.parent),
            defaultConfig: {
                from: to
            }
        },
        child: {
            provider: new HDWalletProvider(toPrivateKey, rpc.child),
            defaultConfig: {
                from: to
            }
        }
    });
} catch (error) {
    console.error('error unable to init fxPortalClientTo', error);
}


