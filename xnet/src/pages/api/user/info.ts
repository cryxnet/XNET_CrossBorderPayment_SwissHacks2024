// pages/api/getWalletAssetsByAddress.js
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'xrpl';

async function createClient() {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  console.log("Connecting to Testnet...");
  await client.connect();
  return client;
}

const getWalletAssetsByAddress = async (walletAddress) => {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: "walletAddress query parameter is required" });
  }

  try {
    const accountInfo = await getWalletAssetsByAddress(walletAddress);
    res.status(200).json(accountInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
