import {
  Client,
  AccountSetTfFlags,
  AccountSetAsfFlags,
  AccountSet,
  TransactionMetadataBase,
  Wallet,
  TrustSet,
  Payment,
  Amount,
  PathFindCreateRequest,
  IssuedCurrencyAmount,
  PathFindPathOption,
  RipplePathFindRequest,
  RipplePathFindPathOption,
} from "xrpl";
import { writeFile, readFile, access } from "fs/promises";

interface WalletData {
  customerWallet: {
    address: string;
    publicKey: string;
    privateKey: string;
    seed: string;
  };
  issuerWallet: {
    address: string;
    publicKey: string;
    privateKey: string;
    seed: string;
  };
}

/**
 *  @file       functions.ts
 * @brief      Functions for creating and sending transactions
 *
 * @param client
 * @param wallet
 * @param currency_code
 * @param issue_quantity
 * @param settings
 */

/*
export async function createPayment(client: Client, wallet: Wallet, settings: Payment) {
  const prepared = await client.autofill(settings);
  const signed = wallet.sign(prepared);
  console.log(
    `Cold to hot - Sending ${(settings.Amount as IssuedCurrencyAmount)?.value} ${
      (settings.Amount as IssuedCurrencyAmount).currency
    } to ${settings.Destination}...`
  );
  const result = await client.submitAndWait(signed.tx_blob);
  if ((result.result.meta as TransactionMetadataBase).TransactionResult === "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`);
  } else {
    throw new Error(`Error sending transaction: ${result.result.meta as TransactionMetadataBase}`);
  }
}
*/

export async function createPayment(
  client: Client,
  fromWallet: Wallet,
  toAddress: string,
  amount: string,
  currencyCode: string
) {
  const settings: Payment = {
    TransactionType: "Payment",
    Account: fromWallet.address,
    Amount: {
      currency: currencyCode,
      value: amount,
      issuer: fromWallet.address,
    },
    Destination: toAddress,
    DestinationTag: 1,
  };
  const prepared = await client.autofill(settings);
  const signed = fromWallet.sign(prepared);
  const submitSigned = await client.submitAndWait(signed.tx_blob);
  console.log(`Payment of ${amount} ${currencyCode} sent to ${toAddress}`);
  if ((submitSigned.result.meta as TransactionMetadataBase).TransactionResult === "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`);
  } else {
    throw new Error(
      `Error sending transaction: ${(submitSigned.result.meta as TransactionMetadataBase).TransactionResult}`
    );
  }
}

/**
 *
 *
 * @param client
 * @param wallet
 * @param settings
 */

export async function createTrustLine(client: Client, wallet: Wallet, settings: TrustSet) {
  const prepared = await client.autofill(settings);
  const signed = wallet.sign(prepared);
  console.log("Creating trust line from hot address to issuer...");
  const result = await client.submitAndWait(signed.tx_blob);
  if ((result.result.meta as TransactionMetadataBase).TransactionResult === "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`);
  } else {
    throw new Error(`Error sending transaction: ${result.result.meta as TransactionMetadataBase}`);
  }
}
/*
export async function createWallet(client: Client) {
  console.log("Requesting address from the Testnet faucet...");
  return (await client.fundWallet()).wallet;
}

export async function configureWallet(client: Client, wallet: Wallet, settings: AccountSet | TrustSet) {
  const prepared = await client.autofill(settings);
  const signed = wallet.sign(prepared);
  console.log(`Sending ${settings.Account} AccountSet transaction...`);
  const result = await client.submitAndWait(signed.tx_blob);
  if ((result.result.meta as TransactionMetadataBase).TransactionResult === "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`);
  } else {
    throw new Error(`Error sending transaction: ${result.result.meta as TransactionMetadataBase}`);
  }
}
*/

export async function createAndConfigureWallet(client: Client, seed?: string) {
  const wallet = seed ? Wallet.fromSecret(seed) : (await client.fundWallet()).wallet;
  await client.autofill({
    TransactionType: "AccountSet",
    Account: wallet.address,
    SetFlag: 1, // Example flag, adjust as needed
  });
  return wallet;
}

export async function createClient() {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  console.log("Connecting to Testnet...");
  await client.connect();
  return client;
}

export async function getBalance(client: Client, wallet: Wallet) {
  return await client.request({
    command: "account_lines",
    account: wallet.address,
    ledger_index: "validated",
  });
}

export async function createConfigFile(walletData: WalletData, filePath: string): Promise<void> {
  const dataString = JSON.stringify(walletData, null, 2); // Pretty print JSON
  await writeFile(filePath, dataString, "utf8");
}

export async function readConfigFile(
  filePath: string
): Promise<{ customerWallet: Wallet; issuerWallet: Wallet } | null> {
  // Check if file exists
  try {
    await access(filePath);
  } catch (error) {
    return null;
  }

  const dataString = await readFile(filePath, "utf8");
  const data: WalletData = JSON.parse(dataString);
  // Assuming the Wallet class has a method to create a wallet instance from the provided keys or secret
  const customerWallet = new Wallet(data.customerWallet.publicKey, data.customerWallet.privateKey);
  const issuerWallet = Wallet.fromSecret(data.issuerWallet.seed);
  return { customerWallet, issuerWallet };
}
