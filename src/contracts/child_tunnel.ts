import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";
import { IFxPortalClientConfig } from "../interfaces";

export class ChildTunnel extends BaseToken<IFxPortalClientConfig> {

    constructor(client: Web3SideChainClient<IFxPortalClientConfig>, address: string) {
        super(
            {
                isParent: false,
                address: address,
                name: "FxERC20ChildTunnel",
                bridgeType: 'fx-portal'
            },
            client
        );
    }
}
