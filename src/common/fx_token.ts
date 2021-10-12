import { BaseToken, RootChainManager, IContractInitParam, Web3SideChainClient, ExitManager } from "@maticnetwork/maticjs";
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