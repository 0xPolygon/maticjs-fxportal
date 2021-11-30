import { IBaseClientConfig } from "@maticnetwork/maticjs";

export interface IFxPortalClientConfig extends IBaseClientConfig {
    rootChain?: string;
    erc20?: {
        rootTunnel?: string;
        childTunnel?: string;
    };
}
