import { FxPortalClient } from "@maticnetwork/maticjs-fxportal";
import { user1, rpc, fx_portal, user2 } from "../config";

export const privateKey = user1.privateKey;
export const from = user1.address;
export const to = user2.address;
export const toPrivateKey = user2.privateKey;

console.log('from', from, from.length);

export const RPC = rpc;

export const erc20 = {
    parent: fx_portal.parent.erc20,
    child: fx_portal.child.erc20
}
export const erc721 = {
    parent: fx_portal.parent.erc721,
    child: fx_portal.child.erc721
}

export const fxPortalClient: FxPortalClient = new FxPortalClient();

export const fxPortalClientTo: FxPortalClient = new FxPortalClient();



