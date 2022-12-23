import { ERC20 } from "./erc20";
import { IFxPortalClientConfig, IFxPortalContracts } from "./interfaces";
import { ExitUtil, RootChain, BridgeClient } from "@maticnetwork/maticjs";
import { ChildTunnel, RootTunnel } from "./contracts";
import { Erc721 } from "./erc721";

export class FxPortalClient extends BridgeClient<IFxPortalClientConfig> {
    rootChain: RootChain;

    exitUtil: ExitUtil;

    rootTunnel: RootTunnel;
    childTunnel: ChildTunnel;

    async init(config: IFxPortalClientConfig) {
        const client = this.client;

        return client.init(config).then(_ => {
            const mainFxPortalContracts = client.abiManager.getConfig(
                "Main.FxPortalContracts"
            );
            const childFxPortalContracts = client.abiManager.getConfig(
                "Matic.FxPortalContracts"
            );

            config = Object.assign(
                {
                    // rootTunnel: 
                    erc20: {
                        rootTunnel: mainFxPortalContracts.FxERC20RootTunnel,
                        childTunnel: childFxPortalContracts.FxERC20ChildTunnel
                    },
                    rootChain: client.mainPlasmaContracts.RootChainProxy
                } as IFxPortalClientConfig,
                config
            );

            this.rootChain = new RootChain(
                client,
                config.rootChain,
            );

            this.exitUtil = new ExitUtil(
                client,
                this.rootChain,
            );

            this.rootTunnel = new RootTunnel(
                client,
                config.erc20.rootTunnel,
            );

            this.childTunnel = new ChildTunnel(
                client,
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
            this.client,
            this.getContracts_.bind(this)
        );
    }

    /**
     * get erc721 token instance
     *
     * @param {string} tokenAddress
     * @param {boolean} [isParent]
     * @return {*} 
     * @memberof FxPortalClient
     */
    erc721(tokenAddress: string, isParent?: boolean) {
        return new Erc721(
            {
                tokenAddress,
                isParent,
            },
            this.client,
            this.getContracts_.bind(this)
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
        return this.exitUtil.isCheckPointed(
            txHash
        );
    }

    private getContracts_() {
        return {
            exitUtil: this.exitUtil,
            childTunnel: this.childTunnel,
            rootTunnel: this.rootTunnel
        } as IFxPortalContracts;
    }
}
