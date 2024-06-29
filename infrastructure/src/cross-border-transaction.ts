import { Client, Wallet, TrustSet, Payment, OfferCreate } from 'xrpl';
import { BOB_WALLET_ADDRESS, STEF_WALLET_ADDRESS, BOB_WALLET_SECRET, STEF_WALLET_SECRET } from './wallets';
import { TCHF_CURRENCY_CODE, TCHF_ISSUER_WALLET_ADDRESS, TEUR_CURRENCY_CODE , TEUR_ISSUER_WALLET_ADDRESS } from './tokens';

const client = new Client('wss://s.altnet.rippletest.net:51233');
const senderSecret = BOB_WALLET_SECRET;
const senderAddress = BOB_WALLET_ADDRESS;
const recipientSecret = STEF_WALLET_SECRET;
const recipientAddress = STEF_WALLET_ADDRESS;
const senderWallet = Wallet.fromSeed(senderSecret);
const recipientWallet = Wallet.fromSeed(recipientSecret);

const amountToSend = '1'; // 1 TCHF

(async () => {
  await client.connect();

  // Create TrustSet transaction for TCHF
  const trustSetTCHF: TrustSet = {
    TransactionType: 'TrustSet',
    Account: recipientAddress,
    LimitAmount: {
      currency: TCHF_CURRENCY_CODE,
      issuer: TCHF_ISSUER_WALLET_ADDRESS,
      value: '1000000' // Set a high enough limit
    }
  };

  // Create TrustSet transaction for TEUR
  const trustSetTEUR: TrustSet = {
    TransactionType: 'TrustSet',
    Account: recipientAddress,
    LimitAmount: {
      currency: TEUR_CURRENCY_CODE,
      issuer: TEUR_ISSUER_WALLET_ADDRESS,
      value: '1000000' // Set a high enough limit
    }
  };

  // Sign and submit TrustSet transactions
  const preparedTCHF = await client.autofill(trustSetTCHF);
  const signedTCHF = recipientWallet.sign(preparedTCHF);
  await client.submitAndWait(signedTCHF.tx_blob);

  const preparedTEUR = await client.autofill(trustSetTEUR);
  const signedTEUR = recipientWallet.sign(preparedTEUR);
  await client.submitAndWait(signedTEUR.tx_blob);

  console.log('Trust lines set for TCHF and TEUR.');

  // 1. Swap TCHF to XRP
  const offerCreateTCHFtoXRP: OfferCreate = {
    TransactionType: 'OfferCreate',
    Account: senderAddress,
    TakerGets: {
      currency: TCHF_CURRENCY_CODE,
      issuer: TCHF_ISSUER_WALLET_ADDRESS,
      value: amountToSend
    },
    TakerPays: (1 * 1000000).toString(), // Specify the amount of XRP to receive (in drops)
    Flags: 0x00080000 // tfImmediateOrCancel
  };

  const preparedOfferTCHFtoXRP = await client.autofill(offerCreateTCHFtoXRP);
  const signedOfferTCHFtoXRP = senderWallet.sign(preparedOfferTCHFtoXRP);
  const resultOfferTCHFtoXRP = await client.submitAndWait(signedOfferTCHFtoXRP.tx_blob);
  console.log('TCHF to XRP swap:', resultOfferTCHFtoXRP);

  // 2. Swap XRP to TEUR
  const offerCreateXRPtoTEUR: OfferCreate = {
    TransactionType: 'OfferCreate',
    Account: senderAddress,
    TakerGets: (1 * 1000000).toString(), // Specify the amount of XRP to offer (in drops)
    TakerPays: {
      currency: TEUR_CURRENCY_CODE,
      issuer: TEUR_ISSUER_WALLET_ADDRESS,
      value: amountToSend
    },
    Flags: 0x00080000 // tfImmediateOrCancel
  };

  const preparedOfferXRPtoTEUR = await client.autofill(offerCreateXRPtoTEUR);
  const signedOfferXRPtoTEUR = senderWallet.sign(preparedOfferXRPtoTEUR);
  const resultOfferXRPtoTEUR = await client.submitAndWait(signedOfferXRPtoTEUR.tx_blob);
  console.log('XRP to TEUR swap:', resultOfferXRPtoTEUR);

  // 3. Send TEUR to destination
  const payment: Payment = {
    TransactionType: 'Payment',
    Account: senderAddress,
    Amount: {
      currency: TEUR_CURRENCY_CODE,
      value: amountToSend,
      issuer: TEUR_ISSUER_WALLET_ADDRESS
    },
    Destination: recipientAddress
  };

  const preparedPayment = await client.autofill(payment);
  const signedPayment = senderWallet.sign(preparedPayment);
  const resultPayment = await client.submitAndWait(signedPayment.tx_blob);

  // Log the result and transaction link
  console.log('TEUR payment:', resultPayment);
  console.log(`Transaction link: https://testnet.xrpl.org/transactions/${signedPayment.hash}`);

  await client.disconnect();
})();
