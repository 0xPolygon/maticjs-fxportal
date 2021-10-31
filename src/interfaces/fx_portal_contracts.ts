import { ExitUtil } from "@maticnetwork/maticjs";
import { RootTunnel } from "../contracts";

export interface IFxPortalContracts {
    exitUtil: ExitUtil;
    rootTunnel: RootTunnel;
    childTunnel: RootTunnel;
}
