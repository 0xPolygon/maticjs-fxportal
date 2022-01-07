const { getFxPortalClient } = require('../utils')
const config = require('../config')

const token = config.parent.erc20_token
const burnTxHash = '0x14b5a6169dd633603a7721e9f92b888d1c209e460e4301fc12f196ae44bb6e04'

async function execute () {
  // initiate fxClient
  const fxClient = await getFxPortalClient()
  const erc20Token = fxClient.erc20(token, true)

  // execute transaction
  // Proof API must be set to use withdrawExitFaster()
  const txResult = await erc20Token.withdrawExitFaster(burnTxHash)
  const txHash = await txResult.getTransactionHash()
  console.log('Transaction Hash:', txHash)
}

execute().then(() => {
}).catch(err => {
  console.log('err', err)
}).finally(_ => {
  process.exit(0)
})
