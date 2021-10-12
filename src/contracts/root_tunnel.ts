import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";

export class RootTunnel extends BaseToken {

    constructor(client: Web3SideChainClient, address: string) {
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