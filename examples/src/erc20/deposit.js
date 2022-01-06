const { getFxPortalClient } = require('../utils')
const config = require('../config')

const token = config.parent.erc20_token
const amountToDeposit = '1000000000000000000' // amount in wei
async function execute () {
  // initiate fxClient
  const fxClient = await getFxPortalClient()
  const erc20Token = fxClient.erc20(token, true)

  // get current allowance
  const allowance = await erc20Token.getAllowance(config.user1.address)
  if (allowance < amountToDeposit) {
    console.log(`Allowance ${allowance} is less than amount to deposit of ${amountToDeposit}.`)
  } else {
    // execute transaction
    const txResult = await erc20Token.deposit(amountToDeposit, config.user2.address)
    const txHash = await txResult.getTransactionHash()
    console.log('Transaction Hash:', txHash)
  }
}

execute().then(() => {
}).catch(err => {
  console.log('err', err)
}).finally(_ => {
  process.exit(0)
})
