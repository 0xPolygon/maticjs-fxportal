// Testnet V3 config
module.exports = {
    rpc: {
        parent: process.env.ROOT_RPC,
        child: process.env.MATIC_RPC || 'https://rpc-mumbai.matic.today',
    },
    fx_portal: {
        parent: {
            // erc20: '0xe9c7873f81c815d64c71c2233462cb175e4765b3',
            erc20: '0x655f2166b0709cd575202630952d71e2bb0d61af',
        },
        child: {
            // erc20: '0xDDE69724AeFBdb084413719fE745aB66e3b055C7',
            // erc20: '0xd155Cc119E2760e065445031046cd841C919283E',
            erc20: '0xAc2957AD802962f8C1bC9A2cD3920383e7B0Fcb2',
        },
    },
    user1: {
        "privateKey": process.env.USER1_PRIVATE_KEY,
        "address": process.env.USER1_FROM
    },
    user2: {
        address: process.env.USER2_FROM, // Your address
        "privateKey": process.env.USER2_PRIVATE_KEY,
    },
}
