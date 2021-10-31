import { BaseToken, IContractInitParam, Web3SideChainClient } from "@maticnetwork/maticjs";
import { IFxPortalClientConfig, IFxPortalContracts } from "../interfaces";

export class FxPortalToken extends BaseToken<IFxPortalClientConfig> {

    constructor(
        contractParam: IContractInitParam,
        client: Web3SideChainClient<IFxPortalClientConfig>,
        protected getHelperContracts: () => IFxPortalContracts
    ) {
        super(contractParam, client);
    }


    protected get rootTunnel() {
        return this.getHelperContracts().rootTunnel;
    }

    protected get exitUtil() {
        return this.getHelperContracts().exitUtil;
    }


}
