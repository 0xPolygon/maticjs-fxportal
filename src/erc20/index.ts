import { Web3SideChainClient, ERROR_TYPE, ExitManager, ITransactionOption, Converter, TYPE_AMOUNT, MAX_AMOUNT, BaseContract } from "@maticnetwork/maticjs";
import { FxPortalToken } from "../common";
import { LOG_EVENT_SIGNATURE } from "../enums";
import { IFxPortalClientConfig } from "../interfaces";


export class ERC20 extends FxPortalToken {

    private rootTunnel_: BaseContract;
    private childTunnel_: BaseContract;

    constructor(
        {
            tokenAddress,
            isParent
        },
        client: Web3SideChainClient,
        exitManager: ExitManager
    ) {
        super({
            isParent,
            tokenAddress,
            abi: client.getABI('ChildERC20', 'pos')
        }, client, exitManager);
    }

    get rootTunnel() {
        if (!this.rootTunnel_) {
            this.rootTunnel_ = this.client.parent.getContract(
                (this.client.config as IFxPortalClientConfig).erc20.rootTunnel,
                this.client.getABI("FxERC20RootTunnel", "fx-portal")
            );
        }
        return this.rootTunnel_;
    }

    get childTunnel() {
        if (!this.childTunnel_) {
            this.childTunnel_ = this.client.child.getContract(
                (this.client.config as IFxPortalClientConfig).erc20.childTunnel,
                this.client.getABI("FxERC20ChildTunnel", "fx-portal")
            );
        }
        return this.childTunnel_;
    }

    get rootTunnelAddress() {
        return this.rootTunnel_.address;
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
        const contract = this.contract;
        const method = contract.method(
            "balanceOf",
            userAddress
        );
        return this.processRead<string>(method, option);
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

        const contract = this.contract;
        const rootTunnelcontract = this.rootTunnel;

        const method = contract.method(
            "approve",
            this.rootTunnelAddress,
            Converter.toUint256(amount)
        );
        return this.processWrite(method, option);
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

        const contract = this.contract;
        // call rootTunnel
        this.rootTunnel;
        const method = contract.method(
            "allowance",
            userAddress,
            this.rootTunnelAddress
        );
        return this.processRead<string>(method, option);
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

        const contract = this.rootTunnel;

        const method = contract.method(
            "deposit",
            this.contractParam.tokenAddress,
            userAddress,
            Converter.toUint256(amount),
            "0x"
        );
        return this.processWrite(method, option);
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

        const contract = this.rootTunnel;
        const method = contract.method(
            "mapToken",
            this.contractParam.tokenAddress
        )
        return this.processWrite(method, option);
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

        const contract = this.childTunnel;
        const method = contract.method(
            "withdraw",
            this.contractParam.tokenAddress,
            Converter.toUint256(amount)
        );
        return this.processWrite(method, option);
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
        if (!this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.AllowedOnRoot, "withdrawExit").throw();
        }

        return this.exitManager.buildPayloadForExit(
            burnTransactionHash,
            LOG_EVENT_SIGNATURE.Erc20Transfer,
            false
        ).then(payload => {
            const contract = this.rootTunnel;
            const method = contract.method("receiveMessage", payload)
            return this.processWrite(method, option);
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
        if (!this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.AllowedOnRoot, "withdrawExit").throw();
        }

        return this.exitManager.buildPayloadForExit(
            burnTransactionHash,
            LOG_EVENT_SIGNATURE.Erc20Transfer,
            true
        ).then(payload => {
            const contract = this.rootTunnel;
            const method = contract.method("receiveMessage", payload)
            return this.processWrite(method, option);
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
    isWithdrawExited(txHash: string) {
        if (!txHash) {
            throw new Error(`txHash not provided`);
        }
        return this.exitManager.getExitHash(
            txHash, LOG_EVENT_SIGNATURE.Erc20Transfer
        ).then(exitHash => {
            this.rootTunnel;
            const method = this.rootTunnel.method("processedExits", exitHash)
            return this.processRead<boolean>(method);
        });
    }

}