import { IPlugin } from "@maticnetwork/maticjs";
import { setWeb3Client } from "./constants";

export class FxPortalPlugin implements IPlugin {
    setup(matic) {
        setWeb3Client(matic.Web3Client);
    }
}