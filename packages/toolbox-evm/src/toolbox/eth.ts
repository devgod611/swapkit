import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { Web3Provider } from '@ethersproject/providers';
import { baseAmount } from '@thorswap-lib/helpers';
import { AssetEntity, getSignatureAssetFor } from '@thorswap-lib/swapkit-entities';
import { Address, BaseDecimal, Chain } from '@thorswap-lib/types';

import { EthereumApi } from '../api/eth/EthereumHybridApi.js';

import { BaseEVMToolbox } from './BaseEVMToolbox.js';

export const getBalance = async (
  provider: Provider,
  api: EthereumApi,
  address: Address,
  assets?: AssetEntity[],
) => {
  const tokenBalances = await api.getBalance({ address });

  if (assets) {
    return tokenBalances.filter(({ asset }) =>
      assets.find(({ chain, symbol }) => chain === asset.chain && symbol === asset.symbol),
    );
  } else {
    const evmGasTokenBalance = await provider.getBalance(address);
    return [
      {
        asset: getSignatureAssetFor(Chain.Ethereum),
        amount: baseAmount(evmGasTokenBalance, BaseDecimal.ETH),
      },
      ...tokenBalances,
    ];
  }
};

export const ETHToolbox = ({
  ethplorerApiKey,
  signer,
  provider,
}: {
  ethplorerApiKey: string;
  signer?: Signer;
  provider: Provider | Web3Provider;
}) => {
  const api = new EthereumApi({ apiKey: ethplorerApiKey });

  return {
    ...BaseEVMToolbox({ signer, provider }),
    getBalance: (address: string, assets?: AssetEntity[]) =>
      getBalance(provider, api, address, assets),
  };
};
