const { getFxPortalClient } = require('../utils')
const config = require('../config')

const token = config.child.erc20_token
const amountToBurn = '500000000000000000' // amount in wei
async function execute () {
  // initiate fxClient
  const fxClient = await getFxPortalClient()
  const erc20Token = fxClient.erc20(token, false)

  // execute transaction
  const txResult = await erc20Token.withdrawToStart(amountToBurn, config.user1.address)
  const txHash = await txResult.getTransactionHash()
  console.log('Transaction Hash:', txHash)
}

execute().then(() => {
}).catch(err => {
  console.log('err', err)
}).finally(_ => {
  process.exit(0)
})
