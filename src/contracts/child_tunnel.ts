import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";

export class ChildTunnel extends BaseToken {

    constructor(client: Web3SideChainClient, address: string) {
        super(
            {
                isParent: true,
                address: address,
                name: "FxERC20ChildTunnel",
                bridgeType: 'fx-portal'
            },
            client
        );
    }
}