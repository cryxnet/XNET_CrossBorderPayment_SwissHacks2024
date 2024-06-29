import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Wallet, TrustSet, Payment, OfferCreate } from 'xrpl';
import { Offer } from 'xrpl/dist/npm/models/ledger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "POST") return res.status(400).json({ message: "Only POST method allowed."})

  const { senderSecret, recipientAddress, amountToSend } = req.body;

  // Define constants and configurations
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  const TCHF_CURRENCY_CODE = 'TCHF';
  const TCHF_ISSUER_WALLET_ADDRESS = "rsGGhyfhzf2KtJRPCmCxG8KgVnTTYeD5aL"; // Replace with actual issuer address
  const TEUR_CURRENCY_CODE = 'TEUR';
  const TEUR_ISSUER_WALLET_ADDRESS = 'rwzRgMcAYWv9q7DPgFbMvZw9KMLa3ZXN2K'; // Replace with actual issuer address

  // Initialize wallets
  const senderWallet = Wallet.fromSeed(senderSecret);
  const senderAddress = senderWallet.classicAddress;

  try {
    await client.connect();

    // Fetch current rates from the order book for TCHF to XRP
    const bookOffersTCHFtoXRP = await client.request({
      command: 'book_offers',
      taker: senderAddress,
      taker_gets: {
        currency: TCHF_CURRENCY_CODE,
        issuer: TCHF_ISSUER_WALLET_ADDRESS,
        value: amountToSend
      },
      taker_pays: {
        currency: 'XRP'
      }
    });

    const bestOfferTCHFtoXRP = bookOffersTCHFtoXRP.result.offers[0];
    const xrpAmountForTCHF = bestOfferTCHFtoXRP.TakerPays;

    // Fetch current rates from the order book for XRP to TEUR
    const bookOffersXRPtoTEUR = await client.request({
      command: 'book_offers',
      taker: senderAddress,
      taker_gets: {
        currency: 'XRP',
        value: xrpAmountForTCHF
      },
      taker_pays: {
        currency: TEUR_CURRENCY_CODE,
        issuer: TEUR_ISSUER_WALLET_ADDRESS,
        value: amountToSend
      }
    });

    const bestOfferXRPtoTEUR = bookOffersXRPtoTEUR.result.offers[0];
    const teurAmountForXRP = bestOfferXRPtoTEUR.TakerGets;

    // 1. Swap TCHF to XRP
    const offerCreateTCHFtoXRP: OfferCreate = {
      TransactionType: 'OfferCreate',
      Account: senderAddress,
      TakerGets: {
        currency: TCHF_CURRENCY_CODE,
        issuer: TCHF_ISSUER_WALLET_ADDRESS,
        value: amountToSend
      },
      TakerPays: xrpAmountForTCHF,
      Flags: 0x00080000 // tfImmediateOrCancel
    };

    const preparedOfferTCHFtoXRP = await client.autofill(offerCreateTCHFtoXRP);
    const signedOfferTCHFtoXRP = senderWallet.sign(preparedOfferTCHFtoXRP);
    const resultOfferTCHFtoXRP = await client.submitAndWait(signedOfferTCHFtoXRP.tx_blob);

    // 2. Swap XRP to TEUR
    const offerCreateXRPtoTEUR: OfferCreate = {
      TransactionType: 'OfferCreate',
      Account: senderAddress,
      TakerGets: xrpAmountForTCHF,
      TakerPays: {
        currency: TEUR_CURRENCY_CODE,
        issuer: TEUR_ISSUER_WALLET_ADDRESS,
        value: teurAmountForXRP.toString()
      },
      Flags: 0x00080000 // tfImmediateOrCancel
    };

    const preparedOfferXRPtoTEUR = await client.autofill(offerCreateXRPtoTEUR);
    const signedOfferXRPtoTEUR = senderWallet.sign(preparedOfferXRPtoTEUR);
    const resultOfferXRPtoTEUR = await client.submitAndWait(signedOfferXRPtoTEUR.tx_blob);

    // 3. Send TEUR to destination
    const payment: Payment= {
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

    // Return transaction links
    res.status(200).json({
      tCHFToXRPSwap: `https://testnet.xrpl.org/transactions/${signedOfferTCHFtoXRP.hash}`,
      xRPToTEURSwap: `https://testnet.xrpl.org/transactions/${signedOfferXRPtoTEUR.hash}`,
      tEURPayment: `https://testnet.xrpl.org/transactions/${signedPayment.hash}`
    });
  } catch (error) {
    console.error('Error executing transactions:', error);
    res.status(500).json({ error: 'Failed to execute transactions' });
  } finally {
    await client.disconnect();
  }
}
