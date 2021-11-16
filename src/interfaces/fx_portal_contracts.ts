import { ExitUtil } from "@maticnetwork/maticjs";
import { ChildTunnel, RootTunnel } from "../contracts";

export interface IFxPortalContracts {
    exitUtil: ExitUtil;
    rootTunnel: RootTunnel;
    childTunnel: ChildTunnel;
}
