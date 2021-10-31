import { use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
import { FxPortalPlugin } from "@maticnetwork/maticjs-fxportal";

use(Web3ClientPlugin);
use(FxPortalPlugin);

import './erc20.spec'
// import './erc721.spec'
// import './pos_client.spec'
