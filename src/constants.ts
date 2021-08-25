import { BaseWeb3Client } from "@maticnetwork/maticjs";

export let Web3Client: typeof BaseWeb3Client;

export const setWeb3Client = (web3Client) => {
    Web3Client = web3Client;
}