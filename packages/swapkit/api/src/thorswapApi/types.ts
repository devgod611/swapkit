import type { Chain, FeeOption, LedgerErrorCode, QuoteMode } from "@swapkit/helpers";

export type QuoteRouteV2 = {
  buyAsset: string;
  sellAsset: string;
  sellAmount: number;
  destinationAddress: string;
  sourceAddress: string;
  providers: string[];
};

export type SwapWithRouteParams = {
  recipient: string;
  route: QuoteRoute | QuoteRouteV2;
  feeOptionKey?: FeeOption;
  quoteId?: string;
  streamSwap?: boolean;
};

export type QuoteResponse = { quoteId: string; routes: QuoteRoute[] };

export type LoansParams = { address: string; asset: string };

export type LoansResponse = {
  owner: string;
  asset: string;
  debtIssued: string;
  debtRepaid: string;
  debtCurrent: string;
  collateralCurrent: string;
  collateralDeposited: string;
  collateralWithdrawn: string;
  lastOpenHeight: number;
  ltvPercentage: string;
};

export type LendingAssetItem = {
  asset: string;
  assetDepthAssetAmount: string;
  runeDepthAssetAmount: string;
  loanCr: string;
  loanStatus: "GREEN" | "YELLOW" | "RED";
  loanCollateral: string;
  derivedDepthPercentage: string;
  filledPercentage: string;
  lendingAvailable: boolean;
  ltvPercentage: string;
};

export type StreamingSwapDetails = {
  completed: number | null;
  total: number | null;
  refunded: number | null;
  progress: StreamingSwapProgressStatus[] | null;
};

export type TxTrackerLeg = {
  hash?: string;
  chain: Chain;
  provider?: string;
  txnType?: TransactionType;

  // transaction details
  fromAsset?: string;
  fromAssetImage?: string;
  toAsset?: string;
  toAssetImage?: string;
  fromAmount?: string;
  toAmount?: string;
  toAmountLimit?: string;
  startTimestamp?: number | null; // null before this leg has started
  updateTimestamp?: number | null; // timestamp of last update
  endTimestamp?: number | null; // null before this leg has ended
  estimatedEndTimestamp?: number | null; // null before this leg has started
  estimatedDuration?: number | null; // null before this leg has started
  status?: TxStatus;
  waitingFor?: string;
  streamingSwapDetails?: StreamingSwapDetails;
};

export type TxTrackerDetails = {
  quoteId: string;
  firstTransactionHash: string;
  currentLegIndex: number;
  legs: TxTrackerLeg[];
  status?: TxStatus;
  startTimestamp?: number | null;
  estimatedDuration?: number | null;
  isStreamingSwap?: boolean;
};

export type QuoteParams = {
  affiliateAddress?: string;
  affiliateBasisPoints?: string;
  buyAsset: string;
  isAffiliateFeeFlat?: string;
  recipientAddress?: string;
  sellAmount: string;
  sellAsset: string;
  senderAddress?: string;
  slippage: string;
};

export type QuoteRoute = {
  approvalTarget?: string;
  approvalToken?: string;
  calldata: Calldata;
  complete?: boolean;
  contract?: string;
  contractInfo: string;
  contractMethod?: string;
  estimatedTime: number;
  evmTransactionDetails?: EVMTransactionDetails;
  expectedOutput: string;
  expectedOutputMaxSlippage: string;
  expectedOutputMaxSlippageUSD: string;
  expectedOutputUSD: string;
  fees: {
    [key in Chain]: Array<{
      type: string;
      asset: string;
      networkFee: number;
      networkFeeUSD: number;
      affiliateFee: number;
      affiliateFeeUSD: number;
      totalFee: number;
      totalFeeUSD: number;
      isOutOfPocket: boolean;
      slipFee?: number;
      slipFeeUSD?: number;
    }>;
  };
  inboundAddress: string;
  index: number;
  isPreferred?: boolean;
  meta: Meta;
  optimal: boolean;
  path: string;
  providers: string[];
  subProviders: string[];
  swaps: {
    [key: string]: Array<
      Array<{
        from: string;
        to: string;
        toTokenAddress: string;
        parts: { provider: string; percentage: number }[];
      }>
    >;
  };
  targetAddress: string;
  timeEstimates?: TimeEstimates;
  transaction?: Todo;
  streamingSwap?: {
    estimatedTime: number;
    fees: QuoteRoute["fees"];
    expectedOutput: string;
    expectedOutputMaxSlippage: string;
    expectedOutputUSD: string;
    expectedOutputMaxSlippageUSD: string;
    savingsInAsset: string;
    savingsInUSD: string;
    maxQuantity: number;
    maxIntervalForMaxQuantity: number;
    transaction?: Todo;
  };
};

export type RepayParams = {
  repayAsset: string;
  collateralAsset: string;
  amountPercentage: string;
  senderAddress: string;
  collateralAddress: string;
  affiliateBasisPoints: string;
  affiliateAddress: string;
};

export type RepayStreamingSwap = {
  inboundAddress: string;
  outboundDelayBlocks: number;
  outboundDelaySeconds: number;
  fees: QuoteRoute["fees"];
  router: string;
  expiry: number;
  memo: string;
  expectedAmountOut: string;
  expectedCollateralWithdrawn: string;
  expectedDebtRepaid: string;
  repayAssetAmount: string;
  repayAssetAmountUSD: string;
  estimatedTime?: number;
};

export type RepayResponse = {
  inboundAddress: string;
  inboundConfirmationBlocks: number;
  inboundConfirmationSeconds: number;
  outboundDelayBlocks: number;
  outboundDelaySeconds: number;
  fees: { asset: string; liquidity: string; totalBps: number };
  expiry: number;
  warning?: string;
  notes?: string;
  dustThreshold: string;
  memo: string;
  expectedAmountOut: string;
  expectedCollateralWithdrawn: string;
  expectedDebtRepaid: string;
  collateralCurrent: string;
  repayAssetAmount: string;
  repayAssetAmountUSD: string;
  streamingSwap?: RepayStreamingSwap;
  estimatedTime?: number;
};

export type BorrowParams = {
  assetIn: string;
  assetOut: string;
  slippage: string;
  amount: string;
  senderAddress: string;
  recipientAddress: string;
};

export type BorrowCalldata = {
  amountIn: string;
  amountOutMin: string;
  fromAsset: string;
  memo: string;
  memoStreamingSwap?: string;
  recipientAddress: string;
  toAddress: string;
  token: string;
};

export type BorrowStreamingSwap = {
  estimatedTime: number;
  expectedCollateralDeposited: string;
  expectedDebtIssued: string;
  expectedOutput: string;
  expectedOutputMaxSlippage: string;
  expectedOutputMaxSlippageUSD: string;
  expectedOutputUSD: string;
  fees: QuoteRoute["fees"];
  memo: string;
};

export type BorrowResponse = {
  amountIn: string;
  amountOut: string;
  amountOutMin: string;
  calldata: BorrowCalldata;
  complete: boolean;
  estimatedTime: number;
  expectedCollateralDeposited: string;
  expectedDebtIssued: string;
  expectedOutput: string;
  expectedOutputMaxSlippage: string;
  expectedOutputMaxSlippageUSD: string;
  expectedOutputUSD: string;
  fees: QuoteRoute["fees"];
  fromAsset: string;
  memo: string;
  recipientAddress: string;
  route: { meta: { thornodeMeta: { inboundConfirmationSeconds: number; outboundDelay: number } } };
  streamingSwap?: BorrowStreamingSwap;
  swaps: QuoteRoute["swaps"];
  targetAddress: string;
  toAsset: string;
};

export type EVMTransactionDetails = {
  approvalSpender?: string;
  approvalToken?: string; // not set in case of gas asset
  contractAddress: string;
  contractMethod: string;
  contractParams: string[];
  contractParamsNames: string[];
  contractParamsStreaming: string[];
};

export type TimeEstimates = {
  swapMs: number;
  inboundMs?: number;
  outboundMs?: number;
  streamingMs?: number;
};

export type TxnResponse = {
  result: TxTrackerDetails;
  done: boolean;
  status: TxStatus;
  error?: { message: string };
};

export type CachedPricesParams = {
  tokens: { identifier: string }[];
  metadata?: "true" | "false";
  lookup?: "true" | "false";
  sparkline?: "true" | "false";
};

export type CachedPrice = {
  identifier: string;
  price_usd: number;
  cg?: {
    id?: string;
    name?: string;
    market_cap?: number;
    total_volume?: number;
    price_change_24h_usd?: number;
    price_change_percentage_24h_usd?: number;
    sparkline_in_7d?: string;
    timestamp?: number;
  };
};

export type TokenListProvidersResponse = Array<{
  provider: string;
  nbTokens: number;
}>;

export type GasPriceInfo = {
  asset: string;
  units: string;
  gas: number;
  chainId: string;
  gasAsset: number;
};

export enum TransactionType {
  // Old quote mode
  SWAP_TC_TO_TC = "SWAP:TC-TC",
  SWAP_ETH_TO_TC = "SWAP:ERC20-TC",
  SWAP_TC_TO_ETH = "SWAP:TC-ERC20",
  SWAP_ETH_TO_ETH = "SWAP:ERC20-ERC20",
  // Old quote mode: AVAX
  SWAP_AVAX_TO_TC = "SWAP:AVAX-TC",
  SWAP_TC_TO_AVAX = "SWAP:TC-AVAX",
  SWAP_AVAX_TO_AVAX = "SWAP:AVAX-AVAX",
  SWAP_ETH_TO_AVAX = "SWAP:ETH-AVAX",
  SWAP_AVAX_TO_ETH = "SWAP:AVAX-ETH",
  // ATOM
  SWAP_TC_TO_GAIA = "SWAP:TC-GAIA",
  SWAP_GAIA_TO_TC = "SWAP:GAIA-TC",
  // BNB
  SWAP_TC_TO_BNB = "SWAP:TC-BNB",
  SWAP_BNB_TO_TC = "SWAP:BNB-TC",
  // BTC
  SWAP_TC_TO_BTC = "SWAP:TC-BTC",
  SWAP_BTC_TO_TC = "SWAP:BTC-TC",
  // BCH
  SWAP_TC_TO_BCH = "SWAP:TC-BCH",
  SWAP_BCH_TO_TC = "SWAP:BCH-TC",
  // LTC
  SWAP_TC_TO_LTC = "SWAP:TC-LTC",
  SWAP_LTC_TO_TC = "SWAP:LTC-TC",
  // DOGE
  SWAP_TC_TO_DOGE = "SWAP:TC-DOGE",
  SWAP_DOGE_TO_TC = "SWAP:DOGE-TC",
  // TC txns
  TC_STATUS = "TC:STATUS", // only track status
  TC_TRANSFER = "TC:TRANSFER", // only track status
  TC_DEPOSIT = "TC:DEPOSIT",
  TC_SEND = "TC:SEND",
  TC_SWITCH = "TC:SWITCH",
  TC_LP_ADD = "TC:ADDLIQUIDITY",
  TC_LP_WITHDRAW = "TC:WITHDRAW", // Supports 'WITHDRAWLIQUIDITY' as well
  TC_TNS_CREATE = "TC:TNS-CREATE",
  TC_TNS_EXTEND = "TC:TNS-EXTEND",
  TC_TNS_UPDATE = "TC:TNS-UPDATE",
  // SAVINGS
  TC_SAVINGS_ADD = "TC:ADDSAVINGS",
  TC_SAVINGS_WITHDRAW = "TC:WITHDRAWSAVINGS",
  // LENDING
  TC_LENDING_OPEN = "TC:LENDINGOPEN",
  TC_LENDING_CLOSE = "TC:LENDINGCLOSE",
  // ERC-20 txns
  ETH_APPROVAL = "ETH:APPROVAL",
  ETH_STATUS = "ETH:STATUS", // only track status
  ETH_TRANSFER_TO_TC = "ETH:TRANSFER:IN",
  ETH_TRANSFER_FROM_TC = "ETH:TRANSFER:OUT",
  // AVAX
  AVAX_APPROVAL = "AVAX:APPROVAL",
  AVAX_STATUS = "AVAX:STATUS", // only track status
  AVAX_TRANSFER_TO_TC = "AVAX:TRANSFER:IN",
  AVAX_TRANSFER_FROM_TC = "AVAX:TRANSFER:OUT",
  // BSC
  BSC_APPROVAL = "BSC:APPROVAL",
  BSC_STATUS = "BSC:STATUS", // only track status
  BSC_TRANSFER_TO_TC = "BSC:TRANSFER:IN",
  BSC_TRANSFER_FROM_TC = "BSC:TRANSFER:OUT",
  // Generic types
  APPROVAL = "APPROVAL",
  STATUS = "STATUS",
  TRANSFER_TO_TC = "TRANSFER:IN",
  TRANSFER_FROM_TC = "TRANSFER:OUT",
  // Unsupported
  UNSUPPORTED = "UNSUPPORTED",
  // Lending
  TC_LENDING = "TC:LENDING",
}

export enum TxStatus {
  PENDING = "pending",
  SUCCESS = "success",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  REPLACED = "replaced",
  ERROR = "error",
  UNKNOWN = "unknown",
  NOT_STARTED = "not_started",
  NOT_FOUND = "not_found",
  RETRIES_EXCEEDED = "retries_exceeded",
  STREAMING = "streaming",
}

export enum StreamingSwapProgressStatus {
  NOT_STARTED = 0,
  SUCCESS = 1,
  REFUNDED = 2,
}

type Calldata = {
  amount: string;
  amountIn: string;
  amountOut: string;
  amountOutMin: string;
  assetAddress?: string;
  data?: string;
  deadline?: string;
  expiration: number;
  fromAsset?: string;
  memo: string;
  memoStreamingSwap?: string;
  router?: string;
  tcMemo?: string;
  tcRouter?: string;
  tcVault?: string;
  token?: string;
  userAddress: string;
  vault?: string;
};

type Meta = {
  buyChain: Chain;
  buyChainGasRate: number;
  hasStreamingSwap: boolean;
  lastLegEffectiveSlipPercentage: number;
  priceProtectionDetected: boolean;
  priceProtectionRequired: boolean;
  providerBuyAssetAmount: { buyAmount: number; chain: string; symbol: string; ticker: string };
  quoteMode: QuoteMode;
  sellChain: Chain;
  sellChainGasRate: number;
  warnings: { warningCode: LedgerErrorCode; warningMessage: string }[];
  thornodeMeta?: {
    dustThreshold?: number;
    expectedAmountOut: number;
    expectedAmountOutStreaming: number;
    fees: { affiliate: number; asset: string; outbound: number };
    inboundConfirmationBlocks?: number;
    inboundConfirmationSeconds?: number;
    maxStreamingSwaps: number;
    notes: string;
    outboundDelayBlocks: number;
    outboundDelaySeconds: number;
    streamingSwapBlocks: number;
    totalSwapSeconds: number;
    warning: string;
  };
};
