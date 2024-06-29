import { Wallet } from 'xrpl';

export const BOB_WALLET_ADDRESS = "rDBg1qLgTFaYQ8R5U9bh8QXLv7ErFgWXz2"
export const BOB_WALLET_SECRET = "sEdTrx6kK7b8SghC9SYUcW7mwsufouZ"

export const STEF_WALLET_ADDRESS = "rBeBTBDwmvsSnAJPV4y26FJBSPaEH8Qv15"
export const STEF_WALLET_SECRET = "sEd7pjRtgXyEqRXCVLzPs3wtk4oRCyX"

// Create wallets from seeds
export const bobWallet = Wallet.fromSeed(BOB_WALLET_SECRET);
export const stefWallet = Wallet.fromSeed(STEF_WALLET_SECRET);