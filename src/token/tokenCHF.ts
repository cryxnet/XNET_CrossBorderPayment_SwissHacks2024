import { Client, Wallet, TrustSet, Payment } from "xrpl";
import { createClient, createAndConfigureWallet, createTrustLine, createPayment } from "./lib/functions";

const currencyCode = "5443484600000000000000000000000000000000";
const issueQuantity = "3500000";

/*
// Hot wallet for TCHF Token
const hodlwallet = {
  address: "rKAbUWsuyDZNDCvuWUSK9aJoM72ZSwiZaZ",
  publicKey: "ED3ACC496CCB1C8597F318C7D1AC3193B0B8671CA07A685368B6E26DC7854C004D",
  privateKey: "ED59B039BF8241F672A317A06EF86BE3EC2541A48194B6554ADBF7D8A07C80C760",
  seed: "sEdVmMZbfWrsrN65z8ceje2a6WTLiEK",
};

// Cold wallet for TCHF Token
const issuerwallet = {
  address: "rsGGhyfhzf2KtJRPCmCxG8KgVnTTYeD5aL",
  publicKey: "ED14E41A48FB2BC979115ADB43F1DDF87D594FBBEB13097B451CE208576D6F7318",
  privateKey: "ED59B039BF8241F672A317A06EF86BE3EC2541A48194B6554ADBF7D8A07C80C760",
  seed: "sEdThAX8fKLdugBsaux8Dwwe1FRQVMb",
};
*/

async function main() {
  const client = await createClient();

  if (!client) {
    throw new Error("Client could not be created.");
  }

  try {
    const hodlWallet = await createAndConfigureWallet(client, "sEdVmMZbfWrsrN65z8ceje2a6WTLiEK");
    const issuerWallet = await createAndConfigureWallet(client, "sEdThAX8fKLdugBsaux8Dwwe1FRQVMb");

    await createTrustLine(client, hodlWallet, {
      TransactionType: "TrustSet",
      Account: hodlWallet.address,
      LimitAmount: {
        currency: currencyCode,
        issuer: issuerWallet.address,
        value: "10000000000", // Large limit, arbitrarily chosen
      },
    });
    await createPayment(client, issuerWallet, hodlWallet.address, issueQuantity, currencyCode);

    console.log("Token issuance completed successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.disconnect();
  }
}

main();
