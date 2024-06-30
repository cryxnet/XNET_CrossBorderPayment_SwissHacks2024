import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Wallet, TrustSet, Payment, OfferCreate } from 'xrpl';

const client = new Client('wss://s.altnet.rippletest.net:51233');

const TCHF_CURRENCY_CODE = 'TCHF';
const TCHF_ISSUER_WALLET_ADDRESS = 'rsGGhyfhzf2KtJRPCmCxG8KgVnTTYeD5aL';
const TEUR_CURRENCY_CODE = 'TEUR';
const TEUR_ISSUER_WALLET_ADDRESS = 'rwzRgMcAYWv9q7DPgFbMvZw9KMLa3ZXN2K';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { senderSecret, retrieverSecret, amount } = req.body;

  if (!senderSecret || !retrieverSecret || !amount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const senderWallet = Wallet.fromSeed(senderSecret);
  const recipientWallet = Wallet.fromSeed(retrieverSecret);
  const senderAddress = senderWallet.classicAddress;
  const recipientAddress = recipientWallet.classicAddress;

  const xrpAmountForTCHF = '240'; // Assuming 20 XRP for 1 TCHF
  const xrpAmountForTEUR = '240'; // Assuming 20 XRP for 1 TEUR

  try {
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
        value: amount
      },
      TakerPays: xrpAmountForTCHF, // Specify the amount of XRP to receive (in drops)
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
      TakerGets: xrpAmountForTEUR, // Specify the amount of XRP to offer (in drops)
      TakerPays: {
        currency: TEUR_CURRENCY_CODE,
        issuer: TEUR_ISSUER_WALLET_ADDRESS,
        value: amount
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
        value: amount,
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

    res.status(200).json({ message: 'Transaction successful', transactionLink: `https://testnet.xrpl.org/transactions/${signedPayment.hash}` });
  } catch (error) {
    console.error(error);
    await client.disconnect();
    res.status(500).json({ error: 'Transaction failed', details: error.message });
  }
};

export default handler;
