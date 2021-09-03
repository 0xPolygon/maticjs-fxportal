import { BaseToken, RootChainManager, IContractInitParam, Web3SideChainClient, ExitManager } from "@maticnetwork/maticjs";

export class FxPortalToken extends BaseToken {

    private predicateAddress: string;

    constructor(
        contractParam: IContractInitParam,
        client: Web3SideChainClient,
        protected rootChainManager: RootChainManager,
        protected exitManager: ExitManager
    ) {
        super(contractParam, client);
    }
}