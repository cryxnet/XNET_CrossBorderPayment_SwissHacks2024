import * as bs58 from "bs58";
import {
  Client,
  AccountSetTfFlags,
  AccountSetAsfFlags,
  AccountSet,
  TransactionMetadataBase,
  Wallet,
  TrustSet,
  Payment,
} from "xrpl";

/**
 *
 * only use one wallet for one token at the time
 * run the first time with out any wallet then copy the seed and private key and public key into the respective wallet
 */

// Hot wallet for TEURO Token
const HotWallet = {
  address: "",
  publicKey: "",
  privateKey: "",
  seed: "",
};

// Cold wallet for TEURO Token
const ColdWallet = {
  address: "",
  publicKey: "",
  privateKey: "",
  seed: "",
};

/*
// Hot wallet for TCHF Token
const HotWallet = {
  address: "rKAbUWsuyDZNDCvuWUSK9aJoM72ZSwiZaZ",
  publicKey: "ED3ACC496CCB1C8597F318C7D1AC3193B0B8671CA07A685368B6E26DC7854C004D",
  privateKey: "ED59B039BF8241F672A317A06EF86BE3EC2541A48194B6554ADBF7D8A07C80C760",
  seed: "sEdVmMZbfWrsrN65z8ceje2a6WTLiEK",
};

// Cold wallet for TCHF Token
const ColdWallet = {
  address: "rsGGhyfhzf2KtJRPCmCxG8KgVnTTYeD5aL",
  publicKey: "ED14E41A48FB2BC979115ADB43F1DDF87D594FBBEB13097B451CE208576D6F7318",
  privateKey: "ED59B039BF8241F672A317A06EF86BE3EC2541A48194B6554ADBF7D8A07C80C760",
  seed: "sEdThAX8fKLdugBsaux8Dwwe1FRQVMb",
};
*/

// TCHF
//5443484600000000000000000000000000000000

// TEUR
//5445555200000000000000000000000000000000

/**
 *
 * make sure to use the correct currency code with the corresponding token
 */

// currency token
const currency_code = "5445555200000000000000000000000000000000";
let issue_quantity = "1000000";

async function createClient() {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  console.log("Connecting to Testnet...");
  await client.connect();
  return client;
}

async function createWallet(client: Client) {
  console.log("Requesting address from the Testnet faucet...");
  return (await client.fundWallet()).wallet;
}

async function configureWallet(client: Client, wallet: Wallet, settings: AccountSet | TrustSet) {
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

async function createTrustLine(client: Client, wallet: Wallet, settings: TrustSet) {
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

async function createPayment(client: Client, wallet: Wallet, settings: Payment) {
  const prepared = await client.autofill(settings);
  const signed = wallet.sign(prepared);
  console.log(`Cold to hot - Sending ${issue_quantity} ${currency_code} to ${settings.Destination}...`);
  const result = await client.submitAndWait(signed.tx_blob);
  if ((result.result.meta as TransactionMetadataBase).TransactionResult === "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.hash}`);
  } else {
    throw new Error(`Error sending transaction: ${result.result.meta as TransactionMetadataBase}`);
  }
}

function hexToBase58(hexString: string): string {
  const hexBuffer = Buffer.from(hexString, "hex");
  return bs58.default.encode(hexBuffer);
}

async function main() {
  let hot_wallet: Wallet;
  let cold_wallet: Wallet;
  const client = await createClient();
  try {
    if (HotWallet?.privateKey || ColdWallet?.privateKey) {
      console.log("get wallet from private key");
      hot_wallet = Wallet.fromSecret(HotWallet.seed);
      console.log("🚀 ~ main ~ hot_wallet:", hot_wallet);
      cold_wallet = Wallet.fromSecret(ColdWallet.seed);
      console.log("🚀 ~ main ~ cold_wallet:", cold_wallet);
    } else {
      hot_wallet = await createWallet(client);
      cold_wallet = await createWallet(client);

      console.log("wallet created");
      console.log(`Hot wallet address: ${hot_wallet.address}`);
      console.log(`Hot wallet public key: ${hot_wallet.publicKey}`);
      console.log(`Hot wallet privat key: ${cold_wallet.privateKey}`);
      console.log(`Hot wallet seed: ${hot_wallet.seed}`);

      console.log(`Cold wallet address: ${cold_wallet.address}`);
      console.log(`Cold wallet public key: ${cold_wallet.publicKey}`);
      console.log(`Cold wallet privat key: ${cold_wallet.privateKey}`);
      console.log(`Cold wallet seed: ${cold_wallet.seed}`);

      await configureWallet(client, cold_wallet, {
        TransactionType: "AccountSet",
        Account: cold_wallet.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D", // "example.com"
        SetFlag: AccountSetAsfFlags.asfDefaultRipple,
        Flags: AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag,
      });

      await configureWallet(client, hot_wallet, {
        TransactionType: "AccountSet",
        Account: hot_wallet.address,
        Domain: "6578616D706C652E636F6D", // "example.com"
        SetFlag: AccountSetAsfFlags.asfRequireAuth,
        Flags: AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag,
      });

      //create trust line from hot wallet to cold wallet
      await createTrustLine(client, hot_wallet, {
        TransactionType: "TrustSet",
        Account: hot_wallet.address,
        LimitAmount: {
          currency: currency_code,
          issuer: cold_wallet.address,
          value: "10000000000", // Large limit, arbitrarily chosen
        },
      });

      console.log("Trust line created");
    }

    // Send token ----------------------------------------------------------------

    await createPayment(client, cold_wallet, {
      TransactionType: "Payment",
      Account: cold_wallet.address,
      Amount: {
        currency: currency_code,
        value: issue_quantity,
        issuer: cold_wallet.address,
      },
      Destination: hot_wallet.address,
      DestinationTag: 1, // Needed since we enabled Require Destination Tags
      // on the hot account earlier.
    });

    console.log("try send token");

    const hot_balances = await client.request({
      command: "account_lines",
      account: hot_wallet.address,
      ledger_index: "validated",
    });
    console.log(hot_balances.result);
    client.disconnect();
  } catch (error) {
    console.error(": ", error);
  } finally {
    client.disconnect();
  }
}

main();