import { ERC20 } from "../erc20";
import { IFxPortalClientConfig } from "../interfaces";
import { Web3SideChainClient, ExitManager, RootChain, RootChainManager } from "@maticnetwork/maticjs";

export class FxPortalClient {
    rootChain: RootChain;
    private client_: Web3SideChainClient;

    exitManager: ExitManager;
    rootChainManager: RootChainManager;

    constructor(config: IFxPortalClientConfig) {
        const mainPOSContracts = this.client_.mainPOSContracts;

        config = Object.assign(
            {

                rootChainManager: mainPOSContracts.RootChainManagerProxy,
                rootChain: this.client_.mainPlasmaContracts.RootChainProxy
            } as IFxPortalClientConfig,
            config
        );

        this.client_ = new Web3SideChainClient(config);

        this.rootChainManager = new RootChainManager(
            this.client_,
            config.rootChainManager,
        );

        this.rootChain = new RootChain(
            this.client_,
            config.rootChain,
        );

        this.exitManager = new ExitManager(
            this.client_.child.client,
            this.rootChain,
            config.requestConcurrency
        );

        this.client_.logger.enableLog(config.log);
    }

    /**
     * get erc20 token instance
     *
     * @param {string} tokenAddress
     * @param {boolean} [isParent]
     * @returns
     * @memberof FxPortalClient
     */
    erc20(tokenAddress: string, isParent?: boolean) {
        return new ERC20(
            tokenAddress,
            isParent,
            this.client_,
            this.rootChainManager,
            this.exitManager
        );
    }

    /**
    * check whether a txHash is checkPointed 
    *
    * @param {string} txHash
    * @returns
    * @memberof POSClient
    */
    isCheckPointed(txHash: string) {
        return this.exitManager.isCheckPointed(
            txHash
        );
    }
}