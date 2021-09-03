// Testnet V3 config
module.exports = {
    rpc: {
        parent: '',
        child: 'https://rpc-mumbai.matic.today', // This is the MATIC testnet RPC
    },
    fx_portal: {
        parent: {
            // erc20: '0xe9c7873f81c815d64c71c2233462cb175e4765b3',
            erc20: '0x655f2166b0709cd575202630952d71e2bb0d61af',
        },
        child: {
            erc20: '0xDDE69724AeFBdb084413719fE745aB66e3b055C7',
        },
    },
    user1: {
        "privateKey": "",
        "address": ""
    },
    user2: {
        address: '<paste address here>', // Your address
    },
}
