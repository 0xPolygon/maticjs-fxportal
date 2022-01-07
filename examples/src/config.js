const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
  path: path.join(__dirname, '/..', '.env')
})

module.exports = {
  parent: {
    rpc: process.env.ROOT_RPC,
    erc20_token: '0x655f2166b0709cd575202630952d71e2bb0d61af'
  },
  child: {
    rpc: process.env.MATIC_RPC || 'https://rpc-mumbai.matic.today',
    erc20_token: '0xac2957ad802962f8c1bc9a2cd3920383e7b0fcb2'
  },
  user1: {
    privateKey: process.env.USER1_PRIVATE_KEY,
    address: process.env.USER1_ADDRESS
  },
  user2: {
    privateKey: process.env.USER2_PRIVATE_KEY,
    address: process.env.USER2_ADDRESS
  }
}
