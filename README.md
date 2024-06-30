# XNET Project

This repository contains the complete infrastructure and scripts for setting up and executing cross-border payments using the XRPL (XRP Ledger). The project includes components for token creation, wallet management, automated market makers (AMMs), as well as the frontend and backend for the user interface and API services.

## Directory Structure

```
xnet/
├── .gitignore
├── README.md
├── XNET_Whitepaper.pdf
├── infrastructure/ <- Scripts for creating tokens, amms and transactions
├── xnet/  <- Demo Web Application
```

## Infrastructure

This part of the repository stores all the scripts used to set up our infrastructure on XRPL (AMMs, Tokens, Wallets, etc.).

### Files

- **/src/XRPLClient.ts**: A concise wrapper for XRPL client operations.
- **/src/wallet.ts**: Contains demo wallets. `BOB_WALLET_ADDRESS` is the sender, and `STEF_WALLET_ADDRESS` is the receiver.
- **/src/tokens.ts**: Consolidates all token information, including distributors, issuers, and currency codes.
- **/src/pools.ts**: Details of the created AMMs (liquidity pools).
- **/src/giveBobTCHF.ts**: Script to dispense TCHF to Bob, the sender.
- **/src/cross-border-transaction.ts**: The core of our system, handling cross-border transactions from Bob to Stef.
- **/src/createAMMs.ts**: Script to create AMMs for TCHF/XRP and TEUR/XRP pairs.
- **/src/tokens/createTCHF.ts**: Script to create the TCHF token.
- **/src/tokens/createTEUR.ts**: Script to create the TEUR token.

## Infrastructure Setup and Execution
Read more about infrastructure and the whole blockchain process in `infrastructure/README.md``

### 1 Install dependencies

```sh
npm i
```

### 2. Compile the scripts

Navigate to the `infrastructure` directory and compile the scripts:

```sh
npm run compile
```

### 3. Run the desired script

Execute the desired script from the `dist/` directory. For example, to run the cross-border transaction script:

```sh
node dist/src/cross-border-transaction.js
```

## Start the webapp

```sh
cd xnet
npm i
npm run dev
```

## Additional Resources

- **XNET_Whitepaper.pdf**: Detailed white paper outlining the XNET system, including components, workflow, and benefits.

## Conclusion

This project demonstrates a comprehensive solution for cross-border payments using the XRPL. By following the setup and execution steps, users can facilitate efficient and secure international transactions using tokenized assets and automated market makers. For further details and technical specifications, refer to the white paper or contact our team.