import { Web3SideChainClient } from "@maticnetwork/maticjs";
import { FxPortalToken } from "../common";
import { IFxPortalClientConfig, IFxPortalContracts } from "../interfaces";

export class Erc721 extends FxPortalToken {
    constructor(
        {
            tokenAddress,
            isParent
        },
        client: Web3SideChainClient<IFxPortalClientConfig>,
        getHelperContracts: () => IFxPortalContracts
    ) {
        super({
            isParent,
            address: tokenAddress,
            name: 'FxERC20ChildToken',
            bridgeType: 'fx-portal'
        }, client, getHelperContracts);
    }
}