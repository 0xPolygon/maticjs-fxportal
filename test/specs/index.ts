import { use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
import { FxPortalPlugin } from "@maticnetwork/maticjs-fxportal";

use(Web3ClientPlugin);
use(FxPortalPlugin);

console.log('process.env.NODE_ENV', process.env.NODE_ENV);


import './erc20.spec'
// import './erc721.spec'
// import './pos_client.spec'
