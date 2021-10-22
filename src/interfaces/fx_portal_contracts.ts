import { ExitUtil } from "@maticnetwork/maticjs";
import { RootTunnel } from "../contracts";

export interface IFxPortalContracts {
    exitManager: ExitUtil;
    rootTunnel: RootTunnel;
    childTunnel: RootTunnel;
}
