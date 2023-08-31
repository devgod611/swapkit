import BitcoinApp from '@ledgerhq/hw-app-btc';
import CosmosApp from '@ledgerhq/hw-app-cosmos';
import type { UTXO } from '@thorswap-lib/types';
import { toCashAddress } from 'bchaddrjs';
import { type Network as BTCNetwork, networks, type Psbt } from 'bitcoinjs-lib';

import { BinanceApp } from '../clients/binance/lib.js';
import { THORChainApp } from '../clients/thorchain/lib.js';
import { getLedgerTransport } from '../helpers/getLedgerTransport.js';

import { CreateTransactionArg } from './types.js';
import { signUTXOTransaction } from './utxo.js';

export abstract class CommonLedgerInterface {
  public ledgerTimeout: number = 50000;
  public derivationPath: (number | string)[] | string = [];
  public transport: any;
  public ledgerApp: any;
  public chain: 'thor' | 'bnb' | 'sol' | 'cosmos' | 'eth' = 'thor';

  public checkOrCreateTransportAndLedger = async () => {
    if (this.transport && this.ledgerApp) return;

    try {
      this.transport ||= await getLedgerTransport();

      switch (this.chain) {
        case 'bnb': {
          return (this.ledgerApp ||= new BinanceApp(this.transport));
        }

        case 'thor': {
          return (this.ledgerApp ||= new THORChainApp(this.transport));
        }

        case 'cosmos': {
          // @ts-ignore Ledger typing is wrong
          return (this.ledgerApp ||= new CosmosApp(this.transport));
        }
      }
    } catch (error: any) {
      console.error(error);
      throw new Error('Cannot create transport or ledger client');
    }
  };
}

export abstract class UTXOLedgerInterface {
  public addressNetwork: BTCNetwork = networks.bitcoin;
  // @ts-ignore Ledger typing is wrong
  public btcApp: InstanceType<typeof BitcoinApp> | null = null;
  public chain: 'bch' | 'btc' | 'ltc' | 'doge' = 'btc';
  public derivationPath = '';
  public ledgerApp: any;
  public additionalSignParams?: Partial<CreateTransactionArg>;
  public transport = null as any;
  public walletFormat: 'legacy' | 'bech32' = 'bech32';

  public connect = async () => {
    await this.checkBtcAppAndCreateTransportWebUSB(false);

    // @ts-ignore Ledger typing is wrong
    this.btcApp = new BitcoinApp(this.transport);
  };

  public signTransaction = async (psbt: Psbt, inputUtxos: UTXO[]) => {
    await this.checkBtcAppAndCreateTransportWebUSB();

    return signUTXOTransaction(
      { psbt, derivationPath: this.derivationPath, btcApp: this.btcApp, inputUtxos },
      this.additionalSignParams,
    );
  };

  public getAddress = async () => {
    await this.checkBtcAppAndCreateTransportWebUSB();

    const { bitcoinAddress: address } = await this.btcApp!.getWalletPublicKey(this.derivationPath, {
      format: this.walletFormat,
    });

    if (!address) {
      throw new Error(
        `Cannot get ${this.chain} address from ledger derivation path: ${this.derivationPath}`,
      );
    }

    return this.chain === 'bch' && this.walletFormat === 'legacy'
      ? toCashAddress(address).replace(/(bchtest:|bitcoincash:)/, '')
      : address;
  };

  private checkBtcAppAndCreateTransportWebUSB = async (checkBtcApp: boolean = true) => {
    if (checkBtcApp && !this.btcApp) {
      const errorData = JSON.stringify({ checkBtcApp, btcApp: this.btcApp });
      throw new Error(`Ledger connection failed: \n${errorData}`);
    }

    this.transport ||= await getLedgerTransport();
  };

  public getExtendedPublicKey = async (
    path: string = "84'/0'/0'",
    xpubVersion: number = 76067358,
  ) => {
    await this.checkBtcAppAndCreateTransportWebUSB();

    return this.btcApp!.getWalletXpub({
      path,
      xpubVersion,
    });
  };
}
