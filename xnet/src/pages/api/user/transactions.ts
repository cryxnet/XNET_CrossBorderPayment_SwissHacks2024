// pages/api/getWalletTransactionsByAddress.js
import { Client } from 'xrpl';
import { NextApiRequest, NextApiResponse } from 'next';

async function createClient() {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  console.log("Connecting to Testnet...");
  await client.connect();
  return client;
}

const getWalletTransactionsByAddress = async (walletAddress) => {
  const client = await createClient();

  try {
    const transactions = await client.request({
      command: "account_tx",
      account: walletAddress,
      ledger_index_min: -1,
      ledger_index_max: -1,
      binary: false,
    });
    console.log("🚀 ~ getWalletTransactionsByAddress ~ transactions:", transactions);
    return transactions;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    client.disconnect();
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: "walletAddress query parameter is required" });
  }

  try {
    const transactions = await getWalletTransactionsByAddress(walletAddress);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
