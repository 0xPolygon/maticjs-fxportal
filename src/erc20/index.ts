import { Web3SideChainClient, RootChainManager, ExitManager, ITransactionOption, Converter, TYPE_AMOUNT, MAX_AMOUNT } from "@maticnetwork/maticjs";
import { FxPortalToken } from "../common";
import { ERC20RootTunnel } from "./root_tunnel";
import { LOG_EVENT_SIGNATURE } from "../enums";

export class ERC20 extends FxPortalToken {

    rootTunnelAddress: string;

    rootTunnel = new ERC20RootTunnel(
        this.client.parent.client, "", ""
    )

    constructor(
        tokenAddress: string,
        isParent: boolean,
        client: Web3SideChainClient,
        rootChainManager: RootChainManager,
        exitManager: ExitManager
    ) {
        super({
            isParent,
            tokenAddress,
            abi: client.getABI('ChildERC20', 'pos')
        }, client, rootChainManager, exitManager);
    }

    getBalance(userAddress: string, option?: ITransactionOption) {
        const contract = this.contract;
        const method = contract.method(
            "balanceOf",
            userAddress
        );
        return this.processRead<string>(method, option);
    }

    approve(amount: TYPE_AMOUNT, option?: ITransactionOption) {
        const contract = this.contract;

        const method = contract.method(
            "approve",
            this.rootTunnelAddress,
            Converter.toUint256(amount)
        );
        return this.processWrite(method, option);
    }

    approveMax(option?: ITransactionOption) {
        return this.approve(
            MAX_AMOUNT
            , option
        )
    }

    getAllowance(userAddress: string, option?: ITransactionOption) {
        const contract = this.contract;

        const method = contract.method(
            "allowance",
            userAddress,
            this.rootTunnelAddress
        );
        return this.processRead<number>(method, option);
    }

    deposit(amount: TYPE_AMOUNT, userAddress: string, option?: ITransactionOption) {
        const contract = this.rootTunnel.contract;

        const method = contract.method(
            "deposit",
            this.contractParam.tokenAddress,
            userAddress,
            Converter.toUint256(amount)
        );
        return this.processWrite(method, option);
    }

    mapChild(option?: ITransactionOption) {
        const contract = this.rootTunnel.contract;
        const method = contract.method(
            "mapToken",
            this.contractParam.tokenAddress
        )
        return this.processWrite(method, option);
    }

    withdrawStart(amount: TYPE_AMOUNT, option?: ITransactionOption) {
        const contract = this.contract;
        const method = contract.method(
            "withdraw",
            this.contractParam.tokenAddress,
            Converter.toUint256(amount)
        );
        return this.processWrite(method, option);
    }

    withdrawExit(burnTransactionHash: string, option?: ITransactionOption) {
        return this.exitManager.buildPayloadForExit(
            burnTransactionHash,
            LOG_EVENT_SIGNATURE.Erc20Transfer,
            false
        ).then(payload => {
            return this.rootChainManager.exit(
                payload, option
            );
        });
    }

    /**
     * complete withdraw process after checkpoint has been submitted for the block containing burn tx.
     * 
     *  Note:- It create the proof in api call for fast exit.
     * 
     * @param {string} burnTransactionHash
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    withdrawExitFaster(burnTransactionHash: string, option?: ITransactionOption) {
        return this.exitManager.buildPayloadForExit(
            burnTransactionHash,
            LOG_EVENT_SIGNATURE.Erc20Transfer,
            true
        ).then(payload => {
            return this.rootChainManager.exit(
                payload, option
            );
        });
    }

    /**
     *  check if exit has been completed for a transaction hash
     *  
     *
     * @param {string} txHash
     * @returns
     * @memberof ERC20
     */
    isExited(txHash: string) {
        if (!txHash) {
            throw new Error(`txHash not provided`);
        }
        return this.exitManager.getExitHash(
            txHash, LOG_EVENT_SIGNATURE.Erc20Transfer
        ).then(exitHash => {
            return this.rootChainManager.isExitProcessed(
                exitHash
            );
        });
    }

}