import { ExitManager } from "@maticnetwork/maticjs";
import { RootTunnel } from "../contracts";

export interface IFxPortalContracts {
    exitManager: ExitManager;
    rootTunnel: RootTunnel;
    childTunnel: RootTunnel;
}