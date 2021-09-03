export * from "./plugin";

import { ERC20 } from "./erc20";
import { IFxPortalClientConfig } from "./interfaces";
import { Web3SideChainClient, initService, ExitManager, RootChain, RootChainManager } from "@maticnetwork/maticjs";

export class FxPortalClient {
    rootChain: RootChain;
    private client_: Web3SideChainClient;

    exitManager: ExitManager;
    rootChainManager: RootChainManager;

    private config_: IFxPortalClientConfig;

    constructor(config: IFxPortalClientConfig) {
        this.config_ = config;
    }

    async init() {
        const config = this.config_;
        this.client_ = new Web3SideChainClient(config);
        const mainPOSContracts = this.client_.mainPOSContracts;
        const mainFxPortalContracts = this.client_.metaNetwork.Main.FxPortalContracts;
        const childFxPortalContracts = this.client_.metaNetwork.Matic.FxPortalContracts;

        Object.assign(
            config,
            {
                // rootTunnel: 
                erc20: {
                    rootTunnel: mainFxPortalContracts.FxERC20RootTunnel,
                    childTunnel: childFxPortalContracts.FxERC20ChildTunnel
                },
                rootChainManager: mainPOSContracts.RootChainManagerProxy,
                rootChain: this.client_.mainPlasmaContracts.RootChainProxy
            } as IFxPortalClientConfig
        );

        this.rootChainManager = new RootChainManager(
            this.client_,
            config.rootChainManager,
        );

        this.rootChain = new RootChain(
            this.client_,
            config.rootChain,
        );

        this.exitManager = new ExitManager(
            this.client_.child,
            this.rootChain,
            config.requestConcurrency
        );

        this.client_.logger.enableLog(config.log);

        initService(this.client_.metaNetwork.Matic.NetworkAPI);

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
            {
                tokenAddress,
                isParent,
            },
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
     * @memberof FxPortalClient
     */
    isCheckPointed(txHash: string) {
        return this.exitManager.isCheckPointed(
            txHash
        );
    }
}