import { ITransactionOption, Web3SideChainClient } from "@maticnetwork/maticjs";
import { FxPortalToken } from "../common";
import { IFxPortalClientConfig, IFxPortalContracts } from "../interfaces";

export class Erc721 extends FxPortalToken {
    constructor(
        {
            tokenAddress,
            isParent
        },
        client: Web3SideChainClient<IFxPortalClientConfig>,
        getHelperContracts: () => IFxPortalContracts
    ) {
        super({
            isParent,
            address: tokenAddress,
            name: isParent ? 'FxERC721RootTunnel' : 'FxERC721ChildTunnel',
            bridgeType: 'fx-portal'
        }, client, getHelperContracts);
    }

    private validateMany_(tokenIds) {
        if (tokenIds.length > 20) {
            throw new Error('can not process more than 20 tokens');
        }
        return tokenIds.map(tokenId => {
            return Converter.toHex(tokenId);
        });
    }

    /**
     * get tokens count for the user
     *
     * @param {string} userAddress
     * @param {ITransactionOption} [options]
     * @returns
     * @memberof ERC721
     */
    getTokensCount(userAddress: string, options?: ITransactionOption) {
        return this.getContract().then(contract => {
            const method = contract.method(
                "balanceOf",
                userAddress
            );
            return this.processRead<string>(method, options);
        }).then(count => {
            return Number(count);
        });
    }
}