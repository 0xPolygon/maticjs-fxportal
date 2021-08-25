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

    async getPredicateAddress() {
        if (this.predicateAddress) {
            return this.predicateAddress;
        }
        const tokenType = await this.rootChainManager.method("tokenToType", this.contractParam.tokenAddress).read();
        if (!tokenType) {
            throw new Error('Invalid Token Type');
        }
        const predicateAddress = await this.rootChainManager.method
            (
                "typeToPredicate", tokenType
            ).read<string>();
        this.predicateAddress = predicateAddress;
        return predicateAddress;
    }
}