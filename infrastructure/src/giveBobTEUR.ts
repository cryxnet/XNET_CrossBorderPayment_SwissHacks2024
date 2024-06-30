import { Client, Wallet, Payment } from 'xrpl';
import {
  TEUR_CURRENCY_CODE,
  TEUR_DISTRIBUTOR_WALLET_SEED,
  TEUR_ISSUER_WALLET_ADDRESS
} from './tokens';
import { bobWallet } from './wallets';

// Connect to the XRPL Testnet
const client = new Client('wss://s.altnet.rippletest.net:51233');

async function sendTEURtoBob() {
  await client.connect();

  const distributorWallet = Wallet.fromSeed(TEUR_DISTRIBUTOR_WALLET_SEED); // Use the correct SEED for the TEUR distributor wallet
  const recipientAddress = bobWallet.address; // Bob's wallet address

  try {
    // Send 10 TEUR to Bob
    const paymentTEURtoBob: Payment = {
      TransactionType: 'Payment',
      Account: distributorWallet.address,
      Destination: recipientAddress,
      Amount: {
        currency: TEUR_CURRENCY_CODE, // Ensure this is TEUR
        value: '10',
        issuer: TEUR_ISSUER_WALLET_ADDRESS,
      },
    };

    const paymentResponse = await client.submitAndWait(paymentTEURtoBob, {
      wallet: distributorWallet,
      autofill: true,
      failHard: true,
    });

    if (paymentResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Failed to send TEUR to Bob: ${paymentResponse.result.meta.TransactionResult}`);
    }

    console.log('Send TEUR to Bob successful:', paymentResponse);
    console.log(`Transaction link: https://testnet.xrpl.org/transactions/${paymentResponse.result.hash}`);

  } catch (error) {
    console.error('Error in sending TEUR to Bob:', error);
  } finally {
    await client.disconnect();
  }
}

sendTEURtoBob().catch(console.error);
