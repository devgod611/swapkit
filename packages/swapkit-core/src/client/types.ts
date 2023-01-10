import { QuoteRoute } from '@thorswap-lib/cross-chain-api-sdk/lib/entities';
import { AssetAmount, Percent, Pool } from '@thorswap-lib/swapkit-entities';
import { ApproveParams, IsApprovedParams } from '@thorswap-lib/toolbox-evm';
import {
  AmountWithBaseDenom,
  Asset,
  Asset as AssetType,
  Balance,
  CallParams,
  Chain,
  DepositParams,
  EIP1559TxParams,
  FeeOption,
  TxHash,
  TxHistoryParams,
  WalletOption,
  WalletTxParams,
} from '@thorswap-lib/types';

export type { TransactionDetails } from '@thorswap-lib/cross-chain-api-sdk';
export type {
  Calldata,
  CalldataSwapIn,
  CalldataSwapOut,
  CalldataTcToTc,
  Provider,
  Quote,
  QuoteMeta,
  QuoteRoute,
  QuoteSwap,
  Token,
  TokenList,
} from '@thorswap-lib/cross-chain-api-sdk/lib/entities';

export type TxParams = {
  assetAmount: AssetAmount;
  recipient: string;
  memo?: string;
  feeOptionKey?: FeeOption;
  feeRate?: number;
  data?: string;
  from?: string;
};

export type AddLiquidityParams = {
  pool: Pool;
  isPendingSymmAsset?: boolean;
  runeAmount?: AssetAmount;
  assetAmount?: AssetAmount;
  runeAddr?: string;
  assetAddr?: string;
};

export type CreateLiquidityParams = {
  runeAmount: AssetAmount;
  assetAmount: AssetAmount;
};

export type AddLiquidityTxns = {
  runeTx?: TxHash;
  assetTx?: TxHash;
};

type LPType = 'sym' | 'rune' | 'asset';
export type WithdrawParams = {
  pool: Pool;
  percent: Percent;
  from: LPType;
  to: LPType;
};

export type UpgradeParams = {
  runeAmount: AssetAmount;
  recipient: string;
};

export type ChainWallet = {
  address: string;
  balance: AssetAmount[];
  walletType: WalletOption;
};

type ParamsWithChain<T> = T & { chain: Chain };
export type AddChainWalletParams = ParamsWithChain<{
  wallet: ChainWallet;
  walletMethods: WalletMethods;
}>;

export type Wallet = Record<Chain, ChainWallet | null>;

export enum QuoteMode {
  TC_SUPPORTED_TO_TC_SUPPORTED = 'TC-TC',
  ETH_TO_TC_SUPPORTED = 'ERC20-TC',
  TC_SUPPORTED_TO_ETH = 'TC-ERC20',
  ETH_TO_ETH = 'ERC20-ERC20',
  AVAX_TO_AVAX = 'ARC20-ARC20',
  AVAX_TO_TC_SUPPORTED = 'ARC20-TC',
  TC_SUPPORTED_TO_AVAX = 'TC-ARC20',
  AVAX_TO_ETH = 'ARC20-ERC20',
  ETH_TO_AVAX = 'ERC20-ARC20',
  UNSUPPORTED_QUOTE = 'UNSUPPORTED',
}

export type FeeRate = number;
export type FeeRates = Record<FeeOption, FeeRate>;

export enum FeeType {
  FlatFee = 'base',
  PerByte = 'byte',
}

export type LegacyFees = Record<FeeOption, AmountWithBaseDenom> & {
  type: FeeType;
};

/**
 * v1
 */

export type WalletMethods = {
  approve: (params: ApproveParams) => Promise<TxHash>;
  call: (callParams: CallParams) => any;
  deposit: (params: DepositParams) => Promise<TxHash>;
  estimateFeesWithGasPricesAndLimits: (params?: WalletTxParams) => any;
  estimateGasLimit: () => any;
  estimateGasPrices: () => any;
  getBalance: (address: string, filterAssets?: Asset[] | undefined) => Promise<Balance[]>;
  getFeeData: () => any;
  getFees: (params?: { asset: AssetType; amount: AmountWithBaseDenom; recipient: string }) => any;
  getTransactionData: (txHash: string, address: string) => any;
  getTransactions: (params?: TxHistoryParams) => any;
  isApproved?: (params: IsApprovedParams) => Promise<boolean>;
  sendTransaction?: (tx: EIP1559TxParams, feeOptionKey: FeeOption) => Promise<string>;
  transfer: (params: WalletTxParams) => Promise<TxHash>;
  validateAddress: (address: string) => boolean;
};

type ConnectMethodNames =
  | 'connectXDEFI'
  | 'connectKeplr'
  | 'connectWalletconnect'
  | 'connectKeystore'
  | 'connectLedger'
  | 'connectEVMWallet';

type ConnectConfig = {
  stagenet?: boolean;
  /**
   * @required for AVAX & BSC
   */
  covalentApiKey?: string;
  /**
   * @required for ETH
   */
  ethplorerApiKey?: string;
  /**
   * @required for BTC, LTC, DOGE & BCH
   */
  utxoApiKey?: string;
};

export type ExtendParams = {
  excludedChains?: Chain[];
  config?: ConnectConfig;
  wallets: {
    connectMethodName: ConnectMethodNames;
    connect: (params: {
      addChain: (params: AddChainWalletParams) => void;
      config: ConnectConfig;
    }) => (...params: any) => Promise<any>;
  }[];
};

export type SwapParams = {
  quoteMode: QuoteMode;
  recipient: string;
  route: QuoteRoute;
  feeOptionKey: FeeOption;
};
