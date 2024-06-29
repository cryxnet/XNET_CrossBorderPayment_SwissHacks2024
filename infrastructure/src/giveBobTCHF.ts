import { Client, Wallet, Payment } from 'xrpl';
import {
  TCHF_CURRENCY_CODE,
  TCHF_DISTRIBUTOR_WALLET_ADDRESS,
  TCHF_DISTRIBUTOR_WALLET_SEED,
  TCHF_ISSUER_WALLET_ADDRESS,
} from './tokens';
import { bobWallet } from './wallets';

// Connect to the XRPL Testnet
const client = new Client('wss://s.altnet.rippletest.net:51233');

async function sendTCHFtoBob() {
  await client.connect();

  const distributorWallet = Wallet.fromSeed(TCHF_DISTRIBUTOR_WALLET_SEED);
  const recipientAddress = bobWallet.address; // Bob's wallet address

  try {
    // Send 10 TCHF to Bob
    const paymentTCHFtoBob: Payment = {
      TransactionType: 'Payment',
      Account: distributorWallet.address,
      Destination: recipientAddress,
      Amount: {
        currency: TCHF_CURRENCY_CODE,
        value: '10',
        issuer: TCHF_ISSUER_WALLET_ADDRESS,
      },
      Flags: 2147483648, // tfUniversal
    };

    const paymentResponse = await client.submitAndWait(paymentTCHFtoBob, {
      wallet: distributorWallet,
      autofill: true,
      failHard: true,
    });

    if (paymentResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Failed to send TCHF to Bob: ${paymentResponse.result.meta.TransactionResult}`);
    }

    console.log('Send TCHF to Bob successful:', paymentResponse);
    console.log(`Transaction link: https://testnet.xrpl.org/transactions/${paymentResponse.result.hash}`);

  } catch (error) {
    console.error('Error in sending TCHF to Bob:', error);
  } finally {
    await client.disconnect();
  }
}

sendTCHFtoBob().catch(console.error);
