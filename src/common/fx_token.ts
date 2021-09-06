import { BaseToken, RootChainManager, IContractInitParam, Web3SideChainClient, ExitManager } from "@maticnetwork/maticjs";

export class FxPortalToken extends BaseToken {

    constructor(
        contractParam: IContractInitParam,
        client: Web3SideChainClient,
        protected exitManager: ExitManager
    ) {
        super(contractParam, client);
    }
}