import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";
import { IFxPortalClientConfig } from "../interfaces";

export class RootTunnel extends BaseToken<IFxPortalClientConfig> {

    constructor(client: Web3SideChainClient<IFxPortalClientConfig>, address: string) {
        super(
            {
                isParent: true,
                address: address,
                name: "FxERC20RootTunnel",
                bridgeType: 'fx-portal'
            },
            client
        );
    }

    get address() {
        return this.contractParam.address;
    }
}