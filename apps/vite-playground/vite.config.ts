import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // NOTE: Have to be added to fix: Uncaught ReferenceError: process is not defined
  define: {
    'process.env': {},
  },
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      stream: 'readable-stream',
      util: 'util',
      url: 'url',

      '@thorswap-lib/keystore': resolve('../../packages/wallets/keystore/src'),
      '@thorswap-lib/ledger': resolve('../../packages/wallets/ledger/src'),
      '@thorswap-lib/swapkit-core': resolve('../../packages/swapkit/swapkit-core/src'),
      '@thorswap-lib/swapkit-entities': resolve('../../packages/swapkit/swapkit-entities/src'),
      '@thorswap-lib/swapkit-explorers': resolve('../../packages/swapkit/swapkit-explorers/src'),
      '@thorswap-lib/toolbox-evm': resolve('../../packages/toolboxes/toolbox-evm/src'),
      '@thorswap-lib/toolbox-cosmos': resolve('../../packages/toolboxes/toolbox-cosmos/src'),
      '@thorswap-lib/toolbox-utxo': resolve('../../packages/toolboxes/toolbox-utxo/src'),
      '@thorswap-lib/types': resolve('../../packages/swapkit/types/src'),
      '@thorswap-lib/trustwallet': resolve('../../packages/wallets/trustwallet/src'),
      '@thorswap-lib/trezor': resolve('../../packages/wallets/trezor/src'),
      '@thorswap-lib/walletconnect': resolve('../../packages/wallets/walletconnect/src'),
      '@thorswap-lib/xdefi': resolve('../../packages/wallets/xdefi/src'),
    },
  },
  server: {
    port: 3000,
  },

  // NOTE: Have to be added to fix: Uncaught ReferenceError: global is not defined
  optimizeDeps: {
    esbuildOptions: {
      define: { global: 'globalThis' },
    },
  },
});
