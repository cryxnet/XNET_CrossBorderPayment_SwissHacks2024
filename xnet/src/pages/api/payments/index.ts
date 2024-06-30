import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Wallet, TrustSet, Payment, OfferCreate } from 'xrpl';

// Constants for TCHF and TEUR
const TCHF_CURRENCY_CODE = '5443484600000000000000000000000000000000';
const TCHF_ISSUER_WALLET_ADDRESS = 'rsGGhyfhzf2KtJRPCmCxG8KgVnTTYeD5aL';
const TEUR_CURRENCY_CODE = '5445555200000000000000000000000000000000';
const TEUR_ISSUER_WALLET_ADDRESS = 'rwzRgMcAYWv9q7DPgFbMvZw9KMLa3ZXN2K';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { senderSecret, recipientSecret, amount } = req.body;

  if (!senderSecret || !recipientSecret || !amount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const client = new Client('wss://s.altnet.rippletest.net:51233');
  const senderWallet = Wallet.fromSeed(senderSecret);
  const recipientWallet = Wallet.fromSeed(recipientSecret);
  const recipientAddress = recipientWallet.address;

  const xrpAmountForTCHF = '24000000'; // Assuming 2 XRP for 1 TCHF (24 XRP in drops)
  const xrpAmountForTEUR = '24000000'; // Assuming 2 XRP for 1 TEUR (24 XRP in drops)

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
    const resultTrustTCHF = await client.submitAndWait(signedTCHF.tx_blob);

    const preparedTEUR = await client.autofill(trustSetTEUR);
    const signedTEUR = recipientWallet.sign(preparedTEUR);
    const resultTrustTEUR = await client.submitAndWait(signedTEUR.tx_blob);

    console.log('Trust lines set for TCHF and TEUR.');

    // 1. Swap TCHF to XRP
    const offerCreateTCHFtoXRP: OfferCreate = {
      TransactionType: 'OfferCreate',
      Account: senderWallet.address,
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
      Account: senderWallet.address,
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
      Account: senderWallet.address,
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

    res.status(200).json({
      message: 'Payment successful',
      transactionLinks: {
        trustSetTCHF: `https://testnet.xrpl.org/transactions/${resultTrustTCHF.result.hash}`,
        trustSetTEUR: `https://testnet.xrpl.org/transactions/${resultTrustTEUR.result.hash}`,
        offerTCHFtoXRP: `https://testnet.xrpl.org/transactions/${resultOfferTCHFtoXRP.result.hash}`,
        offerXRPtoTEUR: `https://testnet.xrpl.org/transactions/${resultOfferXRPtoTEUR.result.hash}`,
        paymentTEUR: `https://testnet.xrpl.org/transactions/${resultPayment.result.hash}`
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
