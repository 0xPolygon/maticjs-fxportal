import { BaseToken, IContractInitParam, Web3SideChainClient } from "@maticnetwork/maticjs";
import { IFxPortalContracts } from "../interfaces";

export class FxPortalToken extends BaseToken {

    constructor(
        contractParam: IContractInitParam,
        client: Web3SideChainClient,
        protected contracts: IFxPortalContracts
    ) {
        super(contractParam, client);
    }
}
