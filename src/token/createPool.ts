import { createAndConfigureWallet, createClient, createPayment, createTrustLine } from "./lib/functions";
import { Client, PathFindRequest, Payment, TransactionMetadataBase, Wallet } from "xrpl";

const currencyCodeTCHF = "5443484600000000000000000000000000000000";
const currencyCodeTEUR = "5443484600000000000000000000000000000000";

const amountToSend = "1";

// 5443455500000000000000000000000000000000
//5445555200000000000000000000000000000000

const trustLineRecipientWallet = async (
  client: Client,
  recipientWallet: Wallet,
  issuerWalletNativeCurrency: Wallet,
  issuerWalletForeginCurrency: Wallet
) => {
  // Create TrustSet transaction for TCHF and recipient
  await createTrustLine(client, recipientWallet, {
    TransactionType: "TrustSet",
    Account: recipientWallet.address,
    LimitAmount: {
      currency: currencyCodeTCHF,
      issuer: issuerWalletNativeCurrency.address,
      value: "10000000000", // Large limit, arbitrarily chosen
    },
  });

  // Create TrustSet transaction for TEURO and recipient
  await createTrustLine(client, recipientWallet, {
    TransactionType: "TrustSet",
    Account: recipientWallet.address,
    LimitAmount: {
      currency: currencyCodeTEUR,
      issuer: issuerWalletForeginCurrency.address,
      value: "10000000000", // Large limit, arbitrarily chosen
    },
  });
  console.log("Trust lines set for TCHF and TEUR for recipient Wallet.");
};
const trustLineSenderWallet = async (
  client: Client,
  senderWallet: Wallet,
  issuerWalletNativeCurrency: Wallet,
  issuerWalletForeginCurrency: Wallet
) => {
  // Create TrustSet transaction for TCHF and recipient
  await createTrustLine(client, senderWallet, {
    TransactionType: "TrustSet",
    Account: senderWallet.address,
    LimitAmount: {
      currency: currencyCodeTCHF,
      issuer: issuerWalletNativeCurrency.address,
      value: "10000000000", // Large limit, arbitrarily chosen
    },
  });

  // Create TrustSet transaction for TEURO and recipient
  await createTrustLine(client, senderWallet, {
    TransactionType: "TrustSet",
    Account: senderWallet.address,
    LimitAmount: {
      currency: currencyCodeTEUR,
      issuer: issuerWalletForeginCurrency.address,
      value: "10000000000", // Large limit, arbitrarily chosen
    },
  });
  console.log("Trust lines set for TCHF and TEUR for sender Wallet.");
};

async function main() {
  console.log("start creating pool...");

  const client = await createClient();

  try {
    const hodlWalletTCHF = await createAndConfigureWallet(client, "sEdVmMZbfWrsrN65z8ceje2a6WTLiEK");
    const issuerWalletTCHF = await createAndConfigureWallet(client, "sEdThAX8fKLdugBsaux8Dwwe1FRQVMb");

    const issuerWalletTEUR = await createAndConfigureWallet(client, "sEdVQy91BopKK1n2kKa9g5Sv6pbSaMw");
    const hodlWalletTEUR = await createAndConfigureWallet(client, "sEdTujuwQr4Fxm6CDSEueNHB2bwfHAz");

    const senderWallet = await createAndConfigureWallet(client, "sEdTrx6kK7b8SghC9SYUcW7mwsufouZ");
    const recipientWallet = await createAndConfigureWallet(client, "sEd7pjRtgXyEqRXCVLzPs3wtk4oRCyX");

    await trustLineRecipientWallet(client, recipientWallet, issuerWalletTCHF, issuerWalletTEUR);
    await trustLineSenderWallet(client, senderWallet, issuerWalletTCHF, issuerWalletTEUR);

    console.log("Trust lines set for TCHF and TEUR.");

    const pathFindRequest: PathFindRequest = {
      command: "path_find",
      subcommand: "create",
      source_account: senderWallet.address,
      destination_account: recipientWallet.address,
      destination_amount: {
        value: amountToSend,
        currency: currencyCodeTCHF,
        issuer: issuerWalletTCHF.address,
      },
    };
    const pathFindResponse = await client.request(pathFindRequest);
    const alternativePaths = pathFindResponse.result.alternatives;
    console.log("🚀 ~ main ~ alternativePaths:", alternativePaths);

    console.log("best path: ", alternativePaths[0].paths_computed);

    if (alternativePaths.length === 0) {
      throw new Error("No path found.");
    }

    /*
    // Create the payment transaction with the found path
    const payment: Payment = {
      TransactionType: "Payment",
      Account: senderWallet.address,
      Amount: {
        currency: currencyCodeTCHF,
        value: amountToSend,
        issuer: issuerWalletTCHF.address,
      },
      Destination: recipientWallet.address,
      SendMax: {
        currency: currencyCodeTEUR,
        value: amountToSend,
        issuer: issuerWalletTEUR.address,
      },
      Paths: alternativePaths[0].paths_computed,
    };

    // Sign and submit the payment transaction
    const preparedPayment = await client.autofill(payment);
    const signedPayment = senderWallet.sign(preparedPayment);
    const resultPayment = await client.submitAndWait(signedPayment.tx_blob);
    // console.log("🚀 ~ main ~ resultPayment:", resultPayment);

    if ((resultPayment.result.meta as TransactionMetadataBase).TransactionResult === "tesSUCCESS") {
      console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signedPayment.hash}`);
    } else {
      throw new Error(
        `Error sending transaction: ${(resultPayment.result.meta as TransactionMetadataBase).TransactionResult}`
      );
    }
    */
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.disconnect();
  }
}

main();
