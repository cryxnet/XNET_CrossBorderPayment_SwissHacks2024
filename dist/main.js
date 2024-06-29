"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const xrpl_1 = require("xrpl");
// Connect to the XRPL Testnet
const client = new xrpl_1.Client('wss://s.altnet.rippletest.net:51233');
function createTokensAndAMMs() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        // Generate wallets for the issuer, Bob, and Stef
        const issuerWallet = xrpl_1.Wallet.generate();
        const bobWallet = xrpl_1.Wallet.generate();
        const stefWallet = xrpl_1.Wallet.generate();
        console.log(`Issuer Wallet Address: ${issuerWallet.address}`);
        console.log(`Bob Wallet Address: ${bobWallet.address}`);
        console.log(`Stef Wallet Address: ${stefWallet.address}`);
        // Fund the issuer, Bob, and Stef wallets using the Testnet faucet (this is a synchronous call)
        yield client.fundWallet(issuerWallet);
        yield client.fundWallet(bobWallet);
        yield client.fundWallet(stefWallet);
        // Set up trust lines for the new tokens
        const trustSeCHF = {
            TransactionType: 'TrustSet',
            Account: bobWallet.address,
            LimitAmount: {
                currency: 'CHF',
                issuer: issuerWallet.address,
                value: '1000000'
            }
        };
        const trustSetEUR = {
            TransactionType: 'TrustSet',
            Account: bobWallet.address,
            LimitAmount: {
                currency: 'EUR',
                issuer: issuerWallet.address,
                value: '1000000'
            }
        };
        // Sign and submit the TrustSet transactions
        yield client.submitAndWait(trustSeCHF, { wallet: bobWallet });
        yield client.submitAndWait(trustSetEUR, { wallet: bobWallet });
        // Issue CHF to Bob
        const paymentCHF = {
            TransactionType: 'Payment',
            Account: issuerWallet.address,
            Destination: bobWallet.address,
            Amount: {
                currency: 'CHF',
                value: '10',
                issuer: issuerWallet.address
            },
            Flags: 2147483648
        };
        // Sign and submit the Payment transactions
        yield client.submit(paymentCHF, { wallet: issuerWallet });
        console.log('Tokens CHF and EUR have been created and issued.');
        // Create AMMs for CHF/XRP and EUR/XRP pairs
        // AMM for CHF/XRP
        const ammCreateCHF = {
            TransactionType: 'AMMCreate',
            Account: issuerWallet.address,
            Amount: {
                currency: 'CHF',
                value: '500',
                issuer: issuerWallet.address
            },
            TradingFee: 40,
            Amount2: (0, xrpl_1.xrpToDrops)('500'),
            Fee: "2000000",
            Flags: 2147483648,
        };
        // AMM for EUR/XRP
        const ammCreateEUR = {
            TransactionType: 'AMMCreate',
            Account: issuerWallet.address,
            Amount: {
                currency: 'EUR',
                value: '516',
                issuer: issuerWallet.address
            },
            TradingFee: 40,
            Amount2: (0, xrpl_1.xrpToDrops)('500'),
            Fee: "2000000",
            Flags: 2147483648,
        };
        // Sign and submit the AMMCreate transactions 
        yield client.submitAndWait(ammCreateCHF, { wallet: issuerWallet, autofill: true, failHard: true });
        yield client.submitAndWait(ammCreateEUR, { wallet: issuerWallet, autofill: true, failHard: true });
        console.log('AMMs for CHF/XRP and EUR/XRP have been created.');
        yield client.disconnect();
    });
}
createTokensAndAMMs().catch(console.error);
