//send tokens from hot wallet to customer wallet
import { writeFile } from "fs/promises";

import { AccountSetAsfFlags, AccountSetTfFlags, Client, Wallet } from "xrpl";
import {
  createWallet,
  createClient,
  configureWallet,
  createTrustLine,
  createPayment,
  getBalance,
  createConfigFile,
} from "./lib/functions";

/*
TCHF

// Cold wallet for TCHF Token
//chf 5443484600000000000000000000000000000000
const ColdWallet = {
  address: "rsGGhyfhzf2KtJRPCmCxG8KgVnTTYeD5aL",
  publicKey: "ED14E41A48FB2BC979115ADB43F1DDF87D594FBBEB13097B451CE208576D6F7318",
  privateKey: "ED59B039BF8241F672A317A06EF86BE3EC2541A48194B6554ADBF7D8A07C80C760",
  seed: "sEdThAX8fKLdugBsaux8Dwwe1FRQVMb",
};


*/
//

const issuerTCHF = {
  address: "rsGGhyfhzf2KtJRPCmCxG8KgVnTTYeD5aL",
  publicKey: "ED14E41A48FB2BC979115ADB43F1DDF87D594FBBEB13097B451CE208576D6F7318",
  privateKey: "ED59B039BF8241F672A317A06EF86BE3EC2541A48194B6554ADBF7D8A07C80C760",
  seed: "sEdThAX8fKLdugBsaux8Dwwe1FRQVMb",
};

const issuerTEURO = {};

const createCustomerWallet = async (client: Client) => {
  console.log("Creating wallet...");
  const customerWallet = await createWallet(client);
  console.log("wallet created");
  console.log(`customer wallet address: ${customerWallet.address}`);
  console.log(`customer wallet public key: ${customerWallet.publicKey}`);
  console.log(`customer wallet privat key: ${customerWallet.privateKey}`);
  console.log(`customer wallet seed: ${customerWallet.seed}`);

  await configureWallet(client, customerWallet, {
    TransactionType: "AccountSet",
    Account: customerWallet.address,
    TransferRate: 0,
    TickSize: 5,
    Domain: "6578616D706C652E636F6D", // "example.com"
    SetFlag: AccountSetAsfFlags.asfDefaultRipple,
    Flags: AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag,
  });

  return customerWallet;
};

const hodlWalletToCustomer = async (
  client: Client,
  customerWallet: Wallet,
  issuerWallet: Wallet,
  issue_quantity: string,
  currency_code: string
) => {
  await createTrustLine(client, customerWallet, {
    TransactionType: "TrustSet",
    Account: customerWallet.address,
    LimitAmount: {
      currency: currency_code,
      issuer: issuerWallet.address,
      value: "10000",
    },
  });

  await createPayment(client, issuerWallet, {
    TransactionType: "Payment",
    Account: issuerWallet.address,
    Amount: {
      currency: currency_code,
      value: issue_quantity,
      issuer: issuerWallet.address,
    },
    Destination: customerWallet.address,
    DestinationTag: 1, // Needed since we enabled Require Destination Tags
    // on the hot account earlier.
  });

  console.log("try send token");
};

async function main() {
  const client = await createClient();

  //   const customerWallet = await createCustomerWallet(client);
  const customerWallet = Wallet.fromSeed("sEdTrx6kK7b8SghC9SYUcW7mwsufouZ");
  const issuerWallet = await Wallet.fromSecret(issuerTCHF.seed);

  //   await createConfigFile(
  //     {
  //       customerWallet: {
  //         address: customerWallet.address,
  //         publicKey: customerWallet.publicKey,
  //         privateKey: customerWallet.privateKey,
  //         seed: customerWallet.seed || "",
  //       },
  //       issuerWallet: {
  //         address: issuerWallet.address,
  //         publicKey: issuerWallet.publicKey,
  //         privateKey: issuerWallet.privateKey,
  //         seed: issuerWallet.seed || "",
  //       },
  //     },
  //     "customerTokens.json"
  //   );

  await hodlWalletToCustomer(client, customerWallet, issuerWallet, "499", "5443484600000000000000000000000000000000");

  const issuerBalance = await getBalance(client, issuerWallet);
  console.log("🚀 ~ main ~ issuerBalance:", issuerBalance.result);
  const customerBalance = await getBalance(client, customerWallet);
  console.log("🚀 ~ main ~ customerBalance:", customerBalance.result);

  console.log("get balance");

  client.disconnect();

  //   hodlWalletToCustomer(client, "5443484600000000000000000000000000000000", "rsGGhyfhzf2KtJRPCmCxG8KgVnTTYeD5aL");
}

main();
