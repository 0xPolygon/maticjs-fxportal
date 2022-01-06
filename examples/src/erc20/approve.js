const { getFxPortalClient } = require('../utils')
const config = require('../config')

const token = config.parent.erc20_token
const amountToApprove = '10000000000000000000' // amount in wei
async function execute () {
  // initiate fxClient
  const fxClient = await getFxPortalClient()
  const erc20Token = fxClient.erc20(token, true)

  // execute transaction
  const txResult = await erc20Token.approve(amountToApprove)
  const txHash = await txResult.getTransactionHash()
  console.log('Transaction Hash:', txHash)
}

execute().then(() => {
}).catch(err => {
  console.log('err', err)
}).finally(_ => {
  process.exit(0)
})
