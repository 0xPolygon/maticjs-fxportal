import { Web3SideChainClient, ERROR_TYPE, ITransactionOption, Converter, TYPE_AMOUNT, MAX_AMOUNT, BaseContract } from "@maticnetwork/maticjs";
import { FxPortalToken } from "../common";
import { LOG_EVENT_SIGNATURE } from "../enums";
import { IFxPortalClientConfig, IFxPortalContracts } from "../interfaces";

export class ERC20 extends FxPortalToken {

    constructor(
        {
            tokenAddress,
            isParent
        },
        client: Web3SideChainClient<IFxPortalClientConfig>,
        contracts: IFxPortalContracts
    ) {
        super({
            isParent,
            address: tokenAddress,
            name: 'ChildERC20',
            bridgeType: 'pos'
        }, client, contracts);
    }

    /**
     * get balance by user address
     *
     * @param {string} userAddress
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    getBalance(userAddress: string, option?: ITransactionOption) {
        return this.getContract().then(contract => {
            const method = contract.method(
                "balanceOf",
                userAddress
            );
            return this.processRead<string>(method, option);
        });
    }

    /**
     * approve required amount
     *
     * @param {TYPE_AMOUNT} amount
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    approve(amount: TYPE_AMOUNT, option?: ITransactionOption) {
        if (!this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.AllowedOnRoot, "approve").throw();
        }

        return this.getContract().then(contract => {
            const method = contract.method(
                "approve",
                this.contracts.rootTunnel.address,
                Converter.toHex(amount)
            );
            return this.processWrite(method, option);
        });
    }

    /**
     * approve max amount
     *
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    approveMax(option?: ITransactionOption) {
        return this.approve(
            MAX_AMOUNT
            , option
        )
    }

    /**
     * get allowance 
     *
     * @param {string} userAddress
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    getAllowance(userAddress: string, option?: ITransactionOption) {
        if (!this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.AllowedOnRoot, "getAllowance").throw();
        }

        return this.getContract().then(contract => {
            const method = contract.method(
                "allowance",
                userAddress,
                this.contracts.rootTunnel.address
            );
            return this.processRead<string>(method, option);
        });
    }

    /**
     * deposit required amount from ethereum to polygon
     *
     * @param {TYPE_AMOUNT} amount
     * @param {string} userAddress
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    deposit(amount: TYPE_AMOUNT, userAddress: string, option?: ITransactionOption) {
        if (!this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.AllowedOnRoot, "deposit").throw();
        }

        return this.contracts.rootTunnel.getContract().then(contract => {
            const method = contract.method(
                "deposit",
                this.contractParam.address,
                userAddress,
                Converter.toHex(amount),
                "0x"
            );
            return this.processWrite(method, option);
        });
    }

    /**
     *  deploy the corresponding child token and map it to the root token
     *
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    mapChild(option?: ITransactionOption) {
        if (!this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.AllowedOnRoot, "mapChild").throw();
        }

        return this.contracts.rootTunnel.getContract().then(contract => {
            const method = contract.method(
                "mapToken",
                this.contractParam.address
            )
            return this.processWrite(method, option);
        });

    }

    /**
     * start withdraw process by burning required amount
     *
     * @param {TYPE_AMOUNT} amount
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    withdrawStart(amount: TYPE_AMOUNT, option?: ITransactionOption) {
        if (this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.AllowedOnChild, "withdrawStart").throw();
        }

        return this.contracts.childTunnel.getContract().then(contract => {
            const method = contract.method(
                "withdraw",
                this.contractParam.address,
                Converter.toHex(amount)
            );
            return this.processWrite(method, option);
        });

    }

    private withdrawExit_(burnTransactionHash: string, isFast: boolean, option?: ITransactionOption) {
        if (!this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.AllowedOnRoot, "withdrawExit").throw();
        }

        return Promise.all([
            this.contracts.exitManager.buildPayloadForExit(
                burnTransactionHash,
                LOG_EVENT_SIGNATURE.Erc20Transfer,
                isFast
            ),
            this.contracts.rootTunnel.getContract()
        ]).then(result => {
            const [payload, contract] = result;
            const method = contract.method("receiveMessage", payload)
            return this.processWrite(method, option);
        });
    }

    /**
     * complete withdraw process after checkpoint has been submitted for the block containing burn tx.
     *
     * @param {string} burnTransactionHash
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    withdrawExit(burnTransactionHash: string, option?: ITransactionOption) {
        return this.withdrawExit_(
            burnTransactionHash,
            false,
            option
        )
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
        return this.withdrawExit_(
            burnTransactionHash,
            true,
            option
        )
    }

    /**
     *  check if exit has been completed for a transaction hash
     *  
     *
     * @param {string} txHash
     * @returns
     * @memberof ERC20
     */
    isWithdrawExited(txHash: string) {
        if (!txHash) {
            throw new Error(`txHash not provided`);
        }
        return Promise.all([
            this.contracts.exitManager.getExitHash(
                txHash, LOG_EVENT_SIGNATURE.Erc20Transfer
            ),
            this.contracts.rootTunnel.getContract()
        ]).then(result => {
            const [exitHash, rootTunnel] = result;
            const method = rootTunnel.method("processedExits", exitHash)
            return this.processRead<boolean>(method);
        });
    }

}