import { Client, Wallet, Payment, TrustSet } from 'xrpl';
import {
  TCHF_CURRENCY_CODE,
  TCHF_DISTRIBUTOR_WALLET_SEED,
  TCHF_ISSUER_WALLET_ADDRESS
} from './tokens';
import { bobWallet } from './wallets';

// Connect to the XRPL Testnet
const client = new Client('wss://s.altnet.rippletest.net:51233');

async function setupTrustLine() {
  await client.connect();

  try {
    const trustSet: TrustSet = {
      TransactionType: 'TrustSet',
      Account: bobWallet.address,
      LimitAmount: {
        currency: TCHF_CURRENCY_CODE,
        issuer: TCHF_ISSUER_WALLET_ADDRESS,
        value: '1000000', // Set an appropriate limit
      },
      Flags: 131072, // tfSetNoRipple
    };

    const trustSetResponse = await client.submitAndWait(trustSet, {
      wallet: bobWallet,
      autofill: true,
      failHard: true,
    });

    if (trustSetResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Failed to set trust line for TCHF: ${trustSetResponse.result.meta.TransactionResult}`);
    }

    console.log('Trust line setup successful:', trustSetResponse);
    console.log(`Transaction link: https://testnet.xrpl.org/transactions/${trustSetResponse.result.hash}`);

  } catch (error) {
    console.error('Error in setting up trust line:', error);
  } finally {
    await client.disconnect();
  }
}

async function sendTCHFtoBob() {
  await client.connect();

  const distributorWallet = Wallet.fromSeed(TCHF_DISTRIBUTOR_WALLET_SEED); // Use the correct SEED for the distributor wallet
  const recipientAddress = bobWallet.address; // Bob's wallet address

  try {
    // Send 10 TCHF to Bob
    const paymentTCHFtoBob: Payment = {
      TransactionType: 'Payment',
      Account: distributorWallet.address,
      Destination: recipientAddress,
      Amount: {
        currency: TCHF_CURRENCY_CODE,
        value: '100000',
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

async function main() {
  try {
    await setupTrustLine();
    await sendTCHFtoBob();
  } catch (error) {
    console.error('Error in the main function:', error);
  }
}

main().catch(console.error);
