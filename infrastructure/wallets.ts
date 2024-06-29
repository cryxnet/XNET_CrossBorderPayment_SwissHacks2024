import { Wallet } from 'xrpl';

const BOB_WALLET_ADDRESS = "rDBg1qLgTFaYQ8R5U9bh8QXLv7ErFgWXz2"
const BOB_WALLET_SECRET = "sEdTrx6kK7b8SghC9SYUcW7mwsufouZ"

const STEF_WALLET_ADDRESS = "rBeBTBDwmvsSnAJPV4y26FJBSPaEH8Qv15"
const STEF_WALLET_SECRET = "sEd7pjRtgXyEqRXCVLzPs3wtk4oRCyX"

export const ISSUER_WALLET_ADDRESS = "rpQwZKwH1EgTY2nGEQCX9dVjce14o1GyCF"
const ISSUER_WALLET_SECRET = "sEdTCJKwriJzP8x9e9kYGqwtXJxfHRH"

// Create wallets from seeds
export const bobWallet = Wallet.fromSeed(BOB_WALLET_SECRET);
export const stefWallet = Wallet.fromSeed(STEF_WALLET_SECRET);
export const issuerWallet = Wallet.fromSeed(ISSUER_WALLET_SECRET)