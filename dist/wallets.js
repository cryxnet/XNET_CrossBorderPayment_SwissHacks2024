"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issuerWallet = exports.stefWallet = exports.bobWallet = exports.ISSUER_WALLET_ADDRESS = void 0;
const xrpl_1 = require("xrpl");
const BOB_WALLET_ADDRESS = "rDBg1qLgTFaYQ8R5U9bh8QXLv7ErFgWXz2";
const BOB_WALLET_SECRET = "sEdTrx6kK7b8SghC9SYUcW7mwsufouZ";
const STEF_WALLET_ADDRESS = "rBeBTBDwmvsSnAJPV4y26FJBSPaEH8Qv15";
const STEF_WALLET_SECRET = "sEd7pjRtgXyEqRXCVLzPs3wtk4oRCyX";
exports.ISSUER_WALLET_ADDRESS = "rpQwZKwH1EgTY2nGEQCX9dVjce14o1GyCF";
const ISSUER_WALLET_SECRET = "sEdTCJKwriJzP8x9e9kYGqwtXJxfHRH";
// Create wallets from seeds
exports.bobWallet = xrpl_1.Wallet.fromSeed(BOB_WALLET_SECRET);
exports.stefWallet = xrpl_1.Wallet.fromSeed(STEF_WALLET_SECRET);
exports.issuerWallet = xrpl_1.Wallet.fromSeed(ISSUER_WALLET_SECRET);
