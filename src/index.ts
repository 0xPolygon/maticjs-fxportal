export * from "./plugin";

import { ERC20 } from "./erc20";
import { IFxPortalClientConfig, IFxPortalContracts } from "./interfaces";
import { Web3SideChainClient, ExitManager, RootChain } from "@maticnetwork/maticjs";
import { ChildTunnel, RootTunnel } from "./contracts";

export class FxPortalClient {
    rootChain: RootChain;
    private client_: Web3SideChainClient;

    exitManager: ExitManager;

    private config_: IFxPortalClientConfig;

    rootTunnel: RootTunnel;
    childTunnel: ChildTunnel;

    constructor(config: IFxPortalClientConfig) {
        this.config_ = config;
        this.client_ = new Web3SideChainClient(config);
        this.client_.logger.enableLog(config.log);
    }

    async init() {
        let config = this.config_;
        const client = this.client_;

        return client.init().then(_ => {
            const mainFxPortalContracts = client.abiHelper.getAddress("Main.FxPortalContracts");
            const childFxPortalContracts = client.abiHelper.getAddress("Matic.FxPortalContracts");

            config = Object.assign(
                config,
                {
                    // rootTunnel: 
                    erc20: {
                        rootTunnel: mainFxPortalContracts.FxERC20RootTunnel,
                        childTunnel: childFxPortalContracts.FxERC20ChildTunnel
                    },
                    rootChain: this.client_.mainPlasmaContracts.RootChainProxy
                } as IFxPortalClientConfig
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

            this.rootTunnel = new RootTunnel(
                this.client_,
                config.erc20.rootTunnel,
            );

            this.childTunnel = new ChildTunnel(
                this.client_,
                config.erc20.childTunnel,
            );


            return this;
        });
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
            this.getContracts_()
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

    private getContracts_() {
        return {
            exitManager: this.exitManager,
            childTunnel: this.childTunnel,
            rootTunnel: this.rootTunnel
        } as IFxPortalContracts;
    }
}