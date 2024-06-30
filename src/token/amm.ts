import { Client, Wallet, TrustSet, Payment, PathFindRequest } from "xrpl";
import { BOB_WALLET_ADDRESS, STEF_WALLET_ADDRESS, BOB_WALLET_SECRET, STEF_WALLET_SECRET } from "./wallets";
import {
  TCHF_CURRENCY_CODE,
  TCHF_ISSUER_WALLET_ADDRESS,
  TEUR_CURRENCY_CODE,
  TEUR_ISSUER_WALLET_ADDRESS,
} from "./tokens";

const client = new Client("wss://s.altnet.rippletest.net:51233");
const senderSecret = BOB_WALLET_SECRET;
const senderAddress = BOB_WALLET_ADDRESS;
const recipientSecret = STEF_WALLET_SECRET;
const recipientAddress = STEF_WALLET_ADDRESS;
const senderWallet = Wallet.fromSeed(senderSecret);
const recipientWallet = Wallet.fromSeed(recipientSecret);

const sourceCurrency = TCHF_CURRENCY_CODE;
const destinationCurrency = TEUR_CURRENCY_CODE;
const amountToSend = "1"; // 1 TCHF

(async () => {
  await client.connect();

  // Create TrustSet transaction for TCHF
  const trustSetTCHF: TrustSet = {
    TransactionType: "TrustSet",
    Account: recipientAddress,
    LimitAmount: {
      currency: sourceCurrency,
      issuer: TCHF_ISSUER_WALLET_ADDRESS,
      value: "1000000", // Set a high enough limit
    },
  };

  // Create TrustSet transaction for TEUR
  const trustSetTEUR: TrustSet = {
    TransactionType: "TrustSet",
    Account: recipientAddress,
    LimitAmount: {
      currency: destinationCurrency,
      issuer: TEUR_ISSUER_WALLET_ADDRESS,
      value: "1000000", // Set a high enough limit
    },
  };

  // Sign and submit TrustSet transactions
  const preparedTCHF = await client.autofill(trustSetTCHF);
  const signedTCHF = recipientWallet.sign(preparedTCHF);
  await client.submitAndWait(signedTCHF.tx_blob);

  const preparedTEUR = await client.autofill(trustSetTEUR);
  const signedTEUR = recipientWallet.sign(preparedTEUR);
  await client.submitAndWait(signedTEUR.tx_blob);

  console.log("Trust lines set for TCHF and TEUR.");

  // Use path_find to find a viable path for the payment
  const pathFindRequest: PathFindRequest = {
    command: "path_find",
    subcommand: "create",
    source_account: senderAddress,
    destination_account: recipientAddress,
    destination_amount: {
      currency: destinationCurrency,
      value: amountToSend,
      issuer: TEUR_ISSUER_WALLET_ADDRESS,
    },
  };

  const pathFindResponse = await client.request(pathFindRequest);
  const paths = pathFindResponse.result.alternatives;

  if (paths.length === 0) {
    console.log("No paths found with sufficient liquidity.");
    await client.disconnect();
    return;
  }

  const bestPath = paths[0].paths_computed;

  // Create the payment transaction with the found path
  const payment: Payment = {
    TransactionType: "Payment",
    Account: senderAddress,
    Amount: {
      currency: destinationCurrency,
      value: amountToSend,
      issuer: TEUR_ISSUER_WALLET_ADDRESS,
    },
    Destination: recipientAddress,
    SendMax: {
      currency: sourceCurrency,
      value: amountToSend,
      issuer: TCHF_ISSUER_WALLET_ADDRESS,
    },
    Paths: bestPath,
  };

  // Sign and submit the payment transaction
  const preparedPayment = await client.autofill(payment);
  const signedPayment = senderWallet.sign(preparedPayment);
  const resultPayment = await client.submitAndWait(signedPayment.tx_blob);

  // Log the result and transaction link
  console.log(resultPayment);
  //   console.log("Transaction link:" https://testnet.xrpl.org/transactions/${signedPayment.hash});

  await client.disconnect();
})();
