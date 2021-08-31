import { BaseContract, BaseWeb3Client } from "@maticnetwork/maticjs";

export class ERC20Tunnel {
    contract: BaseContract;

    constructor(private client_: BaseWeb3Client, address: string, abi) {
        this.contract = this.client_.getContract(
            address,
            abi
        );
    }

    get address() {
        return this.contract.address;
    }
}