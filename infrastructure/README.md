# Infrastructure

This section of the repository contains all the scripts used to set up our infrastructure on XRPL, including AMMs, tokens, wallets, and more.

## Files

- **/src/wallet.ts**: Contains demo wallets. `BOB_WALLET_ADDRESS` is the sender, and `STEF_WALLET_ADDRESS` is the receiver.
- **/src/tokens.ts**: Consolidates all token information, including distributors, issuers, and currency codes.
- **/src/pools.ts**: Details of the created AMMs (liquidity pools).
- **/src/giveBobTCHF.ts**: Script to dispense TCHF to Bob, the sender.
- **/src/cross-border-transaction.ts**: The core of our system, handling cross-border transactions from Bob to Stef.
- **/src/createAMMs.ts**: Script to create AMMs for TCHF/XRP and TEUR/XRP pairs.
- **/src/tokens/createTCHF.ts**: Script to create the TCHF token.
- **/src/tokens/createTEUR.ts**: Script to create the TEUR token.

## Run

1. **Compile the scripts:**

   ```sh
   npm run compile
   ```

2. **Execute the desired script from the `dist/` directory:**

   ```sh
   node dist/src/cross-border-transaction.js
   ```
