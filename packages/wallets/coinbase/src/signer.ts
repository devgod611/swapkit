import { type CoinbaseWalletProvider, CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { Chain, ChainToRPC } from "@swapkit/helpers";
import {
  AbstractSigner,
  type Provider,
  getProvider,
  type getToolboxByChain,
} from "@swapkit/toolbox-evm";

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ethereum?: any;
    coinbaseWalletExtension?: CoinbaseWalletProvider;
  }
}

class CoinbaseMobileSigner extends AbstractSigner {
  #coinbaseProvider: CoinbaseWalletProvider;

  constructor(coinbaseProvider: CoinbaseWalletProvider, provider?: Provider) {
    super(provider);
    this.#coinbaseProvider = coinbaseProvider;
  }

  async getAddress() {
    const accounts = await this.#coinbaseProvider.request<string[]>({
      method: "eth_requestAccounts",
    });

    if (!accounts[0]) throw new Error("No Account found");

    return accounts[0];
  }

  async signTransaction() {
    return await this.#coinbaseProvider.request<string>({
      method: "eth_signTransaction",
    });
  }

  async signMessage(message: string | Uint8Array) {
    return await this.#coinbaseProvider.request<string>({
      method: "personal_sign",
      params: [message, await this.getAddress()],
    });
  }

  signTypedData = () => {
    throw new Error("this method is not implemented");
  };

  connect(provider: Provider) {
    return new CoinbaseMobileSigner(this.#coinbaseProvider, provider);
  }
}

export const getWalletForChain = async ({
  chain,
  ethplorerApiKey,
  covalentApiKey,
  api,
}: {
  chain: Chain;
  ethplorerApiKey?: string;
  covalentApiKey?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  api?: any;
}): Promise<ReturnType<ReturnType<typeof getToolboxByChain>> & { address: string }> => {
  switch (chain) {
    case Chain.Ethereum:
    case Chain.Avalanche:
    case Chain.Arbitrum:
    case Chain.Optimism:
    case Chain.Polygon:
    case Chain.BinanceSmartChain: {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "THORSwap",
        appLogoUrl: "https://example.com/logo.png",
        darkMode: false,
        overrideIsMetaMask: false,
      });

      const walletProvider = coinbaseWallet.makeWeb3Provider(ChainToRPC[chain]);

      // TODO fix error
      if (!walletProvider) throw new Error("No wallet provider");

      const { getToolboxByChain } = await import("@swapkit/toolbox-evm");

      const provider = getProvider(chain);

      const signer = new CoinbaseMobileSigner(walletProvider, provider);

      const params = {
        api,
        provider,
        signer,
      };

      const toolbox = getToolboxByChain(chain)({
        ...params,
        covalentApiKey: covalentApiKey as string,
        ethplorerApiKey: ethplorerApiKey as string,
      });

      return {
        address: await signer.getAddress(),
        ...toolbox,
      };
    }

    default:
      throw new Error(`No wallet for chain ${chain}`);
  }
};
