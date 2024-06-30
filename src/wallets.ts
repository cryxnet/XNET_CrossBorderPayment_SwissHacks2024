import { get } from "http";
import { Client } from "xrpl";

const BOB_WALLET_ADDRESS = "rDBg1qLgTFaYQ8R5U9bh8QXLv7ErFgWXz2";
const BOB_WALLET_SECRET = "sEdTrx6kK7b8SghC9SYUcW7mwsufouZ";

const STEF_WALLET_ADDRESS = "rBeBTBDwmvsSnAJPV4y26FJBSPaEH8Qv15";
const STEF_WALLET_SECRET = "sEd7pjRtgXyEqRXCVLzPs3wtk4oRCyX";

async function createClient() {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  console.log("Connecting to Testnet...");
  await client.connect();
  return client;
}

/**
 *
 * @param walletAddress
 */
const getWalletAssetsByAddress = async (walletAddress: string) => {
  const client = await createClient();

  try {
    // Retrieve account info
    const accountInfo = await client.request({
      command: "account_info",
      account: walletAddress,
      ledger_index: "validated",
    });
    console.log("🚀 ~ getWalletAssetsByAddress ~ accountInfo:", accountInfo);
    return accountInfo;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    client.disconnect();
  }
};

const getWalletTransactionsByAddress = async (walletAddress: string) => {
  const client = await createClient();

  try {
    const transactions = await client.request({
      command: "account_tx",
      account: walletAddress,
      ledger_index_min: -1,
      ledger_index_max: -1,
      binary: false,
      limit: 10,
    });
    console.log("🚀 ~ getWalletTransactionsByAddress ~ transactions:", transactions);
    return transactions;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    client.disconnect();
  }
};
