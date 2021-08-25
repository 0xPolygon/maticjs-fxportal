import { Web3SideChainClient, RootChainManager, ExitManager, ITransactionOption } from "@maticnetwork/maticjs";
import { FxPortalToken } from "./fx_token";

export class ERC20 extends FxPortalToken {
    constructor(
        tokenAddress: string,
        isParent: boolean,
        client: Web3SideChainClient,
        rootChainManager: RootChainManager,
        exitManager: ExitManager
    ) {
        super({
            isParent,
            tokenAddress,
            abi: client.getABI('ChildERC20', 'pos')
        }, client, rootChainManager, exitManager);
    }

    getBalance(userAddress: string, option?: ITransactionOption) {
        const contract = this.contract;
        const method = contract.method(
            "balanceOf",
            userAddress
        );
        return this.processRead<string>(method, option);
    }
}