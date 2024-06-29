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
// Define the XRPL network and wallet information
const NETWORK = 'wss://s.altnet.rippletest.net:51233'; // Use the testnet for testing purposes
const secret = 'your_wallet_secret'; // BOB WALLET
const wallet = xrpl_1.Wallet.fromSeed(secret);
const DESTINATION_ADDRESS = 'destination_wallet_address'; // STEF WALLET
// Function to perform a swap
function swapCurrency() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new xrpl_1.Client(NETWORK);
        yield client.connect();
        // Define the amount to swap and the currency codes
        const chfAmount = '10'; // 10 CHF
        const issuerAddressCHF = 'issuer_address_for_CHF'; // Replace with the actual issuer address for CHF
        const issuerAddressEUR = 'issuer_address_for_EUR'; // Replace with the actual issuer address for EUR
        try {
            // Step 1: Set Trustline for CHF and EUR
            const trustSetCHF = {
                TransactionType: 'TrustSet',
                Account: wallet.address,
                LimitAmount: {
                    currency: 'CHF',
                    issuer: issuerAddressCHF,
                    value: chfAmount
                }
            };
            const signedTrustSetCHF = wallet.sign(trustSetCHF);
            yield client.submitAndWait(signedTrustSetCHF.tx_blob);
            const trustSetEUR = {
                TransactionType: 'TrustSet',
                Account: wallet.address,
                LimitAmount: {
                    currency: 'EUR',
                    issuer: issuerAddressEUR,
                    value: '100' // Adjust the limit as needed
                }
            };
            const signedTrustSetEUR = wallet.sign(trustSetEUR);
            yield client.submitAndWait(signedTrustSetEUR.tx_blob);
            // Step 2: Create Offer to swap CHF to XRP
            const offerCreateCHFToXRP = {
                TransactionType: 'OfferCreate',
                Account: wallet.address,
                TakerGets: {
                    currency: 'CHF',
                    issuer: issuerAddressCHF,
                    value: chfAmount
                },
                TakerPays: (0, xrpl_1.xrpToDrops)('1') // 1 XRP (adjust as needed based on market rates)
            };
            const signedOfferCreateCHFToXRP = wallet.sign(offerCreateCHFToXRP);
            const offerCreateCHFToXRPResponse = yield client.submitAndWait(signedOfferCreateCHFToXRP.tx_blob);
            console.log('OfferCreate CHF to XRP successful:', offerCreateCHFToXRPResponse);
            // Step 3: Create Offer to swap XRP to EUR
            const offerCreateXRPToEUR = {
                TransactionType: 'OfferCreate',
                Account: wallet.address,
                TakerGets: (0, xrpl_1.xrpToDrops)('1'), // 1 XRP (adjust as needed based on market rates)
                TakerPays: {
                    currency: 'EUR',
                    issuer: issuerAddressEUR,
                    value: '1' // 1 EUR (adjust as needed based on market rates)
                }
            };
            const signedOfferCreateXRPToEUR = wallet.sign(offerCreateXRPToEUR);
            const offerCreateXRPToEURResponse = yield client.submitAndWait(signedOfferCreateXRPToEUR.tx_blob);
            console.log('OfferCreate XRP to EUR successful:', offerCreateXRPToEURResponse);
            // Step 4: Send EUR to the destination address
            const sendEur = {
                TransactionType: 'Payment',
                Account: wallet.address,
                Destination: DESTINATION_ADDRESS,
                Amount: {
                    currency: 'EUR',
                    issuer: issuerAddressEUR,
                    value: '1' // Use the amount of EUR received from the second swap
                }
            };
            const signedSendEur = wallet.sign(sendEur);
            const sendEurResponse = yield client.submitAndWait(signedSendEur.tx_blob);
            console.log('Sending EUR successful:', sendEurResponse);
        }
        catch (error) {
            console.error('Error swapping currencies:', error);
        }
        finally {
            client.disconnect();
        }
    });
}
// Execute the swap function
swapCurrency();
