const { use, setProofApi } = require('@maticnetwork/maticjs')
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3')
const { FxPortalClient } = require('@fxportal/maticjs-fxportal')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const config = require('./config')

use(Web3ClientPlugin)

// To use withdrawExitFaster(), set the proof api
// Once set, the proof api will be used globally for faster exits.
setProofApi('https://apis.matic.network/')

async function getFxPortalClient (network = 'testnet', version = 'mumbai') {
  try {
    const fxPortalClient = new FxPortalClient()
    return await fxPortalClient.init({
      network: network,
      version: version,
      parent: {
        provider: new HDWalletProvider(config.user1.privateKey, config.parent.rpc),
        defaultConfig: {
          from: config.user1.address
        }
      },
      child: {
        provider: new HDWalletProvider(config.user2.privateKey, config.child.rpc),
        defaultConfig: {
          from: config.user2.address
        }
      }
    })
  } catch (error) {
    console.log('error unable to initiate fxPortalClient', error)
  }
}

module.exports = {
  getFxPortalClient: getFxPortalClient
}
